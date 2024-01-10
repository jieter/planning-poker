<script>
import Join from './Join.svelte';
import { jsonScriptContents } from './utils';
import Voting from './Voting.svelte';

export let websocketUrl = jsonScriptContents('websocket_url');
</script>

{#if websocketUrl}
    <Voting />
{:else}
    <Join />
{/if}
