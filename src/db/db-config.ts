import path from 'path'
import dotenv from 'dotenv'

dotenv.configDotenv({ path: path.join(__dirname, '../../.env') })
export const DB_PORT = Number(process.env.DB_PORT)
export const { DB_HOST, DB_NAME, DB_USER, DB_PW } = process.env

const missingVars = []
if (!DB_HOST) {
    missingVars.push('DB_HOST')
}
if (!DB_PORT) {
    missingVars.push('DB_PORT')
}
if (!DB_NAME) {
    missingVars.push('DB_NAME')
}
if (!DB_USER) {
    missingVars.push('DB_USER')
}
if (!DB_PW) {
    missingVars.push('DB_PW')
}

if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`)
}
