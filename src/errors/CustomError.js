class CustomError extends Error {
    constructor(message, metadata) {
        super(message);
        this.name = this.constructor.name;
        this.metadata = metadata || null
    }
}

export { CustomError }
