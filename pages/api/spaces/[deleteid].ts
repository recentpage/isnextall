import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

export default async function deleteSpace(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });;
  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const deleteid:any = req.query.deleteid;
  if (!deleteid) {
    return res.status(400).json({ error: "No id provided" });
  }

  const prisma = new PrismaClient();
  try {
    await prisma.space.delete({
      where: {
        id: parseInt(deleteid),
      },
    });
    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
