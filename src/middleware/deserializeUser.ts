import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { verifyJWT } from "../../utils/jwt";
import { refreshAccessToken } from "../service/session.service";

export default async function deserializeUser(req: Request, res: Response, next: NextFunction) {
  const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "") as string;
  const refreshToken = get(req, "headers.x-refresh") as string;
  if (!accessToken) return next();
  const { decoded, expired } = verifyJWT(accessToken);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = (await refreshAccessToken({ refreshToken })) as string;
    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
    }
    const result = verifyJWT(newAccessToken);
    res.locals.user = result.decoded;
  }

  return next();
}
