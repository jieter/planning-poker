<script>
import { confetti } from '@neoconfetti/svelte';

import Card from './Card.svelte';
import Participant from './Participant.svelte';
import pokerStores from './stores.js';
import { jsonScriptContents } from './utils.js';

const isProduction = !window.location.host.includes('localhost');

const url = jsonScriptContents('websocket_url');
const { user, participants, isRevealed, choices, votes, revealVotes, clearVotes, vote, changeDeck, error, update } =
    pokerStores(url);

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
            {#if $votes && $votes.length == 1 && $votes[0][1] > 1}
                <div use:confetti />
            {/if}
            <div class="summary rounded mb-3 text-center">
                {#each $votes as [vote, count] (vote)}
                    <div class="d-inline-block text-center m-2">
                        <Card>{vote}</Card>
                        <div class="text-muted">{count}x</div>
                    </div>
                {:else}
                    <div class="col text-center">No votes</div>
                {/each}
            </div>
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
                <button class="btn btn-primary" on:click={revealVotes}>Reveal</button>
            {/if}
        </div>
    </div>
</div>

<div class="d-flex justify-content-center mb-3">
    {#if $user.is_spectator}
        You joined as spectator.<br />
        Current deck: {$choices.join(', ')}.
    {:else}
        {#each $choices as choice}
            <Card
                on:click={vote(choice)}
                on:keypress={vote(choice)}
                disabled={$isRevealed}
                selected={choice == $user.vote}>
                {choice}
            </Card>
        {/each}
    {/if}
</div>

<div class="d-flex justify-content-center mb-3">
    {#if $isRevealed}
        <button on:click={changeDeck} class="btn btn-secondary"> Change deck </button>
    {:else}
        <button disabled={true} class="btn btn-light"> Reveal first! </button>
    {/if}
</div>

{#if !isProduction}
    <button on:click={() => update('add_fakes')} class="btn btn-danger">Add fake users</button>
    <button on:click={() => update('fake_votes')} class="btn btn-danger">Fake votes</button>
{/if}

<style>
.participants {
    width: 70vw;
    height: 35vw;
    border-radius: 35vw 35vw 0 0;
    position: relative;
    background-color: #eee;
    margin: 20px auto;
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
.summary {
    background-color: #e6e6e6;
}
</style>
