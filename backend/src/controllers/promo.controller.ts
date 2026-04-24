import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';

// @desc    Validate promotional code
// @route   POST /api/promo/validate
// @access  Public
export const validatePromo = asyncHandler(async (req: any, res: Response) => {
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
});
