<script>
import Card from './Card.svelte';

export let user;
export let isRevealed;
export let i;
export let count;

// Amount of degrees to spread the participants over at the table
const maxAngle = 174;
let angle;
$: {
    angle = -90;
    if (count > 1) {
        // A fixed amount of degrees, or all parcitipants evenly distributed, whatever is smaller.
        angle -= Math.min(20, maxAngle / count) * (i - (count - 1) / 2);
    }
}
</script>

<div class="participant" style="transform: rotate({angle}deg) translate(37.5vw) rotate(90deg)">
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
