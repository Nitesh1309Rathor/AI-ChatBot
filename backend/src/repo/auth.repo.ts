import { prisma } from "../lib/prisma";

export const AuthDao = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async createUser(name: string, email: string, password: string) {
    return prisma.user.create({ data: { name, email, password } });
  },

  async updateRefreshToken(userId: string, token: string | null) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    });
  },

  async findById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  },
};
