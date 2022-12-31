import SessionModel from "../models/session.model";

export async function createSession(userId: string, userAgent: string): Promise<object> {
  const session = await SessionModel.create({ user: userId, userAgent });
  return session.toJSON();
}
