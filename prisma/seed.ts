import { PrismaClient } from '@prisma/client';
import { createLoremIpsum, getRandomNumber } from '../src/lib/utils';

interface Mocks {
  categories: Array<string>;
  products: {
    product: string;
    price: string;
    categoryId: string;
  }[];
  postalCodes: {
    code: string;
    name: string;
    city: string;
  }[];
}

let categories: Mocks['categories'] = [];
let products: Mocks['products'] | never[] = [];
let postalCodes: Mocks['postalCodes'] | never[] = [];

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mocks = require('./mocks') as Mocks;
  categories = mocks.categories;
  products = mocks.products;
  postalCodes = mocks.postalCodes;
} catch (e) {
  console.log('no mocks found');
}

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

  console.log('seeding...');

  for (let i = 0; i < postalCodes?.length ?? 10; i++) {
    const code = await prisma.postalCode.create({
      data: {
        code: postalCodes[i]?.code ?? createLoremIpsum(1).generateWords(1),
        name: postalCodes[i]?.name ?? createLoremIpsum(1).generateWords(1),
        city: postalCodes[i]?.city ?? createLoremIpsum(1).generateWords(1),
        state: postalCodes[i]?.city ?? createLoremIpsum(1).generateWords(1),
      },
    });
    console.log(code);
  }

  for (let i = 0; i < categories.length ?? 10; i++) {
    await prisma.category.create({
      data: {
        id: i + 1,
        name: categories[i] ?? createLoremIpsum(1).generateWords(1),
        description: createLoremIpsum().generateSentences(1),
      },
    });
  }

  // change the max number to the number of products you want to seed
  interface PokeAbility {
    name: string;
    url: string;
  }

  interface PokeResponse {
    abilities: PokeAbility[];
    name: string;
  }

  for (let i = 0; i < products?.length ?? 50; i++) {
    const pokeId = getRandomNumber(1, 898);
    const pokemon = (await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`).then((res) =>
      res.json()
    )) as PokeResponse;

    const abilitiesData = pokemon.abilities.map((ability) => ({
      ability: ability.name,
    }));

    const product = await prisma.product.create({
      data: {
        name: products[i]?.product ?? pokemon.name,
        price:
          products[i]?.price && typeof parseInt(products[i]?.price || '') === 'number'
            ? parseInt(products[i]?.price || '')
            : getRandomNumber(100, 1000),
        categoryId:
          products[i]?.categoryId && typeof parseInt(products[i]?.categoryId || '') === 'number'
            ? parseInt(products[i]?.categoryId || '')
            : getRandomNumber(1, 10),

        // from pokeapi
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`,
        createdAt: new Date(),
        updatedAt: new Date(),
        score: 0,
        // 10% chance to have score > 0
        favScore: Math.random() > 0.7 ? getRandomNumber(1, 100) : 0,
        productSpecs: {
          create: {
            abilities: { createMany: { data: abilitiesData } },
          },
        },
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
