<script lang="ts">
import Join from './Join.svelte';
import ThemeToggle from './ThemeToggle.svelte';
import { jsonScriptContents } from './utils';
import Voting from './Voting.svelte';

const url = jsonScriptContents('websocket_url');
</script>

<ThemeToggle />

{#if url}
    <Voting />
{:else}
    <Join />
{/if}
