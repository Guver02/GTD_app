const TOKEN_KEY = 'jwtToken';

class AuthService {
    constructor (storageType){
        this.storage = storageType
    }

    getToken() {
        return this.storage.getItem(TOKEN_KEY);
    }

    setToken(token) {
        this.storage.setItem(TOKEN_KEY, token);
    }

    removeToken() {
        this.storage.removeItem(TOKEN_KEY);
    }

    getAuthHeader() {
        const token = this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
}

export {AuthService};
