<script>
import { onMount } from 'svelte';

export let disabled = true;
export let selected = '';
export let color = null;
export let size = 'regular';

let button;

$: {
    if (button && selected) {
        button.blur();
    }
}
$: height = (size == 'sm') ? 45 : 70;

</script>

<div
    bind:this={button}
    class="card"
    class:selected
    style="background-color: {color || '#d8f7ec'}; height: {height}px; width: {height * 0.65}px"
    {disabled}
    on:click
    on:keypress
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
    transition: margin 100ms ease-out 100ms;
}
.selected {
    font-weight: bold;
    margin-top: -5px !important;
    margin-bottom: 5px !important;
}
</style>
