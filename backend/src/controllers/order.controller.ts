import { Request, Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { Order } from '../models/Order.model';
import { Product } from '../models/Product.model';
import { User } from '../models/User.model';
import { asyncHandler } from '../utils/asyncHandler';
import { sendEmail } from '../utils/email';
import { AuthRequest } from '../middleware/auth.middleware';

// Instantiate Razorpay
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
  });
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Verify stock and deduct
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.name}`);
    }
    if (product.stock < item.qty) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }
  }

  // Deduct stock (atomic)
  for (const item of orderItems) {
    await Product.findOneAndUpdate(
      { _id: item.product, stock: { $gte: item.qty } },
      { $inc: { stock: -item.qty } }
    );
  }

  // Create Razorpay order
  let razorpayOrderId = '';
  if (paymentMethod === 'razorpay') {
    const rzp = getRazorpayInstance();
    const options = {
      amount: Math.round(totalPrice * 100), // amount in the smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    try {
      const rzpOrder = await rzp.orders.create(options);
      razorpayOrderId = rzpOrder.id;
    } catch (error) {
      res.status(500);
      throw new Error('Could not create Razorpay order');
    }
  }

  const order = new Order({
    orderItems,
    user: req.user!._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentResult: {
      razorpay_order_id: razorpayOrderId,
      status: 'created',
    },
  });

  const createdOrder = await order.save();

  res.status(201).json({
    success: true,
    order: createdOrder,
    razorpayOrderId,
  });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const orders = await Order.find({ user: req.user!._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    // Check if the user is admin or the order belongs to the user
    if (
      req.user!.role === 'admin' ||
      String(order.user._id) === String(req.user!._id)
    ) {
      res.json({ success: true, order });
    } else {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // Verify signature
  const secret = process.env.RAZORPAY_KEY_SECRET || '';
  const generated_signature = crypto
    .createHmac('sha256', secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature !== razorpay_signature) {
    res.status(400);
    throw new Error('Payment verification failed');
  }

  order.isPaid = true;
  order.paidAt = new Date();
  order.orderStatus = 'Processing';
  
  if (order.paymentResult) {
    order.paymentResult.razorpay_payment_id = razorpay_payment_id;
    order.paymentResult.razorpay_signature = razorpay_signature;
    order.paymentResult.status = 'paid';
  } else {
    order.paymentResult = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      status: 'paid'
    };
  }

  const updatedOrder = await order.save();

  // Send confirmation email
  const user = order.user as any; // populated
  const message = `
    <h2>Order Confirmation - ${order._id}</h2>
    <p>Dear ${user.name},</p>
    <p>Thank you for your purchase! Your payment has been successfully processed.</p>
    <p>Order Total: $${order.totalPrice}</p>
    <p>We will notify you once your order has been shipped.</p>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: `Order Confirmation - LUXE`,
      html: message,
    });
  } catch (error) {
    console.error('Email sending failed', error);
  }

  res.json({ success: true, order: updatedOrder });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const { status, startDate, endDate, page = '1', limit = '10' } = req.query;

  const query: any = {};

  if (status) query.orderStatus = status;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate as string);
    if (endDate) query.createdAt.$lte = new Date(endDate as string);
  }

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'id name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber);

  res.json({
    success: true,
    orders,
    total,
    page: pageNumber,
    pages: Math.ceil(total / limitNumber),
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.orderStatus = status;

  if (status === 'Delivered') {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }

  const updatedOrder = await order.save();

  // Send status update email
  const user = order.user as any;
  const message = `
    <h2>Order Status Update - ${order._id}</h2>
    <p>Dear ${user.name},</p>
    <p>Your order status has been updated to: <strong>${status}</strong></p>
    ${status === 'Shipped' ? '<p>Your items are on the way!</p>' : ''}
    ${status === 'Delivered' ? '<p>Your items have been delivered. Enjoy!</p>' : ''}
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: `Order Update - LUXE`,
      html: message,
    });
  } catch (error) {
    console.error('Email sending failed', error);
  }

  res.json({ success: true, order: updatedOrder });
});
