import { PrismaClient } from '@prisma/client';
import { createLoremIpsum, getRandomNumber } from '../src/lib/utils';
const prisma = new PrismaClient();

async function main() {
  // remove if you want to keep the existing data
  await prisma.product.deleteMany();

  // seed 10 products
  for (let i = 0; i < 30; i++) {
    const product = await prisma.product.create({
      data: {
        name: createLoremIpsum().generateWords(2),
        description: createLoremIpsum().generateSentences(2),
        discount: 0,
        price: getRandomNumber(100, 1000),
        categoryId: getRandomNumber(1, 5),
        // from pokeapi
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getRandomNumber(
          1,
          898
        )}.png`,
      },
    });
    console.log(product);
  }
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
