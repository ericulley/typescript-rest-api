import { Request, Response } from "express";
import { signJWT } from "../../utils/jwt";
import { UserDocument } from "../models/user.model";
import { createSession } from "../service/session.service";
import { validatePassword } from "../service/user.service";
import config from "config";
import { SchemaDocument } from "../models/session.model";

export async function createUserSessionHandler(req: Request, res: Response) {
  // Validate user's passowrd
  const user = (await validatePassword(req.body)) as UserDocument;
  if (!user) {
    return res.status(401).send("Invalid email or password.");
  }

  // Create a session
  const session = (await createSession(user._id, req.get("user-agent") || "")) as SchemaDocument;

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
