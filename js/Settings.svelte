<script lang="ts">
import { room, clearVotes, revealVotes, setAutoReveal, setDeck } from './stores.svelte';
</script>

<div class="d-flex justify-content-center m-3">
    <div class="btn-group btn-group-sm" role="group" aria-label="Change deck">
        {#each room.decks as [value, label] (value)}
            <input
                type="radio"
                class="btn-check"
                {value}
                checked={room.deck == value}
                onchange={() => setDeck(value)}
                autocomplete="off"
                id="deck-{value}"
                disabled={!room.isRevealed} />
            <label class="btn btn-outline-primary" for="deck-{value}"> {label}</label>
        {/each}
    </div>
    &nbsp;

    {#if !room.autoReveal}
        {#if !room.isRevealed && room.votingComplete}
            <div class="voting-status" title="Voting complete">✓</div>
        {:else}
            <div class="voting-status" title="Voting in progress">~</div>
        {/if}
    {/if}
    {#if room.isRevealed}
        <button class="btn btn-sm btn-warning" onclick={clearVotes}>Clear</button>
    {:else}
        <button class="btn btn-sm btn-success" onclick={revealVotes}>Reveal</button>
    {/if}

    <div class="form-check form-switch mt-1 ms-3">
        <label for="autoReveal">Auto reveal</label>
        <input
            type="checkbox"
            checked={room.autoReveal}
            onchange={(e) => setAutoReveal(e.currentTarget.checked)}
            class="form-check-input"
            id="autoReveal" />
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
    color: var(--bs-success);
}
</style>
