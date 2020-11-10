// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../src/helpers/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = render;

/**
 * @param {import("../choc").default} node 
 */
function render(node) {
  node.$el = document.createElement(node.$tagRef);
  Object.assign(node.nativeElement, node.$propsRef);

  for (let prop in node.$propsRef) {
    node.$states.set(prop, node.$propsRef[prop]);
  }

  node.append(...node.$childrenRef);
}
},{}],"../src/helpers/update.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = update;

// @ts-check

/**
 * @template props
 * @param {import("../choc.js").default} node 
 * @param {Partial<{ [key in keyof props]: any }>} updates 
 */
function update(node, updates) {
  for (let state in updates) {
    node.set(state, updates[state]);
  }
}
},{}],"../src/helpers/set.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = set;

// @ts-check

/**
 * @template props
 * @param {import("../choc.js").default} node 
 * @param {keyof props & string} state 
 * @param {any} value 
 */
function set(node, state, value) {
  if (node.has(state) && node.get(state) !== value) {
    node.$states.set(state, value);
    node.nativeElement[state] = value;
    node.signal(state, value);
  }
}
},{}],"../src/helpers/children.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setChildren;

var _module = _interopRequireDefault(require("../../module.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check

/**
 * @param {import("../choc.js").default} node 
 * @param {(Element | import("../choc.js").default | string)[]} children 
 */
function setChildren(node, children) {
  for (let child of children) {
    let childElement;

    if (typeof child == "string") {
      childElement = document.createTextNode(child);
    } else if (child instanceof _module.default) {
      childElement = child.nativeElement;

      if (child.has("key")) {
        node.$children.set(child.get("key"), child);
      }
    } else if (child instanceof Element) {
      childElement = child;
    }

    if (childElement) {
      node.nativeElement.appendChild(childElement);
    }
  }
}
},{"../../module.js":"../module.js"}],"../src/helpers/hash.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hash;

// @ts-check

/**
 * @param {string} input 
 */
function hash(input) {
  let h,
      i = 0,
      length = input.length;

  for (i; i < length; i++) {
    h = Math.imul(31, h) + input.charCodeAt(i) | 0;
  }

  return h.toString(36);
}
},{}],"../src/helpers/styles.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _hash = _interopRequireDefault(require("./hash.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
const styleElement = document.createElement("style");
document.head.appendChild(styleElement);
const CSSSheet = styleElement.sheet;
const CSSMap = new Map();

class Styles {
  /** @type {Map<string, string>} */
  $map = new Map();
  /** @type {import("../choc").default} */

  $node;
  /** @param {import("../choc").default} node */

  constructor(node) {
    this.$node = node;
  }
  /**
   * @param {string} name 
   */


  has(name) {
    return this.$map.has(name);
  }
  /**
   * @param {string} name 
   */


  get(name) {
    return this.$map.get(name);
  }
  /**
   * @param {Partial<CSSStyleDeclaration>} styleDeclaration 
   */


  add(styleDeclaration) {
    for (let rule in styleDeclaration) {
      let property = rule.replace(/([A-Z])/g, "-$1").toLowerCase();
      let value = `${property}: ${styleDeclaration[rule]};`;
      let name = "r-" + (0, _hash.default)(value);
      let style = `.${name} { ${value} }`;
      let active = this.get(property);

      if (!CSSMap.has(name)) {
        CSSMap.set(name, style);
        CSSSheet.insertRule(style, CSSSheet.rules.length);
      }

      if (!active) {
        this.$map.set(property, name);
        this.$node.nativeElement.classList.add(name);
      } else {
        if (active !== name) {
          this.$map.set(property, name);
          this.$node.nativeElement.classList.replace(active, name);
        }
      }
    }
  }
  /**
   * @param {Partial<CSSStyleDeclaration>} styleDeclaration 
   */


  addGroup(styleDeclaration) {
    let name = "g-";
    let style = "";
    let rule = "";

    for (let rule in styleDeclaration) {
      let property = rule.replace(/([A-Z])/g, "-$1").toLowerCase();
      style += `${property}: ${styleDeclaration[rule]};`;
    }

    name += (0, _hash.default)(style);
    rule = `.${name} { ${style} }`;

    if (!CSSMap.has(name)) {
      CSSMap.set(name, rule);
      CSSSheet.insertRule(rule, CSSSheet.rules.length);
    }

    this.$node.nativeElement.classList.add(name);
    return name;
  }

}

exports.default = Styles;
},{"./hash.js":"../src/helpers/hash.js"}],"../src/helpers/signals.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// @ts-check
class Signals {
  /** @type {Map<string, ((node: import("../choc").default, ...args: any[]) => any)[]>} */
  $map = new Map();
  /** @type {import("../choc").default} */

  $node;
  /** @param {import("../choc").default} node */

  constructor(node) {
    this.$node = node;
  }
  /**
   * @param {string} name 
   */


  has(name) {
    return this.$map.has(name);
  }
  /**
   * @param {string} name 
   */


  get(name) {
    return this.$map.get(name);
  }
  /**
   * @param {string} name 
   * @param {(...args: any[]) => any} fn 
   */


  add(name, fn) {
    if (!this.has(name)) {
      this.$map.set(name, []);
    }

    this.get(name).push(fn);
    return this;
  }
  /**
   * @param {string} name 
   * @param {(...args: any[]) => any} fn 
   */


  del(name, fn) {
    if (!this.has(name)) {
      let signals = this.get(name);
      let idx = signals.indexOf(fn);

      if (idx >= 0) {
        signals.splice(idx, 1);
      }
    }

    return this;
  }
  /**
   * @param {string} name 
   * @param {any[]} args
   */


