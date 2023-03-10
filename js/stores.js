import { writable } from 'svelte/store';

import { urlEncode } from './utils';

export default function (websocketUrl) {
    const participants = writable([]);
    const choices = writable([]);
    const isRevealed = writable(false);

    console.log(websocketUrl);

    const socket = new WebSocket(websocketUrl);

    socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log(data);

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
            case 'reveal':
                isRevealed.set(true);
                break;
            case 'clear':
                isRevealed.set(false);
                break;
            case 'vote':
                const { name, vote } = data;
                participants.update((current) => {
                    current.forEach((p) => {
                        if (p.name == name) {
                            p.vote = vote;
                        }
                    });
                    return current;
                });
                break;
        }
    };

    async function update(action, params = undefined) {
        params = params || {};
        params.action = action;
        console.log('update', params);
        socket.send(JSON.stringify(params));
    }
    return [{ participants, isRevealed, choices }, update];
}
