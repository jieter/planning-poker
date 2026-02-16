<script lang="ts">
import { room, update } from './stores.svelte';

let settings = $derived({
    error: room.error,
    deck: room.deck,
    decks: room.decks,
    choices: room.choices,
    isRevealed: room.isRevealed,
    autoReveal: room.autoReveal,
});
</script>

<div class="row bg-light rounded p-2 small mb-5">
    <div class="col">
        {#if true}
            <button onclick={() => update('add_fakes')} class="btn btn-xs btn-warning">Add fake users</button>
            <button onclick={() => update('fake_votes')} class="btn btn-xs btn-warning">Add fake votes</button>
        {/if}
        <div>debug<code>{JSON.stringify(settings)}</code></div>
        <div>votes: <code>{JSON.stringify(room.votes)}</code></div>
        <div>user: <code>{JSON.stringify(room.user)}</code></div>
        <div>participants: <code>{JSON.stringify(room.participants)}</code></div>
    </div>
    <div class="col">
        {#each room.log as item}
            <div>
                <span>{item.time}</span>
                {item.event}
                {JSON.stringify(item.data)}
            </div>
        {/each}
    </div>
</div>
