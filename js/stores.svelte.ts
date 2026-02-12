import type { LogEntry, Participant } from './types';
import { countVotes, voteStats } from './utils';

// --- The Room State ---
export const room = $state({
    // Raw State
    participants: [] as Participant[],
    choices: [] as string[],
    decks: [] as Array<[string, string]>,
    autoReveal: false,
    deck: 'tshirt',
    isRevealed: false,
    user: { vote: null, is_spectator: false } as Participant,
    error: null as string | null,
    log: [] as LogEntry[],
    revealCount: 0,

    // Derived State (Calculated automatically when dependencies change)
    get votes() {
        return countVotes(this.participants.map((p) => p.vote));
    },

    get votingStats() {
        return voteStats(
            this.participants.map((p) => p.vote),
            this.choices,
        );
    },

    get showConfetti() {
        return this.isRevealed && this.votes.length === 1 && this.votes[0] && this.votes[0][1] > 1;
    },

    get votingComplete() {
        return this.participants.every((p) => p.is_spectator || p.vote);
    },

    get icon() {
        if (this.showConfetti) return '🎉';
        if (this.isRevealed) return '🃏';

        const voters = this.participants.filter((p) => !p.is_spectator);
        const totalVotes = voters.filter((p) => p.vote);
        const almostComplete = voters.length - totalVotes.length === 1;
        if (voters.length > 1 && !this.user.vote && almostComplete) {
            return '🚨';
        }
        return '🕶️';
    },
});

// --- Communication Logic ---
let socket: WebSocket;

export function update(action: string, extraParams: Record<string, any> = {}) {
    if (!socket || socket.readyState !== 1) return;
    const params = { action, ...extraParams };
    socket.send(JSON.stringify(params));
}

export function connect(websocketUrl: string) {
    socket = new WebSocket(websocketUrl);

    socket.onclose = () => {
        room.error = 'WebSocket connection closed. Reconnecting...';
        setTimeout(() => connect(websocketUrl), 2000);
    };

    socket.onopen = () => update('init');

    socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
            case 'init':
                room.participants = data.users;
                room.user = data.user;
                room.choices = data.settings.choices;
                room.autoReveal = data.settings.auto_reveal;
                room.isRevealed = data.settings.is_revealed;
                room.decks = data.settings.decks;
                room.deck = data.settings.deck;
                room.log = data.log;
                room.error = null;
                room.revealCount = data.reveal_count;
                break;
            case 'vote':
                const p = room.participants.find((u) => u.id === data.user_id);
                if (p) p.vote = data.value;
                break;
            case 'error':
                room.error = data.message;
                break;
        }
    };
}

export const revealVotes = () => update('reveal');

export const clearVotes = () => {
    room.user.vote = null;
    update('clear');
};

export function castVote(value: string) {
    return () => {
        if (!room.isRevealed) {
            update('vote', { value });
            room.user.vote = value;
        }
    };
}

export const setDeck = (val: string) => {
    room.deck = val;
    update('settings', { deck: val });
};

export const setAutoReveal = (val: boolean) => {
    room.autoReveal = val;
    update('settings', { auto_reveal: val });
};
