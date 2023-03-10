<script>
export let update;
export let participants;

const decks = ['tshirt', 'fibonacci'];

// Screen name in the poker session
let name = '';
// Current selected deck.
let deck = 'tshirt';

const join = () => update('join', { name: name, deck: deck });
</script>

<form class="form-inline">
    <input type="text" name="link" class="form-control" bind:value={name} on:update />
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
