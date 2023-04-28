import { derived, writable, get } from 'svelte/store';

export default function (websocketUrl) {
    const participants = writable([]);
    const choices = writable([]);
    const isRevealed = writable(false);
    const user = writable({});
    const error = writable(undefined);

    // Derive a sorted list of (card, votes)-pairs off of the parcitipants store
    const votes = derived(participants, ($participants) => {
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
    const connect = () => {
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
                    choices.set(data.choices);
                    user.set(data.user);
                    isRevealed.set(data.is_revealed);
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
    };
    connect();

    async function update(action, params = undefined) {
        params = params || {};
        params.action = action;
        console.log('update', params);
        socket.send(JSON.stringify(params));
    }
    const revealVotes = () => update('reveal');
    const clearVotes = () => {
        setUserVote(null);
        update('clear');
    };

    const vote = (value) => () => {
        if (!get(isRevealed)) {
            update('vote', { value: value });
            setUserVote(value);
        }
    };
    const changeDeck = () => {
        update('change_deck');
    };

    return { participants, isRevealed, user, choices, votes, revealVotes, clearVotes, vote, changeDeck, error, update };
}
