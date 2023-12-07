<script>
import { onMount } from 'svelte';

import Card from './Card.svelte';
import Debug from './Debug.svelte';
import History from './History.svelte';
import Participant from './Participant.svelte';
import Settings from './Settings.svelte';
import { choices, connect, error, isRevealed, participants, update, user, castVote, votes, icon } from './stores.js';
import Summary from './Summary.svelte';
import { jsonScriptContents, changeFavicon } from './utils.js';

let debugOn = false;
onMount(() => {
    connect(jsonScriptContents('websocket_url'));
    debugOn = new URLSearchParams(window.location.search).get('debug');
});
$: changeFavicon($icon);
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
            <Summary votes={$votes} style="background-color: #e6e6e6;" class="p-2 mb-2 text-center rounded" />
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
                        <button
                            on:click={castVote(choice)}
                            on:keypress={castVote(choice)}
                            disabled={$isRevealed}
                            class="btn m-0 p-0"
                            class:selected={choice == $user.vote}>
                            <Card color={$isRevealed ? '#eee' : null}>
                                {choice}
                            </Card>
                        </button>
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

<div class="my-5">&nbsp;</div>

<div class="fixed-bottom bg-white" style="border-top: 1px solid rgba(0, 0, 0, 0.125);">
    <History />
</div>

<style>
.participants {
    width: 80vw;
    height: 40vw;
    border-radius: 40vw 40vw 0 0;
    background: radial-gradient(circle at bottom, #3e803f 0%, #093d15 56%, #743f11 56%, #f0a25c);
    position: relative;
    /* background-color: #eee; */
    margin: 4vh auto;
}
.controls {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
}
button.selected {
    font-weight: bold;
    margin: -8px 0 8px 0 !important;
    transition:
        margin 100ms ease-in-out 100ms,
        font-weight 100ms ease-out 100ms;
}
</style>
