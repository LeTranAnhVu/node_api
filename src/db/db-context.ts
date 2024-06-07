import pg from 'pg'
import dbContext from './drizzle-config'

// Use to convert the decimal value to number otherwise it will be a string.
// Github Issue: https://github.com/knex/knex/issues/927#issuecomment-1011920890
pg.types.setTypeParser(pg.types.builtins.NUMERIC, Number)

export default dbContext
