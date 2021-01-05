(() => {
  var __defProp = Object.defineProperty;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __assign = Object.assign;
  var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
  var __rest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name2 in all)
      __defProp(target, name2, {get: all[name2], enumerable: true});
  };

  // mod/doc/src/doc.ts
  const doc_exports = {};
  __export(doc_exports, {
    appendChildren: () => appendChildren,
    createElement: () => createElement,
    h: () => h,
    render: () => render,
    setProperties: () => setProperties
  });

  // mod/doc/src/types.ts
  const T_STRING = "string";
  const T_NUMBER = "number";
  const T_FUNCTION = "function";
  const T_BOOLEAN = "boolean";

  // mod/doc/src/helper.ts
  function eachFn(list, ...args) {
    if (!list || list.length === 0)
      return;
    let i = 0;
    const len = list.length;
    for (i; i < len; i++)
      list[i](...args);
  }
  function blank() {
    return Object.create(null);
  }
  function sub(subscribers, fn) {
    subscribers.push(fn);
    return () => unsub(subscribers, fn);
  }
  function unsub(subscribers, fn) {
    const index = subscribers.indexOf(fn);
    if (index !== -1)
      subscribers.splice(index, 1);
  }
  function createHash(input) {
    let h2;
    for (let i = 0, length = input.length; i < length; i++)
      h2 = Math.imul(31, h2) + input.charCodeAt(i) | 0;
    return h2.toString(36);
  }
  function prepareForList(list, {sort: sort2, filter, limit, offset}) {
    let copy2 = [...list];
    if (filter)
      copy2 = copy2.filter(filter);
    if (sort2)
      copy2 = copy2.sort(sort2);
    if (typeof offset === T_NUMBER)
      copy2 = copy2.slice(0, offset);
    if (typeof limit === T_NUMBER)
      copy2.length = limit;
    return copy2;
  }
  function keysOf(obj) {
    let keys = [];
    for (let key in obj)
      keys.push(key);
    return keys;
  }
  function lifeCycle(el, type, fn) {
    let fns = el[Hooks][type] || (el[Hooks][type] = []);
    return sub(fns, fn);
  }

  // mod/doc/src/globals.ts
  const Hooks = Symbol("Hooks");
  const Mount = Symbol("Mount");
  const Destroy = Symbol("Destroy");
  const Events = Symbol("Events");
  const Styles = Symbol("Styles");
  const Directives = blank();

  // mod/doc/src/events.ts
  function onGlobalEvent(name2, fn) {
    if (!window[Hooks]) {
      window[Hooks] = blank();
      if (!window[Hooks][Events])
        window[Hooks][Events] = blank();
    }
    let fns = window[Hooks][Events][name2] || (window[Hooks][Events][name2] = []);
    let event = (ev) => eachFn(fns, ev);
    fns.push(fn);
    if (fns.length === 1)
      listen(window, name2, event);
    return () => {
      const index = fns.indexOf(fn);
      if (index !== -1) {
        fns.splice(index, 1);
        if (fns.length === 0)
          unlisten(window, name2, event);
      }
    };
  }
  function onEvent(el, name2, fn) {
    let fns = el[Hooks][Events][name2] || (el[Hooks][Events][name2] = []);
    let event = (ev) => eachFn(fns, ev);
    fns.push(fn);
    if (fns.length === 1)
      listen(el, name2, event);
    lifeCycle(el, Destroy, () => {
      const index = fns.indexOf(fn);
      if (index !== -1) {
        fns.splice(index, 1);
        if (fns.length === 0)
          unlisten(el, name2, event);
      }
    });
  }
  function listen(target, name2, listener) {
    target.addEventListener(name2, listener, false);
  }
  function unlisten(target, name2, listener) {
    target.removeEventListener(name2, listener, false);
  }

  // mod/doc/src/properties.ts
  function setProperties(el, props) {
    const keys = keysOf(props);
    keys.forEach((key) => {
      const dir = Directives[key];
      dir ? dir(el, props[key]) : writeDefault(el, key, props[key]);
    });
  }
  function writeDefault(el, key, property) {
    if (property === void 0)
      return;
    if (property.subscribe) {
      let state = property;
      el[key] = state.value();
      lifeCycle(el, Destroy, state.subscribe((val) => {
        if (el[key] !== val)
          el[key] = val;
      }));
    } else if (key.startsWith("on") && typeof property === T_FUNCTION) {
      onEvent(el, key.slice(2), property);
    } else {
      el[key] = property;
    }
  }

  // mod/doc/src/children.ts
  function render(el, ...children4) {
    el.innerHTML = "";
    appendChildren(el, children4, el);
  }
  function appendChildren(el, children4, $el) {
    let frag = fragment();
    const len = children4.length;
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        if (children4[i] === void 0)
          continue;
        if (children4[i] === null)
          continue;
        if (Array.isArray(children4[i])) {
          appendChildren(frag, children4[i], $el);
        } else if (typeof children4[i] === T_STRING || typeof children4[i] === T_NUMBER) {
          frag.appendChild(text(children4[i]));
        } else if (children4[i] instanceof Element) {
          frag.appendChild(children4[i]);
        } else if (children4[i].subscribe) {
          let stateValue = children4[i].value();
          if (typeof stateValue === T_STRING || typeof stateValue === T_NUMBER) {
            let state = children4[i];
            let content = text(state.value());
            frag.appendChild(content);
            lifeCycle($el, Destroy, state.subscribe((val) => {
              let newVal = val + "";
              if (content.textContent !== newVal)
                content.textContent = newVal;
            }));
          } else if (stateValue instanceof Element) {
            let state = children4[i];
            frag.appendChild(state.value());
            lifeCycle($el, Destroy, state.subscribe((val) => {
              state.value().replaceWith(val);
            }));
          }
        }
      }
      el.appendChild(frag);
    }
  }

  // mod/doc/src/elements.ts
  function element(type) {
    let el = document.createElement(type);
    prepareHooks(el);
    return el;
  }
  const text = (data) => document.createTextNode(data + "");
  const fragment = () => document.createDocumentFragment();
  function prepareHooks(el) {
    el[Hooks] = blank();
    el[Hooks][Mount] = [];
    el[Hooks][Destroy] = [];
    el[Hooks][Events] = blank();
  }
  function createElement(type, props, ...children4) {
    if (typeof type === T_FUNCTION)
      return type(props, ...children4);
    let el = element(type);
    setProperties(el, props);
    appendChildren(el, children4, el);
    return el;
  }

  // mod/doc/src/doc.ts
  const h = createElement;

  // mod/doc/src/core.ts
  function observable(initialValue) {
    let current = initialValue;
    const subscribers = [];
    const pub = {isObservable: true, set, subscribe, update, value};
    function set(newValue) {
      current = newValue;
      eachFn(subscribers, current);
      return pub;
    }
    function update(fn) {
      fn(current);
      eachFn(subscribers, current);
      return pub;
    }
    function value() {
      return current;
    }
    function subscribe(fn) {
      fn(current);
      return sub(subscribers, fn);
    }
    return pub;
  }
  function reference() {
    let current;
    const pub = {isRef: true, current};
    return pub;
  }
  function portal(component) {
    let anchor;
    let current;
    const openObservers = [];
    const closeObservers = [];
    const pub = {isPortal: true, open, close: close2, set, onOpen, onClose};
    async function open(props, ...children4) {
      if (!current) {
        current = await component(props, ...children4);
        anchor.appendChild(current);
        eachFn(openObservers);
      } else {
        close2();
        open(props, ...children4);
      }
    }
    function set(newAnchor) {
      anchor = newAnchor;
      return pub;
    }
    function close2() {
      if (current) {
        current.remove();
        current = void 0;
        eachFn(closeObservers);
      }
      return pub;
    }
    function onOpen(fn) {
      openObservers.push(fn);
      return pub;
    }
    function onClose(fn) {
      closeObservers.push(fn);
      return pub;
    }
    return pub;
  }

  // mod/doc/src/router/create-matcher.ts
  const R_OPTIONAL = /\*/g;
  const R_REPLACER = /\:([a-zA-Z]+)/gi;
  const R_PARAM = "(?<$1>[^\\/\\:\\?]+?)";
  const R_START = "^/";
  const R_END = "/?$";
  const R_WILDCARD_STR = "(\\S+)?";
  const R_WILDCARD = /\S+/i;
  const R_DOUBLESLASH = /\/\//g;
  const R_SINGLESLASH = "/";
  const R_MULTI_WILDCARD = /(\*\*)+/g;
  const R_SINGLE_WILDCARD = "**";
  function createMatcher(path) {
    if (path.startsWith("/"))
      throw new Error("RoutePath cannot start with an '/'");
    if (path.endsWith("/"))
      throw new Error("RoutePath cannot end with an '/'");
    if (path === "**")
      return R_WILDCARD;
    path = path.replace(R_OPTIONAL, R_WILDCARD_STR);
    path = path.replace(R_REPLACER, R_PARAM);
    path = path.replace(R_DOUBLESLASH, R_SINGLESLASH);
    path = path.replace(R_MULTI_WILDCARD, R_SINGLE_WILDCARD);
    return new RegExp(R_START + path + R_END);
  }

  // mod/doc/src/router/create-routes.ts
  function createRoutes(routes2) {
    let routesArray = [];
    let i = 0;
    while (routes2[i]) {
      let {component, path, title, children: children4, activates} = routes2[i];
      let matcher = createMatcher(path);
      activates = [...new Set(activates)];
      routesArray.push({title, matcher, component, activates});
      if (children4) {
        routes2.splice(i + 1, 0, ...children4.map((rc) => {
          if (rc.activates && activates) {
            rc.activates = [...activates, ...new Set(rc.activates)];
          } else if (activates) {
            rc.activates = activates;
          }
          rc.path = path + "/" + rc.path;
          return rc;
        }));
      }
      i++;
    }
    return routesArray;
  }

  // mod/doc/src/router/execute-activators.ts
  async function executeActivators(activatorArray, params) {
    if (activatorArray) {
      try {
        for (let activator of activatorArray) {
          if (await activator(params) !== true)
            return false;
        }
      } catch (error2) {
        console.error(error2);
        return false;
      }
    }
    return true;
  }

  // mod/doc/src/router/parameters.ts
  function parameters(matcher, url2) {
    let matched = matcher.exec(url2);
    return matched.groups ? __assign({}, matched.groups) : Object.create(null);
  }

  // mod/doc/src/router/find-route.ts
  async function findRoute(routes2, url2) {
    let i = 0;
    while (routes2[i]) {
      let route = routes2[i];
      if (!route.matcher.test(url2)) {
        i++;
        continue;
      }
      route.params = parameters(route.matcher, url2);
      let activatable = await executeActivators(route.activates, route.params);
      if (activatable)
        return route;
      i++;
      continue;
    }
  }

  // mod/doc/src/router/load-route.ts
  async function loadRoute(routes2, url2) {
    let route = await findRoute(routes2, url2);
    if (!route) {
      return;
    }
    let {component, title, params} = route;
    let stateTitle = "";
    if (title) {
      if (typeof title === T_FUNCTION) {
        stateTitle = title(params);
      } else if (typeof title === T_STRING) {
        stateTitle = title;
      }
    }
    let stateComponent = await component(params);
    return {
      title: stateTitle,
      params,
      component: stateComponent
    };
  }

  // mod/doc/src/router/render-route.ts
  async function renderRoute(targetComponent, route, url2) {
    if (route.title)
      document.title = route.title;
    history.replaceState(route.params, document.title, url2);
    render(targetComponent, route.component);
  }

  // mod/doc/src/router/url.ts
  function fullUrl() {
    return location.pathname + location.search + location.hash;
  }

  // mod/doc/src/router/mod.ts
  function router({target, routes: routes2}) {
    const Routes2 = createRoutes(routes2);
    const callbacks = {
      load: [],
      loadEnd: [],
      loadError: []
    };
    const pub = {onLoad, onLoadEnd, onLoadError};
    async function listener() {
      let loadUrl = fullUrl();
      eachFn(callbacks.load);
      let route = await loadRoute(Routes2, loadUrl);
      if (route) {
        renderRoute(target, route, loadUrl);
      } else {
        eachFn(callbacks.loadError);
      }
      eachFn(callbacks.loadEnd);
    }
    function onLoad(fn) {
      callbacks.load.push(fn);
      return pub;
    }
    function onLoadEnd(fn) {
      callbacks.loadEnd.push(fn);
      return pub;
    }
    function onLoadError(fn) {
      callbacks.loadEnd.push(fn);
      return pub;
    }
    listener();
    onGlobalEvent("popstate", listener);
    return pub;
  }
  onGlobalEvent("click", (event) => {
    let target = event.target;
    while (target) {
      if (target["href"]) {
        event.preventDefault();
        history.pushState(null, "", target["href"]);
        dispatchEvent(new PopStateEvent("popstate"));
        break;
      }
      target = target["parentNode"];
    }
  });

  // mod/doc/src/styles.ts
  const styleElement = document.createElement("style");
  document.head.appendChild(styleElement);
  const CSSSheet = styleElement.sheet;
  const CSSMap = blank();
  function useStyles(el, rules) {
    if (!el[Styles])
      el[Styles] = blank();
    const elStyles = el[Styles];
    const add2 = [];
    const del3 = [];
    const keys = keysOf(rules);
    for (let i = 0, len = keys.length; i < len; i++) {
      const property = keys[i].replace(/([A-Z])/g, "-$1");
      const name2 = createRule(`${property}: ${rules[keys[i]]};`);
      if (!elStyles[property]) {
        elStyles[property] = name2;
        add2.push(name2);
      } else {
        del3.push(elStyles[property]);
        elStyles[property] = name2;
        add2.push(name2);
      }
    }
    el.classList.remove(...del3);
    el.classList.add(...add2);
  }
  function createRule(rule) {
    let name2 = "r-" + createHash(rule);
    let style = `.${name2} { ${rule} }`;
    if (!CSSMap[name2]) {
      CSSMap[name2] = style;
      insertRule(style);
    } else {
      if (CSSMap[name2] !== style) {
        name2 += "_";
        CSSMap[name2] = `.${name2} { ${rule} }`;
        insertRule(CSSMap[name2]);
      }
    }
    return name2;
  }
  function insertRule(rule) {
    CSSSheet.insertRule(rule, CSSSheet.rules.length);
  }

  // mod/doc/src/directives.ts
  const directive = (name2, fn) => Directives[name2] = fn;
  const mountDirective = (e2, p) => lifeCycle(e2, Mount, p);
  const destroyDirective = (e2, p) => lifeCycle(e2, Destroy, p);
  const intervalDirective = (e2, p) => {
    let id = setInterval(() => p[0](e2), p[1]);
    return lifeCycle(e2, Destroy, () => clearInterval(id));
  };
  const referenceDirective = (e2, p) => {
    if (p.isRef)
      p.current = e2;
  };
  const portalDirective = (e2, p) => {
    if (p.isPortal)
      p.set(e2);
  };
  const ifDirective = (e2, p) => {
    if (typeof p === T_BOOLEAN) {
      if (p === false)
        e2.setAttribute("hidden", "");
    } else if (p.subscribe) {
      let state = p;
      lifeCycle(e2, Destroy, state.subscribe((val) => {
        val === true ? e2.removeAttribute("hidden") : e2.setAttribute("hidden", "");
      }));
    }
  };
  const stylesDirective = (e2, p) => {
    if (p.subscribe) {
      let state = p;
      lifeCycle(e2, Destroy, state.subscribe((rules) => useStyles(e2, rules)));
    } else {
      useStyles(e2, p);
    }
  };
  const forDirective = (e2, p) => {
    let sort2 = p.sort;
    let filter = p.filter;
    let limit = p.limit;
    let offset = p.offset;
    let com = p.do;
    if (p.of) {
      if (Array.isArray(p.of)) {
        let copy2 = prepareForList(p.of, {sort: sort2, filter, limit, offset});
        render(e2, ...copy2.map(com));
      } else if (p.of && p.of.subscribe) {
        let list = p.of;
        destroyDirective(e2, list.subscribe((val) => {
          let copy2 = prepareForList(val, {sort: sort2, filter, limit, offset});
          render(e2, ...copy2.map(com));
        }));
      }
    }
  };
  directive("styles", stylesDirective);
  directive("if", ifDirective);
  directive("ref", referenceDirective);
  directive("portal", portalDirective);
  directive("mount", mountDirective);
  directive("destroy", destroyDirective);
  directive("interval", intervalDirective);
  directive("for", forDirective);

  // app/helpers/mark-down.ts
  const IMG = /\![\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g;
  const A = /[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g;
  const PRE0 = /^\s*\n\`\`\`(([^\s]+))?/gm;
  const PRE1 = /^\`\`\`\s*\n/gm;
  const PRE2 = /(\<pre.+\>)\s*\n\<p\>(.+)\<\/p\>/gm;
  const CODE0 = /[\`]{1}([^\`]+)[\`]{1}/g;
  const P0 = /^\s*(\n)?(.+)/gm;
  const P1 = /\<(\/)?(h\d|ul|ol|li|img|pre)/;
  const B = /[\*\_]{2}([^\*\_]+)[\*\_]{2}/g;
  const I = /[\*\_]{1}([^\*\_]+)[\*\_]{1}/g;
  const DEL = /[\~]{2}([^\~]+)[\~]{2}/g;
  const UL0 = /^\s*\n\*/gm;
  const UL1 = /^(\*.+)\s*\n([^\*])/gm;
  const UL2 = /^\* (.+)/gm;
  const OL0 = /^\s*\n\d\./gm;
  const OL1 = /^(\d\..+)\s*\n([^\d\.])/gm;
  const OL2 = /^\d\. (.+)/gm;
  const H1 = /[\\#]{1} (.+)/g;
  const H2 = /[\\#]{2} (.+)/g;
  const H3 = /[\\#]{3} (.+)/g;
  const H4 = /[\\#]{4} (.+)/g;
  const H5 = /[\\#]{5} (.+)/g;
  const H6 = /[\\#]{6} (.+)/g;
  function replace(text2, find, value) {
    return text2.replace(find, value);
  }
  function translateMarkDown(text2) {
    text2 = buildLists(text2);
    text2 = buildHeaders(text2);
    text2 = replace(text2, IMG, `<img loading="lazy" src="$2" alt="$1">`);
    text2 = replace(text2, A, `<a target="_blank" href="$2">$1</a>`);
    text2 = buildFontStyles(text2);
    text2 = replace(text2, PRE0, `<pre class="$2">`);
    text2 = replace(text2, PRE1, "</pre>\n\n");
    text2 = replace(text2, CODE0, "<code>$1</code>");
    text2 = replace(text2, P0, (m) => P1.test(m) ? m : `<p>${m}</p>`);
    text2 = replace(text2, PRE2, "$1$2");
    return text2;
  }
  function buildHeaders(t2) {
    t2 = replace(t2, H6, "<h6>$1</h6>");
    t2 = replace(t2, H5, "<h5>$1</h5>");
    t2 = replace(t2, H4, "<h4>$1</h4>");
    t2 = replace(t2, H3, "<h3>$1</h3>");
    t2 = replace(t2, H2, "<h2>$1</h2>");
    t2 = replace(t2, H1, "<h1>$1</h1>");
    return t2;
  }
  function buildFontStyles(t2) {
    t2 = replace(t2, B, "<b>$1</b>");
    t2 = replace(t2, I, "<i>$1</i>");
    t2 = replace(t2, DEL, "<del>$1</del>");
    return t2;
  }
  function buildLists(t2) {
    t2 = replace(t2, UL0, "<ul>\n*");
    t2 = replace(t2, UL1, "$1\n</ul>\n\n$2");
    t2 = replace(t2, UL2, "<li>$1</li>");
    t2 = replace(t2, OL0, "<ol>\n1.");
    t2 = replace(t2, OL1, "$1\n</ol>\n\n$2");
    t2 = replace(t2, OL2, "<li>$1</li>");
    return t2;
  }

  // lang/de_DE.json
  var home = "Startseite";
  var presentation = "Pr\xE4sentation";
  var general = "Allgemein";
  var installApp = "Anwendung installieren";
  var uninstallApp = "Anwendung deinstallieren";
  var install = "Installieren";
  var isInstalled = "Bereits installiert";
  var login = "Einloggen";
  var userSettings = "Nutzereinstellungen";
  var settings = "Einstellungen";
  var register = "Registrieren";
  var logout = "Ausloggen";
  var comments = "Kommentare";
  var error = "Fehler";
  var following = "Folgt";
  var followers = "Follower";
  var navigation = "Navigation";
  var visitUser = "Besuche $u's Seite";
  var send = "Senden";
  var name = "Name";
  var changeName = "Namen \xE4ndern";
  var changeNameSuccess = "Name erfolgreich aktualisiert";
  var changeNameFailed = "Name konnte nicht aktualisiert werden";
  var close = "Schlie\xDFen";
  var follow = "Folgen";
  var unfollow = "Nicht mehr folgen";
  var editPost = "Post bearbeiten";
  var deletePost = "Post l\xF6schen";
  var deletePostSure = "Soll der Post gel\xF6scht werden?";
  var deletePostSuccess = "Post wurde gel\xF6scht";
  var deletePostFailed = "Post konnte nicht gel\xF6scht werden";
  var continue2 = "Fortfahren";
  var abort = "Abbrechen";
  var edited = "Bearbeitet";
  var actionComment = "Kommentieren";
  var deleteComment = "Kommentar l\xF6schen";
  var showPostMenu = "Zeige Men\xFC an";
  var save = "\xC4nderungen speichern";
  var removeImage = "Bild entfernen";
  var uploadImage = "Bild hochladen";
  var deleteAccount = "Konto l\xF6schen";
  var deleteAccountSure = "Konto wirklich l\xF6schen?";
  var deleteAccountInfo = "Wenn du das Konto l\xF6scht, kannst du den Vorgang nicht mehr r\xFCckg\xE4ngig machen.";
  var authError = "F\xFCr diese Aktion hast du keine Berechtigungen.";
  var progressiveWebApp = "Progressive Webanwendung";
  var followingError = "Folgender Fehler ist aufgetreten: '$e'";
  var unsupportedFileType = "Dateityp '$t' nicht unterst\xFCtzt.";
  var clickToCopy = "Klicken um '$c' in die Zwischenablage zu kopieren";
  var username = "Benutzername";
  var email = "E-Mail Adresse";
  var password = "Passwort";
  var currentPassword = "Aktuelles Passwort";
  var passwordChangedSuccess = "Dein Passwort wurde erfolgreich aktualisiert";
  var passwordChangedFailed = "Dein Passwort konnte nicht aktualisiert werden";
  var changePassword = "Passwort aktualisieren";
  var changePasswordTitle = "\xC4ndere dein Passwort";
  var passwordReEnter = "Passwort wiederholen";
  var newPassword = "Neues Passwort";
  var newPasswordReEnter = "Neues Passwort wiederholen";
  var errorOnUpload = "Beim Hochladen ist ein Fehler aufgetreten";
  var loginSuccess = "Erfolgreich eingeloggt";
  var loginSuccessMessage = "Du bist nun eingeloggt";
  var loginFailed = "Einloggen fehlgeschlagen";
  var loginFailedMessage = "Benutzer existiert nicht oder inkorrekte Eingaben";
  var logoutMessage = "Du bist nun abgemeldet";
  var registerSuccess = "Erfolgreich registriert. Du kannst dich nun einloggen.";
  var registerFailed = "Entweder existiert der Benutzer bereits oder falsche Eingaben get\xE4tigt.";
  var passwordsNotSame = "Passw\xF6rter stimmen nicht \xFCberein";
  var showPostPreview = "Vorschau";
  var nUsersLikedThat = " Nutzer/n gef\xE4llt das";
  var showComments = "Gehe zur Kommentarsektion";
  var routeNotFound = "Seite '$url' nicht gefunden.";
  var messageTooShort = "Die Nachricht ist zu kurz";
  var messageTooLong = "Die Nachricht hat die maximale L\xE4nge \xFCberschritten";
  var messageWrongLength = "Die Nachricht hat eine inkorrekte L\xE4nge";
  var messageCriteriaError = "So kannst du die Nachricht nicht absenden.";
  var alreadyAccount = "Du hast bereits ein Konto?";
  var enterAccount = "Logge dich in dein Konto ein";
  var createAccount = "Erstelle ein Konto";
  var loginReason = "Dein Grund zum Einloggen";
  var noAccount = "Noch kein Konto?";
  var secondsAgo = "Vor $n Sekunden";
  var secondAgo = "Vor einer Sekunde";
  var minutesAgo = "Vor $n Minuten";
  var minuteAgo = "Vor einer Minute";
  var hoursAgo = "Vor $n Stunden";
  var hourAgo = "Vor einer Stunde";
  var daysAgo = "Vor $n Tagen";
  var dayAgo = "Vor einem Tag";
  var weeksAgo = "Vor $n Wochen";
  var weekAgo = "Vor einer Woche";
  var monthsAgo = "Vor $n Monaten";
  var monthAgo = "Vor einem Monat";
  var yearsAgo = "Vor $n Jahren";
  var yearAgo = "Vor einem Jahr";
  var de_DE_default = {
    home,
    presentation,
    general,
    installApp,
    uninstallApp,
    install,
    isInstalled,
    login,
    userSettings,
    settings,
    register,
    logout,
    comments,
    error,
    following,
    followers,
    navigation,
    visitUser,
    send,
    name,
    changeName,
    changeNameSuccess,
    changeNameFailed,
    close,
    follow,
    unfollow,
    editPost,
    deletePost,
    deletePostSure,
    deletePostSuccess,
    deletePostFailed,
    continue: continue2,
    abort,
    edited,
    actionComment,
    deleteComment,
    showPostMenu,
    save,
    removeImage,
    uploadImage,
    deleteAccount,
    deleteAccountSure,
    deleteAccountInfo,
    authError,
    progressiveWebApp,
    followingError,
    unsupportedFileType,
    clickToCopy,
    username,
    email,
    password,
    currentPassword,
    passwordChangedSuccess,
    passwordChangedFailed,
    changePassword,
    changePasswordTitle,
    passwordReEnter,
    newPassword,
    newPasswordReEnter,
    errorOnUpload,
    loginSuccess,
    loginSuccessMessage,
    loginFailed,
    loginFailedMessage,
    logoutMessage,
    registerSuccess,
    registerFailed,
    passwordsNotSame,
    showPostPreview,
    nUsersLikedThat,
    showComments,
    routeNotFound,
    messageTooShort,
    messageTooLong,
    messageWrongLength,
    messageCriteriaError,
    alreadyAccount,
    enterAccount,
    createAccount,
    loginReason,
    noAccount,
    secondsAgo,
    secondAgo,
    minutesAgo,
    minuteAgo,
    hoursAgo,
    hourAgo,
    daysAgo,
    dayAgo,
    weeksAgo,
    weekAgo,
    monthsAgo,
    monthAgo,
    yearsAgo,
    yearAgo
  };

  // app/helpers/elapsed-time.ts
  function elapsedTime(datetime) {
    let sec = Math.floor((Date.now() - datetime) / 1e3);
    let n2;
    n2 = Math.floor(sec / 31536e3);
    if (n2 == 1) {
      return de_DE_default.yearAgo;
    } else if (n2 > 1) {
      return replace2(de_DE_default.yearsAgo, n2);
    }
    n2 = Math.floor(sec / 2592e3);
    if (n2 == 1) {
      return de_DE_default.monthAgo;
    } else if (n2 > 1) {
      return replace2(de_DE_default.monthsAgo, n2);
    }
    n2 = Math.floor(sec / 604800);
    if (n2 == 1) {
      return de_DE_default.weekAgo;
    } else if (n2 > 1) {
      return replace2(de_DE_default.monthsAgo, n2);
    }
    n2 = Math.floor(sec / 86400);
    if (n2 == 1) {
      return de_DE_default.dayAgo;
    } else if (n2 > 1) {
      return replace2(de_DE_default.daysAgo, n2);
    }
    n2 = Math.floor(sec / 3600);
    if (n2 == 1) {
      return de_DE_default.hourAgo;
    } else if (n2 > 1) {
      return replace2(de_DE_default.hoursAgo, n2);
    }
    n2 = Math.floor(sec / 60);
    if (n2 == 1) {
      return de_DE_default.minuteAgo;
    } else if (n2 > 1) {
      return replace2(de_DE_default.minutesAgo, n2);
    }
    n2 = Math.floor(sec);
    if (n2 == 1) {
      return de_DE_default.secondAgo;
    } else {
      return replace2(de_DE_default.secondsAgo, n2);
    }
  }
  function replace2(text2, time) {
    return text2.replace("$n", time + "");
  }

  // app/helpers/onscreen.ts
  function onScreen(el) {
    const {top, bottom} = el.getBoundingClientRect();
    if ((top && bottom) === 0)
      return false;
    return top < innerHeight && bottom >= 0;
  }

  // app/services/generic.service.ts
  const isLoading = observable(false);
  function activateRoute(href) {
    history.pushState(null, "", href);
    return dispatchEvent(new PopStateEvent("popstate"));
  }
  const Uploaded = observable(false);
  const Uploads = observable([]);
  Uploads.subscribe((images) => Uploaded.set(images.length > 0 ? true : false));

  // app/services/notification.service.tsx
  const BottomRight = reference();
  function push(title, message, options = {
    removeOnClick: false,
    timeout: 5e3
  }) {
    const wrapper = BottomRight.current;
    if (wrapper) {
      wrapper.appendChild(/* @__PURE__ */ doc_exports.h(Notification, {
        title,
        message,
        options
      }));
      wrapper.scrollBy(0, wrapper.scrollHeight);
    }
  }
  function Notification({title, message, options}) {
    const View = /* @__PURE__ */ doc_exports.h(Box, {
      className: "notification",
      arrow: "bottom-right"
    }, /* @__PURE__ */ doc_exports.h(Header, {
      if: !!title
    }, title || ""), /* @__PURE__ */ doc_exports.h("div", {
      className: "notification-message"
    }, message));
    if (options.timeout)
      setTimeout(() => View.remove(), options.timeout);
    if (options.removeOnClick)
      onEvent(View, "click", () => View.remove());
    return View;
  }
  document.body.appendChild(/* @__PURE__ */ doc_exports.h("div", {
    id: "notifications"
  }, /* @__PURE__ */ doc_exports.h("div", {
    ref: BottomRight,
    className: "notification-wrapper"
  })));

  // app/services/http.service.ts
  const http_service_exports = {};
  __export(http_service_exports, {
    del: () => del,
    get: () => get,
    patch: () => patch,
    post: () => post,
    put: () => put
  });
  const token = () => localStorage.getItem("token");
  const httpHeaders = () => {
    const localToken = token();
    const headers = {
      "Content-Type": "application/json"
    };
    if (localToken) {
      headers["Authorize"] = "Bearer " + localToken;
      headers["Authorization"] = "Bearer " + localToken;
    }
    return headers;
  };
  function createHttp(method, body, options) {
    var _a;
    if (!options)
      options = {};
    if (!options.responseType)
      options.responseType = "json";
    let _headers = ((_a = options.init) == null ? void 0 : _a.headers) || {};
    let headers = __assign(__assign({}, httpHeaders()), _headers);
    for (let key in _headers) {
      if (!_headers[key]) {
        delete headers[key];
      }
    }
    let init = {headers, method, body};
    return [options, init];
  }
  async function f(url2, method, body, options) {
    try {
      let [opt, init] = createHttp(method, body, options);
      let response = await fetch(url2, init);
      let data = await response[opt.responseType]();
      return [data, response, null];
    } catch (error2) {
      return [null, null, error2];
    }
  }
  const get = (url2, opt) => f(url2, "GET", null, opt);
  const post = (url2, body, opt) => f(url2, "POST", body, opt);
  const put = (url2, body, opt) => f(url2, "PUT", body, opt);
  const del = (url2, body, opt) => f(url2, "DELETE", body, opt);
  const patch = (url2, body, opt) => f(url2, "PATCH", body, opt);

  // app/services/post.service.ts
  const URL2 = "http://localhost:5000";
  const API_VERSION = 1;
  const API_URL = `${URL2}/api/v${API_VERSION}/posts`;
  const API_POSTS_ID = API_URL + "/";
  const API_POSTS_LIKE = API_URL + "/like/";
  const API_MEDIA = URL2 + "/api/v" + API_VERSION + "/media/";
  const Posts = observable([]);
  const localById = (postId) => Posts.value().find((post5) => post5.id === postId);
  const hasPost = async (postId) => !!await getPost(postId);
  const sort = (a, b) => b.datePosted - a.datePosted;
  async function load(username2 = null, page = 1, size = 50) {
    let url2 = [];
    if (username2)
      url2.push(`Username=${username2}`);
    if (page)
      url2.push(`Page=${page}`);
    if (size)
      url2.push(`Size=${size}`);
    let query = url2.join("&");
    if (query.length > 0)
      query = "?" + query;
    let [postRes, res] = await get(API_URL + query);
    if (![200, 204].includes(res == null ? void 0 : res.status))
      return;
    if (postRes == null ? void 0 : postRes.data)
      Posts.set(postRes.data);
  }
  async function getPost(postId) {
    let [wrapper, res] = await get(API_POSTS_ID + postId);
    if ([200, 204].includes(res == null ? void 0 : res.status)) {
      if (!localById(wrapper.data.id)) {
        Posts.value().push(wrapper.data);
      }
      return wrapper.data;
    }
  }
  async function add(content) {
    const body = JSON.stringify({content});
    let [_, res] = await post(API_URL, body);
    return (res == null ? void 0 : res.status) === 200;
  }
  async function del2(postId) {
    let [_, res] = await del(API_POSTS_ID + postId);
    if ([200, 204].includes(res == null ? void 0 : res.status)) {
      push(null, de_DE_default.deletePostSuccess);
      Posts.update((list) => {
        const idx = list.findIndex((post5) => post5.id === postId);
        if (idx >= 0)
          list.splice(idx, 1);
      });
    } else {
      push(null, de_DE_default.deletePostFailed);
    }
    return (res == null ? void 0 : res.status) === 204;
  }
  async function like(postId) {
    let post5 = localById(postId);
    let method = post5.liked ? "del" : "post";
    let [_, res] = await http_service_exports[method](API_POSTS_LIKE + postId, "{}");
    if (res.status !== 200)
      return false;
    let [w2, r2] = await get(API_POSTS_ID + postId);
    if (r2.status !== 200)
      return false;
    patchOne(postId, w2.data);
    return true;
  }
  function patchOne(id, newData) {
    let post5 = localById(id);
    if (post5)
      for (let key in newData)
        post5[key] = newData[key];
  }
  async function loadComments(id) {
    var _a;
    let [wrapper] = await get(API_URL + "/" + id + "/comments");
    return ((_a = wrapper == null ? void 0 : wrapper.data) == null ? void 0 : _a.length) ? wrapper.data : [];
  }
  async function addComment(id, content) {
    let body = JSON.stringify({content});
    let [wrapper, res] = await post(API_URL + "/" + id + "/comments", body);
    return (res == null ? void 0 : res.status) === 200;
  }
  async function addMedia(file) {
    var _a;
    let formData = new FormData();
    formData.append("file", file, file.name);
    let [wrapper, res] = await post(API_MEDIA, formData, {
      init: {headers: {"Content-Type": null}}
    });
    if ((res == null ? void 0 : res.status) !== 200 || !((_a = wrapper == null ? void 0 : wrapper.data) == null ? void 0 : _a.guid)) {
      return;
    }
    return wrapper.data.guid;
  }
  async function delMedia(guid) {
    return false;
    let [wrapper, res] = await del(API_MEDIA + guid);
    return (res == null ? void 0 : res.status) === 200;
  }

  // app/components/mu.component.tsx
  directive("isBox", (el) => el.classList.add("box"));
  function Box(props, ...children4) {
    if (!props)
      props = {};
    return /* @__PURE__ */ doc_exports.h("div", __assign(__assign({}, props), {
      isBox: true
    }), !props.arrow ? void 0 : /* @__PURE__ */ doc_exports.h("div", {
      className: "arrow arrow-" + props.arrow
    }), /* @__PURE__ */ doc_exports.h("div", {
      className: "box-content"
    }, children4));
  }
  directive("isLabel", (el) => el.classList.add("label"));
  function Label(props, ...children4) {
    return /* @__PURE__ */ doc_exports.h("div", __assign(__assign({}, props), {
      isLabel: true
    }), /* @__PURE__ */ doc_exports.h("label", {
      className: "label-content"
    }, props.labelText), children4);
  }
  directive("isButton", (el) => el.classList.add("button"));
  function Button(props, ...children4) {
    if (!props)
      props = {};
    return /* @__PURE__ */ doc_exports.h("button", __assign(__assign({}, props), {
      isButton: true
    }), /* @__PURE__ */ doc_exports.h("div", {
      className: "button-content"
    }, children4));
  }
  directive("isHeader", (el) => el.classList.add("header"));
  function Header(props, ...children4) {
    if (!props)
      props = {};
    return /* @__PURE__ */ doc_exports.h("header", __assign(__assign({}, props), {
      isHeader: true
    }), /* @__PURE__ */ doc_exports.h("div", {
      className: "title header-content"
    }, children4), /* @__PURE__ */ doc_exports.h(Seperator, null));
  }
  directive("isFooter", (el) => el.classList.add("footer"));
  function Footer(props, ...children4) {
    if (!props)
      props = {};
    return /* @__PURE__ */ doc_exports.h("footer", __assign(__assign({}, props), {
      isFooter: true
    }), /* @__PURE__ */ doc_exports.h(Seperator, null), /* @__PURE__ */ doc_exports.h("div", {
      className: "footer-content"
    }, children4));
  }
  function Input(props) {
    return /* @__PURE__ */ doc_exports.h("div", {
      className: "input"
    }, /* @__PURE__ */ doc_exports.h("input", __assign({}, props)));
  }
  function TextArea(props) {
    return /* @__PURE__ */ doc_exports.h("div", {
      className: "input"
    }, /* @__PURE__ */ doc_exports.h("textarea", __assign({}, props)));
  }
  function Seperator() {
    return /* @__PURE__ */ doc_exports.h("span", {
      className: "seperator"
    });
  }
  function Icon(_a) {
    var {name: name2} = _a, props = __rest(_a, ["name"]);
    let className = "icon icon-";
    let iconName = "icon-" + name2;
    if (name2)
      className += name2;
    if (props.className) {
      className += " " + props.className;
      delete props.className;
    }
    const View = /* @__PURE__ */ doc_exports.h("i", __assign({
      className,
      setIcon
    }, props));
    return View;
    function setIcon(name3) {
      View.classList.replace(iconName, "icon-" + name3);
      iconName = "icon-" + name3;
    }
  }
  function Writer({placeholder, value, ref}, ...children4) {
    const TextAreaRef = reference();
    const MarkDownContent = reference();
    const Visible = observable(false);
    return /* @__PURE__ */ doc_exports.h("div", {
      className: "box writer",
      getValues,
      ref,
      clear
    }, /* @__PURE__ */ doc_exports.h("div", null, /* @__PURE__ */ doc_exports.h(TextArea, {
      ref: TextAreaRef,
      oninput: writeMarkDown,
      placeholder: placeholder || "",
      value: value || ""
    }), /* @__PURE__ */ doc_exports.h("span", {
      tooltip: de_DE_default.showPostPreview
    }, /* @__PURE__ */ doc_exports.h(Icon, {
      name: "magnifier",
      className: "toggle-post-preview",
      onclick: toggleVisibility,
      styles: {cursor: "pointer"}
    }))), /* @__PURE__ */ doc_exports.h(Footer, null, /* @__PURE__ */ doc_exports.h("div", {
      className: "mark-down-wrapper",
      if: Visible
    }, /* @__PURE__ */ doc_exports.h("div", {
      className: "box mark-down",
      ref: MarkDownContent
    }), /* @__PURE__ */ doc_exports.h(Seperator, null)), children4));
    function clear() {
      TextAreaRef.current.value = "";
      MarkDownContent.current.innerHTML = "";
      Visible.set(false);
    }
    function getValues() {
      const el = MarkDownContent.current;
      const text2 = TextAreaRef.current;
      if (el && text2) {
        return {
          raw: text2.value,
          rich: el.innerHTML
        };
      }
    }
    function writeMarkDown() {
      const el = MarkDownContent.current;
      const text2 = TextAreaRef.current;
      if (el && text2) {
        el.innerHTML = translateMarkDown(text2.value);
      }
    }
    function toggleVisibility() {
      Visible.set(!Visible.value());
    }
  }
  function Time(_a) {
    var {datetime} = _a, props = __rest(_a, ["datetime"]);
    const InnerText = observable(elapsedTime(datetime));
    const View = /* @__PURE__ */ doc_exports.h("time", __assign({
      dateTime: datetime,
      innerText: InnerText,
      interval: [intervalFn, 5e3]
    }, props));
    function intervalFn() {
      if (onScreen(View))
        InnerText.set(elapsedTime(datetime));
    }
    return View;
  }
  directive("isUploadItem", (el) => el.classList.add("upload-item"));
  function UploadItemElement(props) {
    return /* @__PURE__ */ doc_exports.h("div", __assign(__assign({}, props), {
      isUploadItem: true
    }), /* @__PURE__ */ doc_exports.h("img", {
      src: props.preview,
      className: "upload-image"
    }), /* @__PURE__ */ doc_exports.h("div", {
      className: "upload-text"
    }, props.fileName), /* @__PURE__ */ doc_exports.h("div", null, /* @__PURE__ */ doc_exports.h(Icon, {
      name: "clipboard",
      copyToClipboard: `![${props.fileName}](${props.preview})`,
      className: "upload-action"
    }), /* @__PURE__ */ doc_exports.h(Icon, {
      tooltip: de_DE_default.removeImage,
      name: "x-red",
      onclick: removeUpload,
      className: "upload-action"
    })));
    function removeUpload() {
      Uploads.update((files) => {
        let idx = files.findIndex((file) => file.key === props.key);
        if (idx >= 0) {
          files.splice(idx, 1);
          delMedia(props.key);
        }
      });
    }
  }
  directive("isMenu", (el) => el.classList.add("menu"));
  function Menu(props, ...children4) {
    return /* @__PURE__ */ doc_exports.h("ul", __assign(__assign({}, props), {
      isMenu: true,
      isBox: true
    }), children4);
  }
  directive("isMenuItem", (el) => el.classList.add("menu-item"));
  function MenuItem(props, ...children4) {
    return /* @__PURE__ */ doc_exports.h("li", __assign(__assign({}, props), {
      isMenuItem: true
    }), children4);
  }

  // app/helpers/adjust-card-position.ts
  function adjustCardPosition(top, left) {
    top -= 50;
    left -= 50;
    if (top < 0) {
      top = 0;
    }
    if (innerHeight - top < 200) {
      top = innerHeight - 200;
    }
    return [top, left];
  }

  // app/config/settings.ts
  const notification = {
    removeOnClick: true,
    timeout: 5e3
  };
  const MAX_FILE_SIZE = 5242880;

  // node_modules/jwt-decode/build/jwt-decode.esm.js
  function e(e2) {
    this.message = e2;
  }
  e.prototype = new Error(), e.prototype.name = "InvalidCharacterError";
  var r = typeof window != "undefined" && window.atob && window.atob.bind(window) || function(r2) {
    var t2 = String(r2).replace(/=+$/, "");
    if (t2.length % 4 == 1)
      throw new e("'atob' failed: The string to be decoded is not correctly encoded.");
    for (var n2, o2, a = 0, i = 0, c = ""; o2 = t2.charAt(i++); ~o2 && (n2 = a % 4 ? 64 * n2 + o2 : o2, a++ % 4) ? c += String.fromCharCode(255 & n2 >> (-2 * a & 6)) : 0)
      o2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(o2);
    return c;
  };
  function t(e2) {
    var t2 = e2.replace(/-/g, "+").replace(/_/g, "/");
    switch (t2.length % 4) {
      case 0:
        break;
      case 2:
        t2 += "==";
        break;
      case 3:
        t2 += "=";
        break;
      default:
        throw "Illegal base64url string!";
    }
    try {
      return function(e3) {
        return decodeURIComponent(r(e3).replace(/(.)/g, function(e4, r2) {
          var t3 = r2.charCodeAt(0).toString(16).toUpperCase();
          return t3.length < 2 && (t3 = "0" + t3), "%" + t3;
        }));
      }(t2);
    } catch (e3) {
      return r(t2);
    }
  }
  function n(e2) {
    this.message = e2;
  }
  function o(e2, r2) {
    if (typeof e2 != "string")
      throw new n("Invalid token specified");
    var o2 = (r2 = r2 || {}).header === true ? 0 : 1;
    try {
      return JSON.parse(t(e2.split(".")[o2]));
    } catch (e3) {
      throw new n("Invalid token specified: " + e3.message);
    }
  }
  n.prototype = new Error(), n.prototype.name = "InvalidTokenError";
  var jwt_decode_esm_default = o;

  // app/services/user.service.ts
  const URL3 = "http://localhost:5000";
  const API_VERSION2 = 1;
  const API_URL2 = `${URL3}/api/v${API_VERSION2}`;
  const API_ACCOUNT = "accounts";
  const API_USER = API_URL2 + "/users/";
  const API_FOLLOW = API_USER + "follow/";
  const API_ACCOUNTS = API_URL2 + `/${API_ACCOUNT}`;
  const API_LOGIN = API_URL2 + `/${API_ACCOUNT}/login`;
  const API_REGISTER = API_URL2 + `/${API_ACCOUNT}/register`;
  const API_TOKEN = API_URL2 + `/${API_ACCOUNT}/token`;
  const API_DISPLAY_NAME = API_URL2 + `/${API_ACCOUNT}/displayname`;
  const API_EMAIL = API_URL2 + `/${API_ACCOUNT}/email`;
  const API_PASSWORD = API_URL2 + `/${API_ACCOUNT}/password`;
  const isUser = observable(false);
  const isGuest = observable(true);
  let _currentUser = {};
  const isLoggedIn = isUser.value;
  const currentUser = () => isLoggedIn() ? _currentUser : null;
  const hasUser = async (alias) => !!await getUser(alias);
  async function logout2() {
    isUser.set(false);
    localStorage.removeItem("token");
    push(null, de_DE_default.logoutMessage, notification);
    activateRoute("/login");
  }
  async function login2({alias, password: password2}) {
    var _a;
    let body = JSON.stringify({username: alias, password: password2});
    let [token2, res] = await post(API_LOGIN, body);
    if ((res == null ? void 0 : res.status) === 200 && ((_a = token2 == null ? void 0 : token2.data) == null ? void 0 : _a.accessToken)) {
      setToken(token2.data.accessToken);
      isUser.set(true);
      push(null, de_DE_default.loginSuccessMessage, notification);
    } else {
      isUser.set(false);
      push(null, de_DE_default.loginFailedMessage, notification);
    }
  }
  async function follow2(username2) {
    let [_, res] = await post(API_FOLLOW + username2);
    return (res == null ? void 0 : res.status) === 2e3;
  }
  async function unfollow2(username2) {
    let [_, res] = await del(API_FOLLOW + username2);
    return (res == null ? void 0 : res.status) === 2e3;
  }
  async function followers2(username2) {
    let [wrapper] = await get(API_USER + `${username2}/followers`);
    return (wrapper == null ? void 0 : wrapper.data) && wrapper.data.length ? wrapper.data : [];
  }
  async function following2(username2) {
    let [wrapper] = await get(API_USER + `${username2}/following`);
    return (wrapper == null ? void 0 : wrapper.data) && wrapper.data.length ? wrapper.data : [];
  }
  async function patchDisplayName(displayName) {
    let body = JSON.stringify({displayName});
    let [_, res] = await patch(API_DISPLAY_NAME, body);
    if ((res == null ? void 0 : res.status) === 200) {
      push(null, de_DE_default.changeNameSuccess, notification);
      _currentUser.alias = displayName;
      _currentUser.displayName = displayName;
      return true;
    }
    push(null, de_DE_default.changeNameFailed, notification);
    return false;
  }
  async function patchPassword(currentPassword2, newPassword2) {
    let body = JSON.stringify({currentPassword1: currentPassword2, newPassword: newPassword2});
    let [_, res] = await patch(API_PASSWORD, body);
    if ((res == null ? void 0 : res.status) === 200) {
      push(null, de_DE_default.passwordChangedSuccess, notification);
      return true;
    }
    push(null, de_DE_default.passwordChangedFailed, notification);
    return false;
  }
  async function deleteAccount2() {
    let [wrapper, res] = await del(API_ACCOUNTS, "{}");
    if ((res == null ? void 0 : res.status) === 200) {
      isUser.set(false);
      localStorage.removeItem("token");
      activateRoute("/register");
      return true;
    }
    return false;
  }
  async function refreshToken() {
    var _a;
    let token2 = getToken();
    if (token2) {
      const diff = (token2.exp - Math.round(Date.now() / 1e3)) / 3600;
      if (diff <= 24) {
        let [wrapper, res] = await get(API_TOKEN);
        if ((_a = wrapper == null ? void 0 : wrapper.data) == null ? void 0 : _a.accessToken) {
          setToken(wrapper.data.accessToken);
        }
        isUser.set((res == null ? void 0 : res.status) === 200);
      } else {
        isUser.set(true);
      }
    } else {
      isUser.set(false);
    }
  }
  async function register2({alias, displayName, email: email2, password: password2}) {
    let body = JSON.stringify({email: email2, username: alias, password: password2, displayName});
    let [_, res] = await post(API_REGISTER, body);
    if ((res == null ? void 0 : res.status) === 200) {
      push(null, de_DE_default.registerSuccess, notification);
      activateRoute("/login");
    } else {
      push(null, de_DE_default.registerFailed, notification);
    }
  }
  isUser.subscribe(async (state) => {
    var _a;
    isGuest.set(state ? false : true);
    if (state === false)
      _currentUser = {};
    if (state === true) {
      const alias = (_a = getToken()) == null ? void 0 : _a.sub;
      _currentUser = await getUser(alias);
    }
  });
  function setToken(accessToken) {
    localStorage.setItem("token", accessToken);
  }
  async function getUser(username2) {
    let [wrapper, res] = await get(API_USER + username2);
    if ((res == null ? void 0 : res.status) !== 200)
      return;
    return wrapper.data;
  }
  function getToken() {
    const token2 = localStorage.getItem("token");
    if (token2) {
      return jwt_decode_esm_default(token2);
    }
  }
  refreshToken();

  // app/helpers/colors.ts
  const Colors = {
    black: "#17111a",
    darkRed1: "#372538",
    darkRed2: "#7a213a",
    red: "#e14141",
    lightRed: "#ffa070",
    brownish: "#c44d29",
    orange: "#ffbf36",
    yellow: "#fff275",
    darkBrown: "#753939",
    brown: "#cf7957",
    lightBrown: "#ffd1ab",
    darkGreen: "#39855a",
    green: "#83e04c",
    lightGreen: "#dcff70",
    darkBlue: "#243b61",
    blue: "#3898ff",
    lightBlue: "#6eeeff",
    violet: "#682b82",
    magenta: "#bf3fb3",
    pink: "#ff80aa",
    darkGrey1: "#3e375c",
    darkGrey2: "#7884ab",
    grey: "#b2bcc2",
    white: "#ffffff"
  };
  const ColorKeys = Object.keys(Colors);
  function randomColor() {
    const ran = Math.round(Math.random() * 24 + 1);
    return Colors[ColorKeys[ran]];
  }

  // app/components/user-card.component.tsx
  const UserCardPortal = portal(UserCard);
  const existing = () => document.getElementById("user-card");
  UserCardPortal.onClose(() => {
    var _a;
    return (_a = existing()) == null ? void 0 : _a.remove();
  });
  async function UserCard({alias, top, left}) {
    var _a, _b;
    [top, left] = adjustCardPosition(top, left);
    let yourUserName = (_a = currentUser()) == null ? void 0 : _a.username;
    let user2 = await getUser(alias);
    const followers3 = observable(0);
    const following3 = observable(0);
    const follows = observable(false);
    const followsNot = observable(true);
    follows.subscribe((value) => followsNot.set(!value));
    refreshFollowers();
    refreshFollowing();
    return /* @__PURE__ */ doc_exports.h(Box, {
      styles: {top: `${top}px`, left: `${left}px`},
      id: "user-card",
      onmouseleave: UserCardPortal.close
    }, /* @__PURE__ */ doc_exports.h(Header, null, /* @__PURE__ */ doc_exports.h("div", {
      styles: {display: "flex", gap: "8px", alignItems: "center"}
    }, /* @__PURE__ */ doc_exports.h("div", {
      className: "user-image-wrap"
    }, /* @__PURE__ */ doc_exports.h("div", {
      className: "user-image",
      styles: {backgroundColor: randomColor() + " !important"}
    }), /* @__PURE__ */ doc_exports.h("div", {
      className: "avatar-circle"
    })), /* @__PURE__ */ doc_exports.h("a", {
      href: `/user/${alias}`,
      tooltip: de_DE_default.visitUser.replace("$u", user2.displayName),
      styles: {flex: "1"}
    }, /* @__PURE__ */ doc_exports.h("div", null, user2.displayName), /* @__PURE__ */ doc_exports.h("div", null, "@", user2.username)), alias === yourUserName ? void 0 : /* @__PURE__ */ doc_exports.h(FollowButtons, null)), /* @__PURE__ */ doc_exports.h(Seperator, null), /* @__PURE__ */ doc_exports.h("div", {
      styles: {display: "flex", gap: "8px"}
    }, /* @__PURE__ */ doc_exports.h("div", null, de_DE_default.followers, ": ", followers3), /* @__PURE__ */ doc_exports.h("div", null, de_DE_default.following, ": ", following3))), /* @__PURE__ */ doc_exports.h(Box, {
      arrow: "top-left",
      if: ((_b = user2.description) == null ? void 0 : _b.length) > 0
    }, /* @__PURE__ */ doc_exports.h("span", null, user2.description)));
    function FollowButtons() {
      return /* @__PURE__ */ doc_exports.h("div", {
        className: "cursor-pointer"
      }, /* @__PURE__ */ doc_exports.h("div", {
        if: isUser
      }, /* @__PURE__ */ doc_exports.h(Icon, {
        if: followsNot,
        tooltip: de_DE_default.follow,
        name: "user-follow",
        onclick: follow3
      }), /* @__PURE__ */ doc_exports.h(Icon, {
        if: follows,
        tooltip: de_DE_default.unfollow,
        name: "user-unfollow",
        onclick: unfollow3
      })));
    }
    async function follow3() {
      await follow2(user2.username);
      await refreshFollowers();
      await refreshFollowing();
    }
    async function unfollow3() {
      await unfollow2(user2.username);
      refreshFollowers();
      refreshFollowing();
    }
    async function refreshFollowers() {
      let list = await followers2(alias);
      followers3.set(list.length);
      follows.set(!!list.find((user3) => user3.username === yourUserName));
    }
    async function refreshFollowing() {
      let list = await following2(alias);
      following3.set(list.length);
    }
  }
  var user_card_component_default = UserCardPortal;

  // app/helpers/copy-to-clipboard.ts
  const TextArea2 = document.createElement("textarea");
  document.body.appendChild(TextArea2);
  hide();
  async function copyToClipboard(content) {
    let error2;
    try {
      TextArea2.value = content;
      show();
      copy();
    } catch (err) {
      error2 = err;
    } finally {
      hide();
      return error2;
    }
  }
  function copy() {
    TextArea2.select();
    TextArea2.setSelectionRange(0, TextArea2.value.length);
    document.execCommand("copy");
  }
  function hide() {
    TextArea2.setAttribute("hidden", "true");
  }
  function show() {
    TextArea2.removeAttribute("hidden");
  }

  // app/directives/mu.directive.ts
  directive("user-card", (el, prop) => onEvent(el, "mouseenter", (event) => {
    user_card_component_default.open({alias: prop, top: event.clientY, left: event.clientX});
  }));
  directive("copyToClipboard", (el, prop) => {
    doc_exports.setProperties(el, {tooltip: de_DE_default.clickToCopy.replace("$c", typeof prop === "function" ? prop() : prop)});
    onEvent(el, "click", () => {
      let content;
      if (typeof prop === "function") {
        content = prop();
      } else if (typeof prop === "string") {
        content = prop;
      }
      if (content) {
        copyToClipboard(content);
      }
    });
  });
  directive("tooltip", (el, prop) => {
    el.classList.add("tooltip");
    el.appendChild(doc_exports.createElement("span", {className: "tooltip-text"}, prop));
  });
  directive("routerLink", (el, prop) => onEvent(el, "click", () => activateRoute(prop)));

  // app/components/router.component.tsx
  function Router({routes: routes2}) {
    const View = /* @__PURE__ */ doc_exports.h("div", {
      id: "router"
    });
    router({routes: routes2, target: View}).onLoad(() => isLoading.set(true)).onLoadEnd(() => isLoading.set(false));
    return View;
  }

  // app/components/navigation.component.tsx
  function Navigation() {
    return /* @__PURE__ */ doc_exports.h(Box, {
      id: "navigation"
    }, /* @__PURE__ */ doc_exports.h(Header, {
      classList: "hide-mobile"
    }, de_DE_default.navigation), /* @__PURE__ */ doc_exports.h("div", {
      className: "list"
    }, /* @__PURE__ */ doc_exports.h("a", {
      href: "/"
    }, de_DE_default.home), /* @__PURE__ */ doc_exports.h("a", {
      if: isGuest,
      href: "/login"
    }, de_DE_default.login), /* @__PURE__ */ doc_exports.h("a", {
      if: isGuest,
      href: "/register"
    }, de_DE_default.register), /* @__PURE__ */ doc_exports.h("a", {
      if: isUser,
      href: "/settings"
    }, de_DE_default.settings), /* @__PURE__ */ doc_exports.h("a", {
      if: isUser,
      onclick: logout2
    }, de_DE_default.logout)));
  }

  // app/helpers/up-down.ts
  const DownloadElement = document.createElement("a");
  const Reader = new FileReader();
  function up(option) {
    return new Promise((res) => {
      try {
        let input = document.createElement("input");
        input.accept = option.accept;
        input.type = "file";
        input.onchange = (event) => {
          let files = event.target.files;
          if (!files.length)
            return res([null, null]);
          let file = files[0];
          Reader.onload = (event2) => {
            if (option.maxSize && file.size > option.maxSize) {
              return res([null, new Error("Filesize exceeded")]);
            }
            file.data = event2.target.result;
            res([file, null]);
          };
          Reader.onerror = () => res([null, null]);
          Reader.onabort = () => res([null, null]);
          Reader["readAs" + option.readAs](file);
        };
        input.click();
      } catch (error2) {
        res([null, error2]);
      }
    });
  }

  // app/components/comment.component.tsx
  function Comments({postId}) {
    const TextAreaRef = reference();
    const comments2 = observable([]);
    const hasComments = observable(false);
    loadComments2();
    return /* @__PURE__ */ doc_exports.h("div", {
      interval: [loadComments2, 3e4]
    }, /* @__PURE__ */ doc_exports.h("div", {
      if: isUser
    }, /* @__PURE__ */ doc_exports.h(Seperator, null), /* @__PURE__ */ doc_exports.h("form", {
      onsubmit: tryComment,
      styles: {display: "flex", gap: "8px", flexDirection: "column"}
    }, /* @__PURE__ */ doc_exports.h(TextArea, {
      ref: TextAreaRef
    }), /* @__PURE__ */ doc_exports.h(Button, {
      type: "submit",
      styles: {width: "max-content"}
    }, de_DE_default.actionComment))), /* @__PURE__ */ doc_exports.h("div", {
      if: hasComments
    }, /* @__PURE__ */ doc_exports.h(Seperator, null), /* @__PURE__ */ doc_exports.h("div", {
      className: "comments",
      for: {of: comments2, do: Comment, sort}
    })));
    async function tryComment(event) {
      event.preventDefault();
      const value = TextAreaRef.current.value;
      if (!isUser.value()) {
        push(null, de_DE_default.authError);
        return;
      }
      if (!value || value.length < 4) {
        return push(null, de_DE_default.messageCriteriaError);
      }
      let result = await addComment(postId, value);
      if (result) {
        TextAreaRef.current.value = "";
        loadComments2();
      }
    }
    function loadComments2() {
      loadComments(postId).then(($) => {
        comments2.set($);
        hasComments.set($.length > 0);
      });
    }
  }
  function Comment(props) {
    var _a;
    const Owner = ((_a = currentUser()) == null ? void 0 : _a.username) === props.user.alias;
    return /* @__PURE__ */ doc_exports.h("div", {
      className: "comment"
    }, /* @__PURE__ */ doc_exports.h("div", {
      className: "comment-flex",
      styles: {flexDirection: Owner ? "row-reverse" : "row"}
    }, /* @__PURE__ */ doc_exports.h("div", {
      className: "user-image",
      "user-card": props.user.alias,
      styles: {backgroundColor: randomColor() + " !important"}
    }), /* @__PURE__ */ doc_exports.h(Box, {
      arrow: Owner ? "top-right" : "top-left"
    }, /* @__PURE__ */ doc_exports.h("div", {
      className: "top"
    }, /* @__PURE__ */ doc_exports.h("div", {
      className: "comment-author"
    }, props.user.alias), /* @__PURE__ */ doc_exports.h(Time, {
      datetime: props.datePosted * 1e3,
      className: "datetime"
    })), /* @__PURE__ */ doc_exports.h("div", null, props.textContent))));
  }

  // app/components/post.component.tsx
  function Post(props) {
    const visible = observable("post opacity-0");
    const MenuPortal = portal(PostMenu);
    const DeletePostPortal = portal(DeletePostMenu);
    return /* @__PURE__ */ doc_exports.h("div", {
      className: visible,
      interval: [intervalFn, 250]
    }, /* @__PURE__ */ doc_exports.h("div", {
      styles: {display: "flex", gap: "8px"}
    }, /* @__PURE__ */ doc_exports.h("div", null, /* @__PURE__ */ doc_exports.h("div", {
      className: "user-image-wrap",
      "user-card": props.user.alias
    }, /* @__PURE__ */ doc_exports.h("div", {
      className: "user-image",
      styles: {backgroundColor: randomColor() + " !important"}
    }), /* @__PURE__ */ doc_exports.h("div", {
      className: "avatar-circle"
    }))), /* @__PURE__ */ doc_exports.h(Box, {
      className: "post-content",
      arrow: "top-left"
    }, /* @__PURE__ */ doc_exports.h(Header, null, /* @__PURE__ */ doc_exports.h("div", {
      className: "wrap-ellipsis",
      styles: {width: "50%"}
    }, props.user.displayName, /* @__PURE__ */ doc_exports.h("span", {
      className: "user-alias"
    }, "@", props.user.alias)), /* @__PURE__ */ doc_exports.h("div", {
      className: "datetime"
    }, /* @__PURE__ */ doc_exports.h(Time, {
      datetime: props.datePosted * 1e3,
      className: "hide-mobile"
    }), /* @__PURE__ */ doc_exports.h("span", {
      if: props.datePosted !== props.dateEdited,
      tooltip: de_DE_default.edited
    }, "*"), /* @__PURE__ */ doc_exports.h(Icon, {
      name: "calendar",
      tooltip: elapsedTime(props.datePosted * 1e3)
    }))), /* @__PURE__ */ doc_exports.h("div", {
      className: "user-content"
    }, /* @__PURE__ */ doc_exports.h(TextContainer, {
      postId: props.id,
      data: props.textContent
    })), /* @__PURE__ */ doc_exports.h(Footer, null, /* @__PURE__ */ doc_exports.h("div", {
      styles: {display: "flex", gap: "8px", alignItems: "center"}
    }, /* @__PURE__ */ doc_exports.h(HeartContainer, {
      likeAmount: props.likeAmount,
      postId: props.id
    }), /* @__PURE__ */ doc_exports.h(CommentContainer, {
      userAlias: props.user.alias,
      postId: props.id,
      commentsAmount: props.commentsAmount
    }), /* @__PURE__ */ doc_exports.h("div", {
      className: "post-menu",
      tooltip: de_DE_default.showPostMenu
    }, /* @__PURE__ */ doc_exports.h(Icon, {
      if: isUser,
      name: "menu-meatballs",
      onclick: MenuPortal.open
    })), /* @__PURE__ */ doc_exports.h("span", {
      styles: {position: "absolute", bottom: "0", right: "0"}
    }, /* @__PURE__ */ doc_exports.h("div", {
      portal: MenuPortal
    }), /* @__PURE__ */ doc_exports.h("div", {
      portal: DeletePostPortal
    })))), !props.showComments ? void 0 : /* @__PURE__ */ doc_exports.h(Comments, {
      postId: props.id
    }))));
    function PostMenu() {
      var _a;
      const Owner = ((_a = currentUser()) == null ? void 0 : _a.username) === props.user.alias;
      return /* @__PURE__ */ doc_exports.h(Menu, {
        onmouseleave: MenuPortal.close
      }, /* @__PURE__ */ doc_exports.h(MenuItem, null, /* @__PURE__ */ doc_exports.h("a", {
        href: `/user/${props.user.alias}/post/${props.id}`
      }, de_DE_default.comments)), /* @__PURE__ */ doc_exports.h(MenuItem, {
        if: Owner,
        onclick: DeletePostPortal.open
      }, de_DE_default.deletePost));
    }
    function DeletePostMenu() {
      return /* @__PURE__ */ doc_exports.h(Menu, {
        onmouseleave: firstMenu
      }, /* @__PURE__ */ doc_exports.h(Header, null, de_DE_default.deletePostSure), /* @__PURE__ */ doc_exports.h("div", {
        styles: {margin: "0 auto", width: "max-content"}
      }, /* @__PURE__ */ doc_exports.h("div", {
        styles: {display: "flex", gap: "8px"}
      }, /* @__PURE__ */ doc_exports.h(Button, {
        onclick: () => del2(props.id)
      }, de_DE_default.continue), /* @__PURE__ */ doc_exports.h(Button, {
        onclick: firstMenu
      }, de_DE_default.abort))));
    }
    function intervalFn(el) {
      visible.set(`post opacity-${onScreen(el) ? "1" : "0"}`);
    }
    function firstMenu() {
      DeletePostPortal.close();
      MenuPortal.open(null);
    }
  }
  function TextContainer({postId, data}) {
    const Text = observable(data);
    const MD = observable("");
    Text.subscribe((txt) => MD.set(translateMarkDown(txt)));
    return /* @__PURE__ */ doc_exports.h(Box, {
      className: "text-content",
      interval: [refreshFn, 1e4]
    }, /* @__PURE__ */ doc_exports.h("div", {
      innerHTML: MD,
      className: "mark-down"
    }));
    function refreshFn(el) {
      if (!onScreen(el))
        return;
      let post5 = localById(postId);
      if (!post5)
        return;
      Text.set(post5.textContent);
    }
  }
  function HeartContainer({likeAmount, postId}) {
    const likes = observable(String(likeAmount));
    const HeartRef = reference();
    return /* @__PURE__ */ doc_exports.h("div", {
      className: "heart-action",
      styles: {display: "flex", gap: "8px", alignItems: "center"},
      if: isUser,
      mount: refreshFn,
      interval: [refreshFn, 250],
      tooltip: [likes, de_DE_default.nUsersLikedThat]
    }, /* @__PURE__ */ doc_exports.h(Icon, {
      ref: HeartRef,
      name: "heart-grey",
      onclick: () => like(postId),
      className: "wiggle-vertical",
      styles: {cursor: "pointer"}
    }), /* @__PURE__ */ doc_exports.h("span", null, likes));
    function refreshFn(el) {
      if (!onScreen(el) && isUser.value())
        return;
      let post5 = localById(postId);
      if (!post5)
        return;
      likes.set(String(post5.likeAmount));
      HeartRef.current.setIcon(post5.liked ? "heart-red" : "heart-grey");
    }
  }
  function CommentContainer({userAlias, postId, commentsAmount}) {
    const comments2 = observable(String(commentsAmount));
    return /* @__PURE__ */ doc_exports.h("a", {
      href: `/user/${userAlias}/post/${postId}`,
      className: "comment-action",
      tooltip: de_DE_default.showComments,
      interval: [refreshFn, 250]
    }, /* @__PURE__ */ doc_exports.h("div", {
      styles: {display: "flex", gap: "8px", alignItems: "center"}
    }, /* @__PURE__ */ doc_exports.h(Icon, {
      name: "comment-bubbles-grey",
      className: "post-comment"
    }), /* @__PURE__ */ doc_exports.h("span", null, comments2)));
    function refreshFn(el) {
      if (!onScreen(el) && isUser.value())
        return;
      let post5 = localById(postId);
      if (!post5)
        return;
      comments2.set(String(post5.commentsAmount));
    }
  }

  // app/views/home.view.tsx
  async function HomeView() {
    await load();
    return /* @__PURE__ */ doc_exports.h("div", {
      styles: {display: "flex", flexDirection: "column", gap: "8px"}
    }, /* @__PURE__ */ doc_exports.h("div", {
      if: isUser
    }, /* @__PURE__ */ doc_exports.h(HomeWriter, null)), /* @__PURE__ */ doc_exports.h("div", {
      for: {of: Posts, do: Post, sort, limit: 5}
    }));
  }
  function HomeWriter() {
    const WriterRef = reference();
    return /* @__PURE__ */ doc_exports.h("form", {
      onsubmit: tryPost,
      destroy: () => Uploads.set([])
    }, /* @__PURE__ */ doc_exports.h(Writer, {
      ref: WriterRef
    }, /* @__PURE__ */ doc_exports.h("div", {
      styles: {display: "flex", gap: "8px"}
    }, /* @__PURE__ */ doc_exports.h(Button, {
      type: "submit"
    }, de_DE_default.send), /* @__PURE__ */ doc_exports.h(Button, {
      type: "button",
      onclick: uploadImage2
    }, de_DE_default.uploadImage)), /* @__PURE__ */ doc_exports.h("div", {
      if: Uploaded
    }, /* @__PURE__ */ doc_exports.h(Seperator, null), /* @__PURE__ */ doc_exports.h("div", {
      styles: {display: "flex", flexDirection: "column-reverse", gap: "8px"},
      for: {
        of: Uploads,
        do: (props) => /* @__PURE__ */ doc_exports.h(UploadItemElement, {
          key: props.key,
          preview: props.preview,
          fileName: props.fileName
        })
      }
    }))));
    async function uploadImage2() {
      let [file, error2] = await up({accept: "image/*", readAs: "BinaryString", maxSize: MAX_FILE_SIZE});
      if (error2) {
        return push(null, de_DE_default.followingError.replace("$e", error2.message));
      }
      if (!file.type.startsWith("image/")) {
        return push(null, de_DE_default.unsupportedFileType.replace("$t", file.type));
      }
      if (!file.data)
        return push(null, de_DE_default.errorOnUpload);
      let guid = await addMedia(file);
      if (!guid)
        return push(null, de_DE_default.errorOnUpload);
      Uploads.update(($) => $.push({key: guid, fileName: file.name, preview: API_MEDIA + guid}));
    }
    function getValues() {
      var _a;
      return {text: (_a = WriterRef.current.getValues()) == null ? void 0 : _a.raw};
    }
    async function tryPost(event) {
      event.preventDefault();
      if (!isUser.value()) {
        push(null, de_DE_default.authError);
        return false;
      }
      const values = getValues();
      if (!values.text)
        return push(null, de_DE_default.messageCriteriaError);
      let success = await add(values.text);
      if (success) {
        WriterRef.current.clear();
        Uploads.set([]);
        load();
      }
    }
  }

  // lang/de_DE.progressiveWebAppText.ts
  var de_DE_progressiveWebAppText_default = `Durch die Installation dieser Anwendung werden einige Inhalte (wie z. B. Grafiken) lokal auf dem Ger\xE4t hinterlegt, damit diese
  nicht mehr heruntergeladen werden m\xFCssen, wenn Sie diese Seite wieder besuchen.`;

  // app/services/install.service.ts
  const isInstalled2 = observable(false);
  const isNotInstalled = observable(true);
  isInstalled2.subscribe((state) => isNotInstalled.set(!state));
  async function install2() {
    if ("serviceWorker" in navigator) {
      await navigator.serviceWorker.register("serviceworker.js");
      isInstalled2.set(true);
    }
  }
  async function uninstall() {
    if ("serviceWorker" in navigator) {
      let registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        if (registration)
          registration.unregister();
      }
    }
    isInstalled2.set(false);
  }
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistration("serviceworker.js").then((registration) => {
      if (registration && registration.active) {
        isInstalled2.set(!!registration.active);
      } else {
        isInstalled2.set(false);
      }
    }).catch(() => isInstalled2.set(false));
  }

  // app/views/settings.view.tsx
  async function SettingsView() {
    return /* @__PURE__ */ doc_exports.h("div", {
      id: "settings",
      styles: {display: "flex", flexDirection: "column", gap: "8px"}
    }, /* @__PURE__ */ doc_exports.h(ChangeNameView, null), /* @__PURE__ */ doc_exports.h(ChangePasswordView, null), /* @__PURE__ */ doc_exports.h(DeleteAccountView, null), /* @__PURE__ */ doc_exports.h(ProgressiveView, null));
  }
  function ChangeNameView() {
    const Name = {
      changed: observable(false),
      reference: reference()
    };
    return /* @__PURE__ */ doc_exports.h(Box, null, /* @__PURE__ */ doc_exports.h(Header, null, de_DE_default.changeName), /* @__PURE__ */ doc_exports.h(Label, {
      labelText: de_DE_default.name
    }, /* @__PURE__ */ doc_exports.h(Input, {
      ref: Name.reference,
      type: "text",
      placeholder: de_DE_default.name,
      oninput: () => Name.changed.set(!!Name.reference.current.value)
    })), /* @__PURE__ */ doc_exports.h("div", {
      if: Name.changed
    }, /* @__PURE__ */ doc_exports.h(Footer, null, /* @__PURE__ */ doc_exports.h(Button, {
      type: "button",
      onclick: changeNameEvent
    }, de_DE_default.save))));
    async function changeNameEvent() {
      let success = await patchDisplayName(Name.reference.current.value);
      if (success)
        Name.reference.current.value = "";
    }
  }
  function ProgressiveView() {
    return /* @__PURE__ */ doc_exports.h(Box, null, /* @__PURE__ */ doc_exports.h(Header, null, de_DE_default.progressiveWebApp), /* @__PURE__ */ doc_exports.h(Box, null, de_DE_progressiveWebAppText_default), /* @__PURE__ */ doc_exports.h(Footer, null, /* @__PURE__ */ doc_exports.h(Button, {
      if: isNotInstalled,
      onclick: install2
    }, de_DE_default.installApp), /* @__PURE__ */ doc_exports.h(Button, {
      if: isInstalled2,
      onclick: uninstall
    }, de_DE_default.uninstallApp)));
  }
  function DeleteAccountView() {
    const DeleteContinue = observable(false);
    return /* @__PURE__ */ doc_exports.h(Box, null, /* @__PURE__ */ doc_exports.h(Header, null, de_DE_default.deleteAccount), /* @__PURE__ */ doc_exports.h(Box, null, de_DE_default.deleteAccountInfo), /* @__PURE__ */ doc_exports.h(Footer, null, /* @__PURE__ */ doc_exports.h(Button, {
      type: "button",
      onclick: () => DeleteContinue.set(!DeleteContinue.value())
    }, de_DE_default.deleteAccount), /* @__PURE__ */ doc_exports.h(Button, {
      type: "button",
      onclick: () => deleteAccount2(),
      if: DeleteContinue
    }, de_DE_default.continue)));
  }
  function ChangePasswordView() {
    const Passwords = {
      changed: observable(false),
      changable: observable(false),
      references: [reference(), reference(), reference()]
    };
    return /* @__PURE__ */ doc_exports.h(Box, null, /* @__PURE__ */ doc_exports.h(Header, null, de_DE_default.changePasswordTitle), /* @__PURE__ */ doc_exports.h(Label, {
      labelText: de_DE_default.currentPassword
    }, /* @__PURE__ */ doc_exports.h(Input, {
      name: "password",
      ref: Passwords.references[0],
      type: "password",
      placeholder: "********",
      oninput: passwordEvent
    })), /* @__PURE__ */ doc_exports.h("div", {
      styles: {display: "flex", flexDirection: "row", gap: "8px"}
    }, /* @__PURE__ */ doc_exports.h(Label, {
      labelText: de_DE_default.newPassword
    }, /* @__PURE__ */ doc_exports.h(Input, {
      name: "password",
      ref: Passwords.references[1],
      type: "password",
      placeholder: "********",
      oninput: passwordEvent
    })), /* @__PURE__ */ doc_exports.h(Label, {
      labelText: de_DE_default.newPasswordReEnter
    }, /* @__PURE__ */ doc_exports.h(Input, {
      name: "password",
      ref: Passwords.references[2],
      type: "password",
      placeholder: "********",
      oninput: passwordEvent
    }))), /* @__PURE__ */ doc_exports.h("div", {
      if: Passwords.changable
    }, /* @__PURE__ */ doc_exports.h(Footer, null, /* @__PURE__ */ doc_exports.h(Button, {
      type: "button",
      onclick: updatePassword
    }, de_DE_default.save))));
    function passwordEvent(event) {
      Passwords.changed.set(!!Passwords.references[0].current.value);
      Passwords.changable.set(Passwords.references[0].current.value && Passwords.references[1].current.value && Passwords.references[2].current.value && Passwords.references[1].current.value === Passwords.references[2].current.value);
    }
    async function updatePassword(event) {
      let success = await patchPassword(Passwords.references[0].current.value, Passwords.references[1].current.value);
      if (success) {
        Passwords.references.forEach((ref) => ref.current.value = "");
      }
    }
  }

  // app/views/login.view.tsx
  async function LoginView() {
    const InputAlias = reference();
    const InputPassword = reference();
    return /* @__PURE__ */ doc_exports.h(Box, {
      id: "login"
    }, /* @__PURE__ */ doc_exports.h(Header, null, de_DE_default.enterAccount), /* @__PURE__ */ doc_exports.h("form", {
      onsubmit: tryLogin
    }, /* @__PURE__ */ doc_exports.h("div", {
      styles: {display: "flex", flexDirection: "column", gap: "8px"}
    }, /* @__PURE__ */ doc_exports.h("div", {
      styles: {display: "flex", gap: "8px"}
    }, /* @__PURE__ */ doc_exports.h(Label, {
      labelText: de_DE_default.username
    }, /* @__PURE__ */ doc_exports.h(Input, {
      ref: InputAlias,
      type: "text",
      placeholder: de_DE_default.username,
      required: "true"
    })), /* @__PURE__ */ doc_exports.h(Label, {
      labelText: de_DE_default.password
    }, /* @__PURE__ */ doc_exports.h(Input, {
      ref: InputPassword,
      type: "password",
      placeholder: "********",
      required: "true"
    }))), /* @__PURE__ */ doc_exports.h(Footer, null, /* @__PURE__ */ doc_exports.h("div", {
      styles: {display: "flex", flexDirection: "row", gap: "8px"}
    }, /* @__PURE__ */ doc_exports.h(Button, {
      type: "submit"
    }, de_DE_default.login), /* @__PURE__ */ doc_exports.h("a", {
      href: "/register"
    }, /* @__PURE__ */ doc_exports.h(Button, {
      type: "button"
    }, de_DE_default.noAccount)))))));
    function getValues() {
      return {
        alias: InputAlias.current.value,
        password: InputPassword.current.value
      };
    }
    async function tryLogin(event) {
      event.preventDefault();
      await login2(getValues());
      if (isUser.value()) {
        activateRoute("/");
      }
    }
  }

  // app/views/user.view.tsx
  async function UserView({alias}) {
    await load(alias);
    return /* @__PURE__ */ doc_exports.h("div", {
      for: {of: Posts, do: Post, sort}
    });
  }

  // app/views/user-post.view.tsx
  async function UserPostView({alias, id}) {
    const post5 = await getPost(parseInt(id));
    return /* @__PURE__ */ doc_exports.h(Post, {
      id: post5.id,
      user: post5.user,
      textContent: post5.textContent,
      liked: post5.liked,
      likeAmount: post5.likeAmount,
      commentsAmount: post5.commentsAmount,
      datePosted: post5.datePosted,
      dateEdited: post5.dateEdited,
      showComments: true
    });
  }

  // app/views/register.view.tsx
  async function RegisterView() {
    const InputAlias = reference();
    const InputName = reference();
    const InputEmail = reference();
    const InputPasswords = [reference(), reference()];
    return /* @__PURE__ */ doc_exports.h(Box, {
      id: "register"
    }, /* @__PURE__ */ doc_exports.h(Header, null, de_DE_default.createAccount), /* @__PURE__ */ doc_exports.h("form", {
      onsubmit: tryRegister
    }, /* @__PURE__ */ doc_exports.h("div", {
      styles: {display: "flex", flexDirection: "column", gap: "8px"}
    }, /* @__PURE__ */ doc_exports.h("div", {
      styles: {display: "flex", flexDirection: "row", gap: "8px"}
    }, /* @__PURE__ */ doc_exports.h(Label, {
      labelText: de_DE_default.username
    }, /* @__PURE__ */ doc_exports.h(Input, {
      name: "alias",
      ref: InputAlias,
      type: "text",
      placeholder: de_DE_default.username,
      required: "true"
    })), /* @__PURE__ */ doc_exports.h(Label, {
      labelText: de_DE_default.name
    }, /* @__PURE__ */ doc_exports.h(Input, {
      name: "name",
      ref: InputName,
      type: "text",
      placeholder: de_DE_default.name,
      required: "true"
    }))), /* @__PURE__ */ doc_exports.h(Label, {
      labelText: de_DE_default.email
    }, /* @__PURE__ */ doc_exports.h(Input, {
      name: "email",
      ref: InputEmail,
      type: "email",
      placeholder: "your@email.com",
      required: "true"
    })), /* @__PURE__ */ doc_exports.h("div", {
      styles: {display: "flex", flexDirection: "row", gap: "8px"}
    }, /* @__PURE__ */ doc_exports.h(Label, {
      labelText: de_DE_default.password
    }, /* @__PURE__ */ doc_exports.h(Input, {
      name: "password",
      ref: InputPasswords[0],
      type: "password",
      placeholder: "********",
      required: "true"
    })), /* @__PURE__ */ doc_exports.h(Label, {
      labelText: de_DE_default.passwordReEnter
    }, /* @__PURE__ */ doc_exports.h(Input, {
      name: "password",
      ref: InputPasswords[1],
      type: "password",
      placeholder: "********",
      required: "true"
    }))), /* @__PURE__ */ doc_exports.h(Footer, null, /* @__PURE__ */ doc_exports.h("div", {
      styles: {display: "flex", flexDirection: "row", gap: "8px"}
    }, /* @__PURE__ */ doc_exports.h(Button, {
      type: "submit"
    }, de_DE_default.register), /* @__PURE__ */ doc_exports.h("a", {
      href: "/login"
    }, /* @__PURE__ */ doc_exports.h(Button, {
      type: "button"
    }, de_DE_default.alreadyAccount)))))));
    function getValues() {
      return {
        alias: InputAlias.current.value,
        name: InputName.current.value,
        email: InputEmail.current.value,
        passwords: [InputPasswords[0].current.value, InputPasswords[1].current.value]
      };
    }
    function equalPasswords() {
      return [...new Set(getValues().passwords)].length === 1;
    }
    async function tryRegister(event) {
      event.preventDefault();
      let values = getValues();
      if (!equalPasswords())
        return push(null, de_DE_default.passwordsNotSame);
      register2({
        alias: values.alias,
        displayName: values.name,
        email: values.email,
        password: values.passwords[0]
      });
    }
  }

  // app/views/route-not-found.view.tsx
  function RouteNotFoundView() {
    return /* @__PURE__ */ doc_exports.h(Box, {
      id: "route-not-found"
    }, /* @__PURE__ */ doc_exports.h(Header, null, de_DE_default.error), /* @__PURE__ */ doc_exports.h("div", {
      className: "box message"
    }, de_DE_default.routeNotFound.replace("$url", location.pathname)));
  }

  // routes.ts
  const Routes = [
    {
      path: "",
      title: de_DE_default.home,
      component: HomeView
    },
    {
      path: "login/?*",
      title: de_DE_default.login,
      component: LoginView,
      activates: [isGuest.value]
    },
    {
      path: "register/?*",
      title: de_DE_default.register,
      component: RegisterView,
      activates: [isGuest.value]
    },
    {
      path: "settings/?*",
      title: de_DE_default.settings,
      component: SettingsView,
      activates: [isUser.value]
    },
    {
      path: "user/:alias",
      title: ({alias}) => alias,
      component: UserView,
      activates: [
        ({alias}) => hasUser(alias)
      ],
      children: [
        {
          path: "post/:id",
          title: ({alias, id}) => alias + "/post/" + id,
          component: UserPostView,
          activates: [
            ({alias, id}) => hasPost(parseInt(id))
          ]
        }
      ]
    },
    {
      path: "**",
      title: de_DE_default.error,
      component: RouteNotFoundView
    }
  ];
  var routes_default = Routes;

  // app.tsx
  function Application() {
    return /* @__PURE__ */ doc_exports.h("div", {
      id: "app"
    }, /* @__PURE__ */ doc_exports.h("div", {
      id: "loading-bar",
      if: isLoading
    }), /* @__PURE__ */ doc_exports.h("div", {
      id: "app-grid"
    }, /* @__PURE__ */ doc_exports.h("aside", {
      id: "side"
    }, /* @__PURE__ */ doc_exports.h(Navigation, null)), /* @__PURE__ */ doc_exports.h("main", {
      id: "content"
    }, /* @__PURE__ */ doc_exports.h(Router, {
      routes: routes_default
    }))), /* @__PURE__ */ doc_exports.h("div", {
      styles: {height: "100vh", width: "100vw", position: "fixed", top: "0", left: "0", pointerEvents: "none"}
    }, /* @__PURE__ */ doc_exports.h("div", {
      portal: user_card_component_default
    })));
  }
  document.getElementById("app").replaceWith(/* @__PURE__ */ doc_exports.h(Application, null));
})();
