<script>
export let color = null;
export let size = 'regular';

$: height = size == 'sm' ? 45 : 70;
</script>

<div class="deck-card" style="background-color: {color || '#d8f7ec'}; height: {height}px; width: {height * 0.65}px;">
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
    border-radius: 0.25rem;
    transition: background-color 100ms ease-out 200ms;
}
</style>
