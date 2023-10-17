var app=function(){"use strict";function t(){}function e(t,e){for(const n in e)t[n]=e[n];return t}function n(t){return t()}function o(){return Object.create(null)}function r(t){t.forEach(n)}function c(t){return"function"==typeof t}function i(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function s(e,...n){if(null==e){for(const t of n)t(void 0);return t}const o=e.subscribe(...n);return o.unsubscribe?()=>o.unsubscribe():o}function l(t,e,n){t.$$.on_destroy.push(s(e,n))}function a(t,n,o,r){return t[1]&&r?e(o.ctx.slice(),t[1](r(n))):o.ctx}function u(t,e){const n={};e=new Set(e);for(const o in t)e.has(o)||"$"===o[0]||(n[o]=t[o]);return n}function d(t,e){t.appendChild(e)}function f(t,e,n){t.insertBefore(e,n||null)}function p(t){t.parentNode&&t.parentNode.removeChild(t)}function h(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function g(t){return document.createElement(t)}function m(t){return document.createTextNode(t)}function v(){return m(" ")}function $(){return m("")}function y(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function b(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}const x=["width","height"];function k(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const o in e)null==e[o]?t.removeAttribute(o):"style"===o?t.style.cssText=e[o]:"__value"===o?t.value=t[o]=e[o]:n[o]&&n[o].set&&-1===x.indexOf(o)?t[o]=e[o]:b(t,o,e[o])}function w(t,e){e=""+e,t.data!==e&&(t.data=e)}function _(t,e){t.value=null==e?"":e}function S(t,e,n,o){null==n?t.style.removeProperty(e):t.style.setProperty(e,n,o?"important":"")}function C(t,e,n){t.classList.toggle(e,!!n)}let N;function O(t){N=t}function E(t){(function(){if(!N)throw new Error("Function called outside component initialization");return N})().$$.on_mount.push(t)}function z(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach((t=>t.call(this,e)))}const A=[],R=[];let W=[];const J=[],j=Promise.resolve();let M=!1;function I(t){W.push(t)}const P=new Set;let G=0;function X(){if(0!==G)return;const t=N;do{try{for(;G<A.length;){const t=A[G];G++,O(t),B(t.$$)}}catch(t){throw A.length=0,G=0,t}for(O(null),A.length=0,G=0;R.length;)R.pop()();for(let t=0;t<W.length;t+=1){const e=W[t];P.has(e)||(P.add(e),e())}W.length=0}while(A.length);for(;J.length;)J.pop()();M=!1,P.clear(),O(t)}function B(t){if(null!==t.fragment){t.update(),r(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(I)}}const T=new Set;let L;function D(){L={r:0,c:[],p:L}}function F(){L.r||r(L.c),L=L.p}function U(t,e){t&&t.i&&(T.delete(t),t.i(e))}function H(t,e,n,o){if(t&&t.o){if(T.has(t))return;T.add(t),L.c.push((()=>{T.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}else o&&o()}function q(t){return void 0!==t?.length?t:Array.from(t)}function V(t,e){H(t,1,1,(()=>{e.delete(t.key)}))}function Y(t,e,n,o,c,i,s,l,a,u,d,f){let p=t.length,h=i.length,g=p;const m={};for(;g--;)m[t[g].key]=g;const v=[],$=new Map,y=new Map,b=[];for(g=h;g--;){const t=f(c,i,g),r=n(t);let l=s.get(r);l?o&&b.push((()=>l.p(t,e))):(l=u(r,t),l.c()),$.set(r,v[g]=l),r in m&&y.set(r,Math.abs(g-m[r]))}const x=new Set,k=new Set;function w(t){U(t,1),t.m(l,d),s.set(t.key,t),d=t.first,h--}for(;p&&h;){const e=v[h-1],n=t[p-1],o=e.key,r=n.key;e===n?(d=e.first,p--,h--):$.has(r)?!s.has(o)||x.has(o)?w(e):k.has(r)?p--:y.get(o)>y.get(r)?(k.add(o),w(e)):(x.add(r),p--):(a(n,s),p--)}for(;p--;){const e=t[p];$.has(e.key)||a(e,s)}for(;h;)w(v[h-1]);return r(b),v}function K(t){t&&t.c()}function Q(t,e,o){const{fragment:i,after_update:s}=t.$$;i&&i.m(e,o),I((()=>{const e=t.$$.on_mount.map(n).filter(c);t.$$.on_destroy?t.$$.on_destroy.push(...e):r(e),t.$$.on_mount=[]})),s.forEach(I)}function Z(t,e){const n=t.$$;null!==n.fragment&&(!function(t){const e=[],n=[];W.forEach((o=>-1===t.indexOf(o)?e.push(o):n.push(o))),n.forEach((t=>t())),W=e}(n.after_update),r(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function tt(t,e){-1===t.$$.dirty[0]&&(A.push(t),M||(M=!0,j.then(X)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function et(e,n,c,i,s,l,a=null,u=[-1]){const d=N;O(e);const f=e.$$={fragment:null,ctx:[],props:l,update:t,not_equal:s,bound:o(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(d?d.$$.context:[])),callbacks:o(),dirty:u,skip_bound:!1,root:n.target||d.$$.root};a&&a(f.root);let h=!1;if(f.ctx=c?c(e,n.props||{},((t,n,...o)=>{const r=o.length?o[0]:n;return f.ctx&&s(f.ctx[t],f.ctx[t]=r)&&(!f.skip_bound&&f.bound[t]&&f.bound[t](r),h&&tt(e,t)),n})):[],f.update(),h=!0,r(f.before_update),f.fragment=!!i&&i(f.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);f.fragment&&f.fragment.l(t),t.forEach(p)}else f.fragment&&f.fragment.c();n.intro&&U(e.$$.fragment),Q(e,n.target,n.anchor),X()}O(d)}class nt{$$=void 0;$$set=void 0;$destroy(){Z(this,1),this.$destroy=t}$on(e,n){if(!c(n))return t;const o=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return o.push(n),()=>{const t=o.indexOf(n);-1!==t&&o.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}
/*! js-cookie v3.0.5 | MIT */
function ot(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var o in n)t[o]=n[o]}return t}"undefined"!=typeof window&&(window.__svelte||(window.__svelte={v:new Set})).v.add("4");var rt=function t(e,n){function o(t,o,r){if("undefined"!=typeof document){"number"==typeof(r=ot({},n,r)).expires&&(r.expires=new Date(Date.now()+864e5*r.expires)),r.expires&&(r.expires=r.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var c="";for(var i in r)r[i]&&(c+="; "+i,!0!==r[i]&&(c+="="+r[i].split(";")[0]));return document.cookie=t+"="+e.write(o,t)+c}}return Object.create({set:o,get:function(t){if("undefined"!=typeof document&&(!arguments.length||t)){for(var n=document.cookie?document.cookie.split("; "):[],o={},r=0;r<n.length;r++){var c=n[r].split("="),i=c.slice(1).join("=");try{var s=decodeURIComponent(c[0]);if(o[s]=e.read(i,s),t===s)break}catch(t){}}return t?o[t]:o}},remove:function(t,e){o(t,"",ot({},e,{expires:-1}))},withAttributes:function(e){return t(this.converter,ot({},this.attributes,e))},withConverter:function(e){return t(ot({},this.converter,e),this.attributes)}},{attributes:{value:Object.freeze(n)},converter:{value:Object.freeze(e)}})}({read:function(t){return'"'===t[0]&&(t=t.slice(1,-1)),t.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(t){return encodeURIComponent(t).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"});function ct(t){let e=document.getElementById(t);if(e)return JSON.parse(e.textContent)}function it(t){let e,n;return{c(){e=g("div"),n=m(t[2]),b(e,"class","invalid-feedback")},m(t,o){f(t,e,o),d(e,n)},p(t,e){4&e&&w(n,t[2])},d(t){t&&p(e)}}}function st(e){let n,o,c,i,s,l,a,u,h,$,x,k,w,S,N,O,E,z,A,R,W=e[2]&&it(e);return{c(){n=g("h1"),n.textContent="Planning poker",o=v(),c=g("form"),i=g("div"),s=g("input"),l=v(),a=g("div"),u=g("input"),h=v(),W&&W.c(),$=v(),x=g("div"),x.innerHTML='<input type="submit" class="btn btn-primary" value="Join"/>',k=v(),w=g("div"),S=g("label"),N=g("input"),O=m(" Join as a spectator 👁️"),E=v(),z=g("span"),z.textContent="You can always enable voting later",b(s,"type","hidden"),b(s,"name","csrfmiddlewaretoken"),s.value=rt.get("csrftoken"),b(u,"type","text"),b(u,"name","name"),b(u,"class","form-control"),C(u,"is-invalid",e[2]),b(a,"class","col"),b(x,"class","col"),b(i,"class","row row-cols-lg-auto"),b(N,"type","checkbox"),b(N,"name","is_spectator"),b(S,"class","col"),b(z,"class","text-muted"),b(w,"class","row"),b(c,"method","post")},m(t,r){f(t,n,r),f(t,o,r),f(t,c,r),d(c,i),d(i,s),d(i,l),d(i,a),d(a,u),_(u,e[0]),d(a,h),W&&W.m(a,null),d(i,$),d(i,x),d(c,k),d(c,w),d(w,S),d(S,N),N.checked=e[1],d(S,O),d(w,E),d(w,z),A||(R=[y(u,"change",e[3]),y(u,"input",e[4]),y(N,"change",e[5])],A=!0)},p(t,[e]){1&e&&u.value!==t[0]&&_(u,t[0]),4&e&&C(u,"is-invalid",t[2]),t[2]?W?W.p(t,e):(W=it(t),W.c(),W.m(a,null)):W&&(W.d(1),W=null),2&e&&(N.checked=t[1])},i:t,o:t,d(t){t&&(p(n),p(o),p(c)),W&&W.d(),A=!1,r(R)}}}function lt(t,e,n){let o,r="",c=null;E((()=>{const t=localStorage.getItem("name");t&&n(0,r=t);const e=localStorage.getItem("isSpectator");null!==e&&n(1,c="true"===e)}));return t.$$.update=()=>{1&t.$$.dirty&&r&&localStorage.setItem("name",r),2&t.$$.dirty&&null!=c&&localStorage.setItem("isSpectator",c?"true":"false")},[r,c,o,()=>{n(2,o=r?void 0:"Name cannot be empty")},function(){r=this.value,n(0,r)},function(){c=this.checked,n(1,c)}]}class at extends nt{constructor(t){super(),et(this,t,lt,st,i,{})}}function ut(t){let e,n,o,c;const i=t[7].default,s=function(t,e,n,o){if(t){const r=a(t,e,n,o);return t[0](r)}}(i,t,t[6],null);return{c(){e=g("div"),s&&s.c(),b(e,"class","card svelte-1so03ou"),S(e,"background-color",t[2]||"#d8f7ec"),S(e,"height",t[4]+"px"),S(e,"width",.65*t[4]+"px"),b(e,"disabled",t[0]),b(e,"role","button"),b(e,"tabindex","0"),C(e,"selected",t[1])},m(r,i){f(r,e,i),s&&s.m(e,null),t[10](e),n=!0,o||(c=[y(e,"click",t[8]),y(e,"keypress",t[9])],o=!0)},p(t,[o]){s&&s.p&&(!n||64&o)&&function(t,e,n,o,r,c){if(r){const i=a(e,n,o,c);t.p(i,r)}}(s,i,t,t[6],n?function(t,e,n,o){if(t[2]&&o){const r=t[2](o(n));if(void 0===e.dirty)return r;if("object"==typeof r){const t=[],n=Math.max(e.dirty.length,r.length);for(let o=0;o<n;o+=1)t[o]=e.dirty[o]|r[o];return t}return e.dirty|r}return e.dirty}(i,t[6],o,null):function(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let t=0;t<n;t++)e[t]=-1;return e}return-1}(t[6]),null),(!n||4&o)&&S(e,"background-color",t[2]||"#d8f7ec"),(!n||16&o)&&S(e,"height",t[4]+"px"),(!n||16&o)&&S(e,"width",.65*t[4]+"px"),(!n||1&o)&&b(e,"disabled",t[0]),(!n||2&o)&&C(e,"selected",t[1])},i(t){n||(U(s,t),n=!0)},o(t){H(s,t),n=!1},d(n){n&&p(e),s&&s.d(n),t[10](null),o=!1,r(c)}}}function dt(t,e,n){let o,r,{$$slots:c={},$$scope:i}=e,{disabled:s=!0}=e,{selected:l=""}=e,{color:a=null}=e,{size:u="regular"}=e;return t.$$set=t=>{"disabled"in t&&n(0,s=t.disabled),"selected"in t&&n(1,l=t.selected),"color"in t&&n(2,a=t.color),"size"in t&&n(5,u=t.size),"$$scope"in t&&n(6,i=t.$$scope)},t.$$.update=()=>{10&t.$$.dirty&&r&&l&&r.blur(),32&t.$$.dirty&&n(4,o="sm"==u?45:70)},[s,l,a,r,o,u,i,c,function(e){z.call(this,t,e)},function(e){z.call(this,t,e)},function(t){R[t?"unshift":"push"]((()=>{r=t,n(3,r)}))}]}class ft extends nt{constructor(t){super(),et(this,t,dt,ut,i,{disabled:0,selected:1,color:2,size:5})}}const pt=[];function ht(e,n=t){let o;const r=new Set;function c(t){if(i(e,t)&&(e=t,o)){const t=!pt.length;for(const t of r)t[1](),pt.push(t,e);if(t){for(let t=0;t<pt.length;t+=2)pt[t][0](pt[t+1]);pt.length=0}}}function s(t){c(t(e))}return{set:c,update:s,subscribe:function(i,l=t){const a=[i,l];return r.add(a),1===r.size&&(o=n(c,s)||t),i(e),()=>{r.delete(a),0===r.size&&o&&(o(),o=null)}}}}function gt(e,n,o){const i=!Array.isArray(e),l=i?[e]:e;if(!l.every(Boolean))throw new Error("derived() expects stores as input, got a falsy value");const a=n.length<2;return u=(e,o)=>{let u=!1;const d=[];let f=0,p=t;const h=()=>{if(f)return;p();const r=n(i?d[0]:d,e,o);a?e(r):p=c(r)?r:t},g=l.map(((t,e)=>s(t,(t=>{d[e]=t,f&=~(1<<e),u&&h()}),(()=>{f|=1<<e}))));return u=!0,h(),function(){r(g),p(),u=!1}},{subscribe:ht(o,u).subscribe};var u}const mt=ht([]),vt=ht([]),$t=ht([]),yt=ht(!1),bt=ht("tshirt"),xt=ht(!1),kt=ht({}),wt=ht(void 0),_t=ht([]);function St(t){const e=new Proxy({},{get:(t,e)=>e in t?t[e]:0});return t.forEach((t=>{null!=t&&(e[t]+=1)})),Object.entries(e).sort(((t,e)=>e[1]-t[1]))}const Ct=gt(mt,(t=>St(t.map((t=>t.vote))))),Nt=gt(mt,(t=>t.every((t=>t.is_spectator||t.vote)))),Ot=t=>{kt.update((e=>(e.vote=t,e)))};let Et;function zt(t,e=void 0){Et&&1==Et.readyState?((e=e||{}).action=t,console.log("update",e),Et.send(JSON.stringify(e))):console.log("Socket not open yet")}function At(t){Et=new WebSocket(t),Et.onclose=()=>{wt.set("WebSocket connection closed unexpectedly. Trying to reconnect in 2s..."),setTimeout((()=>{console.log("Reconnecting..."),At(t)}),2e3)},Et.onopen=()=>{zt({action:"init"})},Et.onmessage=t=>{const e=JSON.parse(t.data);switch(console.log("message",e),e.type){case"init":mt.set(e.users),kt.set(e.user),vt.set(e.settings.choices),yt.set(e.settings.auto_reveal),xt.set(e.settings.is_revealed),$t.set(e.settings.decks),bt.set(e.settings.deck),_t.set(e.log),wt.set(void 0);break;case"vote":mt.update((t=>(t.forEach((t=>{t.id==e.user_id&&(t.vote=e.value)})),[...t])));break;case"error":wt.set(e.message)}}}const Rt=()=>zt("reveal"),Wt=()=>{Ot(null),zt("clear")};function Jt(t){return()=>{(function(t){let e;return s(t,(t=>e=t))(),e})(xt)||(zt("vote",{value:t}),Ot(t))}}function jt(t,e,n){const o=t.slice();return o[14]=e[n],o}function Mt(t){let e,n,o,r,c,i,s,l,a=t[14].time+"",u=t[14].event+"",h=JSON.stringify(t[14].data)+"";return{c(){e=g("div"),n=g("span"),o=m(a),r=v(),c=m(u),i=v(),s=m(h),l=v()},m(t,a){f(t,e,a),d(e,n),d(n,o),d(e,r),d(e,c),d(e,i),d(e,s),d(e,l)},p(t,e){16&e&&a!==(a=t[14].time+"")&&w(o,a),16&e&&u!==(u=t[14].event+"")&&w(c,u),16&e&&h!==(h=JSON.stringify(t[14].data)+"")&&w(s,h)},d(t){t&&p(e)}}}function It(e){let n,o,c,i,s,l,a,u,$,x,k,_,S,C,N,O,E,z,A,R,W,J,j,M,I=JSON.stringify(e[0])+"",P=JSON.stringify(e[1])+"",G=JSON.stringify(e[2])+"",X=JSON.stringify(e[3])+"",B=!e[5]&&function(t){let e,n,o,c,i;return{c(){e=g("button"),e.textContent="Add fake users",n=v(),o=g("button"),o.textContent="Add fake votes",b(e,"class","btn btn-xs btn-warning"),b(o,"class","btn btn-xs btn-warning")},m(r,s){f(r,e,s),f(r,n,s),f(r,o,s),c||(i=[y(e,"click",t[12]),y(o,"click",t[13])],c=!0)},d(t){t&&(p(e),p(n),p(o)),c=!1,r(i)}}}(e),T=q(e[4]),L=[];for(let t=0;t<T.length;t+=1)L[t]=Mt(jt(e,T,t));return{c(){n=g("div"),o=g("div"),c=g("div"),i=m("debug"),s=g("code"),l=m(I),a=v(),u=g("div"),$=m("votes: "),x=g("code"),k=m(P),_=v(),S=g("div"),C=m("user: "),N=g("code"),O=m(G),E=v(),z=g("div"),A=m("participants: "),R=g("code"),W=m(X),J=v(),B&&B.c(),j=v(),M=g("div");for(let t=0;t<L.length;t+=1)L[t].c();b(o,"class","col"),b(M,"class","col"),b(n,"class","row bg-light rounded p-2 small")},m(t,e){f(t,n,e),d(n,o),d(o,c),d(c,i),d(c,s),d(s,l),d(o,a),d(o,u),d(u,$),d(u,x),d(x,k),d(o,_),d(o,S),d(S,C),d(S,N),d(N,O),d(o,E),d(o,z),d(z,A),d(z,R),d(R,W),d(o,J),B&&B.m(o,null),d(n,j),d(n,M);for(let t=0;t<L.length;t+=1)L[t]&&L[t].m(M,null)},p(t,[e]){if(1&e&&I!==(I=JSON.stringify(t[0])+"")&&w(l,I),2&e&&P!==(P=JSON.stringify(t[1])+"")&&w(k,P),4&e&&G!==(G=JSON.stringify(t[2])+"")&&w(O,G),8&e&&X!==(X=JSON.stringify(t[3])+"")&&w(W,X),16&e){let n;for(T=q(t[4]),n=0;n<T.length;n+=1){const o=jt(t,T,n);L[n]?L[n].p(o,e):(L[n]=Mt(o),L[n].c(),L[n].m(M,null))}for(;n<L.length;n+=1)L[n].d(1);L.length=T.length}},i:t,o:t,d(t){t&&p(n),B&&B.d(),h(L,t)}}}function Pt(t,e,n){let o,r,c,i,s,a,u,d,f,p,h;l(t,yt,(t=>n(6,r=t))),l(t,xt,(t=>n(7,c=t))),l(t,vt,(t=>n(8,i=t))),l(t,$t,(t=>n(9,s=t))),l(t,bt,(t=>n(10,a=t))),l(t,wt,(t=>n(11,u=t))),l(t,Ct,(t=>n(1,d=t))),l(t,kt,(t=>n(2,f=t))),l(t,mt,(t=>n(3,p=t))),l(t,_t,(t=>n(4,h=t)));const g=!window.location.host.includes("localhost");return t.$$.update=()=>{4032&t.$$.dirty&&n(0,o={error:u,deck:a,decks:s,choices:i,isRevealed:c,autoReveal:r})},[o,d,f,p,h,g,r,c,i,s,a,u,()=>zt("add_fakes"),()=>zt("fake_votes")]}bt.subscribe((t=>zt("settings",{deck:t}))),yt.subscribe((t=>zt("settings",{auto_reveal:t})));class Gt extends nt{constructor(t){super(),et(this,t,Pt,It,i,{})}}const Xt=(t,e={})=>{le(e);let{colors:n=["#FFC700","#FF0000","#2E3191","#41BBC7"],duration:o=3500,force:r=.5,particleCount:c=150,particleShape:i="mix",particleSize:s=12,destroyAfterDone:l=!0,stageHeight:a=800,stageWidth:u=1600}=e;!function(t){const e=Kt("style");e.dataset.neoconfetti="",e.textContent='@keyframes fk9XWG_y-axis{to{transform:translate3d(0,var(--stage-height),0)}}@keyframes fk9XWG_x-axis{to{transform:translate3d(var(--x-landing-point),0,0)}}@keyframes fk9XWG_rotation{50%{transform:rotate3d(var(--half-rotation),180deg)}to{transform:rotate3d(var(--rotation),360deg)}}.fk9XWG_container{width:0;height:0;z-index:1200;position:relative;overflow:visible}.fk9XWG_particle{animation:x-axis var(--duration-chaos)forwards cubic-bezier(var(--x1),var(--x2),var(--x3),var(--x4));animation-name:fk9XWG_x-axis}.fk9XWG_particle>div{animation:y-axis var(--duration-chaos)forwards cubic-bezier(var(--y1),var(--y2),var(--y3),var(--y4));width:var(--width);height:var(--height);animation-name:fk9XWG_y-axis;position:absolute;top:0;left:0}.fk9XWG_particle>div:before{height:100%;width:100%;content:"";background-color:var(--bgcolor);animation:rotation var(--rotation-duration)infinite linear;border-radius:var(--border-radius);animation-name:fk9XWG_rotation;display:block}',Qt(document.head,e)}(),t.classList.add("fk9XWG_container"),t.style.setProperty("--stage-height",a+"px");let d,f=Zt(c,n),p=Bt(t,f);function h(t,e){const n=Vt(qt()*(re-1)),c="rectangles"!==i&&("circles"===i||ce(n)),l=(e,n)=>t.style.setProperty(e,n+"");l("--x-landing-point",ee(Ht(ne(e,90)-180),0,180,-u/2,u/2)+"px"),l("--duration-chaos",o-Vt(1e3*qt())+"ms");const a=qt()<Dt?te(qt()*Ft,2):0;l("--x1",a),l("--x2",-1*a),l("--x3",a),l("--x4",te(Ht(ee(Ht(ne(e,90)-180),0,180,-1,1)),4)),l("--y1",te(qt()*Ut,4)),l("--y2",te(qt()*r*(oe()?1:-1),4)),l("--y3",Ut),l("--y4",te(Yt(ee(Ht(e-180),0,180,r,-r),0),4)),l("--width",(c?s:Vt(4*qt())+s/2)+"px"),l("--height",(c?s:Vt(2*qt())+s)+"px");const d=n.toString(2).padStart(3,"0").split("");l("--half-rotation",d.map((t=>+t/2+""))),l("--rotation",d),l("--rotation-duration",te(qt()*(Lt-Tt)+Tt)+"ms"),l("--border-radius",c?"50%":0)}for(const[t,e]of Object.entries(p))h(e,f[+t].degree);return Promise.resolve().then((()=>d=setTimeout((()=>l&&(t.innerHTML="")),o))),{update(e){le(e);const h=e.particleCount??c,g=e.colors??n,m=e.stageHeight??a;if(f=Zt(h,g),h===c&&JSON.stringify(n)!==JSON.stringify(g))for(const[t,{color:e}]of Object.entries(f))p[+t].style.setProperty("--bgcolor",e);h!==c&&(t.innerHTML="",p=Bt(t,f)),l&&!e.destroyAfterDone&&clearTimeout(d),t.style.setProperty("--stage-height",m+"px"),n=g,o=e.duration??o,r=e.force??r,c=h,i=e.particleShape??i,s=e.particleSize??s,l=e.destroyAfterDone??l,a=m,u=e.stageWidth??u},destroy(){clearTimeout(d)}}};function Bt(t,e=[]){const n=[];for(const{color:o}of e){const e=Kt("div");e.className="fk9XWG_particle",e.style.setProperty("--bgcolor",o);const r=Kt("div");Qt(e,r),Qt(t,e),n.push(e)}return n}const Tt=200,Lt=800,Dt=.1,Ft=.3,Ut=.5,Ht=Math.abs,qt=Math.random,Vt=Math.round,Yt=Math.max,Kt=t=>document.createElement(t),Qt=(t,e)=>t.appendChild(e),Zt=(t,e)=>Array.from({length:t},((n,o)=>({color:e[o%e.length],degree:360*o/t}))),te=(t,e=2)=>Vt((t+Number.EPSILON)*10**e)/10**e,ee=(t,e,n,o,r)=>(t-e)*(r-o)/(n-e)+o,ne=(t,e)=>t+e>360?t+e-360:t+e,oe=()=>qt()>.5,re=6,ce=t=>1!==t&&oe(),ie=t=>void 0===t,se=(t,e)=>{if(!ie(t)&&Number.isSafeInteger(t)&&t<0)throw new Error(e+" must be a positive integer")},le=({particleCount:t,duration:e,colors:n,particleSize:o,force:r,stageHeight:c,stageWidth:i,particleShape:s})=>{if(se(t,"particleCount"),se(e,"duration"),se(o,"particleSize"),se(r,"force"),se(c,"stageHeight"),se(i,"stageWidth"),!ie(s)&&!/^(mix|circles|rectangles)$/i.test(s))throw new Error('particlesShape should be either "mix" or "circles" or "rectangle"');if(!ie(n)&&!Array.isArray(n))throw new Error("colors must be an array of strings");if(r>1)throw new Error("force must be within 0 and 1")};function ae(t,e,n){const o=t.slice();return o[4]=e[n][0],o[5]=e[n][1],o}function ue(e){let n,o,r;return{c(){n=g("div")},m(e,i){var s;f(e,n,i),o||(s=Xt.call(null,n),r=s&&c(s.destroy)?s.destroy:t,o=!0)},d(t){t&&p(n),o=!1,r()}}}function de(e){let n;return{c(){n=g("div"),n.textContent="No votes",b(n,"class","col text-center p-2")},m(t,e){f(t,n,e)},p:t,d(t){t&&p(n)}}}function fe(t){let e,n=t[4]+"";return{c(){e=m(n)},m(t,n){f(t,e,n)},p(t,o){1&o&&n!==(n=t[4]+"")&&w(e,n)},d(t){t&&p(e)}}}function pe(t,e){let n,o,r,c,i,s,l,a,u=e[5]+"";return o=new ft({props:{size:e[1],$$slots:{default:[fe]},$$scope:{ctx:e}}}),{key:t,first:null,c(){n=g("div"),K(o.$$.fragment),r=v(),c=g("div"),i=m(u),s=m("x"),l=v(),b(c,"class","text-muted"),b(n,"class","d-inline-block text-center"),this.first=n},m(t,e){f(t,n,e),Q(o,n,null),d(n,r),d(n,c),d(c,i),d(c,s),d(n,l),a=!0},p(t,n){e=t;const r={};2&n&&(r.size=e[1]),257&n&&(r.$$scope={dirty:n,ctx:e}),o.$set(r),(!a||1&n)&&u!==(u=e[5]+"")&&w(i,u)},i(t){a||(U(o.$$.fragment,t),a=!0)},o(t){H(o.$$.fragment,t),a=!1},d(t){t&&p(n),Z(o)}}}function he(t){let n,o,r,c=[],i=new Map,s=t[2]&&t[0]&&1==t[0].length&&t[0][0][1]>1&&ue(),l=q(t[0]);const a=t=>t[4];for(let e=0;e<l.length;e+=1){let n=ae(t,l,e),o=a(n);i.set(o,c[e]=pe(o,n))}let u=null;l.length||(u=de());let d=[t[3]],h={};for(let t=0;t<d.length;t+=1)h=e(h,d[t]);return{c(){s&&s.c(),n=v(),o=g("div");for(let t=0;t<c.length;t+=1)c[t].c();u&&u.c(),k(o,h)},m(t,e){s&&s.m(t,e),f(t,n,e),f(t,o,e);for(let t=0;t<c.length;t+=1)c[t]&&c[t].m(o,null);u&&u.m(o,null),r=!0},p(t,[e]){t[2]&&t[0]&&1==t[0].length&&t[0][0][1]>1?s||(s=ue(),s.c(),s.m(n.parentNode,n)):s&&(s.d(1),s=null),3&e&&(l=q(t[0]),D(),c=Y(c,e,a,1,t,l,i,o,V,pe,null,ae),F(),!l.length&&u?u.p(t,e):l.length?u&&(u.d(1),u=null):(u=de(),u.c(),u.m(o,null))),k(o,h=function(t,e){const n={},o={},r={$$scope:1};let c=t.length;for(;c--;){const i=t[c],s=e[c];if(s){for(const t in i)t in s||(o[t]=1);for(const t in s)r[t]||(n[t]=s[t],r[t]=1);t[c]=s}else for(const t in i)r[t]=1}for(const t in o)t in n||(n[t]=void 0);return n}(d,[8&e&&t[3]]))},i(t){if(!r){for(let t=0;t<l.length;t+=1)U(c[t]);r=!0}},o(t){for(let t=0;t<c.length;t+=1)H(c[t]);r=!1},d(t){t&&(p(n),p(o)),s&&s.d(t);for(let t=0;t<c.length;t+=1)c[t].d();u&&u.d()}}}function ge(t,n,o){const r=["votes","size","emitConfetti"];let c=u(n,r),{votes:i}=n,{size:s}=n,{emitConfetti:l=!0}=n;return t.$$set=t=>{n=e(e({},n),function(t){const e={};for(const n in t)"$"!==n[0]&&(e[n]=t[n]);return e}(t)),o(3,c=u(n,r)),"votes"in t&&o(0,i=t.votes),"size"in t&&o(1,s=t.size),"emitConfetti"in t&&o(2,l=t.emitConfetti)},[i,s,l,c]}class me extends nt{constructor(t){super(),et(this,t,ge,he,i,{votes:0,size:1,emitConfetti:2})}}function ve(t,e,n){const o=t.slice();o[1]=e[n].data;const r=St(o[1].votes);return o[2]=r,o}function $e(t){let e,n;return{c(){e=g("br"),n=m("no votes")},m(t,o){f(t,e,o),f(t,n,o)},d(t){t&&(p(e),p(n))}}}function ye(t){let e,n,o,r;return n=new me({props:{votes:t[2],emitConfetti:!1,size:"sm"}}),{c(){e=g("div"),K(n.$$.fragment),o=v(),b(e,"class","small history-item rounded me-1 my-3 p-1 svelte-oq1c7h")},m(t,c){f(t,e,c),Q(n,e,null),d(e,o),r=!0},p(t,e){const o={};1&e&&(o.votes=t[2]),n.$set(o)},i(t){r||(U(n.$$.fragment,t),r=!0)},o(t){H(n.$$.fragment,t),r=!1},d(t){t&&p(e),Z(n)}}}function be(t){let e,n,o,r,c,i,s,l=t[1].round+"",a=0==t[2].length&&$e(),u=t[2].length>0&&ye(t);return{c(){e=g("div"),n=m("Round "),o=m(l),r=v(),a&&a.c(),c=v(),u&&u.c(),i=$(),b(e,"class","voting-round ms-2 svelte-oq1c7h")},m(t,l){f(t,e,l),d(e,n),d(e,o),d(e,r),a&&a.m(e,null),f(t,c,l),u&&u.m(t,l),f(t,i,l),s=!0},p(t,n){(!s||1&n)&&l!==(l=t[1].round+"")&&w(o,l),0==t[2].length?a||(a=$e(),a.c(),a.m(e,null)):a&&(a.d(1),a=null),t[2].length>0?u?(u.p(t,n),1&n&&U(u,1)):(u=ye(t),u.c(),U(u,1),u.m(i.parentNode,i)):u&&(D(),H(u,1,1,(()=>{u=null})),F())},i(t){s||(U(u),s=!0)},o(t){H(u),s=!1},d(t){t&&(p(e),p(c),p(i)),a&&a.d(),u&&u.d(t)}}}function xe(t){let e,n,o=q(t[0].filter(ke)),r=[];for(let e=0;e<o.length;e+=1)r[e]=be(ve(t,o,e));const c=t=>H(r[t],1,1,(()=>{r[t]=null}));return{c(){e=g("div");for(let t=0;t<r.length;t+=1)r[t].c();b(e,"class","history svelte-oq1c7h")},m(t,o){f(t,e,o);for(let t=0;t<r.length;t+=1)r[t]&&r[t].m(e,null);n=!0},p(t,[n]){if(1&n){let i;for(o=q(t[0].filter(ke)),i=0;i<o.length;i+=1){const c=ve(t,o,i);r[i]?(r[i].p(c,n),U(r[i],1)):(r[i]=be(c),r[i].c(),U(r[i],1),r[i].m(e,null))}for(D(),i=o.length;i<r.length;i+=1)c(i);F()}},i(t){if(!n){for(let t=0;t<o.length;t+=1)U(r[t]);n=!0}},o(t){r=r.filter(Boolean);for(let t=0;t<r.length;t+=1)H(r[t]);n=!1},d(t){t&&p(e),h(r,t)}}}const ke=t=>"reveal"==t.event;function we(t,e,n){let o;return l(t,_t,(t=>n(0,o=t))),[o]}class _e extends nt{constructor(t){super(),et(this,t,we,xe,i,{})}}function Se(t){let e;function n(t,e){return t[1]?Oe:Ne}let o=n(t),r=o(t);return{c(){r.c(),e=$()},m(t,n){r.m(t,n),f(t,e,n)},p(t,c){o===(o=n(t))&&r?r.p(t,c):(r.d(1),r=o(t),r&&(r.c(),r.m(e.parentNode,e)))},d(t){t&&p(e),r.d(t)}}}function Ce(e){let n;return{c(){n=m("👁️")},m(t,e){f(t,n,e)},p:t,d(t){t&&p(n)}}}function Ne(e){let n;return{c(){n=m("⌛")},m(t,e){f(t,n,e)},p:t,d(t){t&&p(n)}}}function Oe(t){let e,n=t[0].vote+"";return{c(){e=m(n)},m(t,n){f(t,e,n)},p(t,o){1&o&&n!==(n=t[0].vote+"")&&w(e,n)},d(t){t&&p(e)}}}function Ee(t){let e;function n(t,e){return t[0].is_spectator?Ce:t[0].vote?Se:void 0}let o=n(t),r=o&&o(t);return{c(){r&&r.c(),e=$()},m(t,n){r&&r.m(t,n),f(t,e,n)},p(t,c){o===(o=n(t))&&r?r.p(t,c):(r&&r.d(1),r=o&&o(t),r&&(r.c(),r.m(e.parentNode,e)))},d(t){t&&p(e),r&&r.d(t)}}}function ze(t){let e,n,o,r,c,i,s=t[0].name+"";return c=new ft({props:{color:t[0].is_spectator?"#effbf7":void 0,$$slots:{default:[Ee]},$$scope:{ctx:t}}}),{c(){e=g("div"),n=g("strong"),o=m(s),r=v(),K(c.$$.fragment),b(e,"class","participant svelte-10w4gcr"),S(e,"transform","rotate("+t[2]+"deg) translate(37.5vw) rotate(90deg)")},m(t,s){f(t,e,s),d(e,n),d(n,o),d(e,r),Q(c,e,null),i=!0},p(t,[n]){(!i||1&n)&&s!==(s=t[0].name+"")&&w(o,s);const r={};1&n&&(r.color=t[0].is_spectator?"#effbf7":void 0),35&n&&(r.$$scope={dirty:n,ctx:t}),c.$set(r),(!i||4&n)&&S(e,"transform","rotate("+t[2]+"deg) translate(37.5vw) rotate(90deg)")},i(t){i||(U(c.$$.fragment,t),i=!0)},o(t){H(c.$$.fragment,t),i=!1},d(t){t&&p(e),Z(c)}}}function Ae(t,e,n){let o,{user:r}=e,{isRevealed:c}=e,{i:i}=e,{count:s}=e;return t.$$set=t=>{"user"in t&&n(0,r=t.user),"isRevealed"in t&&n(1,c=t.isRevealed),"i"in t&&n(3,i=t.i),"count"in t&&n(4,s=t.count)},t.$$.update=()=>{28&t.$$.dirty&&(n(2,o=-90),s>1&&n(2,o-=Math.min(20,174/s)*(i-(s-1)/2)))},[r,c,o,i,s]}class Re extends nt{constructor(t){super(),et(this,t,Ae,ze,i,{user:0,isRevealed:1,i:3,count:4})}}function We(t,e,n){const o=t.slice();return o[8]=e[n][0],o[9]=e[n][1],o}function Je(t){let e,n,o,r,c,i,s,l,a,u,h,$=!1,x=t[9]+"";return a=function(t){let e;return{p(...n){e=n,e.forEach((e=>t.push(e)))},r(){e.forEach((e=>t.splice(t.indexOf(e),1)))}}}(t[6][0]),{c(){e=g("input"),c=v(),i=g("label"),s=m(x),b(e,"type","radio"),b(e,"class","btn-check"),e.__value=n=t[8],_(e,e.__value),b(e,"autocomplete","off"),b(e,"id",o="deck-"+t[8]),e.disabled=r=!t[1],b(i,"class","btn btn-outline-primary svelte-1y9hivi"),b(i,"for",l="deck-"+t[8]),a.p(e)},m(n,o){f(n,e,o),e.checked=e.__value===t[2],f(n,c,o),f(n,i,o),d(i,s),u||(h=y(e,"change",t[5]),u=!0)},p(t,c){1&c&&n!==(n=t[8])&&(e.__value=n,_(e,e.__value),$=!0),1&c&&o!==(o="deck-"+t[8])&&b(e,"id",o),2&c&&r!==(r=!t[1])&&(e.disabled=r),($||5&c)&&(e.checked=e.__value===t[2]),1&c&&x!==(x=t[9]+"")&&w(s,x),1&c&&l!==(l="deck-"+t[8])&&b(i,"for",l)},d(t){t&&(p(e),p(c),p(i)),a.r(),u=!1,h()}}}function je(t){let e;function n(t,e){return!t[1]&&t[4]?Ie:Me}let o=n(t),r=o(t);return{c(){r.c(),e=$()},m(t,n){r.m(t,n),f(t,e,n)},p(t,c){o!==(o=n(t))&&(r.d(1),r=o(t),r&&(r.c(),r.m(e.parentNode,e)))},d(t){t&&p(e),r.d(t)}}}function Me(t){let e;return{c(){e=g("div"),e.textContent="~",b(e,"class","voting-status svelte-1y9hivi"),b(e,"title","Voting in progress")},m(t,n){f(t,e,n)},d(t){t&&p(e)}}}function Ie(t){let e;return{c(){e=g("div"),e.textContent="✓",b(e,"class","voting-status svelte-1y9hivi"),b(e,"title","Voting complete")},m(t,n){f(t,e,n)},d(t){t&&p(e)}}}function Pe(t){let e,n,o;return{c(){e=g("button"),e.textContent="Reveal",b(e,"class","btn btn-sm btn-success svelte-1y9hivi")},m(t,r){f(t,e,r),n||(o=y(e,"click",Rt),n=!0)},d(t){t&&p(e),n=!1,o()}}}function Ge(t){let e,n,o;return{c(){e=g("button"),e.textContent="Clear",b(e,"class","btn btn-sm btn-warning svelte-1y9hivi")},m(t,r){f(t,e,r),n||(o=y(e,"click",Wt),n=!0)},d(t){t&&p(e),n=!1,o()}}}function Xe(e){let n,o,r,c,i,s,l,a,u,$,x,k=q(e[0]),w=[];for(let t=0;t<k.length;t+=1)w[t]=Je(We(e,k,t));let _=!e[3]&&je(e);function S(t,e){return t[1]?Ge:Pe}let C=S(e),N=C(e);return{c(){n=g("div"),o=g("div");for(let t=0;t<w.length;t+=1)w[t].c();r=m("\n     \n\n    "),_&&_.c(),c=v(),N.c(),i=v(),s=g("div"),l=g("label"),l.textContent="Auto reveal",a=v(),u=g("input"),b(o,"class","btn-group btn-group-sm"),b(o,"role","group"),b(o,"aria-label","Change deck"),b(l,"for","autoReveal"),b(l,"class","svelte-1y9hivi"),b(u,"type","checkbox"),b(u,"class","form-check-input"),b(u,"id","autoReveal"),b(s,"class","form-check form-switch mt-1 ms-3"),b(n,"class","d-flex justify-content-center m-3")},m(t,p){f(t,n,p),d(n,o);for(let t=0;t<w.length;t+=1)w[t]&&w[t].m(o,null);d(n,r),_&&_.m(n,null),d(n,c),N.m(n,null),d(n,i),d(n,s),d(s,l),d(s,a),d(s,u),u.checked=e[3],$||(x=y(u,"change",e[7]),$=!0)},p(t,[e]){if(7&e){let n;for(k=q(t[0]),n=0;n<k.length;n+=1){const r=We(t,k,n);w[n]?w[n].p(r,e):(w[n]=Je(r),w[n].c(),w[n].m(o,null))}for(;n<w.length;n+=1)w[n].d(1);w.length=k.length}t[3]?_&&(_.d(1),_=null):_?_.p(t,e):(_=je(t),_.c(),_.m(n,c)),C!==(C=S(t))&&(N.d(1),N=C(t),N&&(N.c(),N.m(n,i))),8&e&&(u.checked=t[3])},i:t,o:t,d(t){t&&p(n),h(w,t),_&&_.d(),N.d(),$=!1,x()}}}function Be(t,e,n){let o,r,c,i,s;l(t,$t,(t=>n(0,o=t))),l(t,xt,(t=>n(1,r=t))),l(t,bt,(t=>n(2,c=t))),l(t,yt,(t=>n(3,i=t))),l(t,Nt,(t=>n(4,s=t)));return[o,r,c,i,s,function(){c=this.__value,bt.set(c)},[[]],function(){i=this.checked,yt.set(i)}]}class Te extends nt{constructor(t){super(),et(this,t,Be,Xe,i,{})}}function Le(t,e,n){const o=t.slice();return o[8]=e[n],o}function De(t,e,n){const o=t.slice();return o[11]=e[n],o[13]=n,o}function Fe(t){let e,n,o;return{c(){e=g("div"),n=g("div"),o=m(t[1]),b(n,"class","alert alert-danger"),b(n,"role","alert"),b(e,"class","fixed-top")},m(t,r){f(t,e,r),d(e,n),d(n,o)},p(t,e){2&e&&w(o,t[1])},d(t){t&&p(e)}}}function Ue(t,e){let n,o,r;return o=new Re({props:{isRevealed:e[3],user:e[11],i:e[13],count:e[2].length}}),{key:t,first:null,c(){n=$(),K(o.$$.fragment),this.first=n},m(t,e){f(t,n,e),Q(o,t,e),r=!0},p(t,n){e=t;const r={};8&n&&(r.isRevealed=e[3]),4&n&&(r.user=e[11]),4&n&&(r.i=e[13]),4&n&&(r.count=e[2].length),o.$set(r)},i(t){r||(U(o.$$.fragment,t),r=!0)},o(t){H(o.$$.fragment,t),r=!1},d(t){t&&p(n),Z(o,t)}}}function He(t){let e,n,o;return n=new me({props:{votes:t[4],style:"background-color: #e6e6e6;",class:"p-2 mb-2 text-center rounded"}}),{c(){e=g("div"),K(n.$$.fragment),b(e,"class","controls svelte-7horpp")},m(t,r){f(t,e,r),Q(n,e,null),o=!0},p(t,e){const o={};16&e&&(o.votes=t[4]),n.$set(o)},i(t){o||(U(n.$$.fragment,t),o=!0)},o(t){H(n.$$.fragment,t),o=!1},d(t){t&&p(e),Z(n)}}}function qe(t){let e,n,o=q(t[6]),r=[];for(let e=0;e<o.length;e+=1)r[e]=Ke(Le(t,o,e));const c=t=>H(r[t],1,1,(()=>{r[t]=null}));return{c(){e=g("div");for(let t=0;t<r.length;t+=1)r[t].c();b(e,"class","d-flex justify-content-center")},m(t,o){f(t,e,o);for(let t=0;t<r.length;t+=1)r[t]&&r[t].m(e,null);n=!0},p(t,n){if(104&n){let i;for(o=q(t[6]),i=0;i<o.length;i+=1){const c=Le(t,o,i);r[i]?(r[i].p(c,n),U(r[i],1)):(r[i]=Ke(c),r[i].c(),U(r[i],1),r[i].m(e,null))}for(D(),i=o.length;i<r.length;i+=1)c(i);F()}},i(t){if(!n){for(let t=0;t<o.length;t+=1)U(r[t]);n=!0}},o(t){r=r.filter(Boolean);for(let t=0;t<r.length;t+=1)H(r[t]);n=!1},d(t){t&&p(e),h(r,t)}}}function Ve(e){let n,o,r,c,i,s;return{c(){n=m("You joined as spectator."),o=g("br"),r=m("\n                I want to\n                "),c=g("button"),c.textContent="become a voter",b(c,"class","btn btn-light btn-sm")},m(t,l){f(t,n,l),f(t,o,l),f(t,r,l),f(t,c,l),i||(s=y(c,"click",e[7]),i=!0)},p:t,i:t,o:t,d(t){t&&(p(n),p(o),p(r),p(c)),i=!1,s()}}}function Ye(t){let e,n,o=t[8]+"";return{c(){e=m(o),n=v()},m(t,o){f(t,e,o),f(t,n,o)},p(t,n){64&n&&o!==(o=t[8]+"")&&w(e,o)},d(t){t&&(p(e),p(n))}}}function Ke(t){let e,n;return e=new ft({props:{disabled:t[3],selected:t[8]==t[5].vote,$$slots:{default:[Ye]},$$scope:{ctx:t}}}),e.$on("click",(function(){c(Jt(t[8]))&&Jt(t[8]).apply(this,arguments)})),e.$on("keypress",(function(){c(Jt(t[8]))&&Jt(t[8]).apply(this,arguments)})),{c(){K(e.$$.fragment)},m(t,o){Q(e,t,o),n=!0},p(n,o){t=n;const r={};8&o&&(r.disabled=t[3]),96&o&&(r.selected=t[8]==t[5].vote),16448&o&&(r.$$scope={dirty:o,ctx:t}),e.$set(r)},i(t){n||(U(e.$$.fragment,t),n=!0)},o(t){H(e.$$.fragment,t),n=!1},d(t){Z(e,t)}}}function Qe(t){let e,n;return e=new Gt({}),{c(){K(e.$$.fragment)},m(t,o){Q(e,t,o),n=!0},i(t){n||(U(e.$$.fragment,t),n=!0)},o(t){H(e.$$.fragment,t),n=!1},d(t){Z(e,t)}}}function Ze(t){let e,n,o,r,c,i,s,l,a,u,h,m,y,x,k,w,_,S,C,N=[],O=new Map,E=t[1]&&Fe(t),z=q(t[2]);const A=t=>t[11].id;for(let e=0;e<z.length;e+=1){let n=De(t,z,e),o=A(n);O.set(o,N[e]=Ue(o,n))}let R=t[3]&&He(t);const W=[Ve,qe],J=[];function j(t,e){return t[5].is_spectator?0:1}l=j(t),a=J[l]=W[l](t),m=new Te({}),w=new _e({});let M=t[0]&&Qe();return{c(){E&&E.c(),e=v(),n=g("div");for(let t=0;t<N.length;t+=1)N[t].c();o=v(),R&&R.c(),r=v(),c=g("div"),i=g("div"),s=g("div"),a.c(),u=v(),h=g("div"),K(m.$$.fragment),y=v(),x=g("div"),k=g("div"),K(w.$$.fragment),_=v(),M&&M.c(),S=$(),b(n,"class","participants svelte-7horpp"),b(s,"class","col"),b(i,"class","row"),b(h,"class","row"),b(k,"class","col"),b(x,"class","row"),b(c,"class","container text-center")},m(t,a){E&&E.m(t,a),f(t,e,a),f(t,n,a);for(let t=0;t<N.length;t+=1)N[t]&&N[t].m(n,null);d(n,o),R&&R.m(n,null),f(t,r,a),f(t,c,a),d(c,i),d(i,s),J[l].m(s,null),d(c,u),d(c,h),Q(m,h,null),d(c,y),d(c,x),d(x,k),Q(w,k,null),f(t,_,a),M&&M.m(t,a),f(t,S,a),C=!0},p(t,[r]){t[1]?E?E.p(t,r):(E=Fe(t),E.c(),E.m(e.parentNode,e)):E&&(E.d(1),E=null),12&r&&(z=q(t[2]),D(),N=Y(N,r,A,1,t,z,O,n,V,Ue,o,De),F()),t[3]?R?(R.p(t,r),8&r&&U(R,1)):(R=He(t),R.c(),U(R,1),R.m(n,null)):R&&(D(),H(R,1,1,(()=>{R=null})),F());let c=l;l=j(t),l===c?J[l].p(t,r):(D(),H(J[c],1,1,(()=>{J[c]=null})),F(),a=J[l],a?a.p(t,r):(a=J[l]=W[l](t),a.c()),U(a,1),a.m(s,null)),t[0]?M?1&r&&U(M,1):(M=Qe(),M.c(),U(M,1),M.m(S.parentNode,S)):M&&(D(),H(M,1,1,(()=>{M=null})),F())},i(t){if(!C){for(let t=0;t<z.length;t+=1)U(N[t]);U(R),U(a),U(m.$$.fragment,t),U(w.$$.fragment,t),U(M),C=!0}},o(t){for(let t=0;t<N.length;t+=1)H(N[t]);H(R),H(a),H(m.$$.fragment,t),H(w.$$.fragment,t),H(M),C=!1},d(t){t&&(p(e),p(n),p(r),p(c),p(_),p(S)),E&&E.d(t);for(let t=0;t<N.length;t+=1)N[t].d();R&&R.d(),J[l].d(),Z(m),Z(w),M&&M.d(t)}}}function tn(t,e,n){let o,r,c,i,s,a;l(t,wt,(t=>n(1,o=t))),l(t,mt,(t=>n(2,r=t))),l(t,xt,(t=>n(3,c=t))),l(t,Ct,(t=>n(4,i=t))),l(t,kt,(t=>n(5,s=t))),l(t,vt,(t=>n(6,a=t)));let u=!1;E((()=>{At(ct("websocket_url")),n(0,u=new URLSearchParams(window.location.search).get("debug"))}));return[u,o,r,c,i,s,a,()=>zt("settings",{is_spectator:!1})]}class en extends nt{constructor(t){super(),et(this,t,tn,Ze,i,{})}}function nn(t){let e,n;return e=new at({}),{c(){K(e.$$.fragment)},m(t,o){Q(e,t,o),n=!0},i(t){n||(U(e.$$.fragment,t),n=!0)},o(t){H(e.$$.fragment,t),n=!1},d(t){Z(e,t)}}}function on(t){let e,n;return e=new en({}),{c(){K(e.$$.fragment)},m(t,o){Q(e,t,o),n=!0},i(t){n||(U(e.$$.fragment,t),n=!0)},o(t){H(e.$$.fragment,t),n=!1},d(t){Z(e,t)}}}function rn(e){let n,o,r,c;const i=[on,nn],s=[];return n=function(t,e){return t[0]?0:1}(e),o=s[n]=i[n](e),{c(){o.c(),r=$()},m(t,e){s[n].m(t,e),f(t,r,e),c=!0},p:t,i(t){c||(U(o),c=!0)},o(t){H(o),c=!1},d(t){t&&p(r),s[n].d(t)}}}function cn(t){return[ct("websocket_url")]}return new class extends nt{constructor(t){super(),et(this,t,cn,rn,i,{})}}({target:document.querySelector("#poker")})}();
