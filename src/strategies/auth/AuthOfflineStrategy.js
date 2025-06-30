import { getUUID } from "../../utils/generateUUID";
import { UsersIndexedDBServices } from "../../indexedDB/UsersIndexedDBServices";
import { ItemsIndexedDBService } from "../../indexedDB/ItemsIndexedDBServices";
import { IndexedDBManager } from "../../manager/IndexedDBManager";
import { jwtDecode } from "jwt-decode";
import { AuthSessionInterface } from "./interfaces/AuthSesionInterface";
import { InvalidCredentialsError } from "../../errors/AuthCustomErrors";

const indexedDB = IndexedDBManager.getInstance()
const usersService = new UsersIndexedDBServices(indexedDB);
const itemsService = new ItemsIndexedDBService(indexedDB);

class AuthOfflineStrategy extends AuthSessionInterface{

    async signIn(userName, password, email) {
        const hash = await this.#hashPassword(password)

        const newUser = {
            id: getUUID(),
            username: userName,
            email: email,
            password: hash
        }

        const user = await usersService.create(newUser);
        const token = this.#generateSymbolicJwt(user.id, user.username, user.email);
        await itemsService.createDefaultProjects(user.id);

        const data = {user, token}
        return data;
    }

    async login(userName, password) {
        const user = await usersService.getByUserAndPassword(userName, password);

        if (!user) {
            throw new InvalidCredentialsError()
        }


        const token = this.#generateSymbolicJwt(user.id, user.username, user.email);
        const data = {user, token}

                console.log('usuario:',data)

        return data
    }

    async getData(token){
        const decoded = jwtDecode(token)
        const data = await itemsService.getItems(decoded.userId);
        console.log('data obtenida en indexd', data)
        return data
    }

    async #hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    #generateSymbolicJwt(id, userName, email) {
        const header = {
            "alg": "HS256",
            "typ": "JWT"
        };

        const payload = {
            "userId": id,
            "username": userName,
            "email": email,
        };

        const encodedHeader = btoa(JSON.stringify(header)).replace(/\=/g, '');
        const encodedPayload = btoa(JSON.stringify(payload)).replace(/\=/g, '');
        const symbolicSignature = btoa('this-is-a-symbolic-signature-for-offline-mode').replace(/\=/g, '');
        return `${encodedHeader}.${encodedPayload}.${symbolicSignature}`;
    }
}

export { AuthOfflineStrategy };
