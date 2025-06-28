import { AppConfigManager } from "../manager/AppConfigManager";


const getAuthHeader = () => {
    const token = AppConfigManager.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {};
}

const apiService = {
    request: async (url, options) => {
    try {
        const response = await fetch(url, options);
        const contentType = response.headers.get("Content-Type");

        const data = contentType?.includes("application/json")
            ? await response.json()
            : null;

        // No lanzamos error, simplemente devolvemos la respuesta + status
        return {
            ...data,
            status: response.status,
            ok: response.ok
        };
    } catch (error) {
        // Solo lanzamos si es un error de red real
        console.log('rederro')
        throw error;
    }
},

    get: async (url, headers = {}) => {
        return apiService.request(url, {
            method: 'GET',
            headers: {
                ...headers,
                ...getAuthHeader()
            },
        });
    },
    post: async (url, body, headers = {}) => {
        return apiService.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
                ...getAuthHeader()
            },
            body: JSON.stringify(body),
        });
    },
    put: async (url, body, headers = {}) => {
        return apiService.request(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
                ...getAuthHeader()
            },
            body: JSON.stringify(body),
        });
    },
    delete: async (url, body = {}, headers = {}) => {
        return apiService.request(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
                ...getAuthHeader()
            },
            body: JSON.stringify(body),
        });
    },
};

export {apiService};
