const whitelist = [
    'http://localhost:2000',
    'http://localhost:3000',
    'http://localhost:8080']

const options = {
    origin: (origin, callback) => {
        if (!origin || whitelist.includes(origin)) { // Permitir sin origin
            callback(null, true);
        } else {
            callback(new Error('Access denied'));
        }
    }
}

module.exports = {options}
