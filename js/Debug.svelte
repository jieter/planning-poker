<script lang="ts">
import { deck, decks, choices, error, isRevealed, participants, update, user, autoReveal, votes, log } from './stores';

let settings = $derived({
    error: $error,
    deck: $deck,
    decks: $decks,
    choices: $choices,
    isRevealed: $isRevealed,
    autoReveal: $autoReveal,
});
</script>

<div class="row bg-light rounded p-2 small mb-5">
    <div class="col">
        {#if true}
            <button onclick={() => update('add_fakes')} class="btn btn-xs btn-warning">Add fake users</button>
            <button onclick={() => update('fake_votes')} class="btn btn-xs btn-warning">Add fake votes</button>
        {/if}
        <div>debug<code>{JSON.stringify(settings)}</code></div>
        <div>votes: <code>{JSON.stringify($votes)}</code></div>
        <div>user: <code>{JSON.stringify($user)}</code></div>
        <div>participants: <code>{JSON.stringify($participants)}</code></div>
    </div>
    <div class="col">
        {#each $log as item}
            <div>
                <span>{item.time}</span>
                {item.event}
                {JSON.stringify(item.data)}
            </div>
        {/each}
    </div>
</div>
