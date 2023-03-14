<script>
export let disabled = true;
export let selected = '';
</script>

<div class="card btn" class:selected {disabled} on:click on:keypress>
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
    background-color: #ebfaf5;
    transition: margin 100ms ease-out 100ms;
}
.selected {
    font-weight: bold;
    margin-top: -5px !important;
    margin-bottom: 5px !important;
}
</style>
