
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
'use strict';

/** @returns {void} */
function noop() {}

/**
 * @template T
 * @template S
 * @param {T} tar
 * @param {S} src
 * @returns {T & S}
 */
function assign$1(tar, src) {
	// @ts-ignore
	for (const k in src) tar[k] = src[k];
	return /** @type {T & S} */ (tar);
}

/** @returns {void} */
function add_location(element, file, line, column, char) {
	element.__svelte_meta = {
		loc: { file, line, column, char }
	};
}

function run(fn) {
	return fn();
}

function blank_object() {
	return Object.create(null);
}

/**
 * @param {Function[]} fns
 * @returns {void}
 */
function run_all(fns) {
	fns.forEach(run);
}

/**
 * @param {any} thing
 * @returns {thing is Function}
 */
function is_function(thing) {
	return typeof thing === 'function';
}

/** @returns {boolean} */
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

/** @returns {boolean} */
function is_empty(obj) {
	return Object.keys(obj).length === 0;
}

/** @returns {void} */
function validate_store(store, name) {
	if (store != null && typeof store.subscribe !== 'function') {
		throw new Error(`'${name}' is not a store with a 'subscribe' method`);
	}
}

function subscribe(store, ...callbacks) {
	if (store == null) {
		for (const callback of callbacks) {
			callback(undefined);
		}
		return noop;
	}
	const unsub = store.subscribe(...callbacks);
	return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}

/**
 * Get the current value from a store by subscribing and immediately unsubscribing.
 *
 * https://svelte.dev/docs/svelte-store#get
 * @template T
 * @param {import('../store/public.js').Readable<T>} store
 * @returns {T}
 */
function get_store_value(store) {
	let value;
	subscribe(store, (_) => (value = _))();
	return value;
}

/** @returns {void} */
function component_subscribe(component, store, callback) {
	component.$$.on_destroy.push(subscribe(store, callback));
}

function create_slot(definition, ctx, $$scope, fn) {
	if (definition) {
		const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
		return definition[0](slot_ctx);
	}
}

