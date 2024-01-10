<script lang="ts">
import Card from './Card.svelte';
import { VoteCount } from './types.d';

export let votes: Array<VoteCount>;
export let size: string | undefined = undefined;
export let random: () => number = () => 0;
</script>

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
