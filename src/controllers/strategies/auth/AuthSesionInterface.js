class AuthSesionInterface {
    signIn(userName, password, email) {
        throw new Error('Este método debe ser implementado');
    }

    login(userName, password) {
        throw new Error('Este método debe ser implementado');
    }

    logout() {
        throw new Error('Este método debe ser implementado');
    }

    validateSesion() {
        throw new Error('Este método debe ser implementado');
    }

    isLogged() {
        throw new Error('Este método debe ser implementado');
    }
}

export {AuthSesionInterface}
