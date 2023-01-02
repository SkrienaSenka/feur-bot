export function loadUtils() {
    Array.prototype.sample = function() {
        return this[~~(Math.random()*this.length)];
    }

    Array.prototype.unique = function() {
        return this.filter(function (value, index, self) {
            return self.indexOf(value) === index;
        })
    }
}

export function deepCopy(object) {
    return JSON.parse(JSON.stringify(object))
}
