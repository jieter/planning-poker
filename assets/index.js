
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

/** @returns {{}} */
function exclude_internal_props(props) {
	const result = {};
	for (const k in props) if (k[0] !== '$') result[k] = props[k];
	return result;
}

/** @returns {{}} */
function compute_rest_props(props, keys) {
	const rest = {};
	keys = new Set(keys);
	for (const k in props) if (!keys.has(k) && k[0] !== '$') rest[k] = props[k];
	return rest;
}

function action_destroyer(action_result) {
	return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}

/** @type {typeof globalThis} */
const globals =
	typeof window !== 'undefined'
		? window
		: typeof globalThis !== 'undefined'
		? globalThis
		: // @ts-ignore Node typings have this
		  global;

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
 * @param {string} style_sheet_id
 * @param {string} styles
 * @returns {void}
 */
function append_styles(target, style_sheet_id, styles) {
	const append_styles_to = get_root_for_style(target);
	if (!append_styles_to.getElementById(style_sheet_id)) {
		const style = element('style');
		style.id = style_sheet_id;
		style.textContent = styles;
		append_stylesheet(append_styles_to, style);
	}
}

/**
 * @param {Node} node
 * @returns {ShadowRoot | Document}
 */
function get_root_for_style(node) {
	if (!node) return document;
	const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
	if (root && /** @type {ShadowRoot} */ (root).host) {
		return /** @type {ShadowRoot} */ (root);
	}
	return node.ownerDocument;
}

/**
 * @param {ShadowRoot | Document} node
 * @param {HTMLStyleElement} style
 * @returns {CSSStyleSheet}
 */
function append_stylesheet(node, style) {
	append(/** @type {Document} */ (node).head || node, style);
	return style.sheet;
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
 * List of attributes that should always be set through the attr method,
 * because updating them through the property setter doesn't work reliably.
 * In the example of `width`/`height`, the problem is that the setter only
 * accepts numeric values, but the attribute can also be set to a string like `50%`.
 * If this list becomes too big, rethink this approach.
 */
const always_set_through_set_attribute = ['width', 'height'];

/**
 * @param {Element & ElementCSSInlineStyle} node
 * @param {{ [x: string]: string }} attributes
 * @returns {void}
 */
function set_attributes(node, attributes) {
	// @ts-ignore
	const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
	for (const key in attributes) {
		if (attributes[key] == null) {
			node.removeAttribute(key);
		} else if (key === 'style') {
			node.style.cssText = attributes[key];
		} else if (key === '__value') {
			/** @type {any} */ (node).value = node[key] = attributes[key];
		} else if (
			descriptors[key] &&
			descriptors[key].set &&
			always_set_through_set_attribute.indexOf(key) === -1
		) {
			node[key] = attributes[key];
		} else {
			attr(node, key, attributes[key]);
		}
	}
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

/** @returns {{}} */
function get_spread_update(levels, updates) {
	const update = {};
	const to_null_out = {};
	const accounted_for = { $$scope: 1 };
	let i = levels.length;
	while (i--) {
		const o = levels[i];
		const n = updates[i];
		if (n) {
			for (const key in o) {
				if (!(key in n)) to_null_out[key] = 1;
			}
			for (const key in n) {
				if (!accounted_for[key]) {
					update[key] = n[key];
					accounted_for[key] = 1;
				}
			}
			levels[i] = n;
		} else {
			for (const key in o) {
				accounted_for[key] = 1;
			}
		}
	}
	for (const key in to_null_out) {
		if (!(key in update)) update[key] = undefined;
	}
	return update;
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
const VERSION = '4.2.3';
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

/* js/Card.svelte generated by Svelte v4.2.3 */
const file$8 = "js/Card.svelte";

function add_css$6(target) {
	append_styles(target, "svelte-1asytna", ".deck-card.svelte-1asytna{display:flex;justify-content:center;align-content:center;color:#444;margin:2px 2px;flex-direction:column;border:1px solid rgba(0, 0, 0, 0.2);border-radius:0.4vw;transition:background-color 100ms ease-out 200ms;filter:drop-shadow(0 0 0.5rem rgba(100, 100, 100, 0.3));transform:rotate(2deg);transition:transform 200ms ease-in-out 100ms}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FyZC5zdmVsdGUiLCJzb3VyY2VzIjpbIkNhcmQuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG5leHBvcnQgbGV0IGNvbG9yID0gbnVsbDtcbmV4cG9ydCBsZXQgc2l6ZSA9ICdyZWd1bGFyJztcbmV4cG9ydCBsZXQgcm90YXRpb24gPSAwO1xuXG4kOiBoZWlnaHQgPSBzaXplID09ICdzbScgPyAnNC41dncnIDogJzd2dyc7XG4kOiB3aWR0aCA9IHNpemUgPT0gJ3NtJyA/ICcyLjZ2dycgOiAnNHZ3JztcbiQ6IGZvbnRTaXplID0gc2l6ZSA9PSAnc20nID8gJzEuNHZ3JyA6ICcxLjg1dncnO1xuPC9zY3JpcHQ+XG5cbjxkaXZcbiAgICBjbGFzcz1cImRlY2stY2FyZFwiXG4gICAgc3R5bGU9XCJ0cmFuc2Zvcm06IHJvdGF0ZSh7cm90YXRpb259ZGVnKTsgYmFja2dyb3VuZDoge2NvbG9yIHx8XG4gICAgICAgICcjRkZGJ307IGhlaWdodDoge2hlaWdodH07IHdpZHRoOiB7d2lkdGh9OyBmb250LXNpemU6IHtmb250U2l6ZX1cIj5cbiAgICA8c2xvdCAvPlxuPC9kaXY+XG5cbjxzdHlsZT5cbi5kZWNrLWNhcmQge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgYWxpZ24tY29udGVudDogY2VudGVyO1xuICAgIGNvbG9yOiAjNDQ0O1xuICAgIG1hcmdpbjogMnB4IDJweDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC4yKTtcbiAgICBib3JkZXItcmFkaXVzOiAwLjR2dztcbiAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDEwMG1zIGVhc2Utb3V0IDIwMG1zO1xuICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMCAwIDAuNXJlbSByZ2JhKDEwMCwgMTAwLCAxMDAsIDAuMykpO1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDJkZWcpO1xuICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAyMDBtcyBlYXNlLWluLW91dCAxMDBtcztcbn1cbjwvc3R5bGU+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBa0JBLHlCQUFXLENBQ1AsT0FBTyxDQUFFLElBQUksQ0FDYixlQUFlLENBQUUsTUFBTSxDQUN2QixhQUFhLENBQUUsTUFBTSxDQUNyQixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxHQUFHLENBQUMsR0FBRyxDQUNmLGNBQWMsQ0FBRSxNQUFNLENBQ3RCLE1BQU0sQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQ3BDLGFBQWEsQ0FBRSxLQUFLLENBQ3BCLFVBQVUsQ0FBRSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FDakQsTUFBTSxDQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUN4RCxTQUFTLENBQUUsT0FBTyxJQUFJLENBQUMsQ0FDdkIsVUFBVSxDQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQzVDIn0= */");
}

function create_fragment$9(ctx) {
	let div;
	let current;
	const default_slot_template = /*#slots*/ ctx[7].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

	const block = {
		c: function create() {
			div = element("div");
			if (default_slot) default_slot.c();
			attr_dev(div, "class", "deck-card svelte-1asytna");
			set_style(div, "transform", "rotate(" + /*rotation*/ ctx[1] + "deg)");
			set_style(div, "background", /*color*/ ctx[0] || '#FFF');
			set_style(div, "height", /*height*/ ctx[4]);
			set_style(div, "width", /*width*/ ctx[3]);
			set_style(div, "font-size", /*fontSize*/ ctx[2]);
			add_location(div, file$8, 10, 0, 236);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[6],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
						null
					);
				}
			}

			if (!current || dirty & /*rotation*/ 2) {
				set_style(div, "transform", "rotate(" + /*rotation*/ ctx[1] + "deg)");
			}

			if (!current || dirty & /*color*/ 1) {
				set_style(div, "background", /*color*/ ctx[0] || '#FFF');
			}

			if (!current || dirty & /*height*/ 16) {
				set_style(div, "height", /*height*/ ctx[4]);
			}

			if (!current || dirty & /*width*/ 8) {
				set_style(div, "width", /*width*/ ctx[3]);
			}

			if (!current || dirty & /*fontSize*/ 4) {
				set_style(div, "font-size", /*fontSize*/ ctx[2]);
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
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$9.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$9($$self, $$props, $$invalidate) {
	let height;
	let width;
	let fontSize;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Card', slots, ['default']);
	let { color = null } = $$props;
	let { size = 'regular' } = $$props;
	let { rotation = 0 } = $$props;
	const writable_props = ['color', 'size', 'rotation'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('color' in $$props) $$invalidate(0, color = $$props.color);
		if ('size' in $$props) $$invalidate(5, size = $$props.size);
		if ('rotation' in $$props) $$invalidate(1, rotation = $$props.rotation);
		if ('$$scope' in $$props) $$invalidate(6, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		color,
		size,
		rotation,
		fontSize,
		width,
		height
	});

	$$self.$inject_state = $$props => {
		if ('color' in $$props) $$invalidate(0, color = $$props.color);
		if ('size' in $$props) $$invalidate(5, size = $$props.size);
		if ('rotation' in $$props) $$invalidate(1, rotation = $$props.rotation);
		if ('fontSize' in $$props) $$invalidate(2, fontSize = $$props.fontSize);
		if ('width' in $$props) $$invalidate(3, width = $$props.width);
		if ('height' in $$props) $$invalidate(4, height = $$props.height);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*size*/ 32) {
			$$invalidate(4, height = size == 'sm' ? '4.5vw' : '7vw');
		}

		if ($$self.$$.dirty & /*size*/ 32) {
			$$invalidate(3, width = size == 'sm' ? '2.6vw' : '4vw');
		}

		if ($$self.$$.dirty & /*size*/ 32) {
			$$invalidate(2, fontSize = size == 'sm' ? '1.4vw' : '1.85vw');
		}
	};

	return [color, rotation, fontSize, width, height, size, $$scope, slots];
}

class Card extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$9, create_fragment$9, safe_not_equal, { color: 0, size: 5, rotation: 1 }, add_css$6);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Card",
			options,
			id: create_fragment$9.name
		});
	}

	get color() {
		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get size() {
		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get rotation() {
		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set rotation(value) {
		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

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

// https://formito.com/tools/favicon
function faviconHref(emoji) {
    return `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22256%22 height=%22256%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22central%22 text-anchor=%22middle%22 font-size=%2280%22>${emoji}</text></svg>`;
}

function changeFavicon(emoji) {
    const document = window.document;
    const link = document.querySelector('link[rel*="icon"]') || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'shortcut icon';
    link.href = faviconHref(emoji);

    document.getElementsByTagName('head')[0].appendChild(link);
}

function formatNumber(num) {
    const absNum = Math.abs(num);
    if (absNum > 999) {
        return Math.sign(num) * (absNum / 1000).toFixed(1) + 'k';
    } else {
        return Math.sign(num) * absNum;
    }
}

/* Function returning function which returns a pseudo-random number between min and max with a seed.
 */
function pseudoRandomGenerator(seed, min, max) {
    return function random() {
        const x = Math.sin(seed++) * 10000;
        const n = x - Math.floor(x);

        return n * (max - min) + min;
    };
}

/* js/Join.svelte generated by Svelte v4.2.3 */

const { console: console_1 } = globals;
const file$7 = "js/Join.svelte";

function get_each_context$5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i];
	return child_ctx;
}

function get_each_context_1$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[10] = list[i][0];
	child_ctx[11] = list[i][1];
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[14] = list[i][0];
	child_ctx[15] = list[i][1];
	return child_ctx;
}

// (54:24) {#if error}
function create_if_block_1$4(ctx) {
	let div;
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text(/*error*/ ctx[2]);
			attr_dev(div, "class", "invalid-feedback");
			add_location(div, file$7, 54, 28, 1603);
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
		id: create_if_block_1$4.name,
		type: "if",
		source: "(54:24) {#if error}",
		ctx
	});

	return block;
}

// (77:12) {#if statistics}
function create_if_block$7(ctx) {
	let div1;
	let t0;
	let div0;
	let t2;
	let div3;
	let div2;
	let current;
	let each_value_2 = ensure_array_like_dev(/*statistics*/ ctx[3]['basic']);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	let each_value = ensure_array_like_dev(/*statistics*/ ctx[3].decks);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			div1 = element("div");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t0 = space();
			div0 = element("div");
			div0.textContent = "Starting at 2023-10-01, ignoring single-vote rounds.";
			t2 = space();
			div3 = element("div");
			div2 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div0, "class", "light p-1");
			set_style(div0, "font-size", "10px");
			add_location(div0, file$7, 84, 20, 2800);
			attr_dev(div1, "class", "col-md-3");
			add_location(div1, file$7, 77, 16, 2417);
			attr_dev(div2, "class", "m-1");
			add_location(div2, file$7, 89, 20, 3034);
			attr_dev(div3, "class", "col-md-6");
			add_location(div3, file$7, 88, 16, 2991);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				if (each_blocks_1[i]) {
					each_blocks_1[i].m(div1, null);
				}
			}

			append_dev(div1, t0);
			append_dev(div1, div0);
			insert_dev(target, t2, anchor);
			insert_dev(target, div3, anchor);
			append_dev(div3, div2);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div2, null);
				}
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*statistics*/ 8) {
				each_value_2 = ensure_array_like_dev(/*statistics*/ ctx[3]['basic']);
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_2(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(div1, t0);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_2.length;
			}

			if (dirty & /*statistics*/ 8) {
				each_value = ensure_array_like_dev(/*statistics*/ ctx[3].decks);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$5(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$5(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div2, null);
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
				detach_dev(div1);
				detach_dev(t2);
				detach_dev(div3);
			}

			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$7.name,
		type: "if",
		source: "(77:12) {#if statistics}",
		ctx
	});

	return block;
}

