<script>
import { log, countVotes } from './stores.js';
import Summary from './Summary.svelte';
</script>

<div class="history">
    {#each $log.filter((x) => x.event == 'reveal') as { data }}
        {@const voteSummary = countVotes(data.votes)}
        <div class="voting-round ms-2">
            Round {data.round}
            {#if voteSummary.length == 0}
                <br />no votes
            {/if}
        </div>
        {#if voteSummary.length > 0}
            <div class="small history-item rounded me-1 my-3 p-1">
                <Summary votes={voteSummary} emitConfetti={false} size="sm" />
            </div>
        {/if}
    {/each}
</div>

<style>
.history {
    display: flex;
    overflow-x: scroll;
}
.voting-round {
    font-size: 0.8em;
    writing-mode: vertical-lr;
    color: gray;
}
.history-item {
    background-color: #efefef;
    text-align: left;
    flex-shrink: 0;
}
</style>
