function getAll(opt?: any): Promise<any[]> {
    return Promise.resolve([{ id: '1', name: 'some product' }])
}

const productService = { getAll }

export default productService
