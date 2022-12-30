import { DocumentDefinition } from "mongoose";
import UserModel, { UserDocument } from "../models/user.model";
import bcrypt from 'bcrypt';
import config from "config";

export async function createUser(input: DocumentDefinition<Omit<UserDocument, 'createdAt' | 'updatedAt' | 'comparePassword'>>) {
    try {
        let salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));
        let hash = await bcrypt.hashSync(input.password, salt);
        input.password = hash;
        return await UserModel.create(input);
    } catch (err: any) {
        throw new Error(err);
    }

}