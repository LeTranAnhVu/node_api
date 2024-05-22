import type { ProductMessagePayload } from '../../../common/messages/constants'
import { ProductQueue } from '../../../common/messages/constants'
import { MessageSender } from '../../../common/messages/MessageSender'

class ProductSender extends MessageSender {
    constructor() {
        super(ProductQueue.name)
    }

    send(jobName: string, data: ProductMessagePayload[keyof ProductMessagePayload]): Promise<void> {
        return super.send(jobName, data)
    }
}

const productSender = new ProductSender()

export default productSender
