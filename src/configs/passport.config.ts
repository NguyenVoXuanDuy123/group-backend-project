import passport from "passport";
import * as passportStrategy from "passport-local";
import userRepository from "@src/repositories/user.repository";

import { UserSessionType } from "@src/types/user.types";
import authService from "@src/services/auth.service";

passport.use(
  new passportStrategy.Strategy(
    { usernameField: "username" },
    async (username, password, done) => {
      try {
        const user = await authService.login({ username, password });
        done(undefined, user._id.toHexString());
      } catch (e) {
        done(e);
      }
    }
  )
);

passport.serializeUser((_id, done) => {
  done(undefined, _id);
});

passport.deserializeUser((id: string, done) => {
  userRepository.findById(id).then((user) => {
    if (user) {
      const { _id: idObject, role, status } = user;
      const _id = idObject.toHexString();
      done(undefined, {
        _id,
        role,
        status,
      } as UserSessionType);
    } else {
      done(new Error("User not found."));
    }
  });
});
