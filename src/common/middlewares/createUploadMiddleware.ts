import multer from 'multer'
import type { Multer } from 'multer'

const createUploadMiddleware = (): Multer => {
    // return multer({ storage: multer.memoryStorage()})
    return multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, '/tmp/my-uploads')
            },
            filename: (req, file, cb) => {
                const timestamp = Date.now().toString()
                cb(null, `${timestamp}_${file.originalname}`)
            },
        }),
    })
}

export default createUploadMiddleware
