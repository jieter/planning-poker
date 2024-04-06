<script lang="ts">
import Card from './Card.svelte';
import PlayerCard from './PlayerCard.svelte';
import type { Participant } from './types.d';

export let user: Participant;
export let isRevealed: boolean;
export let i: number;
export let count: number;
export let rotation: number;
export let radius: number;

// Amount of degrees to spread the participants over at the table
const maxAngle = 174;
let angle: number;
$: {
    angle = -90;
    if (count > 1) {
        // A fixed amount of degrees, or all participants evenly distributed, whatever is smaller.
        angle -= Math.min(20, maxAngle / count) * (i - (count - 1) / 2);
    }
}
</script>

<div class="participant" style="transform: translate(1.3vw) rotate({angle}deg) translate({radius}px) rotate(90deg)">
    <strong class="name">{user.name}</strong>
    {#if user.is_spectator}
        <Card {rotation}>👁️</Card>
    {:else}
        <PlayerCard vote={user.vote}>
            <Card {rotation}>
                {#if isRevealed}
                    {user.vote}
                {:else}
                    <div class="card-back"></div>
                {/if}
            </Card>
        </PlayerCard>
    {/if}
</div>

<style>
.participant {
    display: block;
    position: absolute;
    text-align: center;

    top: 95%;
    left: 50%;
    margin: -40px;
    width: 5%;
}

.participant .name {
    font-size: 1.2em;
}

.card-back {
    margin: auto;
    width: 84%;
    height: 87%;

    /* cross-hatch background pattern */
    border: 1px solid #cc6060;
    border-radius: 0.4vw;
    background-size: 0.8vw 0.8vw;
    background-image: linear-gradient(45deg, transparent 47%, #cc6060 47%, #cc6060 53%, transparent 53%),
        linear-gradient(135deg, transparent 47%, #cc6060 47%, #cc6060 53%, transparent 53%);
}
</style>
