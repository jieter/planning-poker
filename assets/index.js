
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
'use strict';

function noop() { }
const identity = x => x;
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
function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
}

const is_client = typeof window !== 'undefined';
let now = is_client
    ? () => window.performance.now()
    : () => Date.now();
let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

const tasks = new Set();
function run_tasks(now) {
    tasks.forEach(task => {
        if (!task.c(now)) {
            tasks.delete(task);
            task.f();
        }
    });
    if (tasks.size !== 0)
        raf(run_tasks);
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */
function loop(callback) {
    let task;
    if (tasks.size === 0)
        raf(run_tasks);
    return {
        promise: new Promise(fulfill => {
            tasks.add(task = { c: callback, f: fulfill });
        }),
        abort() {
            tasks.delete(task);
        }
    };
}
function append(target, node) {
    target.appendChild(node);
}
function get_root_for_style(node) {
    if (!node)
        return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && root.host) {
        return root;
    }
    return node.ownerDocument;
}
function append_empty_stylesheet(node) {
    const style_element = element('style');
    append_stylesheet(get_root_for_style(node), style_element);
    return style_element.sheet;
}
function append_stylesheet(node, style) {
    append(node.head || node, style);
    return style.sheet;
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

// we need to store the information for multiple documents because a Svelte application could also contain iframes
// https://github.com/sveltejs/svelte/issues/3624
const managed_styles = new Map();
let active = 0;
// https://github.com/darkskyapp/string-hash/blob/master/index.js
function hash(str) {
    let hash = 5381;
    let i = str.length;
    while (i--)
        hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
    return hash >>> 0;
}
function create_style_information(doc, node) {
    const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
    managed_styles.set(doc, info);
    return info;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = '{\n';
    for (let p = 0; p <= 1; p += step) {
        const t = a + (b - a) * ease(p);
        keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = get_root_for_style(node);
    const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
    if (!rules[name]) {
        rules[name] = true;
        stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || '';
    node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
}
function delete_rule(node, name) {
    const previous = (node.style.animation || '').split(', ');
    const next = previous.filter(name
        ? anim => anim.indexOf(name) < 0 // remove specific animation
        : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
        node.style.animation = next.join(', ');
        active -= deleted;
        if (!active)
            clear_rules();
    }
}
function clear_rules() {
    raf(() => {
        if (active)
            return;
        managed_styles.forEach(info => {
            const { ownerNode } = info.stylesheet;
            // there is no ownerNode if it runs on jsdom.
            if (ownerNode)
                detach(ownerNode);
        });
        managed_styles.clear();
    });
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

let promise;
function wait() {
    if (!promise) {
        promise = Promise.resolve();
        promise.then(() => {
            promise = null;
        });
    }
    return promise;
}
function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
    const options = { direction: 'in' };
    let config = fn(node, params, options);
    let running = false;
    let animation_name;
    let task;
    let uid = 0;
    function cleanup() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
        tick(0, 1);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        if (task)
            task.abort();
        running = true;
        add_render_callback(() => dispatch(node, true, 'start'));
        task = loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(1, 0);
                    dispatch(node, true, 'end');
                    cleanup();
                    return running = false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(t, 1 - t);
                }
            }
            return running;
        });
    }
    let started = false;
    return {
        start() {
            if (started)
                return;
            started = true;
            delete_rule(node);
            if (is_function(config)) {
                config = config(options);
                wait().then(go);
            }
            else {
                go();
            }
        },
        invalidate() {
            started = false;
        },
        end() {
            if (running) {
                cleanup();
                running = false;
            }
        }
    };
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
    console.log(api.get());
    return api.get('csrftoken');
}

/* js/Join.svelte generated by Svelte v3.56.0 */
const file$3 = "js/Join.svelte";

// (40:12) {#if error}
function create_if_block$3(ctx) {
	let div;
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text(/*error*/ ctx[0]);
			attr_dev(div, "class", "invalid-feedback");
			add_location(div, file$3, 40, 16, 941);
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
		source: "(40:12) {#if error}",
		ctx
	});

	return block;
}

