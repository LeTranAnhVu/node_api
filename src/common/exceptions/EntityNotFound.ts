export class EntityNotFound extends Error {
    constructor(entityName: string, id: string) {
        super(`${entityName} with id ${id} not found`)
    }
}
