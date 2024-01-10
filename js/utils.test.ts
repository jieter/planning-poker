import { describe, expect, test } from 'vitest'
import { pseudoRandomGenerator } from './utils'

describe('pseudoRandomGenerator', () => {
    test('with the same seed, output is predictable', () => {
        const generator = pseudoRandomGenerator(1, 1, 10);
        expect(generator()).toBeCloseTo(7.388);
        expect(generator()).toBeCloseTo(9.768);

        const generator2 = pseudoRandomGenerator(1, 1, 10);
        expect(generator2()).toBeCloseTo(7.388);
        expect(generator2()).toBeCloseTo(9.768);
    });
})