function create_fragment$3(ctx) {
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
			add_location(input0, file$3, 30, 8, 579);
			attr_dev(input1, "type", "text");
			attr_dev(input1, "name", "name");
			attr_dev(input1, "class", "form-control");
			toggle_class(input1, "is-invalid", /*error*/ ctx[0]);
			add_location(input1, file$3, 32, 12, 688);
			attr_dev(div0, "class", "col");
			add_location(div0, file$3, 31, 8, 658);
			attr_dev(input2, "type", "submit");
			attr_dev(input2, "class", "btn btn-primary");
			input2.value = "Join";
			add_location(input2, file$3, 44, 12, 1056);
			attr_dev(div1, "class", "col");
			add_location(div1, file$3, 43, 8, 1026);
			attr_dev(div2, "class", "row row-cols-lg-auto");
			add_location(div2, file$3, 29, 4, 536);
			attr_dev(input3, "type", "checkbox");
			attr_dev(input3, "name", "is_spectator");
			add_location(input3, file$3, 48, 27, 1192);
			attr_dev(label, "class", "col");
			add_location(label, file$3, 48, 8, 1173);
			attr_dev(div3, "class", "row");
			add_location(div3, file$3, 47, 4, 1147);
			attr_dev(form, "method", "post");
			add_location(form, file$3, 28, 0, 511);
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
		id: create_fragment$3.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$3($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Join', slots, []);
	let error;

	// Screen name in the poker session
	let name = '';

	onMount(() => {
		const params = new Proxy(new URLSearchParams(window.location.search),
		{
				get: (searchParams, prop) => searchParams.get(prop)
			});

		if (params.name) {
			$$invalidate(1, name = params.name);
		}
	});

	const update = () => {
		if (name) {
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
		init$1(this, options, instance$3, create_fragment$3, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Join",
			options,
			id: create_fragment$3.name
		});
	}
}

function cubicOut(t) {
    const f = t - 1.0;
    return f * f * f + 1.0;
}

function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
    const style = getComputedStyle(node);
    const target_opacity = +style.opacity;
    const transform = style.transform === 'none' ? '' : style.transform;
    const od = target_opacity * (1 - opacity);
    return {
        delay,
        duration,
        easing,
        css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
    };
}

/* js/Participant.svelte generated by Svelte v3.56.0 */
const file$2 = "js/Participant.svelte";

// (14:28)
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
		source: "(14:28) ",
		ctx
	});

	return block;
}

// (12:8) {#if user.is_spectator}
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
		source: "(12:8) {#if user.is_spectator}",
		ctx
	});

	return block;
}

// (17:12) {:else}
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
		source: "(17:12) {:else}",
		ctx
	});

	return block;
}

