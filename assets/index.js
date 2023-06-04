
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
function init_binding_group(group) {
    let _inputs;
    return {
        /* push */ p(...inputs) {
            _inputs = inputs;
            _inputs.forEach(input => group.push(input));
        },
        /* remove */ r() {
            _inputs.forEach(input => group.splice(group.indexOf(input), 1));
        }
    };
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}
function set_style(node, key, value, important) {
    if (value == null) {
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
                update$1(component.$$);
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
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.1' }, detail), { bubbles: true }));
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
    if (text.data === data)
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

/* js/Join.svelte generated by Svelte v3.59.1 */
const file$5 = "js/Join.svelte";

// (45:12) {#if error}
function create_if_block$3(ctx) {
	let div;
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text(/*error*/ ctx[2]);
			attr_dev(div, "class", "invalid-feedback");
			add_location(div, file$5, 45, 16, 1162);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*error*/ 4) set_data_dev(t, /*error*/ ctx[2]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$3.name,
		type: "if",
		source: "(45:12) {#if error}",
		ctx
	});

	return block;
}

function create_fragment$5(ctx) {
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
	let if_block = /*error*/ ctx[2] && create_if_block$3(ctx);

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
			add_location(input0, file$5, 35, 8, 800);
			attr_dev(input1, "type", "text");
			attr_dev(input1, "name", "name");
			attr_dev(input1, "class", "form-control");
			toggle_class(input1, "is-invalid", /*error*/ ctx[2]);
			add_location(input1, file$5, 37, 12, 909);
			attr_dev(div0, "class", "col");
			add_location(div0, file$5, 36, 8, 879);
			attr_dev(input2, "type", "submit");
			attr_dev(input2, "class", "btn btn-primary");
			input2.value = "Join";
			add_location(input2, file$5, 49, 12, 1277);
			attr_dev(div1, "class", "col");
			add_location(div1, file$5, 48, 8, 1247);
			attr_dev(div2, "class", "row row-cols-lg-auto");
			add_location(div2, file$5, 34, 4, 757);
			attr_dev(input3, "type", "checkbox");
			attr_dev(input3, "name", "is_spectator");
			add_location(input3, file$5, 54, 12, 1426);
			attr_dev(label, "class", "col");
			add_location(label, file$5, 53, 8, 1394);
			attr_dev(div3, "class", "row");
			add_location(div3, file$5, 52, 4, 1368);
			attr_dev(form, "method", "post");
			add_location(form, file$5, 33, 0, 732);
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
			set_input_value(input1, /*name*/ ctx[0]);
			append_dev(div0, t1);
			if (if_block) if_block.m(div0, null);
			append_dev(div2, t2);
			append_dev(div2, div1);
			append_dev(div1, input2);
			append_dev(form, t3);
			append_dev(form, div3);
			append_dev(div3, label);
			append_dev(label, input3);
			input3.checked = /*isSpectator*/ ctx[1];
			append_dev(label, t4);

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
					if_block = create_if_block$3(ctx);
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
			if (detaching) detach_dev(form);
			if (if_block) if_block.d();
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

function instance$5($$self, $$props, $$invalidate) {
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
		init$1(this, options, instance$5, create_fragment$5, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Join",
			options,
			id: create_fragment$5.name
		});
	}
}

