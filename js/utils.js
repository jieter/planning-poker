import Cookies from 'js-cookie';

export function jsonScriptContents(id) {
    let element = document.getElementById(id);
    if (element) {
        return JSON.parse(element.textContent);
    }
    return undefined;
}

export function csrfToken() {
    return Cookies.get('csrftoken');
}

export function deepEqual(x, y) {
    const ok = Object.keys,
        tx = typeof x,
        ty = typeof y;
    return x && y && tx === 'object' && tx === ty
        ? ok(x).length === ok(y).length && ok(x).every((key) => deepEqual(x[key], y[key]))
        : x === y;
}
