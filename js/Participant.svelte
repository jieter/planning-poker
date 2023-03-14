<script>
import Card from './Card.svelte';

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
    <strong>{user.name}</strong>
    <Card>
        {#if user.is_spectator}
            👁️
        {:else if user.vote}
            {#if isRevealed}
                {user.vote}
            {:else}
                ⌛
            {/if}
        {/if}
    </Card>
</div>

<style>
.participant {
    display: block;
    position: absolute;
    text-align: center;

    top: 95%;
    left: 50%;

    margin: -2em;
}
</style>
