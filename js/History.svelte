<script>
import {log} from './stores.js';
import Summary from './Summary.svelte';

function summary(votes) {
    const _votes = new Proxy({}, { get: (d, key) => (key in d ? d[key] : 0) });
    votes.forEach((vote) => {
        if (vote != null) {
            _votes[vote] += 1;
        }
    })
    return Object.entries(_votes).sort((a, b) => b[1] - a[1]);
}
</script>

{#each $log.filter(x => x.event == 'reveal') as {data}}
    {@const voteSummary = summary(data.votes)}
    <div class="small">
        Round {data.round}:
        {#if voteSummary.length == 0}
            no votes
        {:else}
            <Summary votes={voteSummary} position='start' size='sm' />
        {/if}
    </div>
{/each}