  run(name, args) {
    if (this.$map.has(name)) {
      this.$map.get(name).forEach(hook => hook(this.$node, ...args));
    }

    return this;
  }

}

exports.default = Signals;
},{}],"../src/choc.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _render = _interopRequireDefault(require("./helpers/render.js"));

var _update = _interopRequireDefault(require("./helpers/update.js"));

var _set = _interopRequireDefault(require("./helpers/set.js"));

var _children = _interopRequireDefault(require("./helpers/children.js"));

var _styles = _interopRequireDefault(require("./helpers/styles.js"));

var _signals = _interopRequireDefault(require("./helpers/signals.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check

/**
 * @template tag, props
 */
class Choc {
  /** @type {string} */
  $tagRef;
  /** @type {props} */

  $propsRef;
  /** @type {any[]} */

  $childrenRef;
  /** @type {HTMLElementTagNameMap[tag & keyof HTMLElementTagNameMap] & { [key in keyof props]: any }} */

  $el;
  /** @type {Map<keyof props, any>} */

  $states = new Map();
  $styles = new _styles.default(this);
  $signals = new _signals.default(this);
  /** @type {Map<any, Choc<any, any>>} */

  $children = new Map();
  /**
   * @param {Object} param
   * @param {tag & keyof HTMLElementTagNameMap} param.tag 
   * @param {props} param.props 
   * @param {(Choc<any, any> | string | Element)[]} param.children 
   */

  constructor({
    tag,
    props,
    children
  }) {
    this.$tagRef = tag;
    this.$propsRef = props;
    this.$childrenRef = children;
    (0, _render.default)(this);
  }

  get nativeElement() {
    return this.$el;
  }
  /**
   * @param {Partial<{ [key in keyof props]: any }>} stateValues 
   */


  update(stateValues) {
    (0, _update.default)(this, stateValues);
    return this;
  }
  /**
   * @param {any} key 
   */


  child(key) {
    return this.$children.get(key);
  }
  /**
   * @param {keyof props} state 
   */


  has(state) {
    return this.$states.has(state);
  }
  /**
   * @template state
   * @param {keyof props} state
   * @returns {props[state & keyof props]}
   */


  get(state) {
    return this.$states.get(state);
  }
  /**
   * @param {string & keyof props} state 
   * @param {any} value
   */


  set(state, value) {
    (0, _set.default)(this, state, value);
    return this;
  }
  /**
   * @param {Partial<CSSStyleDeclaration>} rules 
   */


  style(rules) {
    this.$styles.add(rules);
    return this;
  }
  /**
   * @param {string} name 
   * @param {(node: this, ...args: any[]) => any} fn 
   */


  addSignal(name, fn) {
    this.$signals.add(name, fn);
    return this;
  }
  /**
   * @param {string} name 
   * @param {(node: this, ...args: any[]) => any} fn 
   */


  removeSignal(name, fn) {
    this.$signals.del(name, fn);
    return this;
  }
  /**
   * @param {string} name
   * @param {...any} args
   */


  signal(name, ...args) {
    this.$signals.run(name, args);
    return this;
  }
  /**
   * @param {Element} target 
   */


  mount(target) {
    target.replaceWith(this.nativeElement);
    return this;
  }

  unmount() {
    this.nativeElement.remove();
    return this;
  }
  /**
   * @param {Element} target 
   */


  appendTo(target) {
    target.appendChild(this.nativeElement);
    return this;
  }
  /**
   * @param {...(Element | Choc<any, any> | string)} children 
   */


  append(...children) {
    (0, _children.default)(this, children);
    return this;
  }
  /**
   * @param {string} name 
   * @param {(node: this, event: Event) => any} listener 
   */


  addEvent(name, listener) {
    if (!this.$signals.has(`@${name}`)) {
      this.nativeElement.addEventListener(name, ev => this.signal(`@${name}`, ev), false);
    }

    this.addSignal(`@${name}`, listener);
    return this;
  }
  /**
   * @param {string} name 
   * @param {(node: this, event: Event) => any} listener 
   */


  removeEvent(name, listener) {
    this.removeSignal(`@${name}`, listener);
    return this;
  }
  /**
   * @template mixin
   * @param {mixin} mixin
   * @returns {this & mixin}
   */


  mixin(mixin) {
    Object.assign(this, mixin); // @ts-ignore

    return this;
  }
  /**
   * @template tag, props
   * @param {tag & keyof HTMLElementTagNameMap} tag 
   * @param {props} props 
   * @param  {(Choc<any, any> | string | Element)[]} children 
   */


  static create(tag, props = null, ...children) {
    return new Choc({
      tag,
      props,
      children
    });
  }

}

exports.default = Choc;
},{"./helpers/render.js":"../src/helpers/render.js","./helpers/update.js":"../src/helpers/update.js","./helpers/set.js":"../src/helpers/set.js","./helpers/children.js":"../src/helpers/children.js","./helpers/styles.js":"../src/helpers/styles.js","./helpers/signals.js":"../src/helpers/signals.js"}],"../module.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _choc = _interopRequireDefault(require("./src/choc.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
var _default = _choc.default;
exports.default = _default;
},{"./src/choc.js":"../src/choc.js"}],"../src/extras/router/create-matcher.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createMatcher;
// @ts-check
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
/**
 * @param {string} path 
 */

function createMatcher(path) {
  if (path.startsWith("/")) {
    throw new Error("RoutePath cannot start with an '/'");
  }

  if (path.endsWith("/")) {
    throw new Error("RoutePath cannot end with an '/'");
  }

  if (path === "**") {
    return R_WILDCARD;
  }

  path = path.replace(R_OPTIONAL, R_WILDCARD_STR);
  path = path.replace(R_REPLACER, R_PARAM);
  path = path.replace(R_DOUBLESLASH, R_SINGLESLASH);
  path = path.replace(R_MULTI_WILDCARD, R_SINGLE_WILDCARD);
  return new RegExp(R_START + path + R_END);
}
},{}],"../src/extras/router/create-routes.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createRoutes;

