import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "../models/session.model";

export async function createSession(userId: string, userAgent: string): Promise<object> {
  const session = await SessionModel.create({ user: userId, userAgent });
  return session.toJSON();
}

export async function getSessions(query: FilterQuery<SessionDocument>) {
  return SessionModel.find(query).lean();
}

export async function updateSession(query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) {
  return SessionModel.updateOne(query, update);
}
