<script>
import { log, countVotes } from './stores.js';
import Summary from './Summary.svelte';
</script>

<div class="d-flex overflow-scroll">
    {#each $log.filter((x) => x.event == 'reveal') as { data }}
        {@const voteSummary = countVotes(data.votes)}
        <small class="voting-round ms-2 text-muted">
            Round {data.round}
            {#if voteSummary.length == 0}
                <br />no votes
            {/if}
        </small>
        {#if voteSummary.length > 0}
            <div class="small history-item text-start rounded flex-shrink-0 me-1 my-3 p-1">
                <Summary votes={voteSummary} emitConfetti={false} size="sm" />
            </div>
        {/if}
    {/each}
</div>

<style>
.voting-round {
    writing-mode: vertical-lr;
}
.history-item {
    background-color: #efefef;
}
</style>
