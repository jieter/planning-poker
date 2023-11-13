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

// https://formito.com/tools/favicon
function faviconHref(emoji) {
    return `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22256%22 height=%22256%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22central%22 text-anchor=%22middle%22 font-size=%2280%22>${emoji}</text></svg>`;
}

export function changeFavicon(emoji) {
    const document = window.document;
    const link = document.querySelector('link[rel*=\'icon\']') || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'shortcut icon';
    link.href = faviconHref(emoji);

    document.getElementsByTagName('head')[0].appendChild(link);
}
