import mongoose, { Document, Model } from 'mongoose';
export interface IReview {
    user: mongoose.Types.ObjectId;
    name: string;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: 'jewelry' | 'fashion' | 'watches' | 'accessories';
    images: string[];
    stock: number;
    rating: number;
    numReviews: number;
    featured: boolean;
    reviews: IReview[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Product: Model<IProduct>;
//# sourceMappingURL=Product.model.d.ts.map