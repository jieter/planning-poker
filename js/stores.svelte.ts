import { derived, writable, get } from 'svelte/store';

import type { LogEntry, Participant } from './types';
import { countVotes } from './utils';

export const participants = writable<Array<Participant>>([]);
export const choices = writable<Array<string>>([]);
export const decks = writable<Array<[string, string]>>([]);
export const autoReveal = writable<boolean>(false);
export const deck = writable<string>('tshirt');
export const isRevealed = writable<boolean>(false);
export const user = writable<Participant>({ vote: null, is_spectator: false });
export const error = writable<string | null>(null);
export const log = writable<Array<LogEntry>>([]);
export const revealCount = writable(0);

// Derive a sorted list of (card, votes)-pairs off of the participants store:
export const votes = derived(participants, ($participants: Array<Participant>) => {
    return countVotes($participants.map((p: Participant) => p.vote));
});

const valueMap: Record<string, number> = {
    '½': 0.5,
    '??': NaN,
    coffee: NaN,
};

const toNum = (val: string | number): number => {
    if (typeof val === 'number') return val;
    return valueMap[val] ?? parseFloat(val);
};

const allValues = $derived.by(() => {
    const data = get(participants).map((p) => p.vote);
    const rawVotes = countVotes(data);

    return rawVotes.flatMap(([val, count]) => Array(count).fill(toNum(val))).filter((v) => !isNaN(v));
});

const stats = $derived.by(() => {
    const data = allValues;
    const n = data.length;

    if (n === 0) return null;

    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(n / 2);
    const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    const variance = data.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);

    const closest = get(choices).reduce((prev, curr) => {
        return Math.abs(toNum(curr) - mean) < Math.abs(toNum(prev) - mean) ? curr : prev;
    });

    const isUnanimous = new Set(data).size === 1;

    return { mean, median, stdDev, closest, isUnanimous };
});

// 2. Export as functions (the "Svelte 5 way" for modules)
export const getVotingStats = () => stats;
export const getAllValues = () => allValues;

// Show confetti if votes are revealed and all participants voted the same and there are more than 1 participants.
export const isUnanimous = derived([isRevealed, votes], ([$isRevealed, $votes]) => {
    return $isRevealed && $votes.length == 1 && $votes[0] && $votes[0][1] > 1;
});

// Voting is considered complete if all active non-spectators voted:
export const votingComplete = derived(participants, ($participants) => {
    return $participants.every((p: Participant) => p.is_spectator || p.vote);
});

export const icon = derived(
    [participants, user, isUnanimous, isRevealed],
    ([$participants, $user, $showConfetti, $isRevealed]) => {
        if ($showConfetti) {
            return '🎉';
        } else if ($isRevealed) {
            return '🃏';
        }

        const voters = $participants.filter((p) => !p.is_spectator);
        const totalVotes = voters.filter((p) => p.vote);
        const almostComplete = voters.length - totalVotes.length == 1;
        // Your vote is the last vote missing; others are waiting for you!
        if (voters.length > 1 && !$user.vote && almostComplete) {
            return '🚨';
        }
        return '🕶️';
    },
);

// Set the vote for the current user to `value`
const setUserVote = (value: string | null) => {
    user.update(($user) => {
        $user.vote = value;
        return $user;
    });
};

type ExtraParams = Record<string, any> | undefined;
type Params = {
    action: string;
} & ExtraParams;

let socket: WebSocket;
export function update(action: string, extraParams: ExtraParams = undefined) {
    if (!socket || socket.readyState != 1) {
        // wait until socket is open
        console.log('Socket not open yet');
        return;
    }
    const params: Params = { action: action, ...extraParams };
    console.log('update', params);
    socket.send(JSON.stringify(params));
}

export function connect(websocketUrl: string) {
    console.log('Connect to', websocketUrl);
    socket = new WebSocket(websocketUrl);

    socket.onclose = () => {
        error.set('WebSocket connection closed unexpectedly. Trying to reconnect in 2s...');
        setTimeout(() => {
            console.log('Reconnecting...');
            connect(websocketUrl);
        }, 2000);
    };
    socket.onopen = () => {
        // Sometimes the 'init' message is not send from the backend if the page was already open,
        // sending an init message will result in an init response.
        update('init');
    };
    socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log('message', data);

        switch (data.type) {
            case 'init':
                participants.set(data.users);
                user.set(data.user);
                choices.set(data.settings.choices);
                autoReveal.set(data.settings.auto_reveal);
                isRevealed.set(data.settings.is_revealed);
                decks.set(data.settings.decks);
                deck.set(data.settings.deck);
                log.set(data.log);
                error.set(null);
                revealCount.set(data.reveal_count);

                break;
            case 'vote':
                participants.update(($participants) => {
                    $participants.forEach((p: Participant) => {
                        if (p.id == data.user_id) {
                            p.vote = data.value;
                        }
                    });

                    return [...$participants];
                });
                break;
            case 'error':
                error.set(data.message);
                break;
        }
    };
}

export const revealVotes = () => update('reveal');
export const clearVotes = () => {
    setUserVote(null);
    update('clear');
};

export function castVote(value: string) {
    return () => {
        if (!get(isRevealed)) {
            update('vote', { value: value });
            setUserVote(value);
        }
    };
}

deck.subscribe(($deck) => update('settings', { deck: $deck }));
autoReveal.subscribe(($autoReveal) => update('settings', { auto_reveal: $autoReveal }));
