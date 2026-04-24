"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.verifyToken, order_controller_1.createOrder);
router.get('/', auth_middleware_1.verifyToken, admin_middleware_1.requireAdmin, order_controller_1.getOrders);
router.get('/my', auth_middleware_1.verifyToken, order_controller_1.getMyOrders);
router.get('/:id', auth_middleware_1.verifyToken, order_controller_1.getOrderById);
router.put('/:id/pay', auth_middleware_1.verifyToken, order_controller_1.updateOrderToPaid);
router.put('/:id/status', auth_middleware_1.verifyToken, admin_middleware_1.requireAdmin, order_controller_1.updateOrderStatus);
exports.default = router;
//# sourceMappingURL=order.routes.js.map