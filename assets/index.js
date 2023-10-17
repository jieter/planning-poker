var app=function(){"use strict";function t(){}function e(t,e){for(const n in e)t[n]=e[n];return t}function n(t){return t()}function o(){return Object.create(null)}function r(t){t.forEach(n)}function c(t){return"function"==typeof t}function i(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function s(e,...n){if(null==e){for(const t of n)t(void 0);return t}const o=e.subscribe(...n);return o.unsubscribe?()=>o.unsubscribe():o}function l(t,e,n){t.$$.on_destroy.push(s(e,n))}function a(t,n,o,r){return t[1]&&r?e(o.ctx.slice(),t[1](r(n))):o.ctx}function u(t,e){const n={};e=new Set(e);for(const o in t)e.has(o)||"$"===o[0]||(n[o]=t[o]);return n}function f(t,e){t.appendChild(e)}function d(t,e,n){t.insertBefore(e,n||null)}function p(t){t.parentNode&&t.parentNode.removeChild(t)}function g(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function m(t){return document.createElement(t)}function h(t){return document.createTextNode(t)}function v(){return h(" ")}function $(){return h("")}function y(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function b(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}const x=["width","height"];function w(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const o in e)null==e[o]?t.removeAttribute(o):"style"===o?t.style.cssText=e[o]:"__value"===o?t.value=t[o]=e[o]:n[o]&&n[o].set&&-1===x.indexOf(o)?t[o]=e[o]:b(t,o,e[o])}function k(t,e){e=""+e,t.data!==e&&(t.data=e)}function _(t,e){t.value=null==e?"":e}function S(t,e,n,o){null==n?t.style.removeProperty(e):t.style.setProperty(e,n,o?"important":"")}function C(t,e,n){t.classList.toggle(e,!!n)}let N;function O(t){N=t}function z(t){(function(){if(!N)throw new Error("Function called outside component initialization");return N})().$$.on_mount.push(t)}const E=[],A=[];let R=[];const W=[],J=Promise.resolve();let j=!1;function M(t){R.push(t)}const I=new Set;let P=0;function G(){if(0!==P)return;const t=N;do{try{for(;P<E.length;){const t=E[P];P++,O(t),X(t.$$)}}catch(t){throw E.length=0,P=0,t}for(O(null),E.length=0,P=0;A.length;)A.pop()();for(let t=0;t<R.length;t+=1){const e=R[t];I.has(e)||(I.add(e),e())}R.length=0}while(E.length);for(;W.length;)W.pop()();j=!1,I.clear(),O(t)}function X(t){if(null!==t.fragment){t.update(),r(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(M)}}const B=new Set;let T;function L(){T={r:0,c:[],p:T}}function q(){T.r||r(T.c),T=T.p}function D(t,e){t&&t.i&&(B.delete(t),t.i(e))}function F(t,e,n,o){if(t&&t.o){if(B.has(t))return;B.add(t),T.c.push((()=>{B.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}else o&&o()}function U(t){return void 0!==t?.length?t:Array.from(t)}function H(t,e){F(t,1,1,(()=>{e.delete(t.key)}))}function V(t,e,n,o,c,i,s,l,a,u,f,d){let p=t.length,g=i.length,m=p;const h={};for(;m--;)h[t[m].key]=m;const v=[],$=new Map,y=new Map,b=[];for(m=g;m--;){const t=d(c,i,m),r=n(t);let l=s.get(r);l?o&&b.push((()=>l.p(t,e))):(l=u(r,t),l.c()),$.set(r,v[m]=l),r in h&&y.set(r,Math.abs(m-h[r]))}const x=new Set,w=new Set;function k(t){D(t,1),t.m(l,f),s.set(t.key,t),f=t.first,g--}for(;p&&g;){const e=v[g-1],n=t[p-1],o=e.key,r=n.key;e===n?(f=e.first,p--,g--):$.has(r)?!s.has(o)||x.has(o)?k(e):w.has(r)?p--:y.get(o)>y.get(r)?(w.add(o),k(e)):(x.add(r),p--):(a(n,s),p--)}for(;p--;){const e=t[p];$.has(e.key)||a(e,s)}for(;g;)k(v[g-1]);return r(b),v}function Y(t){t&&t.c()}function K(t,e,o){const{fragment:i,after_update:s}=t.$$;i&&i.m(e,o),M((()=>{const e=t.$$.on_mount.map(n).filter(c);t.$$.on_destroy?t.$$.on_destroy.push(...e):r(e),t.$$.on_mount=[]})),s.forEach(M)}function Q(t,e){const n=t.$$;null!==n.fragment&&(!function(t){const e=[],n=[];R.forEach((o=>-1===t.indexOf(o)?e.push(o):n.push(o))),n.forEach((t=>t())),R=e}(n.after_update),r(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Z(t,e){-1===t.$$.dirty[0]&&(E.push(t),j||(j=!0,J.then(G)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function tt(e,n,c,i,s,l,a=null,u=[-1]){const f=N;O(e);const d=e.$$={fragment:null,ctx:[],props:l,update:t,not_equal:s,bound:o(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(f?f.$$.context:[])),callbacks:o(),dirty:u,skip_bound:!1,root:n.target||f.$$.root};a&&a(d.root);let g=!1;if(d.ctx=c?c(e,n.props||{},((t,n,...o)=>{const r=o.length?o[0]:n;return d.ctx&&s(d.ctx[t],d.ctx[t]=r)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](r),g&&Z(e,t)),n})):[],d.update(),g=!0,r(d.before_update),d.fragment=!!i&&i(d.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);d.fragment&&d.fragment.l(t),t.forEach(p)}else d.fragment&&d.fragment.c();n.intro&&D(e.$$.fragment),K(e,n.target,n.anchor),G()}O(f)}class et{$$=void 0;$$set=void 0;$destroy(){Q(this,1),this.$destroy=t}$on(e,n){if(!c(n))return t;const o=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return o.push(n),()=>{const t=o.indexOf(n);-1!==t&&o.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}
/*! js-cookie v3.0.5 | MIT */
function nt(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var o in n)t[o]=n[o]}return t}"undefined"!=typeof window&&(window.__svelte||(window.__svelte={v:new Set})).v.add("4");var ot=function t(e,n){function o(t,o,r){if("undefined"!=typeof document){"number"==typeof(r=nt({},n,r)).expires&&(r.expires=new Date(Date.now()+864e5*r.expires)),r.expires&&(r.expires=r.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var c="";for(var i in r)r[i]&&(c+="; "+i,!0!==r[i]&&(c+="="+r[i].split(";")[0]));return document.cookie=t+"="+e.write(o,t)+c}}return Object.create({set:o,get:function(t){if("undefined"!=typeof document&&(!arguments.length||t)){for(var n=document.cookie?document.cookie.split("; "):[],o={},r=0;r<n.length;r++){var c=n[r].split("="),i=c.slice(1).join("=");try{var s=decodeURIComponent(c[0]);if(o[s]=e.read(i,s),t===s)break}catch(t){}}return t?o[t]:o}},remove:function(t,e){o(t,"",nt({},e,{expires:-1}))},withAttributes:function(e){return t(this.converter,nt({},this.attributes,e))},withConverter:function(e){return t(nt({},this.converter,e),this.attributes)}},{attributes:{value:Object.freeze(n)},converter:{value:Object.freeze(e)}})}({read:function(t){return'"'===t[0]&&(t=t.slice(1,-1)),t.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(t){return encodeURIComponent(t).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"});function rt(t){let e=document.getElementById(t);if(e)return JSON.parse(e.textContent)}function ct(t){let e,n;return{c(){e=m("div"),n=h(t[2]),b(e,"class","invalid-feedback")},m(t,o){d(t,e,o),f(e,n)},p(t,e){4&e&&k(n,t[2])},d(t){t&&p(e)}}}function it(e){let n,o,c,i,s,l,a,u,g,$,x,w,k,S,N,O,z,E,A,R,W=e[2]&&ct(e);return{c(){n=m("h1"),n.textContent="Planning poker",o=v(),c=m("form"),i=m("div"),s=m("input"),l=v(),a=m("div"),u=m("input"),g=v(),W&&W.c(),$=v(),x=m("div"),x.innerHTML='<input type="submit" class="btn btn-primary" value="Join"/>',w=v(),k=m("div"),S=m("label"),N=m("input"),O=h(" Join as a spectator 👁️"),z=v(),E=m("span"),E.textContent="You can always enable voting later",b(s,"type","hidden"),b(s,"name","csrfmiddlewaretoken"),s.value=ot.get("csrftoken"),b(u,"type","text"),b(u,"name","name"),b(u,"class","form-control"),C(u,"is-invalid",e[2]),b(a,"class","col"),b(x,"class","col"),b(i,"class","row row-cols-lg-auto"),b(N,"type","checkbox"),b(N,"name","is_spectator"),b(S,"class","col"),b(E,"class","text-muted"),b(k,"class","row"),b(c,"method","post")},m(t,r){d(t,n,r),d(t,o,r),d(t,c,r),f(c,i),f(i,s),f(i,l),f(i,a),f(a,u),_(u,e[0]),f(a,g),W&&W.m(a,null),f(i,$),f(i,x),f(c,w),f(c,k),f(k,S),f(S,N),N.checked=e[1],f(S,O),f(k,z),f(k,E),A||(R=[y(u,"change",e[3]),y(u,"input",e[4]),y(N,"change",e[5])],A=!0)},p(t,[e]){1&e&&u.value!==t[0]&&_(u,t[0]),4&e&&C(u,"is-invalid",t[2]),t[2]?W?W.p(t,e):(W=ct(t),W.c(),W.m(a,null)):W&&(W.d(1),W=null),2&e&&(N.checked=t[1])},i:t,o:t,d(t){t&&(p(n),p(o),p(c)),W&&W.d(),A=!1,r(R)}}}function st(t,e,n){let o,r="",c=null;z((()=>{const t=localStorage.getItem("name");t&&n(0,r=t);const e=localStorage.getItem("isSpectator");null!==e&&n(1,c="true"===e)}));return t.$$.update=()=>{1&t.$$.dirty&&r&&localStorage.setItem("name",r),2&t.$$.dirty&&null!=c&&localStorage.setItem("isSpectator",c?"true":"false")},[r,c,o,()=>{n(2,o=r?void 0:"Name cannot be empty")},function(){r=this.value,n(0,r)},function(){c=this.checked,n(1,c)}]}class lt extends et{constructor(t){super(),tt(this,t,st,it,i,{})}}function at(t){let e,n;const o=t[4].default,r=function(t,e,n,o){if(t){const r=a(t,e,n,o);return t[0](r)}}(o,t,t[3],null);return{c(){e=m("div"),r&&r.c(),b(e,"class","card svelte-1pd9nvv"),S(e,"background-color",t[0]||"#d8f7ec"),S(e,"height",t[1]+"px"),S(e,"width",.65*t[1]+"px"),b(e,"role","button"),b(e,"tabindex","0")},m(t,o){d(t,e,o),r&&r.m(e,null),n=!0},p(t,[c]){r&&r.p&&(!n||8&c)&&function(t,e,n,o,r,c){if(r){const i=a(e,n,o,c);t.p(i,r)}}(r,o,t,t[3],n?function(t,e,n,o){if(t[2]&&o){const r=t[2](o(n));if(void 0===e.dirty)return r;if("object"==typeof r){const t=[],n=Math.max(e.dirty.length,r.length);for(let o=0;o<n;o+=1)t[o]=e.dirty[o]|r[o];return t}return e.dirty|r}return e.dirty}(o,t[3],c,null):function(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let t=0;t<n;t++)e[t]=-1;return e}return-1}(t[3]),null),(!n||1&c)&&S(e,"background-color",t[0]||"#d8f7ec"),(!n||2&c)&&S(e,"height",t[1]+"px"),(!n||2&c)&&S(e,"width",.65*t[1]+"px")},i(t){n||(D(r,t),n=!0)},o(t){F(r,t),n=!1},d(t){t&&p(e),r&&r.d(t)}}}function ut(t,e,n){let o,{$$slots:r={},$$scope:c}=e,{color:i=null}=e,{size:s="regular"}=e;return t.$$set=t=>{"color"in t&&n(0,i=t.color),"size"in t&&n(2,s=t.size),"$$scope"in t&&n(3,c=t.$$scope)},t.$$.update=()=>{4&t.$$.dirty&&n(1,o="sm"==s?45:70)},[i,o,s,c,r]}class ft extends et{constructor(t){super(),tt(this,t,ut,at,i,{color:0,size:2})}}const dt=[];function pt(e,n=t){let o;const r=new Set;function c(t){if(i(e,t)&&(e=t,o)){const t=!dt.length;for(const t of r)t[1](),dt.push(t,e);if(t){for(let t=0;t<dt.length;t+=2)dt[t][0](dt[t+1]);dt.length=0}}}function s(t){c(t(e))}return{set:c,update:s,subscribe:function(i,l=t){const a=[i,l];return r.add(a),1===r.size&&(o=n(c,s)||t),i(e),()=>{r.delete(a),0===r.size&&o&&(o(),o=null)}}}}function gt(e,n,o){const i=!Array.isArray(e),l=i?[e]:e;if(!l.every(Boolean))throw new Error("derived() expects stores as input, got a falsy value");const a=n.length<2;return u=(e,o)=>{let u=!1;const f=[];let d=0,p=t;const g=()=>{if(d)return;p();const r=n(i?f[0]:f,e,o);a?e(r):p=c(r)?r:t},m=l.map(((t,e)=>s(t,(t=>{f[e]=t,d&=~(1<<e),u&&g()}),(()=>{d|=1<<e}))));return u=!0,g(),function(){r(m),p(),u=!1}},{subscribe:pt(o,u).subscribe};var u}const mt=pt([]),ht=pt([]),vt=pt([]),$t=pt(!1),yt=pt("tshirt"),bt=pt(!1),xt=pt({}),wt=pt(void 0),kt=pt([]);function _t(t){const e=new Proxy({},{get:(t,e)=>e in t?t[e]:0});return t.forEach((t=>{null!=t&&(e[t]+=1)})),Object.entries(e).sort(((t,e)=>e[1]-t[1]))}const St=gt(mt,(t=>_t(t.map((t=>t.vote))))),Ct=gt(mt,(t=>t.every((t=>t.is_spectator||t.vote)))),Nt=t=>{xt.update((e=>(e.vote=t,e)))};let Ot;function zt(t,e=void 0){Ot&&1==Ot.readyState?((e=e||{}).action=t,console.log("update",e),Ot.send(JSON.stringify(e))):console.log("Socket not open yet")}function Et(t){Ot=new WebSocket(t),Ot.onclose=()=>{wt.set("WebSocket connection closed unexpectedly. Trying to reconnect in 2s..."),setTimeout((()=>{console.log("Reconnecting..."),Et(t)}),2e3)},Ot.onopen=()=>{zt({action:"init"})},Ot.onmessage=t=>{const e=JSON.parse(t.data);switch(console.log("message",e),e.type){case"init":mt.set(e.users),xt.set(e.user),ht.set(e.settings.choices),$t.set(e.settings.auto_reveal),bt.set(e.settings.is_revealed),vt.set(e.settings.decks),yt.set(e.settings.deck),kt.set(e.log),wt.set(void 0);break;case"vote":mt.update((t=>(t.forEach((t=>{t.id==e.user_id&&(t.vote=e.value)})),[...t])));break;case"error":wt.set(e.message)}}}const At=()=>zt("reveal"),Rt=()=>{Nt(null),zt("clear")};function Wt(t){return()=>{(function(t){let e;return s(t,(t=>e=t))(),e})(bt)||(zt("vote",{value:t}),Nt(t))}}function Jt(t,e,n){const o=t.slice();return o[14]=e[n],o}function jt(t){let e,n,o,r,c,i,s,l,a=t[14].time+"",u=t[14].event+"",g=JSON.stringify(t[14].data)+"";return{c(){e=m("div"),n=m("span"),o=h(a),r=v(),c=h(u),i=v(),s=h(g),l=v()},m(t,a){d(t,e,a),f(e,n),f(n,o),f(e,r),f(e,c),f(e,i),f(e,s),f(e,l)},p(t,e){16&e&&a!==(a=t[14].time+"")&&k(o,a),16&e&&u!==(u=t[14].event+"")&&k(c,u),16&e&&g!==(g=JSON.stringify(t[14].data)+"")&&k(s,g)},d(t){t&&p(e)}}}function Mt(e){let n,o,c,i,s,l,a,u,$,x,w,_,S,C,N,O,z,E,A,R,W,J,j,M,I=JSON.stringify(e[0])+"",P=JSON.stringify(e[1])+"",G=JSON.stringify(e[2])+"",X=JSON.stringify(e[3])+"",B=!e[5]&&function(t){let e,n,o,c,i;return{c(){e=m("button"),e.textContent="Add fake users",n=v(),o=m("button"),o.textContent="Add fake votes",b(e,"class","btn btn-xs btn-warning"),b(o,"class","btn btn-xs btn-warning")},m(r,s){d(r,e,s),d(r,n,s),d(r,o,s),c||(i=[y(e,"click",t[12]),y(o,"click",t[13])],c=!0)},d(t){t&&(p(e),p(n),p(o)),c=!1,r(i)}}}(e),T=U(e[4]),L=[];for(let t=0;t<T.length;t+=1)L[t]=jt(Jt(e,T,t));return{c(){n=m("div"),o=m("div"),c=m("div"),i=h("debug"),s=m("code"),l=h(I),a=v(),u=m("div"),$=h("votes: "),x=m("code"),w=h(P),_=v(),S=m("div"),C=h("user: "),N=m("code"),O=h(G),z=v(),E=m("div"),A=h("participants: "),R=m("code"),W=h(X),J=v(),B&&B.c(),j=v(),M=m("div");for(let t=0;t<L.length;t+=1)L[t].c();b(o,"class","col"),b(M,"class","col"),b(n,"class","row bg-light rounded p-2 small")},m(t,e){d(t,n,e),f(n,o),f(o,c),f(c,i),f(c,s),f(s,l),f(o,a),f(o,u),f(u,$),f(u,x),f(x,w),f(o,_),f(o,S),f(S,C),f(S,N),f(N,O),f(o,z),f(o,E),f(E,A),f(E,R),f(R,W),f(o,J),B&&B.m(o,null),f(n,j),f(n,M);for(let t=0;t<L.length;t+=1)L[t]&&L[t].m(M,null)},p(t,[e]){if(1&e&&I!==(I=JSON.stringify(t[0])+"")&&k(l,I),2&e&&P!==(P=JSON.stringify(t[1])+"")&&k(w,P),4&e&&G!==(G=JSON.stringify(t[2])+"")&&k(O,G),8&e&&X!==(X=JSON.stringify(t[3])+"")&&k(W,X),16&e){let n;for(T=U(t[4]),n=0;n<T.length;n+=1){const o=Jt(t,T,n);L[n]?L[n].p(o,e):(L[n]=jt(o),L[n].c(),L[n].m(M,null))}for(;n<L.length;n+=1)L[n].d(1);L.length=T.length}},i:t,o:t,d(t){t&&p(n),B&&B.d(),g(L,t)}}}function It(t,e,n){let o,r,c,i,s,a,u,f,d,p,g;l(t,$t,(t=>n(6,r=t))),l(t,bt,(t=>n(7,c=t))),l(t,ht,(t=>n(8,i=t))),l(t,vt,(t=>n(9,s=t))),l(t,yt,(t=>n(10,a=t))),l(t,wt,(t=>n(11,u=t))),l(t,St,(t=>n(1,f=t))),l(t,xt,(t=>n(2,d=t))),l(t,mt,(t=>n(3,p=t))),l(t,kt,(t=>n(4,g=t)));const m=!window.location.host.includes("localhost");return t.$$.update=()=>{4032&t.$$.dirty&&n(0,o={error:u,deck:a,decks:s,choices:i,isRevealed:c,autoReveal:r})},[o,f,d,p,g,m,r,c,i,s,a,u,()=>zt("add_fakes"),()=>zt("fake_votes")]}yt.subscribe((t=>zt("settings",{deck:t}))),$t.subscribe((t=>zt("settings",{auto_reveal:t})));class Pt extends et{constructor(t){super(),tt(this,t,It,Mt,i,{})}}const Gt=(t,e={})=>{se(e);let{colors:n=["#FFC700","#FF0000","#2E3191","#41BBC7"],duration:o=3500,force:r=.5,particleCount:c=150,particleShape:i="mix",particleSize:s=12,destroyAfterDone:l=!0,stageHeight:a=800,stageWidth:u=1600}=e;!function(t){const e=Yt("style");e.dataset.neoconfetti="",e.textContent='@keyframes fk9XWG_y-axis{to{transform:translate3d(0,var(--stage-height),0)}}@keyframes fk9XWG_x-axis{to{transform:translate3d(var(--x-landing-point),0,0)}}@keyframes fk9XWG_rotation{50%{transform:rotate3d(var(--half-rotation),180deg)}to{transform:rotate3d(var(--rotation),360deg)}}.fk9XWG_container{width:0;height:0;z-index:1200;position:relative;overflow:visible}.fk9XWG_particle{animation:x-axis var(--duration-chaos)forwards cubic-bezier(var(--x1),var(--x2),var(--x3),var(--x4));animation-name:fk9XWG_x-axis}.fk9XWG_particle>div{animation:y-axis var(--duration-chaos)forwards cubic-bezier(var(--y1),var(--y2),var(--y3),var(--y4));width:var(--width);height:var(--height);animation-name:fk9XWG_y-axis;position:absolute;top:0;left:0}.fk9XWG_particle>div:before{height:100%;width:100%;content:"";background-color:var(--bgcolor);animation:rotation var(--rotation-duration)infinite linear;border-radius:var(--border-radius);animation-name:fk9XWG_rotation;display:block}',Kt(document.head,e)}(),t.classList.add("fk9XWG_container"),t.style.setProperty("--stage-height",a+"px");let f,d=Qt(c,n),p=Xt(t,d);function g(t,e){const n=Ht(Ut()*(oe-1)),c="rectangles"!==i&&("circles"===i||re(n)),l=(e,n)=>t.style.setProperty(e,n+"");l("--x-landing-point",te(Ft(ee(e,90)-180),0,180,-u/2,u/2)+"px"),l("--duration-chaos",o-Ht(1e3*Ut())+"ms");const a=Ut()<Lt?Zt(Ut()*qt,2):0;l("--x1",a),l("--x2",-1*a),l("--x3",a),l("--x4",Zt(Ft(te(Ft(ee(e,90)-180),0,180,-1,1)),4)),l("--y1",Zt(Ut()*Dt,4)),l("--y2",Zt(Ut()*r*(ne()?1:-1),4)),l("--y3",Dt),l("--y4",Zt(Vt(te(Ft(e-180),0,180,r,-r),0),4)),l("--width",(c?s:Ht(4*Ut())+s/2)+"px"),l("--height",(c?s:Ht(2*Ut())+s)+"px");const f=n.toString(2).padStart(3,"0").split("");l("--half-rotation",f.map((t=>+t/2+""))),l("--rotation",f),l("--rotation-duration",Zt(Ut()*(Tt-Bt)+Bt)+"ms"),l("--border-radius",c?"50%":0)}for(const[t,e]of Object.entries(p))g(e,d[+t].degree);return Promise.resolve().then((()=>f=setTimeout((()=>l&&(t.innerHTML="")),o))),{update(e){se(e);const g=e.particleCount??c,m=e.colors??n,h=e.stageHeight??a;if(d=Qt(g,m),g===c&&JSON.stringify(n)!==JSON.stringify(m))for(const[t,{color:e}]of Object.entries(d))p[+t].style.setProperty("--bgcolor",e);g!==c&&(t.innerHTML="",p=Xt(t,d)),l&&!e.destroyAfterDone&&clearTimeout(f),t.style.setProperty("--stage-height",h+"px"),n=m,o=e.duration??o,r=e.force??r,c=g,i=e.particleShape??i,s=e.particleSize??s,l=e.destroyAfterDone??l,a=h,u=e.stageWidth??u},destroy(){clearTimeout(f)}}};function Xt(t,e=[]){const n=[];for(const{color:o}of e){const e=Yt("div");e.className="fk9XWG_particle",e.style.setProperty("--bgcolor",o);const r=Yt("div");Kt(e,r),Kt(t,e),n.push(e)}return n}const Bt=200,Tt=800,Lt=.1,qt=.3,Dt=.5,Ft=Math.abs,Ut=Math.random,Ht=Math.round,Vt=Math.max,Yt=t=>document.createElement(t),Kt=(t,e)=>t.appendChild(e),Qt=(t,e)=>Array.from({length:t},((n,o)=>({color:e[o%e.length],degree:360*o/t}))),Zt=(t,e=2)=>Ht((t+Number.EPSILON)*10**e)/10**e,te=(t,e,n,o,r)=>(t-e)*(r-o)/(n-e)+o,ee=(t,e)=>t+e>360?t+e-360:t+e,ne=()=>Ut()>.5,oe=6,re=t=>1!==t&&ne(),ce=t=>void 0===t,ie=(t,e)=>{if(!ce(t)&&Number.isSafeInteger(t)&&t<0)throw new Error(e+" must be a positive integer")},se=({particleCount:t,duration:e,colors:n,particleSize:o,force:r,stageHeight:c,stageWidth:i,particleShape:s})=>{if(ie(t,"particleCount"),ie(e,"duration"),ie(o,"particleSize"),ie(r,"force"),ie(c,"stageHeight"),ie(i,"stageWidth"),!ce(s)&&!/^(mix|circles|rectangles)$/i.test(s))throw new Error('particlesShape should be either "mix" or "circles" or "rectangle"');if(!ce(n)&&!Array.isArray(n))throw new Error("colors must be an array of strings");if(r>1)throw new Error("force must be within 0 and 1")};function le(t,e,n){const o=t.slice();return o[4]=e[n][0],o[5]=e[n][1],o}function ae(e){let n,o,r;return{c(){n=m("div")},m(e,i){var s;d(e,n,i),o||(s=Gt.call(null,n),r=s&&c(s.destroy)?s.destroy:t,o=!0)},d(t){t&&p(n),o=!1,r()}}}function ue(e){let n;return{c(){n=m("div"),n.textContent="No votes",b(n,"class","col text-center p-2")},m(t,e){d(t,n,e)},p:t,d(t){t&&p(n)}}}function fe(t){let e,n=t[4]+"";return{c(){e=h(n)},m(t,n){d(t,e,n)},p(t,o){1&o&&n!==(n=t[4]+"")&&k(e,n)},d(t){t&&p(e)}}}function de(t,e){let n,o,r,c,i,s,l,a,u=e[5]+"";return o=new ft({props:{size:e[1],$$slots:{default:[fe]},$$scope:{ctx:e}}}),{key:t,first:null,c(){n=m("div"),Y(o.$$.fragment),r=v(),c=m("div"),i=h(u),s=h("x"),l=v(),b(c,"class","text-muted"),b(n,"class","d-inline-block text-center"),this.first=n},m(t,e){d(t,n,e),K(o,n,null),f(n,r),f(n,c),f(c,i),f(c,s),f(n,l),a=!0},p(t,n){e=t;const r={};2&n&&(r.size=e[1]),257&n&&(r.$$scope={dirty:n,ctx:e}),o.$set(r),(!a||1&n)&&u!==(u=e[5]+"")&&k(i,u)},i(t){a||(D(o.$$.fragment,t),a=!0)},o(t){F(o.$$.fragment,t),a=!1},d(t){t&&p(n),Q(o)}}}function pe(t){let n,o,r,c=[],i=new Map,s=t[2]&&t[0]&&1==t[0].length&&t[0][0][1]>1&&ae(),l=U(t[0]);const a=t=>t[4];for(let e=0;e<l.length;e+=1){let n=le(t,l,e),o=a(n);i.set(o,c[e]=de(o,n))}let u=null;l.length||(u=ue());let f=[t[3]],g={};for(let t=0;t<f.length;t+=1)g=e(g,f[t]);return{c(){s&&s.c(),n=v(),o=m("div");for(let t=0;t<c.length;t+=1)c[t].c();u&&u.c(),w(o,g)},m(t,e){s&&s.m(t,e),d(t,n,e),d(t,o,e);for(let t=0;t<c.length;t+=1)c[t]&&c[t].m(o,null);u&&u.m(o,null),r=!0},p(t,[e]){t[2]&&t[0]&&1==t[0].length&&t[0][0][1]>1?s||(s=ae(),s.c(),s.m(n.parentNode,n)):s&&(s.d(1),s=null),3&e&&(l=U(t[0]),L(),c=V(c,e,a,1,t,l,i,o,H,de,null,le),q(),!l.length&&u?u.p(t,e):l.length?u&&(u.d(1),u=null):(u=ue(),u.c(),u.m(o,null))),w(o,g=function(t,e){const n={},o={},r={$$scope:1};let c=t.length;for(;c--;){const i=t[c],s=e[c];if(s){for(const t in i)t in s||(o[t]=1);for(const t in s)r[t]||(n[t]=s[t],r[t]=1);t[c]=s}else for(const t in i)r[t]=1}for(const t in o)t in n||(n[t]=void 0);return n}(f,[8&e&&t[3]]))},i(t){if(!r){for(let t=0;t<l.length;t+=1)D(c[t]);r=!0}},o(t){for(let t=0;t<c.length;t+=1)F(c[t]);r=!1},d(t){t&&(p(n),p(o)),s&&s.d(t);for(let t=0;t<c.length;t+=1)c[t].d();u&&u.d()}}}function ge(t,n,o){const r=["votes","size","emitConfetti"];let c=u(n,r),{votes:i}=n,{size:s}=n,{emitConfetti:l=!0}=n;return t.$$set=t=>{n=e(e({},n),function(t){const e={};for(const n in t)"$"!==n[0]&&(e[n]=t[n]);return e}(t)),o(3,c=u(n,r)),"votes"in t&&o(0,i=t.votes),"size"in t&&o(1,s=t.size),"emitConfetti"in t&&o(2,l=t.emitConfetti)},[i,s,l,c]}class me extends et{constructor(t){super(),tt(this,t,ge,pe,i,{votes:0,size:1,emitConfetti:2})}}function he(t,e,n){const o=t.slice();o[1]=e[n].data;const r=_t(o[1].votes);return o[2]=r,o}function ve(t){let e,n;return{c(){e=m("br"),n=h("no votes")},m(t,o){d(t,e,o),d(t,n,o)},d(t){t&&(p(e),p(n))}}}function $e(t){let e,n,o,r;return n=new me({props:{votes:t[2],emitConfetti:!1,size:"sm"}}),{c(){e=m("div"),Y(n.$$.fragment),o=v(),b(e,"class","small history-item rounded me-1 my-3 p-1 svelte-oq1c7h")},m(t,c){d(t,e,c),K(n,e,null),f(e,o),r=!0},p(t,e){const o={};1&e&&(o.votes=t[2]),n.$set(o)},i(t){r||(D(n.$$.fragment,t),r=!0)},o(t){F(n.$$.fragment,t),r=!1},d(t){t&&p(e),Q(n)}}}function ye(t){let e,n,o,r,c,i,s,l=t[1].round+"",a=0==t[2].length&&ve(),u=t[2].length>0&&$e(t);return{c(){e=m("div"),n=h("Round "),o=h(l),r=v(),a&&a.c(),c=v(),u&&u.c(),i=$(),b(e,"class","voting-round ms-2 svelte-oq1c7h")},m(t,l){d(t,e,l),f(e,n),f(e,o),f(e,r),a&&a.m(e,null),d(t,c,l),u&&u.m(t,l),d(t,i,l),s=!0},p(t,n){(!s||1&n)&&l!==(l=t[1].round+"")&&k(o,l),0==t[2].length?a||(a=ve(),a.c(),a.m(e,null)):a&&(a.d(1),a=null),t[2].length>0?u?(u.p(t,n),1&n&&D(u,1)):(u=$e(t),u.c(),D(u,1),u.m(i.parentNode,i)):u&&(L(),F(u,1,1,(()=>{u=null})),q())},i(t){s||(D(u),s=!0)},o(t){F(u),s=!1},d(t){t&&(p(e),p(c),p(i)),a&&a.d(),u&&u.d(t)}}}function be(t){let e,n,o=U(t[0].filter(xe)),r=[];for(let e=0;e<o.length;e+=1)r[e]=ye(he(t,o,e));const c=t=>F(r[t],1,1,(()=>{r[t]=null}));return{c(){e=m("div");for(let t=0;t<r.length;t+=1)r[t].c();b(e,"class","history svelte-oq1c7h")},m(t,o){d(t,e,o);for(let t=0;t<r.length;t+=1)r[t]&&r[t].m(e,null);n=!0},p(t,[n]){if(1&n){let i;for(o=U(t[0].filter(xe)),i=0;i<o.length;i+=1){const c=he(t,o,i);r[i]?(r[i].p(c,n),D(r[i],1)):(r[i]=ye(c),r[i].c(),D(r[i],1),r[i].m(e,null))}for(L(),i=o.length;i<r.length;i+=1)c(i);q()}},i(t){if(!n){for(let t=0;t<o.length;t+=1)D(r[t]);n=!0}},o(t){r=r.filter(Boolean);for(let t=0;t<r.length;t+=1)F(r[t]);n=!1},d(t){t&&p(e),g(r,t)}}}const xe=t=>"reveal"==t.event;function we(t,e,n){let o;return l(t,kt,(t=>n(0,o=t))),[o]}class ke extends et{constructor(t){super(),tt(this,t,we,be,i,{})}}function _e(t){let e;function n(t,e){return t[1]?Ne:Ce}let o=n(t),r=o(t);return{c(){r.c(),e=$()},m(t,n){r.m(t,n),d(t,e,n)},p(t,c){o===(o=n(t))&&r?r.p(t,c):(r.d(1),r=o(t),r&&(r.c(),r.m(e.parentNode,e)))},d(t){t&&p(e),r.d(t)}}}function Se(e){let n;return{c(){n=h("👁️")},m(t,e){d(t,n,e)},p:t,d(t){t&&p(n)}}}function Ce(e){let n;return{c(){n=h("⌛")},m(t,e){d(t,n,e)},p:t,d(t){t&&p(n)}}}function Ne(t){let e,n=t[0].vote+"";return{c(){e=h(n)},m(t,n){d(t,e,n)},p(t,o){1&o&&n!==(n=t[0].vote+"")&&k(e,n)},d(t){t&&p(e)}}}function Oe(t){let e;function n(t,e){return t[0].is_spectator?Se:t[0].vote?_e:void 0}let o=n(t),r=o&&o(t);return{c(){r&&r.c(),e=$()},m(t,n){r&&r.m(t,n),d(t,e,n)},p(t,c){o===(o=n(t))&&r?r.p(t,c):(r&&r.d(1),r=o&&o(t),r&&(r.c(),r.m(e.parentNode,e)))},d(t){t&&p(e),r&&r.d(t)}}}function ze(t){let e,n,o,r,c,i,s=t[0].name+"";return c=new ft({props:{color:t[0].is_spectator?"#effbf7":void 0,$$slots:{default:[Oe]},$$scope:{ctx:t}}}),{c(){e=m("div"),n=m("strong"),o=h(s),r=v(),Y(c.$$.fragment),b(e,"class","participant svelte-10w4gcr"),S(e,"transform","rotate("+t[2]+"deg) translate(37.5vw) rotate(90deg)")},m(t,s){d(t,e,s),f(e,n),f(n,o),f(e,r),K(c,e,null),i=!0},p(t,[n]){(!i||1&n)&&s!==(s=t[0].name+"")&&k(o,s);const r={};1&n&&(r.color=t[0].is_spectator?"#effbf7":void 0),35&n&&(r.$$scope={dirty:n,ctx:t}),c.$set(r),(!i||4&n)&&S(e,"transform","rotate("+t[2]+"deg) translate(37.5vw) rotate(90deg)")},i(t){i||(D(c.$$.fragment,t),i=!0)},o(t){F(c.$$.fragment,t),i=!1},d(t){t&&p(e),Q(c)}}}function Ee(t,e,n){let o,{user:r}=e,{isRevealed:c}=e,{i:i}=e,{count:s}=e;return t.$$set=t=>{"user"in t&&n(0,r=t.user),"isRevealed"in t&&n(1,c=t.isRevealed),"i"in t&&n(3,i=t.i),"count"in t&&n(4,s=t.count)},t.$$.update=()=>{28&t.$$.dirty&&(n(2,o=-90),s>1&&n(2,o-=Math.min(20,174/s)*(i-(s-1)/2)))},[r,c,o,i,s]}class Ae extends et{constructor(t){super(),tt(this,t,Ee,ze,i,{user:0,isRevealed:1,i:3,count:4})}}function Re(t,e,n){const o=t.slice();return o[8]=e[n][0],o[9]=e[n][1],o}function We(t){let e,n,o,r,c,i,s,l,a,u,g,$=!1,x=t[9]+"";return a=function(t){let e;return{p(...n){e=n,e.forEach((e=>t.push(e)))},r(){e.forEach((e=>t.splice(t.indexOf(e),1)))}}}(t[6][0]),{c(){e=m("input"),c=v(),i=m("label"),s=h(x),b(e,"type","radio"),b(e,"class","btn-check"),e.__value=n=t[8],_(e,e.__value),b(e,"autocomplete","off"),b(e,"id",o="deck-"+t[8]),e.disabled=r=!t[1],b(i,"class","btn btn-outline-primary svelte-1y9hivi"),b(i,"for",l="deck-"+t[8]),a.p(e)},m(n,o){d(n,e,o),e.checked=e.__value===t[2],d(n,c,o),d(n,i,o),f(i,s),u||(g=y(e,"change",t[5]),u=!0)},p(t,c){1&c&&n!==(n=t[8])&&(e.__value=n,_(e,e.__value),$=!0),1&c&&o!==(o="deck-"+t[8])&&b(e,"id",o),2&c&&r!==(r=!t[1])&&(e.disabled=r),($||5&c)&&(e.checked=e.__value===t[2]),1&c&&x!==(x=t[9]+"")&&k(s,x),1&c&&l!==(l="deck-"+t[8])&&b(i,"for",l)},d(t){t&&(p(e),p(c),p(i)),a.r(),u=!1,g()}}}function Je(t){let e;function n(t,e){return!t[1]&&t[4]?Me:je}let o=n(t),r=o(t);return{c(){r.c(),e=$()},m(t,n){r.m(t,n),d(t,e,n)},p(t,c){o!==(o=n(t))&&(r.d(1),r=o(t),r&&(r.c(),r.m(e.parentNode,e)))},d(t){t&&p(e),r.d(t)}}}function je(t){let e;return{c(){e=m("div"),e.textContent="~",b(e,"class","voting-status svelte-1y9hivi"),b(e,"title","Voting in progress")},m(t,n){d(t,e,n)},d(t){t&&p(e)}}}function Me(t){let e;return{c(){e=m("div"),e.textContent="✓",b(e,"class","voting-status svelte-1y9hivi"),b(e,"title","Voting complete")},m(t,n){d(t,e,n)},d(t){t&&p(e)}}}function Ie(t){let e,n,o;return{c(){e=m("button"),e.textContent="Reveal",b(e,"class","btn btn-sm btn-success svelte-1y9hivi")},m(t,r){d(t,e,r),n||(o=y(e,"click",At),n=!0)},d(t){t&&p(e),n=!1,o()}}}function Pe(t){let e,n,o;return{c(){e=m("button"),e.textContent="Clear",b(e,"class","btn btn-sm btn-warning svelte-1y9hivi")},m(t,r){d(t,e,r),n||(o=y(e,"click",Rt),n=!0)},d(t){t&&p(e),n=!1,o()}}}function Ge(e){let n,o,r,c,i,s,l,a,u,$,x,w=U(e[0]),k=[];for(let t=0;t<w.length;t+=1)k[t]=We(Re(e,w,t));let _=!e[3]&&Je(e);function S(t,e){return t[1]?Pe:Ie}let C=S(e),N=C(e);return{c(){n=m("div"),o=m("div");for(let t=0;t<k.length;t+=1)k[t].c();r=h("\n     \n\n    "),_&&_.c(),c=v(),N.c(),i=v(),s=m("div"),l=m("label"),l.textContent="Auto reveal",a=v(),u=m("input"),b(o,"class","btn-group btn-group-sm"),b(o,"role","group"),b(o,"aria-label","Change deck"),b(l,"for","autoReveal"),b(l,"class","svelte-1y9hivi"),b(u,"type","checkbox"),b(u,"class","form-check-input"),b(u,"id","autoReveal"),b(s,"class","form-check form-switch mt-1 ms-3"),b(n,"class","d-flex justify-content-center m-3")},m(t,p){d(t,n,p),f(n,o);for(let t=0;t<k.length;t+=1)k[t]&&k[t].m(o,null);f(n,r),_&&_.m(n,null),f(n,c),N.m(n,null),f(n,i),f(n,s),f(s,l),f(s,a),f(s,u),u.checked=e[3],$||(x=y(u,"change",e[7]),$=!0)},p(t,[e]){if(7&e){let n;for(w=U(t[0]),n=0;n<w.length;n+=1){const r=Re(t,w,n);k[n]?k[n].p(r,e):(k[n]=We(r),k[n].c(),k[n].m(o,null))}for(;n<k.length;n+=1)k[n].d(1);k.length=w.length}t[3]?_&&(_.d(1),_=null):_?_.p(t,e):(_=Je(t),_.c(),_.m(n,c)),C!==(C=S(t))&&(N.d(1),N=C(t),N&&(N.c(),N.m(n,i))),8&e&&(u.checked=t[3])},i:t,o:t,d(t){t&&p(n),g(k,t),_&&_.d(),N.d(),$=!1,x()}}}function Xe(t,e,n){let o,r,c,i,s;l(t,vt,(t=>n(0,o=t))),l(t,bt,(t=>n(1,r=t))),l(t,yt,(t=>n(2,c=t))),l(t,$t,(t=>n(3,i=t))),l(t,Ct,(t=>n(4,s=t)));return[o,r,c,i,s,function(){c=this.__value,yt.set(c)},[[]],function(){i=this.checked,$t.set(i)}]}class Be extends et{constructor(t){super(),tt(this,t,Xe,Ge,i,{})}}function Te(t,e,n){const o=t.slice();return o[8]=e[n],o}function Le(t,e,n){const o=t.slice();return o[11]=e[n],o[13]=n,o}function qe(t){let e,n,o;return{c(){e=m("div"),n=m("div"),o=h(t[1]),b(n,"class","alert alert-danger"),b(n,"role","alert"),b(e,"class","fixed-top")},m(t,r){d(t,e,r),f(e,n),f(n,o)},p(t,e){2&e&&k(o,t[1])},d(t){t&&p(e)}}}function De(t,e){let n,o,r;return o=new Ae({props:{isRevealed:e[3],user:e[11],i:e[13],count:e[2].length}}),{key:t,first:null,c(){n=$(),Y(o.$$.fragment),this.first=n},m(t,e){d(t,n,e),K(o,t,e),r=!0},p(t,n){e=t;const r={};8&n&&(r.isRevealed=e[3]),4&n&&(r.user=e[11]),4&n&&(r.i=e[13]),4&n&&(r.count=e[2].length),o.$set(r)},i(t){r||(D(o.$$.fragment,t),r=!0)},o(t){F(o.$$.fragment,t),r=!1},d(t){t&&p(n),Q(o,t)}}}function Fe(t){let e,n,o;return n=new me({props:{votes:t[4],style:"background-color: #e6e6e6;",class:"p-2 mb-2 text-center rounded"}}),{c(){e=m("div"),Y(n.$$.fragment),b(e,"class","controls svelte-1cqza39")},m(t,r){d(t,e,r),K(n,e,null),o=!0},p(t,e){const o={};16&e&&(o.votes=t[4]),n.$set(o)},i(t){o||(D(n.$$.fragment,t),o=!0)},o(t){F(n.$$.fragment,t),o=!1},d(t){t&&p(e),Q(n)}}}function Ue(t){let e,n,o=U(t[6]),r=[];for(let e=0;e<o.length;e+=1)r[e]=Ye(Te(t,o,e));const c=t=>F(r[t],1,1,(()=>{r[t]=null}));return{c(){e=m("div");for(let t=0;t<r.length;t+=1)r[t].c();b(e,"class","d-flex justify-content-center")},m(t,o){d(t,e,o);for(let t=0;t<r.length;t+=1)r[t]&&r[t].m(e,null);n=!0},p(t,n){if(104&n){let i;for(o=U(t[6]),i=0;i<o.length;i+=1){const c=Te(t,o,i);r[i]?(r[i].p(c,n),D(r[i],1)):(r[i]=Ye(c),r[i].c(),D(r[i],1),r[i].m(e,null))}for(L(),i=o.length;i<r.length;i+=1)c(i);q()}},i(t){if(!n){for(let t=0;t<o.length;t+=1)D(r[t]);n=!0}},o(t){r=r.filter(Boolean);for(let t=0;t<r.length;t+=1)F(r[t]);n=!1},d(t){t&&p(e),g(r,t)}}}function He(e){let n,o,r,c,i,s;return{c(){n=h("You joined as spectator."),o=m("br"),r=h("\n                I want to\n                "),c=m("button"),c.textContent="become a voter",b(c,"class","btn btn-light btn-sm")},m(t,l){d(t,n,l),d(t,o,l),d(t,r,l),d(t,c,l),i||(s=y(c,"click",e[7]),i=!0)},p:t,i:t,o:t,d(t){t&&(p(n),p(o),p(r),p(c)),i=!1,s()}}}function Ve(t){let e,n=t[8]+"";return{c(){e=h(n)},m(t,n){d(t,e,n)},p(t,o){64&o&&n!==(n=t[8]+"")&&k(e,n)},d(t){t&&p(e)}}}function Ye(t){let e,n,o,i,s,l;return n=new ft({props:{color:t[3]?"#eee":null,$$slots:{default:[Ve]},$$scope:{ctx:t}}}),{c(){e=m("button"),Y(n.$$.fragment),o=v(),e.disabled=t[3],b(e,"class","btn m-0 p-0 svelte-1cqza39"),C(e,"selected",t[8]==t[5].vote)},m(r,a){d(r,e,a),K(n,e,null),f(e,o),i=!0,s||(l=[y(e,"click",(function(){c(Wt(t[8]))&&Wt(t[8]).apply(this,arguments)})),y(e,"keypress",(function(){c(Wt(t[8]))&&Wt(t[8]).apply(this,arguments)}))],s=!0)},p(o,r){t=o;const c={};8&r&&(c.color=t[3]?"#eee":null),16448&r&&(c.$$scope={dirty:r,ctx:t}),n.$set(c),(!i||8&r)&&(e.disabled=t[3]),(!i||96&r)&&C(e,"selected",t[8]==t[5].vote)},i(t){i||(D(n.$$.fragment,t),i=!0)},o(t){F(n.$$.fragment,t),i=!1},d(t){t&&p(e),Q(n),s=!1,r(l)}}}function Ke(t){let e,n;return e=new Pt({}),{c(){Y(e.$$.fragment)},m(t,o){K(e,t,o),n=!0},i(t){n||(D(e.$$.fragment,t),n=!0)},o(t){F(e.$$.fragment,t),n=!1},d(t){Q(e,t)}}}function Qe(t){let e,n,o,r,c,i,s,l,a,u,g,h,y,x,w,k,_,S=[],C=new Map,N=t[1]&&qe(t),O=U(t[2]);const z=t=>t[11].id;for(let e=0;e<O.length;e+=1){let n=Le(t,O,e),o=z(n);C.set(o,S[e]=De(o,n))}let E=t[3]&&Fe(t);const A=[He,Ue],R=[];function W(t,e){return t[5].is_spectator?0:1}l=W(t),a=R[l]=A[l](t),h=new Be({}),x=new ke({});let J=t[0]&&Ke();return{c(){N&&N.c(),e=v(),n=m("div");for(let t=0;t<S.length;t+=1)S[t].c();o=v(),E&&E.c(),r=v(),c=m("div"),i=m("div"),s=m("div"),a.c(),u=v(),g=m("div"),Y(h.$$.fragment),y=v(),Y(x.$$.fragment),w=v(),J&&J.c(),k=$(),b(n,"class","participants svelte-1cqza39"),b(s,"class","col"),b(i,"class","row"),b(g,"class","row"),b(c,"class","container text-center")},m(t,a){N&&N.m(t,a),d(t,e,a),d(t,n,a);for(let t=0;t<S.length;t+=1)S[t]&&S[t].m(n,null);f(n,o),E&&E.m(n,null),d(t,r,a),d(t,c,a),f(c,i),f(i,s),R[l].m(s,null),f(c,u),f(c,g),K(h,g,null),f(c,y),K(x,c,null),d(t,w,a),J&&J.m(t,a),d(t,k,a),_=!0},p(t,[r]){t[1]?N?N.p(t,r):(N=qe(t),N.c(),N.m(e.parentNode,e)):N&&(N.d(1),N=null),12&r&&(O=U(t[2]),L(),S=V(S,r,z,1,t,O,C,n,H,De,o,Le),q()),t[3]?E?(E.p(t,r),8&r&&D(E,1)):(E=Fe(t),E.c(),D(E,1),E.m(n,null)):E&&(L(),F(E,1,1,(()=>{E=null})),q());let c=l;l=W(t),l===c?R[l].p(t,r):(L(),F(R[c],1,1,(()=>{R[c]=null})),q(),a=R[l],a?a.p(t,r):(a=R[l]=A[l](t),a.c()),D(a,1),a.m(s,null)),t[0]?J?1&r&&D(J,1):(J=Ke(),J.c(),D(J,1),J.m(k.parentNode,k)):J&&(L(),F(J,1,1,(()=>{J=null})),q())},i(t){if(!_){for(let t=0;t<O.length;t+=1)D(S[t]);D(E),D(a),D(h.$$.fragment,t),D(x.$$.fragment,t),D(J),_=!0}},o(t){for(let t=0;t<S.length;t+=1)F(S[t]);F(E),F(a),F(h.$$.fragment,t),F(x.$$.fragment,t),F(J),_=!1},d(t){t&&(p(e),p(n),p(r),p(c),p(w),p(k)),N&&N.d(t);for(let t=0;t<S.length;t+=1)S[t].d();E&&E.d(),R[l].d(),Q(h),Q(x),J&&J.d(t)}}}function Ze(t,e,n){let o,r,c,i,s,a;l(t,wt,(t=>n(1,o=t))),l(t,mt,(t=>n(2,r=t))),l(t,bt,(t=>n(3,c=t))),l(t,St,(t=>n(4,i=t))),l(t,xt,(t=>n(5,s=t))),l(t,ht,(t=>n(6,a=t)));let u=!1;z((()=>{Et(rt("websocket_url")),n(0,u=new URLSearchParams(window.location.search).get("debug"))}));return[u,o,r,c,i,s,a,()=>zt("settings",{is_spectator:!1})]}class tn extends et{constructor(t){super(),tt(this,t,Ze,Qe,i,{})}}function en(t){let e,n;return e=new lt({}),{c(){Y(e.$$.fragment)},m(t,o){K(e,t,o),n=!0},i(t){n||(D(e.$$.fragment,t),n=!0)},o(t){F(e.$$.fragment,t),n=!1},d(t){Q(e,t)}}}function nn(t){let e,n;return e=new tn({}),{c(){Y(e.$$.fragment)},m(t,o){K(e,t,o),n=!0},i(t){n||(D(e.$$.fragment,t),n=!0)},o(t){F(e.$$.fragment,t),n=!1},d(t){Q(e,t)}}}function on(e){let n,o,r,c;const i=[nn,en],s=[];return n=function(t,e){return t[0]?0:1}(e),o=s[n]=i[n](e),{c(){o.c(),r=$()},m(t,e){s[n].m(t,e),d(t,r,e),c=!0},p:t,i(t){c||(D(o),c=!0)},o(t){F(o),c=!1},d(t){t&&p(r),s[n].d(t)}}}function rn(t){return[rt("websocket_url")]}return new class extends et{constructor(t){super(),tt(this,t,rn,on,i,{})}}({target:document.querySelector("#poker")})}();
