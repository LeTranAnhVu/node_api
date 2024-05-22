import * as csv from 'fast-csv'
import { Readable } from 'stream'

function parseCSVBuffer<T>(buffer: Buffer): Promise<T[]> {
    return new Promise((resolve, reject) => {
        const records: T[] = []
        const stream = Readable.from(buffer)
        stream
            .pipe(csv.parse({ headers: true }))
            .on('data', (chunk) => records.push(chunk))
            .on('end', (rowCount: number) => resolve(records))
            .on('error', (error) => reject(error))
    })
}

export default parseCSVBuffer
