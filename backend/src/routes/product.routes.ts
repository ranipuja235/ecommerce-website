import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getCategories,
} from '../controllers/product.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Admin routes
router.post('/', verifyToken as any, requireAdmin as any, createProduct);
router.put('/:id', verifyToken as any, requireAdmin as any, updateProduct);
router.delete('/:id', verifyToken as any, requireAdmin as any, deleteProduct);

// Authenticated user routes
router.post('/:id/reviews', verifyToken as any, createProductReview);

export default router;
