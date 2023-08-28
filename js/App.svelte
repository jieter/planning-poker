<script>
import Join from './Join.svelte';
import { jsonScriptContents } from './utils.js';
import Voting from './Voting.svelte';

const url = jsonScriptContents('websocket_url');
</script>

{#if url}
    <Voting />
{:else}
    <Join />
{/if}
