import multer from 'multer'
import type { Multer } from 'multer'

const createUploadMiddleware = (): Multer => {
    return multer({ storage: multer.memoryStorage() })
}

export default createUploadMiddleware
