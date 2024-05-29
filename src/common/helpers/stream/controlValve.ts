import { Transform } from 'stream'

/**
 * Control the flow of data in a stream
 * @param limit: Number of chunks to process
 * @param chunkSize : Number of items in a chunk
 * @returns
 */
export function controlValve(chunkSize: number, limit?: number): Transform {
    limit = limit || Infinity
    let limitCount = 0
    let chunkCount = 0
    let chunkBatch: any[] = []
    return new Transform({
        objectMode: true,
        transform(chunk, encoding, callback): void {
            if (limitCount < limit) {
                if (chunkCount < chunkSize) {
                    chunkCount++
                    chunkBatch.push(chunk)
                    if (chunkCount === chunkSize) {
                        callback(null, chunkBatch)
                        chunkCount = 0
                        chunkBatch = []
                    } else {
                        callback(null, null)
                    }
                }
                limitCount++
            } else {
                callback(null, chunkBatch.length ? chunkBatch : null)
                this.destroy()
            }
        },
    })
}