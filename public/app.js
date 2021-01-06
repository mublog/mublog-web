(()=>{var gt=Object.defineProperty,vr=Object.prototype.hasOwnProperty,ht=Object.getOwnPropertySymbols,gr=Object.prototype.propertyIsEnumerable,g=Object.assign,hr=e=>gt(e,"__esModule",{value:!0}),ke=(e,t)=>{var r={};for(var o in e)vr.call(e,o)&&t.indexOf(o)<0&&(r[o]=e[o]);if(e!=null&&ht)for(var o of ht(e))t.indexOf(o)<0&&gr.call(e,o)&&(r[o]=e[o]);return r},yt=(e,t)=>{hr(e);for(var r in t)gt(e,r,{get:t[r],enumerable:!0})};const n={};yt(n,{appendChildren:()=>ie,createElement:()=>Fe,h:()=>Tr,render:()=>q,setProperties:()=>Te});const ue="string",ne="number",oe="function",wt="boolean";function A(e,...t){if(!e||e.length===0)return;let r=0;const o=e.length;for(r;r<o;r++)e[r](...t)}function C(){return Object.create(null)}function Re(e,t){return e.push(t),()=>yr(e,t)}function yr(e,t){const r=e.indexOf(t);r!==-1&&e.splice(r,1)}function bt(e){let t;for(let r=0,o=e.length;r<o;r++)t=Math.imul(31,t)+e.charCodeAt(r)|0;return t.toString(36)}function Ce(e,{sort:t,filter:r,limit:o,offset:i}){let s=[...e];return r&&(s=s.filter(r)),t&&(s=s.sort(t)),typeof i===ne&&(s=s.slice(0,i)),typeof o===ne&&(s.length=o),s}function ye(e){let t=[];for(let r in e)t.push(r);return t}function H(e,t,r){let o=e[E][t]||(e[E][t]=[]);return Re(o,r)}const E=Symbol("Hooks"),we=Symbol("Mount"),L=Symbol("Destroy"),_=Symbol("Events"),be=Symbol("Styles"),xe=C();function Ue(e,t){window[E]||(window[E]=C(),window[E][_]||(window[E][_]=C()));let r=window[E][_][e]||(window[E][_][e]=[]),o=i=>A(r,i);return r.push(t),r.length===1&&xt(window,e,o),()=>{const i=r.indexOf(t);i!==-1&&(r.splice(i,1),r.length===0&&Tt(window,e,o))}}function O(e,t,r){let o=e[E][_][t]||(e[E][_][t]=[]),i=s=>A(o,s);o.push(r),o.length===1&&xt(e,t,i),H(e,L,()=>{const s=o.indexOf(r);s!==-1&&(o.splice(s,1),o.length===0&&Tt(e,t,i))})}function xt(e,t,r){e.addEventListener(t,r,!1)}function Tt(e,t,r){e.removeEventListener(t,r,!1)}function Te(e,t){const r=ye(t);r.forEach(o=>{const i=xe[o];i?i(e,t[o]):wr(e,o,t[o])})}function wr(e,t,r){if(r===void 0)return;if(r.subscribe){let o=r;e[t]=o.value(),H(e,L,o.subscribe(i=>{e[t]!==i&&(e[t]=i)}))}else t.startsWith("on")&&typeof r===oe?O(e,t.slice(2),r):e[t]=r}function q(e,...t){e.innerHTML="",ie(e,t,e)}function ie(e,t,r){let o=Et();const i=t.length;if(i>0){for(let s=0;s<i;s++){if(t[s]===void 0)continue;if(t[s]===null)continue;if(Array.isArray(t[s]))ie(o,t[s],r);else if(typeof t[s]===ue||typeof t[s]===ne)o.appendChild(Be(t[s]));else if(t[s]instanceof Element)o.appendChild(t[s]);else if(t[s].subscribe){let c=t[s].value();if(typeof c===ue||typeof c===ne){let u=t[s],m=Be(u.value());o.appendChild(m),H(r,L,u.subscribe(p=>{let R=p+"";m.textContent!==R&&(m.textContent=R)}))}else if(c instanceof Element){let u=t[s];o.appendChild(u.value()),H(r,L,u.subscribe(m=>{u.value().replaceWith(m)}))}}}e.appendChild(o)}}function xr(e){let t=document.createElement(e);return br(t),t}const Be=e=>document.createTextNode(e+""),Et=()=>document.createDocumentFragment();function br(e){e[E]=C(),e[E][we]=[],e[E][L]=[],e[E][_]=C()}function Fe(e,t,...r){if(typeof e===oe)return e(t,...r);let o=xr(e);return Te(o,t),ie(o,r,o),o}const Tr=Fe;function d(e){let t=e;const r=[],o={isObservable:!0,set:i,subscribe:u,update:s,value:c};function i(m){return t=m,A(r,t),o}function s(m){return m(t),A(r,t),o}function c(){return t}function u(m){return m(t),Re(r,m)}return o}function h(){let e;const t={isRef:!0,current:e};return t}function me(e){let t,r;const o=[],i=[],s={isPortal:!0,open:c,close:m,set:u,onOpen:p,onClose:R};async function c(S,...I){r?(m(),c(S,...I)):(r=await e(S,...I),t.appendChild(r),A(o))}function u(S){return t=S,s}function m(){return r&&(r.remove(),r=void 0,A(i)),s}function p(S){return o.push(S),s}function R(S){return i.push(S),s}return s}const Er=/\*/g,Sr=/\:([a-zA-Z]+)/gi,Lr="(?<$1>[^\\/\\:\\?]+?)",Mr="^/",Pr="/?$",Hr="(\\S+)?",Nr=/\S+/i,Ir=/\/\//g,Ar="/",kr=/(\*\*)+/g,Rr="**";function _e(e){if(e.startsWith("/"))throw new Error("RoutePath cannot start with an '/'");if(e.endsWith("/"))throw new Error("RoutePath cannot end with an '/'");return e==="**"?Nr:(e=e.replace(Er,Hr),e=e.replace(Sr,Lr),e=e.replace(Ir,Ar),e=e.replace(kr,Rr),new RegExp(Mr+e+Pr))}function Oe(e){let t=[],r=0;for(;e[r];){let{component:o,path:i,title:s,children:c,activates:u}=e[r],m=_e(i);u=[...new Set(u)],t.push({title:s,matcher:m,component:o,activates:u}),c&&e.splice(r+1,0,...c.map(p=>(p.activates&&u?p.activates=[...u,...new Set(p.activates)]:u&&(p.activates=u),p.path=i+"/"+p.path,p))),r++}return t}async function $e(e,t){if(e)try{for(let r of e)if(await r(t)!==!0)return!1}catch(r){return console.error(r),!1}return!0}function We(e,t){let r=e.exec(t);return r.groups?g({},r.groups):Object.create(null)}async function Ve(e,t){let r=0;for(;e[r];){let o=e[r];if(!o.matcher.test(t)){r++;continue}o.params=We(o.matcher,t);let i=await $e(o.activates,o.params);if(i)return o;r++;continue}}async function je(e,t){let r=await Ve(e,t);if(!r)return;let{component:o,title:i,params:s}=r,c="";i&&(typeof i===oe?c=i(s):typeof i===ue&&(c=i));let u=await o(s);return{title:c,params:s,component:u}}async function ze(e,t,r){t.title&&(document.title=t.title),history.replaceState(t.params,document.title,r),q(e,t.component)}function Ge(){return location.pathname+location.search+location.hash}function St({target:e,routes:t}){const r=Oe(t),o={load:[],loadEnd:[],loadError:[]},i={onLoad:c,onLoadEnd:u,onLoadError:m};async function s(){let p=Ge();A(o.load);let R=await je(r,p);R?ze(e,R,p):A(o.loadError),A(o.loadEnd)}function c(p){return o.load.push(p),i}function u(p){return o.loadEnd.push(p),i}function m(p){return o.loadEnd.push(p),i}return s(),Ue("popstate",s),i}Ue("click",e=>{let t=e.target;for(;t;){if(t.href){e.preventDefault(),history.pushState(null,"",t.href),dispatchEvent(new PopStateEvent("popstate"));break}t=t.parentNode}});const Lt=document.createElement("style");document.head.appendChild(Lt);const Mt=Lt.sheet,pe=C();function Ke(e,t){e[be]||(e[be]=C());const r=e[be],o=[],i=[],s=ye(t);for(let c=0,u=s.length;c<u;c++){const m=s[c].replace(/([A-Z])/g,"-$1"),p=Cr(`${m}: ${t[s[c]]};`);r[m]?(i.push(r[m]),r[m]=p,o.push(p)):(r[m]=p,o.push(p))}e.classList.remove(...i),e.classList.add(...o)}function Cr(e){let t="r-"+bt(e),r=`.${t} { ${e} }`;return pe[t]?pe[t]!==r&&(t+="_",pe[t]=`.${t} { ${e} }`,Pt(pe[t])):(pe[t]=r,Pt(r)),t}function Pt(e){Mt.insertRule(e,Mt.rules.length)}const b=(e,t)=>xe[e]=t,Ur=(e,t)=>H(e,we,t),Ht=(e,t)=>H(e,L,t),Br=(e,t)=>{let r=setInterval(()=>t[0](e),t[1]);return H(e,L,()=>clearInterval(r))},Fr=(e,t)=>{t.isRef&&(t.current=e)},_r=(e,t)=>{t.isPortal&&t.set(e)},Or=(e,t)=>{if(typeof t===wt)t===!1&&e.setAttribute("hidden","");else if(t.subscribe){let r=t;H(e,L,r.subscribe(o=>{o===!0?e.removeAttribute("hidden"):e.setAttribute("hidden","")}))}},$r=(e,t)=>{if(t.subscribe){let r=t;H(e,L,r.subscribe(o=>Ke(e,o)))}else Ke(e,t)},Wr=(e,t)=>{let r=t.sort,o=t.filter,i=t.limit,s=t.offset,c=t.do;if(t.of){if(Array.isArray(t.of)){let u=Ce(t.of,{sort:r,filter:o,limit:i,offset:s});q(e,...u.map(c))}else if(t.of&&t.of.subscribe){let u=t.of;Ht(e,u.subscribe(m=>{let p=Ce(m,{sort:r,filter:o,limit:i,offset:s});q(e,...p.map(c))}))}}};b("styles",$r);b("if",Or);b("ref",Fr);b("portal",_r);b("mount",Ur);b("destroy",Ht);b("interval",Br);b("for",Wr);const Vr=/\![\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g,jr=/[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g,zr=/^\s*\n\`\`\`(([^\s]+))?/gm,Gr=/^\`\`\`\s*\n/gm,Kr=/(\<pre.+\>)\s*\n\<p\>(.+)\<\/p\>/gm,qr=/[\`]{1}([^\`]+)[\`]{1}/g,Jr=/^\s*(\n)?(.+)/gm,Zr=/\<(\/)?(h\d|ul|ol|li|img|pre)/,Xr=/[\*\_]{2}([^\*\_]+)[\*\_]{2}/g,Yr=/[\*\_]{1}([^\*\_]+)[\*\_]{1}/g,Qr=/[\~]{2}([^\~]+)[\~]{2}/g,Dr=/^\s*\n\*/gm,en=/^(\*.+)\s*\n([^\*])/gm,tn=/^\* (.+)/gm,rn=/^\s*\n\d\./gm,nn=/^(\d\..+)\s*\n([^\d\.])/gm,on=/^\d\. (.+)/gm,sn=/[\\#]{1} (.+)/g,an=/[\\#]{2} (.+)/g,ln=/[\\#]{3} (.+)/g,cn=/[\\#]{4} (.+)/g,un=/[\\#]{5} (.+)/g,mn=/[\\#]{6} (.+)/g,pn=/(\@[a-zA-Z0-9]+)/gmi;function w(e,t,r){return e.replace(t,r)}function de(e){return e=vn(e),e=dn(e),e=w(e,Vr,'<img loading="lazy" src="$2" alt="$1">'),e=w(e,jr,'<a target="_blank" href="$2">$1</a>'),e=fn(e),e=w(e,zr,'<pre class="$2">'),e=w(e,Gr,`</pre>

`),e=w(e,qr,"<code>$1</code>"),e=w(e,Jr,t=>Zr.test(t)?t:`<p>${t}</p>`),e=w(e,Kr,"$1$2"),e=w(e,pn,'<a href="/user/$1">$1</a>'),e}function dn(e){return e=w(e,mn,"<h6>$1</h6>"),e=w(e,un,"<h5>$1</h5>"),e=w(e,cn,"<h4>$1</h4>"),e=w(e,ln,"<h3>$1</h3>"),e=w(e,an,"<h2>$1</h2>"),e=w(e,sn,"<h1>$1</h1>"),e}function fn(e){return e=w(e,Xr,"<b>$1</b>"),e=w(e,Yr,"<i>$1</i>"),e=w(e,Qr,"<del>$1</del>"),e}function vn(e){return e=w(e,Dr,`<ul>
*`),e=w(e,en,`$1
</ul>

$2`),e=w(e,tn,"<li>$1</li>"),e=w(e,rn,`<ol>
1.`),e=w(e,nn,`$1
</ol>

$2`),e=w(e,on,"<li>$1</li>"),e}var gn="Startseite",hn="Pr\xE4sentation",yn="Allgemein",wn="Anwendung installieren",bn="Anwendung deinstallieren",xn="Installieren",Tn="Bereits installiert",En="Einloggen",Sn="Nutzereinstellungen",Ln="Einstellungen",Mn="Registrieren",Pn="Ausloggen",Hn="Kommentare",Nn="Fehler",In="Folgt",An="Follower",kn="Navigation",Rn="Besuche $u's Seite",Cn="Senden",Un="Name",Bn="Namen \xE4ndern",Fn="Name erfolgreich aktualisiert",_n="Name konnte nicht aktualisiert werden",On="Schlie\xDFen",$n="Folgen",Wn="Nicht mehr folgen",Vn="Post bearbeiten",jn="Post l\xF6schen",zn="Soll der Post gel\xF6scht werden?",Gn="Post wurde gel\xF6scht",Kn="Post konnte nicht gel\xF6scht werden",qn="Fortfahren",Jn="Abbrechen",Zn="Bearbeitet",Xn="Kommentieren",Yn="Kommentar l\xF6schen",Qn="Kommentar wurde gel\xF6scht",Dn="Kommentar konnte nicht gel\xF6scht werden",eo="Zeige Men\xFC an",to="\xC4nderungen speichern",ro="Bild entfernen",no="Bild hochladen",oo="Konto l\xF6schen",io="Konto wirklich l\xF6schen?",so="Wenn du das Konto l\xF6scht, kannst du den Vorgang nicht mehr r\xFCckg\xE4ngig machen.",ao="F\xFCr diese Aktion hast du keine Berechtigungen.",lo="Progressive Webanwendung",co="Folgender Fehler ist aufgetreten: '$e'",uo="Dateityp '$t' nicht unterst\xFCtzt.",mo="Klicken um '$c' in die Zwischenablage zu kopieren",po="Benutzername",fo="E-Mail Adresse",vo="Passwort",go="Aktuelles Passwort",ho="Dein Passwort wurde erfolgreich aktualisiert",yo="Dein Passwort konnte nicht aktualisiert werden",wo="Passwort aktualisieren",bo="\xC4ndere dein Passwort",xo="Passwort wiederholen",To="Neues Passwort",Eo="Neues Passwort wiederholen",So="Beim Hochladen ist ein Fehler aufgetreten",Lo="Erfolgreich eingeloggt",Mo="Du bist nun eingeloggt",Po="Einloggen fehlgeschlagen",Ho="Benutzer existiert nicht oder inkorrekte Eingaben",No="Du bist nun abgemeldet",Io="Erfolgreich registriert. Du kannst dich nun einloggen.",Ao="Entweder existiert der Benutzer bereits oder falsche Eingaben get\xE4tigt.",ko="Passw\xF6rter stimmen nicht \xFCberein",Ro="Vorschau",Co=" Nutzer/n gef\xE4llt das",Uo="Gehe zur Kommentarsektion",Bo="Seite '$url' nicht gefunden.",Fo="Die Nachricht ist zu kurz",_o="Die Nachricht hat die maximale L\xE4nge \xFCberschritten",Oo="Die Nachricht hat eine inkorrekte L\xE4nge",$o="So kannst du die Nachricht nicht absenden.",Wo="Du hast bereits ein Konto?",Vo="Logge dich in dein Konto ein",jo="Erstelle ein Konto",zo="Dein Grund zum Einloggen",Go="Noch kein Konto?",Ko="Vor $n Sekunden",qo="Vor einer Sekunde",Jo="Vor $n Minuten",Zo="Vor einer Minute",Xo="Vor $n Stunden",Yo="Vor einer Stunde",Qo="Vor $n Tagen",Do="Vor einem Tag",ei="Vor $n Wochen",ti="Vor einer Woche",ri="Vor $n Monaten",ni="Vor einem Monat",oi="Vor $n Jahren",ii="Vor einem Jahr",a={home:gn,presentation:hn,general:yn,installApp:wn,uninstallApp:bn,install:xn,isInstalled:Tn,login:En,userSettings:Sn,settings:Ln,register:Mn,logout:Pn,comments:Hn,error:Nn,following:In,followers:An,navigation:kn,visitUser:Rn,send:Cn,name:Un,changeName:Bn,changeNameSuccess:Fn,changeNameFailed:_n,close:On,follow:$n,unfollow:Wn,editPost:Vn,deletePost:jn,deletePostSure:zn,deletePostSuccess:Gn,deletePostFailed:Kn,continue:qn,abort:Jn,edited:Zn,actionComment:Xn,deleteComment:Yn,deleteCommentSuccess:Qn,deleteCommentFailure:Dn,showPostMenu:eo,save:to,removeImage:ro,uploadImage:no,deleteAccount:oo,deleteAccountSure:io,deleteAccountInfo:so,authError:ao,progressiveWebApp:lo,followingError:co,unsupportedFileType:uo,clickToCopy:mo,username:po,email:fo,password:vo,currentPassword:go,passwordChangedSuccess:ho,passwordChangedFailed:yo,changePassword:wo,changePasswordTitle:bo,passwordReEnter:xo,newPassword:To,newPasswordReEnter:Eo,errorOnUpload:So,loginSuccess:Lo,loginSuccessMessage:Mo,loginFailed:Po,loginFailedMessage:Ho,logoutMessage:No,registerSuccess:Io,registerFailed:Ao,passwordsNotSame:ko,showPostPreview:Ro,nUsersLikedThat:Co,showComments:Uo,routeNotFound:Bo,messageTooShort:Fo,messageTooLong:_o,messageWrongLength:Oo,messageCriteriaError:$o,alreadyAccount:Wo,enterAccount:Vo,createAccount:jo,loginReason:zo,noAccount:Go,secondsAgo:Ko,secondAgo:qo,minutesAgo:Jo,minuteAgo:Zo,hoursAgo:Xo,hourAgo:Yo,daysAgo:Qo,dayAgo:Do,weeksAgo:ei,weekAgo:ti,monthsAgo:ri,monthAgo:ni,yearsAgo:oi,yearAgo:ii};function se(e){let t=Math.floor((Date.now()-e)/1e3),r;return r=Math.floor(t/31536e3),r==1?a.yearAgo:r>1?J(a.yearsAgo,r):(r=Math.floor(t/2592e3),r==1?a.monthAgo:r>1?J(a.monthsAgo,r):(r=Math.floor(t/604800),r==1?a.weekAgo:r>1?J(a.monthsAgo,r):(r=Math.floor(t/86400),r==1?a.dayAgo:r>1?J(a.daysAgo,r):(r=Math.floor(t/3600),r==1?a.hourAgo:r>1?J(a.hoursAgo,r):(r=Math.floor(t/60),r==1?a.minuteAgo:r>1?J(a.minutesAgo,r):(r=Math.floor(t),r==1?a.secondAgo:J(a.secondsAgo,r)))))))}function J(e,t){return e.replace("$n",t+"")}function $(e){const{top:t,bottom:r}=e.getBoundingClientRect();return(t&&r)===0?!1:t<innerHeight&&r>=0}const fe=d(!1);function W(e){return history.pushState(null,"",e),dispatchEvent(new PopStateEvent("popstate"))}const qe=d(!1),V=d([]);V.subscribe(e=>qe.set(e.length>0));const Nt=h();function v(e,t,r={removeOnClick:!1,timeout:5e3}){const o=Nt.current;o&&(o.appendChild(n.h(si,{title:e,message:t,options:r})),o.scrollBy(0,o.scrollHeight))}function si({title:e,message:t,options:r}){const o=n.h(y,{className:"notification",arrow:"bottom-right"},n.h(T,{if:!!e},e||""),n.h("div",{className:"notification-message"},t));return r.timeout&&setTimeout(()=>o.remove(),r.timeout),r.removeOnClick&&O(o,"click",()=>o.remove()),o}document.body.appendChild(n.h("div",{id:"notifications"},n.h("div",{ref:Nt,className:"notification-wrapper"})));const Je={};yt(Je,{del:()=>Z,get:()=>U,patch:()=>Ee,post:()=>j,put:()=>ui});const ai=()=>localStorage.getItem("token"),li=()=>{const e=ai(),t={"Content-Type":"application/json"};return e&&(t.Authorize="Bearer "+e,t.Authorization="Bearer "+e),t};function ci(e,t,r){var c;r||(r={}),r.responseType||(r.responseType="json");let o=((c=r.init)==null?void 0:c.headers)||{},i=g(g({},li()),o);for(let u in o)o[u]||delete i[u];let s={headers:i,method:e,body:t};return[r,s]}async function ve(e,t,r,o){try{let[i,s]=ci(t,r,o),c=await fetch(e,s),u=await c[i.responseType]();return[u,c,null]}catch(i){return[null,null,i]}}const U=(e,t)=>ve(e,"GET",null,t),j=(e,t,r)=>ve(e,"POST",t,r),ui=(e,t,r)=>ve(e,"PUT",t,r),Z=(e,t,r)=>ve(e,"DELETE",t,r),Ee=(e,t,r)=>ve(e,"PATCH",t,r),It="",At=1,X=`${It}/api/v${At}/posts`,Ze=X+"/",mi=X+"/like/",Se=It+"/api/v"+At+"/media/",z=d([]),Y=e=>z.value().find(t=>t.id===e),kt=async e=>!!await Xe(e),ae=(e,t)=>t.datePosted-e.datePosted;async function ge(e=null,t=1,r=50){let o=[];e&&o.push(`Username=${e}`),t&&o.push(`Page=${t}`),r&&o.push(`Size=${r}`);let i=o.join("&");i.length>0&&(i="?"+i);let[s,c]=await U(X+i);if(![200,204].includes(c==null?void 0:c.status))return;(s==null?void 0:s.data)&&z.set(s.data)}async function Xe(e){let[t,r]=await U(Ze+e);if([200,204].includes(r==null?void 0:r.status))return Y(t.data.id)||z.value().push(t.data),t.data}async function Rt(e){const t=JSON.stringify({content:e});let[r,o]=await j(X,t);return(o==null?void 0:o.status)===200}async function Ct(e){let[t,r]=await Z(Ze+e);return[200,204].includes(r==null?void 0:r.status)?(v(null,a.deletePostSuccess),z.update(o=>{const i=o.findIndex(s=>s.id===e);i>=0&&o.splice(i,1)})):v(null,a.deletePostFailed),(r==null?void 0:r.status)===204}async function Ut(e){let t=Y(e),r=t.liked?"del":"post",[o,i]=await Je[r](mi+e,"{}");if(i.status!==200)return!1;let[s,c]=await U(Ze+e);return c.status!==200?!1:(pi(e,s.data),!0)}function pi(e,t){let r=Y(e);if(r)for(let o in t)r[o]=t[o]}async function Bt(e){var r;let[t]=await U(X+"/"+e+"/comments");return((r=t==null?void 0:t.data)==null?void 0:r.length)?t.data:[]}async function Ft(e,t){let r=JSON.stringify({content:t}),[o,i]=await j(X+"/"+e+"/comments",r);return(i==null?void 0:i.status)===200}async function _t(e){let[t,r]=await Z(X+"/comments/"+e);return(r==null?void 0:r.status)===200}async function Ot(e){var i;let t=new FormData;t.append("file",e,e.name);let[r,o]=await j(Se,t,{init:{headers:{"Content-Type":null}}});return(o==null?void 0:o.status)!==200||!((i=r==null?void 0:r.data)==null?void 0:i.guid)?void 0:r.data.guid}async function $t(e){return!1}b("isBox",e=>e.classList.add("box"));function y(e,...t){return e||(e={}),n.h("div",g(g({},e),{isBox:!0}),e.arrow?n.h("div",{className:"arrow arrow-"+e.arrow}):void 0,n.h("div",{className:"box-content"},t))}b("isLabel",e=>e.classList.add("label"));function M(e,...t){return n.h("div",g(g({},e),{isLabel:!0}),n.h("label",{className:"label-content"},e.labelText),t)}b("isButton",e=>e.classList.add("button"));function x(e,...t){return e||(e={}),n.h("button",g(g({},e),{isButton:!0}),n.h("div",{className:"button-content"},t))}b("isHeader",e=>e.classList.add("header"));function T(e,...t){return e||(e={}),n.h("header",g(g({},e),{isHeader:!0}),n.h("div",{className:"title header-content"},t),n.h(B,null))}b("isFooter",e=>e.classList.add("footer"));function k(e,...t){return e||(e={}),n.h("footer",g(g({},e),{isFooter:!0}),n.h(B,null),n.h("div",{className:"footer-content"},t))}function P(e){return n.h("div",{className:"input"},n.h("input",g({},e)))}function Ye(e){return n.h("div",{className:"input"},n.h("textarea",g({},e)))}function B(){return n.h("span",{className:"seperator"})}function N(r){var{name:e}=r,t=ke(r,["name"]);let o="icon icon-",i="icon-"+e;e&&(o+=e),t.className&&(o+=" "+t.className,delete t.className);const s=n.h("i",g({className:o,setIcon:c},t));return s;function c(u){s.classList.replace(i,"icon-"+u),i="icon-"+u}}function Wt({placeholder:e,value:t,ref:r},...o){const i=h(),s=h(),c=d(!1);return n.h("div",{className:"box writer",getValues:m,ref:r,clear:u},n.h("div",null,n.h(Ye,{ref:i,oninput:p,placeholder:e||"",value:t||""}),n.h("span",{tooltip:a.showPostPreview},n.h(N,{name:"magnifier",className:"toggle-post-preview",onclick:R,styles:{cursor:"pointer"}}))),n.h(k,null,n.h("div",{className:"mark-down-wrapper",if:c},n.h("div",{className:"box mark-down",ref:s}),n.h(B,null)),o));function u(){i.current.value="",s.current.innerHTML="",c.set(!1)}function m(){const S=s.current,I=i.current;if(S&&I)return{raw:I.value,rich:S.innerHTML}}function p(){const S=s.current,I=i.current;S&&I&&(S.innerHTML=de(I.value))}function R(){c.set(!c.value())}}function Le(r){var{datetime:e}=r,t=ke(r,["datetime"]);const o=d(se(e)),i=n.h("time",g({dateTime:e,innerText:o,interval:[s,5e3]},t));function s(){$(i)&&o.set(se(e))}return i}b("isUploadItem",e=>e.classList.add("upload-item"));function Vt(e){return n.h("div",g(g({},e),{isUploadItem:!0}),n.h("img",{src:e.preview,className:"upload-image"}),n.h("div",{className:"upload-text"},e.fileName),n.h("div",null,n.h(N,{name:"clipboard",copyToClipboard:`![${e.fileName}](${e.preview})`,className:"upload-action"}),n.h(N,{tooltip:a.removeImage,name:"x-red",onclick:t,className:"upload-action"})));function t(){V.update(r=>{let o=r.findIndex(i=>i.key===e.key);o>=0&&(r.splice(o,1),$t(e.key))})}}b("isMenu",e=>e.classList.add("menu"));function Qe(e,...t){return n.h("ul",g(g({},e),{isMenu:!0,isBox:!0}),t)}b("isMenuItem",e=>e.classList.add("menu-item"));function De(e,...t){return n.h("li",g(g({},e),{isMenuItem:!0}),t)}function et(e,t){return e-=50,t-=50,e<0&&(e=0),innerHeight-e<200&&(e=innerHeight-200),[e,t]}const F={removeOnClick:!0,timeout:5e3},jt=5242880;function tt(e){this.message=e}tt.prototype=new Error,tt.prototype.name="InvalidCharacterError";var zt=typeof window!="undefined"&&window.atob&&window.atob.bind(window)||function(e){var t=String(e).replace(/=+$/,"");if(t.length%4==1)throw new tt("'atob' failed: The string to be decoded is not correctly encoded.");for(var r,o,i=0,s=0,c="";o=t.charAt(s++);~o&&(r=i%4?64*r+o:o,i++%4)?c+=String.fromCharCode(255&r>>(-2*i&6)):0)o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(o);return c};function di(e){var t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw"Illegal base64url string!"}try{return function(r){return decodeURIComponent(zt(r).replace(/(.)/g,function(o,i){var s=i.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}(t)}catch(r){return zt(t)}}function Me(e){this.message=e}function fi(e,t){if(typeof e!="string")throw new Me("Invalid token specified");var r=(t=t||{}).header===!0?0:1;try{return JSON.parse(di(e.split(".")[r]))}catch(o){throw new Me("Invalid token specified: "+o.message)}}Me.prototype=new Error,Me.prototype.name="InvalidTokenError";var Gt=fi;const vi="",gi=1,G=`${vi}/api/v${gi}`,Q="accounts",Pe=G+"/users/",Kt=Pe+"follow/",hi=G+`/${Q}`,yi=G+`/${Q}/login`,wi=G+`/${Q}/register`,bi=G+`/${Q}/token`,xi=G+`/${Q}/displayname`,ka=G+`/${Q}/email`,Ti=G+`/${Q}/password`,f=d(!1),D=d(!0);let he={};const Ei=f.value,le=()=>Ei()?he:null,qt=async e=>!!await He(e);async function Jt(){f.set(!1),localStorage.removeItem("token"),v(null,a.logoutMessage,F),W("/login")}async function Xt({alias:e,password:t}){var s;let r=JSON.stringify({username:e,password:t}),[o,i]=await j(yi,r);(i==null?void 0:i.status)===200&&((s=o==null?void 0:o.data)==null?void 0:s.accessToken)?(Zt(o.data.accessToken),f.set(!0),v(null,a.loginSuccessMessage,F)):(f.set(!1),v(null,a.loginFailedMessage,F))}async function Yt(e){let[t,r]=await j(Kt+e);return(r==null?void 0:r.status)===2e3}async function Qt(e){let[t,r]=await Z(Kt+e);return(r==null?void 0:r.status)===2e3}async function Dt(e){let[t]=await U(Pe+`${e}/followers`);return(t==null?void 0:t.data)&&t.data.length?t.data:[]}async function er(e){let[t]=await U(Pe+`${e}/following`);return(t==null?void 0:t.data)&&t.data.length?t.data:[]}async function tr(e){let t=JSON.stringify({displayName:e}),[r,o]=await Ee(xi,t);return(o==null?void 0:o.status)===200?(v(null,a.changeNameSuccess,F),he.alias=e,he.displayName=e,!0):(v(null,a.changeNameFailed,F),!1)}async function rr(e,t){let r=JSON.stringify({currentPassword1:e,newPassword:t}),[o,i]=await Ee(Ti,r);return(i==null?void 0:i.status)===200?(v(null,a.passwordChangedSuccess,F),!0):(v(null,a.passwordChangedFailed,F),!1)}async function nr(){let[e,t]=await Z(hi,"{}");return(t==null?void 0:t.status)===200?(f.set(!1),localStorage.removeItem("token"),W("/register"),!0):!1}async function Si(){var t;let e=or();if(e){const r=(e.exp-Math.round(Date.now()/1e3))/3600;if(r<=24){let[o,i]=await U(bi);((t=o==null?void 0:o.data)==null?void 0:t.accessToken)&&Zt(o.data.accessToken),f.set((i==null?void 0:i.status)===200)}else f.set(!0)}else f.set(!1)}async function ir({alias:e,displayName:t,email:r,password:o}){let i=JSON.stringify({email:r,username:e,password:o,displayName:t}),[s,c]=await j(wi,i);(c==null?void 0:c.status)===200?(v(null,a.registerSuccess,F),W("/login")):v(null,a.registerFailed,F)}f.subscribe(async e=>{var t;if(D.set(!e),e===!1&&(he={}),e===!0){const r=(t=or())==null?void 0:t.sub;he=await He(r)}});function Zt(e){localStorage.setItem("token",e)}async function He(e){let[t,r]=await U(Pe+e);return(r==null?void 0:r.status)!==200?void 0:t.data}function or(){const e=localStorage.getItem("token");if(e)return Gt(e)}Si();const sr={black:"#17111a",darkRed1:"#372538",darkRed2:"#7a213a",red:"#e14141",lightRed:"#ffa070",brownish:"#c44d29",orange:"#ffbf36",yellow:"#fff275",darkBrown:"#753939",brown:"#cf7957",lightBrown:"#ffd1ab",darkGreen:"#39855a",green:"#83e04c",lightGreen:"#dcff70",darkBlue:"#243b61",blue:"#3898ff",lightBlue:"#6eeeff",violet:"#682b82",magenta:"#bf3fb3",pink:"#ff80aa",darkGrey1:"#3e375c",darkGrey2:"#7884ab",grey:"#b2bcc2",white:"#ffffff"},Li=Object.keys(sr);function ce(){const e=Math.round(Math.random()*24+1);return sr[Li[e]]}const rt=me(Mi),Pi=()=>document.getElementById("user-card");rt.onClose(()=>{var e;return(e=Pi())==null?void 0:e.remove()});async function Mi({alias:e,top:t,left:r}){var ft,vt;[t,r]=et(t,r);let o=(ft=le())==null?void 0:ft.username,i=await He(e);const s=d(0),c=d(0),u=d(!1),m=d(!0);return u.subscribe(re=>m.set(!re)),I(),Ae(),n.h(y,{styles:{top:`${t}px`,left:`${r}px`},id:"user-card",onmouseleave:rt.close},n.h(T,null,n.h("div",{styles:{display:"flex",gap:"8px",alignItems:"center"}},n.h("div",{className:"user-image-wrap"},n.h("div",{className:"user-image",styles:{backgroundColor:ce()+" !important"}}),n.h("div",{className:"avatar-circle"})),n.h("a",{href:`/user/${e}`,tooltip:a.visitUser.replace("$u",i.displayName),styles:{flex:"1"}},n.h("div",null,i.displayName),n.h("div",null,"@",i.username)),e===o?void 0:n.h(p,null)),n.h(B,null),n.h("div",{styles:{display:"flex",gap:"8px"}},n.h("div",null,a.followers,": ",s),n.h("div",null,a.following,": ",c))),n.h(y,{arrow:"top-left",if:((vt=i.description)==null?void 0:vt.length)>0},n.h("span",null,i.description)));function p(){return n.h("div",{className:"cursor-pointer"},n.h("div",{if:f},n.h(N,{if:m,tooltip:a.follow,name:"user-follow",onclick:R}),n.h(N,{if:u,tooltip:a.unfollow,name:"user-unfollow",onclick:S})))}async function R(){await Yt(i.username),await I(),await Ae()}async function S(){await Qt(i.username),I(),Ae()}async function I(){let re=await Dt(e);s.set(re.length),u.set(!!re.find(fr=>fr.username===o))}async function Ae(){let re=await er(e);c.set(re.length)}}var Ne=rt;const ee=document.createElement("textarea");document.body.appendChild(ee);ar();async function nt(e){let t;try{ee.value=e,Ni(),Hi()}catch(r){t=r}finally{return ar(),t}}function Hi(){ee.select(),ee.setSelectionRange(0,ee.value.length),document.execCommand("copy")}function ar(){ee.setAttribute("hidden","true")}function Ni(){ee.removeAttribute("hidden")}b("user-card",(e,t)=>O(e,"mouseenter",r=>{Ne.open({alias:t,top:r.clientY,left:r.clientX})}));b("copyToClipboard",(e,t)=>{n.setProperties(e,{tooltip:a.clickToCopy.replace("$c",typeof t=="function"?t():t)}),O(e,"click",()=>{let r;typeof t=="function"?r=t():typeof t=="string"&&(r=t),r&&nt(r)})});b("tooltip",(e,t)=>{e.classList.add("tooltip"),e.appendChild(n.createElement("span",{className:"tooltip-text"},t))});b("routerLink",(e,t)=>O(e,"click",()=>W(t)));function ot({routes:e}){const t=n.h("div",{id:"router"});return St({routes:e,target:t}).onLoad(()=>fe.set(!0)).onLoadEnd(()=>fe.set(!1)),t}function it(){return n.h(y,{id:"navigation"},n.h(T,{classList:"hide-mobile"},a.navigation),n.h("div",{className:"list"},n.h("a",{href:"/"},a.home),n.h("a",{if:D,href:"/login"},a.login),n.h("a",{if:D,href:"/register"},a.register),n.h("a",{if:f,href:"/settings"},a.settings),n.h("a",{if:f,onclick:Jt},a.logout)))}const rl=document.createElement("a"),Ie=new FileReader;function lr(e){return new Promise(t=>{try{let r=document.createElement("input");r.accept=e.accept,r.type="file",r.onchange=o=>{let i=o.target.files;if(!i.length)return t([null,null]);let s=i[0];Ie.onload=c=>{if(e.maxSize&&s.size>e.maxSize)return t([null,new Error("Filesize exceeded")]);s.data=c.target.result,t([s,null])},Ie.onerror=()=>t([null,null]),Ie.onabort=()=>t([null,null]),Ie["readAs"+e.readAs](s)},r.click()}catch(r){t([null,r])}})}function cr({postId:e}){const t=h(),r=d([]),o=d(!1);return s(),n.h("div",{interval:[s,3e4]},n.h("div",{if:f},n.h(B,null),n.h("form",{onsubmit:i,styles:{display:"flex",gap:"8px",flexDirection:"column"}},n.h(Ye,{ref:t}),n.h(x,{type:"submit",styles:{width:"max-content"}},a.actionComment))),n.h("div",{if:o},n.h(B,null),n.h("div",{className:"comments",for:{of:r,do:Ii,sort:ae}})));async function i(c){c.preventDefault();const u=t.current.value;if(!f.value()){v(null,a.authError);return}if(!u||u.length<4)return v(null,a.messageCriteriaError);let m=await Ft(e,u);m&&(t.current.value="",s())}function s(){Bt(e).then(c=>{r.set(c),o.set(c.length>0)})}}function Ii(e){var i;const t=((i=le())==null?void 0:i.username)===e.user.alias,r=n.h("div",{className:"comment"},n.h("div",{className:"comment-flex",styles:{flexDirection:t?"row-reverse":"row"}},n.h("div",{className:"user-image","user-card":e.user.alias,styles:{backgroundColor:ce()+" !important"}}),n.h(y,{arrow:t?"top-right":"top-left"},n.h("div",{className:"top"},n.h("div",{className:"comment-author"},e.user.alias),n.h(Le,{datetime:e.datePosted*1e3,className:"datetime"})),n.h("div",null,e.textContent),n.h("div",{if:t,styles:{position:"absolute",bottom:"0px",right:"0px"}},n.h(N,{name:"x-red",className:"cursor-pointer",onclick:o})))));return r;async function o(){let s=await _t(e.id);s?(v(null,a.deleteCommentSuccess),r.remove()):v(null,a.deleteCommentFailure)}}function te(e){const t=d("post opacity-0"),r=me(i),o=me(s);return n.h("div",{className:t,interval:[c,250]},n.h("div",{styles:{display:"flex",gap:"8px"}},n.h("div",null,n.h("div",{className:"user-image-wrap","user-card":e.user.alias},n.h("div",{className:"user-image",styles:{backgroundColor:ce()+" !important"}}),n.h("div",{className:"avatar-circle"}))),n.h(y,{className:"post-content",arrow:"top-left"},n.h(T,null,n.h("div",{className:"wrap-ellipsis",styles:{width:"50%"}},e.user.displayName,n.h("span",{className:"user-alias"},"@",e.user.alias)),n.h("div",{className:"datetime"},n.h(Le,{datetime:e.datePosted*1e3,className:"hide-mobile"}),n.h("span",{if:e.datePosted!==e.dateEdited,tooltip:a.edited},"*"),n.h(N,{name:"calendar",tooltip:se(e.datePosted*1e3)}))),n.h("div",{className:"user-content"},n.h(Ai,{postId:e.id,data:e.textContent})),n.h(k,null,n.h("div",{styles:{display:"flex",gap:"8px",alignItems:"center"}},n.h(ki,{likeAmount:e.likeAmount,postId:e.id}),n.h(Ri,{userAlias:e.user.alias,postId:e.id,commentsAmount:e.commentsAmount}),n.h("div",{className:"post-menu",tooltip:a.showPostMenu},n.h(N,{if:f,name:"menu-meatballs",onclick:r.open})),n.h("span",{styles:{position:"absolute",bottom:"0",right:"0"}},n.h("div",{portal:r}),n.h("div",{portal:o})))),e.showComments?n.h(cr,{postId:e.id}):void 0)));function i(){var p;const m=((p=le())==null?void 0:p.username)===e.user.alias;return n.h(Qe,{onmouseleave:r.close},n.h(De,null,n.h("a",{href:`/user/${e.user.alias}/post/${e.id}`},a.comments)),n.h(De,{if:m,onclick:o.open},a.deletePost))}function s(){return n.h(Qe,{onmouseleave:u},n.h(T,null,a.deletePostSure),n.h("div",{styles:{margin:"0 auto",width:"max-content"}},n.h("div",{styles:{display:"flex",gap:"8px"}},n.h(x,{onclick:()=>Ct(e.id)},a.continue),n.h(x,{onclick:u},a.abort))))}function c(m){t.set(`post opacity-${$(m)?"1":"0"}`)}function u(){o.close(),r.open(null)}}function Ai({postId:e,data:t}){const r=d(t),o=d("");return r.subscribe(s=>o.set(de(s))),n.h(y,{className:"text-content",interval:[i,1e4]},n.h("div",{innerHTML:o,className:"mark-down"}));function i(s){if(!$(s))return;let c=Y(e);if(!c)return;r.set(c.textContent)}}function ki({likeAmount:e,postId:t}){const r=d(String(e)),o=h();return n.h("div",{className:"heart-action",styles:{display:"flex",gap:"8px",alignItems:"center"},if:f,mount:i,interval:[i,250],tooltip:[r,a.nUsersLikedThat]},n.h(N,{ref:o,name:"heart-grey",onclick:()=>Ut(t),className:"wiggle-vertical",styles:{cursor:"pointer"}}),n.h("span",null,r));function i(s){if(!$(s)&&f.value())return;let c=Y(t);if(!c)return;r.set(String(c.likeAmount)),o.current.setIcon(c.liked?"heart-red":"heart-grey")}}function Ri({userAlias:e,postId:t,commentsAmount:r}){const o=d(String(r));return n.h("a",{href:`/user/${e}/post/${t}`,className:"comment-action",tooltip:a.showComments,interval:[i,250]},n.h("div",{styles:{display:"flex",gap:"8px",alignItems:"center"}},n.h(N,{name:"comment-bubbles-grey",className:"post-comment"}),n.h("span",null,o)));function i(s){if(!$(s)&&f.value())return;let c=Y(t);if(!c)return;o.set(String(c.commentsAmount))}}async function st(){return await ge(null,null,20),n.h("div",{styles:{display:"flex",flexDirection:"column",gap:"8px"}},n.h("div",{if:f},n.h(Ci,null)),n.h("div",{for:{of:z,do:te,sort:ae}}))}function Ci(){const e=h();return n.h("form",{onsubmit:o,destroy:()=>V.set([])},n.h(Wt,{ref:e},n.h("div",{styles:{display:"flex",gap:"8px"}},n.h(x,{type:"submit"},a.send),n.h(x,{type:"button",onclick:t},a.uploadImage)),n.h("div",{if:qe},n.h(B,null),n.h("div",{styles:{display:"flex",flexDirection:"column-reverse",gap:"8px"},for:{of:V,do:i=>n.h(Vt,{key:i.key,preview:i.preview,fileName:i.fileName})}}))));async function t(){let[i,s]=await lr({accept:"image/*",readAs:"BinaryString",maxSize:jt});if(s)return v(null,a.followingError.replace("$e",s.message));if(!i.type.startsWith("image/"))return v(null,a.unsupportedFileType.replace("$t",i.type));if(!i.data)return v(null,a.errorOnUpload);let c=await Ot(i);if(!c)return v(null,a.errorOnUpload);V.update(u=>u.push({key:c,fileName:i.name,preview:Se+c}))}function r(){var i;return{text:(i=e.current.getValues())==null?void 0:i.raw}}async function o(i){if(i.preventDefault(),!f.value())return v(null,a.authError),!1;const s=r();if(!s.text)return v(null,a.messageCriteriaError);let c=await Rt(s.text);c&&(e.current.clear(),V.set([]),ge())}}var ur=`Durch die Installation dieser Anwendung werden einige Inhalte (wie z. B. Grafiken) lokal auf dem Ger\xE4t hinterlegt, damit diese
  nicht mehr heruntergeladen werden m\xFCssen, wenn Sie diese Seite wieder besuchen.`;const K=d(!1),at=d(!0);K.subscribe(e=>at.set(!e));async function mr(){"serviceWorker"in navigator&&(await navigator.serviceWorker.register("serviceworker.js"),K.set(!0))}async function pr(){if("serviceWorker"in navigator){let e=await navigator.serviceWorker.getRegistrations();for(let t of e)t&&t.unregister()}K.set(!1)}"serviceWorker"in navigator&&navigator.serviceWorker.getRegistration("serviceworker.js").then(e=>{e&&e.active?K.set(!!e.active):K.set(!1)}).catch(()=>K.set(!1));async function lt(){return n.h("div",{id:"settings",styles:{display:"flex",flexDirection:"column",gap:"8px"}},n.h(Ui,null),n.h(_i,null),n.h(Fi,null),n.h(Bi,null))}function Ui(){const e={changed:d(!1),reference:h()};return n.h(y,null,n.h(T,null,a.changeName),n.h(M,{labelText:a.name},n.h(P,{ref:e.reference,type:"text",placeholder:a.name,oninput:()=>e.changed.set(!!e.reference.current.value)})),n.h("div",{if:e.changed},n.h(k,null,n.h(x,{type:"button",onclick:t},a.save))));async function t(){let r=await tr(e.reference.current.value);r&&(e.reference.current.value="")}}function Bi(){return n.h(y,null,n.h(T,null,a.progressiveWebApp),n.h(y,null,ur),n.h(k,null,n.h(x,{if:at,onclick:mr},a.installApp),n.h(x,{if:K,onclick:pr},a.uninstallApp)))}function Fi(){const e=d(!1);return n.h(y,null,n.h(T,null,a.deleteAccount),n.h(y,null,a.deleteAccountInfo),n.h(k,null,n.h(x,{type:"button",onclick:()=>e.set(!e.value())},a.deleteAccount),n.h(x,{type:"button",onclick:()=>nr(),if:e},a.continue)))}function _i(){const e={changed:d(!1),changable:d(!1),references:[h(),h(),h()]};return n.h(y,null,n.h(T,null,a.changePasswordTitle),n.h(M,{labelText:a.currentPassword},n.h(P,{name:"password",ref:e.references[0],type:"password",placeholder:"********",oninput:t})),n.h("div",{styles:{display:"flex",flexDirection:"row",gap:"8px"}},n.h(M,{labelText:a.newPassword},n.h(P,{name:"password",ref:e.references[1],type:"password",placeholder:"********",oninput:t})),n.h(M,{labelText:a.newPasswordReEnter},n.h(P,{name:"password",ref:e.references[2],type:"password",placeholder:"********",oninput:t}))),n.h("div",{if:e.changable},n.h(k,null,n.h(x,{type:"button",onclick:r},a.save))));function t(o){e.changed.set(!!e.references[0].current.value),e.changable.set(e.references[0].current.value&&e.references[1].current.value&&e.references[2].current.value&&e.references[1].current.value===e.references[2].current.value)}async function r(o){let i=await rr(e.references[0].current.value,e.references[1].current.value);i&&e.references.forEach(s=>s.current.value="")}}async function ct(){const e=h(),t=h();return n.h(y,{id:"login"},n.h(T,null,a.enterAccount),n.h("form",{onsubmit:o},n.h("div",{styles:{display:"flex",flexDirection:"column",gap:"8px"}},n.h("div",{styles:{display:"flex",gap:"8px"}},n.h(M,{labelText:a.username},n.h(P,{ref:e,type:"text",placeholder:a.username,required:"true"})),n.h(M,{labelText:a.password},n.h(P,{ref:t,type:"password",placeholder:"********",required:"true"}))),n.h(k,null,n.h("div",{styles:{display:"flex",flexDirection:"row",gap:"8px"}},n.h(x,{type:"submit"},a.login),n.h("a",{href:"/register"},n.h(x,{type:"button"},a.noAccount)))))));function r(){return{alias:e.current.value,password:t.current.value}}async function o(i){i.preventDefault(),await Xt(r()),f.value()&&W("/")}}async function ut({alias:e}){return await ge(e,null,20),n.h("div",{for:{of:z,do:te,sort:ae}})}async function mt({alias:e,id:t}){const r=await Xe(parseInt(t));return n.h(te,{id:r.id,user:r.user,textContent:r.textContent,liked:r.liked,likeAmount:r.likeAmount,commentsAmount:r.commentsAmount,datePosted:r.datePosted,dateEdited:r.dateEdited,showComments:!0})}async function pt(){const e=h(),t=h(),r=h(),o=[h(),h()];return n.h(y,{id:"register"},n.h(T,null,a.createAccount),n.h("form",{onsubmit:c},n.h("div",{styles:{display:"flex",flexDirection:"column",gap:"8px"}},n.h("div",{styles:{display:"flex",flexDirection:"row",gap:"8px"}},n.h(M,{labelText:a.username},n.h(P,{name:"alias",ref:e,type:"text",placeholder:a.username,required:"true"})),n.h(M,{labelText:a.name},n.h(P,{name:"name",ref:t,type:"text",placeholder:a.name,required:"true"}))),n.h(M,{labelText:a.email},n.h(P,{name:"email",ref:r,type:"email",placeholder:"your@email.com",required:"true"})),n.h("div",{styles:{display:"flex",flexDirection:"row",gap:"8px"}},n.h(M,{labelText:a.password},n.h(P,{name:"password",ref:o[0],type:"password",placeholder:"********",required:"true"})),n.h(M,{labelText:a.passwordReEnter},n.h(P,{name:"password",ref:o[1],type:"password",placeholder:"********",required:"true"}))),n.h(k,null,n.h("div",{styles:{display:"flex",flexDirection:"row",gap:"8px"}},n.h(x,{type:"submit"},a.register),n.h("a",{href:"/login"},n.h(x,{type:"button"},a.alreadyAccount)))))));function i(){return{alias:e.current.value,name:t.current.value,email:r.current.value,passwords:[o[0].current.value,o[1].current.value]}}function s(){return[...new Set(i().passwords)].length===1}async function c(u){u.preventDefault();let m=i();if(!s())return v(null,a.passwordsNotSame);ir({alias:m.alias,displayName:m.name,email:m.email,password:m.passwords[0]})}}function dt(){return n.h(y,{id:"route-not-found"},n.h(T,null,a.error),n.h("div",{className:"box message"},a.routeNotFound.replace("$url",location.pathname)))}const Oi=[{path:"",title:a.home,component:st},{path:"login/?*",title:a.login,component:ct,activates:[D.value]},{path:"register/?*",title:a.register,component:pt,activates:[D.value]},{path:"settings/?*",title:a.settings,component:lt,activates:[f.value]},{path:"user/:alias",title:({alias:e})=>e,component:ut,activates:[({alias:e})=>qt(e)],children:[{path:"post/:id",title:({alias:e,id:t})=>e+"/post/"+t,component:mt,activates:[({alias:e,id:t})=>kt(parseInt(t))]}]},{path:"**",title:a.error,component:dt}];var dr=Oi;function $i(){return n.h("div",{id:"app"},n.h("div",{id:"loading-bar",if:fe}),n.h("div",{id:"app-grid"},n.h("aside",{id:"side"},n.h(it,null)),n.h("main",{id:"content"},n.h(ot,{routes:dr}))),n.h("div",{styles:{height:"100vh",width:"100vw",position:"fixed",top:"0",left:"0",pointerEvents:"none"}},n.h("div",{portal:Ne})))}document.getElementById("app").replaceWith(n.h($i,null));})();
