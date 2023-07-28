<script>
import { deck, decks, choices, error, isRevealed, participants, update, user, autoReveal, votes } from './stores.js';

$: settings = { error: $error, deck: $deck, decks: $decks, choices: $choices, isRevealed: $isRevealed, autoReveal: $autoReveal };

const isProduction = !window.location.host.includes('localhost');
</script>

<div class="bg-light rounded p-2">
    <div>debug</div>
    <code>{JSON.stringify(settings)}</code>
    <div>votes: <code>{JSON.stringify($votes)}</code></div>
    <div>user: <code>{JSON.stringify($user)}</code></div>
    <div>participants: <code>{JSON.stringify($participants)}</code></div>
    {#if !isProduction}
        Fake:
        <div class="btn-group btn-group-sm" role="group">
            <button on:click={() => update('add_fakes')} class="btn btn-warning">Users</button>
            <button on:click={() => update('fake_votes')} class="btn btn-warning">Votes</button>
        </div>
    {/if}
</div>