const t=(t,b={})=>{w(b);let{colors:k=["#FFC700","#FF0000","#2E3191","#41BBC7"],duration:W=3500,force:S=.5,particleCount:G=150,particleShape:X="mix",particleSize:_=12,destroyAfterDone:C=!0,stageHeight:z=800,stageWidth:E=1600}=b;!function(t){const e=f("style");e.dataset.neoconfetti="",e.textContent='@keyframes fk9XWG_y-axis{to{transform:translate3d(0,var(--stage-height),0)}}@keyframes fk9XWG_x-axis{to{transform:translate3d(var(--x-landing-point),0,0)}}@keyframes fk9XWG_rotation{50%{transform:rotate3d(var(--half-rotation),180deg)}to{transform:rotate3d(var(--rotation),360deg)}}.fk9XWG_container{width:0;height:0;z-index:1200;position:relative;overflow:visible}.fk9XWG_particle{animation:x-axis var(--duration-chaos)forwards cubic-bezier(var(--x1),var(--x2),var(--x3),var(--x4));animation-name:fk9XWG_x-axis}.fk9XWG_particle>div{animation:y-axis var(--duration-chaos)forwards cubic-bezier(var(--y1),var(--y2),var(--y3),var(--y4));width:var(--width);height:var(--height);animation-name:fk9XWG_y-axis;position:absolute;top:0;left:0}.fk9XWG_particle>div:before{height:100%;width:100%;content:"";background-color:var(--bgcolor);animation:rotation var(--rotation-duration)infinite linear;border-radius:var(--border-radius);animation-name:fk9XWG_rotation;display:block}',h(document.head,e);}(),t.classList.add("fk9XWG_container"),t.style.setProperty("--stage-height",z+"px");let P,A=p(G,k),H=e(t,A);function M(t,e){const f=l(c()*(x-1)),h="rectangles"!==X&&("circles"===X||v(f)),p=(e,r)=>t.style.setProperty(e,r+"");p("--x-landing-point",u(s(m(e,90)-180),0,180,-E/2,E/2)+"px"),p("--duration-chaos",W-l(1e3*c())+"ms");const b=c()<a?g(c()*i,2):0;p("--x1",b),p("--x2",-1*b),p("--x3",b),p("--x4",g(s(u(s(m(e,90)-180),0,180,-1,1)),4)),p("--y1",g(c()*n,4)),p("--y2",g(c()*S*(y()?1:-1),4)),p("--y3",n),p("--y4",g(d(u(s(e-180),0,180,S,-S),0),4)),p("--width",(h?_:l(4*c())+_/2)+"px"),p("--height",(h?_:l(2*c())+_)+"px");const k=f.toString(2).padStart(3,"0").split("");p("--half-rotation",k.map((t=>+t/2+""))),p("--rotation",k),p("--rotation-duration",g(c()*(o-r)+r)+"ms"),p("--border-radius",h?"50%":0);}for(const[t,e]of Object.entries(H))M(e,A[+t].degree);return Promise.resolve().then((()=>P=setTimeout((()=>C&&(t.innerHTML="")),W))),{update(r){w(r);const o=r.particleCount??G,a=r.colors??k,i=r.stageHeight??z;if(A=p(o,a),o===G&&JSON.stringify(k)!==JSON.stringify(a))for(const[t,{color:e}]of Object.entries(A))H[+t].style.setProperty("--bgcolor",e);o!==G&&(t.innerHTML="",H=e(t,A)),C&&!r.destroyAfterDone&&clearTimeout(P),t.style.setProperty("--stage-height",i+"px"),k=a,W=r.duration??W,S=r.force??S,G=o,X=r.particleShape??X,_=r.particleSize??_,C=r.destroyAfterDone??C,z=i,E=r.stageWidth??E;},destroy(){clearTimeout(P);}}};function e(t,e=[]){const r=[];for(const{color:o}of e){const e=f("div");e.className="fk9XWG_particle",e.style.setProperty("--bgcolor",o);const a=f("div");h(e,a),h(t,e),r.push(e);}return r}const r=200,o=800,a=.1,i=.3,n=.5,s=Math.abs,c=Math.random,l=Math.round,d=Math.max,f=t=>document.createElement(t),h=(t,e)=>t.appendChild(e),p=(t,e)=>Array.from({length:t},((r,o)=>({color:e[o%e.length],degree:360*o/t}))),g=(t,e=2)=>l((t+Number.EPSILON)*10**e)/10**e,u=(t,e,r,o,a)=>(t-e)*(a-o)/(r-e)+o,m=(t,e)=>t+e>360?t+e-360:t+e,y=()=>c()>.5,x=6,v=t=>1!==t&&y(),b=t=>void 0===t,k=(t,e)=>{if(!b(t)&&Number.isSafeInteger(t)&&t<0)throw new Error(e+" must be a positive integer")},w=({particleCount:t,duration:e,colors:r,particleSize:o,force:a,stageHeight:i,stageWidth:n,particleShape:s})=>{if(k(t,"particleCount"),k(e,"duration"),k(o,"particleSize"),k(a,"force"),k(i,"stageHeight"),k(n,"stageWidth"),!b(s)&&!/^(mix|circles|rectangles)$/i.test(s))throw new Error('particlesShape should be either "mix" or "circles" or "rectangle"');if(!b(r)&&!Array.isArray(r))throw new Error("colors must be an array of strings");if(a>1)throw new Error("force must be within 0 and 1")};

