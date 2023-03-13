<script>
import { fly } from 'svelte/transition';
export let user;
export let isRevealed;
export let i;
export let count;

let startAngle, spread, angle;
$: {
    if (count == 1) {
        angle = -90;
    } else {
        const maxAngle = 176;
        const minSpread = 90;
        const maxSpread = maxAngle - 4;
        spread = Math.min(maxSpread, minSpread + (maxSpread - minSpread) * (count / 8));

        startAngle = Math.min(maxAngle, 135 + (maxAngle - 135) * (count / 8));

        angle = i * (spread / (count - 1)) - startAngle;
    }
}
</script>

<div class="participant" style="transform: rotate({angle}deg) translate(33vw) rotate(90deg)">
    {user.name}
    <div class="card" class:isAdmin={user.is_admin} in:fly={{ duration: 800, x: 200, y: 200 }}>
        {#if user.is_spectator}
            👁️
        {:else if user.vote}
            {#if isRevealed}
                {user.vote}
            {:else}
                ⌛
            {/if}
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
    border: 2px solid blue;
}
</style>
