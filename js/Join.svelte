<script>
import { onMount } from 'svelte';

import { csrfToken } from './utils.js';

let error;

// Screen name in the poker session
let name = '';
let isSpectator = false;

onMount(() => {
    const previousName = window.localStorage.getItem('name');
    if (previousName) {
        name = previousName;
    }
    const previousSpectator = window.localStorage.getItem('isSpectator');
    if (previousSpectator !== null) {
        isSpectator = previousSpectator === 'true';
    }
});

const update = () => {
    error = name ? undefined : 'Name cannot be empty';
};
$: if (name) {
    window.localStorage.setItem('name', name);
}
$: window.localStorage.setItem('isSpectator', isSpectator);
</script>

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
    </div>
    {isSpectator}
</form>
