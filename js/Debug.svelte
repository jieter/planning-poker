<script>
import { deck, decks, choices, error, isRevealed, participants, update, user, autoReveal, votes, log } from './stores.js';

$: settings = {
    error: $error,
    deck: $deck,
    decks: $decks,
    choices: $choices,
    isRevealed: $isRevealed,
    autoReveal: $autoReveal,
};

const isProduction = !window.location.host.includes('localhost');
</script>

<div class="row bg-light rounded p-2">
    <div class="col">
        <div>debug<code>{JSON.stringify(settings)}</code></div>
        <div>votes: <code>{JSON.stringify($votes)}</code></div>
        <div>user: <code>{JSON.stringify($user)}</code></div>
        <div>participants: <code>{JSON.stringify($participants)}</code></div>
        {#if !isProduction}
            <button on:click={() => update('add_fakes')} class="btn btn-xs btn-warning">Add fake users</button>
            <button on:click={() => update('fake_votes')} class="btn btn-xs btn-warning">Add fake votes</button>
        {/if}
    </div>
    <div class="col">
        {#each log as item}
            <div>
                <span>{item.event}</span>
            </div>
        {/each}
    </div>
</div>
