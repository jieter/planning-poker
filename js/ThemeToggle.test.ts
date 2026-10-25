import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, test } from 'vitest';

import { stubColorScheme } from './testutils';
import ThemeToggle from './ThemeToggle.svelte';

describe('ThemeToggle.svelte', () => {
    beforeEach(() => {
        localStorage.clear();
        stubColorScheme(false);
    });

    test('defaults to auto', () => {
        render(ThemeToggle);

        expect(screen.getByRole('button')).toHaveAttribute('title', 'Theme: auto');
    });

    test('starts from the stored theme', () => {
        localStorage.setItem('theme', 'dark');
        render(ThemeToggle);

        expect(screen.getByRole('button')).toHaveAttribute('title', 'Theme: dark');
    });

    test('cycles through auto, light and dark', async () => {
        render(ThemeToggle);
        const button = screen.getByRole('button');

        for (const theme of ['light', 'dark', 'auto']) {
            await fireEvent.click(button);
            expect(button).toHaveAttribute('title', `Theme: ${theme}`);
            expect(localStorage.getItem('theme')).toEqual(theme);
        }
    });
});
