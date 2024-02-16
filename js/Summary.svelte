<script lang="ts">
import Card from './Card.svelte';
import type { VoteCount } from './types.d';

export let votes: Array<VoteCount>;
export let random: () => number = () => 0;
</script>

<div {...$$restProps} class="summary">
    {#each votes as [vote, count] (vote)}
        <div class="d-inline-block text-center card-wrapper">
            <Card rotation={random()}>{vote}</Card>
            <div class="count">{count}x</div>
        </div>
    {:else}
        <div class="col text-center p-2">No votes</div>
    {/each}
</div>

<style>
.card-wrapper {
    width: 35px;
    margin: 4px;
}

.count {
    filter: drop-shadow(0 0 0.5em rgba(1, 1, 1, 0.5));
}
</style>
