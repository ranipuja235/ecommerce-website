"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Validation middleware
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({
            success: false,
            message: errorMessages,
        });
    }
    next();
};
router.post('/register', [
    (0, express_validator_1.body)('name', 'Name is required').notEmpty(),
    (0, express_validator_1.body)('email', 'Please include a valid email').isEmail(),
    (0, express_validator_1.body)('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 }),
], validate, auth_controller_1.register);
router.post('/login', [
    (0, express_validator_1.body)('email', 'Please include a valid email').isEmail(),
    (0, express_validator_1.body)('password', 'Password is required').exists(),
], validate, auth_controller_1.login);
router.post('/google', auth_controller_1.googleAuth);
router.get('/me', auth_middleware_1.verifyToken, auth_controller_1.getMe);
router.put('/profile', auth_middleware_1.verifyToken, auth_controller_1.updateProfile);
router.post('/addresses', auth_middleware_1.verifyToken, auth_controller_1.addAddress);
router.put('/addresses/:id', auth_middleware_1.verifyToken, auth_controller_1.updateAddress);
router.delete('/addresses/:id', auth_middleware_1.verifyToken, auth_controller_1.removeAddress);
router.post('/forgot-password', [(0, express_validator_1.body)('email', 'Please include a valid email').isEmail()], validate, auth_controller_1.forgotPassword);
router.post('/reset-password/:token', [
    (0, express_validator_1.body)('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 }),
], validate, auth_controller_1.resetPassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map