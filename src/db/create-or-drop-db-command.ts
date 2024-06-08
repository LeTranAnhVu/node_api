import pg from 'pg'
import { DB_HOST, DB_NAME, DB_PORT, DB_USER, DB_PW } from './db-config'
function connectToBaseDb(): Promise<pg.PoolClient> {
    const db = new pg.Pool({
        database: 'postgres',
        host: DB_HOST,
        user: DB_USER,
        port: DB_PORT,
        max: 10,
        password: DB_PW,
    })

    return db.connect()
}

async function createDb(): Promise<void> {
    const client = await connectToBaseDb()
    await client.query(`CREATE DATABASE ${DB_NAME};`)
}

async function dropDb(): Promise<void> {
    const client = await connectToBaseDb()
    await client.query(`DROP DATABASE ${DB_NAME};`)
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
