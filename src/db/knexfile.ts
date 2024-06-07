import type { Knex } from 'knex'
import dbConfig from './knex-config'

const config: { [key: string]: Knex.Config } = {
    dev: { ...dbConfig },
}

module.exports = config
