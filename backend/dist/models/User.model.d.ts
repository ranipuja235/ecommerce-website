import mongoose, { Document, Model } from 'mongoose';
export interface IAddress {
    _id?: mongoose.Types.ObjectId;
    type: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'user' | 'admin';
    avatar?: string;
    wishlist: mongoose.Types.ObjectId[];
    addresses: IAddress[];
    resetPasswordToken?: string | undefined;
    resetPasswordExpires?: Date | undefined;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export declare const User: Model<IUser>;
//# sourceMappingURL=User.model.d.ts.map