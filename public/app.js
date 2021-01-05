(()=>{var ft=Object.defineProperty,cr=Object.prototype.hasOwnProperty,gt=Object.getOwnPropertySymbols,ur=Object.prototype.propertyIsEnumerable,g=Object.assign,mr=e=>ft(e,"__esModule",{value:!0}),ke=(e,t)=>{var r={};for(var o in e)cr.call(e,o)&&t.indexOf(o)<0&&(r[o]=e[o]);if(e!=null&&gt)for(var o of gt(e))t.indexOf(o)<0&&ur.call(e,o)&&(r[o]=e[o]);return r},vt=(e,t)=>{mr(e);for(var r in t)ft(e,r,{get:t[r],enumerable:!0})};const n={};vt(n,{appendChildren:()=>ne,createElement:()=>Be,h:()=>vr,render:()=>K,setProperties:()=>Te});const ce="string",te="number",re="function",ht="boolean";function I(e,...t){if(!e||e.length===0)return;let r=0;const o=e.length;for(r;r<o;r++)e[r](...t)}function A(){return Object.create(null)}function Re(e,t){return e.push(t),()=>pr(e,t)}function pr(e,t){const r=e.indexOf(t);r!==-1&&e.splice(r,1)}function yt(e){let t;for(let r=0,o=e.length;r<o;r++)t=Math.imul(31,t)+e.charCodeAt(r)|0;return t.toString(36)}function Ae(e,{sort:t,filter:r,limit:o,offset:i}){let s=[...e];return r&&(s=s.filter(r)),t&&(s=s.sort(t)),typeof i===te&&(s=s.slice(0,i)),typeof o===te&&(s.length=o),s}function ye(e){let t=[];for(let r in e)t.push(r);return t}function H(e,t,r){let o=e[E][t]||(e[E][t]=[]);return Re(o,r)}const E=Symbol("Hooks"),we=Symbol("Mount"),L=Symbol("Destroy"),F=Symbol("Events"),be=Symbol("Styles"),xe=A();function Ue(e,t){window[E]||(window[E]=A(),window[E][F]||(window[E][F]=A()));let r=window[E][F][e]||(window[E][F][e]=[]),o=i=>I(r,i);return r.push(t),r.length===1&&wt(window,e,o),()=>{const i=r.indexOf(t);i!==-1&&(r.splice(i,1),r.length===0&&bt(window,e,o))}}function O(e,t,r){let o=e[E][F][t]||(e[E][F][t]=[]),i=s=>I(o,s);o.push(r),o.length===1&&wt(e,t,i),H(e,L,()=>{const s=o.indexOf(r);s!==-1&&(o.splice(s,1),o.length===0&&bt(e,t,i))})}function wt(e,t,r){e.addEventListener(t,r,!1)}function bt(e,t,r){e.removeEventListener(t,r,!1)}function Te(e,t){const r=ye(t);r.forEach(o=>{const i=xe[o];i?i(e,t[o]):dr(e,o,t[o])})}function dr(e,t,r){if(r===void 0)return;if(r.subscribe){let o=r;e[t]=o.value(),H(e,L,o.subscribe(i=>{e[t]!==i&&(e[t]=i)}))}else t.startsWith("on")&&typeof r===re?O(e,t.slice(2),r):e[t]=r}function K(e,...t){e.innerHTML="",ne(e,t,e)}function ne(e,t,r){let o=xt();const i=t.length;if(i>0){for(let s=0;s<i;s++){if(t[s]===void 0)continue;if(t[s]===null)continue;if(Array.isArray(t[s]))ne(o,t[s],r);else if(typeof t[s]===ce||typeof t[s]===te)o.appendChild(Ce(t[s]));else if(t[s]instanceof Element)o.appendChild(t[s]);else if(t[s].subscribe){let c=t[s].value();if(typeof c===ce||typeof c===te){let u=t[s],m=Ce(u.value());o.appendChild(m),H(r,L,u.subscribe(p=>{let R=p+"";m.textContent!==R&&(m.textContent=R)}))}else if(c instanceof Element){let u=t[s];o.appendChild(u.value()),H(r,L,u.subscribe(m=>{u.value().replaceWith(m)}))}}}e.appendChild(o)}}function gr(e){let t=document.createElement(e);return fr(t),t}const Ce=e=>document.createTextNode(e+""),xt=()=>document.createDocumentFragment();function fr(e){e[E]=A(),e[E][we]=[],e[E][L]=[],e[E][F]=A()}function Be(e,t,...r){if(typeof e===re)return e(t,...r);let o=gr(e);return Te(o,t),ne(o,r,o),o}const vr=Be;function d(e){let t=e;const r=[],o={isObservable:!0,set:i,subscribe:u,update:s,value:c};function i(m){return t=m,I(r,t),o}function s(m){return m(t),I(r,t),o}function c(){return t}function u(m){return m(t),Re(r,m)}return o}function v(){let e;const t={isRef:!0,current:e};return t}function ue(e){let t,r;const o=[],i=[],s={isPortal:!0,open:c,close:m,set:u,onOpen:p,onClose:R};async function c(S,...N){r?(m(),c(S,...N)):(r=await e(S,...N),t.appendChild(r),I(o))}function u(S){return t=S,s}function m(){return r&&(r.remove(),r=void 0,I(i)),s}function p(S){return o.push(S),s}function R(S){return i.push(S),s}return s}const hr=/\*/g,yr=/\:([a-zA-Z]+)/gi,wr="(?<$1>[^\\/\\:\\?]+?)",br="^/",xr="/?$",Tr="(\\S+)?",Er=/\S+/i,Sr=/\/\//g,Lr="/",Mr=/(\*\*)+/g,Pr="**";function _e(e){if(e.startsWith("/"))throw new Error("RoutePath cannot start with an '/'");if(e.endsWith("/"))throw new Error("RoutePath cannot end with an '/'");return e==="**"?Er:(e=e.replace(hr,Tr),e=e.replace(yr,wr),e=e.replace(Sr,Lr),e=e.replace(Mr,Pr),new RegExp(br+e+xr))}function Fe(e){let t=[],r=0;for(;e[r];){let{component:o,path:i,title:s,children:c,activates:u}=e[r],m=_e(i);u=[...new Set(u)],t.push({title:s,matcher:m,component:o,activates:u}),c&&e.splice(r+1,0,...c.map(p=>(p.activates&&u?p.activates=[...u,...new Set(p.activates)]:u&&(p.activates=u),p.path=i+"/"+p.path,p))),r++}return t}async function Oe(e,t){if(e)try{for(let r of e)if(await r(t)!==!0)return!1}catch(r){return console.error(r),!1}return!0}function $e(e,t){let r=e.exec(t);return r.groups?g({},r.groups):Object.create(null)}async function We(e,t){let r=0;for(;e[r];){let o=e[r];if(!o.matcher.test(t)){r++;continue}o.params=$e(o.matcher,t);let i=await Oe(o.activates,o.params);if(i)return o;r++;continue}}async function Ve(e,t){let r=await We(e,t);if(!r)return;let{component:o,title:i,params:s}=r,c="";i&&(typeof i===re?c=i(s):typeof i===ce&&(c=i));let u=await o(s);return{title:c,params:s,component:u}}async function je(e,t,r){t.title&&(document.title=t.title),history.replaceState(t.params,document.title,r),K(e,t.component)}function Ge(){return location.pathname+location.search+location.hash}function Tt({target:e,routes:t}){const r=Fe(t),o={load:[],loadEnd:[],loadError:[]},i={onLoad:c,onLoadEnd:u,onLoadError:m};async function s(){let p=Ge();I(o.load);let R=await Ve(r,p);R?je(e,R,p):I(o.loadError),I(o.loadEnd)}function c(p){return o.load.push(p),i}function u(p){return o.loadEnd.push(p),i}function m(p){return o.loadEnd.push(p),i}return s(),Ue("popstate",s),i}Ue("click",e=>{let t=e.target;for(;t;){if(t.href){e.preventDefault(),history.pushState(null,"",t.href),dispatchEvent(new PopStateEvent("popstate"));break}t=t.parentNode}});const Et=document.createElement("style");document.head.appendChild(Et);const St=Et.sheet,me=A();function ze(e,t){e[be]||(e[be]=A());const r=e[be],o=[],i=[],s=ye(t);for(let c=0,u=s.length;c<u;c++){const m=s[c].replace(/([A-Z])/g,"-$1"),p=Hr(`${m}: ${t[s[c]]};`);r[m]?(i.push(r[m]),r[m]=p,o.push(p)):(r[m]=p,o.push(p))}e.classList.remove(...i),e.classList.add(...o)}function Hr(e){let t="r-"+yt(e),r=`.${t} { ${e} }`;return me[t]?me[t]!==r&&(t+="_",me[t]=`.${t} { ${e} }`,Lt(me[t])):(me[t]=r,Lt(r)),t}function Lt(e){St.insertRule(e,St.rules.length)}const w=(e,t)=>xe[e]=t,Nr=(e,t)=>H(e,we,t),Mt=(e,t)=>H(e,L,t),Ir=(e,t)=>{let r=setInterval(()=>t[0](e),t[1]);return H(e,L,()=>clearInterval(r))},kr=(e,t)=>{t.isRef&&(t.current=e)},Rr=(e,t)=>{t.isPortal&&t.set(e)},Ar=(e,t)=>{if(typeof t===ht)t===!1&&e.setAttribute("hidden","");else if(t.subscribe){let r=t;H(e,L,r.subscribe(o=>{o===!0?e.removeAttribute("hidden"):e.setAttribute("hidden","")}))}},Ur=(e,t)=>{if(t.subscribe){let r=t;H(e,L,r.subscribe(o=>ze(e,o)))}else ze(e,t)},Cr=(e,t)=>{let r=t.sort,o=t.filter,i=t.limit,s=t.offset,c=t.do;if(t.of){if(Array.isArray(t.of)){let u=Ae(t.of,{sort:r,filter:o,limit:i,offset:s});K(e,...u.map(c))}else if(t.of&&t.of.subscribe){let u=t.of;Mt(e,u.subscribe(m=>{let p=Ae(m,{sort:r,filter:o,limit:i,offset:s});K(e,...p.map(c))}))}}};w("styles",Ur);w("if",Ar);w("ref",kr);w("portal",Rr);w("mount",Nr);w("destroy",Mt);w("interval",Ir);w("for",Cr);const Br=/\![\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g,_r=/[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g,Fr=/^\s*\n\`\`\`(([^\s]+))?/gm,Or=/^\`\`\`\s*\n/gm,$r=/(\<pre.+\>)\s*\n\<p\>(.+)\<\/p\>/gm,Wr=/[\`]{1}([^\`]+)[\`]{1}/g,Vr=/^\s*(\n)?(.+)/gm,jr=/\<(\/)?(h\d|ul|ol|li|img|pre)/,Gr=/[\*\_]{2}([^\*\_]+)[\*\_]{2}/g,zr=/[\*\_]{1}([^\*\_]+)[\*\_]{1}/g,Kr=/[\~]{2}([^\~]+)[\~]{2}/g,qr=/^\s*\n\*/gm,Jr=/^(\*.+)\s*\n([^\*])/gm,Zr=/^\* (.+)/gm,Yr=/^\s*\n\d\./gm,Xr=/^(\d\..+)\s*\n([^\d\.])/gm,Qr=/^\d\. (.+)/gm,Dr=/[\\#]{1} (.+)/g,en=/[\\#]{2} (.+)/g,tn=/[\\#]{3} (.+)/g,rn=/[\\#]{4} (.+)/g,nn=/[\\#]{5} (.+)/g,on=/[\\#]{6} (.+)/g;function b(e,t,r){return e.replace(t,r)}function pe(e){return e=ln(e),e=sn(e),e=b(e,Br,'<img loading="lazy" src="$2" alt="$1">'),e=b(e,_r,'<a target="_blank" href="$2">$1</a>'),e=an(e),e=b(e,Fr,'<pre class="$2">'),e=b(e,Or,`</pre>

`),e=b(e,Wr,"<code>$1</code>"),e=b(e,Vr,t=>jr.test(t)?t:`<p>${t}</p>`),e=b(e,$r,"$1$2"),e}function sn(e){return e=b(e,on,"<h6>$1</h6>"),e=b(e,nn,"<h5>$1</h5>"),e=b(e,rn,"<h4>$1</h4>"),e=b(e,tn,"<h3>$1</h3>"),e=b(e,en,"<h2>$1</h2>"),e=b(e,Dr,"<h1>$1</h1>"),e}function an(e){return e=b(e,Gr,"<b>$1</b>"),e=b(e,zr,"<i>$1</i>"),e=b(e,Kr,"<del>$1</del>"),e}function ln(e){return e=b(e,qr,`<ul>
*`),e=b(e,Jr,`$1
</ul>

$2`),e=b(e,Zr,"<li>$1</li>"),e=b(e,Yr,`<ol>
1.`),e=b(e,Xr,`$1
</ol>

$2`),e=b(e,Qr,"<li>$1</li>"),e}var cn="Startseite",un="Pr\xE4sentation",mn="Allgemein",pn="Anwendung installieren",dn="Anwendung deinstallieren",fn="Installieren",gn="Bereits installiert",vn="Einloggen",hn="Nutzereinstellungen",yn="Einstellungen",wn="Registrieren",bn="Ausloggen",xn="Kommentare",Tn="Fehler",En="Folgt",Sn="Follower",Ln="Navigation",Mn="Besuche $u's Seite",Pn="Senden",Hn="Name",Nn="Namen \xE4ndern",In="Name erfolgreich aktualisiert",kn="Name konnte nicht aktualisiert werden",Rn="Schlie\xDFen",An="Folgen",Un="Nicht mehr folgen",Cn="Post bearbeiten",Bn="Post l\xF6schen",_n="Soll der Post gel\xF6scht werden?",Fn="Post wurde gel\xF6scht",On="Post konnte nicht gel\xF6scht werden",$n="Fortfahren",Wn="Abbrechen",Vn="Bearbeitet",jn="Kommentieren",Gn="Kommentar l\xF6schen",zn="Zeige Men\xFC an",Kn="\xC4nderungen speichern",qn="Bild entfernen",Jn="Bild hochladen",Zn="Konto l\xF6schen",Yn="Konto wirklich l\xF6schen?",Xn="Wenn du das Konto l\xF6scht, kannst du den Vorgang nicht mehr r\xFCckg\xE4ngig machen.",Qn="F\xFCr diese Aktion hast du keine Berechtigungen.",Dn="Progressive Webanwendung",eo="Folgender Fehler ist aufgetreten: '$e'",to="Dateityp '$t' nicht unterst\xFCtzt.",ro="Klicken um '$c' in die Zwischenablage zu kopieren",no="Benutzername",oo="E-Mail Adresse",io="Passwort",so="Aktuelles Passwort",ao="Dein Passwort wurde erfolgreich aktualisiert",lo="Dein Passwort konnte nicht aktualisiert werden",co="Passwort aktualisieren",uo="\xC4ndere dein Passwort",mo="Passwort wiederholen",po="Neues Passwort",fo="Neues Passwort wiederholen",go="Erfolgreich eingeloggt",vo="Du bist nun eingeloggt",ho="Einloggen fehlgeschlagen",yo="Benutzer existiert nicht oder inkorrekte Eingaben",wo="Du bist nun abgemeldet",bo="Erfolgreich registriert. Du kannst dich nun einloggen.",xo="Entweder existiert der Benutzer bereits oder falsche Eingaben get\xE4tigt.",To="Passw\xF6rter stimmen nicht \xFCberein",Eo="Vorschau",So=" Nutzer/n gef\xE4llt das",Lo="Gehe zur Kommentarsektion",Mo="Seite '$url' nicht gefunden.",Po="Die Nachricht ist zu kurz",Ho="Die Nachricht hat die maximale L\xE4nge \xFCberschritten",No="Die Nachricht hat eine inkorrekte L\xE4nge",Io="So kannst du die Nachricht nicht absenden.",ko="Du hast bereits ein Konto?",Ro="Logge dich in dein Konto ein",Ao="Erstelle ein Konto",Uo="Dein Grund zum Einloggen",Co="Noch kein Konto?",Bo="Vor $n Sekunden",_o="Vor einer Sekunde",Fo="Vor $n Minuten",Oo="Vor einer Minute",$o="Vor $n Stunden",Wo="Vor einer Stunde",Vo="Vor $n Tagen",jo="Vor einem Tag",Go="Vor $n Wochen",zo="Vor einer Woche",Ko="Vor $n Monaten",qo="Vor einem Monat",Jo="Vor $n Jahren",Zo="Vor einem Jahr",a={home:cn,presentation:un,general:mn,installApp:pn,uninstallApp:dn,install:fn,isInstalled:gn,login:vn,userSettings:hn,settings:yn,register:wn,logout:bn,comments:xn,error:Tn,following:En,followers:Sn,navigation:Ln,visitUser:Mn,send:Pn,name:Hn,changeName:Nn,changeNameSuccess:In,changeNameFailed:kn,close:Rn,follow:An,unfollow:Un,editPost:Cn,deletePost:Bn,deletePostSure:_n,deletePostSuccess:Fn,deletePostFailed:On,continue:$n,abort:Wn,edited:Vn,actionComment:jn,deleteComment:Gn,showPostMenu:zn,save:Kn,removeImage:qn,uploadImage:Jn,deleteAccount:Zn,deleteAccountSure:Yn,deleteAccountInfo:Xn,authError:Qn,progressiveWebApp:Dn,followingError:eo,unsupportedFileType:to,clickToCopy:ro,username:no,email:oo,password:io,currentPassword:so,passwordChangedSuccess:ao,passwordChangedFailed:lo,changePassword:co,changePasswordTitle:uo,passwordReEnter:mo,newPassword:po,newPasswordReEnter:fo,loginSuccess:go,loginSuccessMessage:vo,loginFailed:ho,loginFailedMessage:yo,logoutMessage:wo,registerSuccess:bo,registerFailed:xo,passwordsNotSame:To,showPostPreview:Eo,nUsersLikedThat:So,showComments:Lo,routeNotFound:Mo,messageTooShort:Po,messageTooLong:Ho,messageWrongLength:No,messageCriteriaError:Io,alreadyAccount:ko,enterAccount:Ro,createAccount:Ao,loginReason:Uo,noAccount:Co,secondsAgo:Bo,secondAgo:_o,minutesAgo:Fo,minuteAgo:Oo,hoursAgo:$o,hourAgo:Wo,daysAgo:Vo,dayAgo:jo,weeksAgo:Go,weekAgo:zo,monthsAgo:Ko,monthAgo:qo,yearsAgo:Jo,yearAgo:Zo};function oe(e){let t=Math.floor((Date.now()-e)/1e3),r;return r=Math.floor(t/31536e3),r==1?a.yearAgo:r>1?q(a.yearsAgo,r):(r=Math.floor(t/2592e3),r==1?a.monthAgo:r>1?q(a.monthsAgo,r):(r=Math.floor(t/604800),r==1?a.weekAgo:r>1?q(a.monthsAgo,r):(r=Math.floor(t/86400),r==1?a.dayAgo:r>1?q(a.daysAgo,r):(r=Math.floor(t/3600),r==1?a.hourAgo:r>1?q(a.hoursAgo,r):(r=Math.floor(t/60),r==1?a.minuteAgo:r>1?q(a.minutesAgo,r):(r=Math.floor(t),r==1?a.secondAgo:q(a.secondsAgo,r)))))))}function q(e,t){return e.replace("$n",t+"")}function $(e){const{top:t,bottom:r}=e.getBoundingClientRect();return(t&&r)===0?!1:t<innerHeight&&r>=0}const de=d(!1);function W(e){return history.pushState(null,"",e),dispatchEvent(new PopStateEvent("popstate"))}const Ke=d(!1),V=d([]);V.subscribe(e=>Ke.set(e.length>0));w("isBox",e=>e.classList.add("box"));function h(e,...t){return e||(e={}),n.h("div",g(g({},e),{isBox:!0}),e.arrow?n.h("div",{className:"arrow arrow-"+e.arrow}):void 0,n.h("div",{className:"box-content"},t))}w("isLabel",e=>e.classList.add("label"));function M(e,...t){return n.h("div",g(g({},e),{isLabel:!0}),n.h("label",{className:"label-content"},e.labelText),t)}w("isButton",e=>e.classList.add("button"));function x(e,...t){return e||(e={}),n.h("button",g(g({},e),{isButton:!0}),n.h("div",{className:"button-content"},t))}w("isHeader",e=>e.classList.add("header"));function T(e,...t){return e||(e={}),n.h("header",g(g({},e),{isHeader:!0}),n.h("div",{className:"title header-content"},t),n.h(C,null))}w("isFooter",e=>e.classList.add("footer"));function k(e,...t){return e||(e={}),n.h("footer",g(g({},e),{isFooter:!0}),n.h(C,null),n.h("div",{className:"footer-content"},t))}function P(e){return n.h("div",{className:"input"},n.h("input",g({},e)))}function qe(e){return n.h("div",{className:"input"},n.h("textarea",g({},e)))}function C(){return n.h("span",{className:"seperator"})}function U(r){var{name:e}=r,t=ke(r,["name"]);let o="icon icon-",i="icon-"+e;e&&(o+=e),t.className&&(o+=" "+t.className,delete t.className);const s=n.h("i",g({className:o,setIcon:c},t));return s;function c(u){s.classList.replace(i,"icon-"+u),i="icon-"+u}}function Pt({placeholder:e,value:t,ref:r},...o){const i=v(),s=v(),c=d(!1);return n.h("div",{className:"box writer",getValues:m,ref:r,clear:u},n.h("div",null,n.h(qe,{ref:i,oninput:p,placeholder:e||"",value:t||""}),n.h("span",{tooltip:a.showPostPreview},n.h(U,{name:"magnifier",className:"toggle-post-preview",onclick:R,styles:{cursor:"pointer"}}))),n.h(k,null,n.h("div",{className:"mark-down-wrapper",if:c},n.h("div",{className:"box mark-down",ref:s}),n.h(C,null)),o));function u(){i.current.value="",s.current.innerHTML="",c.set(!1)}function m(){const S=s.current,N=i.current;if(S&&N)return{raw:N.value,rich:S.innerHTML}}function p(){const S=s.current,N=i.current;S&&N&&(S.innerHTML=pe(N.value))}function R(){c.set(!c.value())}}function Ee(r){var{datetime:e}=r,t=ke(r,["datetime"]);const o=d(oe(e)),i=n.h("time",g({dateTime:e,innerText:o,interval:[s,5e3]},t));function s(){$(i)&&o.set(oe(e))}return i}w("isUploadItem",e=>e.classList.add("upload-item"));function Ht(e){return n.h("div",g(g({},e),{isUploadItem:!0}),n.h("img",{src:e.preview,className:"upload-image"}),n.h("div",{className:"upload-text"},e.fileName),n.h("div",null,n.h(U,{name:"clipboard",copyToClipboard:`![${e.fileName}](${e.preview})`,className:"upload-action"}),n.h(U,{tooltip:a.removeImage,name:"x-red",onclick:t,className:"upload-action"})));function t(){V.update(r=>{let o=r.findIndex(i=>i.key===e.key);o>=0&&r.splice(o,1)})}}w("isMenu",e=>e.classList.add("menu"));function Je(e,...t){return n.h("ul",g(g({},e),{isMenu:!0,isBox:!0}),t)}w("isMenuItem",e=>e.classList.add("menu-item"));function Ze(e,...t){return n.h("li",g(g({},e),{isMenuItem:!0}),t)}function Ye(e,t){return e-=50,t-=50,e<0&&(e=0),innerHeight-e<200&&(e=innerHeight-200),[e,t]}const Nt=v();function y(e,t,r={removeOnClick:!1,timeout:5e3}){const o=Nt.current;o&&(o.appendChild(n.h(Yo,{title:e,message:t,options:r})),o.scrollBy(0,o.scrollHeight))}function Yo({title:e,message:t,options:r}){const o=n.h(h,{className:"notification",arrow:"bottom-right"},n.h(T,{if:!!e},e||""),n.h("div",{className:"notification-message"},t));return r.timeout&&setTimeout(()=>o.remove(),r.timeout),r.removeOnClick&&O(o,"click",()=>o.remove()),o}document.body.appendChild(n.h("div",{id:"notifications"},n.h("div",{ref:Nt,className:"notification-wrapper"})));const Xe={};vt(Xe,{del:()=>ge,get:()=>B,patch:()=>Se,post:()=>J,put:()=>ei});const Xo=()=>localStorage.getItem("token"),Qo=()=>{const e=Xo(),t={"Content-Type":"application/json"};return e&&(t.Authorize="Bearer "+e,t.Authorization="Bearer "+e),t};function Do(e,t,r){var c;r||(r={}),r.responseType||(r.responseType="json");let o=((c=r.init)==null?void 0:c.headers)||{},i=g(g({},Qo()),o);for(let u in o)o[u]||delete i[u];let s={headers:i,method:e,body:t};return[r,s]}async function fe(e,t,r,o){try{let[i,s]=Do(t,r,o),c=await fetch(e,s),u=await c[i.responseType]();return[u,c,null]}catch(i){return[null,null,i]}}const B=(e,t)=>fe(e,"GET",null,t),J=(e,t,r)=>fe(e,"POST",t,r),ei=(e,t,r)=>fe(e,"PUT",t,r),ge=(e,t,r)=>fe(e,"DELETE",t,r),Se=(e,t,r)=>fe(e,"PATCH",t,r),_={removeOnClick:!0,timeout:5e3};function Qe(e){this.message=e}Qe.prototype=new Error,Qe.prototype.name="InvalidCharacterError";var It=typeof window!="undefined"&&window.atob&&window.atob.bind(window)||function(e){var t=String(e).replace(/=+$/,"");if(t.length%4==1)throw new Qe("'atob' failed: The string to be decoded is not correctly encoded.");for(var r,o,i=0,s=0,c="";o=t.charAt(s++);~o&&(r=i%4?64*r+o:o,i++%4)?c+=String.fromCharCode(255&r>>(-2*i&6)):0)o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(o);return c};function ti(e){var t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw"Illegal base64url string!"}try{return function(r){return decodeURIComponent(It(r).replace(/(.)/g,function(o,i){var s=i.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}(t)}catch(r){return It(t)}}function Le(e){this.message=e}function ri(e,t){if(typeof e!="string")throw new Le("Invalid token specified");var r=(t=t||{}).header===!0?0:1;try{return JSON.parse(ti(e.split(".")[r]))}catch(o){throw new Le("Invalid token specified: "+o.message)}}Le.prototype=new Error,Le.prototype.name="InvalidTokenError";var kt=ri;const ni="",oi=1,j=`${ni}/api/v${oi}`,Z="accounts",Me=j+"/users/",Rt=Me+"follow/",ii=j+`/${Z}`,si=j+`/${Z}/login`,ai=j+`/${Z}/register`,li=j+`/${Z}/token`,ci=j+`/${Z}/displayname`,ba=j+`/${Z}/email`,ui=j+`/${Z}/password`,f=d(!1),Y=d(!0);let ve={};const mi=f.value,ie=()=>mi()?ve:null,At=async e=>!!await Pe(e);async function Ut(){f.set(!1),localStorage.removeItem("token"),y(null,a.logoutMessage,_),W("/login")}async function Bt({alias:e,password:t}){var s;let r=JSON.stringify({username:e,password:t}),[o,i]=await J(si,r);(i==null?void 0:i.status)===200&&((s=o==null?void 0:o.data)==null?void 0:s.accessToken)?(Ct(o.data.accessToken),f.set(!0),y(null,a.loginSuccessMessage,_)):(f.set(!1),y(null,a.loginFailedMessage,_))}async function _t(e){let[t,r]=await J(Rt+e);return(r==null?void 0:r.status)===2e3}async function Ft(e){let[t,r]=await ge(Rt+e);return(r==null?void 0:r.status)===2e3}async function Ot(e){let[t]=await B(Me+`${e}/followers`);return(t==null?void 0:t.data)&&t.data.length?t.data:[]}async function $t(e){let[t]=await B(Me+`${e}/following`);return(t==null?void 0:t.data)&&t.data.length?t.data:[]}async function Wt(e){let t=JSON.stringify({displayName:e}),[r,o]=await Se(ci,t);return(o==null?void 0:o.status)===200?(y(null,a.changeNameSuccess,_),ve.alias=e,ve.displayName=e,!0):(y(null,a.changeNameFailed,_),!1)}async function Vt(e,t){let r=JSON.stringify({currentPassword1:e,newPassword:t}),[o,i]=await Se(ui,r);return(i==null?void 0:i.status)===200?(y(null,a.passwordChangedSuccess,_),!0):(y(null,a.passwordChangedFailed,_),!1)}async function jt(){let[e,t]=await ge(ii,"{}");return(t==null?void 0:t.status)===200?(f.set(!1),localStorage.removeItem("token"),W("/register"),!0):!1}async function pi(){var t;let e=Gt();if(e){const r=(e.exp-Math.round(Date.now()/1e3))/3600;if(r<=24){let[o,i]=await B(li);((t=o==null?void 0:o.data)==null?void 0:t.accessToken)&&Ct(o.data.accessToken),f.set((i==null?void 0:i.status)===200)}else f.set(!0)}else f.set(!1)}async function zt({alias:e,displayName:t,email:r,password:o}){let i=JSON.stringify({email:r,username:e,password:o,displayName:t}),[s,c]=await J(ai,i);(c==null?void 0:c.status)===200?(y(null,a.registerSuccess,_),W("/login")):y(null,a.registerFailed,_)}f.subscribe(async e=>{var t;if(Y.set(!e),e===!1&&(ve={}),e===!0){const r=(t=Gt())==null?void 0:t.sub;ve=await Pe(r)}});function Ct(e){localStorage.setItem("token",e)}async function Pe(e){let[t,r]=await B(Me+e);return(r==null?void 0:r.status)!==200?void 0:t.data}function Gt(){const e=localStorage.getItem("token");if(e)return kt(e)}pi();const Kt={black:"#17111a",darkRed1:"#372538",darkRed2:"#7a213a",red:"#e14141",lightRed:"#ffa070",brownish:"#c44d29",orange:"#ffbf36",yellow:"#fff275",darkBrown:"#753939",brown:"#cf7957",lightBrown:"#ffd1ab",darkGreen:"#39855a",green:"#83e04c",lightGreen:"#dcff70",darkBlue:"#243b61",blue:"#3898ff",lightBlue:"#6eeeff",violet:"#682b82",magenta:"#bf3fb3",pink:"#ff80aa",darkGrey1:"#3e375c",darkGrey2:"#7884ab",grey:"#b2bcc2",white:"#ffffff"},di=Object.keys(Kt);function se(){const e=Math.round(Math.random()*24+1);return Kt[di[e]]}const De=ue(fi),gi=()=>document.getElementById("user-card");De.onClose(()=>{var e;return(e=gi())==null?void 0:e.remove()});async function fi({alias:e,top:t,left:r}){var dt;[t,r]=Ye(t,r);let o=ie().username,i=await Pe(e);const s=d(0),c=d(0),u=d(!1),m=d(!0);return u.subscribe(ee=>m.set(!ee)),N(),Ie(),n.h(h,{styles:{top:`${t}px`,left:`${r}px`},id:"user-card",onmouseleave:De.close},n.h(T,null,n.h("div",{styles:{display:"flex",gap:"8px",alignItems:"center"}},n.h("div",{className:"user-image-wrap"},n.h("div",{className:"user-image",styles:{backgroundColor:se()+" !important"}}),n.h("div",{className:"avatar-circle"})),n.h("a",{href:`/user/${e}`,tooltip:a.visitUser.replace("$u",i.displayName),styles:{flex:"1"}},n.h("div",null,i.displayName),n.h("div",null,"@",i.username)),e===o?void 0:n.h(p,null)),n.h(C,null),n.h("div",{styles:{display:"flex",gap:"8px"}},n.h("div",null,a.followers,": ",s),n.h("div",null,a.following,": ",c))),n.h(h,{arrow:"top-left",if:((dt=i.description)==null?void 0:dt.length)>0},n.h("span",null,i.description)));function p(){return n.h("div",{className:"cursor-pointer"},n.h("div",{if:f},n.h(U,{if:m,tooltip:a.follow,name:"user-follow",onclick:R}),n.h(U,{if:u,tooltip:a.unfollow,name:"user-unfollow",onclick:S})))}async function R(){await _t(i.username),await N(),await Ie()}async function S(){await Ft(i.username),N(),Ie()}async function N(){let ee=await Ot(e);s.set(ee.length),u.set(!!ee.find(lr=>lr.username===o))}async function Ie(){let ee=await $t(e);c.set(ee.length)}}var He=De;const X=document.createElement("textarea");document.body.appendChild(X);qt();async function et(e){let t;try{X.value=e,hi(),vi()}catch(r){t=r}finally{return qt(),t}}function vi(){X.select(),X.setSelectionRange(0,X.value.length),document.execCommand("copy")}function qt(){X.setAttribute("hidden","true")}function hi(){X.removeAttribute("hidden")}w("user-card",(e,t)=>O(e,"mouseenter",r=>{He.open({alias:t,top:r.clientY,left:r.clientX})}));w("copyToClipboard",(e,t)=>{n.setProperties(e,{tooltip:a.clickToCopy.replace("$c",typeof t=="function"?t():t)}),O(e,"click",()=>{let r;typeof t=="function"?r=t():typeof t=="string"&&(r=t),r&&et(r)})});w("tooltip",(e,t)=>{e.classList.add("tooltip"),e.appendChild(n.createElement("span",{className:"tooltip-text"},t))});w("routerLink",(e,t)=>O(e,"click",()=>W(t)));function tt({routes:e}){const t=n.h("div",{id:"router"});return Tt({routes:e,target:t}).onLoad(()=>de.set(!0)).onLoadEnd(()=>de.set(!1)),t}function rt(){return n.h(h,{id:"navigation"},n.h(T,{classList:"hide-mobile"},a.navigation),n.h("div",{className:"list"},n.h("a",{href:"/"},a.home),n.h("a",{if:Y,href:"/login"},a.login),n.h("a",{if:Y,href:"/register"},a.register),n.h("a",{if:f,href:"/settings"},a.settings),n.h("a",{if:f,onclick:Ut},a.logout)))}const yi="",wi=1,ae=`${yi}/api/v${wi}/posts`,nt=ae+"/",bi=ae+"/like/",G=d([]),Q=e=>G.value().find(t=>t.id===e),Jt=async e=>!!await ot(e),le=(e,t)=>t.datePosted-e.datePosted;async function he(e=null,t=1,r=50){let o=[];e&&o.push(`Username=${e}`),t&&o.push(`Page=${t}`),r&&o.push(`Size=${r}`);let i=o.join("&");i.length>0&&(i="?"+i);let[s,c]=await B(ae+i);if(![200,204].includes(c==null?void 0:c.status))return;(s==null?void 0:s.data)&&G.set(s.data)}async function ot(e){let[t,r]=await B(nt+e);if([200,204].includes(r==null?void 0:r.status))return Q(t.data.id)||G.value().push(t.data),t.data}async function Zt(e){const t=JSON.stringify({content:e});let[r,o]=await J(ae,t);return(o==null?void 0:o.status)===200}async function Yt(e){let[t,r]=await ge(nt+e);return[200,204].includes(r==null?void 0:r.status)?(y(null,a.deletePostSuccess),G.update(o=>{const i=o.findIndex(s=>s.id===e);i>=0&&o.splice(i,1)})):y(null,a.deletePostFailed),(r==null?void 0:r.status)===204}async function Xt(e){let t=Q(e),r=t.liked?"del":"post",[o,i]=await Xe[r](bi+e,"{}");if(i.status!==200)return!1;let[s,c]=await B(nt+e);return c.status!==200?!1:(xi(e,s.data),!0)}function xi(e,t){let r=Q(e);if(r)for(let o in t)r[o]=t[o]}async function Qt(e){var r;let[t]=await B(ae+"/"+e+"/comments");return((r=t==null?void 0:t.data)==null?void 0:r.length)?t.data:[]}async function Dt(e,t){let r=JSON.stringify({content:t}),[o,i]=await J(ae+"/"+e+"/comments",r);return(i==null?void 0:i.status)===200}const Ja=document.createElement("a"),Ne=new FileReader;function er(e){return new Promise(t=>{try{let r=document.createElement("input");r.accept=e.accept,r.type="file",r.onchange=o=>{let i=o.target.files;if(!i.length)return t([null,null]);let s=i[0];Ne.onload=c=>{if(e.maxSize&&s.size>e.maxSize)return t([null,new Error("Filesize exceeded")]);s.data=c.target.result,t([s,null])},Ne.onerror=()=>t([null,null]),Ne.onabort=()=>t([null,null]),Ne["readAs"+e.readAs](s)},r.click()}catch(r){t([null,r])}})}function tr({postId:e}){const t=v(),r=d([]),o=d(!1);return s(),n.h("div",{interval:[s,3e4]},n.h("div",{if:f},n.h(C,null),n.h("form",{onsubmit:i,styles:{display:"flex",gap:"8px",flexDirection:"column"}},n.h(qe,{ref:t}),n.h(x,{type:"submit",styles:{width:"max-content"}},a.actionComment))),n.h("div",{if:o},n.h(C,null),n.h("div",{className:"comments",for:{of:r,do:Ti,sort:le}})));async function i(c){c.preventDefault();const u=t.current.value;if(!f.value()){y(null,a.authError);return}if(!u||u.length<4)return y(null,a.messageCriteriaError);let m=await Dt(e,u);m&&(t.current.value="",s())}function s(){Qt(e).then(c=>{r.set(c),o.set(c.length>0)})}}function Ti(e){var r;const t=((r=ie())==null?void 0:r.username)===e.user.alias;return n.h("div",{className:"comment"},n.h("div",{className:"comment-flex",styles:{flexDirection:t?"row-reverse":"row"}},n.h("div",{className:"user-image","user-card":e.user.alias,styles:{backgroundColor:se()+" !important"}}),n.h(h,{arrow:t?"top-right":"top-left"},n.h("div",{className:"top"},n.h("div",{className:"comment-author"},e.user.alias),n.h(Ee,{datetime:e.datePosted*1e3,className:"datetime"})),n.h("div",null,e.textContent))))}function D(e){const t=d("post opacity-0"),r=ue(i),o=ue(s);return n.h("div",{className:t,interval:[c,250]},n.h("div",{styles:{display:"flex",gap:"8px"}},n.h("div",null,n.h("div",{className:"user-image-wrap","user-card":e.user.alias},n.h("div",{className:"user-image",styles:{backgroundColor:se()+" !important"}}),n.h("div",{className:"avatar-circle"}))),n.h(h,{className:"post-content",arrow:"top-left"},n.h(T,null,n.h("div",{className:"wrap-ellipsis",styles:{width:"50%"}},e.user.displayName,n.h("span",{className:"user-alias"},"@",e.user.alias)),n.h("div",{className:"datetime"},n.h(Ee,{datetime:e.datePosted*1e3,className:"hide-mobile"}),n.h("span",{if:e.datePosted!==e.dateEdited,tooltip:a.edited},"*"),n.h(U,{name:"calendar",tooltip:oe(e.datePosted*1e3)}))),n.h("div",{className:"user-content"},n.h(Ei,{postId:e.id,data:e.textContent})),n.h(k,null,n.h("div",{styles:{display:"flex",gap:"8px",alignItems:"center"}},n.h(Si,{likeAmount:e.likeAmount,postId:e.id}),n.h(Li,{userAlias:e.user.alias,postId:e.id,commentsAmount:e.commentsAmount}),n.h("div",{className:"post-menu",tooltip:a.showPostMenu},n.h(U,{if:f,name:"menu-meatballs",onclick:r.open})),n.h("span",{styles:{position:"absolute",bottom:"0",right:"0"}},n.h("div",{portal:r}),n.h("div",{portal:o})))),e.showComments?n.h(tr,{postId:e.id}):void 0)));function i(){var p;const m=((p=ie())==null?void 0:p.username)===e.user.alias;return n.h(Je,{onmouseleave:r.close},n.h(Ze,null,n.h("a",{href:`/user/${e.user.alias}/post/${e.id}`},a.comments)),n.h(Ze,{if:m,onclick:o.open},a.deletePost))}function s(){return n.h(Je,{onmouseleave:u},n.h(T,null,a.deletePostSure),n.h("div",{styles:{margin:"0 auto",width:"max-content"}},n.h("div",{styles:{display:"flex",gap:"8px"}},n.h(x,{onclick:()=>Yt(e.id)},a.continue),n.h(x,{onclick:u},a.abort))))}function c(m){t.set(`post opacity-${$(m)?"1":"0"}`)}function u(){o.close(),r.open(null)}}function Ei({postId:e,data:t}){const r=d(t),o=d("");return r.subscribe(s=>o.set(pe(s))),n.h(h,{className:"text-content",interval:[i,1e4]},n.h("div",{innerHTML:o,className:"mark-down"}));function i(s){if(!$(s))return;let c=Q(e);if(!c)return;r.set(c.textContent)}}function Si({likeAmount:e,postId:t}){const r=d(String(e)),o=v();return n.h("div",{className:"heart-action",styles:{display:"flex",gap:"8px",alignItems:"center"},if:f,mount:i,interval:[i,250],tooltip:[r,a.nUsersLikedThat]},n.h(U,{ref:o,name:"heart-grey",onclick:()=>Xt(t),className:"wiggle-vertical",styles:{cursor:"pointer"}}),n.h("span",null,r));function i(s){if(!$(s)&&f.value())return;let c=Q(t);if(!c)return;r.set(String(c.likeAmount)),o.current.setIcon(c.liked?"heart-red":"heart-grey")}}function Li({userAlias:e,postId:t,commentsAmount:r}){const o=d(String(r));return n.h("a",{href:`/user/${e}/post/${t}`,className:"comment-action",tooltip:a.showComments,interval:[i,250]},n.h("div",{styles:{display:"flex",gap:"8px",alignItems:"center"}},n.h(U,{name:"comment-bubbles-grey",className:"post-comment"}),n.h("span",null,o)));function i(s){if(!$(s)&&f.value())return;let c=Q(t);if(!c)return;o.set(String(c.commentsAmount))}}async function rr(e){try{const t=e.split(";base64,"),r=t[0].split(":")[1],o=atob(t[1]),i=o.length,s=new Uint8Array(i);for(let c=0;c<i;++c)s[c]=o.charCodeAt(c);return[new Blob([s],{type:r}),null]}catch(t){return[null,t]}}const Mi="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";function nr(){return Mi.replace(/[xy]/g,e=>{let t=Math.random()*16|0,r=e==="x"?t:t&3|8;return r.toString(16)})}async function it(){return await he(),n.h("div",{styles:{display:"flex",flexDirection:"column",gap:"8px"}},n.h("div",{if:f},n.h(Pi,null)),n.h("div",{for:{of:G,do:D,sort:le,limit:5}}))}function Pi(){const e=v();return n.h("form",{onsubmit:o,destroy:()=>V.set([])},n.h(Pt,{ref:e},n.h("div",{styles:{display:"flex",gap:"8px"}},n.h(x,{type:"submit"},a.send),n.h(x,{type:"button",onclick:t},a.uploadImage)),n.h("div",{if:Ke},n.h(C,null),n.h("div",{styles:{display:"flex",flexDirection:"column-reverse",gap:"8px"},for:{of:V,do:i=>n.h(Ht,{key:i.key,preview:i.preview,fileName:i.fileName})}}))));async function t(){let[i,s]=await er({accept:"image/*",readAs:"DataURL",maxSize:5242880}),[c]=await rr(i.data);if(s)return y(null,a.followingError.replace("$e",s.message));if(!i.type.startsWith("image/"))return y(null,a.unsupportedFileType.replace("$t",i.type));V.update(u=>{u.push({key:nr(),fileName:i.name,preview:i.data,data:c})})}function r(){return{text:e.current.getValues().raw}}async function o(i){if(i.preventDefault(),!f.value())return y(null,a.authError),!1;const s=r();if(!s.text)return y(null,a.messageCriteriaError);let c=await Zt(s.text);c&&(e.current.clear(),V.set([]),he())}}var or=`Durch die Installation dieser Anwendung werden einige Inhalte (wie z. B. Grafiken) lokal auf dem Ger\xE4t hinterlegt, damit diese
  nicht mehr heruntergeladen werden m\xFCssen, wenn Sie diese Seite wieder besuchen.`;const z=d(!1),st=d(!0);z.subscribe(e=>st.set(!e));async function ir(){"serviceWorker"in navigator&&(await navigator.serviceWorker.register("serviceworker.js"),z.set(!0))}async function sr(){if("serviceWorker"in navigator){let e=await navigator.serviceWorker.getRegistrations();for(let t of e)t&&t.unregister()}z.set(!1)}"serviceWorker"in navigator&&navigator.serviceWorker.getRegistration("serviceworker.js").then(e=>{e&&e.active?z.set(!!e.active):z.set(!1)}).catch(()=>z.set(!1));async function at(){return n.h("div",{id:"settings",styles:{display:"flex",flexDirection:"column",gap:"8px"}},n.h(Hi,null),n.h(ki,null),n.h(Ii,null),n.h(Ni,null))}function Hi(){const e={changed:d(!1),reference:v()};return n.h(h,null,n.h(T,null,a.changeName),n.h(M,{labelText:a.name},n.h(P,{ref:e.reference,type:"text",placeholder:a.name,oninput:()=>e.changed.set(!!e.reference.current.value)})),n.h("div",{if:e.changed},n.h(k,null,n.h(x,{type:"button",onclick:t},a.save))));async function t(){let r=await Wt(e.reference.current.value);r&&(e.reference.current.value="")}}function Ni(){return n.h(h,null,n.h(T,null,a.progressiveWebApp),n.h(h,null,or),n.h(k,null,n.h(x,{if:st,onclick:ir},a.installApp),n.h(x,{if:z,onclick:sr},a.uninstallApp)))}function Ii(){const e=d(!1);return n.h(h,null,n.h(T,null,a.deleteAccount),n.h(h,null,a.deleteAccountInfo),n.h(k,null,n.h(x,{type:"button",onclick:()=>e.set(!e.value())},a.deleteAccount),n.h(x,{type:"button",onclick:()=>jt(),if:e},a.continue)))}function ki(){const e={changed:d(!1),changable:d(!1),references:[v(),v(),v()]};return n.h(h,null,n.h(T,null,a.changePasswordTitle),n.h(M,{labelText:a.currentPassword},n.h(P,{name:"password",ref:e.references[0],type:"password",placeholder:"********",oninput:t})),n.h("div",{styles:{display:"flex",flexDirection:"row",gap:"8px"}},n.h(M,{labelText:a.newPassword},n.h(P,{name:"password",ref:e.references[1],type:"password",placeholder:"********",oninput:t})),n.h(M,{labelText:a.newPasswordReEnter},n.h(P,{name:"password",ref:e.references[2],type:"password",placeholder:"********",oninput:t}))),n.h("div",{if:e.changable},n.h(k,null,n.h(x,{type:"button",onclick:r},a.save))));function t(o){e.changed.set(!!e.references[0].current.value),e.changable.set(e.references[0].current.value&&e.references[1].current.value&&e.references[2].current.value&&e.references[1].current.value===e.references[2].current.value)}async function r(o){let i=await Vt(e.references[0].current.value,e.references[1].current.value);i&&e.references.forEach(s=>s.current.value="")}}async function lt(){const e=v(),t=v();return n.h(h,{id:"login"},n.h(T,null,a.enterAccount),n.h("form",{onsubmit:o},n.h("div",{styles:{display:"flex",flexDirection:"column",gap:"8px"}},n.h("div",{styles:{display:"flex",gap:"8px"}},n.h(M,{labelText:a.username},n.h(P,{ref:e,type:"text",placeholder:a.username,required:"true"})),n.h(M,{labelText:a.password},n.h(P,{ref:t,type:"password",placeholder:"********",required:"true"}))),n.h(k,null,n.h("div",{styles:{display:"flex",flexDirection:"row",gap:"8px"}},n.h(x,{type:"submit"},a.login),n.h("a",{href:"/register"},n.h(x,{type:"button"},a.noAccount)))))));function r(){return{alias:e.current.value,password:t.current.value}}async function o(i){i.preventDefault(),await Bt(r()),f.value()&&W("/")}}async function ct({alias:e}){return await he(e),n.h("div",{for:{of:G,do:D,sort:le}})}async function ut({alias:e,id:t}){const r=await ot(parseInt(t));return n.h(D,{id:r.id,user:r.user,textContent:r.textContent,liked:r.liked,likeAmount:r.likeAmount,datePosted:r.datePosted,dateEdited:r.dateEdited,showComments:!0})}async function mt(){const e=v(),t=v(),r=v(),o=[v(),v()];return n.h(h,{id:"register"},n.h(T,null,a.createAccount),n.h("form",{onsubmit:c},n.h("div",{styles:{display:"flex",flexDirection:"column",gap:"8px"}},n.h("div",{styles:{display:"flex",flexDirection:"row",gap:"8px"}},n.h(M,{labelText:a.username},n.h(P,{name:"alias",ref:e,type:"text",placeholder:a.username,required:"true"})),n.h(M,{labelText:a.name},n.h(P,{name:"name",ref:t,type:"text",placeholder:a.name,required:"true"}))),n.h(M,{labelText:a.email},n.h(P,{name:"email",ref:r,type:"email",placeholder:"your@email.com",required:"true"})),n.h("div",{styles:{display:"flex",flexDirection:"row",gap:"8px"}},n.h(M,{labelText:a.password},n.h(P,{name:"password",ref:o[0],type:"password",placeholder:"********",required:"true"})),n.h(M,{labelText:a.passwordReEnter},n.h(P,{name:"password",ref:o[1],type:"password",placeholder:"********",required:"true"}))),n.h(k,null,n.h("div",{styles:{display:"flex",flexDirection:"row",gap:"8px"}},n.h(x,{type:"submit"},a.register),n.h("a",{href:"/login"},n.h(x,{type:"button"},a.alreadyAccount)))))));function i(){return{alias:e.current.value,name:t.current.value,email:r.current.value,passwords:[o[0].current.value,o[1].current.value]}}function s(){return[...new Set(i().passwords)].length===1}async function c(u){u.preventDefault();let m=i();if(!s())return y(null,a.passwordsNotSame);zt({alias:m.alias,displayName:m.name,email:m.email,password:m.passwords[0]})}}function pt(){return n.h(h,{id:"route-not-found"},n.h(T,null,a.error),n.h("div",{className:"box message"},a.routeNotFound.replace("$url",location.pathname)))}const Ri=[{path:"",title:a.home,component:it},{path:"login/?*",title:a.login,component:lt,activates:[Y.value]},{path:"register/?*",title:a.register,component:mt,activates:[Y.value]},{path:"settings/?*",title:a.settings,component:at,activates:[f.value]},{path:"user/:alias",title:({alias:e})=>e,component:ct,activates:[({alias:e})=>At(e)],children:[{path:"post/:id",title:({alias:e,id:t})=>e+"/post/"+t,component:ut,activates:[({alias:e,id:t})=>Jt(parseInt(t))]}]},{path:"**",title:a.error,component:pt}];var ar=Ri;function Ai(){return n.h("div",{id:"app"},n.h("div",{id:"loading-bar",if:de}),n.h("div",{id:"app-grid"},n.h("aside",{id:"side"},n.h(rt,null)),n.h("main",{id:"content"},n.h(tt,{routes:ar}))),n.h("div",{styles:{height:"100vh",width:"100vw",position:"fixed",top:"0",left:"0",pointerEvents:"none"}},n.h("div",{portal:He})))}document.getElementById("app").replaceWith(n.h(Ai,null));})();