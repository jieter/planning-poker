import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';

import Summary from './Summary.svelte';
import type { VoteCount } from './types';
import { countVotes, voteStats } from './utils';

describe('Summary.svelte', () => {
    test('no votes', () => {
        render(Summary, { props: { votes: [] } });

        expect(screen.getByText('No votes')).toBeInTheDocument();
    });

    test('votes', () => {
        const votes: Array<VoteCount> = countVotes(['s', 's', 'm', 'm', 'm']);
        render(Summary, { props: { votes: votes } });

        expect(screen.queryByText('No votes')).not.toBeInTheDocument();
    });

    test('mean, standard deviation and suggestion', () => {
        const votes = ['1', '1', '2'];
        const options = ['1', '2', '3', '5', '8', '13', '20'];
        render(Summary, { props: { votes: countVotes(votes), stats: voteStats(votes, options) } });

        const suggestionEl = screen.getByTestId('suggestion');

        expect(suggestionEl.textContent).toContain('μ: 1.3');
        expect(suggestionEl.textContent).toContain('σ: 0.47');
        expect(suggestionEl.textContent).toContain('suggestion: 1');
    });

    test('merges passed class with its own classes', () => {
        const { container } = render(Summary, { props: { votes: [], class: 'p-2 rounded' } });

        expect(container.firstElementChild).toHaveClass('summary', 'text-center', 'p-2', 'rounded');
    });
});
