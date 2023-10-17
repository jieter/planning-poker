<script>
import { log, countVotes } from './stores.js';
import Summary from './Summary.svelte';
</script>

{#each $log.filter((x) => x.event == 'reveal') as { data }}
    {@const voteSummary = countVotes(data.votes)}
    <div class="small">
        Round {data.round}:
        {#if voteSummary.length == 0}
            no votes
        {:else}
            <Summary votes={voteSummary} emitConfetti={false} size="sm" />
        {/if}
    </div>
{/each}
