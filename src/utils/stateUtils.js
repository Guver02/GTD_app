const getStatus = (value) => {
    if (typeof value === "boolean") {
        return value ? 'completed' : 'pending';
    }else {
        if (["pending", "in_progress", "completed"].includes(value)) {
            return value;
        } else {
            throw new Error('Invalid status value');
        }
    }
}

export {getStatus}