// (79:20) {#each statistics['basic'] as [label, value]}
function create_each_block_2(ctx) {
	let div;
	let t0_value = /*label*/ ctx[14] + "";
	let t0;
	let t1;
	let span;
	let t2_value = /*value*/ ctx[15] + "";
	let t2;

	const block = {
		c: function create() {
			div = element("div");
			t0 = text(t0_value);
			t1 = space();
			span = element("span");
			t2 = text(t2_value);
			attr_dev(span, "class", "badge bg-primary rounded-pill");
			add_location(span, file$7, 81, 28, 2662);
			attr_dev(div, "class", "d-flex justify-content-between align-items-center p-1");
			add_location(div, file$7, 79, 24, 2530);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t0);
			append_dev(div, t1);
			append_dev(div, span);
			append_dev(span, t2);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*statistics*/ 8 && t0_value !== (t0_value = /*label*/ ctx[14] + "")) set_data_dev(t0, t0_value);
			if (dirty & /*statistics*/ 8 && t2_value !== (t2_value = /*value*/ ctx[15] + "")) set_data_dev(t2, t2_value);
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_2.name,
		type: "each",
		source: "(79:20) {#each statistics['basic'] as [label, value]}",
		ctx
	});

	return block;
}

// (95:40) <Card size="sm">
function create_default_slot$3(ctx) {
	let t_value = /*card*/ ctx[10] + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*statistics*/ 8 && t_value !== (t_value = /*card*/ ctx[10] + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(t);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$3.name,
		type: "slot",
		source: "(95:40) <Card size=\\\"sm\\\">",
		ctx
	});

	return block;
}

// (93:32) {#each deck as [card, count]}
function create_each_block_1$1(ctx) {
	let div1;
	let card_1;
	let t0;
	let div0;
	let t1_value = formatNumber(/*count*/ ctx[11]) + "";
	let t1;
	let current;

	card_1 = new Card({
			props: {
				size: "sm",
				$$slots: { default: [create_default_slot$3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div1 = element("div");
			create_component(card_1.$$.fragment);
			t0 = space();
			div0 = element("div");
			t1 = text(t1_value);
			attr_dev(div0, "class", "text-muted");
			add_location(div0, file$7, 95, 40, 3423);
			attr_dev(div1, "class", "d-inline-block text-center");
			add_location(div1, file$7, 93, 36, 3272);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			mount_component(card_1, div1, null);
			append_dev(div1, t0);
			append_dev(div1, div0);
			append_dev(div0, t1);
			current = true;
		},
		p: function update(ctx, dirty) {
			const card_1_changes = {};

			if (dirty & /*$$scope, statistics*/ 262152) {
				card_1_changes.$$scope = { dirty, ctx };
			}

			card_1.$set(card_1_changes);
			if ((!current || dirty & /*statistics*/ 8) && t1_value !== (t1_value = formatNumber(/*count*/ ctx[11]) + "")) set_data_dev(t1, t1_value);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(card_1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(card_1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div1);
			}

			destroy_component(card_1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$1.name,
		type: "each",
		source: "(93:32) {#each deck as [card, count]}",
		ctx
	});

	return block;
}

// (91:24) {#each statistics.decks as deck}
function create_each_block$5(ctx) {
	let div;
	let t;
	let current;
	let each_value_1 = ensure_array_like_dev(/*deck*/ ctx[7]);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
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

			t = space();
			attr_dev(div, "class", "d-flex overflow-scroll");
			add_location(div, file$7, 91, 28, 3137);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div, null);
				}
			}

			append_dev(div, t);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*statistics*/ 8) {
				each_value_1 = ensure_array_like_dev(/*deck*/ ctx[7]);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block_1$1(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div, t);
					}
				}

				group_outros();

				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value_1.length; i += 1) {
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
		id: create_each_block$5.name,
		type: "each",
		source: "(91:24) {#each statistics.decks as deck}",
		ctx
	});

	return block;
}

