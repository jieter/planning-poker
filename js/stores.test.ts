import { describe, expect, test } from 'vitest';

import { room } from './stores.svelte';

describe('room.drinkServed', () => {
    test('coffee is served when every 10th round is revealed', () => {
        room.isRevealed = true;
        for (const [revealCount, expected] of [
            [0, false],
            [9, false],
            [10, true],
            [11, false],
            [20, true],
        ] as const) {
            room.revealCount = revealCount;
            expect(room.drinkServed).toBe(expected);
        }

        room.revealCount = 10;
        room.isRevealed = false;
        expect(room.drinkServed).toBe(false);
    });
});

describe('room.votingComplete', () => {
    test('not complete without participants or voters', () => {
        room.participants = [];
        expect(room.votingComplete).toBe(false);

        room.participants = [{ id: 1, vote: null, is_spectator: true }];
        expect(room.votingComplete).toBe(false);
    });
    test('complete if all voters voted', () => {
        room.participants = [
            { id: 1, vote: null, is_spectator: true },
            { id: 2, vote: '5', is_spectator: false },
            { id: 3, vote: null, is_spectator: false },
        ];
        expect(room.votingComplete).toBe(false);

        room.participants[2].vote = '8';
        expect(room.votingComplete).toBe(true);
    });
});
