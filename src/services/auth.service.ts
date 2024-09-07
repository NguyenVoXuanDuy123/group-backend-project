import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import userRepository from "@src/repositories/user.repository";

import bcrypt from "bcrypt";
import { LoginRequestType, RegisterRequestType } from "@src/types/auth.types";
import { User } from "@src/schema/user.schema";
import { APIRequest } from "@src/types/api.types";

class AuthService {
  private readonly saltRounds = 9;
  public async createUser(registerRequest: RegisterRequestType) {
    if (
      await userRepository.checkUserExistsByUsername(registerRequest.username)
    ) {
      throw new ApiError(ApiErrorCodes.USERNAME_ALREADY_TAKEN);
    }
    const user: Partial<User> = {
      avatar: "http://localhost:4000/images/avatar-0.png",
      firstName: registerRequest.firstName,
      lastName: registerRequest.lastName,
      username: registerRequest.username,
      password: await this.hashPassword(registerRequest.password),
    };
    const res = await userRepository.createUser(user);
    return res;
  }

  public async login(loginRequest: LoginRequestType) {
    const { username, password } = loginRequest;
    if (!username) {
      throw new ApiError(ApiErrorCodes.INVALID_USERNAME);
    }
    if (!password) {
      throw new ApiError(ApiErrorCodes.INVALID_PASSWORD_LENGTH);
    }
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw new ApiError(ApiErrorCodes.INVALID_CREDENTIALS);
    }

    if (!(await this.comparePassword(password, user.password))) {
      throw new ApiError(ApiErrorCodes.INVALID_CREDENTIALS);
    }

    return user;
  }

  public logout(req: APIRequest) {
    req.logout((err) => {
      if (err) {
        throw new Error("Error logging out: " + err);
      }
    });
  }

  public async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    return hashedPassword;
  }

  private async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  }
}

export default new AuthService();
