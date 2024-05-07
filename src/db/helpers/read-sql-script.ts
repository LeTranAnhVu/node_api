import fs from 'node:fs/promises'
import path from 'node:path'

async function readSqlScript(fileName: string): Promise<string> {
    return fs.readFile(path.join(__dirname, '../sql-scripts', fileName), 'utf-8')
}

export default readSqlScript
