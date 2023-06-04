<script>
import { autoReveal, deck, decks, isRevealed } from './stores.js';
</script>

<div class="btn-group btn-group-sm" role="group" aria-label="Change deck">
    {#each $decks as [value, label]}
        <input
            type="radio"
            class="btn-check"
            {value}
            bind:group={$deck}
            autocomplete="off"
            id="deck-{value}"
            disabled={!$isRevealed} />
        <label class="btn btn-outline-primary" for="deck-{value}"> {label}</label>
    {/each}
</div>
<br />

<div class="form-check form-switch mt-2">
    <label for="autoReveal">Auto reveal</label>
    <input type="checkbox" bind:checked={$autoReveal} class="form-check-input" id="autoReveal" />
</div>