function get_slot_context(definition, ctx, $$scope, fn) {
	return definition[1] && fn ? assign$1($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}

function get_slot_changes(definition, $$scope, dirty, fn) {
	if (definition[2] && fn) {
		const lets = definition[2](fn(dirty));
		if ($$scope.dirty === undefined) {
			return lets;
		}
		if (typeof lets === 'object') {
			const merged = [];
			const len = Math.max($$scope.dirty.length, lets.length);
			for (let i = 0; i < len; i += 1) {
				merged[i] = $$scope.dirty[i] | lets[i];
			}
			return merged;
		}
		return $$scope.dirty | lets;
	}
	return $$scope.dirty;
}

/** @returns {void} */
function update_slot_base(
	slot,
	slot_definition,
	ctx,
	$$scope,
	slot_changes,
	get_slot_context_fn
) {
	if (slot_changes) {
		const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
		slot.p(slot_context, slot_changes);
	}
}

/** @returns {any[] | -1} */
function get_all_dirty_from_scope($$scope) {
	if ($$scope.ctx.length > 32) {
		const dirty = [];
		const length = $$scope.ctx.length / 32;
		for (let i = 0; i < length; i++) {
			dirty[i] = -1;
		}
		return dirty;
	}
	return -1;
}

function action_destroyer(action_result) {
	return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @returns {void}
 */
function append(target, node) {
	target.appendChild(node);
}

/**
 * @param {Node} target
 * @param {Node} node
 * @param {Node} [anchor]
 * @returns {void}
 */
function insert(target, node, anchor) {
	target.insertBefore(node, anchor || null);
}

/**
 * @param {Node} node
 * @returns {void}
 */
function detach(node) {
	if (node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

/**
 * @returns {void} */
function destroy_each(iterations, detaching) {
	for (let i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d(detaching);
	}
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} name
 * @returns {HTMLElementTagNameMap[K]}
 */
function element(name) {
	return document.createElement(name);
}

/**
 * @param {string} data
 * @returns {Text}
 */
function text(data) {
	return document.createTextNode(data);
}

/**
 * @returns {Text} */
function space() {
	return text(' ');
}

/**
 * @returns {Text} */
function empty() {
	return text('');
}

/**
 * @param {EventTarget} node
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
 * @returns {() => void}
 */
function listen(node, event, handler, options) {
	node.addEventListener(event, handler, options);
	return () => node.removeEventListener(event, handler, options);
}

/**
 * @param {Element} node
 * @param {string} attribute
 * @param {string} [value]
 * @returns {void}
 */
function attr(node, attribute, value) {
	if (value == null) node.removeAttribute(attribute);
	else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}

/**
 * @param {HTMLInputElement[]} group
 * @returns {{ p(...inputs: HTMLInputElement[]): void; r(): void; }}
 */
function init_binding_group(group) {
	/**
	 * @type {HTMLInputElement[]} */
	let _inputs;
	return {
		/* push */ p(...inputs) {
			_inputs = inputs;
			_inputs.forEach((input) => group.push(input));
		},
		/* remove */ r() {
			_inputs.forEach((input) => group.splice(group.indexOf(input), 1));
		}
	};
}

/**
 * @param {Element} element
 * @returns {ChildNode[]}
 */
function children(element) {
	return Array.from(element.childNodes);
}

/**
 * @returns {void} */
function set_input_value(input, value) {
	input.value = value == null ? '' : value;
}

/**
 * @returns {void} */
function set_style(node, key, value, important) {
	if (value == null) {
		node.style.removeProperty(key);
	} else {
		node.style.setProperty(key, value, important ? 'important' : '');
	}
}

/**
 * @returns {void} */
function toggle_class(element, name, toggle) {
	// The `!!` is required because an `undefined` flag means flipping the current state.
	element.classList.toggle(name, !!toggle);
}

/**
 * @template T
 * @param {string} type
 * @param {T} [detail]
 * @param {{ bubbles?: boolean, cancelable?: boolean }} [options]
 * @returns {CustomEvent<T>}
 */
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
	return new CustomEvent(type, { detail, bubbles, cancelable });
}

/**
 * @typedef {Node & {
 * 	claim_order?: number;
 * 	hydrate_init?: true;
 * 	actual_end_child?: NodeEx;
 * 	childNodes: NodeListOf<NodeEx>;
 * }} NodeEx
 */

/** @typedef {ChildNode & NodeEx} ChildNodeEx */

/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

/**
 * @typedef {ChildNodeEx[] & {
 * 	claim_info?: {
 * 		last_index: number;
 * 		total_claimed: number;
 * 	};
 * }} ChildNodeArray
 */

let current_component;

/** @returns {void} */
function set_current_component(component) {
	current_component = component;
}

function get_current_component() {
	if (!current_component) throw new Error('Function called outside component initialization');
	return current_component;
}

/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
 *
 * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs/svelte#onmount
 * @template T
 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
 * @returns {void}
 */
function onMount(fn) {
	get_current_component().$$.on_mount.push(fn);
}

// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
/**
 * @param component
 * @param event
 * @returns {void}
 */
function bubble(component, event) {
	const callbacks = component.$$.callbacks[event.type];
	if (callbacks) {
		// @ts-ignore
		callbacks.slice().forEach((fn) => fn.call(this, event));
	}
}

const dirty_components = [];
const binding_callbacks = [];

let render_callbacks = [];

const flush_callbacks = [];

const resolved_promise = /* @__PURE__ */ Promise.resolve();

let update_scheduled = false;

/** @returns {void} */
function schedule_update() {
	if (!update_scheduled) {
		update_scheduled = true;
		resolved_promise.then(flush);
	}
}

/** @returns {void} */
function add_render_callback(fn) {
	render_callbacks.push(fn);
}

// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();

let flushidx = 0; // Do *not* move this inside the flush() function

/** @returns {void} */
function flush() {
	// Do not reenter flush while dirty components are updated, as this can
	// result in an infinite loop. Instead, let the inner flush handle it.
	// Reentrancy is ok afterwards for bindings etc.
	if (flushidx !== 0) {
		return;
	}
	const saved_component = current_component;
	do {
		// first, call beforeUpdate functions
		// and update components
		try {
			while (flushidx < dirty_components.length) {
				const component = dirty_components[flushidx];
				flushidx++;
				set_current_component(component);
				update$1(component.$$);
			}
		} catch (e) {
			// reset dirty state to not end up in a deadlocked state and then rethrow
			dirty_components.length = 0;
			flushidx = 0;
			throw e;
		}
		set_current_component(null);
		dirty_components.length = 0;
		flushidx = 0;
		while (binding_callbacks.length) binding_callbacks.pop()();
		// then, once components are updated, call
		// afterUpdate functions. This may cause
		// subsequent updates...
		for (let i = 0; i < render_callbacks.length; i += 1) {
			const callback = render_callbacks[i];
			if (!seen_callbacks.has(callback)) {
				// ...so guard against infinite loops
				seen_callbacks.add(callback);
				callback();
			}
		}
		render_callbacks.length = 0;
	} while (dirty_components.length);
	while (flush_callbacks.length) {
		flush_callbacks.pop()();
	}
	update_scheduled = false;
	seen_callbacks.clear();
	set_current_component(saved_component);
}

/** @returns {void} */
function update$1($$) {
	if ($$.fragment !== null) {
		$$.update();
		run_all($$.before_update);
		const dirty = $$.dirty;
		$$.dirty = [-1];
		$$.fragment && $$.fragment.p($$.ctx, dirty);
		$$.after_update.forEach(add_render_callback);
	}
}

/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 * @param {Function[]} fns
 * @returns {void}
 */
function flush_render_callbacks(fns) {
	const filtered = [];
	const targets = [];
	render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
	targets.forEach((c) => c());
	render_callbacks = filtered;
}

const outroing = new Set();

/**
 * @type {Outro}
 */
let outros;

/**
 * @returns {void} */
function group_outros() {
	outros = {
		r: 0,
		c: [],
		p: outros // parent group
	};
}

/**
 * @returns {void} */
function check_outros() {
	if (!outros.r) {
		run_all(outros.c);
	}
	outros = outros.p;
}

/**
 * @param {import('./private.js').Fragment} block
 * @param {0 | 1} [local]
 * @returns {void}
 */
function transition_in(block, local) {
	if (block && block.i) {
		outroing.delete(block);
		block.i(local);
	}
}

/**
 * @param {import('./private.js').Fragment} block
 * @param {0 | 1} local
 * @param {0 | 1} [detach]
 * @param {() => void} [callback]
 * @returns {void}
 */
function transition_out(block, local, detach, callback) {
	if (block && block.o) {
		if (outroing.has(block)) return;
		outroing.add(block);
		outros.c.push(() => {
			outroing.delete(block);
			if (callback) {
				if (detach) block.d(1);
				callback();
			}
		});
		block.o(local);
	} else if (callback) {
		callback();
	}
}

/** @typedef {1} INTRO */
/** @typedef {0} OUTRO */
/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

/**
 * @typedef {Object} Outro
 * @property {number} r
 * @property {Function[]} c
 * @property {Object} p
 */

/**
 * @typedef {Object} PendingProgram
 * @property {number} start
 * @property {INTRO|OUTRO} b
 * @property {Outro} [group]
 */

/**
 * @typedef {Object} Program
 * @property {number} a
 * @property {INTRO|OUTRO} b
 * @property {1|-1} d
 * @property {number} duration
 * @property {number} start
 * @property {number} end
 * @property {Outro} [group]
 */

// general each functions:

function ensure_array_like(array_like_or_iterator) {
	return array_like_or_iterator?.length !== undefined
		? array_like_or_iterator
		: Array.from(array_like_or_iterator);
}

/** @returns {void} */
function outro_and_destroy_block(block, lookup) {
	transition_out(block, 1, 1, () => {
		lookup.delete(block.key);
	});
}

/** @returns {any[]} */
function update_keyed_each(
	old_blocks,
	dirty,
	get_key,
	dynamic,
	ctx,
	list,
	lookup,
	node,
	destroy,
	create_each_block,
	next,
	get_context
) {
	let o = old_blocks.length;
	let n = list.length;
	let i = o;
	const old_indexes = {};
	while (i--) old_indexes[old_blocks[i].key] = i;
	const new_blocks = [];
	const new_lookup = new Map();
	const deltas = new Map();
	const updates = [];
	i = n;
	while (i--) {
		const child_ctx = get_context(ctx, list, i);
		const key = get_key(child_ctx);
		let block = lookup.get(key);
		if (!block) {
			block = create_each_block(key, child_ctx);
			block.c();
		} else if (dynamic) {
			// defer updates until all the DOM shuffling is done
			updates.push(() => block.p(child_ctx, dirty));
		}
		new_lookup.set(key, (new_blocks[i] = block));
		if (key in old_indexes) deltas.set(key, Math.abs(i - old_indexes[key]));
	}
	const will_move = new Set();
	const did_move = new Set();
	/** @returns {void} */
	function insert(block) {
		transition_in(block, 1);
		block.m(node, next);
		lookup.set(block.key, block);
		next = block.first;
		n--;
	}
	while (o && n) {
		const new_block = new_blocks[n - 1];
		const old_block = old_blocks[o - 1];
		const new_key = new_block.key;
		const old_key = old_block.key;
		if (new_block === old_block) {
			// do nothing
			next = new_block.first;
			o--;
			n--;
		} else if (!new_lookup.has(old_key)) {
			// remove old block
			destroy(old_block, lookup);
			o--;
		} else if (!lookup.has(new_key) || will_move.has(new_key)) {
			insert(new_block);
		} else if (did_move.has(old_key)) {
			o--;
		} else if (deltas.get(new_key) > deltas.get(old_key)) {
			did_move.add(new_key);
			insert(new_block);
		} else {
			will_move.add(old_key);
			o--;
		}
	}
	while (o--) {
		const old_block = old_blocks[o];
		if (!new_lookup.has(old_block.key)) destroy(old_block, lookup);
	}
	while (n) insert(new_blocks[n - 1]);
	run_all(updates);
	return new_blocks;
}

/** @returns {void} */
function validate_each_keys(ctx, list, get_context, get_key) {
	const keys = new Map();
	for (let i = 0; i < list.length; i++) {
		const key = get_key(get_context(ctx, list, i));
		if (keys.has(key)) {
			let value = '';
			try {
				value = `with value '${String(key)}' `;
			} catch (e) {
				// can't stringify
			}
			throw new Error(
				`Cannot have duplicate keys in a keyed each: Keys at index ${keys.get(
					key
				)} and ${i} ${value}are duplicates`
			);
		}
		keys.set(key, i);
	}
}

/** @returns {void} */
function create_component(block) {
	block && block.c();
}

/** @returns {void} */
function mount_component(component, target, anchor) {
	const { fragment, after_update } = component.$$;
	fragment && fragment.m(target, anchor);
	// onMount happens before the initial afterUpdate
	add_render_callback(() => {
		const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
		// if the component was destroyed immediately
		// it will update the `$$.on_destroy` reference to `null`.
		// the destructured on_destroy may still reference to the old array
		if (component.$$.on_destroy) {
			component.$$.on_destroy.push(...new_on_destroy);
		} else {
			// Edge case - component was destroyed immediately,
			// most likely as a result of a binding initialising
			run_all(new_on_destroy);
		}
		component.$$.on_mount = [];
	});
	after_update.forEach(add_render_callback);
}

/** @returns {void} */
function destroy_component(component, detaching) {
	const $$ = component.$$;
	if ($$.fragment !== null) {
		flush_render_callbacks($$.after_update);
		run_all($$.on_destroy);
		$$.fragment && $$.fragment.d(detaching);
		// TODO null out other refs, including component.$$ (but need to
		// preserve final state?)
		$$.on_destroy = $$.fragment = null;
		$$.ctx = [];
	}
}

/** @returns {void} */
function make_dirty(component, i) {
	if (component.$$.dirty[0] === -1) {
		dirty_components.push(component);
		schedule_update();
		component.$$.dirty.fill(0);
	}
	component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
}

// TODO: Document the other params
/**
 * @param {SvelteComponent} component
 * @param {import('./public.js').ComponentConstructorOptions} options
 *
 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
 * This will be the `add_css` function from the compiled component.
 *
 * @returns {void}
 */
function init$1(
	component,
	options,
	instance,
	create_fragment,
	not_equal,
	props,
	append_styles = null,
	dirty = [-1]
) {
	const parent_component = current_component;
	set_current_component(component);
	/** @type {import('./private.js').T$$} */
	const $$ = (component.$$ = {
		fragment: null,
		ctx: [],
		// state
		props,
		update: noop,
		not_equal,
		bound: blank_object(),
		// lifecycle
		on_mount: [],
		on_destroy: [],
		on_disconnect: [],
		before_update: [],
		after_update: [],
		context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
		// everything else
		callbacks: blank_object(),
		dirty,
		skip_bound: false,
		root: options.target || parent_component.$$.root
	});
	append_styles && append_styles($$.root);
	let ready = false;
	$$.ctx = instance
		? instance(component, options.props || {}, (i, ret, ...rest) => {
				const value = rest.length ? rest[0] : ret;
				if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
					if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
					if (ready) make_dirty(component, i);
				}
				return ret;
		  })
		: [];
	$$.update();
	ready = true;
	run_all($$.before_update);
	// `false` as a special case of no DOM component
	$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
	if (options.target) {
		if (options.hydrate) {
			// TODO: what is the correct type here?
			// @ts-expect-error
			const nodes = children(options.target);
			$$.fragment && $$.fragment.l(nodes);
			nodes.forEach(detach);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			$$.fragment && $$.fragment.c();
		}
		if (options.intro) transition_in(component.$$.fragment);
		mount_component(component, options.target, options.anchor);
		flush();
	}
	set_current_component(parent_component);
}

/**
 * Base class for Svelte components. Used when dev=false.
 *
 * @template {Record<string, any>} [Props=any]
 * @template {Record<string, any>} [Events=any]
 */
class SvelteComponent {
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$ = undefined;
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$set = undefined;

	/** @returns {void} */
	$destroy() {
		destroy_component(this, 1);
		this.$destroy = noop;
	}

	/**
	 * @template {Extract<keyof Events, string>} K
	 * @param {K} type
	 * @param {((e: Events[K]) => void) | null | undefined} callback
	 * @returns {() => void}
	 */
	$on(type, callback) {
		if (!is_function(callback)) {
			return noop;
		}
		const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
		callbacks.push(callback);
		return () => {
			const index = callbacks.indexOf(callback);
			if (index !== -1) callbacks.splice(index, 1);
		};
	}

	/**
	 * @param {Partial<Props>} props
	 * @returns {void}
	 */
	$set(props) {
		if (this.$$set && !is_empty(props)) {
			this.$$.skip_bound = true;
			this.$$set(props);
			this.$$.skip_bound = false;
		}
	}
}

/**
 * @typedef {Object} CustomElementPropDefinition
 * @property {string} [attribute]
 * @property {boolean} [reflect]
 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
 */

// generated during release, do not modify

/**
 * The current version, as set in package.json.
 *
 * https://svelte.dev/docs/svelte-compiler#svelte-version
 * @type {string}
 */
const VERSION = '4.2.1';
const PUBLIC_VERSION = '4';

/**
 * @template T
 * @param {string} type
 * @param {T} [detail]
 * @returns {void}
 */
function dispatch_dev(type, detail) {
	document.dispatchEvent(custom_event(type, { version: VERSION, ...detail }, { bubbles: true }));
}

/**
 * @param {Node} target
 * @param {Node} node
 * @returns {void}
 */
function append_dev(target, node) {
	dispatch_dev('SvelteDOMInsert', { target, node });
	append(target, node);
}

/**
 * @param {Node} target
 * @param {Node} node
 * @param {Node} [anchor]
 * @returns {void}
 */
function insert_dev(target, node, anchor) {
	dispatch_dev('SvelteDOMInsert', { target, node, anchor });
	insert(target, node, anchor);
}

/**
 * @param {Node} node
 * @returns {void}
 */
function detach_dev(node) {
	dispatch_dev('SvelteDOMRemove', { node });
	detach(node);
}

/**
 * @param {Node} node
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
 * @param {boolean} [has_prevent_default]
 * @param {boolean} [has_stop_propagation]
 * @param {boolean} [has_stop_immediate_propagation]
 * @returns {() => void}
 */
function listen_dev(
	node,
	event,
	handler,
	options,
	has_prevent_default,
	has_stop_propagation,
	has_stop_immediate_propagation
) {
	const modifiers =
		options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
	if (has_prevent_default) modifiers.push('preventDefault');
	if (has_stop_propagation) modifiers.push('stopPropagation');
	if (has_stop_immediate_propagation) modifiers.push('stopImmediatePropagation');
	dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
	const dispose = listen(node, event, handler, options);
	return () => {
		dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
		dispose();
	};
}

/**
 * @param {Element} node
 * @param {string} attribute
 * @param {string} [value]
 * @returns {void}
 */
function attr_dev(node, attribute, value) {
	attr(node, attribute, value);
	if (value == null) dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
	else dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
}

/**
 * @param {Element} node
 * @param {string} property
 * @param {any} [value]
 * @returns {void}
 */
function prop_dev(node, property, value) {
	node[property] = value;
	dispatch_dev('SvelteDOMSetProperty', { node, property, value });
}

/**
 * @param {Text} text
 * @param {unknown} data
 * @returns {void}
 */
function set_data_dev(text, data) {
	data = '' + data;
	if (text.data === data) return;
	dispatch_dev('SvelteDOMSetData', { node: text, data });
	text.data = /** @type {string} */ (data);
}

function ensure_array_like_dev(arg) {
	if (
		typeof arg !== 'string' &&
		!(arg && typeof arg === 'object' && 'length' in arg) &&
		!(typeof Symbol === 'function' && arg && Symbol.iterator in arg)
	) {
		throw new Error('{#each} only works with iterable values.');
	}
	return ensure_array_like(arg);
}

/**
 * @returns {void} */
function validate_slots(name, slot, keys) {
	for (const slot_key of Object.keys(slot)) {
		if (!~keys.indexOf(slot_key)) {
			console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
		}
	}
}

/**
 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
 *
 * Can be used to create strongly typed Svelte components.
 *
 * #### Example:
 *
 * You have component library on npm called `component-library`, from which
 * you export a component called `MyComponent`. For Svelte+TypeScript users,
 * you want to provide typings. Therefore you create a `index.d.ts`:
 * ```ts
 * import { SvelteComponent } from "svelte";
 * export class MyComponent extends SvelteComponent<{foo: string}> {}
 * ```
 * Typing this makes it possible for IDEs like VS Code with the Svelte extension
 * to provide intellisense and to use the component like this in a Svelte file
 * with TypeScript:
 * ```svelte
 * <script lang="ts">
 * 	import { MyComponent } from "component-library";
 * </script>
 * <MyComponent foo={'bar'} />
 * ```
 * @template {Record<string, any>} [Props=any]
 * @template {Record<string, any>} [Events=any]
 * @template {Record<string, any>} [Slots=any]
 * @extends {SvelteComponent<Props, Events>}
 */
class SvelteComponentDev extends SvelteComponent {
	/**
	 * For type checking capabilities only.
	 * Does not exist at runtime.
	 * ### DO NOT USE!
	 *
	 * @type {Props}
	 */
	$$prop_def;
	/**
	 * For type checking capabilities only.
	 * Does not exist at runtime.
	 * ### DO NOT USE!
	 *
	 * @type {Events}
	 */
	$$events_def;
	/**
	 * For type checking capabilities only.
	 * Does not exist at runtime.
	 * ### DO NOT USE!
	 *
	 * @type {Slots}
	 */
	$$slot_def;

	/** @param {import('./public.js').ComponentConstructorOptions<Props>} options */
	constructor(options) {
		if (!options || (!options.target && !options.$$inline)) {
			throw new Error("'target' is a required option");
		}
		super();
	}

	/** @returns {void} */
	$destroy() {
		super.$destroy();
		this.$destroy = () => {
			console.warn('Component was already destroyed'); // eslint-disable-line no-console
		};
	}

	/** @returns {void} */
	$capture_state() {}

	/** @returns {void} */
	$inject_state() {}
}

if (typeof window !== 'undefined')
	// @ts-ignore
	(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

/*! js-cookie v3.0.5 | MIT */
/* eslint-disable no-var */
function assign (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }
  return target
}
/* eslint-enable no-var */

/* eslint-disable no-var */
var defaultConverter = {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  },
  write: function (value) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    )
  }
};
/* eslint-enable no-var */

