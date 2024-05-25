import multer from 'multer'
import type { Multer } from 'multer'

const createUploadMiddleware = (): Multer => {
    // return multer({ storage: multer.memoryStorage()})
    return multer({ dest: '/tmp/my-uploads/' })
}

export default createUploadMiddleware
