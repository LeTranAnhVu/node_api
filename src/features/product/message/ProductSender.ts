import { ProductQueue } from '../../../common/messages/constants'
import { MessageSender } from '../../../common/messages/MessageSender'

class ProductSender extends MessageSender {
    constructor() {
        super(ProductQueue.name)
    }
}

const productSender = new ProductSender()

export default productSender
