class AuthSessionInterface {
    signIn(userName, password, email) {
        throw new Error('Este método debe ser implementado');
    }

    login(userName, password) {
        throw new Error('Este método debe ser implementado');
    }

    getData(token){
        throw new Error('Este método debe ser implementado');
    }
}

export {AuthSessionInterface}
