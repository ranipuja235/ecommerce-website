"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const router = express_1.default.Router();
// Public routes
router.get('/', product_controller_1.getProducts);
router.get('/categories', product_controller_1.getCategories);
router.get('/:id', product_controller_1.getProductById);
// Admin routes
router.post('/', auth_middleware_1.verifyToken, admin_middleware_1.requireAdmin, product_controller_1.createProduct);
router.put('/:id', auth_middleware_1.verifyToken, admin_middleware_1.requireAdmin, product_controller_1.updateProduct);
router.delete('/:id', auth_middleware_1.verifyToken, admin_middleware_1.requireAdmin, product_controller_1.deleteProduct);
// Authenticated user routes
router.post('/:id/reviews', auth_middleware_1.verifyToken, product_controller_1.createProductReview);
exports.default = router;
//# sourceMappingURL=product.routes.js.map