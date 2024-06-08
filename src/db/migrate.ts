import type { Kysely } from 'kysely'
import { FileMigrationProvider, Migrator } from 'kysely'
import { dbContext } from './kysely'
import { promises as fs } from 'fs'
import path from 'path'
import type { Database } from './schema'

export async function migrateToLatest(db: Kysely<Database>): Promise<void> {
    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            // This needs to be an absolute path.
            migrationFolder: path.join(__dirname, './migrations'),
        }),
    })

    console.log('BEFORE migrateToLast CALL')

    try {
        const { error, results } = await migrator.migrateToLatest()

        // console.log('AFTER migrateToLast CALL', error, results)
        results?.forEach((it) => {
            if (it.status === 'Success') {
                console.log(`migration "${it.migrationName}" was executed successfully`)
            } else if (it.status === 'Error') {
                console.error(`failed to execute migration "${it.migrationName}"`)
            }
        })

        if (error) {
            console.error('failed to run `migrateToLatest`')
            console.error(error)
        }
    } catch (error) {
        console.log('ERROR AFTER migrateToLast CALL', error)
    }

    await db.destroy()
}

migrateToLatest(dbContext)
