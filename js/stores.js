import { derived, writable, get } from 'svelte/store';

export const participants = writable([]);
export const choices = writable([]);
export const decks = writable([]);
export const autoReveal = writable(false);
export const deck = writable('tshirt');
export const isRevealed = writable(false);
export const user = writable({});
export const error = writable(undefined);

// Derive a sorted list of (card, votes)-pairs off of the parcitipants store
export const votes = derived(participants, ($participants) => {
    const _votes = new Proxy({}, { get: (d, key) => (key in d ? d[key] : 0) });
    $participants.forEach((user) => {
        if (user.vote != null) {
            _votes[user.vote] += 1;
        }
    });

    return Object.entries(_votes).sort((a, b) => b[1] - a[1]);
});

// Set the vote for the current user to `value`
const setUserVote = (value) => {
    user.update(($user) => {
        $user.vote = value;
        return $user;
    });
};

let socket;
export function connect(websocketUrl) {
    socket = new WebSocket(websocketUrl);
    socket.onclose = () => {
        error.set('WebSocket connection closed unexpectedly. Trying to reconnect in 2s...');
        setTimeout(() => {
            console.log('Reconnecting...');
            connect();
        }, 2000);
    };

    socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log('message', data);

        switch (data.type) {
            case 'init':
                participants.set(data.users);
                user.set(data.user);
                choices.set(data.settings.choices);
                autoReveal.set(data.settings.autoReveal);
                isRevealed.set(data.settings.isRevealed);
                decks.set(data.settings.decks);
                deck.set(data.settings.deck);

                error.set(undefined);

                break;
            case 'vote':
                participants.update(($parcitipants) => {
                    $parcitipants.forEach((p) => {
                        if (p.id == data.user_id) {
                            p.vote = data.value;
                        }
                    });

                    return [...$parcitipants];
                });
                break;
            case 'error':
                error.set(data.message);
                break;
        }
    };
}

export async function update(action, params = undefined) {
    console.log('update', action, params);
    if (!socket || socket.readyState != 1) {
        // wait until socket is open
        return;
    }

    params = params || {};
    params.action = action;
    socket.send(JSON.stringify(params));
}
export const revealVotes = () => update('reveal');
export const clearVotes = () => {
    setUserVote(null);
    update('clear');
};

export function vote(value) {
    return () => {
        if (!get(isRevealed)) {
            update('vote', { value: value });
            setUserVote(value);
        }
    };
}

deck.subscribe((_value) => update('settings', { deck: _value }));
autoReveal.subscribe((_value) => update('settings', { autoReveal: _value }));
