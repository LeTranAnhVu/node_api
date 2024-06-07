import { pgTable, serial, varchar, decimal, integer } from 'drizzle-orm/pg-core'

export const productTable = pgTable('products', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    category: varchar('category').notNull(),
    image: varchar('image'),
    link: varchar('link'),
    ratings: decimal('ratings', { precision: 2, scale: 1 }).$type<Number>(),
    price: decimal('price', { precision: 8, scale: 2 }).notNull().$type<Number>(),
    noOfRatings: integer('no_of_ratings').notNull(),
})

export const Product = productTable.$inferSelect
export const InsertProduct = productTable.$inferInsert
