<script>
import { log, countVotes, revealCount, votes } from './stores.js';
import Summary from './Summary.svelte';

let collapsed = true;

function toggleCollapsed() {
    collapsed = !collapsed;
}
</script>

<div
    role="button"
    class="text-muted my-1 mx-2 small"
    on:click={toggleCollapsed}
    on:keypress={toggleCollapsed}
    tabindex="0">
    {#if $revealCount == 0}
        No history yet.
    {:else if $revealCount == 1}
        {#if collapsed}Show{:else}Hide{/if} previous votes
    {:else}
        {#if collapsed}Show{:else}Hide{/if} previous {$revealCount} rounds
    {/if}

    {#if $revealCount > 0}
        {#if collapsed}
            ▲{:else}
            ▼{/if}
    {/if}
</div>
{#if !collapsed}
    <div class="d-flex overflow-scroll mb-2 text-muted">
        {#each $log.filter((x) => x.event == 'reveal') as { data }}
            {@const voteSummary = countVotes(data.votes)}
            <small class="voting-round ms-1 text-center">
                Round {data.round}
                {#if voteSummary.length == 0}
                    <br />no votes
                {/if}
            </small>
            {#if voteSummary.length > 0}
                <div class="small history-item text-start rounded flex-shrink-0 m-1 p-1">
                    <Summary votes={voteSummary} emitConfetti={false} size="sm" />
                </div>
            {/if}
        {/each}
    </div>
{/if}

<style>
.voting-round {
    writing-mode: vertical-lr;
}
.history-item {
    background-color: #efefef;
}
</style>
