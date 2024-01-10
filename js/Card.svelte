<script lang="ts">
export let color: string | null = null;
export let size: string = 'regular';
export let rotation: number = 0;

$: height = size == 'sm' ? '4.5vw' : '7vw';
$: width = size == 'sm' ? '2.6vw' : '4vw';
$: fontSize = size == 'sm' ? '1.4vw' : '1.85vw';
</script>

<div
    class="deck-card"
    style="transform: rotate({rotation}deg); background: {color ||
        '#FFF'}; height: {height}; width: {width}; font-size: {fontSize}">
    <slot />
</div>

<style>
.deck-card {
    display: flex;
    justify-content: center;
    align-content: center;
    color: #444;
    margin: 2px 2px;
    flex-direction: column;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0.4vw;
    transition: background-color 100ms ease-out 200ms;
    filter: drop-shadow(0 0 0.5rem rgba(100, 100, 100, 0.3));
    transform: rotate(2deg);
    transition: transform 200ms ease-in-out 100ms;
}
</style>
