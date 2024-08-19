import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { setCookie } from "nookies";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") return res.status(405).end();

  const { username, name } = req.body;

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (userExists)
    return res.status(400).json({
      status: false,
      message: "O usuário já existe.",
    });

  const user = await prisma.user.create({
    data: {
      username,
      name,
    },
  });

  setCookie(
    {
      res,
    },
    "@ignitecall:userId",
    user.id,
    {
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
    }
  );

  return res.status(201).json({
    status: true,
    message: "Usuário criado com sucesso.",
    user,
  });
}
