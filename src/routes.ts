import { Express, Request, Response } from "express";
import { createUserHandler } from "./controller/user.controller";
import { createUserSessionHandler, getUserSessionHandler, deleteUserSessionHandler } from "./controller/session.controller";
import validateResource from "./middleware/validateResource";
import { createSessionSchema } from "./schema/session.schema";
import { createUserSchema } from "./schema/user.schema";
import requireUser from "./middleware/requireUser";

const routes = (app: Express) => {
  app.get("/test", (req: Request, res: Response) => res.sendStatus(200));

  app.post("/api/users", validateResource(createUserSchema), createUserHandler);

  app.post("/api/sessions", validateResource(createSessionSchema), createUserSessionHandler);

  app.get("/api/sessions", requireUser, getUserSessionHandler);

  app.delete("/api/sessions", requireUser, deleteUserSessionHandler);
};

export default routes;
