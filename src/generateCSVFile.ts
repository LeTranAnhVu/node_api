import { faker } from '@faker-js/faker'
import { createWriteStream } from 'node:fs'
import { stat, rm } from 'node:fs/promises'
import { Readable } from 'node:stream'
// OUTSIDE OF THE APPLICATION
type Column = {
    name: string
    genFn: () => string | number
}

const rowGenerator = function* (headers: string, rowNum: number, columns: Column[], delimiter: string): IterableIterator<string> {
    for (let i = 0; i < rowNum; i++) {
        const row = []
        for (const col of columns) {
            row.push(col.genFn())
        }
        let rawRow = i == 0 ? [headers, row.join(delimiter)].join('\n') : row.join(delimiter)
        rawRow += '\n'
        const percent = Math.floor(((i + 1) * 100) / rowNum)
        if (percent % 5 == 0) {
            printProgress(percent)
        }
        yield rawRow
    }
}

async function fileExist(filePath: string): Promise<boolean> {
    try {
        const isExists = (await stat(filePath)).isFile()
        return isExists
    } catch (e) {
        return false
    }
}

async function generateCSV(filePath: string, columns: Column[], rowNum: number): Promise<void> {
    console.log('Generating CSV ...')

    const isExists = await fileExist(filePath)
    if (isExists) {
        await rm(filePath)
    }

    console.time('GenerateCSV')
    const delimiter = ','
    const headers = columns.map((c) => c.name).join(delimiter)
    const stream = Readable.from(rowGenerator(headers, rowNum, columns, delimiter))
    const writer = createWriteStream(filePath, { encoding: 'utf-8' })
    stream.pipe(writer).on('finish', (err: any) => {
        if (err) {
            console.log(err)
        } else {
            console.log('\nGenerate file succeeded!')
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

const filePath = process.argv[2]
const rowNum = Number(process.argv[3])

function printProgress(progress: number): void {
    // process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
    let bar = '['
    const scale = 50
    const scaledProgress = Math.floor((progress * scale) / 100)
    for (let i = 1; i <= scale; i++) {
        bar += i <= scaledProgress ? '=' : ' '
    }

    bar += ']'
    process.stdout.write(bar)
    process.stdout.write(' ' + progress + '%')
}

generateCSV(filePath, cols, rowNum)
// console.log(process.memoryUsage())
