<script lang="ts">
export let rotation: number = 0;
export let background: string = 'linear-gradient(45deg, #c2c2c2 0%, #fff 60%);';
</script>

<div class="deck-card" style="transform: rotate({rotation}deg); background: {background}">
    <slot />
</div>

<style>
.deck-card {
    display: flex;
    width: 100%;
    aspect-ratio: 1 / 1.7;

    justify-content: center;
    align-content: center;

    color: #444;

    font-size: 1em;
    margin: 2px;
    flex-direction: column;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 5%;
    transition: background-color 100ms ease-out 200ms transform 200ms ease-in-out 100ms;

    filter: drop-shadow(0 0 0.5rem rgba(100, 100, 100, 0.3));
}
</style>
