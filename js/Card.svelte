<script>
export let color = null;
export let size = 'regular';

$: height = size == 'sm' ? 45 : 70;
</script>

<div class="deck-card" style="background-color: {color || '#d8f7ec'}; height: 7vw; width: 4vw;">
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
    filter: drop-shadow(0 0 0.50rem rgba(100, 100, 100, 0.3));
}
</style>
