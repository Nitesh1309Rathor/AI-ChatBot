import { ERROR } from "../constants/error.messages";
import { LOG } from "../constants/log.messages";
import { AuthDao } from "../repo/auth.repo";
import { comparePassword, hashPassword } from "../utils/hash";
import { signToken } from "../utils/jwt";
import logger from "../utils/logger";

export const AuthService = {
  async register(email: string, password: string) {
    logger.info(LOG.AUTH_REGISTER_START);

    const existingUser = await AuthDao.findByEmail(email);
    if (existingUser) {
      logger.warn(LOG.AUTH_REGISTER_FAILED);
      throw new Error(ERROR.USER_EXISTS);
    }

    const hashedPassword = await hashPassword(password);
    const user = await AuthDao.createUser(email, hashedPassword);

    logger.info(LOG.AUTH_REGISTER_SUCCESS);

    return {
      token: signToken({ userId: user.id }),
    };
  },
  async login(email: string, password: string) {
    logger.info(LOG.AUTH_LOGIN_START);

    const user = await AuthDao.findByEmail(email);
    if (!user) {
      logger.warn(LOG.AUTH_LOGIN_FAILED);
      throw new Error(ERROR.INVALID_CREDENTIALS);
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      logger.warn(LOG.AUTH_LOGIN_FAILED);
      throw new Error(ERROR.INVALID_CREDENTIALS);
    }

    logger.info(LOG.AUTH_LOGIN_SUCCESS);

    return {
      token: signToken({ userId: user.id }),
    };
  },
};
