import { prisma } from '@/server/db/client';
import { mockedUser } from './global';

export default async function globalTeardown() {
  await prisma.$disconnect();
  console.log('teardown');

  // remove the created user to avoid conflicts with other tests
  await prisma.user.delete({
    where: {
      email: mockedUser.email,
    },
  });
}
