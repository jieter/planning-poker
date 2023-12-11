<script>
export let vote;
</script>

<div class="player-card" class:vote>
    <slot />
</div>

<style>
.player-card {
    position: relative;
    opacity: 0;
    top: -50px;
}

.vote {
    opacity: 100 !important;
    top: 0px !important;
    transition: all 525ms cubic-bezier(0, 0, 0, 1);
}
</style>
