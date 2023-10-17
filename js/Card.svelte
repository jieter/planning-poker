<script>
export let color = null;
export let size = 'regular';

$: height = size == 'sm' ? 45 : 70;
</script>

<div
    class="card"
    style="background-color: {color || '#d8f7ec'}; height: {height}px; width: {height * 0.65}px;"
    role="button"
    tabindex="0">
    <slot />
</div>

<style>
.card {
    display: flex;
    padding: 6px 2px;
    justify-content: center;
    align-content: center;
    margin: 2px 2px;
    transition: margin 100ms ease-out 200ms;
    transition: background-color 100ms ease-out 200ms;
}
</style>
