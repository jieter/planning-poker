<script>
import { onMount } from 'svelte';

import { csrfToken } from './utils.js';

let error;

// Screen name in the poker session
let name = '';
let isSpectator = null;

onMount(() => {
    const previousName = localStorage.getItem('name');
    if (previousName) {
        name = previousName;
    }
    const previousIsSpectator = localStorage.getItem('isSpectator');
    if (previousIsSpectator !== null) {
        isSpectator = previousIsSpectator === 'true';
    }
});

const update = () => {
    error = name ? undefined : 'Name cannot be empty';
};
$: if (name) {
    localStorage.setItem('name', name);
}
$: if (isSpectator != null) {
    localStorage.setItem('isSpectator', isSpectator ? 'true' : 'false');
}
</script>

<h1>Planning poker</h1>
<form method="post">
    <div class="row row-cols-lg-auto">
        <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken()} />
        <div class="col">
            <input
                type="text"
                name="name"
                class="form-control"
                on:change={update}
                bind:value={name}
                class:is-invalid={error} />
            {#if error}
                <div class="invalid-feedback">{error}</div>
            {/if}
        </div>
        <div class="col">
            <input type="submit" class="btn btn-primary" value="Join" />
        </div>
    </div>
    <div class="row">
        <label class="col">
            <input type="checkbox" name="is_spectator" bind:checked={isSpectator} /> Join as a spectator 👁️
        </label>
        <span class="text-muted">You can always enab to voting later</span>
    </div>
</form>
