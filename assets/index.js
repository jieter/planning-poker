
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
'use strict';

function noop() { }
function assign$1(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
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
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== 'function') {
        throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
    let value;
    subscribe(store, _ => value = _)();
    return value;
}
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
    return definition[1] && fn
        ? assign$1($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
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
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}
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
function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}
function set_style(node, key, value, important) {
    if (value === null) {
        node.style.removeProperty(key);
    }
    else {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, bubbles, cancelable, detail);
    return e;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs#run-time-svelte-onmount
 */
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        // @ts-ignore
        callbacks.slice().forEach(fn => fn.call(this, event));
    }
}

const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
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
                update(component.$$);
            }
        }
        catch (e) {
            // reset dirty state to not end up in a deadlocked state and then rethrow
            dirty_components.length = 0;
            flushidx = 0;
            throw e;
        }
        set_current_component(null);
        dirty_components.length = 0;
        flushidx = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
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
function update($$) {
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
 */
function flush_render_callbacks(fns) {
    const filtered = [];
    const targets = [];
    render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
    targets.forEach((c) => c());
    render_callbacks = filtered;
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
    else if (callback) {
        callback();
    }
}
function outro_and_destroy_block(block, lookup) {
    transition_out(block, 1, 1, () => {
        lookup.delete(block.key);
    });
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
        old_indexes[old_blocks[i].key] = i;
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
        }
        else if (dynamic) {
            // defer updates until all the DOM shuffling is done
            updates.push(() => block.p(child_ctx, dirty));
        }
        new_lookup.set(key, new_blocks[i] = block);
        if (key in old_indexes)
            deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = new Set();
    const did_move = new Set();
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
        }
        else if (!new_lookup.has(old_key)) {
            // remove old block
            destroy(old_block, lookup);
            o--;
        }
        else if (!lookup.has(new_key) || will_move.has(new_key)) {
            insert(new_block);
        }
        else if (did_move.has(old_key)) {
            o--;
        }
        else if (deltas.get(new_key) > deltas.get(old_key)) {
            did_move.add(new_key);
            insert(new_block);
        }
        else {
            will_move.add(old_key);
            o--;
        }
    }
    while (o--) {
        const old_block = old_blocks[o];
        if (!new_lookup.has(old_block.key))
            destroy(old_block, lookup);
    }
    while (n)
        insert(new_blocks[n - 1]);
    run_all(updates);
    return new_blocks;
}
function validate_each_keys(ctx, list, get_context, get_key) {
    const keys = new Set();
    for (let i = 0; i < list.length; i++) {
        const key = get_key(get_context(ctx, list, i));
        if (keys.has(key)) {
            throw new Error('Cannot have duplicate keys in a keyed each');
        }
        keys.add(key);
    }
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
            // if the component was destroyed immediately
            // it will update the `$$.on_destroy` reference to `null`.
            // the destructured on_destroy may still reference to the old array
            if (component.$$.on_destroy) {
                component.$$.on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
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
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init$1(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
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
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
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
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        if (!is_function(callback)) {
            return noop;
        }
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.56.0' }, detail), { bubbles: true }));
}
function append_dev(target, node) {
    dispatch_dev('SvelteDOMInsert', { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev('SvelteDOMInsert', { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev('SvelteDOMRemove', { node });
    detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
    const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    if (has_stop_immediate_propagation)
        modifiers.push('stopImmediatePropagation');
    dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
    else
        dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
}
function prop_dev(node, property, value) {
    node[property] = value;
    dispatch_dev('SvelteDOMSetProperty', { node, property, value });
}
function set_data_dev(text, data) {
    data = '' + data;
    if (text.wholeText === data)
        return;
    dispatch_dev('SvelteDOMSetData', { node: text, data });
    text.data = data;
}
function validate_each_argument(arg) {
    if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
        let msg = '{#each} only iterates over array-like objects.';
        if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
            msg += ' You can use a spread to convert this iterable into an array.';
        }
        throw new Error(msg);
    }
}
function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
        if (!~keys.indexOf(slot_key)) {
            console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
        }
    }
}
/**
 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
 */
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error("'target' is a required option");
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn('Component was already destroyed'); // eslint-disable-line no-console
        };
    }
    $capture_state() { }
    $inject_state() { }
}

