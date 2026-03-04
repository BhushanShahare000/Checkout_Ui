const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: "Bamboo Toothbrush (Pack of 4)",
      price: 299,
      quantity: 2,
      image: "/images/bamboo-toothbrush.png"
    },
    {
      name: "Reusable Cotton Produce Bags",
      price: 450,
      quantity: 1,
      image: "/images/cotton-bags.png"
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
