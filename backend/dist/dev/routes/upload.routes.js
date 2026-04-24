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
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const router = express_1.default.Router();
// Set up multer with memory storage
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
router.post('/', auth_middleware_1.verifyToken, admin_middleware_1.requireAdmin, upload.array('images', 5), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No images provided for upload.',
            });
        }
        const uploadPromises = files.map((file) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.default.uploader.upload_stream({
                    folder: 'luxe_products',
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result.secure_url);
                });
                uploadStream.end(file.buffer);
            });
        });
        const imageUrls = yield Promise.all(uploadPromises);
        res.status(200).json({
            success: true,
            message: 'Images uploaded successfully',
            data: imageUrls,
        });
    }
    catch (error) {
        console.error('Cloudinary Upload Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload images',
            error: error.message,
        });
    }
}));
exports.default = router;
//# sourceMappingURL=upload.routes.js.map