// OfflineStrategy.js
import { jwtDecode } from "jwt-decode";
import { AppConfigManager } from "../../manager/AppConfigManager";
import { APP_MODES } from "../../manager/configs/appModes";
import { getUUID } from "../../../utils/generateUUID";
import { AuthSesionInterface } from "./AuthSesionInterface";
// Removimos la importación de IndexedDBManager porque ya no la usamos directamente aquí
// import { IndexedDBManager } from "../../manager/IndexedDBManager";
// Asegúrate de que UsersIndexedDBServices y ItemsIndexedDBService ya tienen las modificaciones anteriores
import { UsersIndexedDBServices } from "../../../indexedDBServices/UsersIndexedDBServices";
import { ItemsIndexedDBService } from "../../../indexedDBServices/ItemsIndexedDBServices";
import { IndexedDBManager } from "../../manager/IndexedDBManager";


class OfflineStrategy extends AuthSesionInterface {

    constructor() {
        super();

        const indexedDB = IndexedDBManager.getInstance()
        console.log('indexed in offline',indexedDB)
        const usersService = new UsersIndexedDBServices(indexedDB);
        const itemsService = new ItemsIndexedDBService(indexedDB);

        this.usersService = usersService;
        this.itemsService = itemsService
    }

    async signIn(userName, password, email) {
        console.log("[OfflineStrategy] Iniciando signIn para nuevo usuario...");
        const hash = await this.#hashPassword(password)

        const newUser = {
            id: getUUID(),
            username: userName,
            email: email,
            password: hash
        }

        // ¡Ahora usamos this.usersService que ya está listo!
        const data = await this.usersService.create(newUser);
        const token = this.#generateSymbolicJwt(data.id, data.username, data.email);

        // ¡Ahora usamos this.itemsService que ya está listo!
        // createDefaultProjects puede necesitar el userId, si es así, pásaselo.
        await this.itemsService.createDefaultProjects(data.id);

        AppConfigManager.setMode(APP_MODES.offline.appMode, token);
        console.log("[OfflineStrategy] Nuevo usuario registrado y proyectos por defecto creados.");
        return data; // Retorna los datos del usuario si es necesario
    }

    async login(userName, password) {
        console.log("[OfflineStrategy] Intentando login...");
        // ¡Ahora usamos this.usersService que ya está listo!
        const data = await this.usersService.getByUserAndPassword(userName, password);

        if (!data) {
            throw new Error("Invalid username or password."); // Maneja el caso de login fallido
        }
        const token = this.#generateSymbolicJwt(data.id, data.username, data.email);

        AppConfigManager.setMode(APP_MODES.offline.appMode, token);
        console.log("[OfflineStrategy] Login exitoso.");
        return data; // Retorna los datos del usuario si es necesario
    }

    logout() {
        console.log("[OfflineStrategy] Cerrando sesión.");
        AppConfigManager.clear();
    }

    validateSesion() {
        const config = AppConfigManager.getConfig();
        try {
            const isValid = (
                config.appMode === APP_MODES.offline.appMode &&
                config.storageType === APP_MODES.offline.storageType &&
                config.jwt // jwt exist
            );

            return isValid;
        } catch (error) {
            return false
        }

    }

    async isLogged() {
        console.log('[OfflineStrategy] Verificando estado de sesión...');
        const token = AppConfigManager.getConfig().jwt;

        if (!token) {
            console.log("[OfflineStrategy] No hay token, no está logueado.");
            return [false, null];
        }

        let decoded;
        try {
            decoded = jwtDecode(token);
        } catch (error) {
            console.error("[OfflineStrategy] Error decodificando JWT:", error);
            AppConfigManager.clear(); // Limpia la sesión inválida
            return [false, null];
        }

        console.log('ISLOGGED (validateSesion)?', this.validateSesion());

        if (this.validateSesion()) {
            console.log('[OfflineStrategy] Sesión válida. Obteniendo items del usuario...');
            // ¡Ahora usamos this.itemsService que ya está listo!
            const data = await this.itemsService.getItems(decoded.userId);
            console.log('DATA:', data);
            return [true, data];
        }

        console.log("[OfflineStrategy] Sesión no válida.");
        return [false, null];
    }

    // Métodos privados (#)
    async #savePasswordInLS(password) {
        const hashed = await this.#hashPassword(password);
        localStorage.setItem('password', hashed);
    }

    async #hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async #validatePassword(password) {
        const hashed = await this.#hashPassword(password);
        const stored = localStorage.getItem('password');

        if (hashed === stored) return true;
        return false;
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

export { OfflineStrategy };
