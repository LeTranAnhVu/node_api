import type { Database } from './schema' // this is the Database interface we defined earlier
import pg from 'pg'
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely'
import { DB_HOST, DB_NAME, DB_PORT, DB_USER, DB_PW } from './db-config'
// const int8TypeId = 20
// Map int8 to number.
// types.setTypeParser(int8TypeId, (val) => {
//     return parseInt(val, 10)
// })

// Use to convert the decimal value to number otherwise it will be a string.
// Github Issue: https://github.com/knex/knex/issues/927#issuecomment-1011920890
pg.types.setTypeParser(pg.types.builtins.NUMERIC, Number)

const dialect = new PostgresDialect({
    pool: new pg.Pool({
        database: DB_NAME,
        host: DB_HOST,
        user: DB_USER,
        port: DB_PORT,
        max: 10,
        password: DB_PW,
    }),
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const dbContext = new Kysely<Database>({
    dialect,
    log(event): void {
        if (event.level === 'query') {
            console.log(event.query.sql)
            console.log(event.query.parameters)
        }
    },
    plugins: [new CamelCasePlugin()],
})