/*! js-cookie v3.0.1 | MIT */
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
  function set (key, value, attributes) {
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

    key = encodeURIComponent(key)
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
      key + '=' + converter.write(value, key) + stringifiedAttributes)
  }

  function get (key) {
    if (typeof document === 'undefined' || (arguments.length && !key)) {
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
        var foundKey = decodeURIComponent(parts[0]);
        jar[foundKey] = converter.read(value, foundKey);

        if (key === foundKey) {
          break
        }
      } catch (e) {}
    }

    return key ? jar[key] : jar
  }

  return Object.create(
    {
      set: set,
      get: get,
      remove: function (key, attributes) {
        set(
          key,
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

/* js/Join.svelte generated by Svelte v3.56.0 */
const file$4 = "js/Join.svelte";

// (39:12) {#if error}
function create_if_block$3(ctx) {
	let div;
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text(/*error*/ ctx[0]);
			attr_dev(div, "class", "invalid-feedback");
			add_location(div, file$4, 39, 16, 911);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*error*/ 1) set_data_dev(t, /*error*/ ctx[0]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$3.name,
		type: "if",
		source: "(39:12) {#if error}",
		ctx
	});

	return block;
}

function create_fragment$4(ctx) {
	let form;
	let div2;
	let input0;
	let t0;
	let div0;
	let input1;
	let t1;
	let t2;
	let div1;
	let input2;
	let t3;
	let div3;
	let label;
	let input3;
	let t4;
	let mounted;
	let dispose;
	let if_block = /*error*/ ctx[0] && create_if_block$3(ctx);

	const block = {
		c: function create() {
			form = element("form");
			div2 = element("div");
			input0 = element("input");
			t0 = space();
			div0 = element("div");
			input1 = element("input");
			t1 = space();
			if (if_block) if_block.c();
			t2 = space();
			div1 = element("div");
			input2 = element("input");
			t3 = space();
			div3 = element("div");
			label = element("label");
			input3 = element("input");
			t4 = text(" Join as a spectator 👁️");
			attr_dev(input0, "type", "hidden");
			attr_dev(input0, "name", "csrfmiddlewaretoken");
			input0.value = csrfToken();
			add_location(input0, file$4, 29, 8, 549);
			attr_dev(input1, "type", "text");
			attr_dev(input1, "name", "name");
			attr_dev(input1, "class", "form-control");
			toggle_class(input1, "is-invalid", /*error*/ ctx[0]);
			add_location(input1, file$4, 31, 12, 658);
			attr_dev(div0, "class", "col");
			add_location(div0, file$4, 30, 8, 628);
			attr_dev(input2, "type", "submit");
			attr_dev(input2, "class", "btn btn-primary");
			input2.value = "Join";
			add_location(input2, file$4, 43, 12, 1026);
			attr_dev(div1, "class", "col");
			add_location(div1, file$4, 42, 8, 996);
			attr_dev(div2, "class", "row row-cols-lg-auto");
			add_location(div2, file$4, 28, 4, 506);
			attr_dev(input3, "type", "checkbox");
			attr_dev(input3, "name", "is_spectator");
			add_location(input3, file$4, 47, 27, 1162);
			attr_dev(label, "class", "col");
			add_location(label, file$4, 47, 8, 1143);
			attr_dev(div3, "class", "row");
			add_location(div3, file$4, 46, 4, 1117);
			attr_dev(form, "method", "post");
			add_location(form, file$4, 27, 0, 481);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, form, anchor);
			append_dev(form, div2);
			append_dev(div2, input0);
			append_dev(div2, t0);
			append_dev(div2, div0);
			append_dev(div0, input1);
			set_input_value(input1, /*name*/ ctx[1]);
			append_dev(div0, t1);
			if (if_block) if_block.m(div0, null);
			append_dev(div2, t2);
			append_dev(div2, div1);
			append_dev(div1, input2);
			append_dev(form, t3);
			append_dev(form, div3);
			append_dev(div3, label);
			append_dev(label, input3);
			append_dev(label, t4);

			if (!mounted) {
				dispose = [
					listen_dev(input1, "change", /*update*/ ctx[2], false, false, false, false),
					listen_dev(input1, "input", /*input1_input_handler*/ ctx[3])
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*name*/ 2 && input1.value !== /*name*/ ctx[1]) {
				set_input_value(input1, /*name*/ ctx[1]);
			}

			if (dirty & /*error*/ 1) {
				toggle_class(input1, "is-invalid", /*error*/ ctx[0]);
			}

			if (/*error*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$3(ctx);
					if_block.c();
					if_block.m(div0, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(form);
			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
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
	validate_slots('Join', slots, []);
	let error;

	// Screen name in the poker session
	let name = '';

	onMount(() => {
		const previousName = window.localStorage.getItem('name');

		if (previousName) {
			$$invalidate(1, name = previousName);
		}
	});

	const update = () => {
		if (name) {
			window.localStorage.setItem('name', name);
			$$invalidate(0, error = undefined);
		} else {
			$$invalidate(0, error = 'Name cannot be empty');
		}
	};

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Join> was created with unknown prop '${key}'`);
	});

	function input1_input_handler() {
		name = this.value;
		$$invalidate(1, name);
	}

	$$self.$capture_state = () => ({ onMount, csrfToken, error, name, update });

	$$self.$inject_state = $$props => {
		if ('error' in $$props) $$invalidate(0, error = $$props.error);
		if ('name' in $$props) $$invalidate(1, name = $$props.name);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [error, name, update, input1_input_handler];
}

class Join extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$4, create_fragment$4, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Join",
			options,
			id: create_fragment$4.name
		});
	}
}

const t=(t,b={})=>{w(b);let{colors:k=["#FFC700","#FF0000","#2E3191","#41BBC7"],duration:W=3500,force:S=.5,particleCount:G=150,particleShape:X="mix",particleSize:_=12,destroyAfterDone:C=!0,stageHeight:z=800,stageWidth:E=1600}=b;!function(t){const e=f("style");e.dataset.neoconfetti="",e.textContent='@keyframes fk9XWG_y-axis{to{transform:translate3d(0,var(--stage-height),0)}}@keyframes fk9XWG_x-axis{to{transform:translate3d(var(--x-landing-point),0,0)}}@keyframes fk9XWG_rotation{50%{transform:rotate3d(var(--half-rotation),180deg)}to{transform:rotate3d(var(--rotation),360deg)}}.fk9XWG_container{width:0;height:0;z-index:1200;position:relative;overflow:visible}.fk9XWG_particle{animation:x-axis var(--duration-chaos)forwards cubic-bezier(var(--x1),var(--x2),var(--x3),var(--x4));animation-name:fk9XWG_x-axis}.fk9XWG_particle>div{animation:y-axis var(--duration-chaos)forwards cubic-bezier(var(--y1),var(--y2),var(--y3),var(--y4));width:var(--width);height:var(--height);animation-name:fk9XWG_y-axis;position:absolute;top:0;left:0}.fk9XWG_particle>div:before{height:100%;width:100%;content:"";background-color:var(--bgcolor);animation:rotation var(--rotation-duration)infinite linear;border-radius:var(--border-radius);animation-name:fk9XWG_rotation;display:block}',h(document.head,e);}(),t.classList.add("fk9XWG_container"),t.style.setProperty("--stage-height",z+"px");let P,A=p(G,k),H=e(t,A);function M(t,e){const f=l(c()*(x-1)),h="rectangles"!==X&&("circles"===X||v(f)),p=(e,r)=>t.style.setProperty(e,r+"");p("--x-landing-point",u(s(m(e,90)-180),0,180,-E/2,E/2)+"px"),p("--duration-chaos",W-l(1e3*c())+"ms");const b=c()<a?g(c()*i,2):0;p("--x1",b),p("--x2",-1*b),p("--x3",b),p("--x4",g(s(u(s(m(e,90)-180),0,180,-1,1)),4)),p("--y1",g(c()*n,4)),p("--y2",g(c()*S*(y()?1:-1),4)),p("--y3",n),p("--y4",g(d(u(s(e-180),0,180,S,-S),0),4)),p("--width",(h?_:l(4*c())+_/2)+"px"),p("--height",(h?_:l(2*c())+_)+"px");const k=f.toString(2).padStart(3,"0").split("");p("--half-rotation",k.map((t=>+t/2+""))),p("--rotation",k),p("--rotation-duration",g(c()*(o-r)+r)+"ms"),p("--border-radius",h?"50%":0);}for(const[t,e]of Object.entries(H))M(e,A[+t].degree);return Promise.resolve().then((()=>P=setTimeout((()=>C&&(t.innerHTML="")),W))),{update(r){w(r);const o=r.particleCount??G,a=r.colors??k,i=r.stageHeight??z;if(A=p(o,a),o===G&&JSON.stringify(k)!==JSON.stringify(a))for(const[t,{color:e}]of Object.entries(A))H[+t].style.setProperty("--bgcolor",e);o!==G&&(t.innerHTML="",H=e(t,A)),C&&!r.destroyAfterDone&&clearTimeout(P),t.style.setProperty("--stage-height",i+"px"),k=a,W=r.duration??W,S=r.force??S,G=o,X=r.particleShape??X,_=r.particleSize??_,C=r.destroyAfterDone??C,z=i,E=r.stageWidth??E;},destroy(){clearTimeout(P);}}};function e(t,e=[]){const r=[];for(const{color:o}of e){const e=f("div");e.className="fk9XWG_particle",e.style.setProperty("--bgcolor",o);const a=f("div");h(e,a),h(t,e),r.push(e);}return r}const r=200,o=800,a=.1,i=.3,n=.5,s=Math.abs,c=Math.random,l=Math.round,d=Math.max,f=t=>document.createElement(t),h=(t,e)=>t.appendChild(e),p=(t,e)=>Array.from({length:t},((r,o)=>({color:e[o%e.length],degree:360*o/t}))),g=(t,e=2)=>l((t+Number.EPSILON)*10**e)/10**e,u=(t,e,r,o,a)=>(t-e)*(a-o)/(r-e)+o,m=(t,e)=>t+e>360?t+e-360:t+e,y=()=>c()>.5,x=6,v=t=>1!==t&&y(),b=t=>void 0===t,k=(t,e)=>{if(!b(t)&&Number.isSafeInteger(t)&&t<0)throw new Error(e+" must be a positive integer")},w=({particleCount:t,duration:e,colors:r,particleSize:o,force:a,stageHeight:i,stageWidth:n,particleShape:s})=>{if(k(t,"particleCount"),k(e,"duration"),k(o,"particleSize"),k(a,"force"),k(i,"stageHeight"),k(n,"stageWidth"),!b(s)&&!/^(mix|circles|rectangles)$/i.test(s))throw new Error('particlesShape should be either "mix" or "circles" or "rectangle"');if(!b(r)&&!Array.isArray(r))throw new Error("colors must be an array of strings");if(a>1)throw new Error("force must be within 0 and 1")};

/* js/Card.svelte generated by Svelte v3.56.0 */

const file$3 = "js/Card.svelte";

function create_fragment$3(ctx) {
	let div;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[3].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

	const block = {
		c: function create() {
			div = element("div");
			if (default_slot) default_slot.c();
			attr_dev(div, "class", "card btn svelte-xiahgm");
			attr_dev(div, "disabled", /*disabled*/ ctx[0]);
			toggle_class(div, "selected", /*selected*/ ctx[1]);
			add_location(div, file$3, 5, 0, 74);
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

			if (!mounted) {
				dispose = [
					listen_dev(div, "click", /*click_handler*/ ctx[4], false, false, false, false),
					listen_dev(div, "keypress", /*keypress_handler*/ ctx[5], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[2],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
						null
					);
				}
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
			if (detaching) detach_dev(div);
			if (default_slot) default_slot.d(detaching);
			mounted = false;
			run_all(dispose);
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
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Card', slots, ['default']);
	let { disabled = true } = $$props;
	let { selected = '' } = $$props;
	const writable_props = ['disabled', 'selected'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
	});

	function click_handler(event) {
		bubble.call(this, $$self, event);
	}

	function keypress_handler(event) {
		bubble.call(this, $$self, event);
	}

	$$self.$$set = $$props => {
		if ('disabled' in $$props) $$invalidate(0, disabled = $$props.disabled);
		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({ disabled, selected });

	$$self.$inject_state = $$props => {
		if ('disabled' in $$props) $$invalidate(0, disabled = $$props.disabled);
		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [disabled, selected, $$scope, slots, click_handler, keypress_handler];
}

class Card extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$3, create_fragment$3, safe_not_equal, { disabled: 0, selected: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Card",
			options,
			id: create_fragment$3.name
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
}

/* js/Participant.svelte generated by Svelte v3.56.0 */
const file$2 = "js/Participant.svelte";

// (26:28)
function create_if_block_1$1(ctx) {
	let if_block_anchor;

	function select_block_type_1(ctx, dirty) {
		if (/*isRevealed*/ ctx[1]) return create_if_block_2$1;
		return create_else_block$2;
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
			if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$1.name,
		type: "if",
		source: "(26:28) ",
		ctx
	});

	return block;
}

// (24:8) {#if user.is_spectator}
function create_if_block$2(ctx) {
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
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$2.name,
		type: "if",
		source: "(24:8) {#if user.is_spectator}",
		ctx
	});

	return block;
}

// (29:12) {:else}
function create_else_block$2(ctx) {
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
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$2.name,
		type: "else",
		source: "(29:12) {:else}",
		ctx
	});

	return block;
}

// (27:12) {#if isRevealed}
function create_if_block_2$1(ctx) {
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
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$1.name,
		type: "if",
		source: "(27:12) {#if isRevealed}",
		ctx
	});

	return block;
}

// (23:4) <Card>
function create_default_slot$1(ctx) {
	let if_block_anchor;

	function select_block_type(ctx, dirty) {
		if (/*user*/ ctx[0].is_spectator) return create_if_block$2;
		if (/*user*/ ctx[0].vote) return create_if_block_1$1;
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
			if (if_block) {
				if_block.d(detaching);
			}

			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$1.name,
		type: "slot",
		source: "(23:4) <Card>",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
	let div;
	let strong;
	let t0_value = /*user*/ ctx[0].name + "";
	let t0;
	let t1;
	let card;
	let current;

	card = new Card({
			props: {
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
			create_component(card.$$.fragment);
			add_location(strong, file$2, 21, 4, 548);
			attr_dev(div, "class", "participant svelte-1s7tb0t");
			set_style(div, "transform", "rotate(" + /*angle*/ ctx[2] + "deg) translate(33vw) rotate(90deg)");
			add_location(div, file$2, 20, 0, 450);
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

			if (dirty & /*$$scope, user, isRevealed*/ 35) {
				card_changes.$$scope = { dirty, ctx };
			}

			card.$set(card_changes);

			if (!current || dirty & /*angle*/ 4) {
				set_style(div, "transform", "rotate(" + /*angle*/ ctx[2] + "deg) translate(33vw) rotate(90deg)");
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
			if (detaching) detach_dev(div);
			destroy_component(card);
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

const maxAngle = 174;

function instance$2($$self, $$props, $$invalidate) {
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
		init$1(this, options, instance$2, create_fragment$2, safe_not_equal, { user: 0, isRevealed: 1, i: 3, count: 4 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Participant",
			options,
			id: create_fragment$2.name
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
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
function readable(value, start) {
    return {
        subscribe: writable(value, start).subscribe
    };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = new Set();
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
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
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.add(subscriber);
        if (subscribers.size === 1) {
            stop = start(set) || noop;
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
function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single
        ? [stores]
        : stores;
    const auto = fn.length < 2;
    return readable(initial_value, (set) => {
        let inited = false;
        const values = [];
        let pending = 0;
        let cleanup = noop;
        const sync = () => {
            if (pending) {
                return;
            }
            cleanup();
            const result = fn(single ? values[0] : values, set);
            if (auto) {
                set(result);
            }
            else {
                cleanup = is_function(result) ? result : noop;
            }
        };
        const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
            values[i] = value;
            pending &= ~(1 << i);
            if (inited) {
                sync();
            }
        }, () => {
            pending |= (1 << i);
        }));
        inited = true;
        sync();
        return function stop() {
            run_all(unsubscribers);
            cleanup();
        };
    });
}

function pokerStores (websocketUrl) {
    const participants = writable([]);
    const choices = writable([]);
    const isRevealed = writable(false);
    const user = writable({});
    const error = writable(undefined);

    // Derive a sorted list of (card, votes)-pairs off of the parcitipants store
    const votes = derived(participants, ($participants) => {
        const _votes = new Proxy({}, { get: (d, key) => (key in d ? d[key] : 0) });
        $participants.forEach((user) => {
            if (user.vote != null) {
                _votes[user.vote] += 1;
            }
        });

        return Object.entries(_votes).sort((a, b) => b[1] - a[1]);
    });

    // Set the vote for the current user to `value`
    const setUserVote = (value) => {
        user.update(($user) => {
            $user.vote = value;
            return $user;
        });
    };

    let socket;
    const connect = () => {
        socket = new WebSocket(websocketUrl);
        socket.onclose = () => {
            error.set('WebSocket connection closed unexpectedly. Trying to reconnect in 2s...');
            setTimeout(() => {
                console.log('Reconnecting...');
                connect();
            }, 2000);
        };

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log('message', data);

            switch (data.type) {
                case 'init':
                    participants.set(data.users);
                    choices.set(data.choices);
                    user.set(data.user);
                    isRevealed.set(data.is_revealed);
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
    };
    connect();

    async function update(action, params = undefined) {
        params = params || {};
        params.action = action;
        console.log('update', params);
        socket.send(JSON.stringify(params));
    }
    const revealVotes = () => update('reveal');
    const clearVotes = () => {
        setUserVote(null);
        update('clear');
    };

    const vote = (value) => () => {
        if (!get_store_value(isRevealed)) {
            update('vote', { value: value });
            setUserVote(value);
        }
    };
    const changeDeck = () => {
        update('change_deck');
    };

    return { participants, isRevealed, user, choices, votes, revealVotes, clearVotes, vote, changeDeck, error };
}

/* js/Voting.svelte generated by Svelte v3.56.0 */
const file$1 = "js/Voting.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[18] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[16] = list[i][0];
	child_ctx[21] = list[i][1];
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[15] = list[i];
	child_ctx[25] = i;
	return child_ctx;
}

// (17:0) {#if $error}
function create_if_block_5(ctx) {
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
			add_location(div0, file$1, 18, 8, 534);
			attr_dev(div1, "class", "fixed-top");
			add_location(div1, file$1, 17, 4, 502);
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
			if (detaching) detach_dev(div1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_5.name,
		type: "if",
		source: "(17:0) {#if $error}",
		ctx
	});

	return block;
}

// (23:4) {#each $participants as user, i (user.id)}
function create_each_block_2(key_1, ctx) {
	let first;
	let participant;
	let current;

	participant = new Participant({
			props: {
				isRevealed: /*$isRevealed*/ ctx[3],
				user: /*user*/ ctx[15],
				i: /*i*/ ctx[25],
				count: /*numParcitipants*/ ctx[1]
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
			if (dirty & /*$participants*/ 1) participant_changes.user = /*user*/ ctx[15];
			if (dirty & /*$participants*/ 1) participant_changes.i = /*i*/ ctx[25];
			if (dirty & /*numParcitipants*/ 2) participant_changes.count = /*numParcitipants*/ ctx[1];
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
			if (detaching) detach_dev(first);
			destroy_component(participant, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_2.name,
		type: "each",
		source: "(23:4) {#each $participants as user, i (user.id)}",
		ctx
	});

	return block;
}

// (27:8) {#if $isRevealed}
function create_if_block_3(ctx) {
	let t;
	let div;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let current;
	let if_block = /*$votes*/ ctx[4] && /*$votes*/ ctx[4].length == 1 && /*$votes*/ ctx[4][0][1] > 1 && create_if_block_4(ctx);
	let each_value_1 = /*$votes*/ ctx[4];
	validate_each_argument(each_value_1);
	const get_key = ctx => /*vote*/ ctx[16];
	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

	for (let i = 0; i < each_value_1.length; i += 1) {
		let child_ctx = get_each_context_1(ctx, each_value_1, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
	}

	let each_1_else = null;

	if (!each_value_1.length) {
		each_1_else = create_else_block_1(ctx);
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

			attr_dev(div, "class", "row");
			add_location(div, file$1, 30, 12, 968);
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
		p: function update(ctx, dirty) {
			if (/*$votes*/ ctx[4] && /*$votes*/ ctx[4].length == 1 && /*$votes*/ ctx[4][0][1] > 1) {
				if (if_block) ; else {
					if_block = create_if_block_4(ctx);
					if_block.c();
					if_block.m(t.parentNode, t);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*$votes*/ 16) {
				each_value_1 = /*$votes*/ ctx[4];
				validate_each_argument(each_value_1);
				group_outros();
				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div, outro_and_destroy_block, create_each_block_1, null, get_each_context_1);
				check_outros();

				if (!each_value_1.length && each_1_else) {
					each_1_else.p(ctx, dirty);
				} else if (!each_value_1.length) {
					each_1_else = create_else_block_1(ctx);
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

			for (let i = 0; i < each_value_1.length; i += 1) {
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
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(t);
			if (detaching) detach_dev(div);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			if (each_1_else) each_1_else.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3.name,
		type: "if",
		source: "(27:8) {#if $isRevealed}",
		ctx
	});

	return block;
}

// (28:12) {#if $votes && $votes.length == 1 && $votes[0][1] > 1}
function create_if_block_4(ctx) {
	let div;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			add_location(div, file$1, 28, 16, 917);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (!mounted) {
				dispose = action_destroyer(t.call(null, div));
				mounted = true;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_4.name,
		type: "if",
		source: "(28:12) {#if $votes && $votes.length == 1 && $votes[0][1] > 1}",
		ctx
	});

	return block;
}

// (37:16) {:else}
function create_else_block_1(ctx) {
	let div;

	const block = {
		c: function create() {
			div = element("div");
			div.textContent = "No votes";
			attr_dev(div, "class", "col text-center");
			add_location(div, file$1, 37, 20, 1281);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_1.name,
		type: "else",
		source: "(37:16) {:else}",
		ctx
	});

	return block;
}

// (34:24) <Card>
function create_default_slot_1(ctx) {
	let t_value = /*vote*/ ctx[16] + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$votes*/ 16 && t_value !== (t_value = /*vote*/ ctx[16] + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(34:24) <Card>",
		ctx
	});

	return block;
}

// (32:16) {#each $votes as [vote, count] (vote)}
function create_each_block_1(key_1, ctx) {
	let div1;
	let card;
	let t0;
	let div0;
	let t1_value = /*count*/ ctx[21] + "";
	let t1;
	let t2;
	let t3;
	let current;

	card = new Card({
			props: {
				$$slots: { default: [create_default_slot_1] },
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
			attr_dev(div0, "class", "text-muted text-center");
			add_location(div0, file$1, 34, 24, 1159);
			attr_dev(div1, "class", "col text-center");
			add_location(div1, file$1, 32, 20, 1061);
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

			if (dirty & /*$$scope, $votes*/ 67108880) {
				card_changes.$$scope = { dirty, ctx };
			}

			card.$set(card_changes);
			if ((!current || dirty & /*$votes*/ 16) && t1_value !== (t1_value = /*count*/ ctx[21] + "")) set_data_dev(t1, t1_value);
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
			if (detaching) detach_dev(div1);
			destroy_component(card);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(32:16) {#each $votes as [vote, count] (vote)}",
		ctx
	});

	return block;
}

// (42:8) {#if $user.is_spectator}
function create_if_block_2(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("You joined as spectator");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(42:8) {#if $user.is_spectator}",
		ctx
	});

	return block;
}

// (48:12) {:else}
function create_else_block$1(ctx) {
	let button;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			button = element("button");
			button.textContent = "Reveal";
			attr_dev(button, "class", "btn btn-primary");
			add_location(button, file$1, 48, 16, 1673);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);

			if (!mounted) {
				dispose = listen_dev(button, "click", /*revealVotes*/ ctx[11], false, false, false, false);
				mounted = true;
			}
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$1.name,
		type: "else",
		source: "(48:12) {:else}",
		ctx
	});

	return block;
}

// (46:12) {#if $isRevealed}
function create_if_block_1(ctx) {
	let button;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			button = element("button");
			button.textContent = "Clear";
			attr_dev(button, "class", "btn btn-warning");
			add_location(button, file$1, 46, 16, 1568);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);

			if (!mounted) {
				dispose = listen_dev(button, "click", /*clearVotes*/ ctx[12], false, false, false, false);
				mounted = true;
			}
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(46:12) {#if $isRevealed}",
		ctx
	});

	return block;
}

// (55:0) {#if !$user.is_spectator}
function create_if_block$1(ctx) {
	let div;
	let current;
	let each_value = /*$choices*/ ctx[6];
	validate_each_argument(each_value);
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

			attr_dev(div, "class", "d-flex justify-content-center mb-3");
			add_location(div, file$1, 55, 4, 1826);
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
			if (dirty & /*$isRevealed, $choices, $user, vote*/ 65640) {
				each_value = /*$choices*/ ctx[6];
				validate_each_argument(each_value);
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
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(55:0) {#if !$user.is_spectator}",
		ctx
	});

	return block;
}

// (58:12) <Card                 on:click={vote(choice)}                 on:keypress={vote(choice)}                 disabled={$isRevealed}                 selected={choice == $user.vote}>
function create_default_slot(ctx) {
	let t0_value = /*choice*/ ctx[18] + "";
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
			if (dirty & /*$choices*/ 64 && t0_value !== (t0_value = /*choice*/ ctx[18] + "")) set_data_dev(t0, t0_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(t1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(58:12) <Card                 on:click={vote(choice)}                 on:keypress={vote(choice)}                 disabled={$isRevealed}                 selected={choice == $user.vote}>",
		ctx
	});

	return block;
}

// (57:8) {#each $choices as choice}
function create_each_block(ctx) {
	let card;
	let current;

	card = new Card({
			props: {
				disabled: /*$isRevealed*/ ctx[3],
				selected: /*choice*/ ctx[18] == /*$user*/ ctx[5].vote,
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	card.$on("click", function () {
		if (is_function(/*vote*/ ctx[16](/*choice*/ ctx[18]))) /*vote*/ ctx[16](/*choice*/ ctx[18]).apply(this, arguments);
	});

	card.$on("keypress", function () {
		if (is_function(/*vote*/ ctx[16](/*choice*/ ctx[18]))) /*vote*/ ctx[16](/*choice*/ ctx[18]).apply(this, arguments);
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
			if (dirty & /*$choices, $user*/ 96) card_changes.selected = /*choice*/ ctx[18] == /*$user*/ ctx[5].vote;

			if (dirty & /*$$scope, $choices*/ 67108928) {
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
		source: "(57:8) {#each $choices as choice}",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let t0;
	let div2;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let t1;
	let div1;
	let t2;
	let t3;
	let div0;
	let t4;
	let t5;
	let div3;
	let button;
	let t6;
	let button_disabled_value;
	let current;
	let mounted;
	let dispose;
	let if_block0 = /*$error*/ ctx[2] && create_if_block_5(ctx);
	let each_value_2 = /*$participants*/ ctx[0];
	validate_each_argument(each_value_2);
	const get_key = ctx => /*user*/ ctx[15].id;
	validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);

	for (let i = 0; i < each_value_2.length; i += 1) {
		let child_ctx = get_each_context_2(ctx, each_value_2, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block_2(key, child_ctx));
	}

	let if_block1 = /*$isRevealed*/ ctx[3] && create_if_block_3(ctx);
	let if_block2 = /*$user*/ ctx[5].is_spectator && create_if_block_2(ctx);

	function select_block_type(ctx, dirty) {
		if (/*$isRevealed*/ ctx[3]) return create_if_block_1;
		return create_else_block$1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block3 = current_block_type(ctx);
	let if_block4 = !/*$user*/ ctx[5].is_spectator && create_if_block$1(ctx);

	const block = {
		c: function create() {
			if (if_block0) if_block0.c();
			t0 = space();
			div2 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t1 = space();
			div1 = element("div");
			if (if_block1) if_block1.c();
			t2 = space();
			if (if_block2) if_block2.c();
			t3 = space();
			div0 = element("div");
			if_block3.c();
			t4 = space();
			if (if_block4) if_block4.c();
			t5 = space();
			div3 = element("div");
			button = element("button");
			t6 = text("Change deck");
			attr_dev(div0, "class", "d-flex justify-content-center mb-3");
			add_location(div0, file$1, 44, 8, 1473);
			attr_dev(div1, "class", "controls svelte-14wosg6");
			add_location(div1, file$1, 25, 4, 785);
			attr_dev(div2, "class", "participants svelte-14wosg6");
			add_location(div2, file$1, 21, 0, 611);
			attr_dev(button, "class", "btn btn-secondary");
			button.disabled = button_disabled_value = !/*$isRevealed*/ ctx[3];
			add_location(button, file$1, 69, 4, 2231);
			attr_dev(div3, "class", "d-flex justify-content-center mb-3");
			add_location(div3, file$1, 68, 0, 2178);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, div2, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div2, null);
				}
			}

			append_dev(div2, t1);
			append_dev(div2, div1);
			if (if_block1) if_block1.m(div1, null);
			append_dev(div1, t2);
			if (if_block2) if_block2.m(div1, null);
			append_dev(div1, t3);
			append_dev(div1, div0);
			if_block3.m(div0, null);
			insert_dev(target, t4, anchor);
			if (if_block4) if_block4.m(target, anchor);
			insert_dev(target, t5, anchor);
			insert_dev(target, div3, anchor);
			append_dev(div3, button);
			append_dev(button, t6);
			current = true;

			if (!mounted) {
				dispose = listen_dev(button, "click", /*changeDeck*/ ctx[13], false, false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (/*$error*/ ctx[2]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_5(ctx);
					if_block0.c();
					if_block0.m(t0.parentNode, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (dirty & /*$isRevealed, $participants, numParcitipants*/ 11) {
				each_value_2 = /*$participants*/ ctx[0];
				validate_each_argument(each_value_2);
				group_outros();
				validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, div2, outro_and_destroy_block, create_each_block_2, t1, get_each_context_2);
				check_outros();
			}

			if (/*$isRevealed*/ ctx[3]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty & /*$isRevealed*/ 8) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block_3(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(div1, t2);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}

			if (/*$user*/ ctx[5].is_spectator) {
				if (if_block2) ; else {
					if_block2 = create_if_block_2(ctx);
					if_block2.c();
					if_block2.m(div1, t3);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block3) {
				if_block3.p(ctx, dirty);
			} else {
				if_block3.d(1);
				if_block3 = current_block_type(ctx);

				if (if_block3) {
					if_block3.c();
					if_block3.m(div0, null);
				}
			}

			if (!/*$user*/ ctx[5].is_spectator) {
				if (if_block4) {
					if_block4.p(ctx, dirty);

					if (dirty & /*$user*/ 32) {
						transition_in(if_block4, 1);
					}
				} else {
					if_block4 = create_if_block$1(ctx);
					if_block4.c();
					transition_in(if_block4, 1);
					if_block4.m(t5.parentNode, t5);
				}
			} else if (if_block4) {
				group_outros();

				transition_out(if_block4, 1, 1, () => {
					if_block4 = null;
				});

				check_outros();
			}

			if (!current || dirty & /*$isRevealed*/ 8 && button_disabled_value !== (button_disabled_value = !/*$isRevealed*/ ctx[3])) {
				prop_dev(button, "disabled", button_disabled_value);
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value_2.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			transition_in(if_block1);
			transition_in(if_block4);
			current = true;
		},
		o: function outro(local) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			transition_out(if_block1);
			transition_out(if_block4);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block0) if_block0.d(detaching);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(div2);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			if_block3.d();
			if (detaching) detach_dev(t4);
			if (if_block4) if_block4.d(detaching);
			if (detaching) detach_dev(t5);
			if (detaching) detach_dev(div3);
			mounted = false;
			dispose();
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
	let $participants;
	let $error;
	let $isRevealed;
	let $votes;
	let $user;
	let $choices;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Voting', slots, []);
	const url = jsonScriptContents('websocket_url');
	const { user, participants, isRevealed, choices, votes, revealVotes, clearVotes, vote, changeDeck, error } = pokerStores(url);
	validate_store(user, 'user');
	component_subscribe($$self, user, value => $$invalidate(5, $user = value));
	validate_store(participants, 'participants');
	component_subscribe($$self, participants, value => $$invalidate(0, $participants = value));
	validate_store(isRevealed, 'isRevealed');
	component_subscribe($$self, isRevealed, value => $$invalidate(3, $isRevealed = value));
	validate_store(choices, 'choices');
	component_subscribe($$self, choices, value => $$invalidate(6, $choices = value));
	validate_store(votes, 'votes');
	component_subscribe($$self, votes, value => $$invalidate(4, $votes = value));
	validate_store(error, 'error');
	component_subscribe($$self, error, value => $$invalidate(2, $error = value));
	let numParcitipants;
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Voting> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		confetti: t,
		Card,
		Participant,
		pokerStores,
		jsonScriptContents,
		url,
		user,
		participants,
		isRevealed,
		choices,
		votes,
		revealVotes,
		clearVotes,
		vote,
		changeDeck,
		error,
		numParcitipants,
		$participants,
		$error,
		$isRevealed,
		$votes,
		$user,
		$choices
	});

	$$self.$inject_state = $$props => {
		if ('numParcitipants' in $$props) $$invalidate(1, numParcitipants = $$props.numParcitipants);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$participants*/ 1) {
			$$invalidate(1, numParcitipants = $participants.length);
		}
	};

	return [
		$participants,
		numParcitipants,
		$error,
		$isRevealed,
		$votes,
		$user,
		$choices,
		participants,
		isRevealed,
		choices,
		votes,
		revealVotes,
		clearVotes,
		changeDeck,
		error,
		user,
		vote
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

/* js/App.svelte generated by Svelte v3.56.0 */
const file = "js/App.svelte";

// (13:0) {:else}
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
		source: "(13:0) {:else}",
		ctx
	});

	return block;
}

// (11:0) {#if url}
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
		source: "(11:0) {#if url}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let h1;
	let t1;
	let current_block_type_index;
	let if_block;
	let t2;
	let br;
	let t3;
	let a;
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
			h1 = element("h1");
			h1.textContent = "Planning poker";
			t1 = space();
			if_block.c();
			t2 = space();
			br = element("br");
			t3 = space();
			a = element("a");
			a.textContent = "New poker session";
			add_location(h1, file, 8, 0, 191);
			add_location(br, file, 16, 0, 269);
			attr_dev(a, "href", "/");
			add_location(a, file, 18, 0, 277);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, h1, anchor);
			insert_dev(target, t1, anchor);
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, t2, anchor);
			insert_dev(target, br, anchor);
			insert_dev(target, t3, anchor);
			insert_dev(target, a, anchor);
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
			if (detaching) detach_dev(h1);
			if (detaching) detach_dev(t1);
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(br);
			if (detaching) detach_dev(t3);
			if (detaching) detach_dev(a);
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
