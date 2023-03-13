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
        $user.vote = value;
    }
};
const reveal = () => update('reveal');
const clear = () => {
    $user.vote = null;
    update('clear');
}

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
                    <div class="col text-center">
                        <Card>{vote}</Card>
                        <span class="text-muted">{count}x</span>
                    </div>
                {:else}
                    <div class="col text-center">No votes</div>
                {/each}
            </div>
        {/if}
        {#if $user.is_spectator}
            You joined as spectator
        {/if}
        <div class="d-flex justify-content-center mb-3">
            {#if $isRevealed}
                <button class="btn btn-warning" on:click={clear}>Clear</button>
            {:else}
                <button class="btn btn-primary" on:click={reveal}>Reveal</button>
            {/if}
        </div>
    </div>
</div>
{#if !$user.is_spectator}
    <div class="d-flex justify-content-center mb-3">
        {#each $choices as choice}
            <Card
                on:click={vote(choice)}
                on:keypress={vote(choice)}
                disabled={$isRevealed}
                selected={choice == $user.vote}>
                {choice}
            </Card>
        {/each}
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
    transform: translateX(-50%);
}
</style>
