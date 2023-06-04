var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function r(t){t.forEach(e)}function o(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function i(e,...n){if(null==e)return t;const r=e.subscribe(...n);return r.unsubscribe?()=>r.unsubscribe():r}function s(t,e,n){t.$$.on_destroy.push(i(e,n))}function l(t,e,n,r){return t[1]&&r?function(t,e){for(const n in e)t[n]=e[n];return t}(n.ctx.slice(),t[1](r(e))):n.ctx}function a(t,e){t.appendChild(e)}function u(t,e,n){t.insertBefore(e,n||null)}function d(t){t.parentNode&&t.parentNode.removeChild(t)}function f(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function p(t){return document.createElement(t)}function m(t){return document.createTextNode(t)}function h(){return m(" ")}function g(){return m("")}function v(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function $(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function b(t,e){e=""+e,t.data!==e&&(t.data=e)}function y(t,e){t.value=null==e?"":e}function x(t,e,n,r){null==n?t.style.removeProperty(e):t.style.setProperty(e,n,r?"important":"")}function k(t,e,n){t.classList[n?"add":"remove"](e)}let w;function _(t){w=t}function S(t){(function(){if(!w)throw new Error("Function called outside component initialization");return w})().$$.on_mount.push(t)}function C(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach((t=>t.call(this,e)))}const E=[],N=[];let R=[];const W=[],A=Promise.resolve();let O=!1;function M(t){R.push(t)}const j=new Set;let I=0;function z(){if(0!==I)return;const t=w;do{try{for(;I<E.length;){const t=E[I];I++,_(t),G(t.$$)}}catch(t){throw E.length=0,I=0,t}for(_(null),E.length=0,I=0;N.length;)N.pop()();for(let t=0;t<R.length;t+=1){const e=R[t];j.has(e)||(j.add(e),e())}R.length=0}while(E.length);for(;W.length;)W.pop()();O=!1,j.clear(),_(t)}function G(t){if(null!==t.fragment){t.update(),r(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(M)}}const P=new Set;let X;function T(){X={r:0,c:[],p:X}}function B(){X.r||r(X.c),X=X.p}function F(t,e){t&&t.i&&(P.delete(t),t.i(e))}function L(t,e,n,r){if(t&&t.o){if(P.has(t))return;P.add(t),X.c.push((()=>{P.delete(t),r&&(n&&t.d(1),r())})),t.o(e)}else r&&r()}function D(t,e){L(t,1,1,(()=>{e.delete(t.key)}))}function H(t,e,n,o,c,i,s,l,a,u,d,f){let p=t.length,m=i.length,h=p;const g={};for(;h--;)g[t[h].key]=h;const v=[],$=new Map,b=new Map,y=[];for(h=m;h--;){const t=f(c,i,h),r=n(t);let l=s.get(r);l?o&&y.push((()=>l.p(t,e))):(l=u(r,t),l.c()),$.set(r,v[h]=l),r in g&&b.set(r,Math.abs(h-g[r]))}const x=new Set,k=new Set;function w(t){F(t,1),t.m(l,d),s.set(t.key,t),d=t.first,m--}for(;p&&m;){const e=v[m-1],n=t[p-1],r=e.key,o=n.key;e===n?(d=e.first,p--,m--):$.has(o)?!s.has(r)||x.has(r)?w(e):k.has(o)?p--:b.get(r)>b.get(o)?(k.add(r),w(e)):(x.add(o),p--):(a(n,s),p--)}for(;p--;){const e=t[p];$.has(e.key)||a(e,s)}for(;m;)w(v[m-1]);return r(y),v}function J(t){t&&t.c()}function U(t,n,c,i){const{fragment:s,after_update:l}=t.$$;s&&s.m(n,c),i||M((()=>{const n=t.$$.on_mount.map(e).filter(o);t.$$.on_destroy?t.$$.on_destroy.push(...n):r(n),t.$$.on_mount=[]})),l.forEach(M)}function q(t,e){const n=t.$$;null!==n.fragment&&(!function(t){const e=[],n=[];R.forEach((r=>-1===t.indexOf(r)?e.push(r):n.push(r))),n.forEach((t=>t())),R=e}(n.after_update),r(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Y(t,e){-1===t.$$.dirty[0]&&(E.push(t),O||(O=!0,A.then(z)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function K(e,o,c,i,s,l,a,u=[-1]){const f=w;_(e);const p=e.$$={fragment:null,ctx:[],props:l,update:t,not_equal:s,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(o.context||(f?f.$$.context:[])),callbacks:n(),dirty:u,skip_bound:!1,root:o.target||f.$$.root};a&&a(p.root);let m=!1;if(p.ctx=c?c(e,o.props||{},((t,n,...r)=>{const o=r.length?r[0]:n;return p.ctx&&s(p.ctx[t],p.ctx[t]=o)&&(!p.skip_bound&&p.bound[t]&&p.bound[t](o),m&&Y(e,t)),n})):[],p.update(),m=!0,r(p.before_update),p.fragment=!!i&&i(p.ctx),o.target){if(o.hydrate){const t=function(t){return Array.from(t.childNodes)}(o.target);p.fragment&&p.fragment.l(t),t.forEach(d)}else p.fragment&&p.fragment.c();o.intro&&F(e.$$.fragment),U(e,o.target,o.anchor,o.customElement),z()}_(f)}class Q{$destroy(){q(this,1),this.$destroy=t}$on(e,n){if(!o(n))return t;const r=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return r.push(n),()=>{const t=r.indexOf(n);-1!==t&&r.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}
/*! js-cookie v3.0.5 | MIT */function V(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)t[r]=n[r]}return t}var Z=function t(e,n){function r(t,r,o){if("undefined"!=typeof document){"number"==typeof(o=V({},n,o)).expires&&(o.expires=new Date(Date.now()+864e5*o.expires)),o.expires&&(o.expires=o.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var c="";for(var i in o)o[i]&&(c+="; "+i,!0!==o[i]&&(c+="="+o[i].split(";")[0]));return document.cookie=t+"="+e.write(r,t)+c}}return Object.create({set:r,get:function(t){if("undefined"!=typeof document&&(!arguments.length||t)){for(var n=document.cookie?document.cookie.split("; "):[],r={},o=0;o<n.length;o++){var c=n[o].split("="),i=c.slice(1).join("=");try{var s=decodeURIComponent(c[0]);if(r[s]=e.read(i,s),t===s)break}catch(t){}}return t?r[t]:r}},remove:function(t,e){r(t,"",V({},e,{expires:-1}))},withAttributes:function(e){return t(this.converter,V({},this.attributes,e))},withConverter:function(e){return t(V({},this.converter,e),this.attributes)}},{attributes:{value:Object.freeze(n)},converter:{value:Object.freeze(e)}})}({read:function(t){return'"'===t[0]&&(t=t.slice(1,-1)),t.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(t){return encodeURIComponent(t).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"});function tt(t){let e=document.getElementById(t);if(e)return JSON.parse(e.textContent)}function et(t){let e,n;return{c(){e=p("div"),n=m(t[2]),$(e,"class","invalid-feedback")},m(t,r){u(t,e,r),a(e,n)},p(t,e){4&e&&b(n,t[2])},d(t){t&&d(e)}}}function nt(e){let n,o,c,i,s,l,f,g,b,x,w,_,S,C,E,N,R=e[2]&&et(e);return{c(){n=p("form"),o=p("div"),c=p("input"),i=h(),s=p("div"),l=p("input"),f=h(),R&&R.c(),g=h(),b=p("div"),b.innerHTML='<input type="submit" class="btn btn-primary" value="Join"/>',x=h(),w=p("div"),_=p("label"),S=p("input"),C=m(" Join as a spectator 👁️"),$(c,"type","hidden"),$(c,"name","csrfmiddlewaretoken"),c.value=Z.get("csrftoken"),$(l,"type","text"),$(l,"name","name"),$(l,"class","form-control"),k(l,"is-invalid",e[2]),$(s,"class","col"),$(b,"class","col"),$(o,"class","row row-cols-lg-auto"),$(S,"type","checkbox"),$(S,"name","is_spectator"),$(_,"class","col"),$(w,"class","row"),$(n,"method","post")},m(t,r){u(t,n,r),a(n,o),a(o,c),a(o,i),a(o,s),a(s,l),y(l,e[0]),a(s,f),R&&R.m(s,null),a(o,g),a(o,b),a(n,x),a(n,w),a(w,_),a(_,S),S.checked=e[1],a(_,C),E||(N=[v(l,"change",e[3]),v(l,"input",e[4]),v(S,"change",e[5])],E=!0)},p(t,[e]){1&e&&l.value!==t[0]&&y(l,t[0]),4&e&&k(l,"is-invalid",t[2]),t[2]?R?R.p(t,e):(R=et(t),R.c(),R.m(s,null)):R&&(R.d(1),R=null),2&e&&(S.checked=t[1])},i:t,o:t,d(t){t&&d(n),R&&R.d(),E=!1,r(N)}}}function rt(t,e,n){let r,o="",c=!1;S((()=>{const t=window.localStorage.getItem("name");t&&n(0,o=t);const e=window.localStorage.getItem("isSpectator");null!==e&&n(1,c="true"===e)}));return t.$$.update=()=>{1&t.$$.dirty&&o&&window.localStorage.setItem("name",o),2&t.$$.dirty&&window.localStorage.setItem("isSpectator",c)},[o,c,r,()=>{n(2,r=o?void 0:"Name cannot be empty")},function(){o=this.value,n(0,o)},function(){c=this.checked,n(1,c)}]}class ot extends Q{constructor(t){super(),K(this,t,rt,nt,c,{})}}const ct=(t,e={})=>{Et(e);let{colors:n=["#FFC700","#FF0000","#2E3191","#41BBC7"],duration:r=3500,force:o=.5,particleCount:c=150,particleShape:i="mix",particleSize:s=12,destroyAfterDone:l=!0,stageHeight:a=800,stageWidth:u=1600}=e;!function(t){const e=gt("style");e.dataset.neoconfetti="",e.textContent='@keyframes fk9XWG_y-axis{to{transform:translate3d(0,var(--stage-height),0)}}@keyframes fk9XWG_x-axis{to{transform:translate3d(var(--x-landing-point),0,0)}}@keyframes fk9XWG_rotation{50%{transform:rotate3d(var(--half-rotation),180deg)}to{transform:rotate3d(var(--rotation),360deg)}}.fk9XWG_container{width:0;height:0;z-index:1200;position:relative;overflow:visible}.fk9XWG_particle{animation:x-axis var(--duration-chaos)forwards cubic-bezier(var(--x1),var(--x2),var(--x3),var(--x4));animation-name:fk9XWG_x-axis}.fk9XWG_particle>div{animation:y-axis var(--duration-chaos)forwards cubic-bezier(var(--y1),var(--y2),var(--y3),var(--y4));width:var(--width);height:var(--height);animation-name:fk9XWG_y-axis;position:absolute;top:0;left:0}.fk9XWG_particle>div:before{height:100%;width:100%;content:"";background-color:var(--bgcolor);animation:rotation var(--rotation-duration)infinite linear;border-radius:var(--border-radius);animation-name:fk9XWG_rotation;display:block}',vt(document.head,e)}(),t.classList.add("fk9XWG_container"),t.style.setProperty("--stage-height",a+"px");let d,f=$t(c,n),p=it(t,f);function m(t,e){const n=mt(pt()*(wt-1)),c="rectangles"!==i&&("circles"===i||_t(n)),l=(e,n)=>t.style.setProperty(e,n+"");l("--x-landing-point",yt(ft(xt(e,90)-180),0,180,-u/2,u/2)+"px"),l("--duration-chaos",r-mt(1e3*pt())+"ms");const a=pt()<at?bt(pt()*ut,2):0;l("--x1",a),l("--x2",-1*a),l("--x3",a),l("--x4",bt(ft(yt(ft(xt(e,90)-180),0,180,-1,1)),4)),l("--y1",bt(pt()*dt,4)),l("--y2",bt(pt()*o*(kt()?1:-1),4)),l("--y3",dt),l("--y4",bt(ht(yt(ft(e-180),0,180,o,-o),0),4)),l("--width",(c?s:mt(4*pt())+s/2)+"px"),l("--height",(c?s:mt(2*pt())+s)+"px");const d=n.toString(2).padStart(3,"0").split("");l("--half-rotation",d.map((t=>+t/2+""))),l("--rotation",d),l("--rotation-duration",bt(pt()*(lt-st)+st)+"ms"),l("--border-radius",c?"50%":0)}for(const[t,e]of Object.entries(p))m(e,f[+t].degree);return Promise.resolve().then((()=>d=setTimeout((()=>l&&(t.innerHTML="")),r))),{update(e){Et(e);const m=e.particleCount??c,h=e.colors??n,g=e.stageHeight??a;if(f=$t(m,h),m===c&&JSON.stringify(n)!==JSON.stringify(h))for(const[t,{color:e}]of Object.entries(f))p[+t].style.setProperty("--bgcolor",e);m!==c&&(t.innerHTML="",p=it(t,f)),l&&!e.destroyAfterDone&&clearTimeout(d),t.style.setProperty("--stage-height",g+"px"),n=h,r=e.duration??r,o=e.force??o,c=m,i=e.particleShape??i,s=e.particleSize??s,l=e.destroyAfterDone??l,a=g,u=e.stageWidth??u},destroy(){clearTimeout(d)}}};function it(t,e=[]){const n=[];for(const{color:r}of e){const e=gt("div");e.className="fk9XWG_particle",e.style.setProperty("--bgcolor",r);const o=gt("div");vt(e,o),vt(t,e),n.push(e)}return n}const st=200,lt=800,at=.1,ut=.3,dt=.5,ft=Math.abs,pt=Math.random,mt=Math.round,ht=Math.max,gt=t=>document.createElement(t),vt=(t,e)=>t.appendChild(e),$t=(t,e)=>Array.from({length:t},((n,r)=>({color:e[r%e.length],degree:360*r/t}))),bt=(t,e=2)=>mt((t+Number.EPSILON)*10**e)/10**e,yt=(t,e,n,r,o)=>(t-e)*(o-r)/(n-e)+r,xt=(t,e)=>t+e>360?t+e-360:t+e,kt=()=>pt()>.5,wt=6,_t=t=>1!==t&&kt(),St=t=>void 0===t,Ct=(t,e)=>{if(!St(t)&&Number.isSafeInteger(t)&&t<0)throw new Error(e+" must be a positive integer")},Et=({particleCount:t,duration:e,colors:n,particleSize:r,force:o,stageHeight:c,stageWidth:i,particleShape:s})=>{if(Ct(t,"particleCount"),Ct(e,"duration"),Ct(r,"particleSize"),Ct(o,"force"),Ct(c,"stageHeight"),Ct(i,"stageWidth"),!St(s)&&!/^(mix|circles|rectangles)$/i.test(s))throw new Error('particlesShape should be either "mix" or "circles" or "rectangle"');if(!St(n)&&!Array.isArray(n))throw new Error("colors must be an array of strings");if(o>1)throw new Error("force must be within 0 and 1")};function Nt(t){let e,n,o,c;const i=t[3].default,s=function(t,e,n,r){if(t){const o=l(t,e,n,r);return t[0](o)}}(i,t,t[2],null);return{c(){e=p("div"),s&&s.c(),$(e,"class","card btn svelte-xiahgm"),$(e,"disabled",t[0]),k(e,"selected",t[1])},m(r,i){u(r,e,i),s&&s.m(e,null),n=!0,o||(c=[v(e,"click",t[4]),v(e,"keypress",t[5])],o=!0)},p(t,[r]){s&&s.p&&(!n||4&r)&&function(t,e,n,r,o,c){if(o){const i=l(e,n,r,c);t.p(i,o)}}(s,i,t,t[2],n?function(t,e,n,r){if(t[2]&&r){const o=t[2](r(n));if(void 0===e.dirty)return o;if("object"==typeof o){const t=[],n=Math.max(e.dirty.length,o.length);for(let r=0;r<n;r+=1)t[r]=e.dirty[r]|o[r];return t}return e.dirty|o}return e.dirty}(i,t[2],r,null):function(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let t=0;t<n;t++)e[t]=-1;return e}return-1}(t[2]),null),(!n||1&r)&&$(e,"disabled",t[0]),(!n||2&r)&&k(e,"selected",t[1])},i(t){n||(F(s,t),n=!0)},o(t){L(s,t),n=!1},d(t){t&&d(e),s&&s.d(t),o=!1,r(c)}}}function Rt(t,e,n){let{$$slots:r={},$$scope:o}=e,{disabled:c=!0}=e,{selected:i=""}=e;return t.$$set=t=>{"disabled"in t&&n(0,c=t.disabled),"selected"in t&&n(1,i=t.selected),"$$scope"in t&&n(2,o=t.$$scope)},[c,i,o,r,function(e){C.call(this,t,e)},function(e){C.call(this,t,e)}]}class Wt extends Q{constructor(t){super(),K(this,t,Rt,Nt,c,{disabled:0,selected:1})}}function At(t){let e;function n(t,e){return t[1]?jt:Mt}let r=n(t),o=r(t);return{c(){o.c(),e=g()},m(t,n){o.m(t,n),u(t,e,n)},p(t,c){r===(r=n(t))&&o?o.p(t,c):(o.d(1),o=r(t),o&&(o.c(),o.m(e.parentNode,e)))},d(t){o.d(t),t&&d(e)}}}function Ot(e){let n;return{c(){n=m("👁️")},m(t,e){u(t,n,e)},p:t,d(t){t&&d(n)}}}function Mt(e){let n;return{c(){n=m("⌛")},m(t,e){u(t,n,e)},p:t,d(t){t&&d(n)}}}function jt(t){let e,n=t[0].vote+"";return{c(){e=m(n)},m(t,n){u(t,e,n)},p(t,r){1&r&&n!==(n=t[0].vote+"")&&b(e,n)},d(t){t&&d(e)}}}function It(t){let e;function n(t,e){return t[0].is_spectator?Ot:t[0].vote?At:void 0}let r=n(t),o=r&&r(t);return{c(){o&&o.c(),e=g()},m(t,n){o&&o.m(t,n),u(t,e,n)},p(t,c){r===(r=n(t))&&o?o.p(t,c):(o&&o.d(1),o=r&&r(t),o&&(o.c(),o.m(e.parentNode,e)))},d(t){o&&o.d(t),t&&d(e)}}}function zt(t){let e,n,r,o,c,i,s=t[0].name+"";return c=new Wt({props:{$$slots:{default:[It]},$$scope:{ctx:t}}}),{c(){e=p("div"),n=p("strong"),r=m(s),o=h(),J(c.$$.fragment),$(e,"class","participant svelte-1s7tb0t"),x(e,"transform","rotate("+t[2]+"deg) translate(33vw) rotate(90deg)")},m(t,s){u(t,e,s),a(e,n),a(n,r),a(e,o),U(c,e,null),i=!0},p(t,[n]){(!i||1&n)&&s!==(s=t[0].name+"")&&b(r,s);const o={};35&n&&(o.$$scope={dirty:n,ctx:t}),c.$set(o),(!i||4&n)&&x(e,"transform","rotate("+t[2]+"deg) translate(33vw) rotate(90deg)")},i(t){i||(F(c.$$.fragment,t),i=!0)},o(t){L(c.$$.fragment,t),i=!1},d(t){t&&d(e),q(c)}}}function Gt(t,e,n){let r,{user:o}=e,{isRevealed:c}=e,{i:i}=e,{count:s}=e;return t.$$set=t=>{"user"in t&&n(0,o=t.user),"isRevealed"in t&&n(1,c=t.isRevealed),"i"in t&&n(3,i=t.i),"count"in t&&n(4,s=t.count)},t.$$.update=()=>{28&t.$$.dirty&&(n(2,r=-90),s>1&&n(2,r-=Math.min(20,174/s)*(i-(s-1)/2)))},[o,c,r,i,s]}class Pt extends Q{constructor(t){super(),K(this,t,Gt,zt,c,{user:0,isRevealed:1,i:3,count:4})}}const Xt=[];function Tt(e,n=t){let r;const o=new Set;function i(t){if(c(e,t)&&(e=t,r)){const t=!Xt.length;for(const t of o)t[1](),Xt.push(t,e);if(t){for(let t=0;t<Xt.length;t+=2)Xt[t][0](Xt[t+1]);Xt.length=0}}}return{set:i,update:function(t){i(t(e))},subscribe:function(c,s=t){const l=[c,s];return o.add(l),1===o.size&&(r=n(i)||t),c(e),()=>{o.delete(l),0===o.size&&r&&(r(),r=null)}}}}const Bt=Tt([]),Ft=Tt([]),Lt=Tt([]),Dt=Tt(!1),Ht=Tt("tshirt"),Jt=Tt(!1),Ut=Tt({}),qt=Tt(void 0),Yt=function(e,n,c){const s=!Array.isArray(e),l=s?[e]:e,a=n.length<2;return u=e=>{let c=!1;const u=[];let d=0,f=t;const p=()=>{if(d)return;f();const r=n(s?u[0]:u,e);a?e(r):f=o(r)?r:t},m=l.map(((t,e)=>i(t,(t=>{u[e]=t,d&=~(1<<e),c&&p()}),(()=>{d|=1<<e}))));return c=!0,p(),function(){r(m),f(),c=!1}},{subscribe:Tt(c,u).subscribe};var u}(Bt,(t=>{const e=new Proxy({},{get:(t,e)=>e in t?t[e]:0});return t.forEach((t=>{null!=t.vote&&(e[t.vote]+=1)})),Object.entries(e).sort(((t,e)=>e[1]-t[1]))})),Kt=t=>{Ut.update((e=>(e.vote=t,e)))};let Qt;function Vt(t){Qt=new WebSocket(t),Qt.onclose=()=>{qt.set("WebSocket connection closed unexpectedly. Trying to reconnect in 2s..."),setTimeout((()=>{console.log("Reconnecting..."),Vt()}),2e3)},Qt.onmessage=t=>{const e=JSON.parse(t.data);switch(console.log("message",e),e.type){case"init":Bt.set(e.users),Ut.set(e.user),Ft.set(e.settings.choices),Dt.set(e.settings.autoReveal),Jt.set(e.settings.isRevealed),Lt.set(e.settings.decks),Ht.set(e.settings.deck),qt.set(void 0);break;case"vote":Bt.update((t=>(t.forEach((t=>{t.id==e.user_id&&(t.vote=e.value)})),[...t])));break;case"error":qt.set(e.message)}}}async function Zt(t,e=void 0){console.log("update",t,e),Qt&&1!=Qt.readyState||((e=e||{}).action=t,Qt.send(JSON.stringify(e)))}const te=()=>Zt("reveal"),ee=()=>{Kt(null),Zt("clear")};function ne(t){return()=>{(function(t){let e;return i(t,(t=>e=t))(),e})(Jt)||(Zt("vote",{value:t}),Kt(t))}}function re(t,e,n){const r=t.slice();return r[7]=e[n][0],r[8]=e[n][1],r}function oe(t){let e,n,r,o,c,i,s,l,f,g,y,x=!1,k=t[8]+"";return f=function(t){let e;return{p(...n){e=n,e.forEach((e=>t.push(e)))},r(){e.forEach((e=>t.splice(t.indexOf(e),1)))}}}(t[5][0]),{c(){e=p("input"),c=h(),i=p("label"),s=m(k),$(e,"type","radio"),$(e,"class","btn-check"),e.__value=n=t[7],e.value=e.__value,$(e,"autocomplete","off"),$(e,"id",r="deck-"+t[7]),e.disabled=o=!t[1],$(i,"class","btn btn-outline-primary"),$(i,"for",l="deck-"+t[7]),f.p(e)},m(n,r){u(n,e,r),e.checked=e.__value===t[2],u(n,c,r),u(n,i,r),a(i,s),g||(y=v(e,"change",t[4]),g=!0)},p(t,c){1&c&&n!==(n=t[7])&&(e.__value=n,e.value=e.__value,x=!0),1&c&&r!==(r="deck-"+t[7])&&$(e,"id",r),2&c&&o!==(o=!t[1])&&(e.disabled=o),(x||5&c)&&(e.checked=e.__value===t[2]),1&c&&k!==(k=t[8]+"")&&b(s,k),1&c&&l!==(l="deck-"+t[7])&&$(i,"for",l)},d(t){t&&d(e),t&&d(c),t&&d(i),f.r(),g=!1,y()}}}function ce(e){let n,r,o,c,i,s,l,m,g,b,y=e[0],x=[];for(let t=0;t<y.length;t+=1)x[t]=oe(re(e,y,t));return{c(){n=p("div");for(let t=0;t<x.length;t+=1)x[t].c();r=h(),o=p("br"),c=h(),i=p("div"),s=p("label"),s.textContent="Auto reveal",l=h(),m=p("input"),$(n,"class","btn-group btn-group-sm"),$(n,"role","group"),$(n,"aria-label","Change deck"),$(s,"for","autoReveal"),$(m,"type","checkbox"),$(m,"class","form-check-input"),$(m,"id","autoReveal"),$(i,"class","form-check form-switch mt-2")},m(t,d){u(t,n,d);for(let t=0;t<x.length;t+=1)x[t]&&x[t].m(n,null);u(t,r,d),u(t,o,d),u(t,c,d),u(t,i,d),a(i,s),a(i,l),a(i,m),m.checked=e[3],g||(b=v(m,"change",e[6]),g=!0)},p(t,[e]){if(7&e){let r;for(y=t[0],r=0;r<y.length;r+=1){const o=re(t,y,r);x[r]?x[r].p(o,e):(x[r]=oe(o),x[r].c(),x[r].m(n,null))}for(;r<x.length;r+=1)x[r].d(1);x.length=y.length}8&e&&(m.checked=t[3])},i:t,o:t,d(t){t&&d(n),f(x,t),t&&d(r),t&&d(o),t&&d(c),t&&d(i),g=!1,b()}}}function ie(t,e,n){let r,o,c,i;s(t,Lt,(t=>n(0,r=t))),s(t,Jt,(t=>n(1,o=t))),s(t,Ht,(t=>n(2,c=t))),s(t,Dt,(t=>n(3,i=t)));return[r,o,c,i,function(){c=this.__value,Ht.set(c)},[[]],function(){i=this.checked,Dt.set(i)}]}Ht.subscribe((t=>Zt("settings",{deck:t}))),Dt.subscribe((t=>Zt("settings",{autoReveal:t})));class se extends Q{constructor(t){super(),K(this,t,ie,ce,c,{})}}function le(t,e,n){const r=t.slice();return r[11]=e[n],r}function ae(t,e,n){const r=t.slice();return r[14]=e[n][0],r[15]=e[n][1],r}function ue(t,e,n){const r=t.slice();return r[18]=e[n],r[20]=n,r}function de(t){let e,n,r;return{c(){e=p("div"),n=p("div"),r=m(t[3]),$(n,"class","alert alert-danger"),$(n,"role","alert"),$(e,"class","fixed-top")},m(t,o){u(t,e,o),a(e,n),a(n,r)},p(t,e){8&e&&b(r,t[3])},d(t){t&&d(e)}}}function fe(t,e){let n,r,o;return r=new Pt({props:{isRevealed:e[4],user:e[18],i:e[20],count:e[1]}}),{key:t,first:null,c(){n=g(),J(r.$$.fragment),this.first=n},m(t,e){u(t,n,e),U(r,t,e),o=!0},p(t,n){e=t;const o={};16&n&&(o.isRevealed=e[4]),1&n&&(o.user=e[18]),1&n&&(o.i=e[20]),2&n&&(o.count=e[1]),r.$set(o)},i(t){o||(F(r.$$.fragment,t),o=!0)},o(t){L(r.$$.fragment,t),o=!1},d(t){t&&d(n),q(r,t)}}}function pe(t){let e,n,r,o=[],c=new Map,i=t[5]&&1==t[5].length&&t[5][0][1]>1&&me(),s=t[5];const l=t=>t[14];for(let e=0;e<s.length;e+=1){let n=ae(t,s,e),r=l(n);c.set(r,o[e]=ve(r,n))}let a=null;return s.length||(a=he()),{c(){i&&i.c(),e=h(),n=p("div");for(let t=0;t<o.length;t+=1)o[t].c();a&&a.c(),$(n,"class","summary rounded mb-3 text-center svelte-lta3sd")},m(t,c){i&&i.m(t,c),u(t,e,c),u(t,n,c);for(let t=0;t<o.length;t+=1)o[t]&&o[t].m(n,null);a&&a.m(n,null),r=!0},p(t,r){t[5]&&1==t[5].length&&t[5][0][1]>1?i||(i=me(),i.c(),i.m(e.parentNode,e)):i&&(i.d(1),i=null),32&r&&(s=t[5],T(),o=H(o,r,l,1,t,s,c,n,D,ve,null,ae),B(),!s.length&&a?a.p(t,r):s.length?a&&(a.d(1),a=null):(a=he(),a.c(),a.m(n,null)))},i(t){if(!r){for(let t=0;t<s.length;t+=1)F(o[t]);r=!0}},o(t){for(let t=0;t<o.length;t+=1)L(o[t]);r=!1},d(t){i&&i.d(t),t&&d(e),t&&d(n);for(let t=0;t<o.length;t+=1)o[t].d();a&&a.d()}}}function me(e){let n,r,c;return{c(){n=p("div")},m(e,i){var s;u(e,n,i),r||(s=ct.call(null,n),c=s&&o(s.destroy)?s.destroy:t,r=!0)},d(t){t&&d(n),r=!1,c()}}}function he(e){let n;return{c(){n=p("div"),n.textContent="No votes",$(n,"class","col text-center")},m(t,e){u(t,n,e)},p:t,d(t){t&&d(n)}}}function ge(t){let e,n=t[14]+"";return{c(){e=m(n)},m(t,n){u(t,e,n)},p(t,r){32&r&&n!==(n=t[14]+"")&&b(e,n)},d(t){t&&d(e)}}}function ve(t,e){let n,r,o,c,i,s,l,f,g=e[15]+"";return r=new Wt({props:{$$slots:{default:[ge]},$$scope:{ctx:e}}}),{key:t,first:null,c(){n=p("div"),J(r.$$.fragment),o=h(),c=p("div"),i=m(g),s=m("x"),l=h(),$(c,"class","text-muted"),$(n,"class","d-inline-block text-center m-2"),this.first=n},m(t,e){u(t,n,e),U(r,n,null),a(n,o),a(n,c),a(c,i),a(c,s),a(n,l),f=!0},p(t,n){e=t;const o={};2097184&n&&(o.$$scope={dirty:n,ctx:e}),r.$set(o),(!f||32&n)&&g!==(g=e[15]+"")&&b(i,g)},i(t){f||(F(r.$$.fragment,t),f=!0)},o(t){L(r.$$.fragment,t),f=!1},d(t){t&&d(n),q(r)}}}function $e(t){let e;return{c(){e=m("✓")},m(t,n){u(t,e,n)},d(t){t&&d(e)}}}function be(e){let n,r,o;return{c(){n=p("button"),n.textContent="Reveal",$(n,"class","btn btn-primary")},m(t,e){u(t,n,e),r||(o=v(n,"click",te),r=!0)},p:t,d(t){t&&d(n),r=!1,o()}}}function ye(e){let n,r,o;return{c(){n=p("button"),n.textContent="Clear",$(n,"class","btn btn-warning")},m(t,e){u(t,n,e),r||(o=v(n,"click",ee),r=!0)},p:t,d(t){t&&d(n),r=!1,o()}}}function xe(t){let e,n,r=t[7],o=[];for(let e=0;e<r.length;e+=1)o[e]=_e(le(t,r,e));const c=t=>L(o[t],1,1,(()=>{o[t]=null}));return{c(){e=p("div");for(let t=0;t<o.length;t+=1)o[t].c();$(e,"class","d-flex justify-content-center")},m(t,r){u(t,e,r);for(let t=0;t<o.length;t+=1)o[t]&&o[t].m(e,null);n=!0},p(t,n){if(16592&n){let i;for(r=t[7],i=0;i<r.length;i+=1){const c=le(t,r,i);o[i]?(o[i].p(c,n),F(o[i],1)):(o[i]=_e(c),o[i].c(),F(o[i],1),o[i].m(e,null))}for(T(),i=r.length;i<o.length;i+=1)c(i);B()}},i(t){if(!n){for(let t=0;t<r.length;t+=1)F(o[t]);n=!0}},o(t){o=o.filter(Boolean);for(let t=0;t<o.length;t+=1)L(o[t]);n=!1},d(t){t&&d(e),f(o,t)}}}function ke(e){let n;return{c(){n=m("You joined as spectator.")},m(t,e){u(t,n,e)},p:t,i:t,o:t,d(t){t&&d(n)}}}function we(t){let e,n,r=t[11]+"";return{c(){e=m(r),n=h()},m(t,r){u(t,e,r),u(t,n,r)},p(t,n){128&n&&r!==(r=t[11]+"")&&b(e,r)},d(t){t&&d(e),t&&d(n)}}}function _e(t){let e,n;return e=new Wt({props:{disabled:t[4],selected:t[11]==t[6].vote,$$slots:{default:[we]},$$scope:{ctx:t}}}),e.$on("click",(function(){o(ne(t[11]))&&ne(t[11]).apply(this,arguments)})),e.$on("keypress",(function(){o(ne(t[11]))&&ne(t[11]).apply(this,arguments)})),{c(){J(e.$$.fragment)},m(t,r){U(e,t,r),n=!0},p(n,r){t=n;const o={};16&r&&(o.disabled=t[4]),192&r&&(o.selected=t[11]==t[6].vote),2097280&r&&(o.$$scope={dirty:r,ctx:t}),e.$set(o)},i(t){n||(F(e.$$.fragment,t),n=!0)},o(t){L(e.$$.fragment,t),n=!1},d(t){q(e,t)}}}function Se(e){let n,o,c,i,s,l,f,m,g,b,y,x,k,w,_,S,C,E,N,R,W=[],A=new Map,O=e[3]&&de(e),M=e[0];const j=t=>t[18].id;for(let t=0;t<M.length;t+=1){let n=ue(e,M,t),r=j(n);A.set(r,W[t]=fe(r,n))}let I=e[4]&&pe(e),z=!e[4]&&e[2]&&$e();function G(t,e){return t[4]?ye:be}let P=G(e),X=P(e),Y=!e[8]&&function(e){let n,o,c,i,s;return{c(){n=p("button"),n.textContent="Add fake users",o=h(),c=p("button"),c.textContent="Fake votes",$(n,"class","btn btn-danger"),$(c,"class","btn btn-danger")},m(t,r){u(t,n,r),u(t,o,r),u(t,c,r),i||(s=[v(n,"click",e[9]),v(c,"click",e[10])],i=!0)},p:t,d(t){t&&d(n),t&&d(o),t&&d(c),i=!1,r(s)}}}(e);const K=[ke,xe],Q=[];function V(t,e){return t[6].is_spectator?0:1}return _=V(e),S=Q[_]=K[_](e),N=new se({}),{c(){O&&O.c(),n=h(),o=p("div");for(let t=0;t<W.length;t+=1)W[t].c();c=h(),i=p("div"),I&&I.c(),s=h(),l=p("div"),f=p("div"),z&&z.c(),m=h(),X.c(),g=h(),b=p("div"),y=p("div"),x=p("div"),Y&&Y.c(),k=h(),w=p("div"),S.c(),C=h(),E=p("div"),J(N.$$.fragment),$(f,"class","voting-status svelte-lta3sd"),$(l,"class","d-flex justify-content-center mb-3"),$(i,"class","controls svelte-lta3sd"),$(o,"class","participants svelte-lta3sd"),$(x,"class","col-md-2"),$(w,"class","col-md-8"),$(E,"class","col-md-2 text-start"),$(y,"class","row"),$(b,"class","container text-center")},m(t,e){O&&O.m(t,e),u(t,n,e),u(t,o,e);for(let t=0;t<W.length;t+=1)W[t]&&W[t].m(o,null);a(o,c),a(o,i),I&&I.m(i,null),a(i,s),a(i,l),a(l,f),z&&z.m(f,null),a(l,m),X.m(l,null),u(t,g,e),u(t,b,e),a(b,y),a(y,x),Y&&Y.m(x,null),a(y,k),a(y,w),Q[_].m(w,null),a(y,C),a(y,E),U(N,E,null),R=!0},p(t,[e]){t[3]?O?O.p(t,e):(O=de(t),O.c(),O.m(n.parentNode,n)):O&&(O.d(1),O=null),19&e&&(M=t[0],T(),W=H(W,e,j,1,t,M,A,o,D,fe,c,ue),B()),t[4]?I?(I.p(t,e),16&e&&F(I,1)):(I=pe(t),I.c(),F(I,1),I.m(i,s)):I&&(T(),L(I,1,1,(()=>{I=null})),B()),!t[4]&&t[2]?z||(z=$e(),z.c(),z.m(f,null)):z&&(z.d(1),z=null),P===(P=G(t))&&X?X.p(t,e):(X.d(1),X=P(t),X&&(X.c(),X.m(l,null))),t[8]||Y.p(t,e);let r=_;_=V(t),_===r?Q[_].p(t,e):(T(),L(Q[r],1,1,(()=>{Q[r]=null})),B(),S=Q[_],S?S.p(t,e):(S=Q[_]=K[_](t),S.c()),F(S,1),S.m(w,null))},i(t){if(!R){for(let t=0;t<M.length;t+=1)F(W[t]);F(I),F(S),F(N.$$.fragment,t),R=!0}},o(t){for(let t=0;t<W.length;t+=1)L(W[t]);L(I),L(S),L(N.$$.fragment,t),R=!1},d(t){O&&O.d(t),t&&d(n),t&&d(o);for(let t=0;t<W.length;t+=1)W[t].d();I&&I.d(),z&&z.d(),X.d(),t&&d(g),t&&d(b),Y&&Y.d(),Q[_].d(),q(N)}}}function Ce(t,e,n){let r,o,c,i,l,a,u;s(t,Bt,(t=>n(0,o=t))),s(t,qt,(t=>n(3,c=t))),s(t,Jt,(t=>n(4,i=t))),s(t,Yt,(t=>n(5,l=t))),s(t,Ut,(t=>n(6,a=t))),s(t,Ft,(t=>n(7,u=t)));const d=!window.location.host.includes("localhost");let f;S((()=>{Vt(tt("websocket_url"))}));return t.$$.update=()=>{1&t.$$.dirty&&n(1,f=o.length),1&t.$$.dirty&&n(2,r=o.every((t=>t.is_spectator||t.vote)))},[o,f,r,c,i,l,a,u,d,()=>Zt("add_fakes"),()=>Zt("fake_votes")]}class Ee extends Q{constructor(t){super(),K(this,t,Ce,Se,c,{})}}function Ne(t){let e,n;return e=new ot({}),{c(){J(e.$$.fragment)},m(t,r){U(e,t,r),n=!0},i(t){n||(F(e.$$.fragment,t),n=!0)},o(t){L(e.$$.fragment,t),n=!1},d(t){q(e,t)}}}function Re(t){let e,n;return e=new Ee({}),{c(){J(e.$$.fragment)},m(t,r){U(e,t,r),n=!0},i(t){n||(F(e.$$.fragment,t),n=!0)},o(t){L(e.$$.fragment,t),n=!1},d(t){q(e,t)}}}function We(e){let n,r,o,c,i,s;const l=[Re,Ne],a=[];return o=function(t,e){return t[0]?0:1}(e),c=a[o]=l[o](e),{c(){n=p("h1"),n.textContent="Planning poker",r=h(),c.c(),i=g()},m(t,e){u(t,n,e),u(t,r,e),a[o].m(t,e),u(t,i,e),s=!0},p:t,i(t){s||(F(c),s=!0)},o(t){L(c),s=!1},d(t){t&&d(n),t&&d(r),a[o].d(t),t&&d(i)}}}function Ae(t){return[tt("websocket_url")]}return new class extends Q{constructor(t){super(),K(this,t,Ae,We,c,{})}}({target:document.querySelector("#poker")})}();
