<script lang="ts">
import Card from './Card.svelte';
import type { VoteCount, VotingStats } from './types.d';

interface Props {
    votes: Array<VoteCount>;
    stats?: VotingStats | null;
    random?: () => number;
    [key: string]: any;
}

let { votes, stats, random = () => 0, ...rest }: Props = $props();
</script>

<div {...rest} class="summary text-center">
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
        <div data-testid="suggestion">
            μ: {stats.mean.toFixed(1)}, σ: {stats.stdDev.toFixed(2)}, suggestion:
            <div class="d-inline-block text-center card-wrapper" style="width: 24px;">
                <Card>{stats.closest}</Card>
            </div>
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
