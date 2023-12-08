<script>
export let color = null;
export let size = 'regular';
export let rotation = 0;

$: height = size == 'sm' ? '4.5vw' : '7vw';
$: width = size == 'sm' ? '2.6vw' : '4vw';
</script>

<div
    class="deck-card"
    style="transform: rotate({rotation}deg); background-color: {color || '#d8f7ec'}; height: {height}; width: {width};">
    <slot />
</div>

<style>
.deck-card {
    display: flex;
    padding: 6px 2px;
    justify-content: center;
    align-content: center;
    margin: 2px 2px;
    flex-direction: column;
    border: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: 0.4vw;
    transition: background-color 100ms ease-out 200ms;
    filter: drop-shadow(0 0 0.5rem rgba(100, 100, 100, 0.3));
    transform: rotate(2deg);
    font-size: 1.85vw;
    transition: transform 200ms ease-in-out 100ms;
}
</style>
