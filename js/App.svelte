<script>
import Join from './Join.svelte';
import Voting from './Voting.svelte';

import { jsonScriptContents } from './utils.js';

const url = jsonScriptContents('websocket_url');
</script>

<h1>Planning poker</h1>

{#if url}
    <Voting />
{:else}
    <Join />
{/if}
