<script lang="ts">
const BURST_COUNT = 24;
const FINALE_COUNT = 4;
const COLORS = ['#ff4d4d', '#ffd700', '#4dd2ff', '#7cff4d', '#ff66e0', '#ffffff', '#ff9933', '#b366ff'];

const between = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

function burst(delay: number) {
    const width = window.innerWidth;
    const top = between(8, 50);
    const rise = (window.innerHeight * (100 - top)) / 100;
    // launched from the ground at a random angle, flipped if it would explode off-screen
    const launch = between(0.1, 0.9) * width;
    let angle = between(-25, 25);
    let left = launch + rise * Math.tan((angle * Math.PI) / 180);
    if (left < 0.05 * width || left > 0.95 * width) {
        angle = -angle;
        left = launch + rise * Math.tan((angle * Math.PI) / 180);
    }
    const sparkCount = Math.round(between(28, 56));
    // a ring has all sparks at the same distance, a peony scatters them
    const ring = Math.random() < 0.35;
    return {
        left,
        top,
        rise,
        drift: launch - left,
        tilt: angle,
        riseTime: between(0.35, 0.65),
        delay,
        color: pick(COLORS),
        radius: between(120, 320),
        gravity: between(50, 220),
        sparks: Array.from({ length: sparkCount }, (_, j) => ({
            angle: (360 / sparkCount) * (j + between(-0.5, 0.5)),
            reach: ring ? between(0.9, 1) : between(0.3, 1.1),
            duration: between(1.4, 2.8),
            lag: between(0, 0.1),
        })),
    };
}

let time = 0;
const bursts = [
    ...Array.from({ length: BURST_COUNT }, () => burst((time += between(0.05, 0.35)))),
    // a finale: several bursts at almost the same time
    ...Array.from({ length: FINALE_COUNT }, () => burst(time + 0.3 + between(0, 0.2))),
];
</script>

<div class="fireworks" aria-hidden="true">
    {#each bursts as burst, i (i)}
        <div
            class="burst"
            style="left: {burst.left}px; top: {burst.top}%; --color: {burst.color}; --radius: {burst.radius}px; --delay: {burst.delay}s; --rise: {burst.rise}px; --drift: {burst.drift}px; --tilt: {burst.tilt}deg; --rise-time: {burst.riseTime}s; --gravity: {burst.gravity}px">
            <span class="rocket"></span>
            <span class="flash"></span>
            <div class="sparks">
                {#each burst.sparks as spark, j (j)}
                    <span
                        class="spark"
                        style="--angle: {spark.angle}deg; --reach: {spark.reach}; --duration: {spark.duration}s; --lag: {spark.lag}s"
                    ></span>
                {/each}
            </div>
        </div>
    {/each}
</div>

<style>
.fireworks {
    position: fixed;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 1060;
}

.burst {
    position: absolute;
    --explode-at: calc(var(--delay) + var(--rise-time));
}

/* The rocket shooting up from the bottom of the screen to the burst point */
.rocket {
    position: absolute;
    width: 3px;
    height: 40px;
    margin-left: -1.5px;
    border-radius: 2px;
    background: linear-gradient(to bottom, #fff, var(--color) 30%, transparent);
    opacity: 0;
    animation: rise var(--rise-time) cubic-bezier(0.2, 0.6, 0.4, 1) var(--delay) forwards;
}

@keyframes rise {
    0% {
        transform: translate(var(--drift), var(--rise)) rotate(var(--tilt));
        opacity: 1;
    }
    95% {
        opacity: 1;
    }
    100% {
        transform: translate(0, 0) rotate(var(--tilt));
        opacity: 0;
    }
}

/* A short bright flash when the rocket explodes */
.flash {
    position: absolute;
    width: 120px;
    height: 120px;
    margin: -60px;
    border-radius: 50%;
    background: radial-gradient(circle, #fff 0%, var(--color) 30%, transparent 70%);
    opacity: 0;
    animation: flash 0.5s ease-out var(--explode-at) forwards;
}

@keyframes flash {
    0% {
        transform: scale(0.2);
        opacity: 1;
    }
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

/* Gravity: the whole cloud of sparks sinks while they fly outward */
.sparks {
    position: absolute;
    animation: fall 2.8s cubic-bezier(0.5, 0, 1, 1) var(--explode-at) both;
}

@keyframes fall {
    0% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(var(--gravity));
    }
}

.spark {
    position: absolute;
    width: 16px;
    height: 3px;
    margin: -1.5px -8px;
    border-radius: 2px;
    background: linear-gradient(to right, transparent, var(--color) 50%, #fff);
    box-shadow: 0 0 8px 2px var(--color);
    opacity: 0;
    animation: explode var(--duration) cubic-bezier(0.05, 0.9, 0.3, 1) calc(var(--explode-at) + var(--lag)) forwards;
}

@keyframes explode {
    0% {
        transform: rotate(var(--angle)) translateX(0) scaleX(2);
        opacity: 1;
    }
    60% {
        opacity: 1;
    }
    80% {
        opacity: 0.4;
    }
    85% {
        opacity: 0.9;
    }
    100% {
        transform: rotate(var(--angle)) translateX(calc(var(--radius) * var(--reach))) scaleX(0.4);
        opacity: 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    .fireworks {
        display: none;
    }
}
</style>
