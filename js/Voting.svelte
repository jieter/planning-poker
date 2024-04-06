<script lang="ts">
import { onMount } from 'svelte';
import { confetti } from '@neoconfetti/svelte';

import Card from './Card.svelte';
import Debug from './Debug.svelte';
import History from './History.svelte';
import Participant from './Participant.svelte';
import Settings from './Settings.svelte';
import {
    choices,
    connect,
    error,
    isRevealed,
    participants,
    update,
    user,
    castVote,
    votes,
    icon,
    revealCount,
    showConfetti,
} from './stores';
import Summary from './Summary.svelte';
import { jsonScriptContents, changeFavicon, pseudoRandomGenerator } from './utils';

let debugOn = false;
onMount(() => {
    connect(jsonScriptContents('websocket_url'));
    debugOn = !!new URLSearchParams(window.location.search).get('debug');
});
$: changeFavicon($icon);

let random: () => number;
$: random = pseudoRandomGenerator($revealCount, -3, 3);

let innerWidth: number;

// Radius of the table in pixels, depending on the window width, with a maximum
let radius = 500;
$: if (innerWidth) {
    radius = Math.min(1000, innerWidth) / 2.2;
}
</script>

<svelte:window bind:innerWidth />
{#if $error}
    <div class="fixed-top">
        <div class="alert alert-danger" role="alert">{$error}</div>
    </div>
{/if}

<div class="participants mt-5" style="--radius: {radius}px">
    {#each $participants as user, i (user.id)}
        <Participant
            isRevealed={$isRevealed}
            {user}
            {i}
            count={$participants.length}
            radius={radius * 0.94}
            rotation={random()} />
    {/each}
    {#if $isRevealed}
        <div class="controls">
            {#if $showConfetti}
                <div use:confetti />
            {/if}
            <Summary votes={$votes} {random} style="color: white;" class="p-2 mb-2 text-center rounded" />
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
                            class="vote-button p-0"
                            class:selected={choice == $user.vote}>
                            <Card background="#fff">{choice}</Card>
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
    width: calc(var(--radius) * 1.98);
    height: var(--radius);
    border-radius: var(--radius) var(--radius) 10px 10px;
    background: radial-gradient(circle at bottom, #3e803f 0%, #093d15 58%, #743f11 58.5%, #f0a25c);
    position: relative;
    margin: 4vh auto;
}
.controls {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
}
.vote-button {
    width: 40px;
    border: 0px !important;
    margin: 0 2px !important;
}
button.selected {
    font-weight: bold;
    margin: -8px 2px 8px 2px !important;
    transition:
        margin 100ms ease-in-out 100ms,
        font-weight 100ms ease-out 100ms;
}
</style>
