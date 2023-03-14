<script>
import { onMount } from 'svelte';

import { csrfToken } from './utils.js';

let error;

// Screen name in the poker session
let name = '';

onMount(() => {
    const previousName = window.localStorage.getItem('name');
    if (previousName) {
        name = previousName;
    }
});

const update = () => {
    if (name) {
        window.localStorage.setItem('name', name);
        error = undefined;
    } else {
        error = 'Name cannot be empty';
    }
};
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
        <label class="col"><input type="checkbox" name="is_spectator" /> Join as a spectator 👁️</label>
    </div>
</form>