/* js/Card.svelte generated by Svelte v3.59.1 */

const file$4 = "js/Card.svelte";

function create_fragment$4(ctx) {
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
			add_location(div, file$4, 5, 0, 74);
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
		id: create_fragment$4.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$4($$self, $$props, $$invalidate) {
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
		init$1(this, options, instance$4, create_fragment$4, safe_not_equal, { disabled: 0, selected: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Card",
			options,
			id: create_fragment$4.name
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

/* js/Participant.svelte generated by Svelte v3.59.1 */
const file$3 = "js/Participant.svelte";

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

function create_fragment$3(ctx) {
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
			add_location(strong, file$3, 21, 4, 548);
			attr_dev(div, "class", "participant svelte-1s7tb0t");
			set_style(div, "transform", "rotate(" + /*angle*/ ctx[2] + "deg) translate(33vw) rotate(90deg)");
			add_location(div, file$3, 20, 0, 450);
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
		init$1(this, options, instance$3, create_fragment$3, safe_not_equal, { user: 0, isRevealed: 1, i: 3, count: 4 });

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
}

const subscriber_queue = [];
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier} [start]
 */
function readable(value, start) {
    return {
        subscribe: writable(value, start).subscribe
    };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=} start
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
        let started = false;
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
            if (started) {
                sync();
            }
        }, () => {
            pending |= (1 << i);
        }));
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

/* js/Settings.svelte generated by Svelte v3.59.1 */
const file$2 = "js/Settings.svelte";

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i][0];
	child_ctx[8] = list[i][1];
	return child_ctx;
}

