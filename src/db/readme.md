# Knex
## Commands:
- Generate the `knexfile.ts`
```bash
npx knex init -x ts
```
- List pending migrations:
```bash
npx knex migrate:list --knexfile ./src/db/knexfile.ts --env=dev
```

- Create migrations file
```bash
npx knex migrate:make <name> -x ts --knexfile ./src/db/knexfile.ts
```
- Start migrating:
```bash
npx knex migrate:latest --knexfile ./src/db/knexfile.ts --env dev
 or 
NODE_ENV=dev npx knex migrate:latest
```

- Rollback the last batch of migrations:
```bash
npx knex migrate:rollback [--all]
```

- More commands: https://knexjs.org/guide/migrations.html#migration-cli