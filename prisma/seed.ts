import { PrismaClient } from '@prisma/client';
import { createLoremIpsum, getRandomNumber } from '../src/lib/utils';
// import { products } from 'seed/products';
const prisma = new PrismaClient();

async function main() {
  // remove if you want to keep the existing data
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const names: string[] = [
    'Electronics',
    'Books',
    'Clothing',
    'Shoes',
    'Home',
    'Kitchen',
    'Tools',
    'Garden',
    'Sports',
    'Toys',
    'Games',
    'Movies',
    'Music',
    'Beauty',
    'Health',
  ];
  
  for (let i = 0; i < names.length; i++) {
    await prisma.category.create({
      data: {
        id: i + 1,
        name: names[i] ?? createLoremIpsum(1).generateWords(1),
        description: createLoremIpsum().generateSentences(1),
      },
    });
  }

  // seed json from seed/products.ts (not included in repo - using seeder for the moment)
  for (let i = 0; i < 30; i++) {
    const product = await prisma.product.create({
      data: {
        description: createLoremIpsum().generateSentences(2),
        discount: 0,
        price: getRandomNumber(100, 1000),
        categoryId: getRandomNumber(1, names.length),
        name: createLoremIpsum().generateWords(2),
        // name: products[i]?.product ?? createLoremIpsum().generateWords(2),
        // price:
        //   products[i]?.price && typeof parseInt(products[i]?.price || '') === 'number'
        //     ? parseInt(products[i]?.price || '')
        //     : getRandomNumber(100, 1000),
        // categoryId:
        //   products[i]?.categoryId && typeof parseInt(products[i]?.categoryId || '') === 'number'
        //     ? parseInt(products[i]?.categoryId || '')
        //     : getRandomNumber(1, 20),

        // from pokeapi
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getRandomNumber(
          1,
          898
        )}.png`,
        createdAt: new Date(),
        updatedAt: new Date(),
        score: 0,
        favScore: 0,
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
