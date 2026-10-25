<script lang="ts">
import { applyTheme, type Theme } from './utils';

const THEMES: Array<[Theme, string]> = [
    ['auto', '🌓'],
    ['light', '☀️'],
    ['dark', '🌙'],
];

let theme: Theme = $state((localStorage.getItem('theme') as Theme) || 'auto');
let icon = $derived(THEMES.find(([t]) => t == theme)?.[1]);

function toggle() {
    const index = THEMES.findIndex(([t]) => t == theme);
    theme = THEMES[(index + 1) % THEMES.length][0];
    applyTheme(theme);
}
</script>

<button class="btn btn-sm theme-toggle" onclick={toggle} title="Theme: {theme}" aria-label="Theme: {theme}">
    {icon}
</button>

<style>
.theme-toggle {
    position: fixed;
    top: 0;
    right: 0;
    margin: 0.5rem;
    z-index: 1040;
}
</style>
