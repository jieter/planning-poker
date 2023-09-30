<script>
import { onMount } from 'svelte';

import Card from './Card.svelte';
import Participant from './Participant.svelte';
import Settings from './Settings.svelte';
import Debug from './Debug.svelte';
import { choices, connect, error, isRevealed, participants, update, user, castVote, votes } from './stores.js';
import { jsonScriptContents } from './utils.js';
import Summary from './Summary.svelte';

let debugOn = false;
onMount(() => {
    connect(jsonScriptContents('websocket_url'));
    debugOn = new URLSearchParams(window.location.search).get('debug');
});
</script>

{#if $error}
    <div class="fixed-top">
        <div class="alert alert-danger" role="alert">{$error}</div>
    </div>
{/if}
<div class="participants">
    {#each $participants as user, i (user.id)}
        <Participant isRevealed={$isRevealed} {user} {i} count={$participants.length} />
    {/each}
    {#if $isRevealed}
        <div class="controls">
            <Summary votes={$votes} />
        </div>
    {/if}
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
    <div class="row">
        <Settings />
    </div>
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
</style>
