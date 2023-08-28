<script>
import { onMount } from 'svelte';

import Card from './Card.svelte';
import Participant from './Participant.svelte';
import Settings from './Settings.svelte';
import Debug from './Debug.svelte';
import {
    choices,
    clearVotes,
    connect,
    error,
    isRevealed,
    participants,
    revealVotes,
    update,
    user,
    castVote,
    votes,
} from './stores.js';
import { jsonScriptContents } from './utils.js';
import Summary from './Summary.svelte';

let debugOn = false;
onMount(() => {
    const url = jsonScriptContents('websocket_url');
    connect(url);
    debugOn = new URLSearchParams(window.location.search).get('debug');
});

let numParcitipants;
$: numParcitipants = $participants.length;
$: votingComplete = $participants.every((p) => p.is_spectator || p.vote);
</script>

{#if $error}
    <div class="fixed-top">
        <div class="alert alert-danger" role="alert">{$error}</div>
    </div>
{/if}
<div class="participants">
    {#each $participants as user, i (user.id)}
        <Participant isRevealed={$isRevealed} {user} {i} count={numParcitipants} />
    {/each}
    <div class="controls">
        {#if $isRevealed}
            <Summary votes={$votes} />
        {/if}
        <div class="d-flex justify-content-center mb-3">
            <div class="voting-status">
                {#if !$isRevealed && votingComplete}
                    ✓
                {/if}
            </div>
            {#if $isRevealed}
                <button class="btn btn-warning" on:click={clearVotes}>Clear</button>
            {:else}
                <button class="btn btn-primary" on:click={revealVotes}>Reveal </button>
            {/if}
        </div>
    </div>
</div>
<div class="container text-center">
    <div class="row">
        <div class="col">
            {#if $user.is_spectator}
                You joined as spectator.<br />
                I want to
                <button on:click={() => update('settings', { is_spectator: false })} class="btn btn-light btn-sm">
                    become a voter
                </button>
            {:else}
                <div class="d-flex justify-content-center">
                    {#each $choices as choice}
                        <Card
                            on:click={castVote(choice)}
                            on:keypress={castVote(choice)}
                            disabled={$isRevealed}
                            selected={choice == $user.vote}>
                            {choice}
                        </Card>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
    <Settings />
</div>

{#if debugOn}
    <Debug />
{/if}

<style>
.participants {
    width: 80vw;
    height: 40vw;
    border-radius: 40vw 40vw 0 0;
    position: relative;
    background-color: #eee;
    margin: 4vh auto;
}
.controls {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
}
.voting-status {
    width: 1.5em;
    color: green;
}
</style>
