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
