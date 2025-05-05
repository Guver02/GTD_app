const whitelist = [
    'http://localhost:4000',
    'http://localhost:3000',]

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
