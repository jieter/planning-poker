<script>
export let name;
export let vote;
export let isRevealed;
</script>

<span class="participant">
    {name}
    <div class="card">
        {#if vote}
            {#if isRevealed}
                {vote}
            {:else}
                ?
            {/if}
        {:else}
            ...
        {/if}
    </div>
</span>

<style>
.participant {
    display: inline-block;
    margin: 6px;
    text-align: center;
}
.card {
    width: 45px;
    height: 70px;

    border-radius: 2px;
    border: 1px solid blue;
    background-color: rgb(214, 245, 255);
    padding: 6px 2px;
    text-align: center;
    margin: 4px auto;
}
</style>
