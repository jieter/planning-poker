<script lang="ts">
import { run } from 'svelte/legacy';

import { onMount } from 'svelte';

import Card from './Card.svelte';
import { csrfToken, formatNumber, jsonScriptContents } from './utils';

let error: string | undefined = $state();

// Screen name in the poker session
let name: string = $state('');
let isSpectator: boolean | null = $state(null);

let statistics: { [key: string]: any } = $state();

function youtubeMovie(name: string | undefined) {
    if (!name) {
        return undefined;
    }
    name = name.toLowerCase();
    if (name.match(/dan.*l/)) {
        return 'yTgSQ2AQGAI'; // Poker Face
    } else if (name.match(/arn.*t/)) {
        return '6p-lDYPR2P8'; // Material girl
    } else if (name.match(/jonat.*n/)) {
        return 'N5imM0ftfkQ'; // Stadsduif
    } else if (name.match(/lonnie/)) {
        return 'AVQ8byG2mY8'; // Say hello to my little friend
    }
}

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
run(() => {
    if (name) {
        localStorage.setItem('name', name);
    }
});
run(() => {
    if (isSpectator != null) {
        localStorage.setItem('isSpectator', isSpectator ? 'true' : 'false');
    }
});

let youtube = $derived(youtubeMovie(name));
</script>

<div class="container">
    <div class="row">
        <div class="col">
            <h1 class="mt-4">Planning poker</h1>
            <form method="post">
                <div class="row row-cols-lg-auto">
                    <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken()} />
                    <div class="col">
                        <input
                            type="text"
                            name="name"
                            class="form-control"
                            onchange={update}
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
    </div>
    <div class="row">
        <div class="col"></div>
        <div class="col-8">
            {#if youtube}
                <div class="ratio ratio-16x9">
                    <iframe
                        src="https://www.youtube.com/embed/{youtube}?autoplay=1"
                        title="Youtube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen></iframe>
                </div>
            {/if}
        </div>
    </div>
</div>

<div class="fixed-bottom mb-3">
    <div class="container small">
        <hr />
        <div class="row">
            {#if statistics}
                <div class="col-md-3">
                    {#each statistics['basic'] as [label, value]}
                        <div class="d-flex justify-content-between align-items-center p-1">
                            {label}
                            <span class="badge bg-primary rounded-pill">{value}</span>
                        </div>
                    {/each}
                    <div class="light p-1" style="font-size: 10px">
                        Starting at 2023-10-01, ignoring single-vote rounds.
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="m-1">
                        {#each statistics.decks as deck}
                            <div class="d-flex overflow-scroll">
                                {#each deck as [card, count]}
                                    <div class="d-inline-block text-center card-wrapper">
                                        <Card>{card}</Card>
                                        <div class="text-muted">{formatNumber(count)}</div>
                                    </div>
                                {/each}
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
            <div class="col-md-2">
                GitHub: <a href="https://github.com/jieter/planning-poker">jieter/planning-poker</a>
            </div>
        </div>
    </div>
</div>

<style>
.card-wrapper {
    width: 30px;
    margin: 2px;
    font-size: 0.9em;
}
</style>
