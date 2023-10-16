<script>
import { confetti } from '@neoconfetti/svelte';

import Card from './Card.svelte';

export let votes;
export let position = 'center';
export let size;

</script>

{#if votes && votes.length == 1 && votes[0][1] > 1}
    <div use:confetti />
{/if}
<div class="rounded mb-3 text-{position}" {...$$restProps}>
    {#each votes as [vote, count] (vote)}
        <div class="d-inline-block text-center">
            <Card {size}>{vote}</Card>
            <div class="text-muted">{count}x</div>
        </div>
    {:else}
        <div class="col text-center p-2">No votes</div>
    {/each}
</div>