// (15:12) {#if isRevealed}
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
		source: "(15:12) {#if isRevealed}",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
	let div1;
	let t0_value = /*user*/ ctx[0].name + "";
	let t0;
	let t1;
	let div0;
	let div0_intro;

	function select_block_type(ctx, dirty) {
		if (/*user*/ ctx[0].is_spectator) return create_if_block$2;
		if (/*user*/ ctx[0].vote) return create_if_block_1$1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type && current_block_type(ctx);

	const block = {
		c: function create() {
			div1 = element("div");
			t0 = text(t0_value);
			t1 = space();
			div0 = element("div");
			if (if_block) if_block.c();
			attr_dev(div0, "class", "card svelte-q2po7h");
			toggle_class(div0, "isAdmin", /*user*/ ctx[0].is_admin);
			add_location(div0, file$2, 10, 4, 271);
			attr_dev(div1, "class", "participant svelte-q2po7h");
			set_style(div1, "transform", "rotate(" + (/*i*/ ctx[2] * (176 / (/*count*/ ctx[3] - 1)) - 178) + "deg) translate(33vw) rotate(90deg)");
			add_location(div1, file$2, 8, 0, 133);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, t0);
			append_dev(div1, t1);
			append_dev(div1, div0);
			if (if_block) if_block.m(div0, null);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*user*/ 1 && t0_value !== (t0_value = /*user*/ ctx[0].name + "")) set_data_dev(t0, t0_value);

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if (if_block) if_block.d(1);
				if_block = current_block_type && current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div0, null);
				}
			}

			if (dirty & /*user*/ 1) {
				toggle_class(div0, "isAdmin", /*user*/ ctx[0].is_admin);
			}

			if (dirty & /*i, count*/ 12) {
				set_style(div1, "transform", "rotate(" + (/*i*/ ctx[2] * (176 / (/*count*/ ctx[3] - 1)) - 178) + "deg) translate(33vw) rotate(90deg)");
			}
		},
		i: function intro(local) {
			if (!div0_intro) {
				add_render_callback(() => {
					div0_intro = create_in_transition(div0, fly, { duration: 800, x: 250, y: 250 });
					div0_intro.start();
				});
			}
		},
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);

			if (if_block) {
				if_block.d();
			}
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
	validate_slots('Participant', slots, []);
	let { user } = $$props;
	let { isRevealed } = $$props;
	let { i } = $$props;
	let { count } = $$props;

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
		if ('i' in $$props) $$invalidate(2, i = $$props.i);
		if ('count' in $$props) $$invalidate(3, count = $$props.count);
	};

	$$self.$capture_state = () => ({ fly, user, isRevealed, i, count });

	$$self.$inject_state = $$props => {
		if ('user' in $$props) $$invalidate(0, user = $$props.user);
		if ('isRevealed' in $$props) $$invalidate(1, isRevealed = $$props.isRevealed);
		if ('i' in $$props) $$invalidate(2, i = $$props.i);
		if ('count' in $$props) $$invalidate(3, count = $$props.count);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [user, isRevealed, i, count];
}

class Participant extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$2, create_fragment$2, safe_not_equal, { user: 0, isRevealed: 1, i: 2, count: 3 });

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

function pokerStore (websocketUrl) {
    const participants = writable([]);
    const choices = writable([]);
    const isRevealed = writable(false);
    const user = writable({});

    let socket;
    const connect = () => {
        socket = new WebSocket(websocketUrl);
        socket.onclose = () => {
            console.log('WebSocket connection closed unexpectedly. Trying to reconnect in 2s...');
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
                    break;
                case 'join':
                    participants.update((current) => {
                        return [...current, data.user];
                    });
                    break;
                case 'leave':
                    participants.update((current) => {
                        let index;
                        current.forEach((p, i) => {
                            if (p.name == data.name) {
                                index = i;
                            }
                        });
                        current.splice(index, 1);
                        return current;
                    });
                    break;
                case 'reveal':
                    isRevealed.set(true);
                    break;
                case 'clear':
                    isRevealed.set(false);
                    participants.update((current) => {
                        current.map((p) => {
                            p.vote = null;
                            return p;
                        });
                        return current;
                    });
                    break;
                case 'vote':
                    participants.update((current) => {
                        current.forEach((p) => {
                            if (p.id == data.user_id) {
                                p.vote = data.value;
                            }
                        });

                        return [...current];
                    });
                    break;
            }
        };
    };
    connect();

    // participants.subscribe((p) => console.log(p));

    async function update(action, params = undefined) {
        params = params || {};
        params.action = action;
        console.log('update', params);
        socket.send(JSON.stringify(params));
    }
    return { participants, isRevealed, user, choices, update };
}

/* js/Voting.svelte generated by Svelte v3.56.0 */
const file$1 = "js/Voting.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[13] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[10] = list[i];
	child_ctx[17] = i;
	return child_ctx;
}

// (21:4) {:else}
function create_else_block$1(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Nobody here yet.");
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
		id: create_else_block$1.name,
		type: "else",
		source: "(21:4) {:else}",
		ctx
	});

	return block;
}

