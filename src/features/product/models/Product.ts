import type { Generated, Insertable, Selectable, Updateable } from 'kysely'
import type { customDataType } from '../../../db/schema'

export interface ProductTable {
    id: Generated<number>
    name: string
    category: string
    image: string
    link: string
    ratings: number | null
    noOfRatings: number
    price: number
    fullTextSearch: customDataType['tsVector']
}

export type KyProduct = Selectable<ProductTable>
export type KyProductInsert = Insertable<ProductTable>
export type KyProductUpdate = Updateable<ProductTable> & { id: number }