// (6:4) {#each $decks as [value, label]}
function create_each_block$1(ctx) {
	let input;
	let input_value_value;
	let value_has_changed = false;
	let input_id_value;
	let input_disabled_value;
	let t0;
	let label;
	let t1_value = /*label*/ ctx[8] + "";
	let t1;
	let label_for_value;
	let binding_group;
	let mounted;
	let dispose;
	binding_group = init_binding_group(/*$$binding_groups*/ ctx[5][0]);

	const block = {
		c: function create() {
			input = element("input");
			t0 = space();
			label = element("label");
			t1 = text(t1_value);
			attr_dev(input, "type", "radio");
			attr_dev(input, "class", "btn-check");
			input.__value = input_value_value = /*value*/ ctx[7];
			input.value = input.__value;
			attr_dev(input, "autocomplete", "off");
			attr_dev(input, "id", input_id_value = "deck-" + /*value*/ ctx[7]);
			input.disabled = input_disabled_value = !/*$isRevealed*/ ctx[1];
			add_location(input, file$2, 6, 8, 207);
			attr_dev(label, "class", "btn btn-outline-primary");
			attr_dev(label, "for", label_for_value = "deck-" + /*value*/ ctx[7]);
			add_location(label, file$2, 14, 8, 428);
			binding_group.p(input);
		},
		m: function mount(target, anchor) {
			insert_dev(target, input, anchor);
			input.checked = input.__value === /*$deck*/ ctx[2];
			insert_dev(target, t0, anchor);
			insert_dev(target, label, anchor);
			append_dev(label, t1);

			if (!mounted) {
				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[4]);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$decks*/ 1 && input_value_value !== (input_value_value = /*value*/ ctx[7])) {
				prop_dev(input, "__value", input_value_value);
				input.value = input.__value;
				value_has_changed = true;
			}

			if (dirty & /*$decks*/ 1 && input_id_value !== (input_id_value = "deck-" + /*value*/ ctx[7])) {
				attr_dev(input, "id", input_id_value);
			}

			if (dirty & /*$isRevealed*/ 2 && input_disabled_value !== (input_disabled_value = !/*$isRevealed*/ ctx[1])) {
				prop_dev(input, "disabled", input_disabled_value);
			}

			if (value_has_changed || dirty & /*$deck, $decks*/ 5) {
				input.checked = input.__value === /*$deck*/ ctx[2];
			}

			if (dirty & /*$decks*/ 1 && t1_value !== (t1_value = /*label*/ ctx[8] + "")) set_data_dev(t1, t1_value);

			if (dirty & /*$decks*/ 1 && label_for_value !== (label_for_value = "deck-" + /*value*/ ctx[7])) {
				attr_dev(label, "for", label_for_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(input);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(label);
			binding_group.r();
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$1.name,
		type: "each",
		source: "(6:4) {#each $decks as [value, label]}",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
	let div0;
	let t0;
	let br;
	let t1;
	let div1;
	let label;
	let t3;
	let input;
	let mounted;
	let dispose;
	let each_value = /*$decks*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t0 = space();
			br = element("br");
			t1 = space();
			div1 = element("div");
			label = element("label");
			label.textContent = "Auto reveal";
			t3 = space();
			input = element("input");
			attr_dev(div0, "class", "btn-group btn-group-sm");
			attr_dev(div0, "role", "group");
			attr_dev(div0, "aria-label", "Change deck");
			add_location(div0, file$2, 4, 0, 87);
			add_location(br, file$2, 17, 0, 522);
			attr_dev(label, "for", "autoReveal");
			add_location(label, file$2, 20, 4, 576);
			attr_dev(input, "type", "checkbox");
			attr_dev(input, "class", "form-check-input");
			attr_dev(input, "id", "autoReveal");
			add_location(input, file$2, 21, 4, 624);
			attr_dev(div1, "class", "form-check form-switch mt-2");
			add_location(div1, file$2, 19, 0, 530);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div0, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div0, null);
				}
			}

			insert_dev(target, t0, anchor);
			insert_dev(target, br, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, div1, anchor);
			append_dev(div1, label);
			append_dev(div1, t3);
			append_dev(div1, input);
			input.checked = /*$autoReveal*/ ctx[3];

			if (!mounted) {
				dispose = listen_dev(input, "change", /*input_change_handler_1*/ ctx[6]);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*$decks, $isRevealed, $deck*/ 7) {
				each_value = /*$decks*/ ctx[0];
				validate_each_argument(each_value);
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

			if (dirty & /*$autoReveal*/ 8) {
				input.checked = /*$autoReveal*/ ctx[3];
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div0);
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(br);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div1);
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
	validate_store(decks, 'decks');
	component_subscribe($$self, decks, $$value => $$invalidate(0, $decks = $$value));
	validate_store(isRevealed, 'isRevealed');
	component_subscribe($$self, isRevealed, $$value => $$invalidate(1, $isRevealed = $$value));
	validate_store(deck, 'deck');
	component_subscribe($$self, deck, $$value => $$invalidate(2, $deck = $$value));
	validate_store(autoReveal, 'autoReveal');
	component_subscribe($$self, autoReveal, $$value => $$invalidate(3, $autoReveal = $$value));
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
		$decks,
		$isRevealed,
		$deck,
		$autoReveal
	});

	return [
		$decks,
		$isRevealed,
		$deck,
		$autoReveal,
		input_change_handler,
		$$binding_groups,
		input_change_handler_1
	];
}

class Settings extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$2, create_fragment$2, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Settings",
			options,
			id: create_fragment$2.name
		});
	}
}

/* js/Voting.svelte generated by Svelte v3.59.1 */
const file$1 = "js/Voting.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[12] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[15] = list[i][0];
	child_ctx[16] = list[i][1];
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[19] = list[i];
	child_ctx[21] = i;
	return child_ctx;
}

// (35:0) {#if $error}
function create_if_block_6(ctx) {
	let div1;
	let div0;
	let t;

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			t = text(/*$error*/ ctx[3]);
			attr_dev(div0, "class", "alert alert-danger");
			attr_dev(div0, "role", "alert");
			add_location(div0, file$1, 36, 8, 805);
			attr_dev(div1, "class", "fixed-top");
			add_location(div1, file$1, 35, 4, 773);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$error*/ 8) set_data_dev(t, /*$error*/ ctx[3]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_6.name,
		type: "if",
		source: "(35:0) {#if $error}",
		ctx
	});

	return block;
}

