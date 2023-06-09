var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function i(e,...n){if(null==e){for(const t of n)t(void 0);return t}const o=e.subscribe(...n);return o.unsubscribe?()=>o.unsubscribe():o}function s(t,e,n){t.$$.on_destroy.push(i(e,n))}function l(t,e,n,o){return t[1]&&o?function(t,e){for(const n in e)t[n]=e[n];return t}(n.ctx.slice(),t[1](o(e))):n.ctx}function a(t,e){t.appendChild(e)}function u(t,e,n){t.insertBefore(e,n||null)}function d(t){t.parentNode&&t.parentNode.removeChild(t)}function f(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function p(t){return document.createElement(t)}function h(t){return document.createTextNode(t)}function m(){return h(" ")}function g(){return h("")}function v(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function $(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function b(t,e){e=""+e,t.data!==e&&(t.data=e)}function y(t,e){t.value=null==e?"":e}function x(t,e,n,o){null==n?t.style.removeProperty(e):t.style.setProperty(e,n,o?"important":"")}function k(t,e,n){t.classList.toggle(e,!!n)}let w;function _(t){w=t}function S(t){(function(){if(!w)throw new Error("Function called outside component initialization");return w})().$$.on_mount.push(t)}function C(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach((t=>t.call(this,e)))}const E=[],N=[];let W=[];const A=[],O=Promise.resolve();let R=!1;function M(t){W.push(t)}const j=new Set;let I=0;function z(){if(0!==I)return;const t=w;do{try{for(;I<E.length;){const t=E[I];I++,_(t),G(t.$$)}}catch(t){throw E.length=0,I=0,t}for(_(null),E.length=0,I=0;N.length;)N.pop()();for(let t=0;t<W.length;t+=1){const e=W[t];j.has(e)||(j.add(e),e())}W.length=0}while(E.length);for(;A.length;)A.pop()();R=!1,j.clear(),_(t)}function G(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(M)}}const P=new Set;let X;function B(){X={r:0,c:[],p:X}}function T(){X.r||o(X.c),X=X.p}function F(t,e){t&&t.i&&(P.delete(t),t.i(e))}function L(t,e,n,o){if(t&&t.o){if(P.has(t))return;P.add(t),X.c.push((()=>{P.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}else o&&o()}function U(t){return void 0!==t?.length?t:Array.from(t)}function D(t,e){L(t,1,1,(()=>{e.delete(t.key)}))}function H(t,e,n,r,c,i,s,l,a,u,d,f){let p=t.length,h=i.length,m=p;const g={};for(;m--;)g[t[m].key]=m;const v=[],$=new Map,b=new Map,y=[];for(m=h;m--;){const t=f(c,i,m),o=n(t);let l=s.get(o);l?r&&y.push((()=>l.p(t,e))):(l=u(o,t),l.c()),$.set(o,v[m]=l),o in g&&b.set(o,Math.abs(m-g[o]))}const x=new Set,k=new Set;function w(t){F(t,1),t.m(l,d),s.set(t.key,t),d=t.first,h--}for(;p&&h;){const e=v[h-1],n=t[p-1],o=e.key,r=n.key;e===n?(d=e.first,p--,h--):$.has(r)?!s.has(o)||x.has(o)?w(e):k.has(r)?p--:b.get(o)>b.get(r)?(k.add(o),w(e)):(x.add(r),p--):(a(n,s),p--)}for(;p--;){const e=t[p];$.has(e.key)||a(e,s)}for(;h;)w(v[h-1]);return o(y),v}function J(t){t&&t.c()}function q(t,n,c){const{fragment:i,after_update:s}=t.$$;i&&i.m(n,c),M((()=>{const n=t.$$.on_mount.map(e).filter(r);t.$$.on_destroy?t.$$.on_destroy.push(...n):o(n),t.$$.on_mount=[]})),s.forEach(M)}function V(t,e){const n=t.$$;null!==n.fragment&&(!function(t){const e=[],n=[];W.forEach((o=>-1===t.indexOf(o)?e.push(o):n.push(o))),n.forEach((t=>t())),W=e}(n.after_update),o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Y(t,e){-1===t.$$.dirty[0]&&(E.push(t),R||(R=!0,O.then(z)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function K(e,r,c,i,s,l,a,u=[-1]){const f=w;_(e);const p=e.$$={fragment:null,ctx:[],props:l,update:t,not_equal:s,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(r.context||(f?f.$$.context:[])),callbacks:n(),dirty:u,skip_bound:!1,root:r.target||f.$$.root};a&&a(p.root);let h=!1;if(p.ctx=c?c(e,r.props||{},((t,n,...o)=>{const r=o.length?o[0]:n;return p.ctx&&s(p.ctx[t],p.ctx[t]=r)&&(!p.skip_bound&&p.bound[t]&&p.bound[t](r),h&&Y(e,t)),n})):[],p.update(),h=!0,o(p.before_update),p.fragment=!!i&&i(p.ctx),r.target){if(r.hydrate){const t=function(t){return Array.from(t.childNodes)}(r.target);p.fragment&&p.fragment.l(t),t.forEach(d)}else p.fragment&&p.fragment.c();r.intro&&F(e.$$.fragment),q(e,r.target,r.anchor),z()}_(f)}class Q{$$=void 0;$$set=void 0;$destroy(){V(this,1),this.$destroy=t}$on(e,n){if(!r(n))return t;const o=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return o.push(n),()=>{const t=o.indexOf(n);-1!==t&&o.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}
/*! js-cookie v3.0.5 | MIT */
function Z(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var o in n)t[o]=n[o]}return t}"undefined"!=typeof window&&(window.__svelte||(window.__svelte={v:new Set})).v.add("4");var tt=function t(e,n){function o(t,o,r){if("undefined"!=typeof document){"number"==typeof(r=Z({},n,r)).expires&&(r.expires=new Date(Date.now()+864e5*r.expires)),r.expires&&(r.expires=r.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var c="";for(var i in r)r[i]&&(c+="; "+i,!0!==r[i]&&(c+="="+r[i].split(";")[0]));return document.cookie=t+"="+e.write(o,t)+c}}return Object.create({set:o,get:function(t){if("undefined"!=typeof document&&(!arguments.length||t)){for(var n=document.cookie?document.cookie.split("; "):[],o={},r=0;r<n.length;r++){var c=n[r].split("="),i=c.slice(1).join("=");try{var s=decodeURIComponent(c[0]);if(o[s]=e.read(i,s),t===s)break}catch(t){}}return t?o[t]:o}},remove:function(t,e){o(t,"",Z({},e,{expires:-1}))},withAttributes:function(e){return t(this.converter,Z({},this.attributes,e))},withConverter:function(e){return t(Z({},this.converter,e),this.attributes)}},{attributes:{value:Object.freeze(n)},converter:{value:Object.freeze(e)}})}({read:function(t){return'"'===t[0]&&(t=t.slice(1,-1)),t.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(t){return encodeURIComponent(t).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"});function et(t){let e=document.getElementById(t);if(e)return JSON.parse(e.textContent)}function nt(t){let e,n;return{c(){e=p("div"),n=h(t[2]),$(e,"class","invalid-feedback")},m(t,o){u(t,e,o),a(e,n)},p(t,e){4&e&&b(n,t[2])},d(t){t&&d(e)}}}function ot(e){let n,r,c,i,s,l,f,g,b,x,w,_,S,C,E,N,W=e[2]&&nt(e);return{c(){n=p("form"),r=p("div"),c=p("input"),i=m(),s=p("div"),l=p("input"),f=m(),W&&W.c(),g=m(),b=p("div"),b.innerHTML='<input type="submit" class="btn btn-primary" value="Join"/>',x=m(),w=p("div"),_=p("label"),S=p("input"),C=h(" Join as a spectator 👁️"),$(c,"type","hidden"),$(c,"name","csrfmiddlewaretoken"),c.value=tt.get("csrftoken"),$(l,"type","text"),$(l,"name","name"),$(l,"class","form-control"),k(l,"is-invalid",e[2]),$(s,"class","col"),$(b,"class","col"),$(r,"class","row row-cols-lg-auto"),$(S,"type","checkbox"),$(S,"name","is_spectator"),$(_,"class","col"),$(w,"class","row"),$(n,"method","post")},m(t,o){u(t,n,o),a(n,r),a(r,c),a(r,i),a(r,s),a(s,l),y(l,e[0]),a(s,f),W&&W.m(s,null),a(r,g),a(r,b),a(n,x),a(n,w),a(w,_),a(_,S),S.checked=e[1],a(_,C),E||(N=[v(l,"change",e[3]),v(l,"input",e[4]),v(S,"change",e[5])],E=!0)},p(t,[e]){1&e&&l.value!==t[0]&&y(l,t[0]),4&e&&k(l,"is-invalid",t[2]),t[2]?W?W.p(t,e):(W=nt(t),W.c(),W.m(s,null)):W&&(W.d(1),W=null),2&e&&(S.checked=t[1])},i:t,o:t,d(t){t&&d(n),W&&W.d(),E=!1,o(N)}}}function rt(t,e,n){let o,r="",c=null;S((()=>{const t=localStorage.getItem("name");t&&n(0,r=t);const e=localStorage.getItem("isSpectator");null!==e&&n(1,c="true"===e)}));return t.$$.update=()=>{1&t.$$.dirty&&r&&localStorage.setItem("name",r),2&t.$$.dirty&&null!=c&&localStorage.setItem("isSpectator",c?"true":"false")},[r,c,o,()=>{n(2,o=r?void 0:"Name cannot be empty")},function(){r=this.value,n(0,r)},function(){c=this.checked,n(1,c)}]}class ct extends Q{constructor(t){super(),K(this,t,rt,ot,c,{})}}const it=(t,e={})=>{Nt(e);let{colors:n=["#FFC700","#FF0000","#2E3191","#41BBC7"],duration:o=3500,force:r=.5,particleCount:c=150,particleShape:i="mix",particleSize:s=12,destroyAfterDone:l=!0,stageHeight:a=800,stageWidth:u=1600}=e;!function(t){const e=vt("style");e.dataset.neoconfetti="",e.textContent='@keyframes fk9XWG_y-axis{to{transform:translate3d(0,var(--stage-height),0)}}@keyframes fk9XWG_x-axis{to{transform:translate3d(var(--x-landing-point),0,0)}}@keyframes fk9XWG_rotation{50%{transform:rotate3d(var(--half-rotation),180deg)}to{transform:rotate3d(var(--rotation),360deg)}}.fk9XWG_container{width:0;height:0;z-index:1200;position:relative;overflow:visible}.fk9XWG_particle{animation:x-axis var(--duration-chaos)forwards cubic-bezier(var(--x1),var(--x2),var(--x3),var(--x4));animation-name:fk9XWG_x-axis}.fk9XWG_particle>div{animation:y-axis var(--duration-chaos)forwards cubic-bezier(var(--y1),var(--y2),var(--y3),var(--y4));width:var(--width);height:var(--height);animation-name:fk9XWG_y-axis;position:absolute;top:0;left:0}.fk9XWG_particle>div:before{height:100%;width:100%;content:"";background-color:var(--bgcolor);animation:rotation var(--rotation-duration)infinite linear;border-radius:var(--border-radius);animation-name:fk9XWG_rotation;display:block}',$t(document.head,e)}(),t.classList.add("fk9XWG_container"),t.style.setProperty("--stage-height",a+"px");let d,f=bt(c,n),p=st(t,f);function h(t,e){const n=mt(ht()*(_t-1)),c="rectangles"!==i&&("circles"===i||St(n)),l=(e,n)=>t.style.setProperty(e,n+"");l("--x-landing-point",xt(pt(kt(e,90)-180),0,180,-u/2,u/2)+"px"),l("--duration-chaos",o-mt(1e3*ht())+"ms");const a=ht()<ut?yt(ht()*dt,2):0;l("--x1",a),l("--x2",-1*a),l("--x3",a),l("--x4",yt(pt(xt(pt(kt(e,90)-180),0,180,-1,1)),4)),l("--y1",yt(ht()*ft,4)),l("--y2",yt(ht()*r*(wt()?1:-1),4)),l("--y3",ft),l("--y4",yt(gt(xt(pt(e-180),0,180,r,-r),0),4)),l("--width",(c?s:mt(4*ht())+s/2)+"px"),l("--height",(c?s:mt(2*ht())+s)+"px");const d=n.toString(2).padStart(3,"0").split("");l("--half-rotation",d.map((t=>+t/2+""))),l("--rotation",d),l("--rotation-duration",yt(ht()*(at-lt)+lt)+"ms"),l("--border-radius",c?"50%":0)}for(const[t,e]of Object.entries(p))h(e,f[+t].degree);return Promise.resolve().then((()=>d=setTimeout((()=>l&&(t.innerHTML="")),o))),{update(e){Nt(e);const h=e.particleCount??c,m=e.colors??n,g=e.stageHeight??a;if(f=bt(h,m),h===c&&JSON.stringify(n)!==JSON.stringify(m))for(const[t,{color:e}]of Object.entries(f))p[+t].style.setProperty("--bgcolor",e);h!==c&&(t.innerHTML="",p=st(t,f)),l&&!e.destroyAfterDone&&clearTimeout(d),t.style.setProperty("--stage-height",g+"px"),n=m,o=e.duration??o,r=e.force??r,c=h,i=e.particleShape??i,s=e.particleSize??s,l=e.destroyAfterDone??l,a=g,u=e.stageWidth??u},destroy(){clearTimeout(d)}}};function st(t,e=[]){const n=[];for(const{color:o}of e){const e=vt("div");e.className="fk9XWG_particle",e.style.setProperty("--bgcolor",o);const r=vt("div");$t(e,r),$t(t,e),n.push(e)}return n}const lt=200,at=800,ut=.1,dt=.3,ft=.5,pt=Math.abs,ht=Math.random,mt=Math.round,gt=Math.max,vt=t=>document.createElement(t),$t=(t,e)=>t.appendChild(e),bt=(t,e)=>Array.from({length:t},((n,o)=>({color:e[o%e.length],degree:360*o/t}))),yt=(t,e=2)=>mt((t+Number.EPSILON)*10**e)/10**e,xt=(t,e,n,o,r)=>(t-e)*(r-o)/(n-e)+o,kt=(t,e)=>t+e>360?t+e-360:t+e,wt=()=>ht()>.5,_t=6,St=t=>1!==t&&wt(),Ct=t=>void 0===t,Et=(t,e)=>{if(!Ct(t)&&Number.isSafeInteger(t)&&t<0)throw new Error(e+" must be a positive integer")},Nt=({particleCount:t,duration:e,colors:n,particleSize:o,force:r,stageHeight:c,stageWidth:i,particleShape:s})=>{if(Et(t,"particleCount"),Et(e,"duration"),Et(o,"particleSize"),Et(r,"force"),Et(c,"stageHeight"),Et(i,"stageWidth"),!Ct(s)&&!/^(mix|circles|rectangles)$/i.test(s))throw new Error('particlesShape should be either "mix" or "circles" or "rectangle"');if(!Ct(n)&&!Array.isArray(n))throw new Error("colors must be an array of strings");if(r>1)throw new Error("force must be within 0 and 1")};function Wt(t){let e,n,r,c;const i=t[3].default,s=function(t,e,n,o){if(t){const r=l(t,e,n,o);return t[0](r)}}(i,t,t[2],null);return{c(){e=p("div"),s&&s.c(),$(e,"class","card btn svelte-xiahgm"),$(e,"disabled",t[0]),$(e,"role","button"),$(e,"tabindex","0"),k(e,"selected",t[1])},m(o,i){u(o,e,i),s&&s.m(e,null),n=!0,r||(c=[v(e,"click",t[4]),v(e,"keypress",t[5])],r=!0)},p(t,[o]){s&&s.p&&(!n||4&o)&&function(t,e,n,o,r,c){if(r){const i=l(e,n,o,c);t.p(i,r)}}(s,i,t,t[2],n?function(t,e,n,o){if(t[2]&&o){const r=t[2](o(n));if(void 0===e.dirty)return r;if("object"==typeof r){const t=[],n=Math.max(e.dirty.length,r.length);for(let o=0;o<n;o+=1)t[o]=e.dirty[o]|r[o];return t}return e.dirty|r}return e.dirty}(i,t[2],o,null):function(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let t=0;t<n;t++)e[t]=-1;return e}return-1}(t[2]),null),(!n||1&o)&&$(e,"disabled",t[0]),(!n||2&o)&&k(e,"selected",t[1])},i(t){n||(F(s,t),n=!0)},o(t){L(s,t),n=!1},d(t){t&&d(e),s&&s.d(t),r=!1,o(c)}}}function At(t,e,n){let{$$slots:o={},$$scope:r}=e,{disabled:c=!0}=e,{selected:i=""}=e;return t.$$set=t=>{"disabled"in t&&n(0,c=t.disabled),"selected"in t&&n(1,i=t.selected),"$$scope"in t&&n(2,r=t.$$scope)},[c,i,r,o,function(e){C.call(this,t,e)},function(e){C.call(this,t,e)}]}class Ot extends Q{constructor(t){super(),K(this,t,At,Wt,c,{disabled:0,selected:1})}}function Rt(t){let e;function n(t,e){return t[1]?It:jt}let o=n(t),r=o(t);return{c(){r.c(),e=g()},m(t,n){r.m(t,n),u(t,e,n)},p(t,c){o===(o=n(t))&&r?r.p(t,c):(r.d(1),r=o(t),r&&(r.c(),r.m(e.parentNode,e)))},d(t){t&&d(e),r.d(t)}}}function Mt(e){let n;return{c(){n=h("👁️")},m(t,e){u(t,n,e)},p:t,d(t){t&&d(n)}}}function jt(e){let n;return{c(){n=h("⌛")},m(t,e){u(t,n,e)},p:t,d(t){t&&d(n)}}}function It(t){let e,n=t[0].vote+"";return{c(){e=h(n)},m(t,n){u(t,e,n)},p(t,o){1&o&&n!==(n=t[0].vote+"")&&b(e,n)},d(t){t&&d(e)}}}function zt(t){let e;function n(t,e){return t[0].is_spectator?Mt:t[0].vote?Rt:void 0}let o=n(t),r=o&&o(t);return{c(){r&&r.c(),e=g()},m(t,n){r&&r.m(t,n),u(t,e,n)},p(t,c){o===(o=n(t))&&r?r.p(t,c):(r&&r.d(1),r=o&&o(t),r&&(r.c(),r.m(e.parentNode,e)))},d(t){t&&d(e),r&&r.d(t)}}}function Gt(t){let e,n,o,r,c,i,s=t[0].name+"";return c=new Ot({props:{$$slots:{default:[zt]},$$scope:{ctx:t}}}),{c(){e=p("div"),n=p("strong"),o=h(s),r=m(),J(c.$$.fragment),$(e,"class","participant svelte-1s7tb0t"),x(e,"transform","rotate("+t[2]+"deg) translate(33vw) rotate(90deg)")},m(t,s){u(t,e,s),a(e,n),a(n,o),a(e,r),q(c,e,null),i=!0},p(t,[n]){(!i||1&n)&&s!==(s=t[0].name+"")&&b(o,s);const r={};35&n&&(r.$$scope={dirty:n,ctx:t}),c.$set(r),(!i||4&n)&&x(e,"transform","rotate("+t[2]+"deg) translate(33vw) rotate(90deg)")},i(t){i||(F(c.$$.fragment,t),i=!0)},o(t){L(c.$$.fragment,t),i=!1},d(t){t&&d(e),V(c)}}}function Pt(t,e,n){let o,{user:r}=e,{isRevealed:c}=e,{i:i}=e,{count:s}=e;return t.$$set=t=>{"user"in t&&n(0,r=t.user),"isRevealed"in t&&n(1,c=t.isRevealed),"i"in t&&n(3,i=t.i),"count"in t&&n(4,s=t.count)},t.$$.update=()=>{28&t.$$.dirty&&(n(2,o=-90),s>1&&n(2,o-=Math.min(20,174/s)*(i-(s-1)/2)))},[r,c,o,i,s]}class Xt extends Q{constructor(t){super(),K(this,t,Pt,Gt,c,{user:0,isRevealed:1,i:3,count:4})}}const Bt=[];function Tt(e,n=t){let o;const r=new Set;function i(t){if(c(e,t)&&(e=t,o)){const t=!Bt.length;for(const t of r)t[1](),Bt.push(t,e);if(t){for(let t=0;t<Bt.length;t+=2)Bt[t][0](Bt[t+1]);Bt.length=0}}}function s(t){i(t(e))}return{set:i,update:s,subscribe:function(c,l=t){const a=[c,l];return r.add(a),1===r.size&&(o=n(i,s)||t),c(e),()=>{r.delete(a),0===r.size&&o&&(o(),o=null)}}}}const Ft=Tt([]),Lt=Tt([]),Ut=Tt([]),Dt=Tt(!1),Ht=Tt("tshirt"),Jt=Tt(!1),qt=Tt({}),Vt=Tt(void 0),Yt=function(e,n,c){const s=!Array.isArray(e),l=s?[e]:e;if(!l.every(Boolean))throw new Error("derived() expects stores as input, got a falsy value");const a=n.length<2;return u=(e,c)=>{let u=!1;const d=[];let f=0,p=t;const h=()=>{if(f)return;p();const o=n(s?d[0]:d,e,c);a?e(o):p=r(o)?o:t},m=l.map(((t,e)=>i(t,(t=>{d[e]=t,f&=~(1<<e),u&&h()}),(()=>{f|=1<<e}))));return u=!0,h(),function(){o(m),p(),u=!1}},{subscribe:Tt(c,u).subscribe};var u}(Ft,(t=>{const e=new Proxy({},{get:(t,e)=>e in t?t[e]:0});return t.forEach((t=>{null!=t.vote&&(e[t.vote]+=1)})),Object.entries(e).sort(((t,e)=>e[1]-t[1]))})),Kt=t=>{qt.update((e=>(e.vote=t,e)))};let Qt;function Zt(t,e=void 0){Qt&&1==Qt.readyState?((e=e||{}).action=t,console.log("update",e),Qt.send(JSON.stringify(e))):console.log("Socket not open yet")}function te(t){Qt=new WebSocket(t),Qt.onclose=()=>{Vt.set("WebSocket connection closed unexpectedly. Trying to reconnect in 2s..."),setTimeout((()=>{console.log("Reconnecting..."),te(t)}),2e3)},Qt.onopen=()=>{Zt({action:"init"})},Qt.onmessage=t=>{const e=JSON.parse(t.data);switch(console.log("message",e),e.type){case"init":Ft.set(e.users),qt.set(e.user),Lt.set(e.settings.choices),Dt.set(e.settings.auto_reveal),Jt.set(e.settings.is_revealed),Ut.set(e.settings.decks),Ht.set(e.settings.deck),Vt.set(void 0);break;case"vote":Ft.update((t=>(t.forEach((t=>{t.id==e.user_id&&(t.vote=e.value)})),[...t])));break;case"error":Vt.set(e.message)}}}const ee=()=>Zt("reveal"),ne=()=>{Kt(null),Zt("clear")};function oe(t){return()=>{(function(t){let e;return i(t,(t=>e=t))(),e})(Jt)||(Zt("vote",{value:t}),Kt(t))}}function re(t,e,n){const o=t.slice();return o[7]=e[n][0],o[8]=e[n][1],o}function ce(t){let e,n,o,r,c,i,s,l,f,g,x,k=!1,w=t[8]+"";return f=function(t){let e;return{p(...n){e=n,e.forEach((e=>t.push(e)))},r(){e.forEach((e=>t.splice(t.indexOf(e),1)))}}}(t[5][0]),{c(){e=p("input"),c=m(),i=p("label"),s=h(w),$(e,"type","radio"),$(e,"class","btn-check"),e.__value=n=t[7],y(e,e.__value),$(e,"autocomplete","off"),$(e,"id",o="deck-"+t[7]),e.disabled=r=!t[1],$(i,"class","btn btn-outline-primary"),$(i,"for",l="deck-"+t[7]),f.p(e)},m(n,o){u(n,e,o),e.checked=e.__value===t[2],u(n,c,o),u(n,i,o),a(i,s),g||(x=v(e,"change",t[4]),g=!0)},p(t,c){1&c&&n!==(n=t[7])&&(e.__value=n,y(e,e.__value),k=!0),1&c&&o!==(o="deck-"+t[7])&&$(e,"id",o),2&c&&r!==(r=!t[1])&&(e.disabled=r),(k||5&c)&&(e.checked=e.__value===t[2]),1&c&&w!==(w=t[8]+"")&&b(s,w),1&c&&l!==(l="deck-"+t[7])&&$(i,"for",l)},d(t){t&&(d(e),d(c),d(i)),f.r(),g=!1,x()}}}function ie(e){let n,o,r,c,i,s,l,h,g,b,y=U(e[0]),x=[];for(let t=0;t<y.length;t+=1)x[t]=ce(re(e,y,t));return{c(){n=p("div");for(let t=0;t<x.length;t+=1)x[t].c();o=m(),r=p("br"),c=m(),i=p("div"),s=p("label"),s.textContent="Auto reveal",l=m(),h=p("input"),$(n,"class","btn-group btn-group-sm"),$(n,"role","group"),$(n,"aria-label","Change deck"),$(s,"for","autoReveal"),$(h,"type","checkbox"),$(h,"class","form-check-input"),$(h,"id","autoReveal"),$(i,"class","form-check form-switch mt-2")},m(t,d){u(t,n,d);for(let t=0;t<x.length;t+=1)x[t]&&x[t].m(n,null);u(t,o,d),u(t,r,d),u(t,c,d),u(t,i,d),a(i,s),a(i,l),a(i,h),h.checked=e[3],g||(b=v(h,"change",e[6]),g=!0)},p(t,[e]){if(7&e){let o;for(y=U(t[0]),o=0;o<y.length;o+=1){const r=re(t,y,o);x[o]?x[o].p(r,e):(x[o]=ce(r),x[o].c(),x[o].m(n,null))}for(;o<x.length;o+=1)x[o].d(1);x.length=y.length}8&e&&(h.checked=t[3])},i:t,o:t,d(t){t&&(d(n),d(o),d(r),d(c),d(i)),f(x,t),g=!1,b()}}}function se(t,e,n){let o,r,c,i;s(t,Ut,(t=>n(0,o=t))),s(t,Jt,(t=>n(1,r=t))),s(t,Ht,(t=>n(2,c=t))),s(t,Dt,(t=>n(3,i=t)));return[o,r,c,i,function(){c=this.__value,Ht.set(c)},[[]],function(){i=this.checked,Dt.set(i)}]}Ht.subscribe((t=>Zt("settings",{deck:t}))),Dt.subscribe((t=>Zt("settings",{auto_reveal:t})));class le extends Q{constructor(t){super(),K(this,t,se,ie,c,{})}}function ae(t,e,n){const o=t.slice();return o[12]=e[n],o}function ue(t,e,n){const o=t.slice();return o[15]=e[n][0],o[16]=e[n][1],o}function de(t,e,n){const o=t.slice();return o[19]=e[n],o[21]=n,o}function fe(t){let e,n,o;return{c(){e=p("div"),n=p("div"),o=h(t[3]),$(n,"class","alert alert-danger"),$(n,"role","alert"),$(e,"class","fixed-top")},m(t,r){u(t,e,r),a(e,n),a(n,o)},p(t,e){8&e&&b(o,t[3])},d(t){t&&d(e)}}}function pe(t,e){let n,o,r;return o=new Xt({props:{isRevealed:e[4],user:e[19],i:e[21],count:e[1]}}),{key:t,first:null,c(){n=g(),J(o.$$.fragment),this.first=n},m(t,e){u(t,n,e),q(o,t,e),r=!0},p(t,n){e=t;const r={};16&n&&(r.isRevealed=e[4]),1&n&&(r.user=e[19]),1&n&&(r.i=e[21]),2&n&&(r.count=e[1]),o.$set(r)},i(t){r||(F(o.$$.fragment,t),r=!0)},o(t){L(o.$$.fragment,t),r=!1},d(t){t&&d(n),V(o,t)}}}function he(t){let e,n,o,r=[],c=new Map,i=t[5]&&1==t[5].length&&t[5][0][1]>1&&me(),s=U(t[5]);const l=t=>t[15];for(let e=0;e<s.length;e+=1){let n=ue(t,s,e),o=l(n);c.set(o,r[e]=$e(o,n))}let a=null;return s.length||(a=ge()),{c(){i&&i.c(),e=m(),n=p("div");for(let t=0;t<r.length;t+=1)r[t].c();a&&a.c(),$(n,"class","summary rounded mb-3 text-center svelte-lta3sd")},m(t,c){i&&i.m(t,c),u(t,e,c),u(t,n,c);for(let t=0;t<r.length;t+=1)r[t]&&r[t].m(n,null);a&&a.m(n,null),o=!0},p(t,o){t[5]&&1==t[5].length&&t[5][0][1]>1?i||(i=me(),i.c(),i.m(e.parentNode,e)):i&&(i.d(1),i=null),32&o&&(s=U(t[5]),B(),r=H(r,o,l,1,t,s,c,n,D,$e,null,ue),T(),!s.length&&a?a.p(t,o):s.length?a&&(a.d(1),a=null):(a=ge(),a.c(),a.m(n,null)))},i(t){if(!o){for(let t=0;t<s.length;t+=1)F(r[t]);o=!0}},o(t){for(let t=0;t<r.length;t+=1)L(r[t]);o=!1},d(t){t&&(d(e),d(n)),i&&i.d(t);for(let t=0;t<r.length;t+=1)r[t].d();a&&a.d()}}}function me(e){let n,o,c;return{c(){n=p("div")},m(e,i){var s;u(e,n,i),o||(s=it.call(null,n),c=s&&r(s.destroy)?s.destroy:t,o=!0)},d(t){t&&d(n),o=!1,c()}}}function ge(e){let n;return{c(){n=p("div"),n.textContent="No votes",$(n,"class","col text-center")},m(t,e){u(t,n,e)},p:t,d(t){t&&d(n)}}}function ve(t){let e,n=t[15]+"";return{c(){e=h(n)},m(t,n){u(t,e,n)},p(t,o){32&o&&n!==(n=t[15]+"")&&b(e,n)},d(t){t&&d(e)}}}function $e(t,e){let n,o,r,c,i,s,l,f,g=e[16]+"";return o=new Ot({props:{$$slots:{default:[ve]},$$scope:{ctx:e}}}),{key:t,first:null,c(){n=p("div"),J(o.$$.fragment),r=m(),c=p("div"),i=h(g),s=h("x"),l=m(),$(c,"class","text-muted"),$(n,"class","d-inline-block text-center m-2"),this.first=n},m(t,e){u(t,n,e),q(o,n,null),a(n,r),a(n,c),a(c,i),a(c,s),a(n,l),f=!0},p(t,n){e=t;const r={};4194336&n&&(r.$$scope={dirty:n,ctx:e}),o.$set(r),(!f||32&n)&&g!==(g=e[16]+"")&&b(i,g)},i(t){f||(F(o.$$.fragment,t),f=!0)},o(t){L(o.$$.fragment,t),f=!1},d(t){t&&d(n),V(o)}}}function be(t){let e;return{c(){e=h("✓")},m(t,n){u(t,e,n)},d(t){t&&d(e)}}}function ye(e){let n,o,r;return{c(){n=p("button"),n.textContent="Reveal",$(n,"class","btn btn-primary")},m(t,e){u(t,n,e),o||(r=v(n,"click",ee),o=!0)},p:t,d(t){t&&d(n),o=!1,r()}}}function xe(e){let n,o,r;return{c(){n=p("button"),n.textContent="Clear",$(n,"class","btn btn-warning")},m(t,e){u(t,n,e),o||(r=v(n,"click",ne),o=!0)},p:t,d(t){t&&d(n),o=!1,r()}}}function ke(t){let e,n,o=U(t[7]),r=[];for(let e=0;e<o.length;e+=1)r[e]=Se(ae(t,o,e));const c=t=>L(r[t],1,1,(()=>{r[t]=null}));return{c(){e=p("div");for(let t=0;t<r.length;t+=1)r[t].c();$(e,"class","d-flex justify-content-center")},m(t,o){u(t,e,o);for(let t=0;t<r.length;t+=1)r[t]&&r[t].m(e,null);n=!0},p(t,n){if(208&n){let i;for(o=U(t[7]),i=0;i<o.length;i+=1){const c=ae(t,o,i);r[i]?(r[i].p(c,n),F(r[i],1)):(r[i]=Se(c),r[i].c(),F(r[i],1),r[i].m(e,null))}for(B(),i=o.length;i<r.length;i+=1)c(i);T()}},i(t){if(!n){for(let t=0;t<o.length;t+=1)F(r[t]);n=!0}},o(t){r=r.filter(Boolean);for(let t=0;t<r.length;t+=1)L(r[t]);n=!1},d(t){t&&d(e),f(r,t)}}}function we(e){let n,o,r,c,i,s;return{c(){n=h("You joined as spectator."),o=p("br"),r=h("\n                I want to\n                "),c=p("button"),c.textContent="become a voter",$(c,"class","btn btn-light btn-sm")},m(t,l){u(t,n,l),u(t,o,l),u(t,r,l),u(t,c,l),i||(s=v(c,"click",e[11]),i=!0)},p:t,i:t,o:t,d(t){t&&(d(n),d(o),d(r),d(c)),i=!1,s()}}}function _e(t){let e,n,o=t[12]+"";return{c(){e=h(o),n=m()},m(t,o){u(t,e,o),u(t,n,o)},p(t,n){128&n&&o!==(o=t[12]+"")&&b(e,o)},d(t){t&&(d(e),d(n))}}}function Se(t){let e,n;return e=new Ot({props:{disabled:t[4],selected:t[12]==t[6].vote,$$slots:{default:[_e]},$$scope:{ctx:t}}}),e.$on("click",(function(){r(oe(t[12]))&&oe(t[12]).apply(this,arguments)})),e.$on("keypress",(function(){r(oe(t[12]))&&oe(t[12]).apply(this,arguments)})),{c(){J(e.$$.fragment)},m(t,o){q(e,t,o),n=!0},p(n,o){t=n;const r={};16&o&&(r.disabled=t[4]),192&o&&(r.selected=t[12]==t[6].vote),4194432&o&&(r.$$scope={dirty:o,ctx:t}),e.$set(r)},i(t){n||(F(e.$$.fragment,t),n=!0)},o(t){L(e.$$.fragment,t),n=!1},d(t){V(e,t)}}}function Ce(e){let n,r,c,i,s,l,f,g,b,y,x,k,w,_,S,C,E,N,W,A,O=[],R=new Map,M=e[3]&&fe(e),j=U(e[0]);const I=t=>t[19].id;for(let t=0;t<j.length;t+=1){let n=de(e,j,t),o=I(n);R.set(o,O[t]=pe(o,n))}let z=e[4]&&he(e),G=!e[4]&&e[2]&&be();function P(t,e){return t[4]?xe:ye}let X=P(e),Y=X(e),K=!e[8]&&function(e){let n,r,c,i,s,l,f;return{c(){n=h("Fake:\n                "),r=p("div"),c=p("button"),c.textContent="Users",i=m(),s=p("button"),s.textContent="Votes",$(c,"class","btn btn-warning"),$(s,"class","btn btn-warning"),$(r,"class","btn-group btn-group-sm"),$(r,"role","group")},m(t,o){u(t,n,o),u(t,r,o),a(r,c),a(r,i),a(r,s),l||(f=[v(c,"click",e[9]),v(s,"click",e[10])],l=!0)},p:t,d(t){t&&(d(n),d(r)),l=!1,o(f)}}}(e);const Q=[we,ke],Z=[];function tt(t,e){return t[6].is_spectator?0:1}return S=tt(e),C=Z[S]=Q[S](e),W=new le({}),{c(){M&&M.c(),n=m(),r=p("div");for(let t=0;t<O.length;t+=1)O[t].c();c=m(),i=p("div"),z&&z.c(),s=m(),l=p("div"),f=p("div"),G&&G.c(),g=m(),Y.c(),b=m(),y=p("div"),x=p("div"),k=p("div"),K&&K.c(),w=m(),_=p("div"),C.c(),E=m(),N=p("div"),J(W.$$.fragment),$(f,"class","voting-status svelte-lta3sd"),$(l,"class","d-flex justify-content-center mb-3"),$(i,"class","controls svelte-lta3sd"),$(r,"class","participants svelte-lta3sd"),$(k,"class","col-md-2"),$(_,"class","col-md-8"),$(N,"class","col-md-2 text-start"),$(x,"class","row"),$(y,"class","container text-center")},m(t,e){M&&M.m(t,e),u(t,n,e),u(t,r,e);for(let t=0;t<O.length;t+=1)O[t]&&O[t].m(r,null);a(r,c),a(r,i),z&&z.m(i,null),a(i,s),a(i,l),a(l,f),G&&G.m(f,null),a(l,g),Y.m(l,null),u(t,b,e),u(t,y,e),a(y,x),a(x,k),K&&K.m(k,null),a(x,w),a(x,_),Z[S].m(_,null),a(x,E),a(x,N),q(W,N,null),A=!0},p(t,[e]){t[3]?M?M.p(t,e):(M=fe(t),M.c(),M.m(n.parentNode,n)):M&&(M.d(1),M=null),19&e&&(j=U(t[0]),B(),O=H(O,e,I,1,t,j,R,r,D,pe,c,de),T()),t[4]?z?(z.p(t,e),16&e&&F(z,1)):(z=he(t),z.c(),F(z,1),z.m(i,s)):z&&(B(),L(z,1,1,(()=>{z=null})),T()),!t[4]&&t[2]?G||(G=be(),G.c(),G.m(f,null)):G&&(G.d(1),G=null),X===(X=P(t))&&Y?Y.p(t,e):(Y.d(1),Y=X(t),Y&&(Y.c(),Y.m(l,null))),t[8]||K.p(t,e);let o=S;S=tt(t),S===o?Z[S].p(t,e):(B(),L(Z[o],1,1,(()=>{Z[o]=null})),T(),C=Z[S],C?C.p(t,e):(C=Z[S]=Q[S](t),C.c()),F(C,1),C.m(_,null))},i(t){if(!A){for(let t=0;t<j.length;t+=1)F(O[t]);F(z),F(C),F(W.$$.fragment,t),A=!0}},o(t){for(let t=0;t<O.length;t+=1)L(O[t]);L(z),L(C),L(W.$$.fragment,t),A=!1},d(t){t&&(d(n),d(r),d(b),d(y)),M&&M.d(t);for(let t=0;t<O.length;t+=1)O[t].d();z&&z.d(),G&&G.d(),Y.d(),K&&K.d(),Z[S].d(),V(W)}}}function Ee(t,e,n){let o,r,c,i,l,a,u;s(t,Ft,(t=>n(0,r=t))),s(t,Vt,(t=>n(3,c=t))),s(t,Jt,(t=>n(4,i=t))),s(t,Yt,(t=>n(5,l=t))),s(t,qt,(t=>n(6,a=t))),s(t,Lt,(t=>n(7,u=t)));const d=!window.location.host.includes("localhost");let f;S((()=>{te(et("websocket_url"))}));return t.$$.update=()=>{1&t.$$.dirty&&n(1,f=r.length),1&t.$$.dirty&&n(2,o=r.every((t=>t.is_spectator||t.vote)))},[r,f,o,c,i,l,a,u,d,()=>Zt("add_fakes"),()=>Zt("fake_votes"),()=>Zt("settings",{is_spectator:!1})]}class Ne extends Q{constructor(t){super(),K(this,t,Ee,Ce,c,{})}}function We(t){let e,n;return e=new ct({}),{c(){J(e.$$.fragment)},m(t,o){q(e,t,o),n=!0},i(t){n||(F(e.$$.fragment,t),n=!0)},o(t){L(e.$$.fragment,t),n=!1},d(t){V(e,t)}}}function Ae(t){let e,n;return e=new Ne({}),{c(){J(e.$$.fragment)},m(t,o){q(e,t,o),n=!0},i(t){n||(F(e.$$.fragment,t),n=!0)},o(t){L(e.$$.fragment,t),n=!1},d(t){V(e,t)}}}function Oe(e){let n,o,r,c,i,s;const l=[Ae,We],a=[];return r=function(t,e){return t[0]?0:1}(e),c=a[r]=l[r](e),{c(){n=p("h1"),n.textContent="Planning poker",o=m(),c.c(),i=g()},m(t,e){u(t,n,e),u(t,o,e),a[r].m(t,e),u(t,i,e),s=!0},p:t,i(t){s||(F(c),s=!0)},o(t){L(c),s=!1},d(t){t&&(d(n),d(o),d(i)),a[r].d(t)}}}function Re(t){return[et("websocket_url")]}return new class extends Q{constructor(t){super(),K(this,t,Re,Oe,c,{})}}({target:document.querySelector("#poker")})}();