var _createMatcher = _interopRequireDefault(require("./create-matcher.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check

/**
 * @param {import("./types").RouteConstructor[]} routes 
 * @returns {import("./types").Route[]}
 */
function createRoutes(routes) {
  let routesArray = [];
  let i = 0;

  while (routes[i]) {
    let {
      component,
      path,
      title,
      children,
      activates
    } = routes[i];
    let matcher = (0, _createMatcher.default)(path);
    activates = [...new Set(activates)];
    routesArray.push({
      title,
      matcher,
      component,
      activates
    });

    if (children) {
      routes.splice(i + 1, 0, ...children.map(rc => {
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
},{"./create-matcher.js":"../src/extras/router/create-matcher.js"}],"../src/extras/router/execute-activators.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = executeActivators;

// @ts-check

/**
 * @param {import("./types").RouteActivator[]} activatorArray 
 * @param {import("./types").URLParams} params
 */
async function executeActivators(activatorArray, params) {
  if (activatorArray) {
    try {
      for (let activator of activatorArray) {
        if ((await activator(params)) !== true) {
          return false;
        }
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  return true;
}
},{}],"../src/extras/router/parameters.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

// @ts-check

/**
 * @param {RegExp} matcher 
 * @param {string} url 
 */
function _default(matcher, url) {
  /** @type {any} */
  let matched = matcher.exec(url);

  if (matched.groups) {
    return { ...matched.groups
    };
  }

  return {};
}
},{}],"../src/extras/router/find-route.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findRoute;

var _executeActivators = _interopRequireDefault(require("./execute-activators.js"));

var _parameters = _interopRequireDefault(require("./parameters.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check

/**
 * @param {import("./types").Route[]} routes 
 * @param {string} url
 */
async function findRoute(routes, url) {
  let i = 0;

  while (routes[i]) {
    let route = routes[i];

    if (!route.matcher.test(url)) {
      i++;
      continue;
    }

    route.params = (0, _parameters.default)(route.matcher, url);
    let activatable = await (0, _executeActivators.default)(route.activates, route.params);

    if (activatable) {
      return route;
    }

    i++;
    continue;
  }
}
},{"./execute-activators.js":"../src/extras/router/execute-activators.js","./parameters.js":"../src/extras/router/parameters.js"}],"../src/extras/router/load-route.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadRoute;

var _findRoute = _interopRequireDefault(require("./find-route.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check

/**
 * @param {import("./types").Route[]} routes
 * @param {string} url
 * @returns {Promise<import("./types").LoadedRoute>}
 */
async function loadRoute(routes, url) {
  let route = await (0, _findRoute.default)(routes, url);

  if (!route) {
    return;
  }

  let {
    component,
    title,
    params
  } = route;
  let stateTitle = "";

  if (title) {
    if (typeof title === "function") {
      stateTitle = title(params);
    } else if (typeof title === "string") {
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
},{"./find-route.js":"../src/extras/router/find-route.js"}],"../src/extras/router/render-route.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderRoute;

// @ts-check

/**
 * @template tag, props
 * @param {import("../../choc").default<tag, props>} targetComponent 
 * @param {import("./types").LoadedRoute} route
 * @param {string} url
 */
async function renderRoute(targetComponent, route, url) {
  if (route.title) {
    document.title = route.title;
  }

  history.replaceState(route.params, document.title, url);
  targetComponent.nativeElement.innerHTML = "";
  targetComponent.append(route.component);
}
},{}],"../src/extras/router/url.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getURLParams = getURLParams;
exports.default = void 0;

// @ts-check
var _default = () => location.pathname + location.search + location.hash;
/**
 * @param {string} url 
 */


exports.default = _default;

function getURLParams(url) {
  let paramObj = {},
      params = new URLSearchParams(url);
  params.forEach((val, key) => {
    if (paramObj[key]) {
      if (Array.isArray(paramObj[key])) {
        paramObj[key] = [...paramObj[key], val];
      } else {
        paramObj[key] = [paramObj[key], val];
      }
    } else {
      paramObj[key] = val;
    }
  });
  return paramObj;
}
},{}],"../src/extras/router/module.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = chocRouter;

var _createRoutes = _interopRequireDefault(require("./create-routes.js"));

var _loadRoute = _interopRequireDefault(require("./load-route.js"));

var _renderRoute = _interopRequireDefault(require("./render-route.js"));

var _url = _interopRequireDefault(require("./url.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
const popStateEvent = new PopStateEvent("popstate");
/**
 * @template component
 * @param {component & import("../../choc").default} routerComponent 
 * @param {import("./types").RouteConstructor[]} routes
 */

function chocRouter(routerComponent, routes) {
  const Routes = (0, _createRoutes.default)(routes);
  let loadCallback = undefined;
  let loadEndCallback = undefined;
  let loadErrorCallback = undefined;

  async function listener() {
    let loadUrl = (0, _url.default)();

    if (loadCallback) {
      loadCallback();
    }

    let route = await (0, _loadRoute.default)(Routes, loadUrl);

    if (route) {
      (0, _renderRoute.default)(routerComponent, route, loadUrl);
    } else {
      if (loadErrorCallback) {
        loadErrorCallback();
      }
    }

    if (loadEndCallback) {
      loadEndCallback();
    }
  }

  listener();
  addEventListener("popstate", listener, false);
  return routerComponent.mixin({
    /** @param {() => any} callback */
    onLoad(callback) {
      loadCallback = callback;
    },

    /** @param {() => any} callback */
    onLoadEnd(callback) {
      loadEndCallback = callback;
    },

    /** @param {() => any} callback */
    onLoadError(callback) {
      loadErrorCallback = callback;
    },

    /** @param {string} href */
    activateRoute(href) {
      history.pushState(null, "", href);
      dispatchEvent(popStateEvent);
    },

    /**
     * @template component
     * @param {component & import("../../choc").default} component 
     */
    createRoute(component) {
      component.addEvent("click", (node, event) => {
        let href = component.nativeElement.href;
        event.preventDefault();

        if (href) {
          history.pushState(null, "", href);
          dispatchEvent(popStateEvent);
        }
      });
    }

  });
}
},{"./create-routes.js":"../src/extras/router/create-routes.js","./load-route.js":"../src/extras/router/load-route.js","./render-route.js":"../src/extras/router/render-route.js","./url.js":"../src/extras/router/url.js"}],"../extras.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _module = _interopRequireDefault(require("./src/extras/router/module.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
var _default = {
  chocRouter: _module.default
};
exports.default = _default;
},{"./src/extras/router/module.js":"../src/extras/router/module.js"}],"app/components/generic.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Div = Div;
exports.Span = Span;
exports.Route = Route;
exports.activateRoute = activateRoute;
exports.A = A;

var _module = _interopRequireDefault(require("../../../module.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check

/**
 * @template props
 * @param {props} props 
 * @param {...(import("../../../module").default | string | Element)} children
 */
function Div(props, ...children) {
  return _module.default.create("div", props, ...children);
}
/**
 * @template props
 * @param {props} props 
 * @param {...(import("../../../module").default | string | Element)} children
 */


function Span(props, ...children) {
  return _module.default.create("span", props, ...children);
}

const aEvent = new PopStateEvent("popstate");
/**
 * @template props
 * @param {props & { href: string }} props 
 * @param {...(import("../../../module").default | string | Element)} children
 */

function Route(props, ...children) {
  return _module.default.create("a", props, ...children).addEvent("click", (node, event) => {
    event.preventDefault();
    activateRoute(props.href);
  });
}

function activateRoute(href) {
  history.pushState(null, null, href);
  dispatchEvent(aEvent);
}
/**
 * @template props
 * @param {props} props 
 * @param {...(import("../../../module").default | string | Element)} children
 */


function A(props, ...children) {
  return _module.default.create("a", props, ...children);
}
},{"../../../module.js":"../module.js"}],"app/lang/de_DE.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  home: "Startseite",
  login: "Einloggen",
  register: "Registrieren",
  logout: "Ausloggen",
  error: "Fehler",
  navigation: "Navigation",
  alias: "Benutzername",
  password: "Passwort",
  routeNotFound: "Seite '$url' nicht gefunden.",
  enterAccount: "Logge dich in dein Konto ein",
  createAccount: "Erstelle ein Konto",
  loginReason: "Dein Grund zum Einloggen",
  noAccount: "Noch kein Konto?",
  secondsAgo: "Vor $n Sekunden",
  secondAgo: "Vor einer Sekunde",
  minutesAgo: "Vor $n Minuten",
  minuteAgo: "Vor einer Minute",
  hoursAgo: "Vor $n Stunden",
  hourAgo: "Vor einer Stunde",
  daysAgo: "Vor $n Tagen",
  dayAgo: "Vor einem Tag",
  weeksAgo: "Vor $n Wochen",
  weekAgo: "Vor einer Woche",
  monthsAgo: "Vor $n Monaten",
  monthAgo: "Vor einem Monat",
  yearsAgo: "Vor $n Jahren",
  yearAgo: "Vor einem Jahr"
};
exports.default = _default;
},{}],"app/services/db.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.conn = conn;
exports.getPosts = getPosts;
exports.getUser = getUser;
exports.hasUser = hasUser;
exports.UserService = exports.Posts = exports.Users = exports.User = void 0;
// @ts-check
let User = undefined;
exports.User = User;
const Users = [{
  id: 1,
  alias: "iljushka",
  name: "Ilja",
  image: "https://i.pinimg.com/originals/0f/04/47/0f04471f592c8afcf17c36b89796e63e.png",
  password: "passwort"
}, {
  id: 2,
  alias: "tani",
  name: "Tani",
  image: "https://coubsecure-s.akamaihd.net/get/b111/p/channel/cw_avatar/84e7c7c0cc0/787ebe9126b688618d3a0/profile_pic_big_1479058355_IMG_1221.JPG",
  password: "passwort"
}];
exports.Users = Users;
const Posts = [{
  id: 1,
  dateTime: Date.now(),
  user: 1,
  textContent: "ahoooo"
}, {
  id: 2,
  dateTime: Date.now(),
  user: 2,
  textContent: "awoooooo"
}];
exports.Posts = Posts;

