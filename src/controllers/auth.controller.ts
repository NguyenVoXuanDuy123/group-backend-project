import HttpStatusCodes from "@src/constant/HttpStatusCodes";
import authService from "@src/services/auth.service";
import { APIRequest, APIResponse } from "@src/types/api.types";
import { RegisterRequestType } from "@src/types/auth.types";

class AuthController {
  public register = async (req: APIRequest, res: APIResponse) => {
    await authService.createUser(req.body as RegisterRequestType);
    res.status(HttpStatusCodes.CREATED).json({
      message: "Register new user successfully",
    });
  };

  public login = (req: APIRequest, res: APIResponse) => {
    res.status(HttpStatusCodes.OK).json({ message: "Login successfully" });
  };

  public logout = (req: APIRequest, res: APIResponse) => {
    authService.logout(req);
    res.status(HttpStatusCodes.OK).json({ message: "Logout successfully" });
  };
}

export default new AuthController();
