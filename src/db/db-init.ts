import Knex from 'knex'
import dbConfig from './db-config'

const baseConfig = { ...dbConfig }

const dbName = dbConfig.connection.database

delete baseConfig.connection.database

async function createDb(): Promise<void> {
    const knex = Knex(baseConfig)
    await knex.raw('CREATE DATABASE ??', dbName || '')
}

async function dropDb(): Promise<void> {
    const knex = Knex(baseConfig)
    await knex.raw('DROP DATABASE ??', dbName || '')
}

const arg = process.argv[2]
if (!arg) {
    throw new Error('No specific argument!')
}

if (arg === '--create') {
    createDb()
        .then(() => {
            console.log('Database is created')
            process.exit()
        })
        .then(console.error)
} else if (arg === '--drop') {
    dropDb()
        .then(() => {
            console.log('Database is dropped')
            process.exit()
        })
        .then(console.error)
}
