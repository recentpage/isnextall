import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a new tool
  const tool = await prisma.tools.create({
    data: {
      name: "productdescription",
      description: "productdescription",
      userId: "clc261f120000v6lkwz1866pc",
      slug: "copygen/productdescription/blank",
      status: "1",
    },
  });
  console.log({ tool });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
