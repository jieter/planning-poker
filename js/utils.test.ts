import { describe, expect, test } from 'vitest';
import { countVotes, formatNumber, pseudoRandomGenerator } from './utils';

describe('formatNumber', () => {
    test('less than 1000', () => {
        expect(formatNumber(1)).toEqual('1');
        expect(formatNumber(999)).toEqual('999');
    });
    test('1000 and above', () => {
        expect(formatNumber(1000)).toEqual('1k');
        expect(formatNumber(2000)).toEqual('2k');
        expect(formatNumber(2020)).toEqual('2k');
        expect(formatNumber(2200)).toEqual('2.2k');
        expect(formatNumber(10000)).toEqual('10k');
    });
});
describe('pseudoRandomGenerator', () => {
    test('with the same seed, output is predictable', () => {
        const generator = pseudoRandomGenerator(1, 1, 10);
        expect(generator()).toBeCloseTo(7.388);
        expect(generator()).toBeCloseTo(9.768);

        const generator2 = pseudoRandomGenerator(1, 1, 10);
        expect(generator2()).toBeCloseTo(7.388);
        expect(generator2()).toBeCloseTo(9.768);
    });
});

describe('countVotes', () => {
    test('no votes', () => {
        expect(countVotes([])).toEqual([]);
    });
    test('with votes', () => {
        expect(countVotes(['1', '1'])).toEqual([['1', 2]]);
        expect(countVotes(['1', '2', '1'])).toEqual([
            ['1', 2],
            ['2', 1],
        ]);
        expect(countVotes(['XL', 'XL', 'XL', 'L'])).toEqual([
            ['XL', 3],
            ['L', 1],
        ]);
    });
});
