import { beforeEach, describe, expect, test } from 'vitest';
import { stubColorScheme } from './testutils';
import { applyTheme, countVotes, formatNumber, pseudoRandomGenerator, voteStats } from './utils';

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

describe('voteStats', () => {
    test('no votes', () => {
        expect(voteStats([])).toEqual(null);
        expect(voteStats(['S', 'XL'])).toEqual(null);
    });
    test('mean', () => {
        expect(voteStats(['½', '½'])?.mean).toEqual(0.5);
        expect(voteStats(['1', '☕️'])?.mean).toEqual(1);
        expect(voteStats(['2', '2', '2'])?.mean).toEqual(2);
    });
    test('isUnanimous', () => {
        expect(voteStats(['1', '2', '3'])?.isUnanimous).toEqual(false);
        expect(voteStats(['4', '8', '20'])?.isUnanimous).toEqual(false);
        expect(voteStats(['1', '1', '1'])?.isUnanimous).toEqual(true);
        expect(voteStats(['1'])?.isUnanimous).toEqual(true);
        expect(voteStats(['1', '☕️'])?.isUnanimous).toEqual(true);
    });
    test('closest', () => {
        expect(voteStats(['1', '2'])?.closest).toEqual('2');
        expect(voteStats(['1', '1', '2'])?.closest).toEqual('1');
        expect(voteStats(['1', '1', '1', '1', '1', '1', '1', '2'])?.closest).toEqual('1');
    });
});

describe('applyTheme', () => {
    beforeEach(() => {
        localStorage.clear();
        stubColorScheme(false);
    });
    const currentTheme = () => document.documentElement.getAttribute('data-bs-theme');

    test('light and dark ignore the OS color scheme', () => {
        stubColorScheme(true);
        applyTheme('light');
        expect(currentTheme()).toEqual('light');
        expect(localStorage.getItem('theme')).toEqual('light');

        stubColorScheme(false);
        applyTheme('dark');
        expect(currentTheme()).toEqual('dark');
        expect(localStorage.getItem('theme')).toEqual('dark');
    });
    test('auto follows the OS color scheme', () => {
        applyTheme('auto');
        expect(currentTheme()).toEqual('light');

        stubColorScheme(true);
        applyTheme('auto');
        expect(currentTheme()).toEqual('dark');
        expect(localStorage.getItem('theme')).toEqual('auto');
    });
});
