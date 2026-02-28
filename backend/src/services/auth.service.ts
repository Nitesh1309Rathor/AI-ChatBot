import { ERROR } from "../constants/error.messages";
import { LOG } from "../constants/log.messages";
import { AuthDao } from "../repo/auth.repo";
import { comparePassword, hashPassword } from "../utils/hash";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import logger from "../utils/logger";

export const AuthService = {
  async register(name: string, email: string, password: string) {
    logger.info(LOG.AUTH_REGISTER_START);

    const existingUser = await AuthDao.findByEmail(email);
    if (existingUser) {
      logger.warn(LOG.AUTH_REGISTER_FAILED);
      throw new Error(ERROR.USER_EXISTS);
    }

    const hashedPassword = await hashPassword(password);
    const user = await AuthDao.createUser(name, email, hashedPassword);

    logger.info(LOG.AUTH_REGISTER_SUCCESS);
    const accessToken = signAccessToken({ userId: user.id });
    const refreshToken = signRefreshToken({ userId: user.id });

    await AuthDao.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
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
    const accessToken = signAccessToken({ userId: user.id });
    const refreshToken = signRefreshToken({ userId: user.id });

    await AuthDao.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  },

  // Refreshes the token amd verifies.
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new Error(ERROR.UNAUTHORIZED);
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await AuthDao.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error(ERROR.UNAUTHORIZED);
    }

    const newAccessToken = signAccessToken({
      userId: user.id,
    });

    return { accessToken: newAccessToken };
  },

  async logout(userId: string) {
    await AuthDao.updateRefreshToken(userId, null);
    logger.info(LOG.AUTH_LOGOUT_SUCCESS);
  },
};
