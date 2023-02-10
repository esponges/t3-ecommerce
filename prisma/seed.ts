import { PrismaClient } from '@prisma/client';
import { createLoremIpsum, getRandomNumber } from '../src/lib/utils';
import {
  categories,
  products,
  postalCodes
} from './mocks'

const prisma = new PrismaClient();

/* 
  TODO: for the moment we've been relying on using `npx prisma db push`
  to sync the schema with the database. This is not ideal. We should be
  using migrations instead.
  A workaround which I have not been able to make work is to run the 
  migration in a local db and then use the local migration file to
  make use of the `npx prisma migrate resolve` command in production.
  more: https://github.com/prisma/prisma/issues/4571#issuecomment-747496127

  note: sqlite does not work with migrations. We need to use postgres locally
*/

async function main() {

  // remove if you want to keep the existing data
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.postalCode.deleteMany();

  for (let i = 0; i < categories.length; i++) {
    await prisma.category.create({
      data: {
        id: i + 1,
        name: categories[i] ?? createLoremIpsum(1).generateWords(1),
        description: createLoremIpsum().generateSentences(1),
      },
    });
  }

  for (let i = 0; i < 30; i++) {
    const product = await prisma.product.create({
      data: {
        // description: createLoremIpsum().generateSentences(2),
        // discount: 0,
        // price: getRandomNumber(100, 1000),
        // categoryId: getRandomNumber(1, names.length),
        // name: createLoremIpsum().generateWords(2),
        name: products[i]?.product ?? createLoremIpsum().generateWords(2),
        price:
          products[i]?.price && typeof parseInt(products[i]?.price || '') === 'number'
            ? parseInt(products[i]?.price || '')
            : getRandomNumber(100, 1000),
        categoryId:
          products[i]?.categoryId && typeof parseInt(products[i]?.categoryId || '') === 'number'
            ? parseInt(products[i]?.categoryId || '')
            : getRandomNumber(1, 20),

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

  for (let i = 0; i < 5; i++) {
    const code = await prisma.postalCode.create({
      data: {
        // int of 5 digits
        code: postalCodes[i]?.code ?? Math.random(),
        name: postalCodes[i]?.name ?? createLoremIpsum(1).generateWords(1),
        city: 'Guadalajara',
        state: 'Jalisco',
      },
    });
    console.log(code);
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
