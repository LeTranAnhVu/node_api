import type { Knex } from 'knex'
import dbConfig from './db-config'

const config: { [key: string]: Knex.Config } = {
    dev: { ...dbConfig },
}

module.exports = config