/* eslint-disable no-var */

function init (converter, defaultAttributes) {
  function set (name, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = assign({}, defaultAttributes, attributes);

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString();
    }

    name = encodeURIComponent(name)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);

    var stringifiedAttributes = '';
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += '; ' + attributeName;

      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
    }

    return (document.cookie =
      name + '=' + converter.write(value, name) + stringifiedAttributes)
  }

  function get (name) {
    if (typeof document === 'undefined' || (arguments.length && !name)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    var jar = {};
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var value = parts.slice(1).join('=');

      try {
        var found = decodeURIComponent(parts[0]);
        jar[found] = converter.read(value, found);

        if (name === found) {
          break
        }
      } catch (e) {}
    }

    return name ? jar[name] : jar
  }

  return Object.create(
    {
      set,
      get,
      remove: function (name, attributes) {
        set(
          name,
          '',
          assign({}, attributes, {
            expires: -1
          })
        );
      },
      withAttributes: function (attributes) {
        return init(this.converter, assign({}, this.attributes, attributes))
      },
      withConverter: function (converter) {
        return init(assign({}, this.converter, converter), this.attributes)
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}

var api = init(defaultConverter, { path: '/' });

function jsonScriptContents(id) {
    let element = document.getElementById(id);
    if (element) {
        return JSON.parse(element.textContent);
    }
    return undefined;
}

function csrfToken() {
    return api.get('csrftoken');
}

/* js/Join.svelte generated by Svelte v4.2.1 */
const file$6 = "js/Join.svelte";

// (46:12) {#if error}
function create_if_block$6(ctx) {
	let div;
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text(/*error*/ ctx[2]);
			attr_dev(div, "class", "invalid-feedback");
			add_location(div, file$6, 46, 16, 1185);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*error*/ 4) set_data_dev(t, /*error*/ ctx[2]);
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$6.name,
		type: "if",
		source: "(46:12) {#if error}",
		ctx
	});

	return block;
}

