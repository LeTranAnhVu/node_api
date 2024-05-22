export type ProductMessagePayload = {
    importCSV: { path: string; originalName: string }
    loadCSV: { haha: string; ueue: string }
}
export const ProductQueue = {
    name: 'product-queue',
    jobs: {
        importCSV: 'import-csv',
    },
} as const
