import mongoose, { Mongoose } from 'mongoose';
import bcrypt from 'bcrypt';

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

userSchema.methods.comparePasswords = async (candidatePW: string): Promise<boolean> => {
    const user = this as unknown as UserDocument;

    return bcrypt.compare(candidatePW, user.password).catch((err) => false);
}


const UserModel = mongoose.model('User', userSchema);

export default UserModel;