function create_fragment$7(ctx) {
	let h1;
	let t1;
	let form;
	let div2;
	let input0;
	let t2;
	let div0;
	let input1;
	let t3;
	let t4;
	let div1;
	let input2;
	let t5;
	let div3;
	let label;
	let input3;
	let t6;
	let t7;
	let span;
	let mounted;
	let dispose;
	let if_block = /*error*/ ctx[2] && create_if_block$6(ctx);

	const block = {
		c: function create() {
			h1 = element("h1");
			h1.textContent = "Planning poker";
			t1 = space();
			form = element("form");
			div2 = element("div");
			input0 = element("input");
			t2 = space();
			div0 = element("div");
			input1 = element("input");
			t3 = space();
			if (if_block) if_block.c();
			t4 = space();
			div1 = element("div");
			input2 = element("input");
			t5 = space();
			div3 = element("div");
			label = element("label");
			input3 = element("input");
			t6 = text(" Join as a spectator 👁️");
			t7 = space();
			span = element("span");
			span.textContent = "You can always enable voting later";
			add_location(h1, file$6, 33, 0, 731);
			attr_dev(input0, "type", "hidden");
			attr_dev(input0, "name", "csrfmiddlewaretoken");
			input0.value = csrfToken();
			add_location(input0, file$6, 36, 8, 823);
			attr_dev(input1, "type", "text");
			attr_dev(input1, "name", "name");
			attr_dev(input1, "class", "form-control");
			toggle_class(input1, "is-invalid", /*error*/ ctx[2]);
			add_location(input1, file$6, 38, 12, 932);
			attr_dev(div0, "class", "col");
			add_location(div0, file$6, 37, 8, 902);
			attr_dev(input2, "type", "submit");
			attr_dev(input2, "class", "btn btn-primary");
			input2.value = "Join";
			add_location(input2, file$6, 50, 12, 1300);
			attr_dev(div1, "class", "col");
			add_location(div1, file$6, 49, 8, 1270);
			attr_dev(div2, "class", "row row-cols-lg-auto");
			add_location(div2, file$6, 35, 4, 780);
			attr_dev(input3, "type", "checkbox");
			attr_dev(input3, "name", "is_spectator");
			add_location(input3, file$6, 55, 12, 1449);
			attr_dev(label, "class", "col");
			add_location(label, file$6, 54, 8, 1417);
			attr_dev(span, "class", "text-muted");
			add_location(span, file$6, 57, 8, 1571);
			attr_dev(div3, "class", "row");
			add_location(div3, file$6, 53, 4, 1391);
			attr_dev(form, "method", "post");
			add_location(form, file$6, 34, 0, 755);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, h1, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, form, anchor);
			append_dev(form, div2);
			append_dev(div2, input0);
			append_dev(div2, t2);
			append_dev(div2, div0);
			append_dev(div0, input1);
			set_input_value(input1, /*name*/ ctx[0]);
			append_dev(div0, t3);
			if (if_block) if_block.m(div0, null);
			append_dev(div2, t4);
			append_dev(div2, div1);
			append_dev(div1, input2);
			append_dev(form, t5);
			append_dev(form, div3);
			append_dev(div3, label);
			append_dev(label, input3);
			input3.checked = /*isSpectator*/ ctx[1];
			append_dev(label, t6);
			append_dev(div3, t7);
			append_dev(div3, span);

			if (!mounted) {
				dispose = [
					listen_dev(input1, "change", /*update*/ ctx[3], false, false, false, false),
					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
					listen_dev(input3, "change", /*input3_change_handler*/ ctx[5])
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*name*/ 1 && input1.value !== /*name*/ ctx[0]) {
				set_input_value(input1, /*name*/ ctx[0]);
			}

			if (dirty & /*error*/ 4) {
				toggle_class(input1, "is-invalid", /*error*/ ctx[2]);
			}

			if (/*error*/ ctx[2]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$6(ctx);
					if_block.c();
					if_block.m(div0, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*isSpectator*/ 2) {
				input3.checked = /*isSpectator*/ ctx[1];
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(h1);
				detach_dev(t1);
				detach_dev(form);
			}

			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$7.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$7($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Join', slots, []);
	let error;

	// Screen name in the poker session
	let name = '';

	let isSpectator = null;

	onMount(() => {
		const previousName = localStorage.getItem('name');

		if (previousName) {
			$$invalidate(0, name = previousName);
		}

		const previousIsSpectator = localStorage.getItem('isSpectator');

		if (previousIsSpectator !== null) {
			$$invalidate(1, isSpectator = previousIsSpectator === 'true');
		}
	});

	const update = () => {
		$$invalidate(2, error = name ? undefined : 'Name cannot be empty');
	};

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Join> was created with unknown prop '${key}'`);
	});

	function input1_input_handler() {
		name = this.value;
		$$invalidate(0, name);
	}

	function input3_change_handler() {
		isSpectator = this.checked;
		$$invalidate(1, isSpectator);
	}

	$$self.$capture_state = () => ({
		onMount,
		csrfToken,
		error,
		name,
		isSpectator,
		update
	});

	$$self.$inject_state = $$props => {
		if ('error' in $$props) $$invalidate(2, error = $$props.error);
		if ('name' in $$props) $$invalidate(0, name = $$props.name);
		if ('isSpectator' in $$props) $$invalidate(1, isSpectator = $$props.isSpectator);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*name*/ 1) {
			if (name) {
				localStorage.setItem('name', name);
			}
		}

		if ($$self.$$.dirty & /*isSpectator*/ 2) {
			if (isSpectator != null) {
				localStorage.setItem('isSpectator', isSpectator ? 'true' : 'false');
			}
		}
	};

	return [name, isSpectator, error, update, input1_input_handler, input3_change_handler];
}

class Join extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$7, create_fragment$7, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Join",
			options,
			id: create_fragment$7.name
		});
	}
}

/* js/Card.svelte generated by Svelte v4.2.1 */
const file$5 = "js/Card.svelte";

function create_fragment$6(ctx) {
	let div;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[5].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

	const block = {
		c: function create() {
			div = element("div");
			if (default_slot) default_slot.c();
			attr_dev(div, "class", "card btn svelte-inppn9");
			set_style(div, "background-color", /*color*/ ctx[2] || '#d8f7ec');
			attr_dev(div, "disabled", /*disabled*/ ctx[0]);
			attr_dev(div, "role", "button");
			attr_dev(div, "tabindex", "0");
			toggle_class(div, "selected", /*selected*/ ctx[1]);
			add_location(div, file$5, 16, 0, 214);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			/*div_binding*/ ctx[8](div);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(div, "click", /*click_handler*/ ctx[6], false, false, false, false),
					listen_dev(div, "keypress", /*keypress_handler*/ ctx[7], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[4],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
						null
					);
				}
			}

			if (!current || dirty & /*color*/ 4) {
				set_style(div, "background-color", /*color*/ ctx[2] || '#d8f7ec');
			}

			if (!current || dirty & /*disabled*/ 1) {
				attr_dev(div, "disabled", /*disabled*/ ctx[0]);
			}

			if (!current || dirty & /*selected*/ 2) {
				toggle_class(div, "selected", /*selected*/ ctx[1]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div);
			}

			if (default_slot) default_slot.d(detaching);
			/*div_binding*/ ctx[8](null);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$6.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$6($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Card', slots, ['default']);
	let { disabled = true } = $$props;
	let { selected = '' } = $$props;
	let { color = null } = $$props;
	let button;
	const writable_props = ['disabled', 'selected', 'color'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
	});

	function click_handler(event) {
		bubble.call(this, $$self, event);
	}

	function keypress_handler(event) {
		bubble.call(this, $$self, event);
	}

	function div_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			button = $$value;
			$$invalidate(3, button);
		});
	}

	$$self.$$set = $$props => {
		if ('disabled' in $$props) $$invalidate(0, disabled = $$props.disabled);
		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
		if ('color' in $$props) $$invalidate(2, color = $$props.color);
		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		onMount,
		disabled,
		selected,
		color,
		button
	});

	$$self.$inject_state = $$props => {
		if ('disabled' in $$props) $$invalidate(0, disabled = $$props.disabled);
		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
		if ('color' in $$props) $$invalidate(2, color = $$props.color);
		if ('button' in $$props) $$invalidate(3, button = $$props.button);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*button, selected*/ 10) {
			{
				if (button && selected) {
					button.blur();
				}
			}
		}
	};

	return [
		disabled,
		selected,
		color,
		button,
		$$scope,
		slots,
		click_handler,
		keypress_handler,
		div_binding
	];
}

class Card extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$6, create_fragment$6, safe_not_equal, { disabled: 0, selected: 1, color: 2 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Card",
			options,
			id: create_fragment$6.name
		});
	}

	get disabled() {
		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set disabled(value) {
		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get selected() {
		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set selected(value) {
		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* js/Participant.svelte generated by Svelte v4.2.1 */
const file$4 = "js/Participant.svelte";

// (26:28) 
function create_if_block_1$2(ctx) {
	let if_block_anchor;

	function select_block_type_1(ctx, dirty) {
		if (/*isRevealed*/ ctx[1]) return create_if_block_2$2;
		return create_else_block$4;
	}

	let current_block_type = select_block_type_1(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			}
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(if_block_anchor);
			}

			if_block.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$2.name,
		type: "if",
		source: "(26:28) ",
		ctx
	});

	return block;
}

// (24:8) {#if user.is_spectator}
function create_if_block$5(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("👁️");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(t);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$5.name,
		type: "if",
		source: "(24:8) {#if user.is_spectator}",
		ctx
	});

	return block;
}

// (29:12) {:else}
function create_else_block$4(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("⌛");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(t);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$4.name,
		type: "else",
		source: "(29:12) {:else}",
		ctx
	});

	return block;
}

// (27:12) {#if isRevealed}
function create_if_block_2$2(ctx) {
	let t_value = /*user*/ ctx[0].vote + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*user*/ 1 && t_value !== (t_value = /*user*/ ctx[0].vote + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(t);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$2.name,
		type: "if",
		source: "(27:12) {#if isRevealed}",
		ctx
	});

	return block;
}

// (23:4) <Card color={user.is_spectator ? '#effbf7' : undefined}>
function create_default_slot$2(ctx) {
	let if_block_anchor;

	function select_block_type(ctx, dirty) {
		if (/*user*/ ctx[0].is_spectator) return create_if_block$5;
		if (/*user*/ ctx[0].vote) return create_if_block_1$2;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type && current_block_type(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if (if_block) if_block.d(1);
				if_block = current_block_type && current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			}
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(if_block_anchor);
			}

			if (if_block) {
				if_block.d(detaching);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$2.name,
		type: "slot",
		source: "(23:4) <Card color={user.is_spectator ? '#effbf7' : undefined}>",
		ctx
	});

	return block;
}

function create_fragment$5(ctx) {
	let div;
	let strong;
	let t0_value = /*user*/ ctx[0].name + "";
	let t0;
	let t1;
	let card;
	let current;

	card = new Card({
			props: {
				color: /*user*/ ctx[0].is_spectator ? '#effbf7' : undefined,
				$$slots: { default: [create_default_slot$2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			strong = element("strong");
			t0 = text(t0_value);
			t1 = space();
			create_component(card.$$.fragment);
			add_location(strong, file$4, 21, 4, 550);
			attr_dev(div, "class", "participant svelte-10w4gcr");
			set_style(div, "transform", "rotate(" + /*angle*/ ctx[2] + "deg) translate(37.5vw) rotate(90deg)");
			add_location(div, file$4, 20, 0, 450);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, strong);
			append_dev(strong, t0);
			append_dev(div, t1);
			mount_component(card, div, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if ((!current || dirty & /*user*/ 1) && t0_value !== (t0_value = /*user*/ ctx[0].name + "")) set_data_dev(t0, t0_value);
			const card_changes = {};
			if (dirty & /*user*/ 1) card_changes.color = /*user*/ ctx[0].is_spectator ? '#effbf7' : undefined;

			if (dirty & /*$$scope, user, isRevealed*/ 35) {
				card_changes.$$scope = { dirty, ctx };
			}

			card.$set(card_changes);

			if (!current || dirty & /*angle*/ 4) {
				set_style(div, "transform", "rotate(" + /*angle*/ ctx[2] + "deg) translate(37.5vw) rotate(90deg)");
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(card.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(card.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div);
			}

			destroy_component(card);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$5.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const maxAngle = 174;

function instance$5($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Participant', slots, []);
	let { user } = $$props;
	let { isRevealed } = $$props;
	let { i } = $$props;
	let { count } = $$props;
	let angle;

	$$self.$$.on_mount.push(function () {
		if (user === undefined && !('user' in $$props || $$self.$$.bound[$$self.$$.props['user']])) {
			console.warn("<Participant> was created without expected prop 'user'");
		}

		if (isRevealed === undefined && !('isRevealed' in $$props || $$self.$$.bound[$$self.$$.props['isRevealed']])) {
			console.warn("<Participant> was created without expected prop 'isRevealed'");
		}

		if (i === undefined && !('i' in $$props || $$self.$$.bound[$$self.$$.props['i']])) {
			console.warn("<Participant> was created without expected prop 'i'");
		}

		if (count === undefined && !('count' in $$props || $$self.$$.bound[$$self.$$.props['count']])) {
			console.warn("<Participant> was created without expected prop 'count'");
		}
	});

	const writable_props = ['user', 'isRevealed', 'i', 'count'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Participant> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('user' in $$props) $$invalidate(0, user = $$props.user);
		if ('isRevealed' in $$props) $$invalidate(1, isRevealed = $$props.isRevealed);
		if ('i' in $$props) $$invalidate(3, i = $$props.i);
		if ('count' in $$props) $$invalidate(4, count = $$props.count);
	};

	$$self.$capture_state = () => ({
		Card,
		user,
		isRevealed,
		i,
		count,
		maxAngle,
		angle
	});

	$$self.$inject_state = $$props => {
		if ('user' in $$props) $$invalidate(0, user = $$props.user);
		if ('isRevealed' in $$props) $$invalidate(1, isRevealed = $$props.isRevealed);
		if ('i' in $$props) $$invalidate(3, i = $$props.i);
		if ('count' in $$props) $$invalidate(4, count = $$props.count);
		if ('angle' in $$props) $$invalidate(2, angle = $$props.angle);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*count, angle, i*/ 28) {
			{
				$$invalidate(2, angle = -90);

				if (count > 1) {
					// A fixed amount of degrees, or all parcitipants evenly distributed, whatever is smaller.
					$$invalidate(2, angle -= Math.min(20, maxAngle / count) * (i - (count - 1) / 2));
				}
			}
		}
	};

	return [user, isRevealed, angle, i, count];
}

class Participant extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$5, create_fragment$5, safe_not_equal, { user: 0, isRevealed: 1, i: 3, count: 4 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Participant",
			options,
			id: create_fragment$5.name
		});
	}

	get user() {
		throw new Error("<Participant>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set user(value) {
		throw new Error("<Participant>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isRevealed() {
		throw new Error("<Participant>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isRevealed(value) {
		throw new Error("<Participant>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get i() {
		throw new Error("<Participant>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set i(value) {
		throw new Error("<Participant>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get count() {
		throw new Error("<Participant>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set count(value) {
		throw new Error("<Participant>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

const subscriber_queue = [];

/**
 * Creates a `Readable` store that allows reading by subscription.
 *
 * https://svelte.dev/docs/svelte-store#readable
 * @template T
 * @param {T} [value] initial value
 * @param {import('./public.js').StartStopNotifier<T>} [start]
 * @returns {import('./public.js').Readable<T>}
 */
function readable(value, start) {
	return {
		subscribe: writable(value, start).subscribe
	};
}

/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 *
 * https://svelte.dev/docs/svelte-store#writable
 * @template T
 * @param {T} [value] initial value
 * @param {import('./public.js').StartStopNotifier<T>} [start]
 * @returns {import('./public.js').Writable<T>}
 */
function writable(value, start = noop) {
	/** @type {import('./public.js').Unsubscriber} */
	let stop;
	/** @type {Set<import('./private.js').SubscribeInvalidateTuple<T>>} */
	const subscribers = new Set();
	/** @param {T} new_value
	 * @returns {void}
	 */
	function set(new_value) {
		if (safe_not_equal(value, new_value)) {
			value = new_value;
			if (stop) {
				// store is ready
				const run_queue = !subscriber_queue.length;
				for (const subscriber of subscribers) {
					subscriber[1]();
					subscriber_queue.push(subscriber, value);
				}
				if (run_queue) {
					for (let i = 0; i < subscriber_queue.length; i += 2) {
						subscriber_queue[i][0](subscriber_queue[i + 1]);
					}
					subscriber_queue.length = 0;
				}
			}
		}
	}

	/**
	 * @param {import('./public.js').Updater<T>} fn
	 * @returns {void}
	 */
	function update(fn) {
		set(fn(value));
	}

	/**
	 * @param {import('./public.js').Subscriber<T>} run
	 * @param {import('./private.js').Invalidator<T>} [invalidate]
	 * @returns {import('./public.js').Unsubscriber}
	 */
	function subscribe(run, invalidate = noop) {
		/** @type {import('./private.js').SubscribeInvalidateTuple<T>} */
		const subscriber = [run, invalidate];
		subscribers.add(subscriber);
		if (subscribers.size === 1) {
			stop = start(set, update) || noop;
		}
		run(value);
		return () => {
			subscribers.delete(subscriber);
			if (subscribers.size === 0 && stop) {
				stop();
				stop = null;
			}
		};
	}
	return { set, update, subscribe };
}

/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 *
 * https://svelte.dev/docs/svelte-store#derived
 * @template {import('./private.js').Stores} S
 * @template T
 * @overload
 * @param {S} stores - input stores
 * @param {(values: import('./private.js').StoresValues<S>, set: (value: T) => void, update: (fn: import('./public.js').Updater<T>) => void) => import('./public.js').Unsubscriber | void} fn - function callback that aggregates the values
 * @param {T} [initial_value] - initial value
 * @returns {import('./public.js').Readable<T>}
 */

/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 *
 * https://svelte.dev/docs/svelte-store#derived
 * @template {import('./private.js').Stores} S
 * @template T
 * @overload
 * @param {S} stores - input stores
 * @param {(values: import('./private.js').StoresValues<S>) => T} fn - function callback that aggregates the values
 * @param {T} [initial_value] - initial value
 * @returns {import('./public.js').Readable<T>}
 */

/**
 * @template {import('./private.js').Stores} S
 * @template T
 * @param {S} stores
 * @param {Function} fn
 * @param {T} [initial_value]
 * @returns {import('./public.js').Readable<T>}
 */
function derived(stores, fn, initial_value) {
	const single = !Array.isArray(stores);
	/** @type {Array<import('./public.js').Readable<any>>} */
	const stores_array = single ? [stores] : stores;
	if (!stores_array.every(Boolean)) {
		throw new Error('derived() expects stores as input, got a falsy value');
	}
	const auto = fn.length < 2;
	return readable(initial_value, (set, update) => {
		let started = false;
		const values = [];
		let pending = 0;
		let cleanup = noop;
		const sync = () => {
			if (pending) {
				return;
			}
			cleanup();
			const result = fn(single ? values[0] : values, set, update);
			if (auto) {
				set(result);
			} else {
				cleanup = is_function(result) ? result : noop;
			}
		};
		const unsubscribers = stores_array.map((store, i) =>
			subscribe(
				store,
				(value) => {
					values[i] = value;
					pending &= ~(1 << i);
					if (started) {
						sync();
					}
				},
				() => {
					pending |= 1 << i;
				}
			)
		);
		started = true;
		sync();
		return function stop() {
			run_all(unsubscribers);
			cleanup();
			// We need to set this to false because callbacks can still happen despite having unsubscribed:
			// Callbacks might already be placed in the queue which doesn't know it should no longer
			// invoke this derived store.
			started = false;
		};
	});
}

const participants = writable([]);
const choices = writable([]);
const decks = writable([]);
const autoReveal = writable(false);
const deck = writable('tshirt');
const isRevealed = writable(false);
const user = writable({});
const error = writable(undefined);
const log = writable([]);

// Derive a sorted list of (card, votes)-pairs off of the participants store:
const votes = derived(participants, ($participants) => {
    const _votes = new Proxy({}, { get: (d, key) => (key in d ? d[key] : 0) });
    $participants.forEach((user) => {
        if (user.vote != null) {
            _votes[user.vote] += 1;
        }
    });

    return Object.entries(_votes).sort((a, b) => b[1] - a[1]);
});

// Voting is considered complete if all active non-spectators voted:
const votingComplete = derived(participants, ($participants) => {
    return $participants.every((p) => p.is_spectator || p.vote);
});

// Set the vote for the current user to `value`
const setUserVote = (value) => {
    user.update(($user) => {
        $user.vote = value;
        return $user;
    });
};

let socket;
function update(action, params = undefined) {
    if (!socket || socket.readyState != 1) {
        // wait until socket is open
        console.log('Socket not open yet');
        return;
    }

    params = params || {};
    params.action = action;
    console.log('update', params);
    socket.send(JSON.stringify(params));
}
function connect(websocketUrl) {
    socket = new WebSocket(websocketUrl);
    socket.onclose = () => {
        error.set('WebSocket connection closed unexpectedly. Trying to reconnect in 2s...');
        setTimeout(() => {
            console.log('Reconnecting...');
            connect(websocketUrl);
        }, 2000);
    };
    socket.onopen = () => {
        // Sometimes the 'init' message is not send from the backend if the page was already open,
        // sending an iniit message will result in an init response.
        update({ action: 'init' });
    };
    socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log('message', data);

        switch (data.type) {
            case 'init':
                participants.set(data.users);
                user.set(data.user);
                choices.set(data.settings.choices);
                autoReveal.set(data.settings.auto_reveal);
                isRevealed.set(data.settings.is_revealed);
                decks.set(data.settings.decks);
                deck.set(data.settings.deck);
                log.set(data.log);
                error.set(undefined);

                break;
            case 'vote':
                participants.update(($parcitipants) => {
                    $parcitipants.forEach((p) => {
                        if (p.id == data.user_id) {
                            p.vote = data.value;
                        }
                    });

                    return [...$parcitipants];
                });
                break;
            case 'error':
                error.set(data.message);
                break;
        }
    };
}

const revealVotes = () => update('reveal');
const clearVotes = () => {
    setUserVote(null);
    update('clear');
};

function castVote(value) {
    return () => {
        if (!get_store_value(isRevealed)) {
            update('vote', { value: value });
            setUserVote(value);
        }
    };
}


deck.subscribe(($deck) => update('settings', { deck: $deck }));
autoReveal.subscribe(($autoReveal) => update('settings', { auto_reveal: $autoReveal }));

/* js/Settings.svelte generated by Svelte v4.2.1 */

const file$3 = "js/Settings.svelte";

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i][0];
	child_ctx[9] = list[i][1];
	return child_ctx;
}

// (7:8) {#each $decks as [value, label]}
function create_each_block$2(ctx) {
	let input;
	let input_value_value;
	let value_has_changed = false;
	let input_id_value;
	let input_disabled_value;
	let t0;
	let label_1;
	let t1_value = /*label*/ ctx[9] + "";
	let t1;
	let label_1_for_value;
	let binding_group;
	let mounted;
	let dispose;
	binding_group = init_binding_group(/*$$binding_groups*/ ctx[6][0]);

	const block = {
		c: function create() {
			input = element("input");
			t0 = space();
			label_1 = element("label");
			t1 = text(t1_value);
			attr_dev(input, "type", "radio");
			attr_dev(input, "class", "btn-check");
			input.__value = input_value_value = /*value*/ ctx[8];
			set_input_value(input, input.__value);
			attr_dev(input, "autocomplete", "off");
			attr_dev(input, "id", input_id_value = "deck-" + /*value*/ ctx[8]);
			input.disabled = input_disabled_value = !/*$isRevealed*/ ctx[1];
			add_location(input, file$3, 7, 12, 308);
			attr_dev(label_1, "class", "btn btn-outline-primary svelte-1y9hivi");
			attr_dev(label_1, "for", label_1_for_value = "deck-" + /*value*/ ctx[8]);
			add_location(label_1, file$3, 15, 12, 561);
			binding_group.p(input);
		},
		m: function mount(target, anchor) {
			insert_dev(target, input, anchor);
			input.checked = input.__value === /*$deck*/ ctx[2];
			insert_dev(target, t0, anchor);
			insert_dev(target, label_1, anchor);
			append_dev(label_1, t1);

			if (!mounted) {
				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[5]);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$decks*/ 1 && input_value_value !== (input_value_value = /*value*/ ctx[8])) {
				prop_dev(input, "__value", input_value_value);
				set_input_value(input, input.__value);
				value_has_changed = true;
			}

			if (dirty & /*$decks*/ 1 && input_id_value !== (input_id_value = "deck-" + /*value*/ ctx[8])) {
				attr_dev(input, "id", input_id_value);
			}

			if (dirty & /*$isRevealed*/ 2 && input_disabled_value !== (input_disabled_value = !/*$isRevealed*/ ctx[1])) {
				prop_dev(input, "disabled", input_disabled_value);
			}

			if (value_has_changed || dirty & /*$deck, $decks*/ 5) {
				input.checked = input.__value === /*$deck*/ ctx[2];
			}

			if (dirty & /*$decks*/ 1 && t1_value !== (t1_value = /*label*/ ctx[9] + "")) set_data_dev(t1, t1_value);

			if (dirty & /*$decks*/ 1 && label_1_for_value !== (label_1_for_value = "deck-" + /*value*/ ctx[8])) {
				attr_dev(label_1, "for", label_1_for_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(input);
				detach_dev(t0);
				detach_dev(label_1);
			}

			binding_group.r();
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$2.name,
		type: "each",
		source: "(7:8) {#each $decks as [value, label]}",
		ctx
	});

	return block;
}

// (21:4) {#if !$autoReveal}
function create_if_block_1$1(ctx) {
	let if_block_anchor;

	function select_block_type(ctx, dirty) {
		if (!/*$isRevealed*/ ctx[1] && /*$votingComplete*/ ctx[4]) return create_if_block_2$1;
		return create_else_block_1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			}
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(if_block_anchor);
			}

			if_block.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$1.name,
		type: "if",
		source: "(21:4) {#if !$autoReveal}",
		ctx
	});

	return block;
}

// (24:8) {:else}
function create_else_block_1(ctx) {
	let div;

	const block = {
		c: function create() {
			div = element("div");
			div.textContent = "~";
			attr_dev(div, "class", "voting-status svelte-1y9hivi");
			attr_dev(div, "title", "Voting in progress");
			add_location(div, file$3, 24, 12, 843);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_1.name,
		type: "else",
		source: "(24:8) {:else}",
		ctx
	});

	return block;
}

// (22:8) {#if !$isRevealed && $votingComplete}
function create_if_block_2$1(ctx) {
	let div;

	const block = {
		c: function create() {
			div = element("div");
			div.textContent = "✓";
			attr_dev(div, "class", "voting-status svelte-1y9hivi");
			attr_dev(div, "title", "Voting complete");
			add_location(div, file$3, 22, 12, 756);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$1.name,
		type: "if",
		source: "(22:8) {#if !$isRevealed && $votingComplete}",
		ctx
	});

	return block;
}

// (30:4) {:else}
function create_else_block$3(ctx) {
	let button;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			button = element("button");
			button.textContent = "Reveal";
			attr_dev(button, "class", "btn btn-sm btn-primary svelte-1y9hivi");
			add_location(button, file$3, 30, 8, 1055);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);

			if (!mounted) {
				dispose = listen_dev(button, "click", revealVotes, false, false, false, false);
				mounted = true;
			}
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(button);
			}

			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$3.name,
		type: "else",
		source: "(30:4) {:else}",
		ctx
	});

	return block;
}

// (28:4) {#if $isRevealed}
function create_if_block$4(ctx) {
	let button;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			button = element("button");
			button.textContent = "Clear";
			attr_dev(button, "class", "btn btn-sm btn-warning svelte-1y9hivi");
			add_location(button, file$3, 28, 8, 959);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);

			if (!mounted) {
				dispose = listen_dev(button, "click", clearVotes, false, false, false, false);
				mounted = true;
			}
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(button);
			}

			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$4.name,
		type: "if",
		source: "(28:4) {#if $isRevealed}",
		ctx
	});

	return block;
}

function create_fragment$4(ctx) {
	let div2;
	let div0;
	let t0;
	let t1;
	let t2;
	let div1;
	let label_1;
	let t4;
	let input;
	let mounted;
	let dispose;
	let each_value = ensure_array_like_dev(/*$decks*/ ctx[0]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
	}

	let if_block0 = !/*$autoReveal*/ ctx[3] && create_if_block_1$1(ctx);

	function select_block_type_1(ctx, dirty) {
		if (/*$isRevealed*/ ctx[1]) return create_if_block$4;
		return create_else_block$3;
	}

	let current_block_type = select_block_type_1(ctx);
	let if_block1 = current_block_type(ctx);

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t0 = text("\n     \n\n    ");
			if (if_block0) if_block0.c();
			t1 = space();
			if_block1.c();
			t2 = space();
			div1 = element("div");
			label_1 = element("label");
			label_1.textContent = "Auto reveal";
			t4 = space();
			input = element("input");
			attr_dev(div0, "class", "btn-group btn-group-sm");
			attr_dev(div0, "role", "group");
			attr_dev(div0, "aria-label", "Change deck");
			add_location(div0, file$3, 5, 4, 180);
			attr_dev(label_1, "for", "autoReveal");
			attr_dev(label_1, "class", "svelte-1y9hivi");
			add_location(label_1, file$3, 34, 8, 1203);
			attr_dev(input, "type", "checkbox");
			attr_dev(input, "class", "form-check-input");
			attr_dev(input, "id", "autoReveal");
			add_location(input, file$3, 35, 8, 1255);
			attr_dev(div1, "class", "form-check form-switch mt-1 ms-3");
			add_location(div1, file$3, 33, 4, 1148);
			attr_dev(div2, "class", "d-flex justify-content-center m-3");
			add_location(div2, file$3, 4, 0, 128);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div0, null);
				}
			}

			append_dev(div2, t0);
			if (if_block0) if_block0.m(div2, null);
			append_dev(div2, t1);
			if_block1.m(div2, null);
			append_dev(div2, t2);
			append_dev(div2, div1);
			append_dev(div1, label_1);
			append_dev(div1, t4);
			append_dev(div1, input);
			input.checked = /*$autoReveal*/ ctx[3];

			if (!mounted) {
				dispose = listen_dev(input, "change", /*input_change_handler_1*/ ctx[7]);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*$decks, $isRevealed, $deck*/ 7) {
				each_value = ensure_array_like_dev(/*$decks*/ ctx[0]);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$2(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div0, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (!/*$autoReveal*/ ctx[3]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_1$1(ctx);
					if_block0.c();
					if_block0.m(div2, t1);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
				if_block1.d(1);
				if_block1 = current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(div2, t2);
				}
			}

			if (dirty & /*$autoReveal*/ 8) {
				input.checked = /*$autoReveal*/ ctx[3];
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div2);
			}

			destroy_each(each_blocks, detaching);
			if (if_block0) if_block0.d();
			if_block1.d();
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$4.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$4($$self, $$props, $$invalidate) {
	let $decks;
	let $isRevealed;
	let $deck;
	let $autoReveal;
	let $votingComplete;
	validate_store(decks, 'decks');
	component_subscribe($$self, decks, $$value => $$invalidate(0, $decks = $$value));
	validate_store(isRevealed, 'isRevealed');
	component_subscribe($$self, isRevealed, $$value => $$invalidate(1, $isRevealed = $$value));
	validate_store(deck, 'deck');
	component_subscribe($$self, deck, $$value => $$invalidate(2, $deck = $$value));
	validate_store(autoReveal, 'autoReveal');
	component_subscribe($$self, autoReveal, $$value => $$invalidate(3, $autoReveal = $$value));
	validate_store(votingComplete, 'votingComplete');
	component_subscribe($$self, votingComplete, $$value => $$invalidate(4, $votingComplete = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Settings', slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Settings> was created with unknown prop '${key}'`);
	});

	const $$binding_groups = [[]];

	function input_change_handler() {
		$deck = this.__value;
		deck.set($deck);
	}

	function input_change_handler_1() {
		$autoReveal = this.checked;
		autoReveal.set($autoReveal);
	}

	$$self.$capture_state = () => ({
		autoReveal,
		deck,
		decks,
		isRevealed,
		clearVotes,
		revealVotes,
		votingComplete,
		$decks,
		$isRevealed,
		$deck,
		$autoReveal,
		$votingComplete
	});

	return [
		$decks,
		$isRevealed,
		$deck,
		$autoReveal,
		$votingComplete,
		input_change_handler,
		$$binding_groups,
		input_change_handler_1
	];
}

class Settings extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$4, create_fragment$4, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Settings",
			options,
			id: create_fragment$4.name
		});
	}
}

