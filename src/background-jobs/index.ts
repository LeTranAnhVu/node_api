import productWorker from './workers/productWorker'

const workers = [productWorker]

workers.forEach((worker) => {
    worker.on('drained', () => {
        console.log(`[${worker.name}]: Queue is drained, no more jobs left`)
    })

    worker.on('completed', (job) => {
        console.log(`[${worker.name}]:[${job.name}]: Job id ${job.id} has completed!`)
    })

    worker.on('failed', (job: any, err) => {
        console.log(`[${worker.name}]:[${job.name}]: Job id ${job.id} has failed with error message, ${err.message}`)
    })
})

console.log('Worker is starting ...')
