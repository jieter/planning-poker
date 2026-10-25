import '@testing-library/jest-dom';

// Node >= 25 defines its own localStorage global, which shadows jsdom's and is unusable without --localstorage-file.
if (!globalThis.localStorage) {
    Object.defineProperty(globalThis, 'localStorage', {
        value: /** @type {any} */ (globalThis).jsdom.window.localStorage,
    });
}
