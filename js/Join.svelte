<script>
import { onMount } from 'svelte';

import Card from './Card.svelte';
import { csrfToken, jsonScriptContents } from './utils.js';

let error;

// Screen name in the poker session
let name = '';
let isSpectator = null;

let statistics;

onMount(() => {
    const previousName = localStorage.getItem('name');
    if (previousName) {
        name = previousName;
    }
    const previousIsSpectator = localStorage.getItem('isSpectator');
    if (previousIsSpectator !== null) {
        isSpectator = previousIsSpectator === 'true';
    }
    statistics = jsonScriptContents('statistics');
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

<div class="m-5">
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
            <span class="text-muted">You can always enable voting later</span>
        </div>
    </form>
</div>

<div class="fixed-bottom mb-3">
    <div class="container small">
        <div class="row">
            <div class="col"><strong>Statistics</strong></div>
        </div>
        <div class="row">
            {#if statistics}
                <div class="col-md-3">
                    <ul class="list-group">
                        {#each statistics['basic'] as [label, value]}
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                {label}
                                <span class="badge bg-primary rounded-pill">{value}</span>
                            </li>
                        {/each}
                    </ul>
                </div>
                <div class="col-md-6">
                    <ul class="list-group">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <div class="m-1">
                                {#each statistics.cards as [card, count]}
                                    <div class="d-inline-block text-center">
                                        <Card size="sm">{card}</Card>
                                        <div class="text-muted">{count}x</div>
                                    </div>
                                {/each}
                            </div>
                        </li>
                    </ul>
                </div>
            {/if}
            <div class="col-md-2">
                GitHub: <a href="https://github.com/jieter/planning-poker">jieter/planning-poker</a>
            </div>
        </div>
    </div>
</div>
