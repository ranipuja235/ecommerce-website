import mongoose, { Document, Model } from 'mongoose';
export interface IOrderItem {
    name: string;
    qty: number;
    image: string;
    price: number;
    product: mongoose.Types.ObjectId;
}
export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    orderItems: IOrderItem[];
    shippingAddress: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
    };
    paymentMethod: string;
    paymentResult?: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
        status: string;
    };
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
    orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    isPaid: boolean;
    paidAt?: Date;
    isDelivered: boolean;
    deliveredAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Order: Model<IOrder>;
//# sourceMappingURL=Order.model.d.ts.map