import { faker } from '@faker-js/faker'
import { createWriteStream } from 'fs'

// OUTSIDE OF THE APPLICATION
type Column = {
    name: string
    genFn: () => string | number
}

// TODO This function start throw Error in 5 mil rows, we need to use stream to handle it.
function generateCSV(filePath: string, columns: Column[], rowNum: number): void {
    console.time('generateCSV')
    const delimiter = ','
    const headers = columns.map((c) => c.name).join(delimiter)
    const data = [headers]
    for (let i = 0; i < rowNum; i++) {
        const row = []
        for (const col of columns) {
            row.push(col.genFn())
        }
        data.push(row.join(','))
    }

    const rawData = data.join('\n')

    const writer = createWriteStream(filePath, { encoding: 'utf-8' })
    writer.write(rawData, (error) => {
        if (error) {
            console.log('errorrr', error)
        } else {
            console.log('Generate file succeeded!')
        }
        console.timeEnd('generateCSV')
    })
}

const cols: Column[] = [
    {
        name: 'name',
        genFn: () => faker.commerce.productName(),
    },
    {
        name: 'category',
        genFn: () => faker.commerce.productMaterial(),
    },
    {
        name: 'image',
        genFn: () => faker.image.avatar(),
    },
    {
        name: 'link',
        genFn: () => faker.internet.url(),
    },
    {
        name: 'ratings',
        genFn: () => faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
    },
    {
        name: 'noOfRatings',
        genFn: () => faker.number.int({ min: 0, max: 10000 }),
    },
    {
        name: 'price',
        genFn: () => faker.commerce.price(),
    },
]

generateCSV('/tmp/generated_2e6.csv', cols, 2e6)
