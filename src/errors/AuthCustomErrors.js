import { ApplicationError, DomainError, InfrastructureError } from "./LayerErrors";

class InvalidUsernameError extends DomainError {
    constructor(metadata) {
        super('El usuario ingresado no es válido.', metadata);

    }
}

class InvalidPasswordError extends DomainError {
    constructor(metadata) {
        super('La contraseña es inválida.', metadata);

    }
}

class InvalidEmailError extends DomainError {
    constructor(metadata) {
        super('El email es inválido', metadata);

    }
}

class SessionExpiredError extends ApplicationError {
    constructor(metadata) {
        super('Sesión expirada', metadata);

    }
}

class InvalidCredentialsError extends ApplicationError {
    constructor(metadata) {
        super('Credenciales inválidas', metadata);

    }
}

class UserNotFoundError extends ApplicationError {
    constructor(metadata) {
        super('Usuario no encontrado.', metadata);

    }
}

class IncorrectPasswordError extends ApplicationError {
    constructor(metadata) {
        super('Contraseña Incorrecta', metadata);

    }
}

class NetworkError extends InfrastructureError {
    constructor(metadata) {
        super('No se pudo conectar al servidor', metadata);

    }
}

export class BadRequestError extends InfrastructureError {
  constructor(metadata) {
    super('Solicitud incorrecta de un servicio externo', metadata);

  }
}

class InternalServerError extends InfrastructureError {
  constructor(metadata) {
    super('Se produjo un error interno del servidor', metadata);

  }
}

class NoInternetConnectionError extends InfrastructureError {
  constructor(metadata) {
    super('No tienes conexión a internet', metadata);

  }
}

class ServerUnavailableError extends InfrastructureError {
  constructor(metadata) {
    super('Servidor no disponible', message, details);

  }
}

class NetworkFailureError extends InfrastructureError {
    constructor() {
        super('Fallo de red. Verifica tu conexión.', metadata);

    }
}

export { InvalidCredentialsError, InvalidUsernameError, InvalidEmailError ,InvalidPasswordError, SessionExpiredError, UserNotFoundError, IncorrectPasswordError, NetworkError, NetworkFailureError, InternalServerError, NoInternetConnectionError, ServerUnavailableError };
