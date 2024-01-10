import { derived, writable, get } from 'svelte/store';

import type { VoteCount, Participant } from './types.d';

export const participants = writable<Array<Participant>>([]);
export const choices = writable<Array<string>>([]);
export const decks = writable([]);
export const autoReveal = writable<boolean>(false);
export const deck = writable<string>('tshirt');
export const isRevealed = writable<boolean>(false);
export const user = writable<Participant>({ vote: null, is_spectator: false });
export const error = writable<string | null>(null);
export const log = writable([]);
export const revealCount = writable(0);

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

// Derive a sorted list of (card, votes)-pairs off of the participants store:
export const votes = derived(participants, ($participants: Array<Participant>) => {
    return countVotes($participants.map((p: Participant) => p.vote));
});

// Show confetti if votes are revealed and all participants voted the same and there are more than 1 participants.
export const showConfetti = derived([isRevealed, votes], ([$isRevealed, $votes]) => {
    return $isRevealed && $votes.length == 1 && $votes[0] && $votes[0][1] > 1;
});

// Voting is considered complete if all active non-spectators voted:
export const votingComplete = derived(participants, ($participants) => {
    return $participants.every((p: Participant) => p.is_spectator || p.vote);
});

export const icon = derived(
    [participants, user, showConfetti, isRevealed],
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
