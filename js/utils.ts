import Cookies from 'js-cookie';

export function jsonScriptContents(id: string): any {
    const element = document.getElementById(id) as HTMLElement;
    if (element && element.textContent) {
        return JSON.parse(element.textContent);
    }
    return undefined;
}

export function csrfToken(): string {
    return Cookies.get('csrftoken');
}

// https://formito.com/tools/favicon
function faviconHref(emoji) {
    return `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22256%22 height=%22256%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22central%22 text-anchor=%22middle%22 font-size=%2280%22>${emoji}</text></svg>`;
}

export function changeFavicon(emoji) {
    const document = window.document;
    const link = (document.querySelector('link[rel*="icon"]') || document.createElement('link')) as HTMLLinkElement;
    link.type = 'image/svg+xml';
    link.rel = 'shortcut icon';
    link.href = faviconHref(emoji);

    document.getElementsByTagName('head')[0].appendChild(link);
}

export function formatNumber(num: number): str {
    const absNum = Math.abs(num);
    if (absNum > 999) {
        return Math.sign(num) * Number((absNum / 1000).toFixed(1)) + 'k';
    } else {
        return Math.sign(num) * absNum + '';
    }
}

/* Function returning function which returns a pseudo-random number between min and max with a seed.
 */
export function pseudoRandomGenerator(seed: number, min: number, max: number): () => number {
    return function random(): number {
        const x = Math.sin(seed++) * 10000;
        const n = x - Math.floor(x);

        return n * (max - min) + min;
    };
}
