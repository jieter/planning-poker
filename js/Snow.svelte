<script lang="ts">
const FLAKE_COUNT = 50;

const flakes = Array.from({ length: FLAKE_COUNT }, () => ({
    left: Math.random() * 100,
    size: 0.6 + Math.random() * 1.2,
    duration: 8 + Math.random() * 10,
    delay: -Math.random() * 18,
    sway: 10 + Math.random() * 30,
}));
</script>

<div class="snow" aria-hidden="true">
    {#each flakes as flake, i (i)}
        <span
            class="flake"
            style="left: {flake.left}%; font-size: {flake.size}em; animation-duration: {flake.duration}s; animation-delay: {flake.delay}s; --sway: {flake.sway}px">
            ❄
        </span>
    {/each}
</div>

<style>
.snow {
    position: fixed;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 1050;
}

.flake {
    position: absolute;
    top: -2em;
    color: #a8c8e8;
    animation-name: fall;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}

:global([data-bs-theme='dark']) .flake {
    color: #fff;
}

@keyframes fall {
    0% {
        transform: translate(0, 0);
    }
    50% {
        transform: translate(var(--sway), 55vh);
    }
    100% {
        transform: translate(0, 110vh);
    }
}

@media (prefers-reduced-motion: reduce) {
    .snow {
        display: none;
    }
}
</style>
