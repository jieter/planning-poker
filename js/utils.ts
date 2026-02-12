import Cookies from 'js-cookie';
import type { VoteCount, VotingStats } from './types';

export function jsonScriptContents(id: string): any {
    const element = document.getElementById(id) as HTMLElement;
    if (element && element.textContent) {
        return JSON.parse(element.textContent);
    }
    return undefined;
}

export function csrfToken(): string {
    return Cookies.get('csrftoken') || '';
}

// https://formito.com/tools/favicon
function faviconHref(emoji: string): string {
    return `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22256%22 height=%22256%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22central%22 text-anchor=%22middle%22 font-size=%2280%22>${emoji}</text></svg>`;
}

export function changeFavicon(emoji: string) {
    const document = window.document;
    const link = (document.querySelector('link[rel*="icon"]') || document.createElement('link')) as HTMLLinkElement;
    link.type = 'image/svg+xml';
    link.rel = 'shortcut icon';
    link.href = faviconHref(emoji);

    document.getElementsByTagName('head')[0].appendChild(link);
}

export function formatNumber(num: number): string {
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

// Count votes in a list of votes, returning a list of (card, votes)-pairs in descending order.
// [1, 1, 2, 3, 3, 3, 3] => [[3, 3], [1, 2], [2, 1]]
export function countVotes(votes: Array<string | null>): Array<VoteCount> {
    const _votes: { [vote: string]: number } = {};
    votes.forEach((vote: string | null) => {
        if (vote != null) {
            if (!(vote in _votes)) {
                _votes[vote] = 0;
            }
            _votes[vote] += 1;
        }
    });
    const voteCounts: Array<VoteCount> = Object.entries(_votes);
    return voteCounts.sort((a, b) => b[1] - a[1]);
}

const voteToNum = (val: string | number | null): number => {
    if (val === null) {
        return NaN;
    }
    if (typeof val === 'number') {
        return val;
    }

    return val == '½' ? 0.5 : parseFloat(val);
};

export function voteStats(votes: Array<string | null>, choices: Array<string> | null = null): VotingStats | null {
    const data = votes.map(voteToNum).filter((v): v is number => !isNaN(v));
    const n = data.length;

    if (n === 0) return null;

    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    const variance = data.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);

    const options = choices ?? Array.from(new Set(votes.filter((v): v is string => v !== null)));
    const sortedOptions = options.toSorted((a, b) => voteToNum(a) - voteToNum(b));

    // Find the choice with the smallest absolute distance to the mean
    const closest = sortedOptions.reduce((prev, curr) => {
        const prevDiff = Math.abs(voteToNum(prev) - mean);
        const currDiff = Math.abs(voteToNum(curr) - mean);

        if (currDiff < prevDiff) {
            return curr;
        } else if (currDiff === prevDiff) {
            // Tie-breaker: If distance is equal, pick the higher value (standard for 'closest')
            return voteToNum(curr) > voteToNum(prev) ? curr : prev;
        }
        return prev;
    });
    const isUnanimous = new Set(data).size === 1;
    return { mean, stdDev, closest, isUnanimous };
}
