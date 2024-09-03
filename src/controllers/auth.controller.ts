import HttpStatusCodes from "@src/constant/HttpStatusCodes";
import userRepository from "@src/repositories/user.repository";
import authService from "@src/services/auth.service";
import { APIRequest, APIResponse } from "@src/types/api.types";
import { RegisterRequestType } from "@src/types/auth.types";
import { UserSessionType } from "@src/types/user.types";

class AuthController {
  public register = async (req: APIRequest, res: APIResponse) => {
    await authService.createUser(req.body as RegisterRequestType);
    res.status(HttpStatusCodes.CREATED).json({
      message: "Register new user successfully",
    });
  };

  public login = (req: APIRequest, res: APIResponse) => {
    res.status(HttpStatusCodes.OK).json({
      message: "Login successfully",
    });
  };

  public logout = (req: APIRequest, res: APIResponse) => {
    authService.logout(req);

    res.status(HttpStatusCodes.OK).json({ message: "Logout successfully" });
  };

  public introspect = async (req: APIRequest, res: APIResponse) => {
    if (!req.isAuthenticated()) {
      return res.status(HttpStatusCodes.OK).json({
        message: "Introspect successfully",
        result: {
          isAuthenticated: req.isAuthenticated(),
          user: null,
        },
      });
    }
    const { _id } = req.user as UserSessionType;

    const user = await userRepository.getUserById(_id, {
      username: 1,
      firstName: 1,
      lastName: 1,
      role: 1,
      status: 1,
      avatar: 1,
    });

    res.status(HttpStatusCodes.OK).json({
      message: "Introspect successfully",
      result: {
        isAuthenticated: req.isAuthenticated(),
        user: user,
      },
    });
  };
}

export default new AuthController();
