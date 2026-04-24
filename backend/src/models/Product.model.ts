import mongoose, { Document, Model, Schema } from 'mongoose';

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

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['jewelry', 'fashion', 'watches', 'accessories'],
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: [
        (val: string[]) => val.length > 0,
        'At least one image is required',
      ],
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    featured: {
      type: Boolean,
      required: true,
      default: false,
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes for better search performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

export const Product: Model<IProduct> = mongoose.model<IProduct>(
  'Product',
  productSchema
);
