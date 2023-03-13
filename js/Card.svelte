<script>
export let isAdmin;
</script>

<div class="card" class:isAdmin>
    <slot />
</div>

<style>
.card {
    width: 45px;
    height: 70px;

    border-radius: 6px;
    border: 1px solid blue;
    background-color: rgb(214, 245, 255);
    padding: 6px 2px;
    text-align: center;
    margin: 4px auto;
}
.isAdmin {
    border: 2px solid blue;
}
</style>