// (41:4) {#each $participants as user, i (user.id)}
function create_each_block_2(key_1, ctx) {
	let first;
	let participant;
	let current;

	participant = new Participant({
			props: {
				isRevealed: /*$isRevealed*/ ctx[4],
				user: /*user*/ ctx[19],
				i: /*i*/ ctx[21],
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
			if (dirty & /*$isRevealed*/ 16) participant_changes.isRevealed = /*$isRevealed*/ ctx[4];
			if (dirty & /*$participants*/ 1) participant_changes.user = /*user*/ ctx[19];
			if (dirty & /*$participants*/ 1) participant_changes.i = /*i*/ ctx[21];
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
		source: "(41:4) {#each $participants as user, i (user.id)}",
		ctx
	});

	return block;
}

// (45:8) {#if $isRevealed}
function create_if_block_4(ctx) {
	let t;
	let div;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let current;
	let if_block = /*$votes*/ ctx[5] && /*$votes*/ ctx[5].length == 1 && /*$votes*/ ctx[5][0][1] > 1 && create_if_block_5(ctx);
	let each_value_1 = /*$votes*/ ctx[5];
	validate_each_argument(each_value_1);
	const get_key = ctx => /*vote*/ ctx[15];
	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

	for (let i = 0; i < each_value_1.length; i += 1) {
		let child_ctx = get_each_context_1(ctx, each_value_1, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
	}

	let each_1_else = null;

	if (!each_value_1.length) {
		each_1_else = create_else_block_2(ctx);
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

			attr_dev(div, "class", "summary rounded mb-3 text-center svelte-lta3sd");
			add_location(div, file$1, 48, 12, 1239);
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
			if (/*$votes*/ ctx[5] && /*$votes*/ ctx[5].length == 1 && /*$votes*/ ctx[5][0][1] > 1) {
				if (if_block) ; else {
					if_block = create_if_block_5(ctx);
					if_block.c();
					if_block.m(t.parentNode, t);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*$votes*/ 32) {
				each_value_1 = /*$votes*/ ctx[5];
				validate_each_argument(each_value_1);
				group_outros();
				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div, outro_and_destroy_block, create_each_block_1, null, get_each_context_1);
				check_outros();

				if (!each_value_1.length && each_1_else) {
					each_1_else.p(ctx, dirty);
				} else if (!each_value_1.length) {
					each_1_else = create_else_block_2(ctx);
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
		id: create_if_block_4.name,
		type: "if",
		source: "(45:8) {#if $isRevealed}",
		ctx
	});

	return block;
}

// (46:12) {#if $votes && $votes.length == 1 && $votes[0][1] > 1}
function create_if_block_5(ctx) {
	let div;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			add_location(div, file$1, 46, 16, 1188);
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
		id: create_if_block_5.name,
		type: "if",
		source: "(46:12) {#if $votes && $votes.length == 1 && $votes[0][1] > 1}",
		ctx
	});

	return block;
}

// (55:16) {:else}
function create_else_block_2(ctx) {
	let div;

	const block = {
		c: function create() {
			div = element("div");
			div.textContent = "No votes";
			attr_dev(div, "class", "col text-center");
			add_location(div, file$1, 55, 20, 1584);
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
		id: create_else_block_2.name,
		type: "else",
		source: "(55:16) {:else}",
		ctx
	});

	return block;
}

// (52:24) <Card>
function create_default_slot_1(ctx) {
	let t_value = /*vote*/ ctx[15] + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$votes*/ 32 && t_value !== (t_value = /*vote*/ ctx[15] + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(52:24) <Card>",
		ctx
	});

	return block;
}

// (50:16) {#each $votes as [vote, count] (vote)}
function create_each_block_1(key_1, ctx) {
	let div1;
	let card;
	let t0;
	let div0;
	let t1_value = /*count*/ ctx[16] + "";
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
			attr_dev(div0, "class", "text-muted");
			add_location(div0, file$1, 52, 24, 1474);
			attr_dev(div1, "class", "d-inline-block text-center m-2");
			add_location(div1, file$1, 50, 20, 1361);
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

			if (dirty & /*$$scope, $votes*/ 4194336) {
				card_changes.$$scope = { dirty, ctx };
			}

			card.$set(card_changes);
			if ((!current || dirty & /*$votes*/ 32) && t1_value !== (t1_value = /*count*/ ctx[16] + "")) set_data_dev(t1, t1_value);
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
		source: "(50:16) {#each $votes as [vote, count] (vote)}",
		ctx
	});

	return block;
}

// (62:16) {#if !$isRevealed && votingComplete}
function create_if_block_3(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("✓");
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
		id: create_if_block_3.name,
		type: "if",
		source: "(62:16) {#if !$isRevealed && votingComplete}",
		ctx
	});

	return block;
}

