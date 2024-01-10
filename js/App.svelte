<script>
import Join from './Join.svelte';
import Voting from './Voting.svelte';
import { jsonScriptContents } from './utils';

export let websocketUrl = jsonScriptContents('websocket_url');;
</script>

{#if websocketUrl}
    <Voting />
{:else}
    <Join />
{/if}
