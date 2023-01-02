import config from "config";
import { get } from "lodash";
import { FilterQuery, UpdateQuery } from "mongoose";
import { signJWT, verifyJWT } from "../../utils/jwt";
import SessionModel, { SessionDocument } from "../models/session.model";
import { getUser } from "./user.service";

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

export async function refreshAccessToken({ refreshToken }: { refreshToken: string }) {
  const { decoded } = verifyJWT(refreshToken);
  if (!decoded || !get(decoded, "session")) return false;
  const session = await SessionModel.findById(get(decoded, "session"));
  if (!session || !session.valid) return false;
  const user = await getUser({ _id: session.user });
  if (!user) return false;
  const accessToken = signJWT(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTTL") } // 12hr
  );
  return accessToken;
}
