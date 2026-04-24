"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.createProductReview = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const Product_model_1 = require("../models/Product.model");
const asyncHandler_1 = require("../utils/asyncHandler");
// @desc    Fetch all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, minPrice, maxPrice, rating, featured, search, sort, page = '1', limit = '10', } = req.query;
    const query = {};
    // Filtering
    if (category)
        query.category = category;
    if (featured === 'true')
        query.featured = true;
    if (rating)
        query.rating = { $gte: Number(rating) };
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice)
            query.price.$gte = Number(minPrice);
        if (maxPrice)
            query.price.$lte = Number(maxPrice);
    }
    // Full-text search
    if (search) {
        query.$text = { $search: search };
    }
    // Sorting
    let sortOption = { createdAt: -1 }; // Default: newest
    if (sort === 'price_asc')
        sortOption = { price: 1 };
    else if (sort === 'price_desc')
        sortOption = { price: -1 };
    else if (sort === 'rating')
        sortOption = { rating: -1 };
    else if (sort === 'newest')
        sortOption = { createdAt: -1 };
    // Pagination
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    const total = yield Product_model_1.Product.countDocuments(query);
    const products = yield Product_model_1.Product.find(query)
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
}));
// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product_model_1.Product.findById(req.params.id).populate('reviews.user', 'name avatar');
    if (product) {
        res.json({ success: true, product });
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
}));
// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = new Product_model_1.Product(req.body);
    const createdProduct = yield product.save();
    res.status(201).json({ success: true, product: createdProduct });
}));
// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product_model_1.Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (product) {
        res.json({ success: true, product });
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
}));
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product_model_1.Product.findById(req.params.id);
    if (product) {
        yield product.deleteOne();
        res.json({ success: true, message: 'Product removed' });
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
}));
// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rating, comment } = req.body;
    const product = yield Product_model_1.Product.findById(req.params.id);
    if (product) {
        const alreadyReviewed = product.reviews.find((r) => String(r.user) === String(req.user._id));
        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;
        const updatedProduct = yield product.save();
        res.status(201).json({ success: true, product: updatedProduct });
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
}));
// @desc    Get product categories and counts
// @route   GET /api/products/categories
// @access  Public
exports.getCategories = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield Product_model_1.Product.aggregate([
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
}));
//# sourceMappingURL=product.controller.js.map