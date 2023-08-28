<script>
import { onMount } from 'svelte';

export let disabled = true;
export let selected = '';
export let color = null;

let button;

$: {
    if (button && selected) {
        button.blur();
    }
}
</script>

<div
    bind:this={button}
    class="card btn"
    class:selected
    style="background-color: {color || '#d8f7ec'}"
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

    width: 45px;
    height: 70px;

    padding: 6px 2px;
    justify-content: center;
    align-content: center;
    margin: 4px 2px;
    transition: margin 100ms ease-out 100ms;
}
.selected {
    font-weight: bold;
    margin-top: -5px !important;
    margin-bottom: 5px !important;
}
</style>
