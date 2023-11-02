import { derived, writable, get } from 'svelte/store';

export const participants = writable([]);
export const choices = writable([]);
export const decks = writable([]);
export const autoReveal = writable(false);
export const deck = writable('tshirt');
export const isRevealed = writable(false);
export const user = writable({});
export const error = writable(undefined);
export const log = writable([]);

// Count votes in a list of votes, returning a list of (card, votes)-pairs in descending order.
// [1, 1, 2, 3, 3, 3, 3] => [[3, 3], [1, 2], [2, 1]]
export function countVotes(votes) {
    const _votes = new Proxy({}, { get: (d, key) => (key in d ? d[key] : 0) });
    votes.forEach((vote) => {
        if (vote != null) {
            _votes[vote] += 1;
        }
    });
    return Object.entries(_votes).sort((a, b) => b[1] - a[1]);
}

// Derive a sorted list of (card, votes)-pairs off of the participants store:
export const votes = derived(participants, ($participants) => {
    return countVotes($participants.map((p) => p.vote));
});

// Show confetti if votes are revealed and all participants voted the same and there are more than 1 participants.
export const showConfetti = derived([isRevealed, votes], ([$isRevealed, $votes]) => {
    return $isRevealed && $votes.length == 1 && $votes[0] && $votes[0][1] > 1;
});

// Voting is considered complete if all active non-spectators voted:
export const votingComplete = derived(participants, ($participants) => {
    return $participants.every((p) => p.is_spectator || p.vote);
});

// Your vote is the last vote missing; others are waiting for you!
export const othersAreWaitingForYou = derived([participants, user], ([$participants, $user]) => {
    const voters = $participants.filter((p) => !p.is_spectator);
    const totalVotes = voters.filter((p) => p.vote);
    const almostComplete = voters.length - totalVotes.length == 1;
    return !$user.vote && almostComplete;
});

// Set the vote for the current user to `value`
const setUserVote = (value) => {
    user.update(($user) => {
        $user.vote = value;
        return $user;
    });
};

let socket;
export function update(action, params = undefined) {
    if (!socket || socket.readyState != 1) {
        // wait until socket is open
        console.log('Socket not open yet');
        return;
    }

    params = params || {};
    params.action = action;
    console.log('update', params);
    socket.send(JSON.stringify(params));
}
export function connect(websocketUrl) {
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
        // sending an iniit message will result in an init response.
        update({ action: 'init' });
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
                error.set(undefined);

                break;
            case 'vote':
                participants.update(($participants) => {
                    $participants.forEach((p) => {
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

export function castVote(value) {
    return () => {
        if (!get(isRevealed)) {
            update('vote', { value: value });
            setUserVote(value);
        }
    };
}

deck.subscribe(($deck) => update('settings', { deck: $deck }));
autoReveal.subscribe(($autoReveal) => update('settings', { auto_reveal: $autoReveal }));
