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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuth = exports.resetPassword = exports.forgotPassword = exports.removeAddress = exports.updateAddress = exports.addAddress = exports.updateProfile = exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const User_model_1 = require("../models/User.model");
const asyncHandler_1 = require("../utils/asyncHandler");
const email_1 = require("../utils/email");
const google_auth_library_1 = require("google-auth-library");
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// Helper to generate JWT
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d'),
    });
};
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const userExists = yield User_model_1.User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const user = yield User_model_1.User.create({
        name,
        email,
        password,
    });
    if (user) {
        const token = generateToken(String(user._id));
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }
}));
// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Explicitly select password since it has select: false in schema
    const user = yield User_model_1.User.findOne({ email }).select('+password');
    if (user && (yield user.comparePassword(password))) {
        const token = generateToken(String(user._id));
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        });
    }
    else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
}));
// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield User_model_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    if (user) {
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                wishlist: user.wishlist,
                addresses: user.addresses,
            },
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
}));
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield User_model_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.avatar = req.body.avatar || user.avatar;
        if (req.body.email) {
            user.email = req.body.email;
        }
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = yield user.save();
        res.json({
            success: true,
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
                addresses: updatedUser.addresses,
            },
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
}));
// @desc    Add a new address
// @route   POST /api/auth/addresses
// @access  Private
exports.addAddress = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield User_model_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    if (user) {
        const newAddress = {
            type: req.body.type,
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            postalCode: req.body.postalCode,
            country: req.body.country,
            isDefault: req.body.isDefault || false,
        };
        if (newAddress.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }
        user.addresses.push(newAddress);
        yield user.save();
        res.status(201).json({
            success: true,
            addresses: user.addresses,
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
}));
// @desc    Update an address
// @route   PUT /api/auth/addresses/:id
// @access  Private
exports.updateAddress = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield User_model_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    if (user) {
        const addressId = req.params.id;
        // Mongoose array id search
        const address = user.addresses.id(addressId);
        if (!address) {
            res.status(404);
            throw new Error('Address not found');
        }
        address.type = req.body.type || address.type;
        address.street = req.body.street || address.street;
        address.city = req.body.city || address.city;
        address.state = req.body.state || address.state;
        address.postalCode = req.body.postalCode || address.postalCode;
        address.country = req.body.country || address.country;
        if (req.body.isDefault !== undefined) {
            address.isDefault = req.body.isDefault;
            if (address.isDefault) {
                user.addresses.forEach(addr => {
                    var _a;
                    if (((_a = addr._id) === null || _a === void 0 ? void 0 : _a.toString()) !== addressId) {
                        addr.isDefault = false;
                    }
                });
            }
        }
        yield user.save();
        res.json({
            success: true,
            addresses: user.addresses,
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
}));
// @desc    Delete an address
// @route   DELETE /api/auth/addresses/:id
// @access  Private
exports.removeAddress = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield User_model_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    if (user) {
        user.addresses.pull({ _id: req.params.id });
        yield user.save();
        res.json({
            success: true,
            addresses: user.addresses,
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
}));
// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_model_1.User.findOne({ email: req.body.email });
    if (!user) {
        res.status(404);
        throw new Error('There is no user with that email');
    }
    // Generate a random reset token
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto_1.default
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    // Set expire time to 10 minutes
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
    yield user.save();
    // Create reset url
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = `
    <h2>You requested a password reset</h2>
    <p>Please click on the link below to reset your password:</p>
    <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
    <p>This link is valid for 10 minutes.</p>
  `;
    try {
        yield (0, email_1.sendEmail)({
            to: user.email,
            subject: 'Password Reset Request',
            html: message,
        });
        res.status(200).json({ success: true, message: 'Email sent' });
    }
    catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        yield user.save();
        res.status(500);
        throw new Error('Email could not be sent');
    }
}));
// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get hashed token
    const resetPasswordToken = crypto_1.default
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = yield User_model_1.User.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired token');
    }
    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    yield user.save();
    res.status(200).json({
        success: true,
        message: 'Password reset successful. Please login.',
    });
}));
// @desc    Google Sign In
// @route   POST /api/auth/google
// @access  Public
exports.googleAuth = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { credential } = req.body;
    if (!credential) {
        res.status(400);
        throw new Error('Google credential is required');
    }
    const ticket = yield googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.name) {
        res.status(400);
        throw new Error('Invalid Google credential');
    }
    const { email, name, picture } = payload;
    let user = yield User_model_1.User.findOne({ email });
    if (!user) {
        // Register new user
        // Generate a secure random password since they use Google to sign in
        const randomPassword = crypto_1.default.randomBytes(20).toString('hex');
        user = yield User_model_1.User.create({
            name,
            email,
            password: randomPassword,
            avatar: picture,
        });
    }
    const token = generateToken(String(user._id));
    res.json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar || picture,
            wishlist: user.wishlist,
            addresses: user.addresses,
        },
    });
}));
//# sourceMappingURL=auth.controller.js.map