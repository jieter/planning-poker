<script>
import { confetti } from '@neoconfetti/svelte';

import Card from './Card.svelte';
import { showConfetti, revealCount } from './stores.js';
import { pseudoRandomGenerator } from './utils';

export let votes;
export let size = undefined;
export let emitConfetti = true;

$: random = pseudoRandomGenerator($revealCount, -3, 3);
</script>

{#if emitConfetti && $showConfetti}
    <div use:confetti />
{/if}
<div {...$$restProps}>
    {#each votes as [vote, count] (vote)}
        <div class="d-inline-block text-center">
            <Card {size} rotation={random()}>{vote}</Card>
            <div class="count">{count}x</div>
        </div>
    {:else}
        <div class="col text-center p-2">No votes</div>
    {/each}
</div>

<style>
div {
    font-size: 1.85vw;
}
.count {
    filter: drop-shadow(0 0 0.5em rgba(1, 1, 1, 0.5));
}
</style>
