import express, { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '../utils/cloudinary';
import { verifyToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = express.Router();

// Set up multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.post(
  '/',
  verifyToken as any,
  requireAdmin as any,
  upload.array('images', 5),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No images provided for upload.',
        });
      }

      const uploadPromises = files.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'luxe_products',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result!.secure_url);
            }
          );

          uploadStream.end(file.buffer);
        });
      });

      const imageUrls = await Promise.all(uploadPromises);

      res.status(200).json({
        success: true,
        message: 'Images uploaded successfully',
        data: imageUrls,
      });
    } catch (error: any) {
      console.error('Cloudinary Upload Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload images',
        error: error.message,
      });
    }
  }
);

export default router;
