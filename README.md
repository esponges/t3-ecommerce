# Local DB

For local development you can local postgress. To create the database:

- install postgres using homebrew `brew install postgresql`
- allow postgres to start on boot `pg_ctl -D /usr/local/var/the_full_postgres_folder_name start && brew services start postgresql`
- check the version `postgres --version`
- if you wish you can create a new user https://www.codementor.io/@engineerapart/getting-started-with-postgresql-on-mac-osx-are8jcopb#a-creating-users
or you can use the SU (locally only!)
- get into the postgres cli `psql postgres`
- check users `postgres=# \du`
- create a db `postgres=# CREATE DATABASE t3_ecommerce;`
- get the connection string details `postgres=# \conninfo`
- add your connection string to the `DATABASE_URL` environment variable, it will look something like this `postgres://postgresUserName:passwordIfAnyOrEmpty@localhost:5432/t3_ecommerce`
- run `npx prisma db push` to create the database schema
- seed with `npx prisma db seed` (optional)

For production you can use postgres. To create the database:

- create a postgres database
- add your connection string to the `DATABASE_URL` environment variable
- run `npx prisma db push` to create the database schema
- seed with `npx prisma db seed` (optional)
- update the schema with the migrations generated in dev (see seed.ts comments and below)

To migrate or alter the database:

- Change your prisma .env file to local db
- Delete prisma/migrations folder
- Run `npx prisma migrate dev --preview-feature` to start a new migration
- Change your prisma .env file back to development db and connect to it (CONFIRM IT WORKS)
- Run `npx prisma migrate resolve --applied "MIGRATION_FOLDER_NAME_GENERATED_BY_STEP_4"  --preview-feature`

seen in: https://github.com/prisma/prisma/issues/4571#issuecomment-747496127

# Create T3 App

This is an app bootstrapped according to the [init.tips](https://init.tips) stack, also known as the T3-Stack.
# t3-ecommerce

This app has been forked initially from https://github.com/esponges/t3-ecommerce .
