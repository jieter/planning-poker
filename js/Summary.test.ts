import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';

import Summary from './Summary.svelte';

describe('Summary.svelte', () => {
    test('no votes', () => {
        render(Summary, { props: { votes: [] } });

        expect(screen.getByText('No votes')).toBeInTheDocument();
    });
});