async function conn() {
  return new Promise(res => setTimeout(res, Math.round(Math.random() * 500)));
}

async function getPosts(predicate) {
  await conn();
  return Posts.filter(predicate).map(post => {
    /** @type {any} */
    let _post = { ...post
    };
    _post.user = Users.find(user => user.id === post.user);
    return _post;
  });
}

async function getUser({
  alias
}) {
  await conn();
  return Users.find(user => user.alias === alias);
}

async function hasUser({
  alias
}) {
  await conn();

  if (!Users.find(user => user.alias === alias)) {
    return false;
  }

  return true;
}

class UserService {
  static user = undefined;

  static isUser() {
    return !!UserService.user;
  }

  static async isAuthorized() {
    await conn();
    return UserService.isUser();
  }

  static async isUnauthorized() {
    await conn();
    return !UserService.isUser();
  }

  static async login(alias, password) {
    await conn();
    UserService.user = Users.find(user => user.alias === alias && user.password === password);
    return UserService.isUser();
  }

  static async logout() {
    await conn();
    UserService.user = undefined;
  }

}

exports.UserService = UserService;
},{}],"app/components/box.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Box;
exports.Arrow = Arrow;
exports.Seperator = Seperator;
exports.Title = Title;
exports.Label = Label;
exports.Input = Input;
exports.Textarea = Textarea;
exports.Button = Button;

