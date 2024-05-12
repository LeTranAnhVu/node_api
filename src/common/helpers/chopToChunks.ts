function chopToChunks<T>(arr: T[], chunkSize: number): T[][] {
    let cursor = 0
    const arrChunks = arr.reduce((chunks, item) => {
        if (!chunks[cursor]) {
            chunks[cursor] = []
        }

        if (chunks[cursor].length >= chunkSize) {
            cursor++
            chunks[cursor] = []
        }

        chunks[cursor].push(item)
        return chunks
    }, [] as T[][])

    return arrChunks
}

export default chopToChunks
