import dotenv from 'dotenv'
import path from 'node:path'

dotenv.configDotenv({ path: path.join(__dirname, '../../.env') })

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PW } = process.env
export default {
    client: 'pg',
    connection: {
        host: DB_HOST,
        port: Number(DB_PORT),
        user: DB_USER,
        password: DB_PW,
        database: DB_NAME,
    },
}
