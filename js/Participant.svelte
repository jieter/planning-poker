<script>
import Card from './Card.svelte';

export let user;
export let isRevealed;
export let i;
export let count;
export let rotation;
export let radius;

// Amount of degrees to spread the participants over at the table
const maxAngle = 174;
let angle;
$: {
    angle = -90;
    if (count > 1) {
        // A fixed amount of degrees, or all participants evenly distributed, whatever is smaller.
        angle -= Math.min(20, maxAngle / count) * (i - (count - 1) / 2);
    }
}
</script>

<div class="participant" style="transform: translate(1.3vw) rotate({angle}deg) translate({radius}) rotate(90deg)">
    <strong>{user.name}</strong>
    <Card color={user.is_spectator ? '#effbf7' : undefined} {rotation}>
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