var _module = _interopRequireDefault(require("../../../module.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check

/**
 * @template T
 * @typedef {T & { [key: string]: any }} Properties
 */

/**
 * @typedef BoxProperties
 * @property {string} className
 */

/**
 * @template props
 * @typedef {import("../../../module").default<"div", props & BoxProperties>} Box
 */

/** 
 * @template props
 * @param {Properties<props>} props
 * @param {...(import("../../../module").default | string | Element)} children
 * @returns {import("../../../module").default<"div", props & BoxProperties>}
 */
function Box({ ...props
}, ...children) {
  let className = "box";

  if (props.className) {
    className += " " + props.className;
    delete props.className;
  }

  return _module.default.create("div", { ...props,
    className
  }, ...children);
}
/**
 * @typedef {"top-left" | "top-right" | "bottom-left" | "bottom-right" | "top" | "left" | "bottom" | "right"} ArrowType
 */

/**
 * @param {ArrowType} type 
 * @param {number} x 
 * @param {number} y 
 */


function Arrow(type, x = 0, y = 0) {
  /** 
   * @param {number} x
   * @param {number} y
   * @returns {Partial<CSSStyleDeclaration>}
   */
  function createPosition(x, y) {
    return {
      left: `${x}%`,
      top: `${y}%`
    };
  }

  let arrow = _module.default.create("div", {
    className: `arrow arrow-${type}`
  });

  if (x || 0) {
    arrow.style(createPosition(x, y));
  }

  return arrow.mixin({
    /**
     * @param {ArrowType} type 
     */
    updateType(type) {
      arrow.nativeElement.className = `arrow arrow-${type}`;
      return arrow;
    },

    updateAxis(x, y) {
      arrow.style(createPosition(x, y));
      return arrow;
    }

  });
}

function Seperator() {
  return _module.default.create("div", {
    className: "seperator"
  });
}
/** 
 * @template props
 * @param {Properties<props>} props
 * @param {...(import("../../../module").default | string | Element)} children
 * @returns {import("../../../module").default<"div", props & BoxProperties>}
 */


function Title({ ...props
}, ...children) {
  let className = "title";

  if (props.className) {
    className += " " + props.className;
    delete props.className;
  }

  return _module.default.create("div", { ...props,
    className
  }, ...children);
}
/** 
 * @template props
 * @param {Properties<props & { labelText: string }>} props
 * @param {...(import("../../../module").default | string | Element)} children
 */


function Label(props, ...children) {
  let className = "label";
  let labelText = props.labelText;
  delete props.labelText;

  if (props.className) {
    className += " " + props.className;
    delete props.className;
  }

  return _module.default.create("div", { ...props,
    className
  }, _module.default.create("label", {
    className: "label-content"
  }, labelText), ...children);
}
/** 
 * @template props
 * @param {props} props
 */


function Input(props) {
  let input = _module.default.create("input", props);

  return _module.default.create("div", {
    className: "input"
  }, input).mixin({
    get ref() {
      return input.nativeElement;
    }

  });
}
/** 
 * @template props
 * @param {props} props
 */


function Textarea(props) {
  let textarea = _module.default.create("textarea", props);

  return _module.default.create("div", {
    className: "input"
  }, textarea).mixin({
    get ref() {
      return textarea.nativeElement;
    },

    get node() {
      return textarea;
    }

  });
}
/** 
 * @template props
 * @param {Properties<props>} props
 * @param {...(import("../../../module").default | string | Element)} children
 */


function Button(props, ...children) {
  let className = "button";

  if (props.className) {
    className += " " + props.className;
    delete props.className;
  }

  return _module.default.create("button", { ...props,
    className
  }, _module.default.create("div", {
    className: "button-content"
  }, ...children));
}
},{"../../../module.js":"../module.js"}],"app/components/flex.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Flex;

var _module = _interopRequireDefault(require("../../../module.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check

/**
 * @template T
 * @typedef {T & { [key: string]: any }} Properties
 */

/**
 * @typedef FlexOptions
 * @property {string} [gap]
 * @property {"row" | "row-reverse" | "column" | "column-reverse"} [direction]
 * @property {string} [alignItems]
 */

/**
 * @template props
 * @param {Properties<props> & FlexOptions} props 
 * @param {...(import("../../../module").default | string | Element)} children
 */
function Flex(props, ...children) {
  /**
   * @type {Partial<CSSStyleDeclaration>}
   */
  let styles = {
    display: "flex"
  };

  if (props.gap) {
    styles.gap = props.gap;
    delete props.gap;
  }

  if (props.direction) {
    styles.flexDirection = props.direction;
    delete props.direction;
  }

  if (props.alignItems) {
    styles.alignItems = props.alignItems;
    delete props.alignItems;
  }

  return _module.default.create("div", props, ...children).style(styles);
}
},{"../../../module.js":"../module.js"}],"app/components/time.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Time;

var _module = _interopRequireDefault(require("../../../module.js"));

