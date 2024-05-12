export type PagedItem<T> = {
    items: T[]
    total: number
    size: number
    page: number
    noOfPages: number
}
