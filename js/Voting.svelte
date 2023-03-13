<script>
import Card from './Card.svelte';
import Participant from './Participant.svelte';
import pokerStore from './stores.js';
import { jsonScriptContents } from './utils.js';

const url = jsonScriptContents('websocket_url');
const { user, participants, isRevealed, choices, update } = pokerStore(url);

const vote = (value) => () => {
    if (!$isRevealed) {
        update('vote', { value: value });
    }
};
const reveal = () => update('reveal');
const clear = () => update('clear');

function add() {
    participants.update((current) => {
        const randInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
        const randomElement = (array) => array[Math.floor(Math.random() * array.length)];
        const fakeNames = ['Bob', 'Charlie', 'Erin', 'Felix', 'Gude', 'Henri', 'Irma', 'June', 'Kevin'];

        const fake = { id: randInt(10000, 20000), name: randomElement(fakeNames), vote: randomElement(['1', '2']) };

        return [...current, fake];
    });
}

let votes;
function voteSummary() {
    const _votes = new Proxy(
        {},
        {
            get: (target, name) => (name in target ? target[name] : 0),
        }
    );
    $participants.forEach((user) => {
        if (user.vote != null) {
            _votes[user.vote] += 1;
        }
    });

    return Object.entries(_votes).sort((a, b) => b[1] - a[1]);
}

$: votes = voteSummary($isRevealed);
</script>

<div class="participants">
    {#each $participants as user, i (user.id)}
        <Participant isRevealed={$isRevealed} {user} {i} count={$participants.length} />
    {/each}
    <div class="controls">
        {#if $isRevealed}
            <div class="row">
                {#each votes as [vote, count] (vote)}
                    <div class="col">
                        <Card>
                            <strong>{vote}</strong>
                            <span class="text-muted">{count}x</span>
                        </Card>
                    </div>
                {:else}
                    <div class="col text-center">No votes</div>
                {/each}
            </div>
        {/if}
        {#if $user.is_spectator}
            You joined as spectator
        {/if}
        {#if $user.is_admin}
            <div class="btn-group">
                <button class="btn btn-primary" on:click={reveal} disabled={$isRevealed}>Reveal</button>
                <button class="btn btn-danger" on:click={clear}>Clear</button>
            </div>
        {/if}
    </div>
</div>
{#if !$user.is_spectator}
    <div class="text-center">
        <div class="btn-group">
            {#each $choices as choice}
                <button class="btn btn-secondary" on:click={vote(choice)} disabled={$isRevealed}>{choice}</button>
            {/each}
        </div>
    </div>
{/if}

{#if $user.name == 'Jieter'}
    <button on:click={add} class="btn btn-light">Add fake users</button>
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
    transform: translateX(-50%) translateY(-10px);
}
</style>