// (68:12) {:else}
function create_else_block_1(ctx) {
	let button;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			button = element("button");
			button.textContent = "Reveal";
			attr_dev(button, "class", "btn btn-primary");
			add_location(button, file$1, 68, 16, 2049);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);

			if (!mounted) {
				dispose = listen_dev(button, "click", revealVotes, false, false, false, false);
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
		id: create_else_block_1.name,
		type: "else",
		source: "(68:12) {:else}",
		ctx
	});

	return block;
}

// (66:12) {#if $isRevealed}
function create_if_block_2(ctx) {
	let button;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			button = element("button");
			button.textContent = "Clear";
			attr_dev(button, "class", "btn btn-warning");
			add_location(button, file$1, 66, 16, 1944);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);

			if (!mounted) {
				dispose = listen_dev(button, "click", clearVotes, false, false, false, false);
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
		id: create_if_block_2.name,
		type: "if",
		source: "(66:12) {#if $isRevealed}",
		ctx
	});

	return block;
}

// (77:12) {#if !isProduction}
function create_if_block_1(ctx) {
	let t0;
	let div;
	let button0;
	let t2;
	let button1;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			t0 = text("Fake:\n                ");
			div = element("div");
			button0 = element("button");
			button0.textContent = "Users";
			t2 = space();
			button1 = element("button");
			button1.textContent = "Votes";
			attr_dev(button0, "class", "btn btn-warning");
			add_location(button0, file$1, 79, 20, 2401);
			attr_dev(button1, "class", "btn btn-warning");
			add_location(button1, file$1, 80, 20, 2505);
			attr_dev(div, "class", "btn-group btn-group-sm");
			attr_dev(div, "role", "group");
			add_location(div, file$1, 78, 16, 2331);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, div, anchor);
			append_dev(div, button0);
			append_dev(div, t2);
			append_dev(div, button1);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*click_handler*/ ctx[9], false, false, false, false),
					listen_dev(button1, "click", /*click_handler_1*/ ctx[10], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(div);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(77:12) {#if !isProduction}",
		ctx
	});

	return block;
}

// (92:12) {:else}
function create_else_block$1(ctx) {
	let div;
	let current;
	let each_value = /*$choices*/ ctx[7];
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

			attr_dev(div, "class", "d-flex justify-content-center");
			add_location(div, file$1, 92, 16, 2999);
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
			if (dirty & /*$isRevealed, $choices, $user, castVote*/ 208) {
				each_value = /*$choices*/ ctx[7];
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
		id: create_else_block$1.name,
		type: "else",
		source: "(92:12) {:else}",
		ctx
	});

	return block;
}

// (86:12) {#if $user.is_spectator}
function create_if_block$1(ctx) {
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
			add_location(br, file$1, 86, 40, 2754);
			attr_dev(button, "class", "btn btn-light btn-sm");
			add_location(button, file$1, 88, 16, 2803);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, br, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, button, anchor);

			if (!mounted) {
				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[11], false, false, false, false);
				mounted = true;
			}
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(br);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(button);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(86:12) {#if $user.is_spectator}",
		ctx
	});

	return block;
}

// (95:24) <Card                             on:click={castVote(choice)}                             on:keypress={castVote(choice)}                             disabled={$isRevealed}                             selected={choice == $user.vote}>
function create_default_slot(ctx) {
	let t0_value = /*choice*/ ctx[12] + "";
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
			if (dirty & /*$choices*/ 128 && t0_value !== (t0_value = /*choice*/ ctx[12] + "")) set_data_dev(t0, t0_value);
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
		source: "(95:24) <Card                             on:click={castVote(choice)}                             on:keypress={castVote(choice)}                             disabled={$isRevealed}                             selected={choice == $user.vote}>",
		ctx
	});

	return block;
}

