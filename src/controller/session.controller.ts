import { Request, Response } from "express";
import { signJWT } from "../../utils/jwt";
import { UserDocument } from "../models/user.model";
import { createSession, getSessions, updateSession } from "../service/session.service";
import { validatePassword } from "../service/user.service";
import config from "config";
import { SessionDocument } from "../models/session.model";

export async function createUserSessionHandler(req: Request, res: Response) {
  // Validate user's passowrd
  const user = (await validatePassword(req.body)) as UserDocument;
  if (!user) {
    return res.status(401).send("Invalid email or password.");
  }

  // Create a session
  const session = (await createSession(user._id, req.get("user-agent") || "")) as SessionDocument;

  // Create an access token
  const accessToken = signJWT(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTTL") } // 12hr
  );

  // Create a refresh token
  const refreshToken = signJWT(
    { ...user, session: session._id },
    { expiresIn: config.get("refreshTokenTTL") } // 1yr
  );

  // Return access and refresh token
  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const sessions = await getSessions({ user: userId, valid: true });
  return res.send(sessions);
}

export async function deleteUserSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;
  await updateSession({ _id: sessionId }, { valid: false });
  return res.send({ accessToken: null, refreshToken: null });
}
