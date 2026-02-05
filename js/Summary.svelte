<script lang="ts">
import Card from './Card.svelte';
import type { VoteCount } from './types.d';
import { getVotingStats } from './stores.svelte';

interface Props {
    votes: Array<VoteCount>;
    random?: () => number;
    [key: string]: any;
}

let { votes, random = () => 0, ...rest }: Props = $props();

let stats = getVotingStats();
</script>

<div {...rest} class="summvary text-center">
    <div class="cards-row">
        {#each votes as [vote, count] (vote)}
            <div class="d-inline-block text-center card-wrapper">
                <Card rotation={random()}>{vote}</Card>
                <div class="count">{count}x</div>
            </div>
        {:else}
            <div class="col text-center p-2">No votes</div>
        {/each}
    </div>

    {#if stats && !stats.isUnanimous}
        μ: {stats.mean.toFixed(1)}, median: {stats.median}, σ: {stats.stdDev.toFixed(2)}, Suggested:
        <div class="d-inline-block text-center card-wrapper" style="width: 24px;">
            <Card>{stats.closest}</Card>
        </div>
    {/if}
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
