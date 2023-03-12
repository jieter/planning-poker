<script>
import Join from './Join.svelte';
import { jsonScriptContents } from './utils.js';
import Voting from './Voting.svelte';

const url = jsonScriptContents('websocket_url');
</script>

<h1>Planning poker</h1>

{#if url}
    <Voting />
{:else}
    <Join />
{/if}

<br />

<a href="/">New poker session</a>
