import { writable } from 'svelte/store';

export default function (websocketUrl) {
    const participants = writable([]);
    const choices = writable([]);
    const isRevealed = writable(false);
    const isAdmin = writable(false);

    let socket;
    const connect = () => {
        socket = new WebSocket(websocketUrl);
        socket.onclose = function (e) {
            console.log('WebSocket connection closed unexpectedly. Trying to reconnect in 2s...');
            setTimeout(function () {
                console.log('Reconnecting...');
                connect();
            }, 2000);
        };

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log('message', data);

            switch (data.type) {
                case 'init':
                    participants.set(data.participants);
                    choices.set(data.choices);
                    break;
                case 'join':
                    participants.update((current) => {
                        return [...current, data.participant];
                    });
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
                case 'reveal':
                    isRevealed.set(true);
                    break;
                case 'clear':
                    isRevealed.set(false);
                    participants.update((current) => {
                        current.map((p) => {
                            p.vote = null;
                            return p;
                        });
                        return current;
                    });
                    break;
                case 'vote':
                    participants.update((current) => {
                        current.forEach((p) => {
                            if (p.name == data.name) {
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

    participants.subscribe((p) => console.log(p));

    async function update(action, params = undefined) {
        params = params || {};
        params.action = action;
        console.log('update', params);
        socket.send(JSON.stringify(params));
    }
    return [{ participants, isRevealed, isAdmin, choices }, update];
}
