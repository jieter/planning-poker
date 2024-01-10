<script>
import Join from './Join.svelte';
import { jsonScriptContents } from './utils';
import Voting from './Voting.svelte';

export let url = jsonScriptContents('websocket_url');
</script>

{#if url}
    <Voting />
{:else}
    <Join />
{/if}