var _de_DE = _interopRequireDefault(require("../lang/de_DE.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
function Time({
  dateTime,
  ...props
}) {
  let [interval, innerText] = elapsed(dateTime);

  let time = _module.default.create("time", { ...props,
    innerText
  });

  let intervalNum = setInterval(update, interval);

  function update() {
    let [_interval, _innerText] = elapsed(dateTime);

    if (_interval !== interval) {
      interval = _interval;
    }

    if (onScreen(time)) {
      time.update({
        innerText: _innerText
      });
    }

    if (!time.nativeElement.isConnected) {
      clearInterval(intervalNum);
      time.unmount();
      time = undefined;
    }
  }

  return time;
}
/**
 * @param {number} dateTime
 * @returns {[any, string]}
 */


function elapsed(dateTime) {
  let sec = Math.floor((Date.now() - dateTime) / 1000),
      n,
      int;
  n = Math.floor(sec / 31536000), int = 604800000;

  if (n == 1) {
    return [int, _de_DE.default.yearAgo];
  } else if (n > 1) {
    return [int, replace(_de_DE.default.yearsAgo, n)];
  }

  n = Math.floor(sec / 2592000);

  if (n == 1) {
    return [int, _de_DE.default.monthAgo];
  } else if (n > 1) {
    return [int, replace(_de_DE.default.monthsAgo, n)];
  }

  n = Math.floor(sec / 604800);

  if (n == 1) {
    return [int, _de_DE.default.weekAgo];
  } else if (n > 1) {
    return [int, replace(_de_DE.default.monthsAgo, n)];
  }

  n = Math.floor(sec / 86400), int = 360000;

  if (n == 1) {
    return [int, _de_DE.default.dayAgo];
  } else if (n > 1) {
    return [int, replace(_de_DE.default.daysAgo, n)];
  }

  n = Math.floor(sec / 3600), int = 60000;

  if (n == 1) {
    return [int, _de_DE.default.hourAgo];
  } else if (n > 1) {
    return [int, replace(_de_DE.default.hoursAgo, n)];
  }

  n = Math.floor(sec / 60), int = 10000;

  if (n == 1) {
    return [int, _de_DE.default.minuteAgo];
  } else if (n > 1) {
    return [int, replace(_de_DE.default.minutesAgo, n)];
  }

  n = Math.floor(sec), int = 1000;

  if (n == 1) {
    return [int, _de_DE.default.secondAgo];
  } else {
    return [int, replace(_de_DE.default.secondsAgo, n)];
  }
}
/**
 * @param {string} text 
 * @param {number} time 
 */


function replace(text, time) {
  return text.replace("$n", time + "");
}
/**
 * @param {import("../../../module").default} node 
 */


function onScreen(node) {
  if (!(node.nativeElement instanceof Element)) {
    return false;
  }

  const {
    top,
    bottom
  } = node.nativeElement.getBoundingClientRect();

  if ((top && bottom) === 0) {
    return false;
  }

  return top < innerHeight && bottom >= 0;
}
},{"../../../module.js":"../module.js","../lang/de_DE.js":"app/lang/de_DE.js"}],"app/components/post.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Post;

var _box = _interopRequireWildcard(require("../components/box.js"));

var _flex = _interopRequireDefault(require("../components/flex.js"));

var _time = _interopRequireDefault(require("../components/time.js"));

var _generic = require("../components/generic.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// @ts-check
function Post({
  id,
  user: {
    alias,
    name
  },
  textContent,
  dateTime
}) {
  let component = (0, _generic.Div)({
    id: `post-${id}`,
    className: "post"
  }, (0, _flex.default)({
    gap: "8px"
  }, (0, _generic.Route)({
    href: `/user/${alias}`,
    className: "user-image-wrap"
  }, (0, _generic.Div)({
    className: "user-image"
  }).style({
    backgroundImage: `url(https://picsum.photos/200)`
  }), (0, _generic.Div)({
    className: "user-image-frame"
  })), (0, _box.default)({
    className: "post-content"
  }, (0, _box.Arrow)("top-left"), (0, _box.Title)({}, (0, _flex.default)({
    gap: "8px"
  }, (0, _generic.Route)({
    href: `/user/${alias}`,
    className: "user-link"
  }, (0, _flex.default)({
    gap: "8px",
    className: "user"
  }, (0, _generic.Span)({
    className: "user-name"
  }, name), (0, _generic.Span)({
    className: "user-alias"
  }, alias))), (0, _time.default)({
    dateTime,
    className: "datetime"
  }))), (0, _box.Seperator)(), (0, _generic.Div)({
    className: "user-content"
  }, (0, _box.default)({
    className: "text-content"
  }, textContent)), (0, _box.Seperator)(), (0, _flex.default)({
    gap: "8px"
  }, (0, _flex.default)({
    gap: "8px",
    alignItems: "center"
  }, (0, _generic.Span)({}, "0"), (0, _generic.Span)({}, "Like")), (0, _generic.Span)({
    className: "post-menu"
  }, "Menu")))));
  return component;
}
},{"../components/box.js":"app/components/box.js","../components/flex.js":"app/components/flex.js","../components/time.js":"app/components/time.js","../components/generic.js":"app/components/generic.js"}],"app/views/home.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Home;

var _post = _interopRequireDefault(require("../components/post.js"));

var _generic = require("../components/generic.js");

var service = _interopRequireWildcard(require("../services/db.js"));

var _flex = _interopRequireDefault(require("../components/flex.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
async function Home() {
  let posts = await service.getPosts(post => post);
  let component = (0, _flex.default)({
    direction: "column",
    gap: "8px"
  }, (0, _generic.Div)({
    className: "post-container "
  }, ...posts.map(post => (0, _post.default)(post))));
  return component;
}
},{"../components/post.js":"app/components/post.js","../components/generic.js":"app/components/generic.js","../services/db.js":"app/services/db.js","../components/flex.js":"app/components/flex.js"}],"app/views/user.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = User;

var _post = _interopRequireDefault(require("../components/post.js"));

