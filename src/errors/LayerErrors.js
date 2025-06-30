import { CustomError } from "./CustomError";

class DomainError extends CustomError {
    constructor(message, metadata) {
        super(message, metadata);
        this.layer = 'DOMAIN';
    }
}

class ApplicationError extends CustomError {
        constructor(message, metadata) {
        super(message, metadata);
        this.layer = 'APPLICATION'
    }
}

class InfrastructureError extends CustomError {
        constructor(message, metadata) {
        super(message, metadata);
        this.layer = 'INFRASTRUCTURE';
    }
}

export { DomainError, ApplicationError, InfrastructureError }
