import { Router } from 'express'
import createUploadMiddleware from '../../common/middlewares/createUploadMiddleware'

const upload = createUploadMiddleware()

const router = Router()

router.post('/', upload.single('media'), async (req, res, next) => {
    res.json({ success: true, ...req.file })
})

router.get('/:name', async (req, res, next) => {
    const name = req.params.name
    const filePath = `/tmp/my-uploads/${name}`
    res.download(filePath)
})

export const media = router
