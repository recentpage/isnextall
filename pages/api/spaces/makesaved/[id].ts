//
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ error: "Not signed in" });
    return;
  }

  const { id } = req.query;

  const toolgen = await prisma.toolgen.update({
    where: {
      id: Number(id),
    },
    data: {
      isSaved: "true",
    },
  });

  res.status(200).json({ status: "1" });
}
