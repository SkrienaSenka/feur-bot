export function objects() {
    Object.prototype.deepCopy = function() {
        return JSON.parse(JSON.stringify(this));
    }

    Object.prototype.stylizedStringify = function() {
        return JSON.stringify(this, null, 2)
    }
}
