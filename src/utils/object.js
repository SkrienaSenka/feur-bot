export function deepCopy(object) {
    return JSON.parse(JSON.stringify(object));
}

export function stylizedStringify(object) {
    return JSON.stringify(object, null, 2)
}
