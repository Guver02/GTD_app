import { AppConfigManager } from "./manager/AppConfigManager";


const getAuthHeader = () => {
    const token = AppConfigManager.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {};
}

const apiService = {
    request: async (url, options) => {
        try {
            const response = await fetch(url, options);

            /*if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }*/

            const data = await response.json();
            return data;
        } catch (error) {

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
