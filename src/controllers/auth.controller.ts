import HttpStatusCodes from "@src/constant/HttpStatusCodes";
import authService from "@src/services/auth.service";
import { APIResponse } from "@src/types/api.types";
import { RegisterRequestType } from "@src/types/auth.types";

import { Request } from "express";

class AuthController {
  public register = async (req: Request, res: APIResponse) => {
    await authService.createUser(req.body as RegisterRequestType);
    res.status(HttpStatusCodes.CREATED).json({
      message: "User created",
    });
  };

  public login = (req: Request, res: APIResponse) => {
    res.status(HttpStatusCodes.OK).json({ message: "Login successful" });
  };

  public logout = (req: Request, res: APIResponse) => {
    authService.logout(req);
    res.status(HttpStatusCodes.OK).json({ message: "Successfully logged out" });
  };
}

export default new AuthController();