var _generic = require("../components/generic.js");

var _flex = _interopRequireDefault(require("../components/flex.js"));

var _box = _interopRequireWildcard(require("../components/box.js"));

var service = _interopRequireWildcard(require("../services/db.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
async function User({
  alias
}) {
  let user = await service.getUser({
    alias
  });
  let posts = await service.getPosts(post => post.user === user.id);
  let component = (0, _flex.default)({
    direction: "column",
    gap: "8px"
  }, (0, _box.default)({}, (0, _box.Title)({}, alias), (0, _box.Seperator)(), (0, _box.default)({}, "hello :D")), (0, _generic.Div)({
    className: "post-container "
  }, ...posts.map(post => (0, _post.default)(post))));
  return component;
}
},{"../components/post.js":"app/components/post.js","../components/generic.js":"app/components/generic.js","../components/flex.js":"app/components/flex.js","../components/box.js":"app/components/box.js","../services/db.js":"app/services/db.js"}],"app/components/form.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Form;

var _module = _interopRequireDefault(require("../../../module.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check

/** 
 * @template props
 * @param {props} props
 * @param {...(import("../../../module").default | string | Element)} children
 */
function Form({ ...props
}, ...children) {
  let submitCallbacks = [];

  const form = _module.default.create("form", props, ...children).mixin({
    /** @param {(node: import("../../../module").default<"form", props>, event: Event) => any} callback  */
    onSubmit(callback) {
      submitCallbacks.push(callback);
      return form;
    }

  }).addSignal("submit", (node, event) => {
    event.preventDefault();
    submitCallbacks.forEach(cb => cb(node, event));
  }).addEvent("submit", (node, event) => node.signal("submit", event));

  return form;
}
},{"../../../module.js":"../module.js"}],"app/definitions/pattern.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userPassword = exports.userPasswordStr = exports.userAlias = exports.userAliasStr = void 0;
// @ts-check
const userAliasStr = "^([a-z][a-z0-9]{4,16})$";
exports.userAliasStr = userAliasStr;
const userAlias = /^([a-z][a-z0-9]{4,16})$/;
exports.userAlias = userAlias;
const userPasswordStr = "^.{8,}$";
exports.userPasswordStr = userPasswordStr;
const userPassword = /^.{8,}$/;
exports.userPassword = userPassword;
},{}],"app/components/decorators.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isComment = isComment;
exports.loadingCircle = loadingCircle;

// @ts-check

/**
 * @template tag, props, com
 * @param {com & import("../../../module").default<tag, props>} com 
 */
function isComment(com) {
  return {
    /**
     * @param {boolean} condition
     */
    if(condition) {
      if (condition) {
        // @ts-expect-error
        com.$el = document.createComment("hidden");
      }

      return com;
    }

  };
}
/**
 * Adds Signal<"while", () => any> to the component.\
 * @template component
 * @param {component & import("../../../module").default} com
 */


function loadingCircle(com) {
  return com.mixin({
    /** @param {() => any} task */
    async while(task) {
      com.nativeElement.classList.add("loading-circle");
      await task();
      com.nativeElement.classList.remove("loading-circle");
      return com;
    }

  }).addSignal("while", (node, task) => node.while(task));
}
},{}],"app/components/navigation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _de_DE = _interopRequireDefault(require("../lang/de_DE.js"));

var _generic = require("./generic.js");

var _decorators = require("./decorators.js");

var _box = _interopRequireWildcard(require("./box.js"));

var _db = require("../services/db.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
const Navigation = function () {
  let items = async () => {
    let isAuthorized = await _db.UserService.isAuthorized();
    return [(0, _generic.Route)({
      href: "/"
    }, _de_DE.default.home), (0, _decorators.isComment)((0, _generic.Route)({
      href: "/login"
    }, _de_DE.default.login)).if(isAuthorized), (0, _decorators.isComment)((0, _generic.Route)({
      href: "/register"
    }, _de_DE.default.register)).if(isAuthorized), (0, _decorators.isComment)((0, _generic.A)(null, _de_DE.default.logout).addEvent("click", logout)).if(!isAuthorized)];
  };

  let component = (0, _box.default)({
    id: "navigation"
  }, (0, _box.Title)({}, _de_DE.default.navigation), (0, _box.Seperator)(), (0, _decorators.loadingCircle)((0, _generic.Div)({
    key: "list",
    className: "list"
  })));
  component.child("list").addSignal("load", async node => {
    node.signal("while", async () => {
      let newList = await items();
      node.nativeElement.innerHTML = "";
      node.append(...newList);
    });
  });
  component.addSignal("refresh", node => node.child("list").signal("load"));
  component.signal("refresh");
  return component;
}();

var _default = Navigation;
exports.default = _default;

async function logout() {
  await _db.UserService.logout();
  (0, _generic.activateRoute)("/login");
  Navigation.signal("refresh");
}
},{"../lang/de_DE.js":"app/lang/de_DE.js","./generic.js":"app/components/generic.js","./decorators.js":"app/components/decorators.js","./box.js":"app/components/box.js","../services/db.js":"app/services/db.js"}],"app/views/login.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Login;

var _de_DE = _interopRequireDefault(require("../lang/de_DE.js"));

var _box = _interopRequireWildcard(require("../components/box.js"));

var _form = _interopRequireDefault(require("../components/form.js"));

var _flex = _interopRequireDefault(require("../components/flex.js"));

var _generic = require("../components/generic.js");

var pattern = _interopRequireWildcard(require("../definitions/pattern.js"));

var _db = require("../services/db.js");

var _navigation = _interopRequireDefault(require("../components/navigation.js"));

