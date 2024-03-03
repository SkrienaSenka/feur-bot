import emojiRegex from 'emoji-regex';

export function strings() {
    String.prototype.sanitize = function() {
        return this.toLowerCase()
            .replace(emojiRegex(), '')
            .replace(/(<:[^:]*:[^>]*>)*/g, '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f\u0000-\u002f\u003a-\u003f\u005b-\u0060\u007b-\u00bf]/g, '')
        ;
    }
}
