import { Adapter } from "next-auth/adapters";
import { prisma } from "../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { parseCookies, destroyCookie } from "nookies";

export function PrismaAdapter(
  req: NextApiRequest,
  res: NextApiResponse
): Adapter {
  return {
    async createUser(user) {
      const { "@ignitecall:userId": userIdOnCookies } = parseCookies({ req });

      if (!userIdOnCookies) {
        throw new Error("User ID not found on cookies.");
      }

      const userCreate = await prisma.user.update({
        where: {
          id: userIdOnCookies,
        },

        data: {
          email: user.email,
          name: user.name,
          avatar_url: user.avatar_url,
        },
      });

      destroyCookie({ res }, "@ignitecall:userId", {
        path: "/",
      });

      return {
        id: userCreate.id,
        email: userCreate.email!,
        avatar_url: userCreate.avatar_url!,
        emailVerified: null,
        username: userCreate.username,
        name: userCreate.name,
      };
    },

    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) return null;

      return {
        id: user.id,
        email: user.email!,
        avatar_url: user.avatar_url!,
        emailVerified: null,
        username: user.username,
        name: user.name,
      };
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) return null;

      return {
        id: user.id,
        email: user.email!,
        avatar_url: user.avatar_url!,
        emailVerified: null,
        username: user.username,
        name: user.name,
      };
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },

        include: {
          user: true,
        },
      });

      if (!account) return null;

      const { user } = account;

      return {
        id: user.id,
        email: user.email!,
        avatar_url: user.avatar_url!,
        emailVerified: null,
        username: user.username,
        name: user.name,
      };
    },

    async updateUser(user) {
      const userUpdate = await prisma.user.update({
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
        where: {
          id: user.id,
        },
      });

      return {
        id: userUpdate.id,
        email: userUpdate.email!,
        avatar_url: userUpdate.avatar_url!,
        emailVerified: null,
        username: userUpdate.username,
        name: userUpdate.name,
      };
    },

    async linkAccount(account) {
      await prisma.account.create({
        data: {
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          type: account.type,
          access_token: account.access_token,
          expires_at: account.expires_at,
          id_token: account.id_token,
          refresh_token: account.refresh_token,
          scope: account.scope,
          session_state: account.session_state,
          token_type: account.token_type,
          user_id: account.userId,
        },
      });
    },

    async createSession({ expires, sessionToken, userId }) {
      await prisma.session.create({
        data: {
          user_id: userId,
          session_token: sessionToken,
          expires,
        },
      });

      return { expires, sessionToken, userId };
    },

    async getSessionAndUser(sessionToken) {
      const session = await prisma.session.findUnique({
        where: {
          session_token: sessionToken,
        },
        include: {
          user: true,
        },
      });

      if (!session) return null;

      const { user } = session;

      return {
        session: {
          userId: session.user_id,
          expires: session.expires,
          sessionToken: session.session_token,
        },
        user: {
          id: user.id,
          email: user.email!,
          avatar_url: user.avatar_url!,
          emailVerified: null,
          username: user.username,
          name: user.name,
        },
      };
    },

    async updateSession({ sessionToken, userId, expires }) {
      const sessionUpdate = await prisma.session.update({
        data: {
          expires,
          user_id: userId,
        },
        where: {
          session_token: sessionToken,
        },
      });

      return {
        sessionToken: sessionUpdate.session_token,
        userId: sessionUpdate.user_id,
        expires: sessionUpdate.expires,
      };
    },

    async deleteSession(sessionToken) {
      await prisma.session.delete({
        where: {
          session_token: sessionToken,
        },
      });
    },
  };
}
