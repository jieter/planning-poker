<script>
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
</script>

<div class="participants">
    {#each $participants as user, i (user.id)}
        <Participant isRevealed={$isRevealed} {user} {i} count={$participants.length} />
    {:else}
        Nobody here yet.
    {/each}
</div>
{#if $user.is_spectator}
    You joined as spectator
{:else}
    <div class="choices">
        {#each $choices as choice}
            <button class="btn btn-secondary" on:click={vote(choice)} disabled={$isRevealed}>{choice}</button>
            &nbsp;
        {/each}
    </div>
{/if}
<br />
{#if $user.is_admin}
    <button class="btn btn-primary" on:click={reveal} on:keypress={reveal}>Reveal</button>
    <button class="btn btn-danger" on:click={clear} on:keypress={clear}>Clear</button>
{/if}
<br />

user: <code>{JSON.stringify($user, null, 2)}</code><br />
participants: <code>{JSON.stringify($participants, null, 2)}</code>

<br />

<style>
.participants {
    width: 550px;
    height: 275px;
    border-radius: 275px 275px 0 0;
    position: relative;
    background-color: #eee;
    margin: 20px auto;
}
.choices {
    text-align: center;
}
</style>
