import dotenv from 'dotenv'
import type { Knex } from 'knex'
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
    wrapIdentifier: (value, origImpl, queryContext) => origImpl(convertToSnakeCase(value)),
    // postProcessResponse: (result, queryContext): any => {
    //     let newResult = null
    //     if (Array.isArray(result)) {
    //         newResult = result.map(convertKeyToCamelCase)
    //     } else {
    //         newResult = convertKeyToCamelCase(result)
    //     }

    //     return newResult
    // },
} as Knex.Config

function convertToSnakeCase(value: string): string {
    return value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

function convertToCamelCase(value: string): string {
    return value.replace(/_[a-z]/g, (_firstLetter) => _firstLetter.substring(1).toUpperCase())
}

function isSnakeCase(key: string): boolean {
    return key.includes('_')
}

function convertKeyToCamelCase(obj: Record<string, any>): Record<string, any> {
    const clone = { ...obj }
    for (const key in clone) {
        if (isSnakeCase(key)) {
            const newKey = convertToCamelCase(key)
            clone[newKey] = clone[key]
            delete clone[key]
        }
    }

    return clone
}
