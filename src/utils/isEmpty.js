export const isEmpty = (value) => {
    if (value === undefined || value === null) {
        return true;
    }
    if (typeof value === 'string' && value === '') {
        return true
    }
    if (Array.isArray(value) && value.length === 0) {
        return true
    }
    if (value instanceof Object && Object.keys(value).length === 0) {
        return true
    }
    return false
}
