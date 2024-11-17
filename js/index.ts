import 'vite/modulepreload-polyfill';

import { mount } from 'svelte';
import App from './App.svelte';

const app = mount(App, { target: document.querySelector('#poker') as HTMLElement });

export default app;
