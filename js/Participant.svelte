<script>
import { fly } from 'svelte/transition';
export let user;
export let isRevealed;
export let i;
export let count;
</script>

<div class="participant" style="transform: rotate({i * (200 / count) - 180}deg) translate(270px) rotate(90deg)">
    {user.name}
    <div class="card" class:isAdmin={user.is_admin} in:fly={{ duration: 800, x: 250, y: 250 }}>
        {#if user.is_spectator}
            👁️
        {:else if user.vote}
            {#if isRevealed}
                {user.vote}
            {:else}
                ?
            {/if}
        {:else}
            ...
        {/if}
    </div>
</div>

<style>
.participant {
    display: block;
    position: absolute;
    text-align: center;
    top: 95%;
    left: 50%;
    width: 4em;
    height: 4em;
    margin: -2em;
    border-radius: 100%;
    border: 1px dotted yellow;
}
.card {
    width: 45px;
    height: 70px;

    border-radius: 6px;
    border: 1px solid blue;
    background-color: rgb(214, 245, 255);
    padding: 6px 2px;
    text-align: center;
    margin: 4px auto;
}
.isAdmin {
    border: 1px solid purple;
}
</style>