/* js/Debug.svelte generated by Svelte v4.2.1 */

const file$2 = "js/Debug.svelte";

// (22:8) {#if !isProduction}
function create_if_block$3(ctx) {
	let button0;
	let t1;
	let button1;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			button0 = element("button");
			button0.textContent = "Add fake users";
			t1 = space();
			button1 = element("button");
			button1.textContent = "Add fake votes";
			attr_dev(button0, "class", "btn btn-warning");
			add_location(button0, file$2, 22, 12, 735);
			attr_dev(button1, "class", "btn btn-warning");
			add_location(button1, file$2, 23, 12, 840);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button0, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, button1, anchor);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*click_handler*/ ctx[11], false, false, false, false),
					listen_dev(button1, "click", /*click_handler_1*/ ctx[12], false, false, false, false)
				];

				mounted = true;
			}
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(button0);
				detach_dev(t1);
				detach_dev(button1);
			}

			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$3.name,
		type: "if",
		source: "(22:8) {#if !isProduction}",
		ctx
	});

	return block;
}

function create_fragment$3(ctx) {
	let div6;
	let div4;
	let div0;
	let t0;
	let code0;
	let t1_value = JSON.stringify(/*settings*/ ctx[0]) + "";
	let t1;
	let t2;
	let div1;
	let t3;
	let code1;
	let t4_value = JSON.stringify(/*$votes*/ ctx[1]) + "";
	let t4;
	let t5;
	let div2;
	let t6;
	let code2;
	let t7_value = JSON.stringify(/*$user*/ ctx[2]) + "";
	let t7;
	let t8;
	let div3;
	let t9;
	let code3;
	let t10_value = JSON.stringify(/*$participants*/ ctx[3]) + "";
	let t10;
	let t11;
	let t12;
	let div5;
	let if_block = !/*isProduction*/ ctx[4] && create_if_block$3(ctx);

	const block = {
		c: function create() {
			div6 = element("div");
			div4 = element("div");
			div0 = element("div");
			t0 = text("debug");
			code0 = element("code");
			t1 = text(t1_value);
			t2 = space();
			div1 = element("div");
			t3 = text("votes: ");
			code1 = element("code");
			t4 = text(t4_value);
			t5 = space();
			div2 = element("div");
			t6 = text("user: ");
			code2 = element("code");
			t7 = text(t7_value);
			t8 = space();
			div3 = element("div");
			t9 = text("participants: ");
			code3 = element("code");
			t10 = text(t10_value);
			t11 = space();
			if (if_block) if_block.c();
			t12 = space();
			div5 = element("div");
			div5.textContent = "log";
			add_location(code0, file$2, 17, 18, 445);
			add_location(div0, file$2, 17, 8, 435);
			add_location(code1, file$2, 18, 20, 511);
			add_location(div1, file$2, 18, 8, 499);
			add_location(code2, file$2, 19, 19, 574);
			add_location(div2, file$2, 19, 8, 563);
			add_location(code3, file$2, 20, 27, 644);
			add_location(div3, file$2, 20, 8, 625);
			attr_dev(div4, "class", "col");
			add_location(div4, file$2, 16, 4, 409);
			attr_dev(div5, "class", "col");
			add_location(div5, file$2, 26, 4, 963);
			attr_dev(div6, "class", "row bg-light rounded p-2");
			add_location(div6, file$2, 15, 0, 366);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div6, anchor);
			append_dev(div6, div4);
			append_dev(div4, div0);
			append_dev(div0, t0);
			append_dev(div0, code0);
			append_dev(code0, t1);
			append_dev(div4, t2);
			append_dev(div4, div1);
			append_dev(div1, t3);
			append_dev(div1, code1);
			append_dev(code1, t4);
			append_dev(div4, t5);
			append_dev(div4, div2);
			append_dev(div2, t6);
			append_dev(div2, code2);
			append_dev(code2, t7);
			append_dev(div4, t8);
			append_dev(div4, div3);
			append_dev(div3, t9);
			append_dev(div3, code3);
			append_dev(code3, t10);
			append_dev(div4, t11);
			if (if_block) if_block.m(div4, null);
			append_dev(div6, t12);
			append_dev(div6, div5);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*settings*/ 1 && t1_value !== (t1_value = JSON.stringify(/*settings*/ ctx[0]) + "")) set_data_dev(t1, t1_value);
			if (dirty & /*$votes*/ 2 && t4_value !== (t4_value = JSON.stringify(/*$votes*/ ctx[1]) + "")) set_data_dev(t4, t4_value);
			if (dirty & /*$user*/ 4 && t7_value !== (t7_value = JSON.stringify(/*$user*/ ctx[2]) + "")) set_data_dev(t7, t7_value);
			if (dirty & /*$participants*/ 8 && t10_value !== (t10_value = JSON.stringify(/*$participants*/ ctx[3]) + "")) set_data_dev(t10, t10_value);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div6);
			}

			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$3.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$3($$self, $$props, $$invalidate) {
	let settings;
	let $autoReveal;
	let $isRevealed;
	let $choices;
	let $decks;
	let $deck;
	let $error;
	let $votes;
	let $user;
	let $participants;
	validate_store(autoReveal, 'autoReveal');
	component_subscribe($$self, autoReveal, $$value => $$invalidate(5, $autoReveal = $$value));
	validate_store(isRevealed, 'isRevealed');
	component_subscribe($$self, isRevealed, $$value => $$invalidate(6, $isRevealed = $$value));
	validate_store(choices, 'choices');
	component_subscribe($$self, choices, $$value => $$invalidate(7, $choices = $$value));
	validate_store(decks, 'decks');
	component_subscribe($$self, decks, $$value => $$invalidate(8, $decks = $$value));
	validate_store(deck, 'deck');
	component_subscribe($$self, deck, $$value => $$invalidate(9, $deck = $$value));
	validate_store(error, 'error');
	component_subscribe($$self, error, $$value => $$invalidate(10, $error = $$value));
	validate_store(votes, 'votes');
	component_subscribe($$self, votes, $$value => $$invalidate(1, $votes = $$value));
	validate_store(user, 'user');
	component_subscribe($$self, user, $$value => $$invalidate(2, $user = $$value));
	validate_store(participants, 'participants');
	component_subscribe($$self, participants, $$value => $$invalidate(3, $participants = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Debug', slots, []);
	const isProduction = !window.location.host.includes('localhost');
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Debug> was created with unknown prop '${key}'`);
	});

	const click_handler = () => update('add_fakes');
	const click_handler_1 = () => update('fake_votes');

	$$self.$capture_state = () => ({
		deck,
		decks,
		choices,
		error,
		isRevealed,
		participants,
		update,
		user,
		autoReveal,
		votes,
		log,
		isProduction,
		settings,
		$autoReveal,
		$isRevealed,
		$choices,
		$decks,
		$deck,
		$error,
		$votes,
		$user,
		$participants
	});

	$$self.$inject_state = $$props => {
		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$error, $deck, $decks, $choices, $isRevealed, $autoReveal*/ 2016) {
			$$invalidate(0, settings = {
				error: $error,
				deck: $deck,
				decks: $decks,
				choices: $choices,
				isRevealed: $isRevealed,
				autoReveal: $autoReveal
			});
		}
	};

	return [
		settings,
		$votes,
		$user,
		$participants,
		isProduction,
		$autoReveal,
		$isRevealed,
		$choices,
		$decks,
		$deck,
		$error,
		click_handler,
		click_handler_1
	];
}

class Debug extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$3, create_fragment$3, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Debug",
			options,
			id: create_fragment$3.name
		});
	}
}

const t=(t,b={})=>{w(b);let{colors:k=["#FFC700","#FF0000","#2E3191","#41BBC7"],duration:W=3500,force:S=.5,particleCount:G=150,particleShape:X="mix",particleSize:_=12,destroyAfterDone:C=!0,stageHeight:z=800,stageWidth:E=1600}=b;!function(t){const e=f("style");e.dataset.neoconfetti="",e.textContent='@keyframes fk9XWG_y-axis{to{transform:translate3d(0,var(--stage-height),0)}}@keyframes fk9XWG_x-axis{to{transform:translate3d(var(--x-landing-point),0,0)}}@keyframes fk9XWG_rotation{50%{transform:rotate3d(var(--half-rotation),180deg)}to{transform:rotate3d(var(--rotation),360deg)}}.fk9XWG_container{width:0;height:0;z-index:1200;position:relative;overflow:visible}.fk9XWG_particle{animation:x-axis var(--duration-chaos)forwards cubic-bezier(var(--x1),var(--x2),var(--x3),var(--x4));animation-name:fk9XWG_x-axis}.fk9XWG_particle>div{animation:y-axis var(--duration-chaos)forwards cubic-bezier(var(--y1),var(--y2),var(--y3),var(--y4));width:var(--width);height:var(--height);animation-name:fk9XWG_y-axis;position:absolute;top:0;left:0}.fk9XWG_particle>div:before{height:100%;width:100%;content:"";background-color:var(--bgcolor);animation:rotation var(--rotation-duration)infinite linear;border-radius:var(--border-radius);animation-name:fk9XWG_rotation;display:block}',h(document.head,e);}(),t.classList.add("fk9XWG_container"),t.style.setProperty("--stage-height",z+"px");let P,A=p(G,k),H=e(t,A);function M(t,e){const f=l(c()*(x-1)),h="rectangles"!==X&&("circles"===X||v(f)),p=(e,r)=>t.style.setProperty(e,r+"");p("--x-landing-point",u(s(m(e,90)-180),0,180,-E/2,E/2)+"px"),p("--duration-chaos",W-l(1e3*c())+"ms");const b=c()<a?g(c()*i,2):0;p("--x1",b),p("--x2",-1*b),p("--x3",b),p("--x4",g(s(u(s(m(e,90)-180),0,180,-1,1)),4)),p("--y1",g(c()*n,4)),p("--y2",g(c()*S*(y()?1:-1),4)),p("--y3",n),p("--y4",g(d(u(s(e-180),0,180,S,-S),0),4)),p("--width",(h?_:l(4*c())+_/2)+"px"),p("--height",(h?_:l(2*c())+_)+"px");const k=f.toString(2).padStart(3,"0").split("");p("--half-rotation",k.map((t=>+t/2+""))),p("--rotation",k),p("--rotation-duration",g(c()*(o-r)+r)+"ms"),p("--border-radius",h?"50%":0);}for(const[t,e]of Object.entries(H))M(e,A[+t].degree);return Promise.resolve().then((()=>P=setTimeout((()=>C&&(t.innerHTML="")),W))),{update(r){w(r);const o=r.particleCount??G,a=r.colors??k,i=r.stageHeight??z;if(A=p(o,a),o===G&&JSON.stringify(k)!==JSON.stringify(a))for(const[t,{color:e}]of Object.entries(A))H[+t].style.setProperty("--bgcolor",e);o!==G&&(t.innerHTML="",H=e(t,A)),C&&!r.destroyAfterDone&&clearTimeout(P),t.style.setProperty("--stage-height",i+"px"),k=a,W=r.duration??W,S=r.force??S,G=o,X=r.particleShape??X,_=r.particleSize??_,C=r.destroyAfterDone??C,z=i,E=r.stageWidth??E;},destroy(){clearTimeout(P);}}};function e(t,e=[]){const r=[];for(const{color:o}of e){const e=f("div");e.className="fk9XWG_particle",e.style.setProperty("--bgcolor",o);const a=f("div");h(e,a),h(t,e),r.push(e);}return r}const r=200,o=800,a=.1,i=.3,n=.5,s=Math.abs,c=Math.random,l=Math.round,d=Math.max,f=t=>document.createElement(t),h=(t,e)=>t.appendChild(e),p=(t,e)=>Array.from({length:t},((r,o)=>({color:e[o%e.length],degree:360*o/t}))),g=(t,e=2)=>l((t+Number.EPSILON)*10**e)/10**e,u=(t,e,r,o,a)=>(t-e)*(a-o)/(r-e)+o,m=(t,e)=>t+e>360?t+e-360:t+e,y=()=>c()>.5,x=6,v=t=>1!==t&&y(),b=t=>void 0===t,k=(t,e)=>{if(!b(t)&&Number.isSafeInteger(t)&&t<0)throw new Error(e+" must be a positive integer")},w=({particleCount:t,duration:e,colors:r,particleSize:o,force:a,stageHeight:i,stageWidth:n,particleShape:s})=>{if(k(t,"particleCount"),k(e,"duration"),k(o,"particleSize"),k(a,"force"),k(i,"stageHeight"),k(n,"stageWidth"),!b(s)&&!/^(mix|circles|rectangles)$/i.test(s))throw new Error('particlesShape should be either "mix" or "circles" or "rectangle"');if(!b(r)&&!Array.isArray(r))throw new Error("colors must be an array of strings");if(a>1)throw new Error("force must be within 0 and 1")};

/* js/Summary.svelte generated by Svelte v4.2.1 */
const file$1 = "js/Summary.svelte";

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[1] = list[i][0];
	child_ctx[2] = list[i][1];
	return child_ctx;
}

// (9:0) {#if votes && votes.length == 1 && votes[0][1] > 1}
function create_if_block$2(ctx) {
	let div;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			add_location(div, file$1, 9, 4, 178);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (!mounted) {
				dispose = action_destroyer(t.call(null, div));
				mounted = true;
			}
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div);
			}

			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$2.name,
		type: "if",
		source: "(9:0) {#if votes && votes.length == 1 && votes[0][1] > 1}",
		ctx
	});

	return block;
}

// (18:4) {:else}
function create_else_block$2(ctx) {
	let div;

	const block = {
		c: function create() {
			div = element("div");
			div.textContent = "No votes";
			attr_dev(div, "class", "col text-center p-2");
			add_location(div, file$1, 18, 8, 465);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$2.name,
		type: "else",
		source: "(18:4) {:else}",
		ctx
	});

	return block;
}

// (15:12) <Card>
function create_default_slot$1(ctx) {
	let t_value = /*vote*/ ctx[1] + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*votes*/ 1 && t_value !== (t_value = /*vote*/ ctx[1] + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(t);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$1.name,
		type: "slot",
		source: "(15:12) <Card>",
		ctx
	});

	return block;
}

// (13:4) {#each votes as [vote, count] (vote)}
function create_each_block$1(key_1, ctx) {
	let div1;
	let card;
	let t0;
	let div0;
	let t1_value = /*count*/ ctx[2] + "";
	let t1;
	let t2;
	let t3;
	let current;

	card = new Card({
			props: {
				$$slots: { default: [create_default_slot$1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		key: key_1,
		first: null,
		c: function create() {
			div1 = element("div");
			create_component(card.$$.fragment);
			t0 = space();
			div0 = element("div");
			t1 = text(t1_value);
			t2 = text("x");
			t3 = space();
			attr_dev(div0, "class", "text-muted");
			add_location(div0, file$1, 15, 12, 391);
			attr_dev(div1, "class", "d-inline-block text-center m-2");
			add_location(div1, file$1, 13, 8, 302);
			this.first = div1;
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			mount_component(card, div1, null);
			append_dev(div1, t0);
			append_dev(div1, div0);
			append_dev(div0, t1);
			append_dev(div0, t2);
			append_dev(div1, t3);
			current = true;
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			const card_changes = {};

			if (dirty & /*$$scope, votes*/ 33) {
				card_changes.$$scope = { dirty, ctx };
			}

			card.$set(card_changes);
			if ((!current || dirty & /*votes*/ 1) && t1_value !== (t1_value = /*count*/ ctx[2] + "")) set_data_dev(t1, t1_value);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(card.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(card.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div1);
			}

			destroy_component(card);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$1.name,
		type: "each",
		source: "(13:4) {#each votes as [vote, count] (vote)}",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
	let t;
	let div;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let current;
	let if_block = /*votes*/ ctx[0] && /*votes*/ ctx[0].length == 1 && /*votes*/ ctx[0][0][1] > 1 && create_if_block$2(ctx);
	let each_value = ensure_array_like_dev(/*votes*/ ctx[0]);
	const get_key = ctx => /*vote*/ ctx[1];
	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$1(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
	}

	let each_1_else = null;

	if (!each_value.length) {
		each_1_else = create_else_block$2(ctx);
	}

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			t = space();
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			if (each_1_else) {
				each_1_else.c();
			}

			attr_dev(div, "class", "summary rounded mb-3 text-center svelte-2nvyci");
			add_location(div, file$1, 11, 0, 205);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, t, anchor);
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div, null);
				}
			}

			if (each_1_else) {
				each_1_else.m(div, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*votes*/ ctx[0] && /*votes*/ ctx[0].length == 1 && /*votes*/ ctx[0][0][1] > 1) {
				if (if_block) ; else {
					if_block = create_if_block$2(ctx);
					if_block.c();
					if_block.m(t.parentNode, t);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*votes*/ 1) {
				each_value = ensure_array_like_dev(/*votes*/ ctx[0]);
				group_outros();
				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
				check_outros();

				if (!each_value.length && each_1_else) {
					each_1_else.p(ctx, dirty);
				} else if (!each_value.length) {
					each_1_else = create_else_block$2(ctx);
					each_1_else.c();
					each_1_else.m(div, null);
				} else if (each_1_else) {
					each_1_else.d(1);
					each_1_else = null;
				}
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(t);
				detach_dev(div);
			}

			if (if_block) if_block.d(detaching);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			if (each_1_else) each_1_else.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$2.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$2($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Summary', slots, []);
	let { votes } = $$props;

	$$self.$$.on_mount.push(function () {
		if (votes === undefined && !('votes' in $$props || $$self.$$.bound[$$self.$$.props['votes']])) {
			console.warn("<Summary> was created without expected prop 'votes'");
		}
	});

	const writable_props = ['votes'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Summary> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('votes' in $$props) $$invalidate(0, votes = $$props.votes);
	};

	$$self.$capture_state = () => ({ confetti: t, Card, votes });

	$$self.$inject_state = $$props => {
		if ('votes' in $$props) $$invalidate(0, votes = $$props.votes);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [votes];
}

class Summary extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$2, create_fragment$2, safe_not_equal, { votes: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Summary",
			options,
			id: create_fragment$2.name
		});
	}

	get votes() {
		throw new Error("<Summary>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set votes(value) {
		throw new Error("<Summary>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* js/Voting.svelte generated by Svelte v4.2.1 */
const file = "js/Voting.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[11] = list[i];
	child_ctx[13] = i;
	return child_ctx;
}

// (19:0) {#if $error}
function create_if_block_3(ctx) {
	let div1;
	let div0;
	let t;

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			t = text(/*$error*/ ctx[1]);
			attr_dev(div0, "class", "alert alert-danger");
			attr_dev(div0, "role", "alert");
			add_location(div0, file, 20, 8, 629);
			attr_dev(div1, "class", "fixed-top");
			add_location(div1, file, 19, 4, 597);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$error*/ 2) set_data_dev(t, /*$error*/ ctx[1]);
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div1);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3.name,
		type: "if",
		source: "(19:0) {#if $error}",
		ctx
	});

	return block;
}

// (25:4) {#each $participants as user, i (user.id)}
function create_each_block_1(key_1, ctx) {
	let first;
	let participant;
	let current;

	participant = new Participant({
			props: {
				isRevealed: /*$isRevealed*/ ctx[3],
				user: /*user*/ ctx[11],
				i: /*i*/ ctx[13],
				count: /*$participants*/ ctx[2].length
			},
			$$inline: true
		});

	const block = {
		key: key_1,
		first: null,
		c: function create() {
			first = empty();
			create_component(participant.$$.fragment);
			this.first = first;
		},
		m: function mount(target, anchor) {
			insert_dev(target, first, anchor);
			mount_component(participant, target, anchor);
			current = true;
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			const participant_changes = {};
			if (dirty & /*$isRevealed*/ 8) participant_changes.isRevealed = /*$isRevealed*/ ctx[3];
			if (dirty & /*$participants*/ 4) participant_changes.user = /*user*/ ctx[11];
			if (dirty & /*$participants*/ 4) participant_changes.i = /*i*/ ctx[13];
			if (dirty & /*$participants*/ 4) participant_changes.count = /*$participants*/ ctx[2].length;
			participant.$set(participant_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(participant.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(participant.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(first);
			}

			destroy_component(participant, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(25:4) {#each $participants as user, i (user.id)}",
		ctx
	});

	return block;
}

// (28:4) {#if $isRevealed}
function create_if_block_2(ctx) {
	let div;
	let summary;
	let current;

	summary = new Summary({
			props: { votes: /*$votes*/ ctx[4] },
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(summary.$$.fragment);
			attr_dev(div, "class", "controls svelte-a5p6ah");
			add_location(div, file, 28, 8, 911);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(summary, div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const summary_changes = {};
			if (dirty & /*$votes*/ 16) summary_changes.votes = /*$votes*/ ctx[4];
			summary.$set(summary_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(summary.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(summary.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div);
			}

			destroy_component(summary);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(28:4) {#if $isRevealed}",
		ctx
	});

	return block;
}

// (43:12) {:else}
function create_else_block$1(ctx) {
	let div;
	let current;
	let each_value = ensure_array_like_dev(/*$choices*/ ctx[6]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "class", "d-flex justify-content-center");
			add_location(div, file, 43, 16, 1411);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div, null);
				}
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$isRevealed, $choices, $user*/ 104) {
				each_value = ensure_array_like_dev(/*$choices*/ ctx[6]);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div);
			}

			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$1.name,
		type: "else",
		source: "(43:12) {:else}",
		ctx
	});

	return block;
}

// (37:12) {#if $user.is_spectator}
function create_if_block_1(ctx) {
	let t0;
	let br;
	let t1;
	let button;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			t0 = text("You joined as spectator.");
			br = element("br");
			t1 = text("\n                I want to\n                ");
			button = element("button");
			button.textContent = "become a voter";
			add_location(br, file, 37, 40, 1166);
			attr_dev(button, "class", "btn btn-light btn-sm");
			add_location(button, file, 39, 16, 1215);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, br, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, button, anchor);

			if (!mounted) {
				dispose = listen_dev(button, "click", /*click_handler*/ ctx[7], false, false, false, false);
				mounted = true;
			}
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(t0);
				detach_dev(br);
				detach_dev(t1);
				detach_dev(button);
			}

			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(37:12) {#if $user.is_spectator}",
		ctx
	});

	return block;
}

// (46:24) <Card                             on:click={castVote(choice)}                             on:keypress={castVote(choice)}                             disabled={$isRevealed}                             selected={choice == $user.vote}>
function create_default_slot(ctx) {
	let t0_value = /*choice*/ ctx[8] + "";
	let t0;
	let t1;

	const block = {
		c: function create() {
			t0 = text(t0_value);
			t1 = space();
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, t1, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$choices*/ 64 && t0_value !== (t0_value = /*choice*/ ctx[8] + "")) set_data_dev(t0, t0_value);
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(t0);
				detach_dev(t1);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(46:24) <Card                             on:click={castVote(choice)}                             on:keypress={castVote(choice)}                             disabled={$isRevealed}                             selected={choice == $user.vote}>",
		ctx
	});

	return block;
}

// (45:20) {#each $choices as choice}
function create_each_block(ctx) {
	let card;
	let current;

	card = new Card({
			props: {
				disabled: /*$isRevealed*/ ctx[3],
				selected: /*choice*/ ctx[8] == /*$user*/ ctx[5].vote,
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	card.$on("click", function () {
		if (is_function(castVote(/*choice*/ ctx[8]))) castVote(/*choice*/ ctx[8]).apply(this, arguments);
	});

	card.$on("keypress", function () {
		if (is_function(castVote(/*choice*/ ctx[8]))) castVote(/*choice*/ ctx[8]).apply(this, arguments);
	});

	const block = {
		c: function create() {
			create_component(card.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(card, target, anchor);
			current = true;
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			const card_changes = {};
			if (dirty & /*$isRevealed*/ 8) card_changes.disabled = /*$isRevealed*/ ctx[3];
			if (dirty & /*$choices, $user*/ 96) card_changes.selected = /*choice*/ ctx[8] == /*$user*/ ctx[5].vote;

			if (dirty & /*$$scope, $choices*/ 16448) {
				card_changes.$$scope = { dirty, ctx };
			}

			card.$set(card_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(card.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(card.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(card, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(45:20) {#each $choices as choice}",
		ctx
	});

	return block;
}

// (63:0) {#if debugOn}
function create_if_block$1(ctx) {
	let debug_1;
	let current;
	debug_1 = new Debug({ $$inline: true });

	const block = {
		c: function create() {
			create_component(debug_1.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(debug_1, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(debug_1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(debug_1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(debug_1, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(63:0) {#if debugOn}",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let t0;
	let div0;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let t1;
	let t2;
	let div4;
	let div2;
	let div1;
	let current_block_type_index;
	let if_block2;
	let t3;
	let div3;
	let settings;
	let t4;
	let if_block3_anchor;
	let current;
	let if_block0 = /*$error*/ ctx[1] && create_if_block_3(ctx);
	let each_value_1 = ensure_array_like_dev(/*$participants*/ ctx[2]);
	const get_key = ctx => /*user*/ ctx[11].id;
	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

	for (let i = 0; i < each_value_1.length; i += 1) {
		let child_ctx = get_each_context_1(ctx, each_value_1, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
	}

	let if_block1 = /*$isRevealed*/ ctx[3] && create_if_block_2(ctx);
	const if_block_creators = [create_if_block_1, create_else_block$1];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*$user*/ ctx[5].is_spectator) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	settings = new Settings({ $$inline: true });
	let if_block3 = /*debugOn*/ ctx[0] && create_if_block$1(ctx);

	const block = {
		c: function create() {
			if (if_block0) if_block0.c();
			t0 = space();
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t1 = space();
			if (if_block1) if_block1.c();
			t2 = space();
			div4 = element("div");
			div2 = element("div");
			div1 = element("div");
			if_block2.c();
			t3 = space();
			div3 = element("div");
			create_component(settings.$$.fragment);
			t4 = space();
			if (if_block3) if_block3.c();
			if_block3_anchor = empty();
			attr_dev(div0, "class", "participants svelte-a5p6ah");
			add_location(div0, file, 23, 0, 706);
			attr_dev(div1, "class", "col");
			add_location(div1, file, 35, 8, 1071);
			attr_dev(div2, "class", "row");
			add_location(div2, file, 34, 4, 1045);
			attr_dev(div3, "class", "row");
			add_location(div3, file, 57, 4, 1927);
			attr_dev(div4, "class", "container text-center");
			add_location(div4, file, 33, 0, 1005);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, div0, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div0, null);
				}
			}

			append_dev(div0, t1);
			if (if_block1) if_block1.m(div0, null);
			insert_dev(target, t2, anchor);
			insert_dev(target, div4, anchor);
			append_dev(div4, div2);
			append_dev(div2, div1);
			if_blocks[current_block_type_index].m(div1, null);
			append_dev(div4, t3);
			append_dev(div4, div3);
			mount_component(settings, div3, null);
			insert_dev(target, t4, anchor);
			if (if_block3) if_block3.m(target, anchor);
			insert_dev(target, if_block3_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*$error*/ ctx[1]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_3(ctx);
					if_block0.c();
					if_block0.m(t0.parentNode, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (dirty & /*$isRevealed, $participants*/ 12) {
				each_value_1 = ensure_array_like_dev(/*$participants*/ ctx[2]);
				group_outros();
				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div0, outro_and_destroy_block, create_each_block_1, t1, get_each_context_1);
				check_outros();
			}

			if (/*$isRevealed*/ ctx[3]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty & /*$isRevealed*/ 8) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block_2(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(div0, null);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}

			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block2 = if_blocks[current_block_type_index];

				if (!if_block2) {
					if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block2.c();
				} else {
					if_block2.p(ctx, dirty);
				}

				transition_in(if_block2, 1);
				if_block2.m(div1, null);
			}

			if (/*debugOn*/ ctx[0]) {
				if (if_block3) {
					if (dirty & /*debugOn*/ 1) {
						transition_in(if_block3, 1);
					}
				} else {
					if_block3 = create_if_block$1(ctx);
					if_block3.c();
					transition_in(if_block3, 1);
					if_block3.m(if_block3_anchor.parentNode, if_block3_anchor);
				}
			} else if (if_block3) {
				group_outros();

				transition_out(if_block3, 1, 1, () => {
					if_block3 = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value_1.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			transition_in(if_block1);
			transition_in(if_block2);
			transition_in(settings.$$.fragment, local);
			transition_in(if_block3);
			current = true;
		},
		o: function outro(local) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			transition_out(if_block1);
			transition_out(if_block2);
			transition_out(settings.$$.fragment, local);
			transition_out(if_block3);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(t0);
				detach_dev(div0);
				detach_dev(t2);
				detach_dev(div4);
				detach_dev(t4);
				detach_dev(if_block3_anchor);
			}

			if (if_block0) if_block0.d(detaching);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			if (if_block1) if_block1.d();
			if_blocks[current_block_type_index].d();
			destroy_component(settings);
			if (if_block3) if_block3.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$1($$self, $$props, $$invalidate) {
	let $error;
	let $participants;
	let $isRevealed;
	let $votes;
	let $user;
	let $choices;
	validate_store(error, 'error');
	component_subscribe($$self, error, $$value => $$invalidate(1, $error = $$value));
	validate_store(participants, 'participants');
	component_subscribe($$self, participants, $$value => $$invalidate(2, $participants = $$value));
	validate_store(isRevealed, 'isRevealed');
	component_subscribe($$self, isRevealed, $$value => $$invalidate(3, $isRevealed = $$value));
	validate_store(votes, 'votes');
	component_subscribe($$self, votes, $$value => $$invalidate(4, $votes = $$value));
	validate_store(user, 'user');
	component_subscribe($$self, user, $$value => $$invalidate(5, $user = $$value));
	validate_store(choices, 'choices');
	component_subscribe($$self, choices, $$value => $$invalidate(6, $choices = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Voting', slots, []);
	let debugOn = false;

	onMount(() => {
		connect(jsonScriptContents('websocket_url'));
		$$invalidate(0, debugOn = new URLSearchParams(window.location.search).get('debug'));
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Voting> was created with unknown prop '${key}'`);
	});

	const click_handler = () => update('settings', { is_spectator: false });

	$$self.$capture_state = () => ({
		onMount,
		Card,
		Participant,
		Settings,
		Debug,
		choices,
		connect,
		error,
		isRevealed,
		participants,
		update,
		user,
		castVote,
		votes,
		jsonScriptContents,
		Summary,
		debugOn,
		$error,
		$participants,
		$isRevealed,
		$votes,
		$user,
		$choices
	});

	$$self.$inject_state = $$props => {
		if ('debugOn' in $$props) $$invalidate(0, debugOn = $$props.debugOn);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		debugOn,
		$error,
		$participants,
		$isRevealed,
		$votes,
		$user,
		$choices,
		click_handler
	];
}

