<svg class="star" viewBox="0 0 60 120" aria-hidden="true">
    <!-- Four rays, the bottom one long, pointing down to the stable -->
    <path d="M 30 2 Q 33 25 56 28 Q 33 31 30 118 Q 27 31 4 28 Q 27 25 30 2 Z" />
</svg>

<style>
.star {
    position: fixed;
    top: 4rem;
    left: 6%;
    height: 60px;
    pointer-events: none;
    /* behind the page content, so it never covers inputs */
    z-index: -1;
    fill: #f2c230;
    stroke: #c99a10;
    stroke-width: 1.5;
    stroke-linejoin: round;
    filter: drop-shadow(0 0 0.4rem rgba(242, 194, 48, 0.6));
    animation: twinkle 4s ease-in-out infinite;
}

@keyframes twinkle {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.7;
    }
}

@media (prefers-reduced-motion: reduce) {
    .star {
        animation: none;
    }
}
</style>