// (94:20) {#each $choices as choice}
function create_each_block(ctx) {
	let card;
	let current;

	card = new Card({
			props: {
				disabled: /*$isRevealed*/ ctx[4],
				selected: /*choice*/ ctx[12] == /*$user*/ ctx[6].vote,
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	card.$on("click", function () {
		if (is_function(castVote(/*choice*/ ctx[12]))) castVote(/*choice*/ ctx[12]).apply(this, arguments);
	});

	card.$on("keypress", function () {
		if (is_function(castVote(/*choice*/ ctx[12]))) castVote(/*choice*/ ctx[12]).apply(this, arguments);
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
			if (dirty & /*$isRevealed*/ 16) card_changes.disabled = /*$isRevealed*/ ctx[4];
			if (dirty & /*$choices, $user*/ 192) card_changes.selected = /*choice*/ ctx[12] == /*$user*/ ctx[6].vote;

			if (dirty & /*$$scope, $choices*/ 4194432) {
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
		source: "(94:20) {#each $choices as choice}",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let t0;
	let div3;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let t1;
	let div2;
	let t2;
	let div1;
	let div0;
	let t3;
	let t4;
	let div8;
	let div7;
	let div4;
	let t5;
	let div5;
	let current_block_type_index;
	let if_block5;
	let t6;
	let div6;
	let settings;
	let current;
	let if_block0 = /*$error*/ ctx[3] && create_if_block_6(ctx);
	let each_value_2 = /*$participants*/ ctx[0];
	validate_each_argument(each_value_2);
	const get_key = ctx => /*user*/ ctx[19].id;
	validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);

	for (let i = 0; i < each_value_2.length; i += 1) {
		let child_ctx = get_each_context_2(ctx, each_value_2, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block_2(key, child_ctx));
	}

	let if_block1 = /*$isRevealed*/ ctx[4] && create_if_block_4(ctx);
	let if_block2 = !/*$isRevealed*/ ctx[4] && /*votingComplete*/ ctx[2] && create_if_block_3(ctx);

	function select_block_type(ctx, dirty) {
		if (/*$isRevealed*/ ctx[4]) return create_if_block_2;
		return create_else_block_1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block3 = current_block_type(ctx);
	let if_block4 = !/*isProduction*/ ctx[8] && create_if_block_1(ctx);
	const if_block_creators = [create_if_block$1, create_else_block$1];
	const if_blocks = [];

	function select_block_type_1(ctx, dirty) {
		if (/*$user*/ ctx[6].is_spectator) return 0;
		return 1;
	}

	current_block_type_index = select_block_type_1(ctx);
	if_block5 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	settings = new Settings({ $$inline: true });

	const block = {
		c: function create() {
			if (if_block0) if_block0.c();
			t0 = space();
			div3 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t1 = space();
			div2 = element("div");
			if (if_block1) if_block1.c();
			t2 = space();
			div1 = element("div");
			div0 = element("div");
			if (if_block2) if_block2.c();
			t3 = space();
			if_block3.c();
			t4 = space();
			div8 = element("div");
			div7 = element("div");
			div4 = element("div");
			if (if_block4) if_block4.c();
			t5 = space();
			div5 = element("div");
			if_block5.c();
			t6 = space();
			div6 = element("div");
			create_component(settings.$$.fragment);
			attr_dev(div0, "class", "voting-status svelte-lta3sd");
			add_location(div0, file$1, 60, 12, 1754);
			attr_dev(div1, "class", "d-flex justify-content-center mb-3");
			add_location(div1, file$1, 59, 8, 1693);
			attr_dev(div2, "class", "controls svelte-lta3sd");
			add_location(div2, file$1, 43, 4, 1056);
			attr_dev(div3, "class", "participants svelte-lta3sd");
			add_location(div3, file$1, 39, 0, 882);
			attr_dev(div4, "class", "col-md-2");
			add_location(div4, file$1, 75, 8, 2238);
			attr_dev(div5, "class", "col-md-8");
			add_location(div5, file$1, 84, 8, 2654);
			attr_dev(div6, "class", "col-md-2 text-start");
			add_location(div6, file$1, 105, 8, 3508);
			attr_dev(div7, "class", "row");
			add_location(div7, file$1, 74, 4, 2212);
			attr_dev(div8, "class", "container text-center");
			add_location(div8, file$1, 73, 0, 2172);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, div3, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div3, null);
				}
			}

			append_dev(div3, t1);
			append_dev(div3, div2);
			if (if_block1) if_block1.m(div2, null);
			append_dev(div2, t2);
			append_dev(div2, div1);
			append_dev(div1, div0);
			if (if_block2) if_block2.m(div0, null);
			append_dev(div1, t3);
			if_block3.m(div1, null);
			insert_dev(target, t4, anchor);
			insert_dev(target, div8, anchor);
			append_dev(div8, div7);
			append_dev(div7, div4);
			if (if_block4) if_block4.m(div4, null);
			append_dev(div7, t5);
			append_dev(div7, div5);
			if_blocks[current_block_type_index].m(div5, null);
			append_dev(div7, t6);
			append_dev(div7, div6);
			mount_component(settings, div6, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*$error*/ ctx[3]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_6(ctx);
					if_block0.c();
					if_block0.m(t0.parentNode, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (dirty & /*$isRevealed, $participants, numParcitipants*/ 19) {
				each_value_2 = /*$participants*/ ctx[0];
				validate_each_argument(each_value_2);
				group_outros();
				validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, div3, outro_and_destroy_block, create_each_block_2, t1, get_each_context_2);
				check_outros();
			}

			if (/*$isRevealed*/ ctx[4]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty & /*$isRevealed*/ 16) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block_4(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(div2, t2);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}

			if (!/*$isRevealed*/ ctx[4] && /*votingComplete*/ ctx[2]) {
				if (if_block2) ; else {
					if_block2 = create_if_block_3(ctx);
					if_block2.c();
					if_block2.m(div0, null);
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
					if_block3.m(div1, null);
				}
			}

			if (!/*isProduction*/ ctx[8]) if_block4.p(ctx, dirty);
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type_1(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block5 = if_blocks[current_block_type_index];

				if (!if_block5) {
					if_block5 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block5.c();
				} else {
					if_block5.p(ctx, dirty);
				}

				transition_in(if_block5, 1);
				if_block5.m(div5, null);
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value_2.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			transition_in(if_block1);
			transition_in(if_block5);
			transition_in(settings.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			transition_out(if_block1);
			transition_out(if_block5);
			transition_out(settings.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block0) if_block0.d(detaching);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(div3);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			if_block3.d();
			if (detaching) detach_dev(t4);
			if (detaching) detach_dev(div8);
			if (if_block4) if_block4.d();
			if_blocks[current_block_type_index].d();
			destroy_component(settings);
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
	let votingComplete;
	let $participants;
	let $error;
	let $isRevealed;
	let $votes;
	let $user;
	let $choices;
	validate_store(participants, 'participants');
	component_subscribe($$self, participants, $$value => $$invalidate(0, $participants = $$value));
	validate_store(error, 'error');
	component_subscribe($$self, error, $$value => $$invalidate(3, $error = $$value));
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
	const isProduction = !window.location.host.includes('localhost');

	onMount(() => {
		const url = jsonScriptContents('websocket_url');
		connect(url);
	});

	let numParcitipants;
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Voting> was created with unknown prop '${key}'`);
	});

	const click_handler = () => update('add_fakes');
	const click_handler_1 = () => update('fake_votes');
	const click_handler_2 = () => update('settings', { is_spectator: false });

	$$self.$capture_state = () => ({
		confetti: t,
		onMount,
		Card,
		Participant,
		Settings,
		choices,
		clearVotes,
		connect,
		error,
		isRevealed,
		participants,
		revealVotes,
		update,
		user,
		castVote,
		votes,
		jsonScriptContents,
		isProduction,
		numParcitipants,
		votingComplete,
		$participants,
		$error,
		$isRevealed,
		$votes,
		$user,
		$choices
	});

	$$self.$inject_state = $$props => {
		if ('numParcitipants' in $$props) $$invalidate(1, numParcitipants = $$props.numParcitipants);
		if ('votingComplete' in $$props) $$invalidate(2, votingComplete = $$props.votingComplete);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$participants*/ 1) {
			$$invalidate(1, numParcitipants = $participants.length);
		}

		if ($$self.$$.dirty & /*$participants*/ 1) {
			$$invalidate(2, votingComplete = $participants.every(p => p.is_spectator || p.vote));
		}
	};

	return [
		$participants,
		numParcitipants,
		votingComplete,
		$error,
		$isRevealed,
		$votes,
		$user,
		$choices,
		isProduction,
		click_handler,
		click_handler_1,
		click_handler_2
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

/* js/App.svelte generated by Svelte v3.59.1 */
const file = "js/App.svelte";

// (14:0) {:else}
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
		source: "(14:0) {:else}",
		ctx
	});

	return block;
}

// (12:0) {#if url}
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
		source: "(12:0) {#if url}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let h1;
	let t1;
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
			h1 = element("h1");
			h1.textContent = "Planning poker";
			t1 = space();
			if_block.c();
			if_block_anchor = empty();
			add_location(h1, file, 9, 0, 192);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, h1, anchor);
			insert_dev(target, t1, anchor);
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
			if (detaching) detach_dev(h1);
			if (detaching) detach_dev(t1);
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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
