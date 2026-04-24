import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getOrders,
  updateOrderStatus,
} from '../controllers/order.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = express.Router();

router.post('/', verifyToken as any, createOrder);
router.get('/', verifyToken as any, requireAdmin as any, getOrders);
router.get('/my', verifyToken as any, getMyOrders);
router.get('/:id', verifyToken as any, getOrderById);
router.put('/:id/pay', verifyToken as any, updateOrderToPaid);
router.put('/:id/status', verifyToken as any, requireAdmin as any, updateOrderStatus);

export default router;