// (19:4) {#each $participants as user, i (user.id)}
function create_each_block_1(key_1, ctx) {
	let first;
	let participant;
	let current;

	participant = new Participant({
			props: {
				isRevealed: /*$isRevealed*/ ctx[0],
				user: /*user*/ ctx[10],
				i: /*i*/ ctx[17],
				count: /*$participants*/ ctx[1].length
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
			if (dirty & /*$isRevealed*/ 1) participant_changes.isRevealed = /*$isRevealed*/ ctx[0];
			if (dirty & /*$participants*/ 2) participant_changes.user = /*user*/ ctx[10];
			if (dirty & /*$participants*/ 2) participant_changes.i = /*i*/ ctx[17];
			if (dirty & /*$participants*/ 2) participant_changes.count = /*$participants*/ ctx[1].length;
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
		id: create_each_block_1.name,
		type: "each",
		source: "(19:4) {#each $participants as user, i (user.id)}",
		ctx
	});

	return block;
}

// (25:8) {#if $user.is_spectator}
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
		source: "(25:8) {#if $user.is_spectator}",
		ctx
	});

	return block;
}

// (28:8) {#if $user.is_admin}
function create_if_block_1(ctx) {
	let div;
	let button0;
	let t0;
	let t1;
	let button1;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			button0 = element("button");
			t0 = text("Reveal");
			t1 = space();
			button1 = element("button");
			button1.textContent = "Clear";
			attr_dev(button0, "class", "btn btn-primary");
			button0.disabled = /*$isRevealed*/ ctx[0];
			add_location(button0, file$1, 29, 16, 869);
			attr_dev(button1, "class", "btn btn-danger");
			add_location(button1, file$1, 30, 16, 974);
			attr_dev(div, "class", "btn-group");
			add_location(div, file$1, 28, 12, 829);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, button0);
			append_dev(button0, t0);
			append_dev(div, t1);
			append_dev(div, button1);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*reveal*/ ctx[8], false, false, false, false),
					listen_dev(button1, "click", /*clear*/ ctx[9], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$isRevealed*/ 1) {
				prop_dev(button0, "disabled", /*$isRevealed*/ ctx[0]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(28:8) {#if $user.is_admin}",
		ctx
	});

	return block;
}

