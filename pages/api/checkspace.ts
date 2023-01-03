import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export default async function checkSpace(context: any) {
  const session = await getSession(context);
  if (!session) {
    return null;
  }
  //@ts-ignore
  const userId = session.user.id;
  const space: any = await prisma.space.findMany({
    where: {
      userId: userId,
      selected: "true",
    },
    select: {
      id: true,
    },
  });
  if (space.length > 0) {
    return space[0].id;
  } else {
    const newSpace = await prisma.space.create({
      data: {
        name: "My first space",
        userId: userId,
        selected: "true",
      },
    });
    return newSpace.id;
  }
}
