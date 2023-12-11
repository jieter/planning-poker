<script>
import Card from './Card.svelte';
import PlayerCard from './PlayerCard.svelte';

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
    <strong class="name">{user.name}</strong>
    <PlayerCard vote={user.vote}>
        <Card color="linear-gradient(45deg, #c2c2c2 0%, #FFF 60%)" {rotation}>
            {#if user.is_spectator}
                👁️
            {:else if user.vote}
                {#if isRevealed}
                    {user.vote}
                {:else}
                    <div style="--bgcolor: #cc6060" class="card-back"></div>
                {/if}
            {/if}
        </Card>
    </PlayerCard>
</div>

<style>
.participant {
    display: block;
    position: absolute;
    text-align: center;

    top: 95%;
    left: 50%;
    margin: -4vw;
}

.participant .name {
    font-size: 2vw;
}

.card-back {
    margin: auto;
    width: 85%;
    height: 85%;

    /* Background pattern */
    border: 1px solid var(--bgcolor);
    border-radius: 0.4vw;
    background-size: 0.8vw 0.8vw;
    background-image:
        linear-gradient(45deg, transparent 47%, var(--bgcolor) 47%, var(--bgcolor) 53%, transparent 53%),
        linear-gradient(135deg, transparent 47%, var(--bgcolor) 47%, var(--bgcolor) 53%, transparent 53%);
}
</style>
