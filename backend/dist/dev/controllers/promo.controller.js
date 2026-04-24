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
exports.validatePromo = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
// @desc    Validate promotional code
// @route   POST /api/promo/validate
// @access  Public
exports.validatePromo = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    if (!code) {
        res.status(400);
        throw new Error('Promo code is required');
    }
    const promoCode = code.toUpperCase();
    if (promoCode === 'LUXE10') {
        return res.json({
            valid: true,
            discountPercent: 10,
            message: '10% discount applied!',
        });
    }
    if (promoCode === 'WELCOME20') {
        return res.json({
            valid: true,
            discountPercent: 20,
            message: '20% welcome discount applied!',
        });
    }
    res.status(400);
    throw new Error('Invalid or expired promo code');
}));
//# sourceMappingURL=promo.controller.js.map