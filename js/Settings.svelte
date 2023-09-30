<script>
import { autoReveal, deck, decks, isRevealed, clearVotes, revealVotes, votingComplete } from './stores.js';
</script>

<div class="d-flex justify-content-center m-3">
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
    &nbsp;

    {#if !$autoReveal}
        <div class="voting-status">
            {#if !$isRevealed && votingComplete}
                ✓
            {/if}
        </div>
    {/if}
    {#if $isRevealed}
        <button class="btn btn-sm btn-warning" on:click={clearVotes}>Clear</button>
    {:else}
        <button class="btn btn-sm btn-primary" on:click={revealVotes}>Reveal</button>
    {/if}

    <div class="form-check form-switch mt-1 ms-3">
        <label for="autoReveal">Auto reveal</label>
        <input type="checkbox" bind:checked={$autoReveal} class="form-check-input" id="autoReveal" />
    </div>
</div>

<style>
label {
    white-space: nowrap;
}
.btn-sm {
    width: 100px;
}
.voting-status {
    width: 1.5em;
    color: green;
}
</style>
