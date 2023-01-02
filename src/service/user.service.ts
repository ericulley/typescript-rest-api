import { DocumentDefinition, FilterQuery } from "mongoose";
import UserModel, { UserDocument } from "../models/user.model";
import bcrypt from "bcrypt";
import config from "config";
import { omit } from "lodash";

export async function createUser(input: DocumentDefinition<Omit<UserDocument, "createdAt" | "updatedAt" | "comparePassword">>) {
  try {
    let salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
    let hash = await bcrypt.hashSync(input.password, salt);
    input.password = hash;
    return await UserModel.create(input);
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function getUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}

export async function validatePassword({ email, password }: { email: string; password: string }) {
  const user = (await UserModel.findOne({ email })) as UserDocument;
  console.log(user);
  if (!user) return false;

  console.log("Candidate PW: ", password);
  const isValid = await bcrypt.compare(password, user.password).catch((err) => false);

  if (!isValid) return false;
  return omit(user.toJSON, "password");
}
