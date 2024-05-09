import knex from 'knex'
import dbConfig from './db-config'

const dbContext = knex(dbConfig)

export default dbContext
