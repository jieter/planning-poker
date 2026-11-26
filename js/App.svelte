<script lang="ts">
import BethlehemStar from './BethlehemStar.svelte';
import CandyCane from './CandyCane.svelte';
import Join from './Join.svelte';
import Snow from './Snow.svelte';
import ThemeToggle from './ThemeToggle.svelte';
import { isSnowSeason, jsonScriptContents } from './utils';
import Voting from './Voting.svelte';

const url = jsonScriptContents('websocket_url');
</script>

<ThemeToggle />
{#if isSnowSeason()}
    <Snow />
    <CandyCane />
    <BethlehemStar />
{/if}

{#if url}
    <Voting />
{:else}
    <Join />
{/if}
