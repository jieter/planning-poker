<script>
import Participant from './Participant.svelte';
import Join from './Join.svelte';

import fetchStore from './stores.js';
import { jsonScriptContents } from './utils.js';

const [{ participants, isRevealed, choices }, update] = fetchStore(jsonScriptContents('websocket_url'));

const vote = (estimate) => () => {
    if (!$isRevealed) {
        update('vote', { estimate: estimate });
    }
};
const reveal = () => update('reveal');
const clear = () => update('clear');
</script>

<h1>Planning poker</h1>

<div class="participants">
    {#each $participants as { name, vote, id } (id)}
        <Participant isRevealed={$isRevealed} {name} {vote} />
    {:else}
        Nobody here yet.
    {/each}
</div>

<div class="choices">
    {#each $choices as choice}
        <button class="btn btn-default" on:click={vote(choice)} on:keypress={vote(choice)} disabled={$isRevealed}
            >{choice}</button
        >
        &nbsp;
    {/each}
</div>

<Join {update} {$participants} />

<br />
<!-- {#if $states.is_admin}
    <div class="btn btn-primary" on:click={reveal} on:keypress={reveal}>Reveal</div>
    <div class="btn btn-danger" on:click={clear} on:keypress={clear}>Clear</div>
{/if} -->
