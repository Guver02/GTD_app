class UnknowError extends Error {
    constructor(metadata) {
        super('Error inesperado.');
        this.metadata = metadata || null
    }
}

export {UnknowError}
