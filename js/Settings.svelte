<script lang="ts">
import { DRINKS, room, clearVotes, revealVotes, setAutoReveal, setDeck, setDrink } from './stores.svelte';

const drinks = Object.entries(DRINKS) as Array<[keyof typeof DRINKS, string]>;
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

    {#if room.drinkServed}
        <div class="btn-group btn-group-sm ms-3" role="group" aria-label="Choose your drink">
            {#each drinks as [value, label] (value)}
                <input
                    type="radio"
                    class="btn-check"
                    {value}
                    checked={(room.user.drink ?? 'coffee') == value}
                    onchange={() => setDrink(value)}
                    autocomplete="off"
                    id="drink-{value}" />
                <label class="btn btn-outline-secondary drink" for="drink-{value}" title={value}>{label}</label>
            {/each}
        </div>
    {/if}
</div>

<style>
label {
    white-space: nowrap;
}
.btn-sm {
    width: 100px;
}
.drink {
    width: auto;
}
.voting-status {
    width: 1.5em;
    color: var(--bs-success);
}
</style>
