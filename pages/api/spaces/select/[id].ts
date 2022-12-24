// get data from get request and set selected to true
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (session) {
    // find spaces that is selected and set selected to false
    const spaces = await prisma.space.updateMany({
      where: {
        selected: "true",
      },
      data: {
        selected: "false",
      },
    });

    const space = await prisma.space.update({
      where: {
        id: Number(req.query.id),
      },
      data: {
        selected: "true",
      },
    });
    if (!space) {
      res.status(404);
      res.end();
      return;
    }
    res.json(space);
  } else {
    res.status(401);
  }
}
