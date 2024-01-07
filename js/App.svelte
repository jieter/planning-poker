<script>
import Join from './Join.svelte';
import Voting from './Voting.svelte';

export let websocketUrl;
</script>

{#if websocketUrl}
    <Voting />
{:else}
    <Join />
{/if}
