import type { BackgroundJobTable } from '../features/background-jobs/BackgroundJob'
import type { ProductTable } from '../features/product/models/Product'

export type customDataType = {
    tsVector: unknown
}

export interface Database {
    products: ProductTable
    backgroundJobs: BackgroundJobTable
}