class Voting extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$1, create_fragment$1, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Voting",
			options,
			id: create_fragment$1.name
		});
	}
}

/* js/App.svelte generated by Svelte v4.2.1 */

// (11:0) {:else}
function create_else_block(ctx) {
	let join;
	let current;
	join = new Join({ $$inline: true });

	const block = {
		c: function create() {
			create_component(join.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(join, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(join.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(join.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(join, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(11:0) {:else}",
		ctx
	});

	return block;
}

// (9:0) {#if url}
function create_if_block(ctx) {
	let voting;
	let current;
	voting = new Voting({ $$inline: true });

	const block = {
		c: function create() {
			create_component(voting.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(voting, target, anchor);
			current = true;
		},
		i: function intro(local) {
			if (current) return;
			transition_in(voting.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(voting.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(voting, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(9:0) {#if url}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*url*/ ctx[0]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(if_block_anchor);
			}

			if_blocks[current_block_type_index].d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('App', slots, []);
	const url = jsonScriptContents('websocket_url');
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ Join, jsonScriptContents, Voting, url });
	return [url];
}

class App extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "App",
			options,
			id: create_fragment.name
		});
	}
}

const app = new App({
    target: document.querySelector('#poker'),
});

return app;

})();
//# sourceMappingURL=index.js.map
