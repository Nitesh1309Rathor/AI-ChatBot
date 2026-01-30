import { prisma } from "../lib/prisma";

export const AuthDao = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async createUser(email: string, password: string) {
    return prisma.user.create({ data: { email, password } });
  },
};
