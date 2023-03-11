<script>
export let update;
export let participants;

const decks = ['tshirt', 'fibonacci'];

// Screen name in the poker session
let name = '';

onmouseenter(() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    if (params.name) {
        name = params.name;
    }
});
// Current selected deck.
let deck = 'tshirt';

const join = () => update('join', { name: name, deck: deck });
</script>

<form class="form-inline">
    <input type="text" name="name" class="form-control" bind:value={name} on:update />
    {#if !participants || participants.length == 0}
        <div class="btn-group">
            {#each decks as option}
                <div class="btn {option == deck ? 'btn-info' : 'btn-default'}" on:click={() => (deck = option)}>
                    {option}
                </div>
            {/each}
        </div>
    {/if}
    <div class="btn btn-primary" on:click={join} on:keypress={join}>Join</div>
</form>
