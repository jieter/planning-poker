<script lang="ts">
interface Props {
    vote: string | null;
    children?: import('svelte').Snippet;
}

let { vote, children }: Props = $props();
</script>

<div class="player-card" class:vote>
    {@render children?.()}
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
    /* cubic-bezier can be tested with https://10015.io/tools/css-cubic-bezier-generator */
    transition: all 525ms cubic-bezier(0, 0.5, 0, 0.9);
}
</style>
