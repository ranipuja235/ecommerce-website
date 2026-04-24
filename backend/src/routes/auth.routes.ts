import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import {
  register,
  login,
  getMe,
  updateProfile,
  addAddress,
  updateAddress,
  removeAddress,
  forgotPassword,
  resetPassword,
  googleAuth,
} from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = express.Router();

// Validation middleware
const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({
      success: false,
      message: errorMessages,
    });
  }
  next();
};

router.post(
  '/register',
  [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 }),
  ],
  validate,
  register
);

router.post('/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  validate,
  login
);

router.post('/google', googleAuth);

router.get('/me', verifyToken as any, getMe);

router.put('/profile', verifyToken as any, updateProfile);

router.post('/addresses', verifyToken as any, addAddress);
router.put('/addresses/:id', verifyToken as any, updateAddress);
router.delete('/addresses/:id', verifyToken as any, removeAddress);

router.post(
  '/forgot-password',
  [body('email', 'Please include a valid email').isEmail()],
  validate,
  forgotPassword
);

router.post(
  '/reset-password/:token',
  [
    body('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 }),
  ],
  validate,
  resetPassword
);

export default router;