var _decorators = require("../components/decorators.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
async function Login() {
  const alias = (0, _box.Input)({
    placeholder: ". . .",
    required: true,
    pattern: pattern.userAliasStr
  });
  const password = (0, _box.Input)({
    placeholder: "********",
    type: "password",
    required: true,
    pattern: pattern.userPasswordStr
  });
  return (0, _box.default)({
    id: "login"
  }, (0, _box.Title)({}, _de_DE.default.enterAccount), (0, _box.Seperator)(), (0, _form.default)({}, (0, _flex.default)({
    gap: "8px",
    direction: "column"
  }, (0, _flex.default)({
    gap: "8px",
    direction: "row"
  }, (0, _box.Label)({
    labelText: _de_DE.default.alias
  }, alias), (0, _box.Label)({
    labelText: _de_DE.default.password
  }, password))), (0, _box.Seperator)(), (0, _flex.default)({
    gap: "8px",
    direction: "row"
  }, (0, _box.Button)({
    type: "submit"
  }, _de_DE.default.login), (0, _box.Button)({
    type: "button"
  }, _de_DE.default.noAccount).addEvent("click", () => (0, _generic.activateRoute)("/register")))).onSubmit(async (node, event) => {
    (0, _decorators.loadingCircle)(node).while(async () => {
      let res = await _db.UserService.login(alias.ref.value, password.ref.value);

      if (res) {
        _navigation.default.signal("refresh");

        (0, _generic.activateRoute)("/");
      } else {
        alert("fail lol");
      }
    });
  }));
}
},{"../lang/de_DE.js":"app/lang/de_DE.js","../components/box.js":"app/components/box.js","../components/form.js":"app/components/form.js","../components/flex.js":"app/components/flex.js","../components/generic.js":"app/components/generic.js","../definitions/pattern.js":"app/definitions/pattern.js","../services/db.js":"app/services/db.js","../components/navigation.js":"app/components/navigation.js","../components/decorators.js":"app/components/decorators.js"}],"app/views/register.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Register;

var _de_DE = _interopRequireDefault(require("../lang/de_DE.js"));

var _box = _interopRequireWildcard(require("../components/box.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
async function Register() {
  let component = (0, _box.default)({
    id: "register"
  }, (0, _box.Title)({}, _de_DE.default.createAccount), (0, _box.Seperator)(), (0, _box.Input)({
    placeholder: "placeholder"
  }));
  return component;
}
},{"../lang/de_DE.js":"app/lang/de_DE.js","../components/box.js":"app/components/box.js"}],"app/views/route-not-found.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = RouteNotFound;

var _de_DE = _interopRequireDefault(require("../lang/de_DE.js"));

var _box = _interopRequireWildcard(require("../components/box.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
async function RouteNotFound() {
  return (0, _box.default)({
    id: "route-not-found"
  }, (0, _box.Title)({}, _de_DE.default.error), (0, _box.Seperator)(), (0, _box.default)({
    className: "message"
  }, _de_DE.default.routeNotFound.replace("$url", location.pathname)));
}
},{"../lang/de_DE.js":"app/lang/de_DE.js","../components/box.js":"app/components/box.js"}],"app/components/router.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extras = _interopRequireDefault(require("../../../extras.js"));

var _generic = require("./generic.js");

var _de_DE = _interopRequireDefault(require("../lang/de_DE.js"));

var _db = require("../services/db.js");

var _home = _interopRequireDefault(require("../views/home.js"));

var _user = _interopRequireDefault(require("../views/user.js"));

var _login = _interopRequireDefault(require("../views/login.js"));

var _register = _interopRequireDefault(require("../views/register.js"));

var _routeNotFound = _interopRequireDefault(require("../views/route-not-found.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
const Router = _extras.default.chocRouter((0, _generic.Div)({
  id: "router",
  className: "loading"
}), [{
  path: "",
  title: _de_DE.default.home,
  component: _home.default
}, {
  path: "login/?*",
  title: _de_DE.default.login,
  component: _login.default,
  activates: [_db.UserService.isUnauthorized]
}, {
  path: "register/?*",
  title: _de_DE.default.register,
  component: _register.default,
  activates: [_db.UserService.isUnauthorized]
}, {
  path: "user/:alias",
  title: ({
    alias
  }) => `.${alias}//`,
  component: _user.default,
  activates: [_db.hasUser]
}, {
  path: "**",
  title: _de_DE.default.error,
  component: _routeNotFound.default
}]);

Router.onLoad(() => Router.nativeElement.classList.add("loading"));
Router.onLoadEnd(() => Router.nativeElement.classList.remove("loading"));
var _default = Router;
exports.default = _default;
},{"../../../extras.js":"../extras.js","./generic.js":"app/components/generic.js","../lang/de_DE.js":"app/lang/de_DE.js","../services/db.js":"app/services/db.js","../views/home.js":"app/views/home.js","../views/user.js":"app/views/user.js","../views/login.js":"app/views/login.js","../views/register.js":"app/views/register.js","../views/route-not-found.js":"app/views/route-not-found.js"}],"app.jsx":[function(require,module,exports) {
"use strict";

var _module = _interopRequireDefault(require("../module.js"));

var _router = _interopRequireDefault(require("./app/components/router.js"));

var _navigation = _interopRequireDefault(require("./app/components/navigation.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check

/** @jsx Choc.create */
const App = _module.default.create("div", {
  id: "app"
}, _navigation.default, _module.default.create("div", {
  id: "content"
}, _router.default));

App.mount(document.getElementById("app"));
},{"../module.js":"../module.js","./app/components/router.js":"app/components/router.js","./app/components/navigation.js":"app/components/navigation.js"}],"../../../../../usr/lib/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "33177" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../usr/lib/node_modules/parcel/src/builtins/hmr-runtime.js","app.jsx"], null)