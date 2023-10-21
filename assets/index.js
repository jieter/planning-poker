var app=function(){"use strict";function t(){}function e(t,e){for(const n in e)t[n]=e[n];return t}function n(t){return t()}function o(){return Object.create(null)}function r(t){t.forEach(n)}function c(t){return"function"==typeof t}function i(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function s(e,...n){if(null==e){for(const t of n)t(void 0);return t}const o=e.subscribe(...n);return o.unsubscribe?()=>o.unsubscribe():o}function l(t,e,n){t.$$.on_destroy.push(s(e,n))}function a(t,n,o,r){return t[1]&&r?e(o.ctx.slice(),t[1](r(n))):o.ctx}function u(t,e){const n={};e=new Set(e);for(const o in t)e.has(o)||"$"===o[0]||(n[o]=t[o]);return n}function f(t,e){t.appendChild(e)}function d(t,e,n){t.insertBefore(e,n||null)}function p(t){t.parentNode&&t.parentNode.removeChild(t)}function g(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function m(t){return document.createElement(t)}function h(t){return document.createTextNode(t)}function v(){return h(" ")}function $(){return h("")}function b(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function y(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}const x=["width","height"];function k(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const o in e)null==e[o]?t.removeAttribute(o):"style"===o?t.style.cssText=e[o]:"__value"===o?t.value=t[o]=e[o]:n[o]&&n[o].set&&-1===x.indexOf(o)?t[o]=e[o]:y(t,o,e[o])}function w(t,e){e=""+e,t.data!==e&&(t.data=e)}function _(t,e){t.value=null==e?"":e}function S(t,e,n,o){null==n?t.style.removeProperty(e):t.style.setProperty(e,n,o?"important":"")}function C(t,e,n){t.classList.toggle(e,!!n)}let N;function O(t){N=t}function z(t){(function(){if(!N)throw new Error("Function called outside component initialization");return N})().$$.on_mount.push(t)}const E=[],j=[];let A=[];const R=[],W=Promise.resolve();let J=!1;function M(t){A.push(t)}const I=new Set;let P=0;function B(){if(0!==P)return;const t=N;do{try{for(;P<E.length;){const t=E[P];P++,O(t),G(t.$$)}}catch(t){throw E.length=0,P=0,t}for(O(null),E.length=0,P=0;j.length;)j.pop()();for(let t=0;t<A.length;t+=1){const e=A[t];I.has(e)||(I.add(e),e())}A.length=0}while(E.length);for(;R.length;)R.pop()();J=!1,I.clear(),O(t)}function G(t){if(null!==t.fragment){t.update(),r(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(M)}}const T=new Set;let X;function L(){X={r:0,c:[],p:X}}function H(){X.r||r(X.c),X=X.p}function D(t,e){t&&t.i&&(T.delete(t),t.i(e))}function F(t,e,n,o){if(t&&t.o){if(T.has(t))return;T.add(t),X.c.push((()=>{T.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}else o&&o()}function U(t){return void 0!==t?.length?t:Array.from(t)}function q(t,e){F(t,1,1,(()=>{e.delete(t.key)}))}function V(t,e,n,o,c,i,s,l,a,u,f,d){let p=t.length,g=i.length,m=p;const h={};for(;m--;)h[t[m].key]=m;const v=[],$=new Map,b=new Map,y=[];for(m=g;m--;){const t=d(c,i,m),r=n(t);let l=s.get(r);l?o&&y.push((()=>l.p(t,e))):(l=u(r,t),l.c()),$.set(r,v[m]=l),r in h&&b.set(r,Math.abs(m-h[r]))}const x=new Set,k=new Set;function w(t){D(t,1),t.m(l,f),s.set(t.key,t),f=t.first,g--}for(;p&&g;){const e=v[g-1],n=t[p-1],o=e.key,r=n.key;e===n?(f=e.first,p--,g--):$.has(r)?!s.has(o)||x.has(o)?w(e):k.has(r)?p--:b.get(o)>b.get(r)?(k.add(o),w(e)):(x.add(r),p--):(a(n,s),p--)}for(;p--;){const e=t[p];$.has(e.key)||a(e,s)}for(;g;)w(v[g-1]);return r(y),v}function Y(t){t&&t.c()}function K(t,e,o){const{fragment:i,after_update:s}=t.$$;i&&i.m(e,o),M((()=>{const e=t.$$.on_mount.map(n).filter(c);t.$$.on_destroy?t.$$.on_destroy.push(...e):r(e),t.$$.on_mount=[]})),s.forEach(M)}function Q(t,e){const n=t.$$;null!==n.fragment&&(!function(t){const e=[],n=[];A.forEach((o=>-1===t.indexOf(o)?e.push(o):n.push(o))),n.forEach((t=>t())),A=e}(n.after_update),r(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Z(t,e){-1===t.$$.dirty[0]&&(E.push(t),J||(J=!0,W.then(B)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function tt(e,n,c,i,s,l,a=null,u=[-1]){const f=N;O(e);const d=e.$$={fragment:null,ctx:[],props:l,update:t,not_equal:s,bound:o(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(f?f.$$.context:[])),callbacks:o(),dirty:u,skip_bound:!1,root:n.target||f.$$.root};a&&a(d.root);let g=!1;if(d.ctx=c?c(e,n.props||{},((t,n,...o)=>{const r=o.length?o[0]:n;return d.ctx&&s(d.ctx[t],d.ctx[t]=r)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](r),g&&Z(e,t)),n})):[],d.update(),g=!0,r(d.before_update),d.fragment=!!i&&i(d.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);d.fragment&&d.fragment.l(t),t.forEach(p)}else d.fragment&&d.fragment.c();n.intro&&D(e.$$.fragment),K(e,n.target,n.anchor),B()}O(f)}class et{$$=void 0;$$set=void 0;$destroy(){Q(this,1),this.$destroy=t}$on(e,n){if(!c(n))return t;const o=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return o.push(n),()=>{const t=o.indexOf(n);-1!==t&&o.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function nt(t){let e,n;const o=t[4].default,r=function(t,e,n,o){if(t){const r=a(t,e,n,o);return t[0](r)}}(o,t,t[3],null);return{c(){e=m("div"),r&&r.c(),y(e,"class","deck-card svelte-gm52mk"),S(e,"background-color",t[0]||"#d8f7ec"),S(e,"height",t[1]+"px"),S(e,"width",.65*t[1]+"px")},m(t,o){d(t,e,o),r&&r.m(e,null),n=!0},p(t,[c]){r&&r.p&&(!n||8&c)&&function(t,e,n,o,r,c){if(r){const i=a(e,n,o,c);t.p(i,r)}}(r,o,t,t[3],n?function(t,e,n,o){if(t[2]&&o){const r=t[2](o(n));if(void 0===e.dirty)return r;if("object"==typeof r){const t=[],n=Math.max(e.dirty.length,r.length);for(let o=0;o<n;o+=1)t[o]=e.dirty[o]|r[o];return t}return e.dirty|r}return e.dirty}(o,t[3],c,null):function(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let t=0;t<n;t++)e[t]=-1;return e}return-1}(t[3]),null),(!n||1&c)&&S(e,"background-color",t[0]||"#d8f7ec"),(!n||2&c)&&S(e,"height",t[1]+"px"),(!n||2&c)&&S(e,"width",.65*t[1]+"px")},i(t){n||(D(r,t),n=!0)},o(t){F(r,t),n=!1},d(t){t&&p(e),r&&r.d(t)}}}function ot(t,e,n){let o,{$$slots:r={},$$scope:c}=e,{color:i=null}=e,{size:s="regular"}=e;return t.$$set=t=>{"color"in t&&n(0,i=t.color),"size"in t&&n(2,s=t.size),"$$scope"in t&&n(3,c=t.$$scope)},t.$$.update=()=>{4&t.$$.dirty&&n(1,o="sm"==s?45:70)},[i,o,s,c,r]}"undefined"!=typeof window&&(window.__svelte||(window.__svelte={v:new Set})).v.add("4");class rt extends et{constructor(t){super(),tt(this,t,ot,nt,i,{color:0,size:2})}}
/*! js-cookie v3.0.5 | MIT */function ct(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var o in n)t[o]=n[o]}return t}var it=function t(e,n){function o(t,o,r){if("undefined"!=typeof document){"number"==typeof(r=ct({},n,r)).expires&&(r.expires=new Date(Date.now()+864e5*r.expires)),r.expires&&(r.expires=r.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var c="";for(var i in r)r[i]&&(c+="; "+i,!0!==r[i]&&(c+="="+r[i].split(";")[0]));return document.cookie=t+"="+e.write(o,t)+c}}return Object.create({set:o,get:function(t){if("undefined"!=typeof document&&(!arguments.length||t)){for(var n=document.cookie?document.cookie.split("; "):[],o={},r=0;r<n.length;r++){var c=n[r].split("="),i=c.slice(1).join("=");try{var s=decodeURIComponent(c[0]);if(o[s]=e.read(i,s),t===s)break}catch(t){}}return t?o[t]:o}},remove:function(t,e){o(t,"",ct({},e,{expires:-1}))},withAttributes:function(e){return t(this.converter,ct({},this.attributes,e))},withConverter:function(e){return t(ct({},this.converter,e),this.attributes)}},{attributes:{value:Object.freeze(n)},converter:{value:Object.freeze(e)}})}({read:function(t){return'"'===t[0]&&(t=t.slice(1,-1)),t.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(t){return encodeURIComponent(t).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"});function st(t){let e=document.getElementById(t);if(e)return JSON.parse(e.textContent)}function lt(t,e,n){const o=t.slice();return o[7]=e[n],o}function at(t,e,n){const o=t.slice();return o[10]=e[n][0],o[11]=e[n][1],o}function ut(t,e,n){const o=t.slice();return o[14]=e[n][0],o[15]=e[n][1],o}function ft(t){let e,n;return{c(){e=m("div"),n=h(t[2]),y(e,"class","invalid-feedback")},m(t,o){d(t,e,o),f(e,n)},p(t,e){4&e&&w(n,t[2])},d(t){t&&p(e)}}}function dt(t){let e,n,o,r,c,i=U(t[3].basic),s=[];for(let e=0;e<i.length;e+=1)s[e]=pt(ut(t,i,e));let l=U(t[3].decks),a=[];for(let e=0;e<l.length;e+=1)a[e]=ht(lt(t,l,e));const u=t=>F(a[t],1,1,(()=>{a[t]=null}));return{c(){e=m("div");for(let t=0;t<s.length;t+=1)s[t].c();n=v(),o=m("div"),r=m("div");for(let t=0;t<a.length;t+=1)a[t].c();y(e,"class","col-md-3"),y(r,"class","m-1"),y(o,"class","col-md-6")},m(t,i){d(t,e,i);for(let t=0;t<s.length;t+=1)s[t]&&s[t].m(e,null);d(t,n,i),d(t,o,i),f(o,r);for(let t=0;t<a.length;t+=1)a[t]&&a[t].m(r,null);c=!0},p(t,n){if(8&n){let o;for(i=U(t[3].basic),o=0;o<i.length;o+=1){const r=ut(t,i,o);s[o]?s[o].p(r,n):(s[o]=pt(r),s[o].c(),s[o].m(e,null))}for(;o<s.length;o+=1)s[o].d(1);s.length=i.length}if(8&n){let e;for(l=U(t[3].decks),e=0;e<l.length;e+=1){const o=lt(t,l,e);a[e]?(a[e].p(o,n),D(a[e],1)):(a[e]=ht(o),a[e].c(),D(a[e],1),a[e].m(r,null))}for(L(),e=l.length;e<a.length;e+=1)u(e);H()}},i(t){if(!c){for(let t=0;t<l.length;t+=1)D(a[t]);c=!0}},o(t){a=a.filter(Boolean);for(let t=0;t<a.length;t+=1)F(a[t]);c=!1},d(t){t&&(p(e),p(n),p(o)),g(s,t),g(a,t)}}}function pt(t){let e,n,o,r,c,i,s=t[14]+"",l=t[15]+"";return{c(){e=m("div"),n=h(s),o=v(),r=m("span"),c=h(l),i=v(),y(r,"class","badge bg-primary rounded-pill"),y(e,"class","d-flex justify-content-between align-items-center p-1")},m(t,s){d(t,e,s),f(e,n),f(e,o),f(e,r),f(r,c),f(e,i)},p(t,e){8&e&&s!==(s=t[14]+"")&&w(n,s),8&e&&l!==(l=t[15]+"")&&w(c,l)},d(t){t&&p(e)}}}function gt(t){let e,n=t[10]+"";return{c(){e=h(n)},m(t,n){d(t,e,n)},p(t,o){8&o&&n!==(n=t[10]+"")&&w(e,n)},d(t){t&&p(e)}}}function mt(t){let e,n,o,r,c,i,s,l=t[11]+"";return n=new rt({props:{size:"sm",$$slots:{default:[gt]},$$scope:{ctx:t}}}),{c(){e=m("div"),Y(n.$$.fragment),o=v(),r=m("div"),c=h(l),i=h("x"),y(r,"class","text-muted"),y(e,"class","d-inline-block text-center")},m(t,l){d(t,e,l),K(n,e,null),f(e,o),f(e,r),f(r,c),f(r,i),s=!0},p(t,e){const o={};262152&e&&(o.$$scope={dirty:e,ctx:t}),n.$set(o),(!s||8&e)&&l!==(l=t[11]+"")&&w(c,l)},i(t){s||(D(n.$$.fragment,t),s=!0)},o(t){F(n.$$.fragment,t),s=!1},d(t){t&&p(e),Q(n)}}}function ht(t){let e,n,o,r=U(t[7]),c=[];for(let e=0;e<r.length;e+=1)c[e]=mt(at(t,r,e));const i=t=>F(c[t],1,1,(()=>{c[t]=null}));return{c(){e=m("div");for(let t=0;t<c.length;t+=1)c[t].c();n=v(),y(e,"class","d-flex overflow-scroll")},m(t,r){d(t,e,r);for(let t=0;t<c.length;t+=1)c[t]&&c[t].m(e,null);f(e,n),o=!0},p(t,o){if(8&o){let s;for(r=U(t[7]),s=0;s<r.length;s+=1){const i=at(t,r,s);c[s]?(c[s].p(i,o),D(c[s],1)):(c[s]=mt(i),c[s].c(),D(c[s],1),c[s].m(e,n))}for(L(),s=r.length;s<c.length;s+=1)i(s);H()}},i(t){if(!o){for(let t=0;t<r.length;t+=1)D(c[t]);o=!0}},o(t){c=c.filter(Boolean);for(let t=0;t<c.length;t+=1)F(c[t]);o=!1},d(t){t&&p(e),g(c,t)}}}function vt(t){let e,n,o,c,i,s,l,a,u,g,$,x,k,w,S,N,O,z,E,j,A,R,W,J,M,I,P,B,G,T,X,U,q=t[2]&&ft(t),V=t[3]&&dt(t);return{c(){e=m("div"),n=m("div"),o=m("div"),c=m("h1"),c.textContent="Planning poker",i=v(),s=m("form"),l=m("div"),a=m("input"),u=v(),g=m("div"),$=m("input"),x=v(),q&&q.c(),k=v(),w=m("div"),w.innerHTML='<input type="submit" class="btn btn-primary" value="Join"/>',S=v(),N=m("div"),O=m("label"),z=m("input"),E=h(" Join as a spectator 👁️"),j=v(),A=m("span"),A.textContent="You can always enable voting later",R=v(),W=m("div"),J=m("div"),M=m("hr"),I=v(),P=m("div"),V&&V.c(),B=v(),G=m("div"),G.innerHTML='GitHub: <a href="https://github.com/jieter/planning-poker">jieter/planning-poker</a>',y(c,"class","mt-4"),y(a,"type","hidden"),y(a,"name","csrfmiddlewaretoken"),a.value=it.get("csrftoken"),y($,"type","text"),y($,"name","name"),y($,"class","form-control"),C($,"is-invalid",t[2]),y(g,"class","col"),y(w,"class","col"),y(l,"class","row row-cols-lg-auto"),y(z,"type","checkbox"),y(z,"name","is_spectator"),y(O,"class","col"),y(A,"class","text-muted"),y(N,"class","row"),y(s,"method","post"),y(o,"class","col"),y(n,"class","row"),y(e,"class","container"),y(G,"class","col-md-2"),y(P,"class","row"),y(J,"class","container small"),y(W,"class","fixed-bottom mb-3")},m(r,p){d(r,e,p),f(e,n),f(n,o),f(o,c),f(o,i),f(o,s),f(s,l),f(l,a),f(l,u),f(l,g),f(g,$),_($,t[0]),f(g,x),q&&q.m(g,null),f(l,k),f(l,w),f(s,S),f(s,N),f(N,O),f(O,z),z.checked=t[1],f(O,E),f(N,j),f(N,A),d(r,R,p),d(r,W,p),f(W,J),f(J,M),f(J,I),f(J,P),V&&V.m(P,null),f(P,B),f(P,G),T=!0,X||(U=[b($,"change",t[4]),b($,"input",t[5]),b(z,"change",t[6])],X=!0)},p(t,[e]){1&e&&$.value!==t[0]&&_($,t[0]),(!T||4&e)&&C($,"is-invalid",t[2]),t[2]?q?q.p(t,e):(q=ft(t),q.c(),q.m(g,null)):q&&(q.d(1),q=null),2&e&&(z.checked=t[1]),t[3]?V?(V.p(t,e),8&e&&D(V,1)):(V=dt(t),V.c(),D(V,1),V.m(P,B)):V&&(L(),F(V,1,1,(()=>{V=null})),H())},i(t){T||(D(V),T=!0)},o(t){F(V),T=!1},d(t){t&&(p(e),p(R),p(W)),q&&q.d(),V&&V.d(),X=!1,r(U)}}}function $t(t,e,n){let o,r,c="",i=null;z((()=>{const t=localStorage.getItem("name");t&&n(0,c=t);const e=localStorage.getItem("isSpectator");null!==e&&n(1,i="true"===e),n(3,r=st("statistics")),console.log(r)}));return t.$$.update=()=>{1&t.$$.dirty&&c&&localStorage.setItem("name",c),2&t.$$.dirty&&null!=i&&localStorage.setItem("isSpectator",i?"true":"false")},[c,i,o,r,()=>{n(2,o=c?void 0:"Name cannot be empty")},function(){c=this.value,n(0,c)},function(){i=this.checked,n(1,i)}]}class bt extends et{constructor(t){super(),tt(this,t,$t,vt,i,{})}}const yt=[];function xt(e,n=t){let o;const r=new Set;function c(t){if(i(e,t)&&(e=t,o)){const t=!yt.length;for(const t of r)t[1](),yt.push(t,e);if(t){for(let t=0;t<yt.length;t+=2)yt[t][0](yt[t+1]);yt.length=0}}}function s(t){c(t(e))}return{set:c,update:s,subscribe:function(i,l=t){const a=[i,l];return r.add(a),1===r.size&&(o=n(c,s)||t),i(e),()=>{r.delete(a),0===r.size&&o&&(o(),o=null)}}}}function kt(e,n,o){const i=!Array.isArray(e),l=i?[e]:e;if(!l.every(Boolean))throw new Error("derived() expects stores as input, got a falsy value");const a=n.length<2;return u=(e,o)=>{let u=!1;const f=[];let d=0,p=t;const g=()=>{if(d)return;p();const r=n(i?f[0]:f,e,o);a?e(r):p=c(r)?r:t},m=l.map(((t,e)=>s(t,(t=>{f[e]=t,d&=~(1<<e),u&&g()}),(()=>{d|=1<<e}))));return u=!0,g(),function(){r(m),p(),u=!1}},{subscribe:xt(o,u).subscribe};var u}const wt=xt([]),_t=xt([]),St=xt([]),Ct=xt(!1),Nt=xt("tshirt"),Ot=xt(!1),zt=xt({}),Et=xt(void 0),jt=xt([]);function At(t){const e=new Proxy({},{get:(t,e)=>e in t?t[e]:0});return t.forEach((t=>{null!=t&&(e[t]+=1)})),Object.entries(e).sort(((t,e)=>e[1]-t[1]))}const Rt=kt(wt,(t=>At(t.map((t=>t.vote))))),Wt=kt(wt,(t=>t.every((t=>t.is_spectator||t.vote)))),Jt=t=>{zt.update((e=>(e.vote=t,e)))};let Mt;function It(t,e=void 0){Mt&&1==Mt.readyState?((e=e||{}).action=t,console.log("update",e),Mt.send(JSON.stringify(e))):console.log("Socket not open yet")}function Pt(t){Mt=new WebSocket(t),Mt.onclose=()=>{Et.set("WebSocket connection closed unexpectedly. Trying to reconnect in 2s..."),setTimeout((()=>{console.log("Reconnecting..."),Pt(t)}),2e3)},Mt.onopen=()=>{It({action:"init"})},Mt.onmessage=t=>{const e=JSON.parse(t.data);switch(console.log("message",e),e.type){case"init":wt.set(e.users),zt.set(e.user),_t.set(e.settings.choices),Ct.set(e.settings.auto_reveal),Ot.set(e.settings.is_revealed),St.set(e.settings.decks),Nt.set(e.settings.deck),jt.set(e.log),Et.set(void 0);break;case"vote":wt.update((t=>(t.forEach((t=>{t.id==e.user_id&&(t.vote=e.value)})),[...t])));break;case"error":Et.set(e.message)}}}const Bt=()=>It("reveal"),Gt=()=>{Jt(null),It("clear")};function Tt(t){return()=>{(function(t){let e;return s(t,(t=>e=t))(),e})(Ot)||(It("vote",{value:t}),Jt(t))}}function Xt(t,e,n){const o=t.slice();return o[14]=e[n],o}function Lt(t){let e,n,o,r,c,i,s,l,a=t[14].time+"",u=t[14].event+"",g=JSON.stringify(t[14].data)+"";return{c(){e=m("div"),n=m("span"),o=h(a),r=v(),c=h(u),i=v(),s=h(g),l=v()},m(t,a){d(t,e,a),f(e,n),f(n,o),f(e,r),f(e,c),f(e,i),f(e,s),f(e,l)},p(t,e){16&e&&a!==(a=t[14].time+"")&&w(o,a),16&e&&u!==(u=t[14].event+"")&&w(c,u),16&e&&g!==(g=JSON.stringify(t[14].data)+"")&&w(s,g)},d(t){t&&p(e)}}}function Ht(e){let n,o,c,i,s,l,a,u,$,x,k,_,S,C,N,O,z,E,j,A,R,W,J,M,I=JSON.stringify(e[0])+"",P=JSON.stringify(e[1])+"",B=JSON.stringify(e[2])+"",G=JSON.stringify(e[3])+"",T=!e[5]&&function(t){let e,n,o,c,i;return{c(){e=m("button"),e.textContent="Add fake users",n=v(),o=m("button"),o.textContent="Add fake votes",y(e,"class","btn btn-xs btn-warning"),y(o,"class","btn btn-xs btn-warning")},m(r,s){d(r,e,s),d(r,n,s),d(r,o,s),c||(i=[b(e,"click",t[12]),b(o,"click",t[13])],c=!0)},d(t){t&&(p(e),p(n),p(o)),c=!1,r(i)}}}(e),X=U(e[4]),L=[];for(let t=0;t<X.length;t+=1)L[t]=Lt(Xt(e,X,t));return{c(){n=m("div"),o=m("div"),c=m("div"),i=h("debug"),s=m("code"),l=h(I),a=v(),u=m("div"),$=h("votes: "),x=m("code"),k=h(P),_=v(),S=m("div"),C=h("user: "),N=m("code"),O=h(B),z=v(),E=m("div"),j=h("participants: "),A=m("code"),R=h(G),W=v(),T&&T.c(),J=v(),M=m("div");for(let t=0;t<L.length;t+=1)L[t].c();y(o,"class","col"),y(M,"class","col"),y(n,"class","row bg-light rounded p-2 small")},m(t,e){d(t,n,e),f(n,o),f(o,c),f(c,i),f(c,s),f(s,l),f(o,a),f(o,u),f(u,$),f(u,x),f(x,k),f(o,_),f(o,S),f(S,C),f(S,N),f(N,O),f(o,z),f(o,E),f(E,j),f(E,A),f(A,R),f(o,W),T&&T.m(o,null),f(n,J),f(n,M);for(let t=0;t<L.length;t+=1)L[t]&&L[t].m(M,null)},p(t,[e]){if(1&e&&I!==(I=JSON.stringify(t[0])+"")&&w(l,I),2&e&&P!==(P=JSON.stringify(t[1])+"")&&w(k,P),4&e&&B!==(B=JSON.stringify(t[2])+"")&&w(O,B),8&e&&G!==(G=JSON.stringify(t[3])+"")&&w(R,G),16&e){let n;for(X=U(t[4]),n=0;n<X.length;n+=1){const o=Xt(t,X,n);L[n]?L[n].p(o,e):(L[n]=Lt(o),L[n].c(),L[n].m(M,null))}for(;n<L.length;n+=1)L[n].d(1);L.length=X.length}},i:t,o:t,d(t){t&&p(n),T&&T.d(),g(L,t)}}}function Dt(t,e,n){let o,r,c,i,s,a,u,f,d,p,g;l(t,Ct,(t=>n(6,r=t))),l(t,Ot,(t=>n(7,c=t))),l(t,_t,(t=>n(8,i=t))),l(t,St,(t=>n(9,s=t))),l(t,Nt,(t=>n(10,a=t))),l(t,Et,(t=>n(11,u=t))),l(t,Rt,(t=>n(1,f=t))),l(t,zt,(t=>n(2,d=t))),l(t,wt,(t=>n(3,p=t))),l(t,jt,(t=>n(4,g=t)));const m=!window.location.host.includes("localhost");return t.$$.update=()=>{4032&t.$$.dirty&&n(0,o={error:u,deck:a,decks:s,choices:i,isRevealed:c,autoReveal:r})},[o,f,d,p,g,m,r,c,i,s,a,u,()=>It("add_fakes"),()=>It("fake_votes")]}Nt.subscribe((t=>It("settings",{deck:t}))),Ct.subscribe((t=>It("settings",{auto_reveal:t})));class Ft extends et{constructor(t){super(),tt(this,t,Dt,Ht,i,{})}}const Ut=(t,e={})=>{me(e);let{colors:n=["#FFC700","#FF0000","#2E3191","#41BBC7"],duration:o=3500,force:r=.5,particleCount:c=150,particleShape:i="mix",particleSize:s=12,destroyAfterDone:l=!0,stageHeight:a=800,stageWidth:u=1600}=e;!function(t){const e=re("style");e.dataset.neoconfetti="",e.textContent='@keyframes fk9XWG_y-axis{to{transform:translate3d(0,var(--stage-height),0)}}@keyframes fk9XWG_x-axis{to{transform:translate3d(var(--x-landing-point),0,0)}}@keyframes fk9XWG_rotation{50%{transform:rotate3d(var(--half-rotation),180deg)}to{transform:rotate3d(var(--rotation),360deg)}}.fk9XWG_container{width:0;height:0;z-index:1200;position:relative;overflow:visible}.fk9XWG_particle{animation:x-axis var(--duration-chaos)forwards cubic-bezier(var(--x1),var(--x2),var(--x3),var(--x4));animation-name:fk9XWG_x-axis}.fk9XWG_particle>div{animation:y-axis var(--duration-chaos)forwards cubic-bezier(var(--y1),var(--y2),var(--y3),var(--y4));width:var(--width);height:var(--height);animation-name:fk9XWG_y-axis;position:absolute;top:0;left:0}.fk9XWG_particle>div:before{height:100%;width:100%;content:"";background-color:var(--bgcolor);animation:rotation var(--rotation-duration)infinite linear;border-radius:var(--border-radius);animation-name:fk9XWG_rotation;display:block}',ce(document.head,e)}(),t.classList.add("fk9XWG_container"),t.style.setProperty("--stage-height",a+"px");let f,d=ie(c,n),p=qt(t,d);function g(t,e){const n=ne(ee()*(fe-1)),c="rectangles"!==i&&("circles"===i||de(n)),l=(e,n)=>t.style.setProperty(e,n+"");l("--x-landing-point",le(te(ae(e,90)-180),0,180,-u/2,u/2)+"px"),l("--duration-chaos",o-ne(1e3*ee())+"ms");const a=ee()<Kt?se(ee()*Qt,2):0;l("--x1",a),l("--x2",-1*a),l("--x3",a),l("--x4",se(te(le(te(ae(e,90)-180),0,180,-1,1)),4)),l("--y1",se(ee()*Zt,4)),l("--y2",se(ee()*r*(ue()?1:-1),4)),l("--y3",Zt),l("--y4",se(oe(le(te(e-180),0,180,r,-r),0),4)),l("--width",(c?s:ne(4*ee())+s/2)+"px"),l("--height",(c?s:ne(2*ee())+s)+"px");const f=n.toString(2).padStart(3,"0").split("");l("--half-rotation",f.map((t=>+t/2+""))),l("--rotation",f),l("--rotation-duration",se(ee()*(Yt-Vt)+Vt)+"ms"),l("--border-radius",c?"50%":0)}for(const[t,e]of Object.entries(p))g(e,d[+t].degree);return Promise.resolve().then((()=>f=setTimeout((()=>l&&(t.innerHTML="")),o))),{update(e){me(e);const g=e.particleCount??c,m=e.colors??n,h=e.stageHeight??a;if(d=ie(g,m),g===c&&JSON.stringify(n)!==JSON.stringify(m))for(const[t,{color:e}]of Object.entries(d))p[+t].style.setProperty("--bgcolor",e);g!==c&&(t.innerHTML="",p=qt(t,d)),l&&!e.destroyAfterDone&&clearTimeout(f),t.style.setProperty("--stage-height",h+"px"),n=m,o=e.duration??o,r=e.force??r,c=g,i=e.particleShape??i,s=e.particleSize??s,l=e.destroyAfterDone??l,a=h,u=e.stageWidth??u},destroy(){clearTimeout(f)}}};function qt(t,e=[]){const n=[];for(const{color:o}of e){const e=re("div");e.className="fk9XWG_particle",e.style.setProperty("--bgcolor",o);const r=re("div");ce(e,r),ce(t,e),n.push(e)}return n}const Vt=200,Yt=800,Kt=.1,Qt=.3,Zt=.5,te=Math.abs,ee=Math.random,ne=Math.round,oe=Math.max,re=t=>document.createElement(t),ce=(t,e)=>t.appendChild(e),ie=(t,e)=>Array.from({length:t},((n,o)=>({color:e[o%e.length],degree:360*o/t}))),se=(t,e=2)=>ne((t+Number.EPSILON)*10**e)/10**e,le=(t,e,n,o,r)=>(t-e)*(r-o)/(n-e)+o,ae=(t,e)=>t+e>360?t+e-360:t+e,ue=()=>ee()>.5,fe=6,de=t=>1!==t&&ue(),pe=t=>void 0===t,ge=(t,e)=>{if(!pe(t)&&Number.isSafeInteger(t)&&t<0)throw new Error(e+" must be a positive integer")},me=({particleCount:t,duration:e,colors:n,particleSize:o,force:r,stageHeight:c,stageWidth:i,particleShape:s})=>{if(ge(t,"particleCount"),ge(e,"duration"),ge(o,"particleSize"),ge(r,"force"),ge(c,"stageHeight"),ge(i,"stageWidth"),!pe(s)&&!/^(mix|circles|rectangles)$/i.test(s))throw new Error('particlesShape should be either "mix" or "circles" or "rectangle"');if(!pe(n)&&!Array.isArray(n))throw new Error("colors must be an array of strings");if(r>1)throw new Error("force must be within 0 and 1")};function he(t,e,n){const o=t.slice();return o[4]=e[n][0],o[5]=e[n][1],o}function ve(e){let n,o,r;return{c(){n=m("div")},m(e,i){var s;d(e,n,i),o||(s=Ut.call(null,n),r=s&&c(s.destroy)?s.destroy:t,o=!0)},d(t){t&&p(n),o=!1,r()}}}function $e(e){let n;return{c(){n=m("div"),n.textContent="No votes",y(n,"class","col text-center p-2")},m(t,e){d(t,n,e)},p:t,d(t){t&&p(n)}}}function be(t){let e,n=t[4]+"";return{c(){e=h(n)},m(t,n){d(t,e,n)},p(t,o){1&o&&n!==(n=t[4]+"")&&w(e,n)},d(t){t&&p(e)}}}function ye(t,e){let n,o,r,c,i,s,l,a,u=e[5]+"";return o=new rt({props:{size:e[1],$$slots:{default:[be]},$$scope:{ctx:e}}}),{key:t,first:null,c(){n=m("div"),Y(o.$$.fragment),r=v(),c=m("div"),i=h(u),s=h("x"),l=v(),y(c,"class","text-muted"),y(n,"class","d-inline-block text-center"),this.first=n},m(t,e){d(t,n,e),K(o,n,null),f(n,r),f(n,c),f(c,i),f(c,s),f(n,l),a=!0},p(t,n){e=t;const r={};2&n&&(r.size=e[1]),257&n&&(r.$$scope={dirty:n,ctx:e}),o.$set(r),(!a||1&n)&&u!==(u=e[5]+"")&&w(i,u)},i(t){a||(D(o.$$.fragment,t),a=!0)},o(t){F(o.$$.fragment,t),a=!1},d(t){t&&p(n),Q(o)}}}function xe(t){let n,o,r,c=[],i=new Map,s=t[2]&&t[0]&&1==t[0].length&&t[0][0][1]>1&&ve(),l=U(t[0]);const a=t=>t[4];for(let e=0;e<l.length;e+=1){let n=he(t,l,e),o=a(n);i.set(o,c[e]=ye(o,n))}let u=null;l.length||(u=$e());let f=[t[3]],g={};for(let t=0;t<f.length;t+=1)g=e(g,f[t]);return{c(){s&&s.c(),n=v(),o=m("div");for(let t=0;t<c.length;t+=1)c[t].c();u&&u.c(),k(o,g)},m(t,e){s&&s.m(t,e),d(t,n,e),d(t,o,e);for(let t=0;t<c.length;t+=1)c[t]&&c[t].m(o,null);u&&u.m(o,null),r=!0},p(t,[e]){t[2]&&t[0]&&1==t[0].length&&t[0][0][1]>1?s||(s=ve(),s.c(),s.m(n.parentNode,n)):s&&(s.d(1),s=null),3&e&&(l=U(t[0]),L(),c=V(c,e,a,1,t,l,i,o,q,ye,null,he),H(),!l.length&&u?u.p(t,e):l.length?u&&(u.d(1),u=null):(u=$e(),u.c(),u.m(o,null))),k(o,g=function(t,e){const n={},o={},r={$$scope:1};let c=t.length;for(;c--;){const i=t[c],s=e[c];if(s){for(const t in i)t in s||(o[t]=1);for(const t in s)r[t]||(n[t]=s[t],r[t]=1);t[c]=s}else for(const t in i)r[t]=1}for(const t in o)t in n||(n[t]=void 0);return n}(f,[8&e&&t[3]]))},i(t){if(!r){for(let t=0;t<l.length;t+=1)D(c[t]);r=!0}},o(t){for(let t=0;t<c.length;t+=1)F(c[t]);r=!1},d(t){t&&(p(n),p(o)),s&&s.d(t);for(let t=0;t<c.length;t+=1)c[t].d();u&&u.d()}}}function ke(t,n,o){const r=["votes","size","emitConfetti"];let c=u(n,r),{votes:i}=n,{size:s}=n,{emitConfetti:l=!0}=n;return t.$$set=t=>{n=e(e({},n),function(t){const e={};for(const n in t)"$"!==n[0]&&(e[n]=t[n]);return e}(t)),o(3,c=u(n,r)),"votes"in t&&o(0,i=t.votes),"size"in t&&o(1,s=t.size),"emitConfetti"in t&&o(2,l=t.emitConfetti)},[i,s,l,c]}class we extends et{constructor(t){super(),tt(this,t,ke,xe,i,{votes:0,size:1,emitConfetti:2})}}function _e(t,e,n){const o=t.slice();o[1]=e[n].data;const r=At(o[1].votes);return o[2]=r,o}function Se(t){let e,n;return{c(){e=m("br"),n=h("no votes")},m(t,o){d(t,e,o),d(t,n,o)},d(t){t&&(p(e),p(n))}}}function Ce(t){let e,n,o,r;return n=new we({props:{votes:t[2],emitConfetti:!1,size:"sm"}}),{c(){e=m("div"),Y(n.$$.fragment),o=v(),y(e,"class","small history-item text-start rounded flex-shrink-0 me-1 my-3 p-1 svelte-n1eljq")},m(t,c){d(t,e,c),K(n,e,null),f(e,o),r=!0},p(t,e){const o={};1&e&&(o.votes=t[2]),n.$set(o)},i(t){r||(D(n.$$.fragment,t),r=!0)},o(t){F(n.$$.fragment,t),r=!1},d(t){t&&p(e),Q(n)}}}function Ne(t){let e,n,o,r,c,i,s,l=t[1].round+"",a=0==t[2].length&&Se(),u=t[2].length>0&&Ce(t);return{c(){e=m("small"),n=h("Round "),o=h(l),r=v(),a&&a.c(),c=v(),u&&u.c(),i=$(),y(e,"class","voting-round ms-2 text-muted svelte-n1eljq")},m(t,l){d(t,e,l),f(e,n),f(e,o),f(e,r),a&&a.m(e,null),d(t,c,l),u&&u.m(t,l),d(t,i,l),s=!0},p(t,n){(!s||1&n)&&l!==(l=t[1].round+"")&&w(o,l),0==t[2].length?a||(a=Se(),a.c(),a.m(e,null)):a&&(a.d(1),a=null),t[2].length>0?u?(u.p(t,n),1&n&&D(u,1)):(u=Ce(t),u.c(),D(u,1),u.m(i.parentNode,i)):u&&(L(),F(u,1,1,(()=>{u=null})),H())},i(t){s||(D(u),s=!0)},o(t){F(u),s=!1},d(t){t&&(p(e),p(c),p(i)),a&&a.d(),u&&u.d(t)}}}function Oe(t){let e,n,o=U(t[0].filter(ze)),r=[];for(let e=0;e<o.length;e+=1)r[e]=Ne(_e(t,o,e));const c=t=>F(r[t],1,1,(()=>{r[t]=null}));return{c(){e=m("div");for(let t=0;t<r.length;t+=1)r[t].c();y(e,"class","d-flex overflow-scroll")},m(t,o){d(t,e,o);for(let t=0;t<r.length;t+=1)r[t]&&r[t].m(e,null);n=!0},p(t,[n]){if(1&n){let i;for(o=U(t[0].filter(ze)),i=0;i<o.length;i+=1){const c=_e(t,o,i);r[i]?(r[i].p(c,n),D(r[i],1)):(r[i]=Ne(c),r[i].c(),D(r[i],1),r[i].m(e,null))}for(L(),i=o.length;i<r.length;i+=1)c(i);H()}},i(t){if(!n){for(let t=0;t<o.length;t+=1)D(r[t]);n=!0}},o(t){r=r.filter(Boolean);for(let t=0;t<r.length;t+=1)F(r[t]);n=!1},d(t){t&&p(e),g(r,t)}}}const ze=t=>"reveal"==t.event;function Ee(t,e,n){let o;return l(t,jt,(t=>n(0,o=t))),[o]}class je extends et{constructor(t){super(),tt(this,t,Ee,Oe,i,{})}}function Ae(t){let e;function n(t,e){return t[1]?Je:We}let o=n(t),r=o(t);return{c(){r.c(),e=$()},m(t,n){r.m(t,n),d(t,e,n)},p(t,c){o===(o=n(t))&&r?r.p(t,c):(r.d(1),r=o(t),r&&(r.c(),r.m(e.parentNode,e)))},d(t){t&&p(e),r.d(t)}}}function Re(e){let n;return{c(){n=h("👁️")},m(t,e){d(t,n,e)},p:t,d(t){t&&p(n)}}}function We(e){let n;return{c(){n=h("⌛")},m(t,e){d(t,n,e)},p:t,d(t){t&&p(n)}}}function Je(t){let e,n=t[0].vote+"";return{c(){e=h(n)},m(t,n){d(t,e,n)},p(t,o){1&o&&n!==(n=t[0].vote+"")&&w(e,n)},d(t){t&&p(e)}}}function Me(t){let e;function n(t,e){return t[0].is_spectator?Re:t[0].vote?Ae:void 0}let o=n(t),r=o&&o(t);return{c(){r&&r.c(),e=$()},m(t,n){r&&r.m(t,n),d(t,e,n)},p(t,c){o===(o=n(t))&&r?r.p(t,c):(r&&r.d(1),r=o&&o(t),r&&(r.c(),r.m(e.parentNode,e)))},d(t){t&&p(e),r&&r.d(t)}}}function Ie(t){let e,n,o,r,c,i,s=t[0].name+"";return c=new rt({props:{color:t[0].is_spectator?"#effbf7":void 0,$$slots:{default:[Me]},$$scope:{ctx:t}}}),{c(){e=m("div"),n=m("strong"),o=h(s),r=v(),Y(c.$$.fragment),y(e,"class","participant svelte-10w4gcr"),S(e,"transform","rotate("+t[2]+"deg) translate(37.5vw) rotate(90deg)")},m(t,s){d(t,e,s),f(e,n),f(n,o),f(e,r),K(c,e,null),i=!0},p(t,[n]){(!i||1&n)&&s!==(s=t[0].name+"")&&w(o,s);const r={};1&n&&(r.color=t[0].is_spectator?"#effbf7":void 0),35&n&&(r.$$scope={dirty:n,ctx:t}),c.$set(r),(!i||4&n)&&S(e,"transform","rotate("+t[2]+"deg) translate(37.5vw) rotate(90deg)")},i(t){i||(D(c.$$.fragment,t),i=!0)},o(t){F(c.$$.fragment,t),i=!1},d(t){t&&p(e),Q(c)}}}function Pe(t,e,n){let o,{user:r}=e,{isRevealed:c}=e,{i:i}=e,{count:s}=e;return t.$$set=t=>{"user"in t&&n(0,r=t.user),"isRevealed"in t&&n(1,c=t.isRevealed),"i"in t&&n(3,i=t.i),"count"in t&&n(4,s=t.count)},t.$$.update=()=>{28&t.$$.dirty&&(n(2,o=-90),s>1&&n(2,o-=Math.min(20,174/s)*(i-(s-1)/2)))},[r,c,o,i,s]}class Be extends et{constructor(t){super(),tt(this,t,Pe,Ie,i,{user:0,isRevealed:1,i:3,count:4})}}function Ge(t,e,n){const o=t.slice();return o[8]=e[n][0],o[9]=e[n][1],o}function Te(t){let e,n,o,r,c,i,s,l,a,u,g,$=!1,x=t[9]+"";return a=function(t){let e;return{p(...n){e=n,e.forEach((e=>t.push(e)))},r(){e.forEach((e=>t.splice(t.indexOf(e),1)))}}}(t[6][0]),{c(){e=m("input"),c=v(),i=m("label"),s=h(x),y(e,"type","radio"),y(e,"class","btn-check"),e.__value=n=t[8],_(e,e.__value),y(e,"autocomplete","off"),y(e,"id",o="deck-"+t[8]),e.disabled=r=!t[1],y(i,"class","btn btn-outline-primary svelte-1y9hivi"),y(i,"for",l="deck-"+t[8]),a.p(e)},m(n,o){d(n,e,o),e.checked=e.__value===t[2],d(n,c,o),d(n,i,o),f(i,s),u||(g=b(e,"change",t[5]),u=!0)},p(t,c){1&c&&n!==(n=t[8])&&(e.__value=n,_(e,e.__value),$=!0),1&c&&o!==(o="deck-"+t[8])&&y(e,"id",o),2&c&&r!==(r=!t[1])&&(e.disabled=r),($||5&c)&&(e.checked=e.__value===t[2]),1&c&&x!==(x=t[9]+"")&&w(s,x),1&c&&l!==(l="deck-"+t[8])&&y(i,"for",l)},d(t){t&&(p(e),p(c),p(i)),a.r(),u=!1,g()}}}function Xe(t){let e;function n(t,e){return!t[1]&&t[4]?He:Le}let o=n(t),r=o(t);return{c(){r.c(),e=$()},m(t,n){r.m(t,n),d(t,e,n)},p(t,c){o!==(o=n(t))&&(r.d(1),r=o(t),r&&(r.c(),r.m(e.parentNode,e)))},d(t){t&&p(e),r.d(t)}}}function Le(t){let e;return{c(){e=m("div"),e.textContent="~",y(e,"class","voting-status svelte-1y9hivi"),y(e,"title","Voting in progress")},m(t,n){d(t,e,n)},d(t){t&&p(e)}}}function He(t){let e;return{c(){e=m("div"),e.textContent="✓",y(e,"class","voting-status svelte-1y9hivi"),y(e,"title","Voting complete")},m(t,n){d(t,e,n)},d(t){t&&p(e)}}}function De(t){let e,n,o;return{c(){e=m("button"),e.textContent="Reveal",y(e,"class","btn btn-sm btn-success svelte-1y9hivi")},m(t,r){d(t,e,r),n||(o=b(e,"click",Bt),n=!0)},d(t){t&&p(e),n=!1,o()}}}function Fe(t){let e,n,o;return{c(){e=m("button"),e.textContent="Clear",y(e,"class","btn btn-sm btn-warning svelte-1y9hivi")},m(t,r){d(t,e,r),n||(o=b(e,"click",Gt),n=!0)},d(t){t&&p(e),n=!1,o()}}}function Ue(e){let n,o,r,c,i,s,l,a,u,$,x,k=U(e[0]),w=[];for(let t=0;t<k.length;t+=1)w[t]=Te(Ge(e,k,t));let _=!e[3]&&Xe(e);function S(t,e){return t[1]?Fe:De}let C=S(e),N=C(e);return{c(){n=m("div"),o=m("div");for(let t=0;t<w.length;t+=1)w[t].c();r=h("\n     \n\n    "),_&&_.c(),c=v(),N.c(),i=v(),s=m("div"),l=m("label"),l.textContent="Auto reveal",a=v(),u=m("input"),y(o,"class","btn-group btn-group-sm"),y(o,"role","group"),y(o,"aria-label","Change deck"),y(l,"for","autoReveal"),y(l,"class","svelte-1y9hivi"),y(u,"type","checkbox"),y(u,"class","form-check-input"),y(u,"id","autoReveal"),y(s,"class","form-check form-switch mt-1 ms-3"),y(n,"class","d-flex justify-content-center m-3")},m(t,p){d(t,n,p),f(n,o);for(let t=0;t<w.length;t+=1)w[t]&&w[t].m(o,null);f(n,r),_&&_.m(n,null),f(n,c),N.m(n,null),f(n,i),f(n,s),f(s,l),f(s,a),f(s,u),u.checked=e[3],$||(x=b(u,"change",e[7]),$=!0)},p(t,[e]){if(7&e){let n;for(k=U(t[0]),n=0;n<k.length;n+=1){const r=Ge(t,k,n);w[n]?w[n].p(r,e):(w[n]=Te(r),w[n].c(),w[n].m(o,null))}for(;n<w.length;n+=1)w[n].d(1);w.length=k.length}t[3]?_&&(_.d(1),_=null):_?_.p(t,e):(_=Xe(t),_.c(),_.m(n,c)),C!==(C=S(t))&&(N.d(1),N=C(t),N&&(N.c(),N.m(n,i))),8&e&&(u.checked=t[3])},i:t,o:t,d(t){t&&p(n),g(w,t),_&&_.d(),N.d(),$=!1,x()}}}function qe(t,e,n){let o,r,c,i,s;l(t,St,(t=>n(0,o=t))),l(t,Ot,(t=>n(1,r=t))),l(t,Nt,(t=>n(2,c=t))),l(t,Ct,(t=>n(3,i=t))),l(t,Wt,(t=>n(4,s=t)));return[o,r,c,i,s,function(){c=this.__value,Nt.set(c)},[[]],function(){i=this.checked,Ct.set(i)}]}class Ve extends et{constructor(t){super(),tt(this,t,qe,Ue,i,{})}}function Ye(t,e,n){const o=t.slice();return o[8]=e[n],o}function Ke(t,e,n){const o=t.slice();return o[11]=e[n],o[13]=n,o}function Qe(t){let e,n,o;return{c(){e=m("div"),n=m("div"),o=h(t[1]),y(n,"class","alert alert-danger"),y(n,"role","alert"),y(e,"class","fixed-top")},m(t,r){d(t,e,r),f(e,n),f(n,o)},p(t,e){2&e&&w(o,t[1])},d(t){t&&p(e)}}}function Ze(t,e){let n,o,r;return o=new Be({props:{isRevealed:e[3],user:e[11],i:e[13],count:e[2].length}}),{key:t,first:null,c(){n=$(),Y(o.$$.fragment),this.first=n},m(t,e){d(t,n,e),K(o,t,e),r=!0},p(t,n){e=t;const r={};8&n&&(r.isRevealed=e[3]),4&n&&(r.user=e[11]),4&n&&(r.i=e[13]),4&n&&(r.count=e[2].length),o.$set(r)},i(t){r||(D(o.$$.fragment,t),r=!0)},o(t){F(o.$$.fragment,t),r=!1},d(t){t&&p(n),Q(o,t)}}}function tn(t){let e,n,o;return n=new we({props:{votes:t[4],style:"background-color: #e6e6e6;",class:"p-2 mb-2 text-center rounded"}}),{c(){e=m("div"),Y(n.$$.fragment),y(e,"class","controls svelte-1rvs6lz")},m(t,r){d(t,e,r),K(n,e,null),o=!0},p(t,e){const o={};16&e&&(o.votes=t[4]),n.$set(o)},i(t){o||(D(n.$$.fragment,t),o=!0)},o(t){F(n.$$.fragment,t),o=!1},d(t){t&&p(e),Q(n)}}}function en(t){let e,n,o=U(t[6]),r=[];for(let e=0;e<o.length;e+=1)r[e]=rn(Ye(t,o,e));const c=t=>F(r[t],1,1,(()=>{r[t]=null}));return{c(){e=m("div");for(let t=0;t<r.length;t+=1)r[t].c();y(e,"class","d-flex justify-content-center")},m(t,o){d(t,e,o);for(let t=0;t<r.length;t+=1)r[t]&&r[t].m(e,null);n=!0},p(t,n){if(104&n){let i;for(o=U(t[6]),i=0;i<o.length;i+=1){const c=Ye(t,o,i);r[i]?(r[i].p(c,n),D(r[i],1)):(r[i]=rn(c),r[i].c(),D(r[i],1),r[i].m(e,null))}for(L(),i=o.length;i<r.length;i+=1)c(i);H()}},i(t){if(!n){for(let t=0;t<o.length;t+=1)D(r[t]);n=!0}},o(t){r=r.filter(Boolean);for(let t=0;t<r.length;t+=1)F(r[t]);n=!1},d(t){t&&p(e),g(r,t)}}}function nn(e){let n,o,r,c,i,s;return{c(){n=h("You joined as spectator."),o=m("br"),r=h("\n                I want to\n                "),c=m("button"),c.textContent="become a voter",y(c,"class","btn btn-light btn-sm")},m(t,l){d(t,n,l),d(t,o,l),d(t,r,l),d(t,c,l),i||(s=b(c,"click",e[7]),i=!0)},p:t,i:t,o:t,d(t){t&&(p(n),p(o),p(r),p(c)),i=!1,s()}}}function on(t){let e,n=t[8]+"";return{c(){e=h(n)},m(t,n){d(t,e,n)},p(t,o){64&o&&n!==(n=t[8]+"")&&w(e,n)},d(t){t&&p(e)}}}function rn(t){let e,n,o,i,s,l;return n=new rt({props:{color:t[3]?"#eee":null,$$slots:{default:[on]},$$scope:{ctx:t}}}),{c(){e=m("button"),Y(n.$$.fragment),o=v(),e.disabled=t[3],y(e,"class","btn m-0 p-0 svelte-1rvs6lz"),C(e,"selected",t[8]==t[5].vote)},m(r,a){d(r,e,a),K(n,e,null),f(e,o),i=!0,s||(l=[b(e,"click",(function(){c(Tt(t[8]))&&Tt(t[8]).apply(this,arguments)})),b(e,"keypress",(function(){c(Tt(t[8]))&&Tt(t[8]).apply(this,arguments)}))],s=!0)},p(o,r){t=o;const c={};8&r&&(c.color=t[3]?"#eee":null),16448&r&&(c.$$scope={dirty:r,ctx:t}),n.$set(c),(!i||8&r)&&(e.disabled=t[3]),(!i||96&r)&&C(e,"selected",t[8]==t[5].vote)},i(t){i||(D(n.$$.fragment,t),i=!0)},o(t){F(n.$$.fragment,t),i=!1},d(t){t&&p(e),Q(n),s=!1,r(l)}}}function cn(t){let e,n;return e=new Ft({}),{c(){Y(e.$$.fragment)},m(t,o){K(e,t,o),n=!0},i(t){n||(D(e.$$.fragment,t),n=!0)},o(t){F(e.$$.fragment,t),n=!1},d(t){Q(e,t)}}}function sn(t){let e,n,o,r,c,i,s,l,a,u,g,h,b,x,k,w,_,S=[],C=new Map,N=t[1]&&Qe(t),O=U(t[2]);const z=t=>t[11].id;for(let e=0;e<O.length;e+=1){let n=Ke(t,O,e),o=z(n);C.set(o,S[e]=Ze(o,n))}let E=t[3]&&tn(t);const j=[nn,en],A=[];function R(t,e){return t[5].is_spectator?0:1}l=R(t),a=A[l]=j[l](t),h=new Ve({}),x=new je({});let W=t[0]&&cn();return{c(){N&&N.c(),e=v(),n=m("div");for(let t=0;t<S.length;t+=1)S[t].c();o=v(),E&&E.c(),r=v(),c=m("div"),i=m("div"),s=m("div"),a.c(),u=v(),g=m("div"),Y(h.$$.fragment),b=v(),Y(x.$$.fragment),k=v(),W&&W.c(),w=$(),y(n,"class","participants svelte-1rvs6lz"),y(s,"class","col"),y(i,"class","row"),y(g,"class","row"),y(c,"class","container text-center")},m(t,a){N&&N.m(t,a),d(t,e,a),d(t,n,a);for(let t=0;t<S.length;t+=1)S[t]&&S[t].m(n,null);f(n,o),E&&E.m(n,null),d(t,r,a),d(t,c,a),f(c,i),f(i,s),A[l].m(s,null),f(c,u),f(c,g),K(h,g,null),f(c,b),K(x,c,null),d(t,k,a),W&&W.m(t,a),d(t,w,a),_=!0},p(t,[r]){t[1]?N?N.p(t,r):(N=Qe(t),N.c(),N.m(e.parentNode,e)):N&&(N.d(1),N=null),12&r&&(O=U(t[2]),L(),S=V(S,r,z,1,t,O,C,n,q,Ze,o,Ke),H()),t[3]?E?(E.p(t,r),8&r&&D(E,1)):(E=tn(t),E.c(),D(E,1),E.m(n,null)):E&&(L(),F(E,1,1,(()=>{E=null})),H());let c=l;l=R(t),l===c?A[l].p(t,r):(L(),F(A[c],1,1,(()=>{A[c]=null})),H(),a=A[l],a?a.p(t,r):(a=A[l]=j[l](t),a.c()),D(a,1),a.m(s,null)),t[0]?W?1&r&&D(W,1):(W=cn(),W.c(),D(W,1),W.m(w.parentNode,w)):W&&(L(),F(W,1,1,(()=>{W=null})),H())},i(t){if(!_){for(let t=0;t<O.length;t+=1)D(S[t]);D(E),D(a),D(h.$$.fragment,t),D(x.$$.fragment,t),D(W),_=!0}},o(t){for(let t=0;t<S.length;t+=1)F(S[t]);F(E),F(a),F(h.$$.fragment,t),F(x.$$.fragment,t),F(W),_=!1},d(t){t&&(p(e),p(n),p(r),p(c),p(k),p(w)),N&&N.d(t);for(let t=0;t<S.length;t+=1)S[t].d();E&&E.d(),A[l].d(),Q(h),Q(x),W&&W.d(t)}}}function ln(t,e,n){let o,r,c,i,s,a;l(t,Et,(t=>n(1,o=t))),l(t,wt,(t=>n(2,r=t))),l(t,Ot,(t=>n(3,c=t))),l(t,Rt,(t=>n(4,i=t))),l(t,zt,(t=>n(5,s=t))),l(t,_t,(t=>n(6,a=t)));let u=!1;z((()=>{Pt(st("websocket_url")),n(0,u=new URLSearchParams(window.location.search).get("debug"))}));return[u,o,r,c,i,s,a,()=>It("settings",{is_spectator:!1})]}class an extends et{constructor(t){super(),tt(this,t,ln,sn,i,{})}}function un(t){let e,n;return e=new bt({}),{c(){Y(e.$$.fragment)},m(t,o){K(e,t,o),n=!0},i(t){n||(D(e.$$.fragment,t),n=!0)},o(t){F(e.$$.fragment,t),n=!1},d(t){Q(e,t)}}}function fn(t){let e,n;return e=new an({}),{c(){Y(e.$$.fragment)},m(t,o){K(e,t,o),n=!0},i(t){n||(D(e.$$.fragment,t),n=!0)},o(t){F(e.$$.fragment,t),n=!1},d(t){Q(e,t)}}}function dn(e){let n,o,r,c;const i=[fn,un],s=[];return n=function(t,e){return t[0]?0:1}(e),o=s[n]=i[n](e),{c(){o.c(),r=$()},m(t,e){s[n].m(t,e),d(t,r,e),c=!0},p:t,i(t){c||(D(o),c=!0)},o(t){F(o),c=!1},d(t){t&&p(r),s[n].d(t)}}}function pn(t){return[st("websocket_url")]}return new class extends et{constructor(t){super(),tt(this,t,pn,dn,i,{})}}({target:document.querySelector("#poker")})}();