// (36:0) {#if !$user.is_spectator}
function create_if_block$1(ctx) {
	let div1;
	let div0;
	let each_value = /*$choices*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div0, "class", "btn-group");
			add_location(div0, file$1, 37, 8, 1152);
			attr_dev(div1, "class", "text-center");
			add_location(div1, file$1, 36, 4, 1118);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div0, null);
				}
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$isRevealed, vote, $choices*/ 137) {
				each_value = /*$choices*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div0, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(36:0) {#if !$user.is_spectator}",
		ctx
	});

	return block;
}

// (39:12) {#each $choices as choice}
function create_each_block(ctx) {
	let button;
	let t_value = /*choice*/ ctx[13] + "";
	let t;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			button = element("button");
			t = text(t_value);
			attr_dev(button, "class", "btn btn-secondary");
			button.disabled = /*$isRevealed*/ ctx[0];
			add_location(button, file$1, 39, 16, 1231);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);
			append_dev(button, t);

			if (!mounted) {
				dispose = listen_dev(
					button,
					"click",
					function () {
						if (is_function(/*vote*/ ctx[7](/*choice*/ ctx[13]))) /*vote*/ ctx[7](/*choice*/ ctx[13]).apply(this, arguments);
					},
					false,
					false,
					false,
					false
				);

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*$choices*/ 8 && t_value !== (t_value = /*choice*/ ctx[13] + "")) set_data_dev(t, t_value);

			if (dirty & /*$isRevealed*/ 1) {
				prop_dev(button, "disabled", /*$isRevealed*/ ctx[0]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(39:12) {#each $choices as choice}",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let div1;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let t0;
	let div0;
	let t1;
	let t2;
	let if_block2_anchor;
	let current;
	let each_value_1 = /*$participants*/ ctx[1];
	validate_each_argument(each_value_1);
	const get_key = ctx => /*user*/ ctx[10].id;
	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

	for (let i = 0; i < each_value_1.length; i += 1) {
		let child_ctx = get_each_context_1(ctx, each_value_1, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
	}

	let each_1_else = null;

	if (!each_value_1.length) {
		each_1_else = create_else_block$1(ctx);
	}

	let if_block0 = /*$user*/ ctx[2].is_spectator && create_if_block_2(ctx);
	let if_block1 = /*$user*/ ctx[2].is_admin && create_if_block_1(ctx);
	let if_block2 = !/*$user*/ ctx[2].is_spectator && create_if_block$1(ctx);

	const block = {
		c: function create() {
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			if (each_1_else) {
				each_1_else.c();
			}

			t0 = space();
			div0 = element("div");
			if (if_block0) if_block0.c();
			t1 = space();
			if (if_block1) if_block1.c();
			t2 = space();
			if (if_block2) if_block2.c();
			if_block2_anchor = empty();
			attr_dev(div0, "class", "controls svelte-1a31h03");
			add_location(div0, file$1, 23, 4, 682);
			attr_dev(div1, "class", "participants svelte-1a31h03");
			add_location(div1, file$1, 17, 0, 466);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div1, null);
				}
			}

			if (each_1_else) {
				each_1_else.m(div1, null);
			}

			append_dev(div1, t0);
			append_dev(div1, div0);
			if (if_block0) if_block0.m(div0, null);
			append_dev(div0, t1);
			if (if_block1) if_block1.m(div0, null);
			insert_dev(target, t2, anchor);
			if (if_block2) if_block2.m(target, anchor);
			insert_dev(target, if_block2_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*$isRevealed, $participants*/ 3) {
				each_value_1 = /*$participants*/ ctx[1];
				validate_each_argument(each_value_1);
				group_outros();
				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div1, outro_and_destroy_block, create_each_block_1, t0, get_each_context_1);
				check_outros();

				if (each_value_1.length) {
					if (each_1_else) {
						each_1_else.d(1);
						each_1_else = null;
					}
				} else if (!each_1_else) {
					each_1_else = create_else_block$1(ctx);
					each_1_else.c();
					each_1_else.m(div1, t0);
				}
			}

			if (/*$user*/ ctx[2].is_spectator) {
				if (if_block0) ; else {
					if_block0 = create_if_block_2(ctx);
					if_block0.c();
					if_block0.m(div0, t1);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*$user*/ ctx[2].is_admin) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_1(ctx);
					if_block1.c();
					if_block1.m(div0, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (!/*$user*/ ctx[2].is_spectator) {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = create_if_block$1(ctx);
					if_block2.c();
					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
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
			if (detaching) detach_dev(div1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			if (each_1_else) each_1_else.d();
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (detaching) detach_dev(t2);
			if (if_block2) if_block2.d(detaching);
			if (detaching) detach_dev(if_block2_anchor);
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
	let $isRevealed;
	let $participants;
	let $user;
	let $choices;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Voting', slots, []);
	const url = jsonScriptContents('websocket_url');
	const { user, participants, isRevealed, choices, update } = pokerStore(url);
	validate_store(user, 'user');
	component_subscribe($$self, user, value => $$invalidate(2, $user = value));
	validate_store(participants, 'participants');
	component_subscribe($$self, participants, value => $$invalidate(1, $participants = value));
	validate_store(isRevealed, 'isRevealed');
	component_subscribe($$self, isRevealed, value => $$invalidate(0, $isRevealed = value));
	validate_store(choices, 'choices');
	component_subscribe($$self, choices, value => $$invalidate(3, $choices = value));

	const vote = value => () => {
		if (!$isRevealed) {
			update('vote', { value });
		}
	};

	const reveal = () => update('reveal');
	const clear = () => update('clear');
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Voting> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		Participant,
		pokerStore,
		jsonScriptContents,
		url,
		user,
		participants,
		isRevealed,
		choices,
		update,
		vote,
		reveal,
		clear,
		$isRevealed,
		$participants,
		$user,
		$choices
	});

	return [
		$isRevealed,
		$participants,
		$user,
		$choices,
		participants,
		isRevealed,
		choices,
		vote,
		reveal,
		clear,
		user
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
