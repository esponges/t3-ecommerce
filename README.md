# Local DB

For local development you can use sqlite. To create the database:

- in `prisma/schema.prisma` change the `datasource.provider` of  to ` "sqlite"`
- create a file called `dev.db` in the prisma folder
- run `npx prisma db push` to create the database schema
- seed with `npx prisma db seed`

For production you can use postgres. To create the database:

- create a postgres database
- add your connection string to the `DATABASE_URL` environment variable
- run `npx prisma db push` to create the database schema
- seed with `npx prisma db seed` (optional)

# Create T3 App

This is an app bootstrapped according to the [init.tips](https://init.tips) stack, also known as the T3-Stack.
# t3-ecommerce

This app has been forked initially from https://github.com/esponges/t3-ecommerce
