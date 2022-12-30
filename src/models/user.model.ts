import mongoose, { Mongoose } from 'mongoose';
import { NextFunction } from 'express';
import bcrypt from 'bcrypt';
import config from 'config';

export interface UserDocument extends mongoose.Document {
    email: string,
    name: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    comparePassword(candidatePW: string): Promise<boolean>
}

const userSchema = new mongoose.Schema<UserDocument>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true, },
    
}, {
    timestamps: true
});

// userSchema.pre('save', async (next) => {
//     let user = this as unknown as UserDocument;
    
//     if (!user.isModified('password')) {
//         return next();
//     }

//     let salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));
//     let hash = await bcrypt.hashSync(user.password, salt);
//     user.password = hash;

//     return next();
// });

userSchema.methods.comparePasswords = async (candidatePW: string): Promise<boolean> => {
    const user = this as unknown as UserDocument;

    return bcrypt.compare(candidatePW, user.password).catch((err) => false);
}


const UserModel = mongoose.model('User', userSchema);

export default UserModel;