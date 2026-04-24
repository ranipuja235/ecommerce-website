import { Request, Response } from 'express';
import { Product } from '../models/Product.model';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';

// @desc    Fetch all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const {
    category,
    minPrice,
    maxPrice,
    rating,
    featured,
    search,
    sort,
    page = '1',
    limit = '10',
  } = req.query;

  const query: any = {};

  // Filtering
  if (category) query.category = category;
  if (featured === 'true') query.featured = true;
  if (rating) query.rating = { $gte: Number(rating) };

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Full-text search
  if (search) {
    query.$text = { $search: search as string };
  }

  // Sorting
  let sortOption: any = { createdAt: -1 }; // Default: newest
  if (sort === 'price_asc') sortOption = { price: 1 };
  else if (sort === 'price_desc') sortOption = { price: -1 };
  else if (sort === 'rating') sortOption = { rating: -1 };
  else if (sort === 'newest') sortOption = { createdAt: -1 };

  // Pagination
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNumber);

  res.json({
    success: true,
    products,
    total,
    page: pageNumber,
    pages: Math.ceil(total / limitNumber),
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate(
    'reviews.user',
    'name avatar'
  );

  if (product) {
    res.json({ success: true, product });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = new Product(req.body);
  const createdProduct = await product.save();
  res.status(201).json({ success: true, product: createdProduct });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (product) {
    res.json({ success: true, product });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ success: true, message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => String(r.user) === String(req.user!._id)
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user!.name,
      rating: Number(rating),
      comment,
      user: req.user!._id as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    const updatedProduct = await product.save();
    res.status(201).json({ success: true, product: updatedProduct });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get product categories and counts
// @route   GET /api/products/categories
// @access  Public
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        name: '$_id',
        count: 1,
        _id: 0,
      },
    },
    { $sort: { name: 1 } },
  ]);

  res.json({ success: true, categories });
});
