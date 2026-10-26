<script lang="ts">
import Card from './Card.svelte';
import PlayerCard from './PlayerCard.svelte';
import type { Participant } from './types.d';

interface Props {
    user: Participant;
    isRevealed: boolean;
    i: number;
    count: number;
    rotation: number;
    radius: number;
}

let { user, isRevealed, i, count, rotation, radius }: Props = $props();

// Amount of degrees to spread the participants over at the table
const MAX_ANGLE = 174;
let angle: number = $derived.by(() => {
    let _angle = -90;
    if (count > 1) {
        // A fixed amount of degrees, or all participants evenly distributed, whatever is smaller.
        _angle -= Math.min(20, MAX_ANGLE / count) * (i - (count - 1) / 2);
    }
    return _angle;
});
</script>

<div
    class="participant"
    style="transform: translate(-50%, -50%) rotate({angle}deg) translate({radius}px) rotate(90deg)">
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

    /* Start at the center of the table, the transform moves the center of the card onto the circle */
    top: var(--radius);
    left: 50%;
    width: 5%;
}

.participant .name {
    position: absolute;
    bottom: 100%;
    margin-bottom: 0.4em;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.2em;
    text-wrap: nowrap;
    width: 7em;
    overflow-x: hidden;
    text-overflow: ellipsis;
}

.card-back {
    margin: auto;
    width: 84%;
    height: 87%;

    /* cross-hatch background pattern */
    border: 1px solid #cc6060;
    border-radius: 0.4vw;
    background-size: 0.8vw 0.8vw;
    background-image:
        linear-gradient(45deg, transparent 47%, #cc6060 47%, #cc6060 53%, transparent 53%),
        linear-gradient(135deg, transparent 47%, #cc6060 47%, #cc6060 53%, transparent 53%);
}
</style>
