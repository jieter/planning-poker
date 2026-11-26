<script lang="ts">
// A hook: straight up from the bottom, then a half circle curling down to the left.
const path = 'M 72 192 L 72 52 A 25 25 0 0 0 22 52 L 22 68';
</script>

<svg class="candy-cane" viewBox="0 0 100 200" aria-hidden="true">
    <defs>
        <pattern
            id="candy-cane-stripes"
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(40)">
            <rect width="14" height="14" fill="#fff" />
            <rect width="6" height="14" fill="#d42a2a" />
        </pattern>
    </defs>
    <!-- Outline, so the white stripes are visible on a light background -->
    <path d={path} stroke="#ccc" stroke-width="17" />
    <path d={path} stroke="url(#candy-cane-stripes)" stroke-width="15" />
</svg>

<style>
.candy-cane {
    position: fixed;
    top: 30%;
    right: -25px;
    height: 160px;
    transform: rotate(-20deg);
    pointer-events: none;
    z-index: 1040;
    fill: none;
    stroke-linecap: round;
}
</style>
