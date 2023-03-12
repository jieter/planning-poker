<script>
import { onMount } from 'svelte';

import { csrfToken } from './utils.js';

let error;

// Screen name in the poker session
let name = '';

onMount(() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    if (params.name) {
        name = params.name;
    }
});

const update = () => {
    if (name) {
        error = undefined;
    } else {
        error = 'Name cannot be empty';
    }
};
</script>

<form class="row row-cols-lg-auto" method="post">
    <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken()} />
    <div class="col">
        <input
            type="text"
            name="name"
            class="form-control"
            on:change={update}
            bind:value={name}
            class:is-invalid={error}
        />
        {#if error}
            <div class="invalid-feedback">{error}</div>
        {/if}
    </div>
    <div class="col">
        <input type="submit" class="btn btn-primary" value="Join" />
    </div>
    <label><input type="checkbox" name="is_spectator" /> Join as 👁️ spectator</label>
</form>
