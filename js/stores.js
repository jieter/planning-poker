import { derived, writable, get } from 'svelte/store';

export default function (websocketUrl) {
    const participants = writable([]);
    const choices = writable([]);
    const isRevealed = writable(false);
    const user = writable({});

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
            console.log('WebSocket connection closed unexpectedly. Trying to reconnect in 2s...');
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
                    break;
                case 'join':
                    participants.update((current) => [...current, data.user]);
                    break;
                case 'leave':
                    participants.update((current) => {
                        let index;
                        current.forEach((p, i) => {
                            if (p.name == data.name) {
                                index = i;
                            }
                        });
                        current.splice(index, 1);
                        return current;
                    });
                    break;
                case 'reveal':
                    isRevealed.set(true);
                    break;
                case 'clear':
                    isRevealed.set(false);
                    participants.update((current) => {
                        return current.map((u) => {
                            u.vote = null;
                            return u;
                        });
                    });
                    setUserVote(null);
                    break;
                case 'vote':
                    participants.update((current) => {
                        current.forEach((p) => {
                            if (p.id == data.user_id) {
                                p.vote = data.value;
                            }
                        });

                        return [...current];
                    });
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

    return { participants, isRevealed, user, choices, votes, revealVotes, clearVotes, vote };
}
