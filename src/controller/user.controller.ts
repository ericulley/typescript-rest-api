import { Request, Response } from "express";
import log from "../../utils/logger";
import { createUserInput } from "../schema/user.schema";
import { createUser } from "../service/user.service";
import { omit } from 'lodash';

export async function createUserHandler(req: Request<{}, {}, createUserInput['body']>, res: Response) {
    try {
        const user = await createUser(req.body);
        return res.send(omit(user.toJSON(), 'password'));
    } catch (err: any) {
        log.error(err);
        return res.status(409).send(err);
    }
}