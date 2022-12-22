// import prisma clent and getsession
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const session = await getSession({ req });
  const body = req.body;
  //@ts-ignore
  const userid = session?.user?.id;
  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  } else {
    if (req.method === "POST") {
      const space = await prisma.space.create({
        data: {
          name: body,
          // @ts-ignore
          userId: userid,
        },
      });
      // return space
      res.json(space);
    }
  }
}
