<script>
import { confetti } from '@neoconfetti/svelte';

import Card from './Card.svelte';
import { showConfetti } from './stores.js';

export let votes;
export let size = undefined;
export let emitConfetti = true;
</script>

{#if emitConfetti && $showConfetti}
    <div use:confetti />
{/if}
<div {...$$restProps}>
    {#each votes as [vote, count] (vote)}
        <div class="d-inline-block text-center">
            <Card {size}>{vote}</Card>
            <div class="text-muted">{count}x</div>
        </div>
    {:else}
        <div class="col text-center p-2">No votes</div>
    {/each}
</div>
