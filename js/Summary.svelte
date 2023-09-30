<script>
import { confetti } from '@neoconfetti/svelte';

import Card from './Card.svelte';

export let votes;
</script>

{#if votes && votes.length == 1 && votes[0][1] > 1}
    <div use:confetti />
{/if}
<div class="summary rounded mb-3 text-center">
    {#each votes as [vote, count] (vote)}
        <div class="d-inline-block text-center m-2">
            <Card>{vote}</Card>
            <div class="text-muted">{count}x</div>
        </div>
    {:else}
        <div class="col text-center p-2">No votes</div>
    {/each}
</div>

<style>
.summary {
    background-color: #e6e6e6;
}
</style>
