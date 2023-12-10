<script>
export let color = null;
export let size = 'regular';
export let rotation = 0;
export let player = false;
export let vote = false;

$: voted_class = vote ? "voted" : "";
$: player_class = player == true ? "player" : "";
$: height = size == 'sm' ? '4.5vw' : '7vw';
$: width = size == 'sm' ? '2.6vw' : '4vw';
$: fontSize = size == 'sm' ? '1.4vw' : '1.85vw';
</script>

<div
    class="deck-card {player_class} {voted_class}"
    style="transform: rotate({rotation}deg); background-color: {color ||
        '#d8f7ec'}; height: {height}; width: {width}; font-size: {fontSize}">
    <slot />
</div>

<style>
.deck-card {
    display: flex;
    padding: 6px 2px;
    justify-content: center;
    align-content: center;
    color: #444;
    margin: 2px 2px;
    flex-direction: column;
    border: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: 0.4vw;
    transition: background-color 100ms ease-out 200ms;
    filter: drop-shadow(0 0 0.5rem rgba(100, 100, 100, 0.3));
    transform: rotate(2deg);
    transition: transform 200ms ease-in-out 100ms;
    transition: margin-top 200ms ease-in-out 100ms;
}

.player {
    position: relative;
    opacity: 0;
    top: -50px;
}

.voted {
    opacity: 100 !important;
    top: 0px !important;
    transition: all 525ms cubic-bezier(0, 0, 0, 1);
}
</style>
