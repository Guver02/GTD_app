class DomainError extends Error {
    constructor(message,{ type = null }) {
        super(message)
        this.name = "DomainError"
        this.type = type
    }
}

class ApplicationError extends Error {
    constructor(message, { type = null }) {
        super(message)
        this.name = "ApplicationError"
        this.type = type
    }
}

class InfrastructureError extends Error {
    constructor(message, { type = null }) {
        super(message)
        console.log('infrainstance')
        this.name = "InfrastructureError"
        this.type = type
    }
}

class ValidationError extends Error {
    constructor(message, { type = null }) {
        super(message)
        this.name = "ValidationError"
        this.type = type
    }
}

class UnexpectedError extends Error {
    constructor(message, { type = null }) {
        super(message)
        this.name = "UnexpectedError"
        this.type = type
    }
}

export {DomainError, ApplicationError, InfrastructureError, ValidationError, UnexpectedError}
