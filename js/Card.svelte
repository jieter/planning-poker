<script>
export let disabled = true;
export let selected = '';
</script>

<div class="card btn btn-light" class:selected {disabled} on:click on:keypress>
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
}
.selected {
    font-weight: bold;
}
</style>