function create_fragment$8(ctx) {
	let div6;
	let div5;
	let div4;
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
	let label_1;
	let input3;
	let t6;
	let t7;
	let span;
	let t9;
	let div10;
	let div9;
	let hr;
	let t10;
	let div8;
	let t11;
	let div7;
	let t12;
	let a;
	let current;
	let mounted;
	let dispose;
	let if_block0 = /*error*/ ctx[2] && create_if_block_1$4(ctx);
	let if_block1 = /*statistics*/ ctx[3] && create_if_block$7(ctx);

	const block = {
		c: function create() {
			div6 = element("div");
			div5 = element("div");
			div4 = element("div");
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
			if (if_block0) if_block0.c();
			t4 = space();
			div1 = element("div");
			input2 = element("input");
			t5 = space();
			div3 = element("div");
			label_1 = element("label");
			input3 = element("input");
			t6 = text(" Join as a spectator 👁️");
			t7 = space();
			span = element("span");
			span.textContent = "You can always enable voting later";
			t9 = space();
			div10 = element("div");
			div9 = element("div");
			hr = element("hr");
			t10 = space();
			div8 = element("div");
			if (if_block1) if_block1.c();
			t11 = space();
			div7 = element("div");
			t12 = text("GitHub: ");
			a = element("a");
			a.textContent = "jieter/planning-poker";
			attr_dev(h1, "class", "mt-4");
			add_location(h1, file$7, 41, 12, 980);
			attr_dev(input0, "type", "hidden");
			attr_dev(input0, "name", "csrfmiddlewaretoken");
			input0.value = csrfToken();
			add_location(input0, file$7, 44, 20, 1121);
			attr_dev(input1, "type", "text");
			attr_dev(input1, "name", "name");
			attr_dev(input1, "class", "form-control");
			toggle_class(input1, "is-invalid", /*error*/ ctx[2]);
			add_location(input1, file$7, 46, 24, 1254);
			attr_dev(div0, "class", "col");
			add_location(div0, file$7, 45, 20, 1212);
			attr_dev(input2, "type", "submit");
			attr_dev(input2, "class", "btn btn-primary");
			input2.value = "Join";
			add_location(input2, file$7, 58, 24, 1766);
			attr_dev(div1, "class", "col");
			add_location(div1, file$7, 57, 20, 1724);
			attr_dev(div2, "class", "row row-cols-lg-auto");
			add_location(div2, file$7, 43, 16, 1066);
			attr_dev(input3, "type", "checkbox");
			attr_dev(input3, "name", "is_spectator");
			add_location(input3, file$7, 63, 24, 1975);
			attr_dev(label_1, "class", "col");
			add_location(label_1, file$7, 62, 20, 1931);
			attr_dev(span, "class", "text-muted");
			add_location(span, file$7, 65, 20, 2121);
			attr_dev(div3, "class", "row");
			add_location(div3, file$7, 61, 16, 1893);
			attr_dev(form, "method", "post");
			add_location(form, file$7, 42, 12, 1029);
			attr_dev(div4, "class", "col");
			add_location(div4, file$7, 40, 8, 950);
			attr_dev(div5, "class", "row");
			add_location(div5, file$7, 39, 4, 924);
			attr_dev(div6, "class", "container");
			add_location(div6, file$7, 38, 0, 896);
			add_location(hr, file$7, 74, 8, 2339);
			attr_dev(a, "href", "https://github.com/jieter/planning-poker");
			add_location(a, file$7, 104, 24, 3752);
			attr_dev(div7, "class", "col-md-2");
			add_location(div7, file$7, 103, 12, 3705);
			attr_dev(div8, "class", "row");
			add_location(div8, file$7, 75, 8, 2354);
			attr_dev(div9, "class", "container small");
			add_location(div9, file$7, 73, 4, 2301);
			attr_dev(div10, "class", "fixed-bottom mb-3");
			add_location(div10, file$7, 72, 0, 2265);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div6, anchor);
			append_dev(div6, div5);
			append_dev(div5, div4);
			append_dev(div4, h1);
			append_dev(div4, t1);
			append_dev(div4, form);
			append_dev(form, div2);
			append_dev(div2, input0);
			append_dev(div2, t2);
			append_dev(div2, div0);
			append_dev(div0, input1);
			set_input_value(input1, /*name*/ ctx[0]);
			append_dev(div0, t3);
			if (if_block0) if_block0.m(div0, null);
			append_dev(div2, t4);
			append_dev(div2, div1);
			append_dev(div1, input2);
			append_dev(form, t5);
			append_dev(form, div3);
			append_dev(div3, label_1);
			append_dev(label_1, input3);
			input3.checked = /*isSpectator*/ ctx[1];
			append_dev(label_1, t6);
			append_dev(div3, t7);
			append_dev(div3, span);
			insert_dev(target, t9, anchor);
			insert_dev(target, div10, anchor);
			append_dev(div10, div9);
			append_dev(div9, hr);
			append_dev(div9, t10);
			append_dev(div9, div8);
			if (if_block1) if_block1.m(div8, null);
			append_dev(div8, t11);
			append_dev(div8, div7);
			append_dev(div7, t12);
			append_dev(div7, a);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(input1, "change", /*update*/ ctx[4], false, false, false, false),
					listen_dev(input1, "input", /*input1_input_handler*/ ctx[5]),
					listen_dev(input3, "change", /*input3_change_handler*/ ctx[6])
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*name*/ 1 && input1.value !== /*name*/ ctx[0]) {
				set_input_value(input1, /*name*/ ctx[0]);
			}

			if (!current || dirty & /*error*/ 4) {
				toggle_class(input1, "is-invalid", /*error*/ ctx[2]);
			}

			if (/*error*/ ctx[2]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_1$4(ctx);
					if_block0.c();
					if_block0.m(div0, null);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (dirty & /*isSpectator*/ 2) {
				input3.checked = /*isSpectator*/ ctx[1];
			}

			if (/*statistics*/ ctx[3]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty & /*statistics*/ 8) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block$7(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(div8, t11);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block1);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block1);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div6);
				detach_dev(t9);
				detach_dev(div10);
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$8.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$8($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Join', slots, []);
	let error;

	// Screen name in the poker session
	let name = '';

	let isSpectator = null;
	let statistics;

	onMount(() => {
		const previousName = localStorage.getItem('name');

		if (previousName) {
			$$invalidate(0, name = previousName);
		}

		const previousIsSpectator = localStorage.getItem('isSpectator');

		if (previousIsSpectator !== null) {
			$$invalidate(1, isSpectator = previousIsSpectator === 'true');
		}

		$$invalidate(3, statistics = jsonScriptContents('statistics'));
		console.log(statistics);
	});

	const update = () => {
		$$invalidate(2, error = name ? undefined : 'Name cannot be empty');
	};

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Join> was created with unknown prop '${key}'`);
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
		Card,
		csrfToken,
		formatNumber,
		jsonScriptContents,
		error,
		name,
		isSpectator,
		statistics,
		update
	});

	$$self.$inject_state = $$props => {
		if ('error' in $$props) $$invalidate(2, error = $$props.error);
		if ('name' in $$props) $$invalidate(0, name = $$props.name);
		if ('isSpectator' in $$props) $$invalidate(1, isSpectator = $$props.isSpectator);
		if ('statistics' in $$props) $$invalidate(3, statistics = $$props.statistics);
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

	return [
		name,
		isSpectator,
		error,
		statistics,
		update,
		input1_input_handler,
		input3_change_handler
	];
}

class Join extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$8, create_fragment$8, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Join",
			options,
			id: create_fragment$8.name
		});
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
const revealCount = writable(0);

// Count votes in a list of votes, returning a list of (card, votes)-pairs in descending order.
// [1, 1, 2, 3, 3, 3, 3] => [[3, 3], [1, 2], [2, 1]]
function countVotes(votes) {
    const _votes = new Proxy({}, { get: (d, key) => (key in d ? d[key] : 0) });
    votes.forEach((vote) => {
        if (vote != null) {
            _votes[vote] += 1;
        }
    });
    return Object.entries(_votes).sort((a, b) => b[1] - a[1]);
}

// Derive a sorted list of (card, votes)-pairs off of the participants store:
const votes = derived(participants, ($participants) => {
    return countVotes($participants.map((p) => p.vote));
});

// Show confetti if votes are revealed and all participants voted the same and there are more than 1 participants.
const showConfetti = derived([isRevealed, votes], ([$isRevealed, $votes]) => {
    return $isRevealed && $votes.length == 1 && $votes[0] && $votes[0][1] > 1;
});

// Voting is considered complete if all active non-spectators voted:
const votingComplete = derived(participants, ($participants) => {
    return $participants.every((p) => p.is_spectator || p.vote);
});

const icon = derived(
    [participants, user, showConfetti, isRevealed],
    ([$participants, $user, $showConfetti, $isRevealed]) => {
        if ($showConfetti) {
            return '🎉';
        } else if ($isRevealed) {
            return '🃏';
        }

        const voters = $participants.filter((p) => !p.is_spectator);
        const totalVotes = voters.filter((p) => p.vote);
        const almostComplete = voters.length - totalVotes.length == 1;
        // Your vote is the last vote missing; others are waiting for you!
        if (voters.length > 1 && !$user.vote && almostComplete) {
            return '🚨';
        }
        return '🕶️';
    },
);

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
                revealCount.set(data.reveal_count);

                break;
            case 'vote':
                participants.update(($participants) => {
                    $participants.forEach((p) => {
                        if (p.id == data.user_id) {
                            p.vote = data.value;
                        }
                    });

                    return [...$participants];
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

/* js/Debug.svelte generated by Svelte v4.2.3 */

const file$6 = "js/Debug.svelte";

function get_each_context$4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[14] = list[i];
	return child_ctx;
}

// (34:8) {#if !isProduction}
function create_if_block$6(ctx) {
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
			attr_dev(button0, "class", "btn btn-xs btn-warning");
			add_location(button0, file$6, 34, 12, 791);
			attr_dev(button1, "class", "btn btn-xs btn-warning");
			add_location(button1, file$6, 35, 12, 903);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button0, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, button1, anchor);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*click_handler*/ ctx[12], false, false, false, false),
					listen_dev(button1, "click", /*click_handler_1*/ ctx[13], false, false, false, false)
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
		id: create_if_block$6.name,
		type: "if",
		source: "(34:8) {#if !isProduction}",
		ctx
	});

	return block;
}

// (40:8) {#each $log as item}
function create_each_block$4(ctx) {
	let div;
	let span;
	let t0_value = /*item*/ ctx[14].time + "";
	let t0;
	let t1;
	let t2_value = /*item*/ ctx[14].event + "";
	let t2;
	let t3;
	let t4_value = JSON.stringify(/*item*/ ctx[14].data) + "";
	let t4;
	let t5;

	const block = {
		c: function create() {
			div = element("div");
			span = element("span");
			t0 = text(t0_value);
			t1 = space();
			t2 = text(t2_value);
			t3 = space();
			t4 = text(t4_value);
			t5 = space();
			add_location(span, file$6, 41, 16, 1114);
			add_location(div, file$6, 40, 12, 1092);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, span);
			append_dev(span, t0);
			append_dev(div, t1);
			append_dev(div, t2);
			append_dev(div, t3);
			append_dev(div, t4);
			append_dev(div, t5);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$log*/ 16 && t0_value !== (t0_value = /*item*/ ctx[14].time + "")) set_data_dev(t0, t0_value);
			if (dirty & /*$log*/ 16 && t2_value !== (t2_value = /*item*/ ctx[14].event + "")) set_data_dev(t2, t2_value);
			if (dirty & /*$log*/ 16 && t4_value !== (t4_value = JSON.stringify(/*item*/ ctx[14].data) + "")) set_data_dev(t4, t4_value);
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$4.name,
		type: "each",
		source: "(40:8) {#each $log as item}",
		ctx
	});

	return block;
}

function create_fragment$7(ctx) {
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
	let if_block = !/*isProduction*/ ctx[5] && create_if_block$6(ctx);
	let each_value = ensure_array_like_dev(/*$log*/ ctx[4]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
	}

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

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			add_location(code0, file$6, 29, 18, 501);
			add_location(div0, file$6, 29, 8, 491);
			add_location(code1, file$6, 30, 20, 567);
			add_location(div1, file$6, 30, 8, 555);
			add_location(code2, file$6, 31, 19, 630);
			add_location(div2, file$6, 31, 8, 619);
			add_location(code3, file$6, 32, 27, 700);
			add_location(div3, file$6, 32, 8, 681);
			attr_dev(div4, "class", "col");
			add_location(div4, file$6, 28, 4, 465);
			attr_dev(div5, "class", "col");
			add_location(div5, file$6, 38, 4, 1033);
			attr_dev(div6, "class", "row bg-light rounded p-2 small mb-5");
			add_location(div6, file$6, 27, 0, 411);
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

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div5, null);
				}
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*settings*/ 1 && t1_value !== (t1_value = JSON.stringify(/*settings*/ ctx[0]) + "")) set_data_dev(t1, t1_value);
			if (dirty & /*$votes*/ 2 && t4_value !== (t4_value = JSON.stringify(/*$votes*/ ctx[1]) + "")) set_data_dev(t4, t4_value);
			if (dirty & /*$user*/ 4 && t7_value !== (t7_value = JSON.stringify(/*$user*/ ctx[2]) + "")) set_data_dev(t7, t7_value);
			if (dirty & /*$participants*/ 8 && t10_value !== (t10_value = JSON.stringify(/*$participants*/ ctx[3]) + "")) set_data_dev(t10, t10_value);

			if (dirty & /*JSON, $log*/ 16) {
				each_value = ensure_array_like_dev(/*$log*/ ctx[4]);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$4(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$4(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div5, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div6);
			}

			if (if_block) if_block.d();
			destroy_each(each_blocks, detaching);
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
	let $log;
	validate_store(autoReveal, 'autoReveal');
	component_subscribe($$self, autoReveal, $$value => $$invalidate(6, $autoReveal = $$value));
	validate_store(isRevealed, 'isRevealed');
	component_subscribe($$self, isRevealed, $$value => $$invalidate(7, $isRevealed = $$value));
	validate_store(choices, 'choices');
	component_subscribe($$self, choices, $$value => $$invalidate(8, $choices = $$value));
	validate_store(decks, 'decks');
	component_subscribe($$self, decks, $$value => $$invalidate(9, $decks = $$value));
	validate_store(deck, 'deck');
	component_subscribe($$self, deck, $$value => $$invalidate(10, $deck = $$value));
	validate_store(error, 'error');
	component_subscribe($$self, error, $$value => $$invalidate(11, $error = $$value));
	validate_store(votes, 'votes');
	component_subscribe($$self, votes, $$value => $$invalidate(1, $votes = $$value));
	validate_store(user, 'user');
	component_subscribe($$self, user, $$value => $$invalidate(2, $user = $$value));
	validate_store(participants, 'participants');
	component_subscribe($$self, participants, $$value => $$invalidate(3, $participants = $$value));
	validate_store(log, 'log');
	component_subscribe($$self, log, $$value => $$invalidate(4, $log = $$value));
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
		$participants,
		$log
	});

	$$self.$inject_state = $$props => {
		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$error, $deck, $decks, $choices, $isRevealed, $autoReveal*/ 4032) {
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
		$log,
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
		init$1(this, options, instance$7, create_fragment$7, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Debug",
			options,
			id: create_fragment$7.name
		});
	}
}

const t=(t,b={})=>{w(b);let{colors:k=["#FFC700","#FF0000","#2E3191","#41BBC7"],duration:W=3500,force:S=.5,particleCount:G=150,particleShape:X="mix",particleSize:_=12,destroyAfterDone:C=!0,stageHeight:z=800,stageWidth:E=1600}=b;!function(t){const e=f("style");e.dataset.neoconfetti="",e.textContent='@keyframes fk9XWG_y-axis{to{transform:translate3d(0,var(--stage-height),0)}}@keyframes fk9XWG_x-axis{to{transform:translate3d(var(--x-landing-point),0,0)}}@keyframes fk9XWG_rotation{50%{transform:rotate3d(var(--half-rotation),180deg)}to{transform:rotate3d(var(--rotation),360deg)}}.fk9XWG_container{width:0;height:0;z-index:1200;position:relative;overflow:visible}.fk9XWG_particle{animation:x-axis var(--duration-chaos)forwards cubic-bezier(var(--x1),var(--x2),var(--x3),var(--x4));animation-name:fk9XWG_x-axis}.fk9XWG_particle>div{animation:y-axis var(--duration-chaos)forwards cubic-bezier(var(--y1),var(--y2),var(--y3),var(--y4));width:var(--width);height:var(--height);animation-name:fk9XWG_y-axis;position:absolute;top:0;left:0}.fk9XWG_particle>div:before{height:100%;width:100%;content:"";background-color:var(--bgcolor);animation:rotation var(--rotation-duration)infinite linear;border-radius:var(--border-radius);animation-name:fk9XWG_rotation;display:block}',h(document.head,e);}(),t.classList.add("fk9XWG_container"),t.style.setProperty("--stage-height",z+"px");let P,A=p(G,k),H=e(t,A);function M(t,e){const f=l(c()*(x-1)),h="rectangles"!==X&&("circles"===X||v(f)),p=(e,r)=>t.style.setProperty(e,r+"");p("--x-landing-point",u(s(m(e,90)-180),0,180,-E/2,E/2)+"px"),p("--duration-chaos",W-l(1e3*c())+"ms");const b=c()<a?g(c()*i,2):0;p("--x1",b),p("--x2",-1*b),p("--x3",b),p("--x4",g(s(u(s(m(e,90)-180),0,180,-1,1)),4)),p("--y1",g(c()*n,4)),p("--y2",g(c()*S*(y()?1:-1),4)),p("--y3",n),p("--y4",g(d(u(s(e-180),0,180,S,-S),0),4)),p("--width",(h?_:l(4*c())+_/2)+"px"),p("--height",(h?_:l(2*c())+_)+"px");const k=f.toString(2).padStart(3,"0").split("");p("--half-rotation",k.map((t=>+t/2+""))),p("--rotation",k),p("--rotation-duration",g(c()*(o-r)+r)+"ms"),p("--border-radius",h?"50%":0);}for(const[t,e]of Object.entries(H))M(e,A[+t].degree);return Promise.resolve().then((()=>P=setTimeout((()=>C&&(t.innerHTML="")),W))),{update(r){w(r);const o=r.particleCount??G,a=r.colors??k,i=r.stageHeight??z;if(A=p(o,a),o===G&&JSON.stringify(k)!==JSON.stringify(a))for(const[t,{color:e}]of Object.entries(A))H[+t].style.setProperty("--bgcolor",e);o!==G&&(t.innerHTML="",H=e(t,A)),C&&!r.destroyAfterDone&&clearTimeout(P),t.style.setProperty("--stage-height",i+"px"),k=a,W=r.duration??W,S=r.force??S,G=o,X=r.particleShape??X,_=r.particleSize??_,C=r.destroyAfterDone??C,z=i,E=r.stageWidth??E;},destroy(){clearTimeout(P);}}};function e(t,e=[]){const r=[];for(const{color:o}of e){const e=f("div");e.className="fk9XWG_particle",e.style.setProperty("--bgcolor",o);const a=f("div");h(e,a),h(t,e),r.push(e);}return r}const r=200,o=800,a=.1,i=.3,n=.5,s=Math.abs,c=Math.random,l=Math.round,d=Math.max,f=t=>document.createElement(t),h=(t,e)=>t.appendChild(e),p=(t,e)=>Array.from({length:t},((r,o)=>({color:e[o%e.length],degree:360*o/t}))),g=(t,e=2)=>l((t+Number.EPSILON)*10**e)/10**e,u=(t,e,r,o,a)=>(t-e)*(a-o)/(r-e)+o,m=(t,e)=>t+e>360?t+e-360:t+e,y=()=>c()>.5,x=6,v=t=>1!==t&&y(),b=t=>void 0===t,k=(t,e)=>{if(!b(t)&&Number.isSafeInteger(t)&&t<0)throw new Error(e+" must be a positive integer")},w=({particleCount:t,duration:e,colors:r,particleSize:o,force:a,stageHeight:i,stageWidth:n,particleShape:s})=>{if(k(t,"particleCount"),k(e,"duration"),k(o,"particleSize"),k(a,"force"),k(i,"stageHeight"),k(n,"stageWidth"),!b(s)&&!/^(mix|circles|rectangles)$/i.test(s))throw new Error('particlesShape should be either "mix" or "circles" or "rectangle"');if(!b(r)&&!Array.isArray(r))throw new Error("colors must be an array of strings");if(a>1)throw new Error("force must be within 0 and 1")};

/* js/Summary.svelte generated by Svelte v4.2.3 */
const file$5 = "js/Summary.svelte";

function add_css$5(target) {
	append_styles(target, "svelte-pulz2o", "div.svelte-pulz2o{font-size:1.85vw}.count.svelte-pulz2o{filter:drop-shadow(0 0 0.5em rgba(1, 1, 1, 0.5))}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3VtbWFyeS5zdmVsdGUiLCJzb3VyY2VzIjpbIlN1bW1hcnkuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG5pbXBvcnQgeyBjb25mZXR0aSB9IGZyb20gJ0BuZW9jb25mZXR0aS9zdmVsdGUnO1xuXG5pbXBvcnQgQ2FyZCBmcm9tICcuL0NhcmQuc3ZlbHRlJztcbmltcG9ydCB7IHNob3dDb25mZXR0aSwgcmV2ZWFsQ291bnQgfSBmcm9tICcuL3N0b3Jlcy5qcyc7XG5pbXBvcnQgeyBwc2V1ZG9SYW5kb21HZW5lcmF0b3IgfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGxldCB2b3RlcztcbmV4cG9ydCBsZXQgc2l6ZSA9IHVuZGVmaW5lZDtcbmV4cG9ydCBsZXQgZW1pdENvbmZldHRpID0gdHJ1ZTtcblxuJDogcmFuZG9tID0gcHNldWRvUmFuZG9tR2VuZXJhdG9yKCRyZXZlYWxDb3VudCwgLTMsIDMpO1xuPC9zY3JpcHQ+XG5cbnsjaWYgZW1pdENvbmZldHRpICYmICRzaG93Q29uZmV0dGl9XG4gICAgPGRpdiB1c2U6Y29uZmV0dGkgLz5cbnsvaWZ9XG48ZGl2IHsuLi4kJHJlc3RQcm9wc30+XG4gICAgeyNlYWNoIHZvdGVzIGFzIFt2b3RlLCBjb3VudF0gKHZvdGUpfVxuICAgICAgICA8ZGl2IGNsYXNzPVwiZC1pbmxpbmUtYmxvY2sgdGV4dC1jZW50ZXJcIj5cbiAgICAgICAgICAgIDxDYXJkIHtzaXplfSByb3RhdGlvbj17cmFuZG9tKCl9Pnt2b3RlfTwvQ2FyZD5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb3VudFwiPntjb3VudH14PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIHs6ZWxzZX1cbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbCB0ZXh0LWNlbnRlciBwLTJcIj5ObyB2b3RlczwvZGl2PlxuICAgIHsvZWFjaH1cbjwvZGl2PlxuXG48c3R5bGU+XG5kaXYge1xuICAgIGZvbnQtc2l6ZTogMS44NXZ3O1xufVxuLmNvdW50IHtcbiAgICBmaWx0ZXI6IGRyb3Atc2hhZG93KDAgMCAwLjVlbSByZ2JhKDEsIDEsIDEsIDAuNSkpO1xufVxuPC9zdHlsZT5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUE2QkEsaUJBQUksQ0FDQSxTQUFTLENBQUUsTUFDZixDQUNBLG9CQUFPLENBQ0gsTUFBTSxDQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDcEQifQ== */");
}

function get_each_context$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i][0];
	child_ctx[8] = list[i][1];
	return child_ctx;
}

// (15:0) {#if emitConfetti && $showConfetti}
function create_if_block$5(ctx) {
	let div;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			attr_dev(div, "class", "svelte-pulz2o");
			add_location(div, file$5, 15, 4, 386);
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
		id: create_if_block$5.name,
		type: "if",
		source: "(15:0) {#if emitConfetti && $showConfetti}",
		ctx
	});

	return block;
}

// (24:4) {:else}
function create_else_block$5(ctx) {
	let div;

	const block = {
		c: function create() {
			div = element("div");
			div.textContent = "No votes";
			attr_dev(div, "class", "col text-center p-2 svelte-pulz2o");
			add_location(div, file$5, 24, 8, 667);
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
		id: create_else_block$5.name,
		type: "else",
		source: "(24:4) {:else}",
		ctx
	});

	return block;
}

// (21:12) <Card {size} rotation={random()}>
function create_default_slot$2(ctx) {
	let t_value = /*vote*/ ctx[7] + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*votes*/ 1 && t_value !== (t_value = /*vote*/ ctx[7] + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(t);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$2.name,
		type: "slot",
		source: "(21:12) <Card {size} rotation={random()}>",
		ctx
	});

	return block;
}

// (19:4) {#each votes as [vote, count] (vote)}
function create_each_block$3(key_1, ctx) {
	let div1;
	let card;
	let t0;
	let div0;
	let t1_value = /*count*/ ctx[8] + "";
	let t1;
	let t2;
	let t3;
	let current;

	card = new Card({
			props: {
				size: /*size*/ ctx[1],
				rotation: /*random*/ ctx[3](),
				$$slots: { default: [create_default_slot$2] },
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
			attr_dev(div0, "class", "count svelte-pulz2o");
			add_location(div0, file$5, 21, 12, 598);
			attr_dev(div1, "class", "d-inline-block text-center svelte-pulz2o");
			add_location(div1, file$5, 19, 8, 486);
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
			if (dirty & /*size*/ 2) card_changes.size = /*size*/ ctx[1];
			if (dirty & /*random*/ 8) card_changes.rotation = /*random*/ ctx[3]();

			if (dirty & /*$$scope, votes*/ 2049) {
				card_changes.$$scope = { dirty, ctx };
			}

			card.$set(card_changes);
			if ((!current || dirty & /*votes*/ 1) && t1_value !== (t1_value = /*count*/ ctx[8] + "")) set_data_dev(t1, t1_value);
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
		id: create_each_block$3.name,
		type: "each",
		source: "(19:4) {#each votes as [vote, count] (vote)}",
		ctx
	});

	return block;
}

function create_fragment$6(ctx) {
	let t;
	let div;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let current;
	let if_block = /*emitConfetti*/ ctx[2] && /*$showConfetti*/ ctx[4] && create_if_block$5(ctx);
	let each_value = ensure_array_like_dev(/*votes*/ ctx[0]);
	const get_key = ctx => /*vote*/ ctx[7];
	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$3(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
	}

	let each_1_else = null;

	if (!each_value.length) {
		each_1_else = create_else_block$5(ctx);
	}

	let div_levels = [/*$$restProps*/ ctx[5]];
	let div_data = {};

	for (let i = 0; i < div_levels.length; i += 1) {
		div_data = assign$1(div_data, div_levels[i]);
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

			set_attributes(div, div_data);
			toggle_class(div, "svelte-pulz2o", true);
			add_location(div, file$5, 17, 0, 413);
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
			if (/*emitConfetti*/ ctx[2] && /*$showConfetti*/ ctx[4]) {
				if (if_block) ; else {
					if_block = create_if_block$5(ctx);
					if_block.c();
					if_block.m(t.parentNode, t);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*votes, size, random*/ 11) {
				each_value = ensure_array_like_dev(/*votes*/ ctx[0]);
				group_outros();
				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$3, null, get_each_context$3);
				check_outros();

				if (!each_value.length && each_1_else) {
					each_1_else.p(ctx, dirty);
				} else if (!each_value.length) {
					each_1_else = create_else_block$5(ctx);
					each_1_else.c();
					each_1_else.m(div, null);
				} else if (each_1_else) {
					each_1_else.d(1);
					each_1_else = null;
				}
			}

			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5]]));
			toggle_class(div, "svelte-pulz2o", true);
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
		id: create_fragment$6.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$6($$self, $$props, $$invalidate) {
	let random;
	const omit_props_names = ["votes","size","emitConfetti"];
	let $$restProps = compute_rest_props($$props, omit_props_names);
	let $revealCount;
	let $showConfetti;
	validate_store(revealCount, 'revealCount');
	component_subscribe($$self, revealCount, $$value => $$invalidate(6, $revealCount = $$value));
	validate_store(showConfetti, 'showConfetti');
	component_subscribe($$self, showConfetti, $$value => $$invalidate(4, $showConfetti = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Summary', slots, []);
	let { votes } = $$props;
	let { size = undefined } = $$props;
	let { emitConfetti = true } = $$props;

	$$self.$$.on_mount.push(function () {
		if (votes === undefined && !('votes' in $$props || $$self.$$.bound[$$self.$$.props['votes']])) {
			console.warn("<Summary> was created without expected prop 'votes'");
		}
	});

	$$self.$$set = $$new_props => {
		$$props = assign$1(assign$1({}, $$props), exclude_internal_props($$new_props));
		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
		if ('votes' in $$new_props) $$invalidate(0, votes = $$new_props.votes);
		if ('size' in $$new_props) $$invalidate(1, size = $$new_props.size);
		if ('emitConfetti' in $$new_props) $$invalidate(2, emitConfetti = $$new_props.emitConfetti);
	};

	$$self.$capture_state = () => ({
		confetti: t,
		Card,
		showConfetti,
		revealCount,
		pseudoRandomGenerator,
		votes,
		size,
		emitConfetti,
		random,
		$revealCount,
		$showConfetti
	});

	$$self.$inject_state = $$new_props => {
		if ('votes' in $$props) $$invalidate(0, votes = $$new_props.votes);
		if ('size' in $$props) $$invalidate(1, size = $$new_props.size);
		if ('emitConfetti' in $$props) $$invalidate(2, emitConfetti = $$new_props.emitConfetti);
		if ('random' in $$props) $$invalidate(3, random = $$new_props.random);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$revealCount*/ 64) {
			$$invalidate(3, random = pseudoRandomGenerator($revealCount, -3, 3));
		}
	};

	return [votes, size, emitConfetti, random, $showConfetti, $$restProps, $revealCount];
}

class Summary extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$6, create_fragment$6, safe_not_equal, { votes: 0, size: 1, emitConfetti: 2 }, add_css$5);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Summary",
			options,
			id: create_fragment$6.name
		});
	}

	get votes() {
		throw new Error("<Summary>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set votes(value) {
		throw new Error("<Summary>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get size() {
		throw new Error("<Summary>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size(value) {
		throw new Error("<Summary>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get emitConfetti() {
		throw new Error("<Summary>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set emitConfetti(value) {
		throw new Error("<Summary>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* js/History.svelte generated by Svelte v4.2.3 */
const file$4 = "js/History.svelte";

function add_css$4(target) {
	append_styles(target, "svelte-n1eljq", ".voting-round.svelte-n1eljq{writing-mode:vertical-lr}.history-item.svelte-n1eljq{background-color:#efefef}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGlzdG9yeS5zdmVsdGUiLCJzb3VyY2VzIjpbIkhpc3Rvcnkuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG5pbXBvcnQgeyBsb2csIGNvdW50Vm90ZXMsIHJldmVhbENvdW50LCB2b3RlcyB9IGZyb20gJy4vc3RvcmVzLmpzJztcbmltcG9ydCBTdW1tYXJ5IGZyb20gJy4vU3VtbWFyeS5zdmVsdGUnO1xuXG5sZXQgY29sbGFwc2VkID0gdHJ1ZTtcblxuZnVuY3Rpb24gdG9nZ2xlQ29sbGFwc2VkKCkge1xuICAgIGNvbGxhcHNlZCA9ICFjb2xsYXBzZWQ7XG59XG48L3NjcmlwdD5cblxuPGRpdlxuICAgIHJvbGU9XCJidXR0b25cIlxuICAgIGNsYXNzPVwidGV4dC1tdXRlZCBteS0xIG14LTIgc21hbGxcIlxuICAgIG9uOmNsaWNrPXt0b2dnbGVDb2xsYXBzZWR9XG4gICAgb246a2V5cHJlc3M9e3RvZ2dsZUNvbGxhcHNlZH1cbiAgICB0YWJpbmRleD1cIjBcIj5cbiAgICB7I2lmICRyZXZlYWxDb3VudCA9PSAwfVxuICAgICAgICBObyBoaXN0b3J5IHlldC5cbiAgICB7OmVsc2UgaWYgJHJldmVhbENvdW50ID09IDF9XG4gICAgICAgIHsjaWYgY29sbGFwc2VkfVNob3d7OmVsc2V9SGlkZXsvaWZ9IHByZXZpb3VzIHZvdGVzXG4gICAgezplbHNlfVxuICAgICAgICB7I2lmIGNvbGxhcHNlZH1TaG93ezplbHNlfUhpZGV7L2lmfSBwcmV2aW91cyB7JHJldmVhbENvdW50fSByb3VuZHNcbiAgICB7L2lmfVxuXG4gICAgeyNpZiAkcmV2ZWFsQ291bnQgPiAwfVxuICAgICAgICB7I2lmIGNvbGxhcHNlZH3ilrJ7OmVsc2V94pa8ey9pZn1cbiAgICB7L2lmfVxuPC9kaXY+XG57I2lmICFjb2xsYXBzZWR9XG4gICAgPGRpdiBjbGFzcz1cImQtZmxleCBvdmVyZmxvdy1zY3JvbGwgbWItMiB0ZXh0LW11dGVkXCI+XG4gICAgICAgIHsjZWFjaCAkbG9nLmZpbHRlcigoeCkgPT4geC5ldmVudCA9PSAncmV2ZWFsJykgYXMgeyBkYXRhIH19XG4gICAgICAgICAgICB7QGNvbnN0IHZvdGVTdW1tYXJ5ID0gY291bnRWb3RlcyhkYXRhLnZvdGVzKX1cbiAgICAgICAgICAgIDxzbWFsbCBjbGFzcz1cInZvdGluZy1yb3VuZCBtcy0xIHRleHQtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgUm91bmQge2RhdGEucm91bmR9XG4gICAgICAgICAgICAgICAgeyNpZiB2b3RlU3VtbWFyeS5sZW5ndGggPT0gMH1cbiAgICAgICAgICAgICAgICAgICAgPGJyIC8+Tm8gdm90ZXNcbiAgICAgICAgICAgICAgICB7L2lmfVxuICAgICAgICAgICAgPC9zbWFsbD5cbiAgICAgICAgICAgIHsjaWYgdm90ZVN1bW1hcnkubGVuZ3RoID4gMH1cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic21hbGwgaGlzdG9yeS1pdGVtIHRleHQtc3RhcnQgcm91bmRlZCBmbGV4LXNocmluay0wIG0tMSBwLTFcIj5cbiAgICAgICAgICAgICAgICAgICAgPFN1bW1hcnkgdm90ZXM9e3ZvdGVTdW1tYXJ5fSBlbWl0Q29uZmV0dGk9e2ZhbHNlfSBzaXplPVwic21cIiAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgey9pZn1cbiAgICAgICAgey9lYWNofVxuICAgIDwvZGl2Plxuey9pZn1cblxuPHN0eWxlPlxuLnZvdGluZy1yb3VuZCB7XG4gICAgd3JpdGluZy1tb2RlOiB2ZXJ0aWNhbC1scjtcbn1cbi5oaXN0b3J5LWl0ZW0ge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNlZmVmZWY7XG59XG48L3N0eWxlPlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWlEQSwyQkFBYyxDQUNWLFlBQVksQ0FBRSxXQUNsQixDQUNBLDJCQUFjLENBQ1YsZ0JBQWdCLENBQUUsT0FDdEIifQ== */");
}

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i].data;
	const constants_0 = countVotes(/*data*/ child_ctx[4].votes);
	child_ctx[5] = constants_0;
	return child_ctx;
}

// (22:4) {:else}
function create_else_block_2(ctx) {
	let t0;
	let t1;
	let t2;

	function select_block_type_2(ctx, dirty) {
		if (/*collapsed*/ ctx[0]) return create_if_block_8;
		return create_else_block_3;
	}

	let current_block_type = select_block_type_2(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			if_block.c();
			t0 = text(" previous ");
			t1 = text(/*$revealCount*/ ctx[1]);
			t2 = text(" rounds");
		},
		m: function mount(target, anchor) {
			if_block.m(target, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, t2, anchor);
		},
		p: function update(ctx, dirty) {
			if (current_block_type !== (current_block_type = select_block_type_2(ctx))) {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(t0.parentNode, t0);
				}
			}

			if (dirty & /*$revealCount*/ 2) set_data_dev(t1, /*$revealCount*/ ctx[1]);
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(t0);
				detach_dev(t1);
				detach_dev(t2);
			}

			if_block.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_2.name,
		type: "else",
		source: "(22:4) {:else}",
		ctx
	});

	return block;
}

// (20:32) 
function create_if_block_6(ctx) {
	let t;

	function select_block_type_1(ctx, dirty) {
		if (/*collapsed*/ ctx[0]) return create_if_block_7;
		return create_else_block_1$1;
	}

	let current_block_type = select_block_type_1(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			if_block.c();
			t = text(" previous votes");
		},
		m: function mount(target, anchor) {
			if_block.m(target, anchor);
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(t.parentNode, t);
				}
			}
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(t);
			}

			if_block.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_6.name,
		type: "if",
		source: "(20:32) ",
		ctx
	});

	return block;
}

// (18:4) {#if $revealCount == 0}
function create_if_block_5(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("No history yet.");
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
		id: create_if_block_5.name,
		type: "if",
		source: "(18:4) {#if $revealCount == 0}",
		ctx
	});

	return block;
}

// (23:27) {:else}
function create_else_block_3(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Hide");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(t);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_3.name,
		type: "else",
		source: "(23:27) {:else}",
		ctx
	});

	return block;
}

// (23:8) {#if collapsed}
function create_if_block_8(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Show");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(t);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_8.name,
		type: "if",
		source: "(23:8) {#if collapsed}",
		ctx
	});

	return block;
}

// (21:27) {:else}
function create_else_block_1$1(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Hide");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(t);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_1$1.name,
		type: "else",
		source: "(21:27) {:else}",
		ctx
	});

	return block;
}

// (21:8) {#if collapsed}
function create_if_block_7(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Show");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(t);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_7.name,
		type: "if",
		source: "(21:8) {#if collapsed}",
		ctx
	});

	return block;
}

// (26:4) {#if $revealCount > 0}
function create_if_block_3$1(ctx) {
	let if_block_anchor;

	function select_block_type_3(ctx, dirty) {
		if (/*collapsed*/ ctx[0]) return create_if_block_4;
		return create_else_block$4;
	}

	let current_block_type = select_block_type_3(ctx);
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
			if (current_block_type !== (current_block_type = select_block_type_3(ctx))) {
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
		id: create_if_block_3$1.name,
		type: "if",
		source: "(26:4) {#if $revealCount > 0}",
		ctx
	});

	return block;
}

// (27:24) {:else}
function create_else_block$4(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("▼");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
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
		source: "(27:24) {:else}",
		ctx
	});

	return block;
}

// (27:8) {#if collapsed}
function create_if_block_4(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("▲");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(t);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_4.name,
		type: "if",
		source: "(27:8) {#if collapsed}",
		ctx
	});

	return block;
}

// (30:0) {#if !collapsed}
function create_if_block$4(ctx) {
	let div;
	let current;
	let each_value = ensure_array_like_dev(/*$log*/ ctx[2].filter(func));
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
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

			attr_dev(div, "class", "d-flex overflow-scroll mb-2 text-muted");
			add_location(div, file$4, 30, 4, 700);
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
			if (dirty & /*$log*/ 4) {
				each_value = ensure_array_like_dev(/*$log*/ ctx[2].filter(func));
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$2(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$2(child_ctx);
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
		id: create_if_block$4.name,
		type: "if",
		source: "(30:0) {#if !collapsed}",
		ctx
	});

	return block;
}

// (36:16) {#if voteSummary.length == 0}
function create_if_block_2$3(ctx) {
	let br;
	let t;

	const block = {
		c: function create() {
			br = element("br");
			t = text("No votes");
			add_location(br, file$4, 36, 20, 1038);
		},
		m: function mount(target, anchor) {
			insert_dev(target, br, anchor);
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(br);
				detach_dev(t);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$3.name,
		type: "if",
		source: "(36:16) {#if voteSummary.length == 0}",
		ctx
	});

	return block;
}

// (40:12) {#if voteSummary.length > 0}
function create_if_block_1$3(ctx) {
	let div;
	let summary;
	let t;
	let current;

	summary = new Summary({
			props: {
				votes: /*voteSummary*/ ctx[5],
				emitConfetti: false,
				size: "sm"
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(summary.$$.fragment);
			t = space();
			attr_dev(div, "class", "small history-item text-start rounded flex-shrink-0 m-1 p-1 svelte-n1eljq");
			add_location(div, file$4, 40, 16, 1153);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(summary, div, null);
			append_dev(div, t);
			current = true;
		},
		p: function update(ctx, dirty) {
			const summary_changes = {};
			if (dirty & /*$log*/ 4) summary_changes.votes = /*voteSummary*/ ctx[5];
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
		id: create_if_block_1$3.name,
		type: "if",
		source: "(40:12) {#if voteSummary.length > 0}",
		ctx
	});

	return block;
}

// (32:8) {#each $log.filter((x) => x.event == 'reveal') as { data }}
function create_each_block$2(ctx) {
	let small;
	let t0;
	let t1_value = /*data*/ ctx[4].round + "";
	let t1;
	let t2;
	let t3;
	let if_block1_anchor;
	let current;
	let if_block0 = /*voteSummary*/ ctx[5].length == 0 && create_if_block_2$3(ctx);
	let if_block1 = /*voteSummary*/ ctx[5].length > 0 && create_if_block_1$3(ctx);

	const block = {
		c: function create() {
			small = element("small");
			t0 = text("Round ");
			t1 = text(t1_value);
			t2 = space();
			if (if_block0) if_block0.c();
			t3 = space();
			if (if_block1) if_block1.c();
			if_block1_anchor = empty();
			attr_dev(small, "class", "voting-round ms-1 text-center svelte-n1eljq");
			add_location(small, file$4, 33, 12, 891);
		},
		m: function mount(target, anchor) {
			insert_dev(target, small, anchor);
			append_dev(small, t0);
			append_dev(small, t1);
			append_dev(small, t2);
			if (if_block0) if_block0.m(small, null);
			insert_dev(target, t3, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert_dev(target, if_block1_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if ((!current || dirty & /*$log*/ 4) && t1_value !== (t1_value = /*data*/ ctx[4].round + "")) set_data_dev(t1, t1_value);

			if (/*voteSummary*/ ctx[5].length == 0) {
				if (if_block0) ; else {
					if_block0 = create_if_block_2$3(ctx);
					if_block0.c();
					if_block0.m(small, null);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*voteSummary*/ ctx[5].length > 0) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty & /*$log*/ 4) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block_1$3(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block1);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block1);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(small);
				detach_dev(t3);
				detach_dev(if_block1_anchor);
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$2.name,
		type: "each",
		source: "(32:8) {#each $log.filter((x) => x.event == 'reveal') as { data }}",
		ctx
	});

	return block;
}

function create_fragment$5(ctx) {
	let div;
	let t0;
	let t1;
	let if_block2_anchor;
	let current;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (/*$revealCount*/ ctx[1] == 0) return create_if_block_5;
		if (/*$revealCount*/ ctx[1] == 1) return create_if_block_6;
		return create_else_block_2;
	}

	let current_block_type = select_block_type(ctx);
	let if_block0 = current_block_type(ctx);
	let if_block1 = /*$revealCount*/ ctx[1] > 0 && create_if_block_3$1(ctx);
	let if_block2 = !/*collapsed*/ ctx[0] && create_if_block$4(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if_block0.c();
			t0 = space();
			if (if_block1) if_block1.c();
			t1 = space();
			if (if_block2) if_block2.c();
			if_block2_anchor = empty();
			attr_dev(div, "role", "button");
			attr_dev(div, "class", "text-muted my-1 mx-2 small");
			attr_dev(div, "tabindex", "0");
			add_location(div, file$4, 11, 0, 210);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if_block0.m(div, null);
			append_dev(div, t0);
			if (if_block1) if_block1.m(div, null);
			insert_dev(target, t1, anchor);
			if (if_block2) if_block2.m(target, anchor);
			insert_dev(target, if_block2_anchor, anchor);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(div, "click", /*toggleCollapsed*/ ctx[3], false, false, false, false),
					listen_dev(div, "keypress", /*toggleCollapsed*/ ctx[3], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
				if_block0.p(ctx, dirty);
			} else {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(div, t0);
				}
			}

			if (/*$revealCount*/ ctx[1] > 0) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_3$1(ctx);
					if_block1.c();
					if_block1.m(div, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (!/*collapsed*/ ctx[0]) {
				if (if_block2) {
					if_block2.p(ctx, dirty);

					if (dirty & /*collapsed*/ 1) {
						transition_in(if_block2, 1);
					}
				} else {
					if_block2 = create_if_block$4(ctx);
					if_block2.c();
					transition_in(if_block2, 1);
					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
				}
			} else if (if_block2) {
				group_outros();

				transition_out(if_block2, 1, 1, () => {
					if_block2 = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block2);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block2);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div);
				detach_dev(t1);
				detach_dev(if_block2_anchor);
			}

			if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d(detaching);
			mounted = false;
			run_all(dispose);
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

const func = x => x.event == 'reveal';

function instance$5($$self, $$props, $$invalidate) {
	let $revealCount;
	let $log;
	validate_store(revealCount, 'revealCount');
	component_subscribe($$self, revealCount, $$value => $$invalidate(1, $revealCount = $$value));
	validate_store(log, 'log');
	component_subscribe($$self, log, $$value => $$invalidate(2, $log = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('History', slots, []);
	let collapsed = true;

	function toggleCollapsed() {
		$$invalidate(0, collapsed = !collapsed);
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<History> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		log,
		countVotes,
		revealCount,
		votes,
		Summary,
		collapsed,
		toggleCollapsed,
		$revealCount,
		$log
	});

	$$self.$inject_state = $$props => {
		if ('collapsed' in $$props) $$invalidate(0, collapsed = $$props.collapsed);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [collapsed, $revealCount, $log, toggleCollapsed];
}

class History extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$5, create_fragment$5, safe_not_equal, {}, add_css$4);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "History",
			options,
			id: create_fragment$5.name
		});
	}
}

/* js/PlayerCard.svelte generated by Svelte v4.2.3 */
const file$3 = "js/PlayerCard.svelte";

function add_css$3(target) {
	append_styles(target, "svelte-q802sj", ".player-card.svelte-q802sj{position:relative;opacity:0;top:-50px}.vote.svelte-q802sj{opacity:100 !important;top:0px !important;transition:all 525ms cubic-bezier(0, 0.5, 0, 0.9)}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyQ2FyZC5zdmVsdGUiLCJzb3VyY2VzIjpbIlBsYXllckNhcmQuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG5leHBvcnQgbGV0IHZvdGU7XG48L3NjcmlwdD5cblxuPGRpdiBjbGFzcz1cInBsYXllci1jYXJkXCIgY2xhc3M6dm90ZT5cbiAgICA8c2xvdCAvPlxuPC9kaXY+XG5cbjxzdHlsZT5cbi5wbGF5ZXItY2FyZCB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIG9wYWNpdHk6IDA7XG4gICAgdG9wOiAtNTBweDtcbn1cblxuLnZvdGUge1xuICAgIG9wYWNpdHk6IDEwMCAhaW1wb3J0YW50O1xuICAgIHRvcDogMHB4ICFpbXBvcnRhbnQ7XG4gICAgLyogY3ViaWMtYmV6aWVyIGNhbiBiZSB0ZXN0ZWQgd2l0aCBodHRwczovLzEwMDE1LmlvL3Rvb2xzL2Nzcy1jdWJpYy1iZXppZXItZ2VuZXJhdG9yICovXG4gICAgdHJhbnNpdGlvbjogYWxsIDUyNW1zIGN1YmljLWJlemllcigwLCAwLjUsIDAsIDAuOSk7XG59XG48L3N0eWxlPlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLDBCQUFhLENBQ1QsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsT0FBTyxDQUFFLENBQUMsQ0FDVixHQUFHLENBQUUsS0FDVCxDQUVBLG1CQUFNLENBQ0YsT0FBTyxDQUFFLEdBQUcsQ0FBQyxVQUFVLENBQ3ZCLEdBQUcsQ0FBRSxHQUFHLENBQUMsVUFBVSxDQUVuQixVQUFVLENBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FDckQifQ== */");
}

function create_fragment$4(ctx) {
	let div;
	let current;
	const default_slot_template = /*#slots*/ ctx[2].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

	const block = {
		c: function create() {
			div = element("div");
			if (default_slot) default_slot.c();
			attr_dev(div, "class", "player-card svelte-q802sj");
			toggle_class(div, "vote", /*vote*/ ctx[0]);
			add_location(div, file$3, 4, 0, 37);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[1],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
						null
					);
				}
			}

			if (!current || dirty & /*vote*/ 1) {
				toggle_class(div, "vote", /*vote*/ ctx[0]);
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
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('PlayerCard', slots, ['default']);
	let { vote } = $$props;

	$$self.$$.on_mount.push(function () {
		if (vote === undefined && !('vote' in $$props || $$self.$$.bound[$$self.$$.props['vote']])) {
			console.warn("<PlayerCard> was created without expected prop 'vote'");
		}
	});

	const writable_props = ['vote'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlayerCard> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('vote' in $$props) $$invalidate(0, vote = $$props.vote);
		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({ vote });

	$$self.$inject_state = $$props => {
		if ('vote' in $$props) $$invalidate(0, vote = $$props.vote);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [vote, $$scope, slots];
}

class PlayerCard extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$4, create_fragment$4, safe_not_equal, { vote: 0 }, add_css$3);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "PlayerCard",
			options,
			id: create_fragment$4.name
		});
	}

	get vote() {
		throw new Error("<PlayerCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set vote(value) {
		throw new Error("<PlayerCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* js/Participant.svelte generated by Svelte v4.2.3 */
const file$2 = "js/Participant.svelte";

function add_css$2(target) {
	append_styles(target, "svelte-60cyop", ".participant.svelte-60cyop.svelte-60cyop{display:block;position:absolute;text-align:center;top:95%;left:50%;margin:-4vw}.participant.svelte-60cyop .name.svelte-60cyop{font-size:2vw}.card-back.svelte-60cyop.svelte-60cyop{margin:auto;width:84%;height:87%;border:1px solid var(--bgcolor);border-radius:0.4vw;background-size:0.8vw 0.8vw;background-image:linear-gradient(45deg, transparent 47%, var(--bgcolor) 47%, var(--bgcolor) 53%, transparent 53%),\n        linear-gradient(135deg, transparent 47%, var(--bgcolor) 47%, var(--bgcolor) 53%, transparent 53%)}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFydGljaXBhbnQuc3ZlbHRlIiwic291cmNlcyI6WyJQYXJ0aWNpcGFudC5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbmltcG9ydCBDYXJkIGZyb20gJy4vQ2FyZC5zdmVsdGUnO1xuaW1wb3J0IFBsYXllckNhcmQgZnJvbSAnLi9QbGF5ZXJDYXJkLnN2ZWx0ZSc7XG5cbmV4cG9ydCBsZXQgdXNlcjtcbmV4cG9ydCBsZXQgaXNSZXZlYWxlZDtcbmV4cG9ydCBsZXQgaTtcbmV4cG9ydCBsZXQgY291bnQ7XG5leHBvcnQgbGV0IHJvdGF0aW9uO1xuZXhwb3J0IGxldCByYWRpdXM7XG5cbi8vIEFtb3VudCBvZiBkZWdyZWVzIHRvIHNwcmVhZCB0aGUgcGFydGljaXBhbnRzIG92ZXIgYXQgdGhlIHRhYmxlXG5jb25zdCBtYXhBbmdsZSA9IDE3NDtcbmxldCBhbmdsZTtcbiQ6IHtcbiAgICBhbmdsZSA9IC05MDtcbiAgICBpZiAoY291bnQgPiAxKSB7XG4gICAgICAgIC8vIEEgZml4ZWQgYW1vdW50IG9mIGRlZ3JlZXMsIG9yIGFsbCBwYXJ0aWNpcGFudHMgZXZlbmx5IGRpc3RyaWJ1dGVkLCB3aGF0ZXZlciBpcyBzbWFsbGVyLlxuICAgICAgICBhbmdsZSAtPSBNYXRoLm1pbigyMCwgbWF4QW5nbGUgLyBjb3VudCkgKiAoaSAtIChjb3VudCAtIDEpIC8gMik7XG4gICAgfVxufVxuPC9zY3JpcHQ+XG5cbjxkaXYgY2xhc3M9XCJwYXJ0aWNpcGFudFwiIHN0eWxlPVwidHJhbnNmb3JtOiB0cmFuc2xhdGUoMS4zdncpIHJvdGF0ZSh7YW5nbGV9ZGVnKSB0cmFuc2xhdGUoe3JhZGl1c30pIHJvdGF0ZSg5MGRlZylcIj5cbiAgICA8c3Ryb25nIGNsYXNzPVwibmFtZVwiPnt1c2VyLm5hbWV9PC9zdHJvbmc+XG4gICAgPFBsYXllckNhcmQgdm90ZT17dXNlci52b3RlfT5cbiAgICAgICAgPENhcmQgY29sb3I9XCJsaW5lYXItZ3JhZGllbnQoNDVkZWcsICNjMmMyYzIgMCUsICNGRkYgNjAlKVwiIHtyb3RhdGlvbn0+XG4gICAgICAgICAgICB7I2lmIHVzZXIuaXNfc3BlY3RhdG9yfVxuICAgICAgICAgICAgICAgIPCfkYHvuI9cbiAgICAgICAgICAgIHs6ZWxzZSBpZiB1c2VyLnZvdGV9XG4gICAgICAgICAgICAgICAgeyNpZiBpc1JldmVhbGVkfVxuICAgICAgICAgICAgICAgICAgICB7dXNlci52b3RlfVxuICAgICAgICAgICAgICAgIHs6ZWxzZX1cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIi0tYmdjb2xvcjogI2NjNjA2MFwiIGNsYXNzPVwiY2FyZC1iYWNrXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgey9pZn1cbiAgICAgICAgICAgIHsvaWZ9XG4gICAgICAgIDwvQ2FyZD5cbiAgICA8L1BsYXllckNhcmQ+XG48L2Rpdj5cblxuPHN0eWxlPlxuLnBhcnRpY2lwYW50IHtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuXG4gICAgdG9wOiA5NSU7XG4gICAgbGVmdDogNTAlO1xuICAgIG1hcmdpbjogLTR2dztcbn1cblxuLnBhcnRpY2lwYW50IC5uYW1lIHtcbiAgICBmb250LXNpemU6IDJ2dztcbn1cblxuLmNhcmQtYmFjayB7XG4gICAgbWFyZ2luOiBhdXRvO1xuICAgIHdpZHRoOiA4NCU7XG4gICAgaGVpZ2h0OiA4NyU7XG5cbiAgICAvKiBCYWNrZ3JvdW5kIHBhdHRlcm4gKi9cbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1iZ2NvbG9yKTtcbiAgICBib3JkZXItcmFkaXVzOiAwLjR2dztcbiAgICBiYWNrZ3JvdW5kLXNpemU6IDAuOHZ3IDAuOHZ3O1xuICAgIGJhY2tncm91bmQtaW1hZ2U6XG4gICAgICAgIGxpbmVhci1ncmFkaWVudCg0NWRlZywgdHJhbnNwYXJlbnQgNDclLCB2YXIoLS1iZ2NvbG9yKSA0NyUsIHZhcigtLWJnY29sb3IpIDUzJSwgdHJhbnNwYXJlbnQgNTMlKSxcbiAgICAgICAgbGluZWFyLWdyYWRpZW50KDEzNWRlZywgdHJhbnNwYXJlbnQgNDclLCB2YXIoLS1iZ2NvbG9yKSA0NyUsIHZhcigtLWJnY29sb3IpIDUzJSwgdHJhbnNwYXJlbnQgNTMlKTtcbn1cbjwvc3R5bGU+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBeUNBLHdDQUFhLENBQ1QsT0FBTyxDQUFFLEtBQUssQ0FDZCxRQUFRLENBQUUsUUFBUSxDQUNsQixVQUFVLENBQUUsTUFBTSxDQUVsQixHQUFHLENBQUUsR0FBRyxDQUNSLElBQUksQ0FBRSxHQUFHLENBQ1QsTUFBTSxDQUFFLElBQ1osQ0FFQSwwQkFBWSxDQUFDLG1CQUFNLENBQ2YsU0FBUyxDQUFFLEdBQ2YsQ0FFQSxzQ0FBVyxDQUNQLE1BQU0sQ0FBRSxJQUFJLENBQ1osS0FBSyxDQUFFLEdBQUcsQ0FDVixNQUFNLENBQUUsR0FBRyxDQUdYLE1BQU0sQ0FBRSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksU0FBUyxDQUFDLENBQ2hDLGFBQWEsQ0FBRSxLQUFLLENBQ3BCLGVBQWUsQ0FBRSxLQUFLLENBQUMsS0FBSyxDQUM1QixnQkFBZ0IsQ0FDWixnQkFBZ0IsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekcsUUFBUSxnQkFBZ0IsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUN4RyJ9 */");
}

// (30:32) 
function create_if_block_1$2(ctx) {
	let if_block_anchor;

	function select_block_type_1(ctx, dirty) {
		if (/*isRevealed*/ ctx[1]) return create_if_block_2$2;
		return create_else_block$3;
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
		source: "(30:32) ",
		ctx
	});

	return block;
}

// (28:12) {#if user.is_spectator}
function create_if_block$3(ctx) {
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
		id: create_if_block$3.name,
		type: "if",
		source: "(28:12) {#if user.is_spectator}",
		ctx
	});

	return block;
}

// (33:16) {:else}
function create_else_block$3(ctx) {
	let div;

	const block = {
		c: function create() {
			div = element("div");
			set_style(div, "--bgcolor", "#cc6060");
			attr_dev(div, "class", "card-back svelte-60cyop");
			add_location(div, file$2, 33, 20, 1008);
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
		id: create_else_block$3.name,
		type: "else",
		source: "(33:16) {:else}",
		ctx
	});

	return block;
}

// (31:16) {#if isRevealed}
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
		source: "(31:16) {#if isRevealed}",
		ctx
	});

	return block;
}

// (27:8) <Card color="linear-gradient(45deg, #c2c2c2 0%, #FFF 60%)" {rotation}>
function create_default_slot_1(ctx) {
	let if_block_anchor;

	function select_block_type(ctx, dirty) {
		if (/*user*/ ctx[0].is_spectator) return create_if_block$3;
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
		id: create_default_slot_1.name,
		type: "slot",
		source: "(27:8) <Card color=\\\"linear-gradient(45deg, #c2c2c2 0%, #FFF 60%)\\\" {rotation}>",
		ctx
	});

	return block;
}

// (26:4) <PlayerCard vote={user.vote}>
function create_default_slot$1(ctx) {
	let card;
	let current;

	card = new Card({
			props: {
				color: "linear-gradient(45deg, #c2c2c2 0%, #FFF 60%)",
				rotation: /*rotation*/ ctx[2],
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(card.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(card, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const card_changes = {};
			if (dirty & /*rotation*/ 4) card_changes.rotation = /*rotation*/ ctx[2];

			if (dirty & /*$$scope, user, isRevealed*/ 131) {
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
		id: create_default_slot$1.name,
		type: "slot",
		source: "(26:4) <PlayerCard vote={user.vote}>",
		ctx
	});

	return block;
}

function create_fragment$3(ctx) {
	let div;
	let strong;
	let t0_value = /*user*/ ctx[0].name + "";
	let t0;
	let t1;
	let playercard;
	let current;

	playercard = new PlayerCard({
			props: {
				vote: /*user*/ ctx[0].vote,
				$$slots: { default: [create_default_slot$1] },
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
			create_component(playercard.$$.fragment);
			attr_dev(strong, "class", "name svelte-60cyop");
			add_location(strong, file$2, 24, 4, 655);
			attr_dev(div, "class", "participant svelte-60cyop");
			set_style(div, "transform", "translate(1.3vw) rotate(" + /*angle*/ ctx[4] + "deg) translate(" + /*radius*/ ctx[3] + ") rotate(90deg)");
			add_location(div, file$2, 23, 0, 536);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, strong);
			append_dev(strong, t0);
			append_dev(div, t1);
			mount_component(playercard, div, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if ((!current || dirty & /*user*/ 1) && t0_value !== (t0_value = /*user*/ ctx[0].name + "")) set_data_dev(t0, t0_value);
			const playercard_changes = {};
			if (dirty & /*user*/ 1) playercard_changes.vote = /*user*/ ctx[0].vote;

			if (dirty & /*$$scope, rotation, user, isRevealed*/ 135) {
				playercard_changes.$$scope = { dirty, ctx };
			}

			playercard.$set(playercard_changes);

			if (!current || dirty & /*angle, radius*/ 24) {
				set_style(div, "transform", "translate(1.3vw) rotate(" + /*angle*/ ctx[4] + "deg) translate(" + /*radius*/ ctx[3] + ") rotate(90deg)");
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(playercard.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(playercard.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div);
			}

			destroy_component(playercard);
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

const maxAngle = 174;

function instance$3($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Participant', slots, []);
	let { user } = $$props;
	let { isRevealed } = $$props;
	let { i } = $$props;
	let { count } = $$props;
	let { rotation } = $$props;
	let { radius } = $$props;
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

		if (rotation === undefined && !('rotation' in $$props || $$self.$$.bound[$$self.$$.props['rotation']])) {
			console.warn("<Participant> was created without expected prop 'rotation'");
		}

		if (radius === undefined && !('radius' in $$props || $$self.$$.bound[$$self.$$.props['radius']])) {
			console.warn("<Participant> was created without expected prop 'radius'");
		}
	});

	const writable_props = ['user', 'isRevealed', 'i', 'count', 'rotation', 'radius'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Participant> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('user' in $$props) $$invalidate(0, user = $$props.user);
		if ('isRevealed' in $$props) $$invalidate(1, isRevealed = $$props.isRevealed);
		if ('i' in $$props) $$invalidate(5, i = $$props.i);
		if ('count' in $$props) $$invalidate(6, count = $$props.count);
		if ('rotation' in $$props) $$invalidate(2, rotation = $$props.rotation);
		if ('radius' in $$props) $$invalidate(3, radius = $$props.radius);
	};

	$$self.$capture_state = () => ({
		Card,
		PlayerCard,
		user,
		isRevealed,
		i,
		count,
		rotation,
		radius,
		maxAngle,
		angle
	});

	$$self.$inject_state = $$props => {
		if ('user' in $$props) $$invalidate(0, user = $$props.user);
		if ('isRevealed' in $$props) $$invalidate(1, isRevealed = $$props.isRevealed);
		if ('i' in $$props) $$invalidate(5, i = $$props.i);
		if ('count' in $$props) $$invalidate(6, count = $$props.count);
		if ('rotation' in $$props) $$invalidate(2, rotation = $$props.rotation);
		if ('radius' in $$props) $$invalidate(3, radius = $$props.radius);
		if ('angle' in $$props) $$invalidate(4, angle = $$props.angle);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*count, angle, i*/ 112) {
			{
				$$invalidate(4, angle = -90);

				if (count > 1) {
					// A fixed amount of degrees, or all participants evenly distributed, whatever is smaller.
					$$invalidate(4, angle -= Math.min(20, maxAngle / count) * (i - (count - 1) / 2));
				}
			}
		}
	};

	return [user, isRevealed, rotation, radius, angle, i, count];
}

class Participant extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init$1(
			this,
			options,
			instance$3,
			create_fragment$3,
			safe_not_equal,
			{
				user: 0,
				isRevealed: 1,
				i: 5,
				count: 6,
				rotation: 2,
				radius: 3
			},
			add_css$2
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Participant",
			options,
			id: create_fragment$3.name
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

	get rotation() {
		throw new Error("<Participant>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set rotation(value) {
		throw new Error("<Participant>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get radius() {
		throw new Error("<Participant>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set radius(value) {
		throw new Error("<Participant>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* js/Settings.svelte generated by Svelte v4.2.3 */

const file$1 = "js/Settings.svelte";

function add_css$1(target) {
	append_styles(target, "svelte-1y9hivi", "label.svelte-1y9hivi{white-space:nowrap}.btn-sm.svelte-1y9hivi{width:100px}.voting-status.svelte-1y9hivi{width:1.5em;color:green}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0dGluZ3Muc3ZlbHRlIiwic291cmNlcyI6WyJTZXR0aW5ncy5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbmltcG9ydCB7IGF1dG9SZXZlYWwsIGRlY2ssIGRlY2tzLCBpc1JldmVhbGVkLCBjbGVhclZvdGVzLCByZXZlYWxWb3Rlcywgdm90aW5nQ29tcGxldGUgfSBmcm9tICcuL3N0b3Jlcy5qcyc7XG48L3NjcmlwdD5cblxuPGRpdiBjbGFzcz1cImQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIG0tM1wiPlxuICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtXCIgcm9sZT1cImdyb3VwXCIgYXJpYS1sYWJlbD1cIkNoYW5nZSBkZWNrXCI+XG4gICAgICAgIHsjZWFjaCAkZGVja3MgYXMgW3ZhbHVlLCBsYWJlbF19XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPVwicmFkaW9cIlxuICAgICAgICAgICAgICAgIGNsYXNzPVwiYnRuLWNoZWNrXCJcbiAgICAgICAgICAgICAgICB7dmFsdWV9XG4gICAgICAgICAgICAgICAgYmluZDpncm91cD17JGRlY2t9XG4gICAgICAgICAgICAgICAgYXV0b2NvbXBsZXRlPVwib2ZmXCJcbiAgICAgICAgICAgICAgICBpZD1cImRlY2ste3ZhbHVlfVwiXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyEkaXNSZXZlYWxlZH0gLz5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImJ0biBidG4tb3V0bGluZS1wcmltYXJ5XCIgZm9yPVwiZGVjay17dmFsdWV9XCI+IHtsYWJlbH08L2xhYmVsPlxuICAgICAgICB7L2VhY2h9XG4gICAgPC9kaXY+XG4gICAgJm5ic3A7XG5cbiAgICB7I2lmICEkYXV0b1JldmVhbH1cbiAgICAgICAgeyNpZiAhJGlzUmV2ZWFsZWQgJiYgJHZvdGluZ0NvbXBsZXRlfVxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInZvdGluZy1zdGF0dXNcIiB0aXRsZT1cIlZvdGluZyBjb21wbGV0ZVwiPuKckzwvZGl2PlxuICAgICAgICB7OmVsc2V9XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidm90aW5nLXN0YXR1c1wiIHRpdGxlPVwiVm90aW5nIGluIHByb2dyZXNzXCI+fjwvZGl2PlxuICAgICAgICB7L2lmfVxuICAgIHsvaWZ9XG4gICAgeyNpZiAkaXNSZXZlYWxlZH1cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc20gYnRuLXdhcm5pbmdcIiBvbjpjbGljaz17Y2xlYXJWb3Rlc30+Q2xlYXI8L2J1dHRvbj5cbiAgICB7OmVsc2V9XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXNtIGJ0bi1zdWNjZXNzXCIgb246Y2xpY2s9e3JldmVhbFZvdGVzfT5SZXZlYWw8L2J1dHRvbj5cbiAgICB7L2lmfVxuXG4gICAgPGRpdiBjbGFzcz1cImZvcm0tY2hlY2sgZm9ybS1zd2l0Y2ggbXQtMSBtcy0zXCI+XG4gICAgICAgIDxsYWJlbCBmb3I9XCJhdXRvUmV2ZWFsXCI+QXV0byByZXZlYWw8L2xhYmVsPlxuICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgYmluZDpjaGVja2VkPXskYXV0b1JldmVhbH0gY2xhc3M9XCJmb3JtLWNoZWNrLWlucHV0XCIgaWQ9XCJhdXRvUmV2ZWFsXCIgLz5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuXG48c3R5bGU+XG5sYWJlbCB7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbn1cbi5idG4tc20ge1xuICAgIHdpZHRoOiAxMDBweDtcbn1cbi52b3Rpbmctc3RhdHVzIHtcbiAgICB3aWR0aDogMS41ZW07XG4gICAgY29sb3I6IGdyZWVuO1xufVxuPC9zdHlsZT5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUF3Q0Esb0JBQU0sQ0FDRixXQUFXLENBQUUsTUFDakIsQ0FDQSxzQkFBUSxDQUNKLEtBQUssQ0FBRSxLQUNYLENBQ0EsNkJBQWUsQ0FDWCxLQUFLLENBQUUsS0FBSyxDQUNaLEtBQUssQ0FBRSxLQUNYIn0= */");
}

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i][0];
	child_ctx[9] = list[i][1];
	return child_ctx;
}

// (7:8) {#each $decks as [value, label]}
function create_each_block$1(ctx) {
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
			add_location(input, file$1, 7, 12, 308);
			attr_dev(label_1, "class", "btn btn-outline-primary svelte-1y9hivi");
			attr_dev(label_1, "for", label_1_for_value = "deck-" + /*value*/ ctx[8]);
			add_location(label_1, file$1, 15, 12, 561);
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
		id: create_each_block$1.name,
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
			add_location(div, file$1, 24, 12, 843);
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
			add_location(div, file$1, 22, 12, 756);
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
function create_else_block$2(ctx) {
	let button;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			button = element("button");
			button.textContent = "Reveal";
			attr_dev(button, "class", "btn btn-sm btn-success svelte-1y9hivi");
			add_location(button, file$1, 30, 8, 1055);
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
		id: create_else_block$2.name,
		type: "else",
		source: "(30:4) {:else}",
		ctx
	});

	return block;
}

// (28:4) {#if $isRevealed}
function create_if_block$2(ctx) {
	let button;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			button = element("button");
			button.textContent = "Clear";
			attr_dev(button, "class", "btn btn-sm btn-warning svelte-1y9hivi");
			add_location(button, file$1, 28, 8, 959);
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
		id: create_if_block$2.name,
		type: "if",
		source: "(28:4) {#if $isRevealed}",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
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
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	let if_block0 = !/*$autoReveal*/ ctx[3] && create_if_block_1$1(ctx);

	function select_block_type_1(ctx, dirty) {
		if (/*$isRevealed*/ ctx[1]) return create_if_block$2;
		return create_else_block$2;
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
			add_location(div0, file$1, 5, 4, 180);
			attr_dev(label_1, "for", "autoReveal");
			attr_dev(label_1, "class", "svelte-1y9hivi");
			add_location(label_1, file$1, 34, 8, 1203);
			attr_dev(input, "type", "checkbox");
			attr_dev(input, "class", "form-check-input");
			attr_dev(input, "id", "autoReveal");
			add_location(input, file$1, 35, 8, 1255);
			attr_dev(div1, "class", "form-check form-switch mt-1 ms-3");
			add_location(div1, file$1, 33, 4, 1148);
			attr_dev(div2, "class", "d-flex justify-content-center m-3");
			add_location(div2, file$1, 4, 0, 128);
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
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
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
		id: create_fragment$2.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$2($$self, $$props, $$invalidate) {
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
		init$1(this, options, instance$2, create_fragment$2, safe_not_equal, {}, add_css$1);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Settings",
			options,
			id: create_fragment$2.name
		});
	}
}

/* js/Voting.svelte generated by Svelte v4.2.3 */

const file = "js/Voting.svelte";

function add_css(target) {
	append_styles(target, "svelte-142q46i", ".participants.svelte-142q46i{width:calc(var(--radius) * 1.98);height:var(--radius);border-radius:var(--radius) var(--radius) 0.75vw 0.75vw;background:radial-gradient(circle at bottom, #3e803f 0%, #093d15 58%, #743f11 58.5%, #f0a25c);position:relative;margin:4vh auto}.controls.svelte-142q46i{position:absolute;bottom:0;left:50%;transform:translateX(-50%)}button.selected.svelte-142q46i{font-weight:bold;margin:-8px 0 8px 0 !important;transition:margin 100ms ease-in-out 100ms,\n        font-weight 100ms ease-out 100ms}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVm90aW5nLnN2ZWx0ZSIsInNvdXJjZXMiOlsiVm90aW5nLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxuaW1wb3J0IHsgb25Nb3VudCB9IGZyb20gJ3N2ZWx0ZSc7XG5cbmltcG9ydCBDYXJkIGZyb20gJy4vQ2FyZC5zdmVsdGUnO1xuaW1wb3J0IERlYnVnIGZyb20gJy4vRGVidWcuc3ZlbHRlJztcbmltcG9ydCBIaXN0b3J5IGZyb20gJy4vSGlzdG9yeS5zdmVsdGUnO1xuaW1wb3J0IFBhcnRpY2lwYW50IGZyb20gJy4vUGFydGljaXBhbnQuc3ZlbHRlJztcbmltcG9ydCBTZXR0aW5ncyBmcm9tICcuL1NldHRpbmdzLnN2ZWx0ZSc7XG5pbXBvcnQge1xuICAgIGNob2ljZXMsXG4gICAgY29ubmVjdCxcbiAgICBlcnJvcixcbiAgICBpc1JldmVhbGVkLFxuICAgIHBhcnRpY2lwYW50cyxcbiAgICB1cGRhdGUsXG4gICAgdXNlcixcbiAgICBjYXN0Vm90ZSxcbiAgICB2b3RlcyxcbiAgICBpY29uLFxuICAgIHJldmVhbENvdW50LFxufSBmcm9tICcuL3N0b3Jlcy5qcyc7XG5pbXBvcnQgU3VtbWFyeSBmcm9tICcuL1N1bW1hcnkuc3ZlbHRlJztcbmltcG9ydCB7IGpzb25TY3JpcHRDb250ZW50cywgY2hhbmdlRmF2aWNvbiwgcHNldWRvUmFuZG9tR2VuZXJhdG9yIH0gZnJvbSAnLi91dGlscy5qcyc7XG5cbmxldCBkZWJ1Z09uID0gZmFsc2U7XG5vbk1vdW50KCgpID0+IHtcbiAgICBjb25uZWN0KGpzb25TY3JpcHRDb250ZW50cygnd2Vic29ja2V0X3VybCcpKTtcbiAgICBkZWJ1Z09uID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKS5nZXQoJ2RlYnVnJyk7XG59KTtcbiQ6IGNoYW5nZUZhdmljb24oJGljb24pO1xuXG5sZXQgcmFuZG9tO1xuJDoge1xuICAgIHJhbmRvbSA9IHBzZXVkb1JhbmRvbUdlbmVyYXRvcigkcmV2ZWFsQ291bnQsIC0zLCAzKTtcbn1cblxuY29uc3QgcmFkaXVzID0gNDU7XG48L3NjcmlwdD5cblxueyNpZiAkZXJyb3J9XG4gICAgPGRpdiBjbGFzcz1cImZpeGVkLXRvcFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtZGFuZ2VyXCIgcm9sZT1cImFsZXJ0XCI+eyRlcnJvcn08L2Rpdj5cbiAgICA8L2Rpdj5cbnsvaWZ9XG5cbjxkaXYgY2xhc3M9XCJwYXJ0aWNpcGFudHNcIiBzdHlsZT1cIi0tcmFkaXVzOiB7cmFkaXVzfXZ3XCI+XG4gICAgeyNlYWNoICRwYXJ0aWNpcGFudHMgYXMgdXNlciwgaSAodXNlci5pZCl9XG4gICAgICAgIDxQYXJ0aWNpcGFudFxuICAgICAgICAgICAgaXNSZXZlYWxlZD17JGlzUmV2ZWFsZWR9XG4gICAgICAgICAgICB7dXNlcn1cbiAgICAgICAgICAgIHtpfVxuICAgICAgICAgICAgY291bnQ9eyRwYXJ0aWNpcGFudHMubGVuZ3RofVxuICAgICAgICAgICAgcmFkaXVzPVwie3JhZGl1cyAqIDAuOTR9dndcIlxuICAgICAgICAgICAgcm90YXRpb249e3JhbmRvbSgpfSAvPlxuICAgIHsvZWFjaH1cbiAgICB7I2lmICRpc1JldmVhbGVkfVxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29udHJvbHNcIj5cbiAgICAgICAgICAgIDxTdW1tYXJ5IHZvdGVzPXskdm90ZXN9IHN0eWxlPVwiY29sb3I6IHdoaXRlO1wiIGNsYXNzPVwicC0yIG1iLTIgdGV4dC1jZW50ZXIgcm91bmRlZFwiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgIHsvaWZ9XG48L2Rpdj5cbjxkaXYgY2xhc3M9XCJjb250YWluZXIgdGV4dC1jZW50ZXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2xcIj5cbiAgICAgICAgICAgIHsjaWYgJHVzZXIuaXNfc3BlY3RhdG9yfVxuICAgICAgICAgICAgICAgIFlvdSBqb2luZWQgYXMgc3BlY3RhdG9yLjxiciAvPlxuICAgICAgICAgICAgICAgIEkgd2FudCB0b1xuICAgICAgICAgICAgICAgIDxidXR0b24gb246Y2xpY2s9eygpID0+IHVwZGF0ZSgnc2V0dGluZ3MnLCB7IGlzX3NwZWN0YXRvcjogZmFsc2UgfSl9IGNsYXNzPVwiYnRuIGJ0bi1saWdodCBidG4tc21cIj5cbiAgICAgICAgICAgICAgICAgICAgYmVjb21lIGEgdm90ZXJcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIHs6ZWxzZX1cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgeyNlYWNoICRjaG9pY2VzIGFzIGNob2ljZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjpjbGljaz17Y2FzdFZvdGUoY2hvaWNlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbjprZXlwcmVzcz17Y2FzdFZvdGUoY2hvaWNlKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17JGlzUmV2ZWFsZWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJidG4gbS0wIHAtMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6c2VsZWN0ZWQ9e2Nob2ljZSA9PSAkdXNlci52b3RlfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q2FyZCBjb2xvcj17JGlzUmV2ZWFsZWQgPyAnI2VlZScgOiBudWxsfSByb3RhdGlvbj17cmFuZG9tKCl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Y2hvaWNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQ2FyZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICB7L2VhY2h9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7L2lmfVxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgIDxTZXR0aW5ncyAvPlxuICAgIDwvZGl2PlxuPC9kaXY+XG5cbnsjaWYgZGVidWdPbn1cbiAgICA8RGVidWcgLz5cbnsvaWZ9XG5cbjxkaXYgY2xhc3M9XCJteS01XCI+Jm5ic3A7PC9kaXY+XG5cbjxkaXYgY2xhc3M9XCJmaXhlZC1ib3R0b20gYmctd2hpdGVcIiBzdHlsZT1cImJvcmRlci10b3A6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMTI1KTtcIj5cbiAgICA8SGlzdG9yeSAvPlxuPC9kaXY+XG5cbjxzdHlsZT5cbi5wYXJ0aWNpcGFudHMge1xuICAgIHdpZHRoOiBjYWxjKHZhcigtLXJhZGl1cykgKiAxLjk4KTtcbiAgICBoZWlnaHQ6IHZhcigtLXJhZGl1cyk7XG4gICAgYm9yZGVyLXJhZGl1czogdmFyKC0tcmFkaXVzKSB2YXIoLS1yYWRpdXMpIDAuNzV2dyAwLjc1dnc7XG4gICAgYmFja2dyb3VuZDogcmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCBib3R0b20sICMzZTgwM2YgMCUsICMwOTNkMTUgNTglLCAjNzQzZjExIDU4LjUlLCAjZjBhMjVjKTtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgbWFyZ2luOiA0dmggYXV0bztcbn1cbi5jb250cm9scyB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIGJvdHRvbTogMDtcbiAgICBsZWZ0OiA1MCU7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpO1xufVxuYnV0dG9uLnNlbGVjdGVkIHtcbiAgICBmb250LXdlaWdodDogYm9sZDtcbiAgICBtYXJnaW46IC04cHggMCA4cHggMCAhaW1wb3J0YW50O1xuICAgIHRyYW5zaXRpb246XG4gICAgICAgIG1hcmdpbiAxMDBtcyBlYXNlLWluLW91dCAxMDBtcyxcbiAgICAgICAgZm9udC13ZWlnaHQgMTAwbXMgZWFzZS1vdXQgMTAwbXM7XG59XG48L3N0eWxlPlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXdHQSw0QkFBYyxDQUNWLEtBQUssQ0FBRSxLQUFLLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUNqQyxNQUFNLENBQUUsSUFBSSxRQUFRLENBQUMsQ0FDckIsYUFBYSxDQUFFLElBQUksUUFBUSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUN4RCxVQUFVLENBQUUsZ0JBQWdCLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQzlGLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLE1BQU0sQ0FBRSxHQUFHLENBQUMsSUFDaEIsQ0FDQSx3QkFBVSxDQUNOLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLE1BQU0sQ0FBRSxDQUFDLENBQ1QsSUFBSSxDQUFFLEdBQUcsQ0FDVCxTQUFTLENBQUUsV0FBVyxJQUFJLENBQzlCLENBQ0EsTUFBTSx3QkFBVSxDQUNaLFdBQVcsQ0FBRSxJQUFJLENBQ2pCLE1BQU0sQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUMvQixVQUFVLENBQ04sTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO0FBQ3ZDLFFBQVEsV0FBVyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FDbkMifQ== */");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[11] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[14] = list[i];
	child_ctx[16] = i;
	return child_ctx;
}

// (40:0) {#if $error}
function create_if_block_3(ctx) {
	let div1;
	let div0;
	let t;

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			t = text(/*$error*/ ctx[2]);
			attr_dev(div0, "class", "alert alert-danger");
			attr_dev(div0, "role", "alert");
			add_location(div0, file, 41, 8, 893);
			attr_dev(div1, "class", "fixed-top");
			add_location(div1, file, 40, 4, 861);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$error*/ 4) set_data_dev(t, /*$error*/ ctx[2]);
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
		source: "(40:0) {#if $error}",
		ctx
	});

	return block;
}

// (47:4) {#each $participants as user, i (user.id)}
function create_each_block_1(key_1, ctx) {
	let first;
	let participant;
	let current;

	participant = new Participant({
			props: {
				isRevealed: /*$isRevealed*/ ctx[4],
				user: /*user*/ ctx[14],
				i: /*i*/ ctx[16],
				count: /*$participants*/ ctx[3].length,
				radius: "" + (radius * 0.94 + "vw"),
				rotation: /*random*/ ctx[1]()
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
			if (dirty & /*$isRevealed*/ 16) participant_changes.isRevealed = /*$isRevealed*/ ctx[4];
			if (dirty & /*$participants*/ 8) participant_changes.user = /*user*/ ctx[14];
			if (dirty & /*$participants*/ 8) participant_changes.i = /*i*/ ctx[16];
			if (dirty & /*$participants*/ 8) participant_changes.count = /*$participants*/ ctx[3].length;
			if (dirty & /*random*/ 2) participant_changes.rotation = /*random*/ ctx[1]();
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
		source: "(47:4) {#each $participants as user, i (user.id)}",
		ctx
	});

	return block;
}

// (56:4) {#if $isRevealed}
function create_if_block_2(ctx) {
	let div;
	let summary;
	let current;

	summary = new Summary({
			props: {
				votes: /*$votes*/ ctx[5],
				style: "color: white;",
				class: "p-2 mb-2 text-center rounded"
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(summary.$$.fragment);
			attr_dev(div, "class", "controls svelte-142q46i");
			add_location(div, file, 56, 8, 1324);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(summary, div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const summary_changes = {};
			if (dirty & /*$votes*/ 32) summary_changes.votes = /*$votes*/ ctx[5];
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
		source: "(56:4) {#if $isRevealed}",
		ctx
	});

	return block;
}

// (71:12) {:else}
function create_else_block$1(ctx) {
	let div;
	let current;
	let each_value = ensure_array_like_dev(/*$choices*/ ctx[7]);
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
			add_location(div, file, 71, 16, 1883);
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
			if (dirty & /*$isRevealed, $choices, $user, random*/ 210) {
				each_value = ensure_array_like_dev(/*$choices*/ ctx[7]);
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
		source: "(71:12) {:else}",
		ctx
	});

	return block;
}

// (65:12) {#if $user.is_spectator}
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
			add_location(br, file, 65, 40, 1638);
			attr_dev(button, "class", "btn btn-light btn-sm");
			add_location(button, file, 67, 16, 1687);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, br, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, button, anchor);

			if (!mounted) {
				dispose = listen_dev(button, "click", /*click_handler*/ ctx[10], false, false, false, false);
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
		source: "(65:12) {#if $user.is_spectator}",
		ctx
	});

	return block;
}

// (80:28) <Card color={$isRevealed ? '#eee' : null} rotation={random()}>
function create_default_slot(ctx) {
	let t_value = /*choice*/ ctx[11] + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$choices*/ 128 && t_value !== (t_value = /*choice*/ ctx[11] + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(t);
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(80:28) <Card color={$isRevealed ? '#eee' : null} rotation={random()}>",
		ctx
	});

	return block;
}

// (73:20) {#each $choices as choice}
function create_each_block(ctx) {
	let button;
	let card;
	let t;
	let current;
	let mounted;
	let dispose;

	card = new Card({
			props: {
				color: /*$isRevealed*/ ctx[4] ? '#eee' : null,
				rotation: /*random*/ ctx[1](),
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			button = element("button");
			create_component(card.$$.fragment);
			t = space();
			button.disabled = /*$isRevealed*/ ctx[4];
			attr_dev(button, "class", "btn m-0 p-0 svelte-142q46i");
			toggle_class(button, "selected", /*choice*/ ctx[11] == /*$user*/ ctx[6].vote);
			add_location(button, file, 73, 24, 1998);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);
			mount_component(card, button, null);
			append_dev(button, t);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(
						button,
						"click",
						function () {
							if (is_function(castVote(/*choice*/ ctx[11]))) castVote(/*choice*/ ctx[11]).apply(this, arguments);
						},
						false,
						false,
						false,
						false
					),
					listen_dev(
						button,
						"keypress",
						function () {
							if (is_function(castVote(/*choice*/ ctx[11]))) castVote(/*choice*/ ctx[11]).apply(this, arguments);
						},
						false,
						false,
						false,
						false
					)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			const card_changes = {};
			if (dirty & /*$isRevealed*/ 16) card_changes.color = /*$isRevealed*/ ctx[4] ? '#eee' : null;
			if (dirty & /*random*/ 2) card_changes.rotation = /*random*/ ctx[1]();

			if (dirty & /*$$scope, $choices*/ 131200) {
				card_changes.$$scope = { dirty, ctx };
			}

			card.$set(card_changes);

			if (!current || dirty & /*$isRevealed*/ 16) {
				prop_dev(button, "disabled", /*$isRevealed*/ ctx[4]);
			}

			if (!current || dirty & /*$choices, $user*/ 192) {
				toggle_class(button, "selected", /*choice*/ ctx[11] == /*$user*/ ctx[6].vote);
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
				detach_dev(button);
			}

			destroy_component(card);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(73:20) {#each $choices as choice}",
		ctx
	});

	return block;
}

// (94:0) {#if debugOn}
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
		source: "(94:0) {#if debugOn}",
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
	let t5;
	let div5;
	let t7;
	let div6;
	let history;
	let current;
	let if_block0 = /*$error*/ ctx[2] && create_if_block_3(ctx);
	let each_value_1 = ensure_array_like_dev(/*$participants*/ ctx[3]);
	const get_key = ctx => /*user*/ ctx[14].id;
	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

	for (let i = 0; i < each_value_1.length; i += 1) {
		let child_ctx = get_each_context_1(ctx, each_value_1, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
	}

	let if_block1 = /*$isRevealed*/ ctx[4] && create_if_block_2(ctx);
	const if_block_creators = [create_if_block_1, create_else_block$1];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*$user*/ ctx[6].is_spectator) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	settings = new Settings({ $$inline: true });
	let if_block3 = /*debugOn*/ ctx[0] && create_if_block$1(ctx);
	history = new History({ $$inline: true });

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
			t5 = space();
			div5 = element("div");
			div5.textContent = " ";
			t7 = space();
			div6 = element("div");
			create_component(history.$$.fragment);
			attr_dev(div0, "class", "participants svelte-142q46i");
			set_style(div0, "--radius", radius + "vw");
			add_location(div0, file, 45, 0, 971);
			attr_dev(div1, "class", "col");
			add_location(div1, file, 63, 8, 1543);
			attr_dev(div2, "class", "row");
			add_location(div2, file, 62, 4, 1517);
			attr_dev(div3, "class", "row");
			add_location(div3, file, 88, 4, 2588);
			attr_dev(div4, "class", "container text-center");
			add_location(div4, file, 61, 0, 1477);
			attr_dev(div5, "class", "my-5");
			add_location(div5, file, 97, 0, 2681);
			attr_dev(div6, "class", "fixed-bottom bg-white");
			set_style(div6, "border-top", "1px solid rgba(0, 0, 0, 0.125)");
			add_location(div6, file, 99, 0, 2713);
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
			insert_dev(target, t5, anchor);
			insert_dev(target, div5, anchor);
			insert_dev(target, t7, anchor);
			insert_dev(target, div6, anchor);
			mount_component(history, div6, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*$error*/ ctx[2]) {
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

			if (dirty & /*$isRevealed, $participants, radius, random*/ 26) {
				each_value_1 = ensure_array_like_dev(/*$participants*/ ctx[3]);
				group_outros();
				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div0, outro_and_destroy_block, create_each_block_1, t1, get_each_context_1);
				check_outros();
			}

			if (/*$isRevealed*/ ctx[4]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty & /*$isRevealed*/ 16) {
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
					if_block3.m(t5.parentNode, t5);
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
			transition_in(history.$$.fragment, local);
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
			transition_out(history.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(t0);
				detach_dev(div0);
				detach_dev(t2);
				detach_dev(div4);
				detach_dev(t4);
				detach_dev(t5);
				detach_dev(div5);
				detach_dev(t7);
				detach_dev(div6);
			}

			if (if_block0) if_block0.d(detaching);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			if (if_block1) if_block1.d();
			if_blocks[current_block_type_index].d();
			destroy_component(settings);
			if (if_block3) if_block3.d(detaching);
			destroy_component(history);
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

const radius = 45;

function instance$1($$self, $$props, $$invalidate) {
	let $revealCount;
	let $icon;
	let $error;
	let $participants;
	let $isRevealed;
	let $votes;
	let $user;
	let $choices;
	validate_store(revealCount, 'revealCount');
	component_subscribe($$self, revealCount, $$value => $$invalidate(8, $revealCount = $$value));
	validate_store(icon, 'icon');
	component_subscribe($$self, icon, $$value => $$invalidate(9, $icon = $$value));
	validate_store(error, 'error');
	component_subscribe($$self, error, $$value => $$invalidate(2, $error = $$value));
	validate_store(participants, 'participants');
	component_subscribe($$self, participants, $$value => $$invalidate(3, $participants = $$value));
	validate_store(isRevealed, 'isRevealed');
	component_subscribe($$self, isRevealed, $$value => $$invalidate(4, $isRevealed = $$value));
	validate_store(votes, 'votes');
	component_subscribe($$self, votes, $$value => $$invalidate(5, $votes = $$value));
	validate_store(user, 'user');
	component_subscribe($$self, user, $$value => $$invalidate(6, $user = $$value));
	validate_store(choices, 'choices');
	component_subscribe($$self, choices, $$value => $$invalidate(7, $choices = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Voting', slots, []);
	let debugOn = false;

	onMount(() => {
		connect(jsonScriptContents('websocket_url'));
		$$invalidate(0, debugOn = new URLSearchParams(window.location.search).get('debug'));
	});

	let random;
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Voting> was created with unknown prop '${key}'`);
	});

	const click_handler = () => update('settings', { is_spectator: false });

	$$self.$capture_state = () => ({
		onMount,
		Card,
		Debug,
		History,
		Participant,
		Settings,
		choices,
		connect,
		error,
		isRevealed,
		participants,
		update,
		user,
		castVote,
		votes,
		icon,
		revealCount,
		Summary,
		jsonScriptContents,
		changeFavicon,
		pseudoRandomGenerator,
		debugOn,
		random,
		radius,
		$revealCount,
		$icon,
		$error,
		$participants,
		$isRevealed,
		$votes,
		$user,
		$choices
	});

	$$self.$inject_state = $$props => {
		if ('debugOn' in $$props) $$invalidate(0, debugOn = $$props.debugOn);
		if ('random' in $$props) $$invalidate(1, random = $$props.random);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$icon*/ 512) {
			changeFavicon($icon);
		}

		if ($$self.$$.dirty & /*$revealCount*/ 256) {
			{
				$$invalidate(1, random = pseudoRandomGenerator($revealCount, -3, 3));
			}
		}
	};

	return [
		debugOn,
		random,
		$error,
		$participants,
		$isRevealed,
		$votes,
		$user,
		$choices,
		$revealCount,
		$icon,
		click_handler
	];
}

class Voting extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$1, create_fragment$1, safe_not_equal, {}, add_css);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Voting",
			options,
			id: create_fragment$1.name
		});
	}
}

/* js/App.svelte generated by Svelte v4.2.3 */

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
