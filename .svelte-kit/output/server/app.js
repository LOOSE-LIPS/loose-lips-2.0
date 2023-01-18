var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _map;
import fetch$1 from "node-fetch";
import NProgress from "nprogress";
import { faMoon } from "@fortawesome/free-solid-svg-icons";
import querystring from "querystring";
import { faFacebook, faLinkedin, faTwitter, faReddit } from "@fortawesome/free-brands-svg-icons";
function get_single_valued_header(headers, key) {
  const value = headers[key];
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return void 0;
    }
    if (value.length > 1) {
      throw new Error(`Multiple headers provided for ${key}. Multiple may be provided only for set-cookie`);
    }
    return value[0];
  }
  return value;
}
function lowercase_keys(obj) {
  const clone = {};
  for (const key in obj) {
    clone[key.toLowerCase()] = obj[key];
  }
  return clone;
}
function error(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
function is_content_type_textual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}
async function render_endpoint(request, route, match) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler) {
    return;
  }
  const params = route.params(match);
  const response = await handler({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = get_single_valued_header(headers, "content-type");
  const is_type_textual = is_content_type_textual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop$1() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
const subscriber_queue = [];
function writable(value, start = noop$1) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
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
  function subscribe2(run2, invalidate = noop$1) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop$1;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
const s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error2,
  page: page2
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page: page2,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error3) => {
      throw new Error(`Failed to serialize session data: ${error3.message}`);
    })},
				host: ${page2 && page2.host ? s$1(page2.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page2 && page2.host ? s$1(page2.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page2 && page2.path)},
						query: new URLSearchParams(${page2 ? s$1(page2.query.toString()) : ""}),
						params: ${page2 && s$1(page2.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n	")}
		`;
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize({ ...error2, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
const s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page: page2,
  node,
  $session,
  context,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error2
}) {
  const { module } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  const page_proxy = new Proxy(page2, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d2) => d2.file === filename || d2.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? { "content-type": asset.type } : {}
          }) : await fetch(`http://${page2.host}/${asset.file}`, opts);
        } else if (resolved.startsWith("/") && !resolved.startsWith("//")) {
          const relative = resolved;
          const headers = {
            ...opts.headers
          };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body == null ? null : new TextEncoder().encode(opts.body),
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.externalFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers[key2] = value;
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape$1(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
const escaped$2 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape$1(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$2) {
      result += escaped$2[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
const absolute = /^([a-z]+:)?\/?\//;
function resolve(base2, path) {
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function coalesce_to_error(err) {
  return err instanceof Error ? err : new Error(JSON.stringify(err));
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error2 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page: page2,
    node: default_layout,
    $session,
    context: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page: page2,
      node: default_error,
      $session,
      context: loaded ? loaded.context : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error2
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error2,
      branch,
      page: page2
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return {
      status: 500,
      headers: {},
      body: error3.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error2;
  ssr:
    if (page_config.ssr) {
      let context = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              context,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e, request);
            status = 500;
            error2 = e;
          }
          if (loaded && !error2) {
            branch.push(loaded);
          }
          if (error2) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node({
                    ...opts,
                    node: error_node,
                    context: node_loaded.context,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error2
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e, request);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error2
            });
          }
        }
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      ...opts,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      ...opts,
      status: 500,
      error: error3
    });
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
async function render_page(request, route, match, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const params = route.params(match);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page: page2
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
class ReadOnlyFormData {
  constructor(map) {
    __privateAdd(this, _map, void 0);
    __privateSet(this, _map, map);
  }
  get(key) {
    const value = __privateGet(this, _map).get(key);
    return value && value[0];
  }
  getAll(key) {
    return __privateGet(this, _map).get(key);
  }
  has(key) {
    return __privateGet(this, _map).has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of __privateGet(this, _map))
      yield key;
  }
  *values() {
    for (const [, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
}
_map = new WeakMap();
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const content_type = headers["content-type"];
  const [type, ...directives] = content_type ? content_type.split(/;\s*/) : [];
  const text = () => new TextDecoder(headers["content-encoding"] || "utf-8").decode(raw);
  switch (type) {
    case "text/plain":
      return text();
    case "application/json":
      return JSON.parse(text());
    case "application/x-www-form-urlencoded":
      return get_urlencoded(text());
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(text(), boundary.slice("boundary=".length));
    }
    default:
      return raw;
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: options2.paths.base + path + (q ? `?${q}` : "")
        }
      };
    }
  }
  const headers = lowercase_keys(incoming.headers);
  const request = {
    ...incoming,
    headers,
    body: parse_body(incoming.rawBody, headers),
    params: {},
    locals: {}
  };
  try {
    return await options2.hooks.handle({
      request,
      resolve: async (request2) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request2),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        for (const route of options2.manifest.routes) {
          const match = route.pattern.exec(request2.path);
          if (!match)
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request2, route, match) : await render_page(request2, route, match, options2, state);
          if (response) {
            if (response.status === 200) {
              const cache_control = get_single_valued_header(response.headers, "cache-control");
              if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
                const etag = `"${hash(response.body || "")}"`;
                if (request2.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request2);
        return await respond_with_error({
          request: request2,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request2.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e, request);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}
function noop() {
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
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function custom_event(type, detail, bubbles = false) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, false, detail);
  return e;
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail);
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
    }
  };
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
Promise.resolve();
const boolean_attributes = new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
const invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
function spread(args, classes_to_add) {
  const attributes = Object.assign({}, ...args);
  if (classes_to_add) {
    if (attributes.class == null) {
      attributes.class = classes_to_add;
    } else {
      attributes.class += " " + classes_to_add;
    }
  }
  let str = "";
  Object.keys(attributes).forEach((name) => {
    if (invalid_attribute_name_character.test(name))
      return;
    const value = attributes[name];
    if (value === true)
      str += " " + name;
    else if (boolean_attributes.has(name.toLowerCase())) {
      if (value)
        str += " " + name;
    } else if (value != null) {
      str += ` ${name}="${value}"`;
    }
  });
  return str;
}
const escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function escape_attribute_value(value) {
  return typeof value === "string" ? escape(value) : value;
}
function escape_object(obj) {
  const result = {};
  for (const key in obj) {
    result[key] = escape_attribute_value(obj[key]);
  }
  return result;
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
const missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
let on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
function afterUpdate() {
}
var root_svelte_svelte_type_style_lang = "#svelte-announcer.svelte-1pdgbjn{clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;left:0;overflow:hidden;position:absolute;top:0;white-space:nowrap;width:1px}";
const css$4 = {
  code: "#svelte-announcer.svelte-1pdgbjn{clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;left:0;overflow:hidden;position:absolute;top:0;white-space:nowrap;width:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>#svelte-announcer{clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;left:0;overflow:hidden;position:absolute;top:0;white-space:nowrap;width:1px}</style>"],"names":[],"mappings":"AAqDO,gCAAiB,CAAC,KAAK,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,kBAAkB,MAAM,GAAG,CAAC,CAAC,UAAU,MAAM,GAAG,CAAC,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,CAAC,SAAS,MAAM,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,YAAY,MAAM,CAAC,MAAM,GAAG,CAAC"}`
};
const Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$4);
  {
    stores.page.set(page2);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
let base = "";
let assets = "";
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
const template = ({ head, body }) => '<!DOCTYPE html>\n<html class="light" data-theme="light" lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<meta http-equiv="x-ua-compatible" content="IE=edge,chrome=1" />\n		<meta http-equiv="content-type" content="text/html; charset=utf-8" />\n		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />\n		<meta content="/browserconfig.xml" name="msapplication-config">\n\n		<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />\n		<meta name="theme-color" content="#000" />\n		<meta content="#000" name="msapplication-TileColor">\n\n		<link rel="icon" type="image/x-icon" href="/favicon.ico" />\n		<link color="#fff" href="/favicon.ico" rel="mask-icon">\n\n		' + head + '\n	</head>\n	<body>\n		<div id="sveltekit-blog">' + body + "</div>\n	</body>\n	<noscript> Please enable JavaScript to continue using this application. </noscript>\n</html>\n";
let options = null;
const default_settings = { paths: { "base": "", "assets": "" } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  const hooks = get_hooks(user_hooks);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: assets + "/_app/start-7fef8869.js",
      css: [assets + "/_app/assets/start-464e9d0a.css", assets + "/_app/assets/vendor-863873a7.css"],
      js: [assets + "/_app/start-7fef8869.js", assets + "/_app/chunks/vendor-b3989e7d.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => assets + "/_app/" + entry_lookup[id],
    get_stack: (error2) => String(error2),
    handle_error: (error2, request) => {
      hooks.handleError({ error: error2, request });
      error2.stack = options.get_stack(error2);
    },
    hooks,
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#sveltekit-blog",
    template,
    trailing_slash: "never"
  };
}
const d = decodeURIComponent;
const empty = () => ({});
const manifest = {
  assets: [{ "file": "browserconfig.xml", "size": 221, "type": "application/xml" }, { "file": "favicon.ico", "size": 15406, "type": "image/vnd.microsoft.icon" }, { "file": "fonts/Raleway-400-normal.woff2", "size": 11500, "type": "font/woff2" }, { "file": "fonts/Raleway-500-normal.woff2", "size": 9764, "type": "font/woff2" }, { "file": "fonts/Raleway-600-normal.woff2", "size": 7888, "type": "font/woff2" }, { "file": "fonts/Raleway-700-normal.woff2", "size": 10456, "type": "font/woff2" }, { "file": "images/.gitkeep", "size": 0, "type": null }, { "file": "images/DIDO_WEB.jpg", "size": 82364, "type": "image/jpeg" }, { "file": "images/author/favicon-32x32.png", "size": 210, "type": "image/png" }, { "file": "images/author/sveltekit-blogger.svg", "size": 1721, "type": "image/svg+xml" }, { "file": "images/blogs/.gitkeep", "size": 0, "type": null }, { "file": "images/blogs/a-second-post/banner.jpg", "size": 10117, "type": "image/jpeg" }, { "file": "images/blogs/first-post/banner.jpg", "size": 32521, "type": "image/jpeg" }, { "file": "images/blogs/welcome-to-my-blog/banner.jpg", "size": 41430, "type": "image/jpeg" }, { "file": "images/blogs/yet-another-blog-post/banner.jpg", "size": 38596, "type": "image/jpeg" }, { "file": "images/logo-loose-lips.gif", "size": 2530269, "type": "image/gif" }, { "file": "images/snippets/.gitkeep", "size": 0, "type": null }, { "file": "images/snippets/first-snippet/banner.jpg", "size": 41929, "type": "image/jpeg" }, { "file": "images/snippets/second-snippet/banner.jpg", "size": 45836, "type": "image/jpeg" }, { "file": "images/snippets/yet-another-snippet/banner.jpg", "size": 46961, "type": "image/jpeg" }, { "file": "logos/buttondown.png", "size": 1476, "type": "image/png" }, { "file": "logos/css.png", "size": 1740, "type": "image/png" }, { "file": "logos/firebase.png", "size": 2668, "type": "image/png" }, { "file": "logos/google-analytics.png", "size": 679, "type": "image/png" }, { "file": "logos/google-sheets.png", "size": 1038, "type": "image/png" }, { "file": "logos/gumroad.png", "size": 2618, "type": "image/png" }, { "file": "logos/mailchimp.png", "size": 20649, "type": "image/png" }, { "file": "logos/mailgun.png", "size": 3611, "type": "image/png" }, { "file": "logos/mdx.png", "size": 1320, "type": "image/png" }, { "file": "logos/mosh1.gif", "size": 309649, "type": "image/gif" }, { "file": "logos/react.png", "size": 2647, "type": "image/png" }, { "file": "logos/sendgrid.png", "size": 404, "type": "image/png" }, { "file": "logos/slack.png", "size": 3489, "type": "image/png" }, { "file": "logos/spotify.png", "size": 2057, "type": "image/png" }, { "file": "logos/stripe.png", "size": 1417, "type": "image/png" }, { "file": "logos/youtube.png", "size": 1112, "type": "image/png" }, { "file": "robots.txt", "size": 77, "type": "text/plain" }, { "file": "rss.xml", "size": 2621, "type": "application/xml" }, { "file": "sitemap.xml", "size": 1971, "type": "application/xml" }, { "file": "tailwind.css", "size": 32381, "type": "text/css" }],
  layout: "src/routes/__layout.svelte",
  error: "src/routes/__error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/dashboard\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/dashboard/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/projects\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/projects/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "endpoint",
      pattern: /^\/snippets\.json$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return index_json$4;
      })
    },
    {
      type: "page",
      pattern: /^\/snippets\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/snippets/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/snippets\/yet-another-snippet\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/snippets/yet-another-snippet/index.md"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/snippets\/second-snippet\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/snippets/second-snippet/index.md"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/snippets\/first-snippet\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/snippets/first-snippet/index.md"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/events\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/events/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/about\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/about/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "endpoint",
      pattern: /^\/blog\.json$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return index_json$3;
      })
    },
    {
      type: "page",
      pattern: /^\/blog\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/blog/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/blog\/1010-dj-sets-that-i-was-too-tired-to-write-about-in-2022\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/blog/1010-dj-sets-that-i-was-too-tired-to-write-about-in-2022/index.md"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/blog\/elkka-live-at-corsica-studios-090222\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/blog/elkka-live-at-corsica-studios-090222/index.md"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/blog\/sphie-resuscitation-kim-cosmik-remix\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/blog/sphie-resuscitation-kim-cosmik-remix/index.md"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/crew\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/crew/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/tags\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/tags/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/tags\/([^/]+?)\/?$/,
      params: (m) => ({ tag: d(m[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/tags/[tag]/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "endpoint",
      pattern: /^\/api\/now-playing\.json$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return index_json$2;
      })
    },
    {
      type: "endpoint",
      pattern: /^\/api\/top-tracks\.json$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return index_json$1;
      })
    },
    {
      type: "endpoint",
      pattern: /^\/api\/github\.json$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return index_json;
      })
    }
  ]
};
const get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  handleError: hooks.handleError || (({ error: error2 }) => console.error(error2.stack)),
  externalFetch: hooks.externalFetch || fetch
});
const module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  "src/routes/__error.svelte": () => Promise.resolve().then(function() {
    return __error;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index$f;
  }),
  "src/routes/dashboard/index.svelte": () => Promise.resolve().then(function() {
    return index$e;
  }),
  "src/routes/projects/index.svelte": () => Promise.resolve().then(function() {
    return index$d;
  }),
  "src/routes/snippets/index.svelte": () => Promise.resolve().then(function() {
    return index$c;
  }),
  "src/routes/snippets/yet-another-snippet/index.md": () => Promise.resolve().then(function() {
    return index$b;
  }),
  "src/routes/snippets/second-snippet/index.md": () => Promise.resolve().then(function() {
    return index$a;
  }),
  "src/routes/snippets/first-snippet/index.md": () => Promise.resolve().then(function() {
    return index$9;
  }),
  "src/routes/events/index.svelte": () => Promise.resolve().then(function() {
    return index$8;
  }),
  "src/routes/about/index.svelte": () => Promise.resolve().then(function() {
    return index$7;
  }),
  "src/routes/blog/index.svelte": () => Promise.resolve().then(function() {
    return index$6;
  }),
  "src/routes/blog/1010-dj-sets-that-i-was-too-tired-to-write-about-in-2022/index.md": () => Promise.resolve().then(function() {
    return index$5;
  }),
  "src/routes/blog/elkka-live-at-corsica-studios-090222/index.md": () => Promise.resolve().then(function() {
    return index$4;
  }),
  "src/routes/blog/sphie-resuscitation-kim-cosmik-remix/index.md": () => Promise.resolve().then(function() {
    return index$3;
  }),
  "src/routes/crew/index.svelte": () => Promise.resolve().then(function() {
    return index$2;
  }),
  "src/routes/tags/index.svelte": () => Promise.resolve().then(function() {
    return index$1;
  }),
  "src/routes/tags/[tag]/index.svelte": () => Promise.resolve().then(function() {
    return index;
  })
};
const metadata_lookup = { "src/routes/__layout.svelte": { "entry": "pages/__layout.svelte-3fbb4049.js", "css": ["assets/pages/__layout.svelte-9640097d.css", "assets/vendor-863873a7.css"], "js": ["pages/__layout.svelte-3fbb4049.js", "chunks/vendor-b3989e7d.js", "chunks/ExternalLink-f61f9259.js", "chunks/environment-ac1cdc6c.js"], "styles": [] }, "src/routes/__error.svelte": { "entry": "pages/__error.svelte-8303b3fd.js", "css": ["assets/pages/__error.svelte-44d0ffb3.css", "assets/vendor-863873a7.css"], "js": ["pages/__error.svelte-8303b3fd.js", "chunks/vendor-b3989e7d.js", "chunks/HeadTags-412b7fc4.js", "chunks/environment-ac1cdc6c.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-7468339f.js", "css": ["assets/pages/index.svelte-6417d474.css", "assets/vendor-863873a7.css"], "js": ["pages/index.svelte-7468339f.js", "chunks/vendor-b3989e7d.js", "chunks/HeadTags-412b7fc4.js", "chunks/environment-ac1cdc6c.js", "chunks/BlogPost-da6a6125.js", "chunks/TagsContainer-2f511c62.js", "chunks/convert-to-slug-58a40897.js", "chunks/logger-a625a547.js", "chunks/ExternalLink-f61f9259.js"], "styles": [] }, "src/routes/dashboard/index.svelte": { "entry": "pages/dashboard/index.svelte-a338066f.js", "css": ["assets/vendor-863873a7.css"], "js": ["pages/dashboard/index.svelte-a338066f.js", "chunks/vendor-b3989e7d.js", "chunks/ExternalLink-f61f9259.js", "chunks/HeadTags-412b7fc4.js", "chunks/environment-ac1cdc6c.js"], "styles": [] }, "src/routes/projects/index.svelte": { "entry": "pages/projects/index.svelte-47cc2ec4.js", "css": ["assets/vendor-863873a7.css"], "js": ["pages/projects/index.svelte-47cc2ec4.js", "chunks/vendor-b3989e7d.js", "chunks/env-a13806e5.js", "chunks/HeadTags-412b7fc4.js", "chunks/environment-ac1cdc6c.js"], "styles": [] }, "src/routes/snippets/index.svelte": { "entry": "pages/snippets/index.svelte-e42d8823.js", "css": ["assets/vendor-863873a7.css"], "js": ["pages/snippets/index.svelte-e42d8823.js", "chunks/vendor-b3989e7d.js", "chunks/HeadTags-412b7fc4.js", "chunks/environment-ac1cdc6c.js"], "styles": [] }, "src/routes/snippets/yet-another-snippet/index.md": { "entry": "pages/snippets/yet-another-snippet/index.md-ec0fed1d.js", "css": ["assets/vendor-863873a7.css"], "js": ["pages/snippets/yet-another-snippet/index.md-ec0fed1d.js", "chunks/vendor-b3989e7d.js", "chunks/SnippetsLayout-6a42e328.js", "chunks/environment-ac1cdc6c.js", "chunks/HeadTags-412b7fc4.js", "chunks/ExternalLink-f61f9259.js", "chunks/reading-time-e91042f0.js"], "styles": [] }, "src/routes/snippets/second-snippet/index.md": { "entry": "pages/snippets/second-snippet/index.md-e0ad1056.js", "css": ["assets/vendor-863873a7.css"], "js": ["pages/snippets/second-snippet/index.md-e0ad1056.js", "chunks/vendor-b3989e7d.js", "chunks/SnippetsLayout-6a42e328.js", "chunks/environment-ac1cdc6c.js", "chunks/HeadTags-412b7fc4.js", "chunks/ExternalLink-f61f9259.js", "chunks/reading-time-e91042f0.js"], "styles": [] }, "src/routes/snippets/first-snippet/index.md": { "entry": "pages/snippets/first-snippet/index.md-4a6a589b.js", "css": ["assets/vendor-863873a7.css"], "js": ["pages/snippets/first-snippet/index.md-4a6a589b.js", "chunks/vendor-b3989e7d.js", "chunks/SnippetsLayout-6a42e328.js", "chunks/environment-ac1cdc6c.js", "chunks/HeadTags-412b7fc4.js", "chunks/ExternalLink-f61f9259.js", "chunks/reading-time-e91042f0.js"], "styles": [] }, "src/routes/events/index.svelte": { "entry": "pages/events/index.svelte-7a75242c.js", "css": ["assets/vendor-863873a7.css"], "js": ["pages/events/index.svelte-7a75242c.js", "chunks/vendor-b3989e7d.js", "chunks/HeadTags-412b7fc4.js", "chunks/environment-ac1cdc6c.js", "chunks/logger-a625a547.js", "chunks/ExternalLink-f61f9259.js"], "styles": [] }, "src/routes/about/index.svelte": { "entry": "pages/about/index.svelte-4da10604.js", "css": ["assets/vendor-863873a7.css"], "js": ["pages/about/index.svelte-4da10604.js", "chunks/vendor-b3989e7d.js", "chunks/HeadTags-412b7fc4.js", "chunks/environment-ac1cdc6c.js"], "styles": [] }, "src/routes/blog/index.svelte": { "entry": "pages/blog/index.svelte-071c1582.js", "css": ["assets/vendor-863873a7.css"], "js": ["pages/blog/index.svelte-071c1582.js", "chunks/vendor-b3989e7d.js", "chunks/HeadTags-412b7fc4.js", "chunks/environment-ac1cdc6c.js", "chunks/BlogPost-da6a6125.js", "chunks/TagsContainer-2f511c62.js", "chunks/convert-to-slug-58a40897.js"], "styles": [] }, "src/routes/blog/1010-dj-sets-that-i-was-too-tired-to-write-about-in-2022/index.md": { "entry": "pages/blog/1010-dj-sets-that-i-was-too-tired-to-write-about-in-2022/index.md-6578aa01.js", "css": ["assets/vendor-863873a7.css"], "js": ["pages/blog/1010-dj-sets-that-i-was-too-tired-to-write-about-in-2022/index.md-6578aa01.js", "chunks/vendor-b3989e7d.js", "chunks/BlogLayout-527cccc2.js", "chunks/environment-ac1cdc6c.js", "chunks/HeadTags-412b7fc4.js", "chunks/ExternalLink-f61f9259.js", "chunks/reading-time-e91042f0.js", "chunks/TagsContainer-2f511c62.js", "chunks/convert-to-slug-58a40897.js"], "styles": [] }, "src/routes/blog/elkka-live-at-corsica-studios-090222/index.md": { "entry": "pages/blog/elkka-live-at-corsica-studios-090222/index.md-cf045936.js", "css": ["assets/vendor-863873a7.css"], "js": ["pages/blog/elkka-live-at-corsica-studios-090222/index.md-cf045936.js", "chunks/vendor-b3989e7d.js", "chunks/BlogLayout-527cccc2.js", "chunks/environment-ac1cdc6c.js", "chunks/HeadTags-412b7fc4.js", "chunks/ExternalLink-f61f9259.js", "chunks/reading-time-e91042f0.js", "chunks/TagsContainer-2f511c62.js", "chunks/convert-to-slug-58a40897.js"], "styles": [] }, "src/routes/blog/sphie-resuscitation-kim-cosmik-remix/index.md": { "entry": "pages/blog/sphie-resuscitation-kim-cosmik-remix/index.md-984fefc6.js", "css": ["assets/vendor-863873a7.css"], "js": ["pages/blog/sphie-resuscitation-kim-cosmik-remix/index.md-984fefc6.js", "chunks/vendor-b3989e7d.js", "chunks/BlogLayout-527cccc2.js", "chunks/environment-ac1cdc6c.js", "chunks/HeadTags-412b7fc4.js", "chunks/ExternalLink-f61f9259.js", "chunks/reading-time-e91042f0.js", "chunks/TagsContainer-2f511c62.js", "chunks/convert-to-slug-58a40897.js"], "styles": [] }, "src/routes/crew/index.svelte": { "entry": "pages/crew/index.svelte-a1f8e5b6.js", "css": ["assets/vendor-863873a7.css"], "js": ["pages/crew/index.svelte-a1f8e5b6.js", "chunks/vendor-b3989e7d.js", "chunks/env-a13806e5.js", "chunks/HeadTags-412b7fc4.js", "chunks/environment-ac1cdc6c.js"], "styles": [] }, "src/routes/tags/index.svelte": { "entry": "pages/tags/index.svelte-043a98c4.js", "css": ["assets/vendor-863873a7.css"], "js": ["pages/tags/index.svelte-043a98c4.js", "chunks/vendor-b3989e7d.js", "chunks/HeadTags-412b7fc4.js", "chunks/environment-ac1cdc6c.js", "chunks/convert-to-slug-58a40897.js"], "styles": [] }, "src/routes/tags/[tag]/index.svelte": { "entry": "pages/tags/[tag]/index.svelte-c257131a.js", "css": ["assets/vendor-863873a7.css"], "js": ["pages/tags/[tag]/index.svelte-c257131a.js", "chunks/vendor-b3989e7d.js", "chunks/HeadTags-412b7fc4.js", "chunks/environment-ac1cdc6c.js", "chunks/BlogPost-da6a6125.js", "chunks/TagsContainer-2f511c62.js", "chunks/convert-to-slug-58a40897.js"], "styles": [] } };
async function load_component(file) {
  const { entry, css: css2, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + "/_app/" + entry,
    css: css2.map((dep) => assets + "/_app/" + dep),
    js: js.map((dep) => assets + "/_app/" + dep),
    styles
  };
}
function render(request, {
  prerender: prerender2
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender: prerender2 });
}
const slugFromPath = (path) => {
  var _a, _b;
  return (_b = (_a = path.match(/([\w-]+)\.(svelte\.md|md|svx)/i)) == null ? void 0 : _a[1]) != null ? _b : null;
};
async function get$4({
  query
}) {
  var _a, _b;
  const modules = { "./first-snippet/index.md": () => Promise.resolve().then(function() {
    return index$9;
  }), "./second-snippet/index.md": () => Promise.resolve().then(function() {
    return index$a;
  }), "./yet-another-snippet/index.md": () => Promise.resolve().then(function() {
    return index$b;
  }) };
  const snipptePromises = [];
  const limit = Number((_a = query.get("limit")) != null ? _a : Infinity);
  const recent = Number((_b = query.get("recent")) != null ? _b : Infinity);
  if (Number.isNaN(limit)) {
    return {
      status: 400
    };
  }
  if (Number.isNaN(recent)) {
    return {
      status: 400
    };
  }
  for (const [path, resolver] of Object.entries(modules)) {
    const slug = slugFromPath(path);
    const promise = resolver().then((snippet) => {
      return { slug, ...snippet.metadata };
    });
    snipptePromises.push(promise);
  }
  const sliceParam = query.get("recent") ? recent : limit;
  const snippets = await Promise.all(snipptePromises);
  const publishedPosts = snippets.filter((snippet) => snippet.published).slice(0, sliceParam);
  publishedPosts.sort((a, b) => new Date(a.date) > new Date(b.date) ? -1 : 1);
  return {
    body: publishedPosts.slice(0, sliceParam)
  };
}
var index_json$4 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$4
});
async function get$3({ query }) {
  var _a, _b;
  const modules = { "./1010-dj-sets-that-i-was-too-tired-to-write-about-in-2022/index.md": () => Promise.resolve().then(function() {
    return index$5;
  }), "./elkka-live-at-corsica-studios-090222/index.md": () => Promise.resolve().then(function() {
    return index$4;
  }), "./sphie-resuscitation-kim-cosmik-remix/index.md": () => Promise.resolve().then(function() {
    return index$3;
  }) };
  const postPromises = [];
  const limit = Number((_a = query.get("limit")) != null ? _a : Infinity);
  const recent = Number((_b = query.get("recent")) != null ? _b : Infinity);
  if (Number.isNaN(limit)) {
    return {
      status: 400
    };
  }
  if (Number.isNaN(recent)) {
    return {
      status: 400
    };
  }
  for (const [path, resolver] of Object.entries(modules)) {
    const slug = slugFromPath(path);
    const promise = resolver().then((post) => {
      return { slug, ...post.metadata };
    });
    postPromises.push(promise);
  }
  const sliceParam = query.get("recent") ? recent : limit;
  const posts = await Promise.all(postPromises);
  const publishedPosts = posts.filter((post) => post.published).slice(0, sliceParam);
  publishedPosts.sort((a, b) => new Date(a.date) > new Date(b.date) ? -1 : 1);
  return {
    body: publishedPosts.slice(0, sliceParam),
    status: 200
  };
}
var index_json$3 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$3
});
var EnvironmentName;
(function(EnvironmentName2) {
  EnvironmentName2["PRODUCTION"] = "Production";
  EnvironmentName2["QA"] = "QA";
  EnvironmentName2["DEVELOPMENT"] = "Developement";
  EnvironmentName2["LOCAL"] = "Local";
})(EnvironmentName || (EnvironmentName = {}));
var EnvironmentType;
(function(EnvironmentType2) {
  EnvironmentType2[EnvironmentType2["PROD"] = 0] = "PROD";
  EnvironmentType2[EnvironmentType2["QA"] = 1] = "QA";
  EnvironmentType2[EnvironmentType2["DEV"] = 2] = "DEV";
  EnvironmentType2[EnvironmentType2["LOCAL"] = 3] = "LOCAL";
})(EnvironmentType || (EnvironmentType = {}));
var SVELTEKIT_DATA_ENPOINTS_PROD;
(function(SVELTEKIT_DATA_ENPOINTS_PROD2) {
  SVELTEKIT_DATA_ENPOINTS_PROD2["SERVICE"] = "/service";
})(SVELTEKIT_DATA_ENPOINTS_PROD || (SVELTEKIT_DATA_ENPOINTS_PROD = {}));
var SVELTEKIT_SEARCH_ENPOINTS_PROD;
(function(SVELTEKIT_SEARCH_ENPOINTS_PROD2) {
  SVELTEKIT_SEARCH_ENPOINTS_PROD2["SEARCH"] = "/search";
})(SVELTEKIT_SEARCH_ENPOINTS_PROD || (SVELTEKIT_SEARCH_ENPOINTS_PROD = {}));
const environment = {
  name: EnvironmentName.PRODUCTION,
  environmentType: EnvironmentType.PROD,
  production: true,
  isDebugMode: false,
  launchURL: {}.SVELTEKIT_BLOG_BASE_URL,
  apiUrls: {
    CHUCK_NORRIS: {}.SVELTEKIT_BLOG_CHUCK_NORRIS_API_URL,
    IN_MEMORY: "",
    GITHUB: {}.SVELTEKIT_BLOG_GITHUB_API_URL
  },
  chuckNorriesAPIConfig: {
    defaultAPILang: "en-US",
    endPoints: {
      SEARCH: SVELTEKIT_SEARCH_ENPOINTS_PROD.SEARCH,
      SERVICE: SVELTEKIT_DATA_ENPOINTS_PROD.SERVICE
    }
  },
  sessionConfig: {
    SESSION_KEY: {}.SVELTEKIT_BLOG_SESSION_KEY
  },
  spotifyConfig: {
    SPOTIFY_CLIENT_BASIC: {}.SVELTEKIT_BLOG_SPOTIFY_CLIENT_BASIC,
    SPOTIFY_CLIENT_ID: {}.SVELTEKIT_BLOG_SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: {}.SVELTEKIT_BLOG_SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REFRESH_TOKEN: {}.SVELTEKIT_BLOG_SPOTIFY_REFRESH_TOKEN,
    SPOTIFY_NOW_PLAYING_ENDPOINT: {}.SVELTEKIT_BLOG_SPOTIFY_NOW_PLAYING_ENDPOINT,
    SPOTIFY_TOP_TRACKS_ENDPOINT: {}.SVELTEKIT_BLOG_SPOTIFY_TOP_TRACKS_ENDPOINT,
    SPOTIFY_TOKEN_ENDPOINT: {}.SVELTEKIT_BLOG_SPOTIFY_TOKEN_ENDPOINT
  },
  twitterConfig: {
    TWITTER_API_KEY: {}.SVELTEKIT_BLOG_TWITTER_API_KEY,
    TWITTER_TWEETS_ENDPOINT: {}.SVELTEKIT_BLOG_TWITTER_TWEETS_ENDPOINT,
    TWITTER_SEARCH_URL: {}.SVELTEKIT_BLOG_TWITTER_SEARCH_URL
  },
  gitHubConfig: {
    GITHUB_BLOG_EDIT_URL: {}.SVELTEKIT_BLOG_GITHUB_BLOG_EDIT_URL,
    GITHUB_SNIPPETS_EDIT_URL: {}.SVELTEKIT_BLOG_GITHUB_SNIPPETS_EDIT_URL,
    GITHUB_API_URL: {}.SVELTEKIT_BLOG_GITHUB_API_URL,
    GITHUB_USER_ENDPOINT: {}.SVELTEKIT_BLOG_GITHUB_USER_ENDPOINT,
    GITHUB_USER_REPO_ENDPOINT: {}.SVELTEKIT_BLOG_GITHUB_USER_REPO_ENDPOINT
  }
};
const refresh_token = `${environment.spotifyConfig.SPOTIFY_REFRESH_TOKEN}`.trim().slice();
const basic = `${environment.spotifyConfig.SPOTIFY_CLIENT_BASIC}`.trim().slice();
const NOW_PLAYING_ENDPOINT = `${environment.spotifyConfig.SPOTIFY_NOW_PLAYING_ENDPOINT}`.trim().slice();
const TOP_TRACKS_ENDPOINT = `${environment.spotifyConfig.SPOTIFY_TOP_TRACKS_ENDPOINT}`.trim().slice();
const TOKEN_ENDPOINT = `${environment.spotifyConfig.SPOTIFY_TOKEN_ENDPOINT}`.trim().slice();
const getAccessToken = async () => {
  return await fetch(`${TOKEN_ENDPOINT}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token
    })
  }).then((res) => res.json());
};
const getNowPlaying = async () => {
  const { access_token } = await getAccessToken();
  return fetch(`${NOW_PLAYING_ENDPOINT}`, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });
};
const getTopTracks = async () => {
  const { access_token } = await getAccessToken();
  return fetch(`${TOP_TRACKS_ENDPOINT}`, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });
};
async function get$2() {
  const response = await getNowPlaying();
  if (response.status === 204 || response.status > 400) {
    return {
      status: 200,
      body: { isPlaying: false }
    };
  }
  const song = await response.json();
  if (song.item === null) {
    return {
      status: 200,
      body: { isPlaying: false }
    };
  }
  const isPlaying = song.is_playing;
  const title = song.item.name;
  const artist = song.item.artists.map((_artist) => _artist.name).join(", ");
  const album = song.item.album.name;
  const albumImageUrl = song.item.album.images[0].url;
  const songUrl = song.item.external_urls.spotify;
  return {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30"
    },
    body: {
      album,
      albumImageUrl,
      artist,
      isPlaying,
      songUrl,
      title
    }
  };
}
var index_json$2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$2
});
async function get$1({
  query
}) {
  var _a;
  const limit = Number((_a = query.get("limit")) != null ? _a : 10);
  if (Number.isNaN(limit)) {
    return {
      status: 400
    };
  }
  const response = await getTopTracks();
  const { items } = await response.json();
  const tracks = items.slice(0, limit).map((track, index2) => ({
    artist: track.artists.map((_artist) => _artist.name).join(", "),
    songUrl: track.external_urls.spotify,
    title: track.name,
    ranking: index2 + 1
  }));
  return {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200"
    },
    body: tracks
  };
}
var index_json$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$1
});
const GITHUB_USER_ENDPOINT = "https://api.github.com/users/navneetsharmaui";
const GITHUB_USER_REPO_ENDPOINT = "https://api.github.com/users/navneetsharmaui/repos?per_page=100";
async function get({
  query
}) {
  var _a;
  const limit = Number((_a = query.get("limit")) != null ? _a : 10);
  if (Number.isNaN(limit)) {
    return {
      status: 400
    };
  }
  const githubUser = await fetch$1(GITHUB_USER_ENDPOINT);
  const githubUserRepos = await fetch$1(GITHUB_USER_REPO_ENDPOINT);
  const user = await githubUser.json();
  const allRespos = await githubUserRepos.json();
  const reposWithoutFork = allRespos.filter((repo) => !repo.fork);
  const stars = reposWithoutFork.reduce((accumulator, repo) => `${accumulator} ${repo["stargazers_count"]}`, 0);
  return {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=1200, stale-while-revalidate=600"
    },
    body: { followers: user.followers, stars }
  };
}
var index_json = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get
});
var tailwind = '/*! tailwindcss v2.2.7 | MIT License | https://tailwindcss.com*//*! modern-normalize v1.1.0 | MIT License | https://github.com/sindresorhus/modern-normalize */html{-webkit-text-size-adjust:100%;line-height:1.15;-moz-tab-size:4;-o-tab-size:4;tab-size:4}body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;margin:0}hr{color:inherit;height:0}abbr[title]{-webkit-text-decoration:underline dotted;text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}::-moz-focus-inner{border-style:none;padding:0}:-moz-focusring{outline:1px dotted ButtonText}:-moz-ui-invalid{box-shadow:none}legend{padding:0}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}button{background-color:transparent;background-image:none}fieldset,ol,ul{margin:0;padding:0}ol,ul{list-style:none}html{font-family:Raleway,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;line-height:1.5}body{font-family:inherit;line-height:inherit}*,:after,:before{border:0 solid;box-sizing:border-box}hr{border-top-width:1px}img{border-style:solid}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{color:#9ca3af;opacity:1}input:-ms-input-placeholder,textarea:-ms-input-placeholder{color:#9ca3af;opacity:1}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}table{border-collapse:collapse}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}button,input,optgroup,select,textarea{color:inherit;line-height:inherit;padding:0}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]{display:none}*,:after,:before{--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-transform:translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));--tw-border-opacity:1;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-blur:var(--tw-empty,/*!*/ /*!*/);--tw-brightness:var(--tw-empty,/*!*/ /*!*/);--tw-contrast:var(--tw-empty,/*!*/ /*!*/);--tw-grayscale:var(--tw-empty,/*!*/ /*!*/);--tw-hue-rotate:var(--tw-empty,/*!*/ /*!*/);--tw-invert:var(--tw-empty,/*!*/ /*!*/);--tw-saturate:var(--tw-empty,/*!*/ /*!*/);--tw-sepia:var(--tw-empty,/*!*/ /*!*/);--tw-drop-shadow:var(--tw-empty,/*!*/ /*!*/);--tw-filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);border-color:rgba(229,231,235,var(--tw-border-opacity))}.container{width:100%}@media (min-width:640px){.container{max-width:640px}}@media (min-width:768px){.container{max-width:768px}}@media (min-width:1024px){.container{max-width:1024px}}@media (min-width:1280px){.container{max-width:1280px}}@media (min-width:1536px){.container{max-width:1536px}}.prose{color:#374151;max-width:65ch}.prose [class~=lead]{color:#4b5563;font-size:1.25em;line-height:1.6;margin-bottom:1.2em;margin-top:1.2em}.prose a{color:#3b82f6;font-weight:500;text-decoration:underline}.prose a:hover{color:#1d4ed8}.prose a code{color:#60a5fa}.prose strong{color:#111827;font-weight:600}.prose ol[type=A]{--list-counter-style:upper-alpha}.prose ol[type=a]{--list-counter-style:lower-alpha}.prose ol[type=A s]{--list-counter-style:upper-alpha}.prose ol[type=a s]{--list-counter-style:lower-alpha}.prose ol[type=I]{--list-counter-style:upper-roman}.prose ol[type=i]{--list-counter-style:lower-roman}.prose ol[type=I s]{--list-counter-style:upper-roman}.prose ol[type=i s]{--list-counter-style:lower-roman}.prose ol[type="1"]{--list-counter-style:decimal}.prose ol>li{padding-left:1.75em;position:relative}.prose ol>li:before{color:#6b7280;content:counter(list-item,var(--list-counter-style,decimal)) ".";font-weight:400;left:0;position:absolute}.prose ul>li{padding-left:1.75em;position:relative}.prose ul>li:before{background-color:#d1d5db;border-radius:50%;content:"";height:.375em;left:.25em;position:absolute;top:.6875em;width:.375em}.prose hr{border-color:#e5e7eb;border-top-width:1px;margin-bottom:3em;margin-top:3em}.prose blockquote{border-left-color:#e5e7eb;border-left-width:.25rem;color:#111827;font-style:italic;font-weight:500;margin-bottom:1.6em;margin-top:1.6em;padding-left:1em;quotes:"\\201C""\\201D""\\2018""\\2019"}.prose h1{color:#111827;font-size:2.25em;font-weight:800;line-height:1.1111111;margin-bottom:.8888889em;margin-top:0}.prose h2{color:#111827;font-size:1.5em;font-weight:700;line-height:1.3333333;margin-bottom:1em;margin-top:2em}.prose h3{color:#111827;font-size:1.25em;font-weight:600;line-height:1.6;margin-bottom:.6em;margin-top:1.6em}.prose h4{color:#111827;font-weight:600;line-height:1.5;margin-bottom:.5em;margin-top:1.5em}.prose figure figcaption{color:#6b7280;font-size:.875em;line-height:1.4285714;margin-top:.8571429em}.prose code{color:#ec4899;font-size:.875em;font-weight:600}.prose code:after,.prose code:before{content:"`"}.prose a code{color:#111827}.prose pre{background-color:#1f2937;border-radius:.375rem;color:#e5e7eb;font-size:.875em;line-height:1.7142857;margin-bottom:1.7142857em;margin-top:1.7142857em;overflow-x:auto;padding:.8571429em 1.1428571em}.prose pre code{background-color:transparent;border-radius:0;border-width:0;color:inherit;font-family:inherit;font-size:inherit;font-weight:400;line-height:inherit;padding:0}.prose pre code:after,.prose pre code:before{content:none}.prose table{font-size:.875em;line-height:1.7142857;margin-bottom:2em;margin-top:2em;table-layout:auto;text-align:left;width:100%}.prose thead{border-bottom-color:#d1d5db;border-bottom-width:1px;color:#111827;font-weight:600}.prose thead th{padding-bottom:.5714286em;padding-left:.5714286em;padding-right:.5714286em;vertical-align:bottom}.prose tbody tr{border-bottom-color:#e5e7eb;border-bottom-width:1px}.prose tbody tr:last-child{border-bottom-width:0}.prose tbody td{padding:.5714286em;vertical-align:top}.prose{font-size:1rem;line-height:1.75}.prose p{margin-bottom:1.25em;margin-top:1.25em}.prose figure,.prose img,.prose video{margin-bottom:2em;margin-top:2em}.prose figure>*{margin-bottom:0;margin-top:0}.prose h2 code{font-size:.875em}.prose h3 code{font-size:.9em}.prose ol,.prose ul{margin-bottom:1.25em;margin-top:1.25em}.prose li{margin-bottom:.5em;margin-top:.5em}.prose>ul>li p{margin-bottom:.75em;margin-top:.75em}.prose>ul>li>:first-child{margin-top:1.25em}.prose>ul>li>:last-child{margin-bottom:1.25em}.prose>ol>li>:first-child{margin-top:1.25em}.prose>ol>li>:last-child{margin-bottom:1.25em}.prose ol ol,.prose ol ul,.prose ul ol,.prose ul ul{margin-bottom:.75em;margin-top:.75em}.prose h2+*,.prose h3+*,.prose h4+*,.prose hr+*{margin-top:0}.prose thead th:first-child{padding-left:0}.prose thead th:last-child{padding-right:0}.prose tbody td:first-child{padding-left:0}.prose tbody td:last-child{padding-right:0}.prose>:first-child{margin-top:0}.prose>:last-child{margin-bottom:0}.prose h2,.prose h3,.prose h4{scroll-margin-top:8rem}.static{position:static}.absolute{position:absolute}.relative{position:relative}.right-3{right:.75rem}.top-3{top:.75rem}.z-10{z-index:10}.mx-auto{margin-left:auto;margin-right:auto}.my-2{margin-bottom:.5rem;margin-top:.5rem}.mx-2{margin-left:.5rem;margin-right:.5rem}.my-4{margin-bottom:1rem;margin-top:1rem}.mx-3{margin-left:.75rem;margin-right:.75rem}.mb-16{margin-bottom:4rem}.mb-4{margin-bottom:1rem}.mt-4{margin-top:1rem}.mr-2{margin-right:.5rem}.ml-2{margin-left:.5rem}.mb-2{margin-bottom:.5rem}.mt-8{margin-top:2rem}.mb-8{margin-bottom:2rem}.mt-16{margin-top:4rem}.mt-2{margin-top:.5rem}.ml-auto{margin-left:auto}.mt-1{margin-top:.25rem}.mr-4{margin-right:1rem}.mb-5{margin-bottom:1.25rem}.mt-5{margin-top:1.25rem}.mb-10{margin-bottom:2.5rem}.mr-3{margin-right:.75rem}.ml-1{margin-left:.25rem}.block{display:block}.flex{display:flex}.inline-flex{display:inline-flex}.grid{display:grid}.hidden{display:none}.h-5{height:1.25rem}.h-7{height:1.75rem}.h-4{height:1rem}.h-14{height:3.5rem}.h-12{height:3rem}.h-10{height:2.5rem}.h-8{height:2rem}.h-3{height:.75rem}.w-full{width:100%}.w-5{width:1.25rem}.w-7{width:1.75rem}.w-32{width:8rem}.w-4{width:1rem}.w-14{width:3.5rem}.w-auto{width:auto}.w-8{width:2rem}.w-3{width:.75rem}.w-1\\/2{width:50%}.w-60{width:15rem}.max-w-2xl{max-width:42rem}.max-w-5xl{max-width:64rem}.max-w-6xl{max-width:72rem}.max-w-none{max-width:none}.max-w-full{max-width:100%}.max-w-max{max-width:-webkit-max-content;max-width:-moz-max-content;max-width:max-content}.max-w-4xl{max-width:56rem}.max-w-3xl{max-width:48rem}.flex-shrink-0{flex-shrink:0}.transform{transform:var(--tw-transform)}@-webkit-keyframes e{to{transform:rotate(1turn)}}@keyframes e{to{transform:rotate(1turn)}}.animate-spin{-webkit-animation:e 1s linear infinite;animation:e 1s linear infinite}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.flex-row{flex-direction:row}.flex-row-reverse{flex-direction:row-reverse}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.items-start{align-items:flex-start}.items-center{align-items:center}.items-baseline{align-items:baseline}.justify-start{justify-content:flex-start}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-4{gap:1rem}.space-x-0>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(0px*(1 - var(--tw-space-x-reverse)));margin-right:calc(0px*var(--tw-space-x-reverse))}.space-y-4>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(1rem*var(--tw-space-y-reverse));margin-top:calc(1rem*(1 - var(--tw-space-y-reverse)))}.space-x-2>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(.5rem*(1 - var(--tw-space-x-reverse)));margin-right:calc(.5rem*var(--tw-space-x-reverse))}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rounded-md{border-radius:.375rem}.rounded-full{border-radius:9999px}.rounded{border-radius:.25rem}.border{border-width:1px}.border-b{border-bottom-width:1px}.border-gray-300{--tw-border-opacity:1;border-color:rgba(209,213,219,var(--tw-border-opacity))}.border-gray-100{--tw-border-opacity:1;border-color:rgba(243,244,246,var(--tw-border-opacity))}.border-gray-200{--tw-border-opacity:1;border-color:rgba(229,231,235,var(--tw-border-opacity))}.border-green-200{--tw-border-opacity:1;border-color:rgba(167,243,208,var(--tw-border-opacity))}.bg-yellow-50{--tw-bg-opacity:1;background-color:rgba(255,251,235,var(--tw-bg-opacity))}.bg-white{--tw-bg-opacity:1;background-color:rgba(255,255,255,var(--tw-bg-opacity))}.bg-green-50{--tw-bg-opacity:1;background-color:rgba(236,253,245,var(--tw-bg-opacity))}.bg-opacity-60{--tw-bg-opacity:0.6}.p-5{padding:1.25rem}.p-4{padding:1rem}.p-6{padding:1.5rem}.p-1{padding:.25rem}.p-1\\.5{padding:.375rem}.px-8{padding-left:2rem;padding-right:2rem}.px-4{padding-left:1rem;padding-right:1rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.pt-4{padding-top:1rem}.pb-5{padding-bottom:1.25rem}.pb-16{padding-bottom:4rem}.pt-2{padding-top:.5rem}.pb-2{padding-bottom:.5rem}.pl-3{padding-left:.75rem}.text-left{text-align:left}.text-2xl{font-size:1.5rem;line-height:2rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-xs{font-size:.75rem;line-height:1rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-4xl{font-size:2.25rem;line-height:2.5rem}.font-bold{font-weight:700}.font-medium{font-weight:500}.leading-5{line-height:1.25rem}.tracking-tight{letter-spacing:-.025em}.text-black{--tw-text-opacity:1;color:rgba(0,0,0,var(--tw-text-opacity))}.text-white{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}.text-gray-600{--tw-text-opacity:1;color:rgba(75,85,99,var(--tw-text-opacity))}.text-blue-500{--tw-text-opacity:1;color:rgba(59,130,246,var(--tw-text-opacity))}.text-gray-900{--tw-text-opacity:1;color:rgba(17,24,39,var(--tw-text-opacity))}.text-gray-400{--tw-text-opacity:1;color:rgba(156,163,175,var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgba(107,114,128,var(--tw-text-opacity))}.text-gray-700{--tw-text-opacity:1;color:rgba(55,65,81,var(--tw-text-opacity))}.text-gray-800{--tw-text-opacity:1;color:rgba(31,41,55,var(--tw-text-opacity))}.text-red-800{--tw-text-opacity:1;color:rgba(153,27,27,var(--tw-text-opacity))}.text-green-500{--tw-text-opacity:1;color:rgba(16,185,129,var(--tw-text-opacity))}.text-green-700{--tw-text-opacity:1;color:rgba(4,120,87,var(--tw-text-opacity))}.opacity-25{opacity:.25}.opacity-75{opacity:.75}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.06);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.blur{--tw-blur:blur(8px)}.blur,.drop-shadow{filter:var(--tw-filter)}.drop-shadow{--tw-drop-shadow:drop-shadow(0 1px 2px rgba(0,0,0,0.1)) drop-shadow(0 1px 1px rgba(0,0,0,0.06))}.drop-shadow-xl{--tw-drop-shadow:drop-shadow(0 20px 13px rgba(0,0,0,0.03)) drop-shadow(0 8px 5px rgba(0,0,0,0.08))}.drop-shadow-xl,.filter{filter:var(--tw-filter)}.transition{transition-duration:.15s;transition-property:background-color,border-color,color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:background-color,border-color,color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:background-color,border-color,color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1)}@font-face{font-display:swap;font-family:Raleway;font-style:normal;font-weight:400;src:url(/fonts/Raleway-400-normal.woff2) format("woff2")}@font-face{font-display:swap;font-family:Raleway;font-style:normal;font-weight:500;src:url(/fonts/Raleway-500-normal.woff2) format("woff2")}@font-face{font-display:swap;font-family:Raleway;font-style:normal;font-weight:600;src:url(/fonts/Raleway-600-normal.woff2) format("woff2")}@font-face{font-display:swap;font-family:Raleway;font-style:normal;font-weight:700;src:url(/fonts/Raleway-700-normal.woff2) format("woff2")}::-moz-selection{background-color:#80b9d3;color:#fefefe}::selection{background-color:#80b9d3;color:#fefefe}::-webkit-scrollbar-track{background-color:#666;border-radius:4px;box-shadow:inset 0 0 6px rgba(0,0,0,.3)}::-webkit-scrollbar{background-color:#666;width:6px}::-webkit-scrollbar-thumb{background-color:#3b3838;border-radius:4px;box-shadow:inset 0 0 6px rgba(0,0,0,.3)}html{min-width:360px;scroll-behavior:smooth}#navneetsharma-blog{display:flex;flex-direction:column;min-height:100vh}.sticky-nav{-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);position:sticky;top:0;transition:background-color .1s ease-in-out;z-index:10}.skip-nav{--tw-translate-y:-3rem;left:25%;padding:.5rem 1rem;position:absolute;top:-2rem;transform:var(--tw-transform);transition-duration:.15s;transition-duration:.2s;transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1)}.skip-nav:focus{--tw-translate-y:0.75rem;top:1rem;transform:var(--tw-transform)}main{min-height:calc(100vh - 104px)}@supports not ((-webkit-backdrop-filter:none) or (backdrop-filter:none)){.sticky-nav{--tw-bg-opacity:1;-webkit-backdrop-filter:none;backdrop-filter:none}}@supports ((-webkit-backdrop-filter:none) or (backdrop-filter:none)){.sticky-nav{-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}}.anchor,.anchor:hover{text-decoration:none;visibility:visible}.prose a{--tw-text-opacity:1;color:rgba(37,99,235,var(--tw-text-opacity));font-weight:600;text-decoration:underline}.prose .anchor:after{--tw-text-opacity:1;color:rgba(75,85,99,var(--tw-text-opacity))}.dark .prose .anchor:after{--tw-text-opacity:1;color:rgba(209,213,219,var(--tw-text-opacity))}.prose .anchor,.prose :hover>.anchor{text-decoration:none;visibility:visible}.prose .anchor{--tw-text-opacity:1;color:rgba(55,65,81,var(--tw-text-opacity))}.dark .prose .anchor{--tw-text-opacity:1;color:rgba(107,114,128,var(--tw-text-opacity))}.prose pre{background-color:rgba(249,250,251,var(--tw-bg-opacity));border-color:rgba(229,231,235,var(--tw-border-opacity));border-width:1px}.dark .prose pre,.prose pre{--tw-border-opacity:1;--tw-bg-opacity:1}.dark .prose pre{background-color:rgba(17,24,39,var(--tw-bg-opacity));border-color:rgba(55,65,81,var(--tw-border-opacity))}.prose code{background-color:rgba(243,244,246,var(--tw-bg-opacity));border-color:rgba(243,244,246,var(--tw-border-opacity));border-radius:.375rem;border-width:1px;color:rgba(31,41,55,var(--tw-text-opacity));padding:.125rem .25rem}.dark .prose code,.prose code{--tw-border-opacity:1;--tw-bg-opacity:1;--tw-text-opacity:1}.dark .prose code{background-color:rgba(17,24,39,var(--tw-bg-opacity));border-color:rgba(31,41,55,var(--tw-border-opacity));color:rgba(229,231,235,var(--tw-text-opacity))}.prose img{margin:0}.prose>:first-child{margin-bottom:1.25em!important;margin-top:1.25em!important}.token.cdata,.token.comment,.token.doctype,.token.prolog{--tw-text-opacity:1;color:rgba(55,65,81,var(--tw-text-opacity))}.dark .token.cdata,.dark .token.comment,.dark .token.doctype,.dark .token.prolog{--tw-text-opacity:1;color:rgba(209,213,219,var(--tw-text-opacity))}.token.punctuation{--tw-text-opacity:1;color:rgba(55,65,81,var(--tw-text-opacity))}.dark .token.punctuation{--tw-text-opacity:1;color:rgba(209,213,219,var(--tw-text-opacity))}.token.boolean,.token.constant,.token.deleted,.token.number,.token.property,.token.symbol,.token.tag{--tw-text-opacity:1;color:rgba(16,185,129,var(--tw-text-opacity))}.token.attr-name,.token.builtin,.token.char,.token.inserted,.token.selector,.token.string{--tw-text-opacity:1;color:rgba(139,92,246,var(--tw-text-opacity))}.language-css .token.string,.style .token.string,.token.entity,.token.operator,.token.url{--tw-text-opacity:1;color:rgba(245,158,11,var(--tw-text-opacity))}.token.atrule,.token.attr-value,.token.keyword{--tw-text-opacity:1;color:rgba(59,130,246,var(--tw-text-opacity))}.token.class-name,.token.function{--tw-text-opacity:1;color:rgba(236,72,153,var(--tw-text-opacity))}.token.important,.token.regex,.token.variable{--tw-text-opacity:1;color:rgba(245,158,11,var(--tw-text-opacity))}code[class*=language-],pre[class*=language-]{--tw-text-opacity:1;color:rgba(31,41,55,var(--tw-text-opacity))}.dark code[class*=language-],.dark pre[class*=language-]{--tw-text-opacity:1;color:rgba(249,250,251,var(--tw-text-opacity))}pre::-webkit-scrollbar{display:none}pre{-ms-overflow-style:none;scrollbar-width:none}.rehype-code-title{--tw-border-opacity:1;--tw-bg-opacity:1;--tw-text-opacity:1;background-color:rgba(229,231,235,var(--tw-bg-opacity));border-color:rgba(229,231,235,var(--tw-border-opacity));border-top-left-radius:.25rem;border-top-right-radius:.25rem;border-width:1px 1px 0;color:rgba(31,41,55,var(--tw-text-opacity));font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:.875rem;font-weight:700;line-height:1.25rem;padding:.75rem 1.25rem}.dark .rehype-code-title{--tw-border-opacity:1;--tw-bg-opacity:1;--tw-text-opacity:1;background-color:rgba(31,41,55,var(--tw-bg-opacity));border-color:rgba(55,65,81,var(--tw-border-opacity));color:rgba(229,231,235,var(--tw-text-opacity))}.rehype-code-title+pre{border-top-left-radius:0;border-top-right-radius:0;margin-top:0}.highlight-line{--tw-border-opacity:1;--tw-bg-opacity:1;background-color:rgba(243,244,246,var(--tw-bg-opacity));border-color:rgba(59,130,246,var(--tw-border-opacity));border-left-width:4px;display:block;margin-left:-1rem;margin-right:-1rem;padding-left:1rem;padding-right:1rem}.dark .highlight-line{--tw-bg-opacity:1;background-color:rgba(31,41,55,var(--tw-bg-opacity))}input[type=email],input[type=text]{-webkit-appearance:none;-moz-appearance:none;appearance:none}.metric-card>a{text-decoration:none}.metric-card>p{margin-bottom:.5rem;margin-top:.5rem}.step>h3{margin-bottom:0;margin-top:0}.prose .tweet a{font-weight:inherit;text-decoration:inherit}table{display:table;overflow-y:scroll}.sticky-theme-mode-button{position:absolute;right:10px;top:10px}iframe{height:35rem;width:100%}.nav-active-route{--tw-border-opacity:1;border-bottom-width:2px;border-color:rgba(31,41,55,var(--tw-border-opacity));font-weight:600}.dark .nav-active-route{--tw-border-opacity:1;border-color:rgba(243,244,246,var(--tw-border-opacity))}.nav-active-route{transition:border .5s ease-in-out}.nav-inactive-route{--tw-border-opacity:1;--tw-border-opacity:0;border-bottom-width:2px;border-color:rgba(255,251,235,var(--tw-border-opacity))}.dark .nav-inactive-route{--tw-border-opacity:1;border-color:rgba(0,0,0,var(--tw-border-opacity))}.nav-link-divider{align-items:center;display:flex;height:1rem;justify-content:center;padding-left:.5rem;padding-right:.5rem;width:1rem}.bread-crumb-active{--tw-text-opacity:1;color:rgba(31,41,55,var(--tw-text-opacity))}.dark .bread-crumb-active{--tw-text-opacity:1;color:rgba(107,114,128,var(--tw-text-opacity))}.autocomplete-suggestion-header{--tw-bg-opacity:1;--tw-text-opacity:1;background-color:rgba(255,251,235,var(--tw-bg-opacity));color:rgba(37,99,235,var(--tw-text-opacity));display:inline-block;font-size:.75rem;font-weight:600;line-height:1rem;margin:0;padding-right:.5rem;position:relative;z-index:50;z-index:9999}.blog-post-layout-container{align-items:flex-start;display:flex;flex-direction:column;justify-content:center;margin-bottom:4rem;margin-left:auto;margin-right:auto;max-width:42rem;position:relative;width:100%;z-index:1}.blog-post-layout-container .blog-post-layout-background-container{height:100%;left:0;min-height:100%;min-width:100%;position:absolute;top:0;width:100%;z-index:-1}.blog-post-layout-container .blog-post-layout-background-container .blog-post-layout-background{--tw-border-opacity:1;align-items:flex-start;border-color:rgba(249,250,251,var(--tw-border-opacity));border-left-width:1px;display:flex;flex-direction:row;height:100%;justify-content:flex-start;min-height:100%;min-width:100%;z-index:0}.blog-post-layout-container\n	.blog-post-layout-background-container\n	.blog-post-layout-background\n	.blog-post-layout-background-line{--tw-border-opacity:1;border-color:rgba(249,250,251,var(--tw-border-opacity));border-right-width:1px;height:100%;min-height:100%;width:20%}.blog-post-image-container{-webkit-backface-visibility:hidden;backface-visibility:hidden;border-radius:.25rem;box-shadow:0 0 15px rgb(0 0 0/15%);margin:0;max-height:12rem;overflow:hidden;padding:0;text-decoration:none;transform:var(--tw-transform);transition-duration:.15s;transition-duration:.2s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);width:100%}@media (min-width:768px){.blog-post-image-container{max-height:24rem}}.blog-post-image{-webkit-backface-visibility:hidden;backface-visibility:hidden;border-radius:.25rem;transform:var(--tw-transform);transition-duration:.15s;transition-duration:.2s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.banner-image-container-tag-button{--tw-bg-opacity:1;--tw-text-opacity:1;--tw-shadow:0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.06);align-items:center;background-color:rgba(255,251,235,var(--tw-bg-opacity));border-radius:.25rem;border-width:0;box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow);color:rgba(31,41,55,var(--tw-text-opacity));cursor:pointer;display:flex;flex-direction:row;font-size:.75rem;font-weight:600;justify-content:center;line-height:1rem;margin-left:.375rem;opacity:1;padding:.375rem .625rem;text-decoration:none;transform:var(--tw-transform);transition-duration:.15s;transition-property:opacity;transition-timing-function:cubic-bezier(.4,0,.2,1);white-space:nowrap}.banner-image-container-tag-button:hover{--tw-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.banner-image-container-tag-button:first-child{margin-left:0}.banner-image-container-tag-button-indicator-blue:before{background-color:rgba(59,130,246,var(--tw-bg-opacity))}.banner-image-container-tag-button-indicator-blue:before,.banner-image-container-tag-button-indicator-red:before{--tw-bg-opacity:1;border-radius:9999px;content:"";display:inline-block;height:.75rem;margin-right:.5rem;transform:var(--tw-transform);transition-duration:.15s;transition-duration:.2s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);width:.75rem}.banner-image-container-tag-button-indicator-red:before{background-color:rgba(239,68,68,var(--tw-bg-opacity))}@-webkit-keyframes f{0%{opacity:0;transform:translateY(-1000px)}to{opacity:1;transform:translateY(0)}}@keyframes f{0%{opacity:0;transform:translateY(-1000px)}to{opacity:1;transform:translateY(0)}}@-webkit-keyframes g{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-1000px)}}@keyframes g{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-1000px)}}.alert-banner{-webkit-animation:f .5s cubic-bezier(.25,.46,.45,.94) both;animation:f .5s cubic-bezier(.25,.46,.45,.94) both}.alert-banner input:checked~*{-webkit-animation:g .5s cubic-bezier(.55,.085,.68,.53) both;animation:g .5s cubic-bezier(.55,.085,.68,.53) both}.hover\\:border-2:hover{border-width:2px}.hover\\:border-b-2:hover{border-bottom-width:2px}.hover\\:border-gray-800:hover{--tw-border-opacity:1;border-color:rgba(31,41,55,var(--tw-border-opacity))}.hover\\:border-gray-500:hover{--tw-border-opacity:1;border-color:rgba(107,114,128,var(--tw-border-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}.hover\\:text-blue-700:hover{--tw-text-opacity:1;color:rgba(29,78,216,var(--tw-text-opacity))}.hover\\:text-gray-900:hover{--tw-text-opacity:1;color:rgba(17,24,39,var(--tw-text-opacity))}.hover\\:text-gray-600:hover{--tw-text-opacity:1;color:rgba(75,85,99,var(--tw-text-opacity))}.hover\\:text-gray-800:hover{--tw-text-opacity:1;color:rgba(31,41,55,var(--tw-text-opacity))}.hover\\:shadow:hover{--tw-shadow:0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.06)}.hover\\:shadow-md:hover,.hover\\:shadow:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-md:hover{--tw-shadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)}.hover\\:transition-shadow:hover{transition-duration:.15s;transition-property:box-shadow;transition-timing-function:cubic-bezier(.4,0,.2,1)}.focus\\:border-blue-500:focus{--tw-border-opacity:1;border-color:rgba(59,130,246,var(--tw-border-opacity))}.focus\\:ring-blue-500:focus{--tw-ring-opacity:1;--tw-ring-color:rgba(59,130,246,var(--tw-ring-opacity))}.dark .dark\\:prose-dark{color:#d1d5db}.dark .dark\\:prose-dark a{color:#60a5fa}.dark .dark\\:prose-dark a:hover{color:#2563eb}.dark .dark\\:prose-dark a code{color:#60a5fa}.dark .dark\\:prose-dark blockquote{border-left-color:#374151;color:#d1d5db}.dark .dark\\:prose-dark h2,.dark .dark\\:prose-dark h3,.dark .dark\\:prose-dark h4{color:#f3f4f6;scroll-margin-top:8rem}.dark .dark\\:prose-dark hr{border-color:#374151}.dark .dark\\:prose-dark ol li:before{color:#6b7280}.dark .dark\\:prose-dark ul li:before{background-color:#6b7280}.dark .dark\\:prose-dark strong{color:#d1d5db}.dark .dark\\:prose-dark thead{color:#f3f4f6}.dark .dark\\:prose-dark tbody tr{border-bottom-color:#374151}.dark .dark\\:border-gray-900{--tw-border-opacity:1;border-color:rgba(17,24,39,var(--tw-border-opacity))}.dark .dark\\:border-gray-800{--tw-border-opacity:1;border-color:rgba(31,41,55,var(--tw-border-opacity))}.dark .dark\\:border-green-900{--tw-border-opacity:1;border-color:rgba(6,78,59,var(--tw-border-opacity))}.dark .dark\\:bg-black{--tw-bg-opacity:1;background-color:rgba(0,0,0,var(--tw-bg-opacity))}.dark .dark\\:bg-gray-800{--tw-bg-opacity:1;background-color:rgba(31,41,55,var(--tw-bg-opacity))}.dark .dark\\:bg-green-900{--tw-bg-opacity:1;background-color:rgba(6,78,59,var(--tw-bg-opacity))}.dark .dark\\:text-white{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}.dark .dark\\:text-gray-400{--tw-text-opacity:1;color:rgba(156,163,175,var(--tw-text-opacity))}.dark .dark\\:text-gray-100{--tw-text-opacity:1;color:rgba(243,244,246,var(--tw-text-opacity))}.dark .dark\\:text-gray-300{--tw-text-opacity:1;color:rgba(209,213,219,var(--tw-text-opacity))}.dark .dark\\:text-gray-50{--tw-text-opacity:1;color:rgba(249,250,251,var(--tw-text-opacity))}.dark .dark\\:text-gray-200{--tw-text-opacity:1;color:rgba(229,231,235,var(--tw-text-opacity))}.dark .dark\\:text-red-400{--tw-text-opacity:1;color:rgba(248,113,113,var(--tw-text-opacity))}.dark .dark\\:text-green-400{--tw-text-opacity:1;color:rgba(52,211,153,var(--tw-text-opacity))}.dark .dark\\:shadow-dark{--tw-shadow:0 1px 3px 0 hsla(0,2%,84%,0.1),0 1px 2px 0 hsla(0,2%,84%,0.06);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.dark .dark\\:hover\\:border-gray-100:hover{--tw-border-opacity:1;border-color:rgba(243,244,246,var(--tw-border-opacity))}.dark .dark\\:hover\\:border-gray-300:hover{--tw-border-opacity:1;border-color:rgba(209,213,219,var(--tw-border-opacity))}.dark .dark\\:hover\\:text-white:hover{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}.dark .dark\\:hover\\:text-gray-500:hover{--tw-text-opacity:1;color:rgba(107,114,128,var(--tw-text-opacity))}.dark .dark\\:hover\\:shadow-dark:hover{--tw-shadow:0 1px 3px 0 hsla(0,2%,84%,0.1),0 1px 2px 0 hsla(0,2%,84%,0.06)}.dark .dark\\:hover\\:shadow-dark-lg:hover,.dark .dark\\:hover\\:shadow-dark:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.dark .dark\\:hover\\:shadow-dark-lg:hover{--tw-shadow:0 10px 15px -3px hsla(0,2%,84%,0.1),0 4px 6px -2px hsla(0,2%,84%,0.05)}.dark .dark\\:hover\\:transition-shadow:hover{transition-duration:.15s;transition-property:box-shadow;transition-timing-function:cubic-bezier(.4,0,.2,1)}@media (min-width:640px){.sm\\:mt-0{margin-top:0}.sm\\:block{display:block}.sm\\:w-96{width:24rem}.sm\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.sm\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.sm\\:flex-row{flex-direction:row}.sm\\:space-x-2>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(.5rem*(1 - var(--tw-space-x-reverse)));margin-right:calc(.5rem*var(--tw-space-x-reverse))}.sm\\:p-3\\.5{padding:.875rem}.sm\\:p-3{padding:.75rem}}@media (min-width:768px){.md\\:container{width:100%}@media (min-width:640px){.md\\:container{max-width:640px}}@media (min-width:768px){.md\\:container{max-width:768px}}@media (min-width:1024px){.md\\:container{max-width:1024px}}@media (min-width:1280px){.md\\:container{max-width:1280px}}@media (min-width:1536px){.md\\:container{max-width:1536px}}.md\\:mx-auto{margin-left:auto;margin-right:auto}.md\\:mt-0{margin-top:0}.md\\:mb-0{margin-bottom:0}.md\\:h-14{height:3.5rem}.md\\:w-full{width:100%}.md\\:flex-row{flex-direction:row}.md\\:items-center{align-items:center}.md\\:text-right{text-align:right}.md\\:text-4xl{font-size:2.25rem;line-height:2.5rem}.md\\:text-2xl{font-size:1.5rem;line-height:2rem}.md\\:text-5xl{font-size:3rem;line-height:1}.md\\:text-xl{font-size:1.25rem;line-height:1.75rem}}';
const browser = false;
const dev = false;
const getStores = () => {
  const stores = getContext("__svelte__");
  return {
    page: {
      subscribe: stores.page.subscribe
    },
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    get preloading() {
      console.error("stores.preloading is deprecated; use stores.navigating instead");
      return {
        subscribe: stores.navigating.subscribe
      };
    },
    session: stores.session
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
const navigating = {
  subscribe(fn) {
    const store = getStores().navigating;
    return store.subscribe(fn);
  }
};
var NavigationProgressBar_svelte_svelte_type_style_lang = "#nprogress{pointer-events:none}#nprogress .bar{background-color:#8a8484;height:4px;left:0;position:fixed;top:0;width:100%;z-index:1}#nprogress .peg{box-shadow:0 0 10px #8a8484,0 0 5px #8a8484;display:block;height:100%;opacity:1;position:absolute;right:0;transform:rotate(3deg) translateY(-4px);width:100px}#nprogress .spinner{display:block;position:fixed;right:15px;top:15px;z-index:1}#nprogress .spinner-icon{-webkit-animation:svelte-1499vqq-h .4s linear infinite;animation:svelte-1499vqq-h .4s linear infinite;border-color:#8a8484 transparent transparent #8a8484;border-radius:50%;border-style:solid;border-width:2px;box-sizing:border-box;height:18px;width:18px}.nprogress-custom-parent{overflow:hidden;position:relative}.nprogress-custom-parent #nprogress .bar,.nprogress-custom-parent #nprogress .spinner{position:absolute}";
const css$3 = {
  code: "#nprogress{pointer-events:none}#nprogress .bar{background-color:#8a8484;height:4px;left:0;position:fixed;top:0;width:100%;z-index:1}#nprogress .peg{box-shadow:0 0 10px #8a8484,0 0 5px #8a8484;display:block;height:100%;opacity:1;position:absolute;right:0;transform:rotate(3deg) translateY(-4px);width:100px}#nprogress .spinner{display:block;position:fixed;right:15px;top:15px;z-index:1}#nprogress .spinner-icon{-webkit-animation:svelte-1499vqq-h .4s linear infinite;animation:svelte-1499vqq-h .4s linear infinite;border-color:#8a8484 transparent transparent #8a8484;border-radius:50%;border-style:solid;border-width:2px;box-sizing:border-box;height:18px;width:18px}.nprogress-custom-parent{overflow:hidden;position:relative}.nprogress-custom-parent #nprogress .spinner{position:absolute}.nprogress-custom-parent #nprogress .bar{position:absolute}@-webkit-keyframes svelte-1499vqq-h{{-webkit-transform:rotate(0deg)}{-webkit-transform:rotate(1turn)}}@keyframes svelte-1499vqq-h{{transform:rotate(0deg)}{transform:rotate(1turn)}}",
  map: `{"version":3,"file":"NavigationProgressBar.svelte","sources":["NavigationProgressBar.svelte"],"sourcesContent":["<style lang=\\"scss\\">:global(#nprogress){pointer-events:none}:global(#nprogress .bar){background-color:#8a8484;height:4px;left:0;position:fixed;top:0;width:100%;z-index:1}:global(#nprogress .peg){box-shadow:0 0 10px #8a8484,0 0 5px #8a8484;display:block;height:100%;opacity:1;position:absolute;right:0;transform:rotate(3deg) translateY(-4px);width:100px}:global(#nprogress .spinner){display:block;position:fixed;right:15px;top:15px;z-index:1}:global(#nprogress .spinner-icon){-webkit-animation:h .4s linear infinite;animation:h .4s linear infinite;border-color:#8a8484 transparent transparent #8a8484;border-radius:50%;border-style:solid;border-width:2px;box-sizing:border-box;height:18px;width:18px}:global(.nprogress-custom-parent){overflow:hidden;position:relative}:global(.nprogress-custom-parent #nprogress .spinner){position:absolute}:global(.nprogress-custom-parent #nprogress .bar){position:absolute}@-webkit-keyframes h{0%{-webkit-transform:rotate(0deg)}to{-webkit-transform:rotate(1turn)}}@keyframes h{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}</style>\\n\\n<script lang=\\"ts\\">import { navigating } from '$app/stores';\\nimport { browser } from '$app/env';\\nimport NProgress from 'nprogress';\\nNProgress.configure({\\n    showSpinner: false,\\n});\\n$: if (browser) {\\n    $navigating ? NProgress.start() : NProgress.done();\\n}\\n<\/script>\\n"],"names":[],"mappings":"AAA2B,UAAU,AAAC,CAAC,eAAe,IAAI,CAAC,AAAQ,eAAe,AAAC,CAAC,iBAAiB,OAAO,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,CAAC,SAAS,KAAK,CAAC,IAAI,CAAC,CAAC,MAAM,IAAI,CAAC,QAAQ,CAAC,CAAC,AAAQ,eAAe,AAAC,CAAC,WAAW,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,OAAO,CAAC,QAAQ,KAAK,CAAC,OAAO,IAAI,CAAC,QAAQ,CAAC,CAAC,SAAS,QAAQ,CAAC,MAAM,CAAC,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,WAAW,IAAI,CAAC,CAAC,MAAM,KAAK,CAAC,AAAQ,mBAAmB,AAAC,CAAC,QAAQ,KAAK,CAAC,SAAS,KAAK,CAAC,MAAM,IAAI,CAAC,IAAI,IAAI,CAAC,QAAQ,CAAC,CAAC,AAAQ,wBAAwB,AAAC,CAAC,kBAAkB,gBAAC,CAAC,GAAG,CAAC,MAAM,CAAC,QAAQ,CAAC,UAAU,gBAAC,CAAC,GAAG,CAAC,MAAM,CAAC,QAAQ,CAAC,aAAa,OAAO,CAAC,WAAW,CAAC,WAAW,CAAC,OAAO,CAAC,cAAc,GAAG,CAAC,aAAa,KAAK,CAAC,aAAa,GAAG,CAAC,WAAW,UAAU,CAAC,OAAO,IAAI,CAAC,MAAM,IAAI,CAAC,AAAQ,wBAAwB,AAAC,CAAC,SAAS,MAAM,CAAC,SAAS,QAAQ,CAAC,AAAQ,4CAA4C,AAAC,CAAC,SAAS,QAAQ,CAAC,AAAQ,wCAAwC,AAAC,CAAC,SAAS,QAAQ,CAAC,mBAAmB,gBAAC,CAAC,AAAE,CAAC,kBAAkB,OAAO,IAAI,CAAC,CAAC,AAAE,CAAC,kBAAkB,OAAO,KAAK,CAAC,CAAC,CAAC,WAAW,gBAAC,CAAC,AAAE,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,AAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC"}`
};
const NavigationProgressBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_navigating;
  $$unsubscribe_navigating = subscribe(navigating, (value) => value);
  NProgress.configure({ showSpinner: false });
  $$result.css.add(css$3);
  $$unsubscribe_navigating();
  return ``;
});
const Path = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { id = "" } = $$props;
  let { data = {} } = $$props;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<path${spread([{ key: "path-" + escape(id) }, escape_object(data)])}></path>`;
});
const Polygon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { id = "" } = $$props;
  let { data = {} } = $$props;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<polygon${spread([{ key: "polygon-" + escape(id) }, escape_object(data)])}></polygon>`;
});
const Raw = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cursor = 870711;
  function getId() {
    cursor += 1;
    return `fa-${cursor.toString(16)}`;
  }
  let raw;
  let { data } = $$props;
  function getRaw(data2) {
    if (!data2 || !data2.raw) {
      return null;
    }
    let rawData = data2.raw;
    const ids = {};
    rawData = rawData.replace(/\s(?:xml:)?id=["']?([^"')\s]+)/g, (match, id) => {
      const uniqueId = getId();
      ids[id] = uniqueId;
      return ` id="${uniqueId}"`;
    });
    rawData = rawData.replace(/#(?:([^'")\s]+)|xpointer\(id\((['"]?)([^')]+)\2\)\))/g, (match, rawId, _, pointerId) => {
      const id = rawId || pointerId;
      if (!id || !ids[id]) {
        return match;
      }
      return `#${ids[id]}`;
    });
    return rawData;
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  raw = getRaw(data);
  return `<g><!-- HTML_TAG_START -->${raw}<!-- HTML_TAG_END --></g>`;
});
var Svg_svelte_svelte_type_style_lang = ".fa-icon.svelte-ttb3an{fill:currentColor;display:inline-block}.fa-flip-horizontal.svelte-ttb3an{transform:scaleX(-1)}.fa-flip-vertical.svelte-ttb3an{transform:scaleY(-1)}.fa-spin.svelte-ttb3an{-webkit-animation:d 1s linear 0s infinite;animation:d 1s linear 0s infinite}.fa-inverse.svelte-ttb3an{color:#fff}.fa-pulse.svelte-ttb3an{-webkit-animation:d 1s steps(8) infinite;animation:d 1s steps(8) infinite}@-webkit-keyframes d{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes d{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}";
const css$2 = {
  code: ".fa-icon.svelte-ttb3an{fill:currentColor;display:inline-block}.fa-flip-horizontal.svelte-ttb3an{transform:scaleX(-1)}.fa-flip-vertical.svelte-ttb3an{transform:scaleY(-1)}.fa-spin.svelte-ttb3an{-webkit-animation:svelte-ttb3an-c 1s linear 0s infinite;animation:svelte-ttb3an-c 1s linear 0s infinite}.fa-inverse.svelte-ttb3an{color:#fff}.fa-pulse.svelte-ttb3an{-webkit-animation:svelte-ttb3an-c 1s steps(8) infinite;animation:svelte-ttb3an-c 1s steps(8) infinite}@-webkit-keyframes svelte-ttb3an-c{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes svelte-ttb3an-c{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}",
  map: `{"version":3,"file":"Svg.svelte","sources":["Svg.svelte"],"sourcesContent":["<svg version=\\"1.1\\" class=\\"fa-icon {className}\\"\\n  class:fa-spin={spin} class:fa-pulse={pulse} class:fa-inverse={inverse}\\n  class:fa-flip-horizontal=\\"{flip === 'horizontal'}\\" class:fa-flip-vertical=\\"{flip === 'vertical'}\\"\\n  {x} {y} {width} {height}\\n  aria-label={label}\\n  role=\\"{ label ? 'img' : 'presentation' }\\"\\n  viewBox={box} {style}\\n  >\\n  <slot></slot>\\n</svg>\\n\\n<style>.fa-icon{fill:currentColor;display:inline-block}.fa-flip-horizontal{transform:scaleX(-1)}.fa-flip-vertical{transform:scaleY(-1)}.fa-spin{-webkit-animation:c 1s linear 0s infinite;animation:c 1s linear 0s infinite}.fa-inverse{color:#fff}.fa-pulse{-webkit-animation:c 1s steps(8) infinite;animation:c 1s steps(8) infinite}@-webkit-keyframes c{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes c{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}</style>\\n\\n<script>\\n  let className;\\n\\n  export { className as class };\\n\\n  export let width;\\n  export let height;\\n  export let box;\\n\\n  export let spin = false;\\n  export let inverse = false;\\n  export let pulse = false;\\n  export let flip = null;\\n\\n  // optionals\\n  export let x = undefined;\\n  export let y = undefined;\\n  export let style = undefined;\\n  export let label = undefined;\\n<\/script>\\n"],"names":[],"mappings":"AAWO,sBAAQ,CAAC,KAAK,YAAY,CAAC,QAAQ,YAAY,CAAC,iCAAmB,CAAC,UAAU,OAAO,EAAE,CAAC,CAAC,+BAAiB,CAAC,UAAU,OAAO,EAAE,CAAC,CAAC,sBAAQ,CAAC,kBAAkB,eAAC,CAAC,EAAE,CAAC,MAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,UAAU,eAAC,CAAC,EAAE,CAAC,MAAM,CAAC,EAAE,CAAC,QAAQ,CAAC,yBAAW,CAAC,MAAM,IAAI,CAAC,uBAAS,CAAC,kBAAkB,eAAC,CAAC,EAAE,CAAC,MAAM,CAAC,CAAC,CAAC,QAAQ,CAAC,UAAU,eAAC,CAAC,EAAE,CAAC,MAAM,CAAC,CAAC,CAAC,QAAQ,CAAC,mBAAmB,eAAC,CAAC,EAAE,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC,WAAW,eAAC,CAAC,EAAE,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,EAAE,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,CAAC"}`
};
const Svg = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className } = $$props;
  let { width } = $$props;
  let { height } = $$props;
  let { box } = $$props;
  let { spin = false } = $$props;
  let { inverse = false } = $$props;
  let { pulse = false } = $$props;
  let { flip = null } = $$props;
  let { x = void 0 } = $$props;
  let { y = void 0 } = $$props;
  let { style = void 0 } = $$props;
  let { label = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.box === void 0 && $$bindings.box && box !== void 0)
    $$bindings.box(box);
  if ($$props.spin === void 0 && $$bindings.spin && spin !== void 0)
    $$bindings.spin(spin);
  if ($$props.inverse === void 0 && $$bindings.inverse && inverse !== void 0)
    $$bindings.inverse(inverse);
  if ($$props.pulse === void 0 && $$bindings.pulse && pulse !== void 0)
    $$bindings.pulse(pulse);
  if ($$props.flip === void 0 && $$bindings.flip && flip !== void 0)
    $$bindings.flip(flip);
  if ($$props.x === void 0 && $$bindings.x && x !== void 0)
    $$bindings.x(x);
  if ($$props.y === void 0 && $$bindings.y && y !== void 0)
    $$bindings.y(y);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  $$result.css.add(css$2);
  return `<svg version="${"1.1"}" class="${[
    "fa-icon " + escape(className) + " svelte-ttb3an",
    (spin ? "fa-spin" : "") + " " + (pulse ? "fa-pulse" : "") + " " + (inverse ? "fa-inverse" : "") + " " + (flip === "horizontal" ? "fa-flip-horizontal" : "") + " " + (flip === "vertical" ? "fa-flip-vertical" : "")
  ].join(" ").trim()}"${add_attribute("x", x, 0)}${add_attribute("y", y, 0)}${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("aria-label", label, 0)}${add_attribute("role", label ? "img" : "presentation", 0)}${add_attribute("viewBox", box, 0)}${add_attribute("style", style, 0)}>${slots.default ? slots.default({}) : ``}</svg>`;
});
let outerScale = 1;
function normaliseData(data) {
  if ("iconName" in data && "icon" in data) {
    let normalisedData = {};
    let faIcon = data.icon;
    let name = data.iconName;
    let width = faIcon[0];
    let height = faIcon[1];
    let paths = faIcon[4];
    let iconData = { width, height, paths: [{ d: paths }] };
    normalisedData[name] = iconData;
    return normalisedData;
  }
  return data;
}
const Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = "" } = $$props;
  let { data } = $$props;
  let { scale = 1 } = $$props;
  let { spin = false } = $$props;
  let { inverse = false } = $$props;
  let { pulse = false } = $$props;
  let { flip = null } = $$props;
  let { label = null } = $$props;
  let { self = null } = $$props;
  let { style = null } = $$props;
  let width;
  let height;
  let combinedStyle;
  let box;
  function init2() {
    if (typeof data === "undefined") {
      return;
    }
    const normalisedData = normaliseData(data);
    const [name] = Object.keys(normalisedData);
    const icon = normalisedData[name];
    if (!icon.paths) {
      icon.paths = [];
    }
    if (icon.d) {
      icon.paths.push({ d: icon.d });
    }
    if (!icon.polygons) {
      icon.polygons = [];
    }
    if (icon.points) {
      icon.polygons.push({ points: icon.points });
    }
    self = icon;
  }
  function normalisedScale() {
    let numScale = 1;
    if (typeof scale !== "undefined") {
      numScale = Number(scale);
    }
    if (isNaN(numScale) || numScale <= 0) {
      console.warn('Invalid prop: prop "scale" should be a number over 0.');
      return outerScale;
    }
    return numScale * outerScale;
  }
  function calculateBox() {
    if (self) {
      return `0 0 ${self.width} ${self.height}`;
    }
    return `0 0 ${width} ${height}`;
  }
  function calculateRatio() {
    if (!self) {
      return 1;
    }
    return Math.max(self.width, self.height) / 16;
  }
  function calculateWidth() {
    if (self) {
      return self.width / calculateRatio() * normalisedScale();
    }
    return 0;
  }
  function calculateHeight() {
    if (self) {
      return self.height / calculateRatio() * normalisedScale();
    }
    return 0;
  }
  function calculateStyle() {
    let combined = "";
    if (style !== null) {
      combined += style;
    }
    let size = normalisedScale();
    if (size === 1) {
      if (combined.length === 0) {
        return void 0;
      }
      return combined;
    }
    if (combined !== "" && !combined.endsWith(";")) {
      combined += "; ";
    }
    return `${combined}font-size: ${size}em`;
  }
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.scale === void 0 && $$bindings.scale && scale !== void 0)
    $$bindings.scale(scale);
  if ($$props.spin === void 0 && $$bindings.spin && spin !== void 0)
    $$bindings.spin(spin);
  if ($$props.inverse === void 0 && $$bindings.inverse && inverse !== void 0)
    $$bindings.inverse(inverse);
  if ($$props.pulse === void 0 && $$bindings.pulse && pulse !== void 0)
    $$bindings.pulse(pulse);
  if ($$props.flip === void 0 && $$bindings.flip && flip !== void 0)
    $$bindings.flip(flip);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.self === void 0 && $$bindings.self && self !== void 0)
    $$bindings.self(self);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        init2();
        width = calculateWidth();
        height = calculateHeight();
        combinedStyle = calculateStyle();
        box = calculateBox();
      }
    }
    $$rendered = `${validate_component(Svg, "Svg").$$render($$result, {
      label,
      width,
      height,
      box,
      style: combinedStyle,
      spin,
      flip,
      inverse,
      pulse,
      class: className
    }, {}, {
      default: () => `${slots.default ? slots.default({}) : `
    ${self ? `${self.paths ? `${each(self.paths, (path, i) => `${validate_component(Path, "Path").$$render($$result, { id: i, data: path }, {}, {})}`)}` : ``}
      ${self.polygons ? `${each(self.polygons, (polygon, i) => `${validate_component(Polygon, "Polygon").$$render($$result, { id: i, data: polygon }, {}, {})}`)}` : ``}
      ${self.raw ? `${validate_component(Raw, "Raw").$$render($$result, { data: self }, {
        data: ($$value) => {
          self = $$value;
          $$settled = false;
        }
      }, {})}` : ``}` : ``}
  `}`
    })}`;
  } while (!$$settled);
  return $$rendered;
});
const NavigationBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { navLinks } = $$props;
  let { logoImage } = $$props;
  let { title = "" } = $$props;
  let { useTitleAndLogo = false } = $$props;
  let { useThemeModeButton = true } = $$props;
  createEventDispatcher();
  if ($$props.navLinks === void 0 && $$bindings.navLinks && navLinks !== void 0)
    $$bindings.navLinks(navLinks);
  if ($$props.logoImage === void 0 && $$bindings.logoImage && logoImage !== void 0)
    $$bindings.logoImage(logoImage);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.useTitleAndLogo === void 0 && $$bindings.useTitleAndLogo && useTitleAndLogo !== void 0)
    $$bindings.useTitleAndLogo(useTitleAndLogo);
  if ($$props.useThemeModeButton === void 0 && $$bindings.useThemeModeButton && useThemeModeButton !== void 0)
    $$bindings.useThemeModeButton(useThemeModeButton);
  $$unsubscribe_page();
  return `<header class="${"relative flex text-gray-900 bg-yellow-50 dark:bg-black bg-opacity-60 dark:text-gray-100 w-full"}"><nav class="${"flex flex-wrap items-center justify-between w-full max-w-4xl p-6 mx-auto"}">${useTitleAndLogo ? `<div class="${"w-auto p-1 text-gray-900 dark:text-gray-100 font-bold"}" style="${"position: fixed; left: 5%; top: 10%; transform: translate(-50%, -50%);"}"><a sveltekit:prefetch href="${"/"}" class="${"flex flex-row h-12 justify-center items-center drop-shadow-xl"}"${add_attribute("aria-label", title, 0)}><img class="${"h-10 md:h-14 w-auto"}" alt="${"LL"}" loading="${"eager"}" decoding="${"async"}" width="${"3.5rem"}" height="${"3.5rem"}"${add_attribute("src", logoImage, 0)}></a></div>` : ``}
		<div class="${"flex flex-row items-center"}" style="${"position: fixed; right: 0 !important; display: flex; flex-direction: column; margin-top: 45%; text-align: right;font-size:6em;"}">${each(navLinks, (navLink, index2) => `<a sveltekit:prefetch${add_attribute("href", navLink.path, 0)} class="${[
    "p-1.5 text-gray-900 sm:p-3.5 dark:text-gray-100 hover:border-b-2 hover:border-gray-800 dark:hover:border-gray-100",
    ($page.path === navLink.path || $page.path === `${navLink.path}/` ? "nav-active-route" : "") + " " + ($page.path !== navLink.path && $page.path !== `${navLink.path}/` ? "nav-inactive-route" : "")
  ].join(" ").trim()}">${escape(navLink.label)}
				</a>`)}
			
			<div class="${"flex justify-center items-center flex-wrap space-x-2"}" id="${"menu"}">
  <svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 640 512"}" class="${"w-7 h-7"}" style="${"color: #7289da;"}"><path fill="${"currentColor"}" d="${"M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"}"></path></svg>

  
  <svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 496 512"}" class="${"w-7 h-7"}" style="${"color: #333;"}"><path fill="${"currentColor"}" d="${"M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"}"></path></svg>
  <svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 448 512"}" class="${"w-7 h-7"}" style="${"color: #c13584;"}"><path fill="${"currentColor"}" d="${"M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"}"></path></svg>
  <svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 576 512"}" class="${"w-7 h-7"}" style="${"color: #ff0000;"}"><path fill="${"currentColor"}" d="${"M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"}"></path></svg></div></div></nav>
	${useThemeModeButton ? `<button aria-label="${"Toggle Dark Mode"}" type="${"button"}"${add_attribute("class", useTitleAndLogo ? "sticky-theme-mode-button w-8 h-8 bg-yellow-50 rounded-full dark:bg-gray-800 filter shadow hover:shadow-md dark:shadow-dark dark:hover:shadow-dark-lg hover:border-2 hover:border-gray-500 dark:hover:border-gray-300 z-10" : "w-8 h-8 bg-yellow-50 rounded-full dark:bg-gray-800 filter shadow hover:shadow-md dark:shadow-dark dark:hover:shadow-dark-lg hover:border-2 hover:border-gray-500 dark:hover:border-gray-300 z-10", 0)}>${`${validate_component(Icon, "Icon").$$render($$result, {
    data: faMoon,
    class: "h-3 w-3 text-xs text-gray-700 dark:text-gray-100",
    scale: 1.5
  }, {}, {})}`}</button>` : ``}</header>`;
});
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { logoImage } = $$props;
  let { title = "LOOSE LIPS" } = $$props;
  let { useTitleAndLogo } = $$props;
  let { useThemeModeButton } = $$props;
  let { navLinks } = $$props;
  if ($$props.logoImage === void 0 && $$bindings.logoImage && logoImage !== void 0)
    $$bindings.logoImage(logoImage);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.useTitleAndLogo === void 0 && $$bindings.useTitleAndLogo && useTitleAndLogo !== void 0)
    $$bindings.useTitleAndLogo(useTitleAndLogo);
  if ($$props.useThemeModeButton === void 0 && $$bindings.useThemeModeButton && useThemeModeButton !== void 0)
    $$bindings.useThemeModeButton(useThemeModeButton);
  if ($$props.navLinks === void 0 && $$bindings.navLinks && navLinks !== void 0)
    $$bindings.navLinks(navLinks);
  return `
${validate_component(NavigationProgressBar, "NavigationProgressBar").$$render($$result, {}, {}, {})}



${validate_component(NavigationBar, "NavigationBar").$$render($$result, {
    navLinks,
    logoImage,
    title,
    useThemeModeButton,
    useTitleAndLogo
  }, {}, {})}
`;
});
const ExternalLink = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { href = "" } = $$props;
  let { ariaLabel = "" } = $$props;
  let { cssClasses = "" } = $$props;
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.ariaLabel === void 0 && $$bindings.ariaLabel && ariaLabel !== void 0)
    $$bindings.ariaLabel(ariaLabel);
  if ($$props.cssClasses === void 0 && $$bindings.cssClasses && cssClasses !== void 0)
    $$bindings.cssClasses(cssClasses);
  return `${href ? `${ariaLabel ? `<a${add_attribute("href", href, 0)}${add_attribute("class", cssClasses ? cssClasses : "text-gray-500 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-500 transition", 0)} target="${"_blank"}" rel="${"noopener noreferrer"}"${add_attribute("aria-label", ariaLabel, 0)}>${slots.default ? slots.default({}) : ``}</a>` : `<a${add_attribute("href", href, 0)}${add_attribute("class", cssClasses ? cssClasses : "text-gray-500 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-500 transition", 0)} target="${"_blank"}" rel="${"noopener noreferrer"}">${slots.default ? slots.default({}) : ``}</a>`}` : ``}`;
});
const linkClass = "text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-500 transition";
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<footer class="${"flex flex-col justify-center items-start max-w-2xl mx-auto w-full mb-8"}"><hr class="${"w-full border-1 border-gray-200 dark:border-gray-800 mb-8"}">
	${slots.default ? slots.default({}) : ``}
	<div class="${"w-full max-w-2xl grid grid-cols-1 gap-4 pb-16 sm:grid-cols-3"}"><div class="${"flex flex-col space-y-4"}"><a sveltekit:prefetch href="${"/"}"${add_attribute("class", linkClass, 0)}${add_attribute("aria-label", "Footer home link", 0)}>Loose Lips</a>
			<a sveltekit:prefetch href="${"/about"}"${add_attribute("class", linkClass, 0)}${add_attribute("aria-label", "Footer about link", 0)}>About </a>
			<a sveltekit:prefetch href="${"/blog"}"${add_attribute("class", linkClass, 0)}${add_attribute("aria-label", "Footer about link", 0)}>Blog </a>
			<a sveltekit:prefetch href="${"/projects"}"${add_attribute("class", linkClass, 0)}${add_attribute("aria-label", "Footer about link", 0)}>Crew </a>
			<a sveltekit:prefetch href="${"/about"}"${add_attribute("class", linkClass, 0)}${add_attribute("aria-label", "Footer about link", 0)}>Events </a></div>
		<div class="${"flex flex-col space-y-4"}">${validate_component(ExternalLink, "ExternalLink").$$render($$result, {
    href: "https://www.linkedin.com/in/looselipsevents/",
    cssClasses: linkClass,
    ariaLabel: "Footer LinkedIn link"
  }, {}, { default: () => `Soundcloud` })}
			${validate_component(ExternalLink, "ExternalLink").$$render($$result, {
    href: "https://github.com/navneetsharmaui",
    cssClasses: linkClass,
    ariaLabel: "Footer GitHub link"
  }, {}, { default: () => `Mixcloud` })}
			${validate_component(ExternalLink, "ExternalLink").$$render($$result, {
    href: "https://twitter.com/looselipsevents",
    cssClasses: linkClass,
    ariaLabel: "Footer Twitter link"
  }, {}, { default: () => `Bandcamp` })}
			${validate_component(ExternalLink, "ExternalLink").$$render($$result, {
    href: "https://www.instagram.com/looselipsevents/",
    cssClasses: linkClass,
    ariaLabel: "Footer Instagram link"
  }, {}, { default: () => `Github` })}</div>
		<div class="${"flex flex-col space-y-4"}"><a sveltekit:prefetch href="${"/snippets"}"${add_attribute("class", linkClass, 0)}${add_attribute("aria-label", "Footer Snippets link", 0)}>Sitemap</a>
			<a sveltekit:prefetch href="${"/tags"}"${add_attribute("class", linkClass, 0)}${add_attribute("aria-label", "Footer tags link", 0)}>Tags</a>
			<a sveltekit:prefetch href="${"/dashboard"}"${add_attribute("class", linkClass, 0)}${add_attribute("aria-label", "Footer dashobard link", 0)}>Contact</a></div></div>
	<p style="${"color: white;text-align:center;font-size:small;font-weight:italic"}">copyright \xA9  2023 All rights reserved Loose-Lips ltd</p></footer>`;
});
const RouteTransition = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { referesh = "" } = $$props;
  if ($$props.referesh === void 0 && $$bindings.referesh && referesh !== void 0)
    $$bindings.referesh(referesh);
  return `<span>${slots.default ? slots.default({}) : ``}</span>`;
});
var NowPlaying_svelte_svelte_type_style_lang = ".playing.svelte-scrvw2{min-height:17px;min-width:17px}.crest.svelte-scrvw2{background:#65696d;border-radius:2px;height:20px;margin-right:3px;width:3px}.crest.svelte-scrvw2:hover{background:#19af55}.crest.svelte-scrvw2:first-child{-webkit-animation:b .7s ease infinite;animation:b .7s ease infinite}.crest.svelte-scrvw2:nth-child(2){-webkit-animation:b 1.4s ease infinite;animation:b 1.4s ease infinite}.crest.svelte-scrvw2:nth-child(3){-webkit-animation:b .35s ease infinite;animation:b .35s ease infinite}.crest.svelte-scrvw2:nth-child(4){-webkit-animation:b .55s ease infinite;animation:b .55s ease infinite}.crest.svelte-scrvw2:nth-child(5){-webkit-animation:b .45s ease infinite;animation:b .45s ease infinite;-webkit-animation:b .85s ease infinite;animation:b .85s ease infinite}.crest.svelte-scrvw2:nth-child(6){-webkit-animation:b .65s ease infinite;animation:b .65s ease infinite}@-webkit-keyframes b{0%{height:3px}25%{height:10px}50%{height:15px}75%{height:17px}to{height:3px}}@keyframes b{0%{height:3px}25%{height:10px}50%{height:15px}75%{height:17px}to{height:3px}}";
var __awaiter$7 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve2) {
      resolve2(value);
    });
  }
  return new (P || (P = Promise))(function(resolve2, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function load$8({ page: page2 }) {
  return __awaiter$7(this, void 0, void 0, function* () {
    return { props: { path: page2.path } };
  });
}
const _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { path = "" } = $$props;
  const navLinks = [
    { path: "/", label: "LL" },
    { path: "/blog", label: "BLOG" },
    { path: "/crew", label: "CREW" },
    { path: "/events", label: "EVENTS" },
    { path: "/projects", label: "MIXES" }
  ];
  if ($$props.path === void 0 && $$bindings.path && path !== void 0)
    $$bindings.path(path);
  return `<div class="${"dark:bg-black bg-yellow-50"}">
	${validate_component(Header, "Header").$$render($$result, {
    navLinks,
    logoImage: "https://i1.sndcdn.com/avatars-C6z0Vyr2LPCI6uHm-ZLN5qA-t200x200.jpg",
    title: "LOOSE LIPS",
    useThemeModeButton: true,
    useTitleAndLogo: true
  }, {}, {})}
	
	<main id="${"skip"}" class="${"flex flex-col justify-center px-8 bg-yellow-50 dark:bg-black pt-4"}">
		${validate_component(RouteTransition, "RouteTransition").$$render($$result, { referesh: path }, {}, {
    default: () => `${slots.default ? slots.default({}) : ``}`
  })}
		
		
		${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}
		</main></div>`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout,
  load: load$8
});
const SEO = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { metaData = {} } = $$props;
  const BASE_URL = "https://sveltekit-starter-blog.netlify.app";
  metaData = Object.assign(Object.assign({}, metaData), {
    robots: "index,follow",
    openGraph: Object.assign(Object.assign({}, metaData.openGraph), {
      url: `${BASE_URL}${metaData.url}/`,
      title: metaData.title,
      description: metaData.description,
      locale: "en_US"
    }),
    twitter: Object.assign(Object.assign({}, metaData.twitter), {
      title: metaData.title,
      description: metaData.description
    })
  });
  const jsonLd = (content) => `<${"script"} type="application/ld+json">${JSON.stringify(content)}</${"script"}>`;
  if ($$props.metaData === void 0 && $$bindings.metaData && metaData !== void 0)
    $$bindings.metaData(metaData);
  {
    {
      if (!!metaData.image && typeof metaData.image === "string") {
        metaData.openGraph = Object.assign(Object.assign({}, metaData.openGraph), { image: `${BASE_URL}${metaData.image}` });
        metaData.twitter = Object.assign(Object.assign({}, metaData.twitter), { image: `${BASE_URL}${metaData.image}` });
      }
      if (typeof metaData.image === "object") {
        metaData.openGraph = Object.assign(Object.assign({}, metaData.openGraph), {
          image: `${BASE_URL}${metaData.image}`,
          "image:width": metaData.image.width,
          "image:height": metaData.image.height,
          "image:alt": metaData.image.alt || metaData.title
        });
        metaData.twitter = Object.assign(Object.assign({}, metaData.twitter), {
          image: `${BASE_URL}${metaData.image}`,
          "image:alt": metaData.image.alt || metaData.title
        });
      }
    }
  }
  return `${$$result.head += `<meta name="${"robots"}"${add_attribute("content", metaData.robots, 0)} data-svelte="svelte-1dteyl7"><meta name="${"googlebot"}"${add_attribute("content", metaData.robots, 0)} data-svelte="svelte-1dteyl7">${`<link rel="${"alternate"}" type="${"application/rss+xml"}" title="${"Sveltekit Blog - RSS Feed"}" href="${"/rss.xml"}" data-svelte="svelte-1dteyl7">`}${`<link rel="${"sitemap"}" type="${"application/xml"}" title="${"Sveltekit Blog - Sitemap"}" href="${"/sitemap.xml"}" data-svelte="svelte-1dteyl7">`}${metaData && metaData.title ? `${$$result.title = `<title>${escape(metaData.title)}</title>`, ""}
		<meta name="${"title"}"${add_attribute("content", metaData.title, 0)} data-svelte="svelte-1dteyl7">` : ``}${metaData && metaData.description ? `<meta name="${"description"}"${add_attribute("content", metaData.description, 0)} data-svelte="svelte-1dteyl7">` : ``}${metaData && metaData.keywords ? `<meta name="${"keywords"}"${add_attribute("content", metaData.keywords.join(", "), 0)} data-svelte="svelte-1dteyl7">` : ``}${metaData && metaData.url && BASE_URL ? `<link rel="${"canonical"}"${add_attribute("href", `${BASE_URL}${metaData.url}/`, 0)} data-svelte="svelte-1dteyl7">` : ``}${metaData && metaData.twitter ? `<meta name="${"twitter:card"}" content="${"summary_large_image"}" data-svelte="svelte-1dteyl7">

		${each(Object.keys(metaData.twitter), (tag) => `<meta name="${"twitter:" + escape(tag)}"${add_attribute("content", metaData.twitter[tag], 0)} data-svelte="svelte-1dteyl7">`)}` : ``}${metaData && metaData.openGraph ? `${each(Object.keys(metaData.openGraph), (tag) => `<meta name="${"og:" + escape(tag)}"${add_attribute("content", metaData.openGraph[tag], 0)} data-svelte="svelte-1dteyl7">`)}` : ``}${metaData && metaData.article ? `${each(Object.keys(metaData.article), (tag) => `<meta name="${"article:" + escape(tag)}"${add_attribute("content", metaData.article[tag], 0)} data-svelte="svelte-1dteyl7">`)}` : ``}${metaData && metaData.url ? `<!-- HTML_TAG_START -->${jsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    url: metaData.url,
    logo: `${BASE_URL}/favicon.ico`
  })}<!-- HTML_TAG_END -->` : ``}${metaData && metaData.url && metaData.searchUrl ? `<!-- HTML_TAG_START -->${jsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: metaData.url,
    potentialAction: {
      "@type": "SearchAction",
      target: metaData.searchUrl,
      "query-input": "required name=search_term_string"
    }
  })}<!-- HTML_TAG_END -->` : ``}`, ""}`;
});
const description = "Sveltekit starter project created with sveltekit, typescript, tailwindcss, postcss, husky, and storybook. The project has the structure set up for the scaleable project. (sveltekit, typescript, tailwindcss, postcss, husky, Storybook).";
const HeadTags = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { metaData = {} } = $$props;
  metaData = Object.assign({
    title: metaData.title ? metaData.title : "Sveltekit Starter",
    description: metaData.description ? metaData.description : description
  }, metaData);
  if ($$props.metaData === void 0 && $$bindings.metaData && metaData !== void 0)
    $$bindings.metaData(metaData);
  return `${validate_component(SEO, "SEO").$$render($$result, { metaData }, {}, {})}`;
});
var __error_svelte_svelte_type_style_lang = "h1.svelte-x715fd{font-size:2.8em;font-weight:700;margin:0 0 .5em}@media(min-width:480px){h1.svelte-x715fd{font-size:4em}}";
const css$1 = {
  code: "h1.svelte-x715fd{font-size:2.8em;font-weight:700;margin:0 0 .5em}@media(min-width:480px){h1.svelte-x715fd{font-size:4em}}",
  map: '{"version":3,"file":"__error.svelte","sources":["__error.svelte"],"sourcesContent":["<style lang=\\"scss\\" type=\\"text/scss\\">h1{font-size:2.8em;font-weight:700;margin:0 0 .5em}@media (min-width:480px){h1{font-size:4em}}</style>\\n\\n<script lang=\\"ts\\" context=\\"module\\">export function load({ error, status }) {\\n    return {\\n        props: {\\n            title: `${status}: ${error.message}`,\\n            status,\\n            error,\\n        },\\n    };\\n}\\n<\/script>\\n\\n<script lang=\\"ts\\">import { dev } from \'$app/env\';\\nimport HeadTags from \'$components/head-tags/HeadTags.svelte\';\\n;\\n// End: Local Imports\\n// Start: Exported Properties\\n/**\\n * @type {string}\\n */\\nexport let status;\\n/**\\n * @type {string}\\n */\\nexport let error;\\n// End: Exported Properties\\n/**\\n * @type {IMetaTagProperties}\\n */\\nconst metaData = {\\n    title: `${status} | Sveltekit`,\\n    description: \'404 page of Sveltekit starter project\',\\n};\\n<\/script>\\n\\n<!-- Start: Header Tage -->\\n<HeadTags metaData=\\"{metaData}\\" />\\n<!-- End: Header Tage -->\\n\\n<!-- Start: Error View Layout -->\\n<div class=\\"md:container md:mx-auto\\">\\n\\t<div class=\\"flex flex-col justify-center items-center\\">\\n\\t\\t<!-- Start: Error Status Code -->\\n\\t\\t<h1>\\n\\t\\t\\t{status}\\n\\t\\t</h1>\\n\\t\\t<!-- End: Error Status Code -->\\n\\t\\t<p>\\n\\t\\t\\t{error.name}\\n\\t\\t</p>\\n\\t\\t<!-- Start: Error Message container -->\\n\\t\\t{#if dev && error.stack}\\n\\t\\t\\t<pre> {error.message} </pre>\\n\\t\\t{/if}\\n\\t\\t<!-- End: Error Message container -->\\n\\t</div>\\n</div>\\n<!-- End: Error View Layout -->\\n"],"names":[],"mappings":"AAAoC,gBAAE,CAAC,UAAU,KAAK,CAAC,YAAY,GAAG,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,gBAAE,CAAC,UAAU,GAAG,CAAC,CAAC"}'
};
function load$7({ error: error2, status }) {
  return {
    props: {
      title: `${status}: ${error2.message}`,
      status,
      error: error2
    }
  };
}
const _error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error2 } = $$props;
  const metaData = {
    title: `${status} | Sveltekit`,
    description: "404 page of Sveltekit starter project"
  };
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
    $$bindings.error(error2);
  $$result.css.add(css$1);
  return `
${validate_component(HeadTags, "HeadTags").$$render($$result, { metaData }, {}, {})}



<div class="${"md:container md:mx-auto"}"><div class="${"flex flex-col justify-center items-center"}">
		<h1 class="${"svelte-x715fd"}">${escape(status)}</h1>
		
		<p>${escape(error2.name)}</p>
		
		${``}
		</div></div>
`;
});
var __error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _error,
  load: load$7
});
const convertToSlug = (value) => value.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");
const Tag = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { tag } = $$props;
  if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0)
    $$bindings.tag(tag);
  return `<a sveltekit:prefetch${add_attribute("href", `/tags/${convertToSlug(tag)}`, 0)}${add_attribute("aria-label", tag, 0)} class="${"text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-500"}">${escape(tag.toUpperCase())}</a>`;
});
const TagsContainer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { tags } = $$props;
  if ($$props.tags === void 0 && $$bindings.tags && tags !== void 0)
    $$bindings.tags(tags);
  return `${tags.length > 0 ? `<div class="${"flex flex-row flex-wrap w-full mt-4 items-center"}">${each(tags, (tag, index2) => `${validate_component(Tag, "Tag").$$render($$result, { tag }, {}, {})}
			${index2 !== tags.length - 1 ? `<p class="${"mr-2 ml-2 text-gray-500 dark:text-gray-50"}">${escape(` \u2022 `)}
				</p>` : ``}`)}</div>` : ``}`;
});
const BlogPost = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { blog } = $$props;
  if ($$props.blog === void 0 && $$bindings.blog && blog !== void 0)
    $$bindings.blog(blog);
  return `${blog && (blog == null ? void 0 : blog.slug) ? `<div class="${"mb-8 w-full border-b border-gray-100 dark:border-gray-800 pb-5"}"><div class="${"flex flex-col md:flex-row justify-between"}"><img${add_attribute("src", blog.banner, 0)} alt="${""}" style="${"height: 12em;width:18emwidth:100%;"}">
			
			</div>
		<a sveltekit:prefetch${add_attribute("href", `/blog/${blog.slug}`, 0)} class="${"w-full"}"><h3 class="${"text-lg md:text-xl font-medium mb-2 w-full text-gray-900 dark:text-gray-100"}">${escape(blog.title)}</h3></a>
		<p class="${"text-gray-600 dark:text-gray-400"}">${escape(blog.description)}</p>
		<p class="${"text-gray-600 dark:text-gray-400"}">${escape(blog.date)}</p>
		${validate_component(TagsContainer, "TagsContainer").$$render($$result, { tags: blog.tags }, {}, {})}</div>
	` : ``}`;
});
const ProjectCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { project } = $$props;
  if ($$props.project === void 0 && $$bindings.project && project !== void 0)
    $$bindings.project(project);
  return `${project && (project == null ? void 0 : project.slug) ? `${validate_component(ExternalLink, "ExternalLink").$$render($$result, {
    href: project.slug,
    ariaLabel: project.title
  }, {}, {
    default: () => `<div class="${"mb-4 hover:transition-shadow hover:shadow dark:hover:transition-shadow dark:hover:shadow-dark flex items-center border border-gray-200 dark:border-gray-800 rounded p-4"}"><div class="${"h-14 w-14 ml-2 mr-4 flex-shrink-0"}"></div>
			<div><h2 class="${"text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-5"}">${escape(project == null ? void 0 : project.title)}</h2>
				<p class="${"leading-5 text-gray-700 dark:text-gray-300"}" style="${"float: right;"}">${escape(project == null ? void 0 : project.date)}</p>
				<img${add_attribute("src", project == null ? void 0 : project.img, 0)} alt="${""}" style="${"height: 26em;"}">
				<p class="${"leading-5 text-gray-700 dark:text-gray-300 mt-5"}">${escape(project == null ? void 0 : project.description)}</p></div></div>`
  })}` : ``}`;
});
var LogLevel;
(function(LogLevel2) {
  LogLevel2[LogLevel2["off"] = 0] = "off";
  LogLevel2[LogLevel2["Debug"] = 1] = "Debug";
  LogLevel2[LogLevel2["Error"] = 2] = "Error";
  LogLevel2[LogLevel2["Warning"] = 3] = "Warning";
  LogLevel2[LogLevel2["Info"] = 4] = "Info";
})(LogLevel || (LogLevel = {}));
var index_svelte_svelte_type_style_lang = ".perspective-text.svelte-1dc02nj.svelte-1dc02nj{color:#fff;font-family:Arial;font-size:12.2em;font-weight:900;letter-spacing:-8px;margin-left:1.5em;perspective:23rem;position:absolute;text-transform:uppercase;z-index:1}.viewAll.svelte-1dc02nj.svelte-1dc02nj:hover{text-decoration:underline}.perspective-line.svelte-1dc02nj.svelte-1dc02nj{height:1.4em;overflow-x:hidden}p.svelte-1dc02nj.svelte-1dc02nj{height:1.4em;line-height:1.4em;margin:0}.perspective-line.svelte-1dc02nj.svelte-1dc02nj{overflow-x:hidden!important;position:static}.perspective-line.svelte-1dc02nj:hover p.svelte-1dc02nj{transform:rotate(4deg)}.perspective-line.svelte-1dc02nj.svelte-1dc02nj:first-child{left:29px}.perspective-line.svelte-1dc02nj.svelte-1dc02nj:nth-child(2){left:58px}.perspective-line.svelte-1dc02nj.svelte-1dc02nj:nth-child(3){left:87px}.perspective-line.svelte-1dc02nj.svelte-1dc02nj:nth-child(4){left:116px}.perspective-line.svelte-1dc02nj.svelte-1dc02nj:nth-child(5){left:145px}.perspective-line.svelte-1dc02nj:hover p.svelte-1dc02nj{transform:translateY(-50px)}p.svelte-1dc02nj.svelte-1dc02nj{transition:all .5s ease-in-out}body{background-image:radial-gradient(#000 1px,transparent 0);background-position:-19px -19px;background-size:40px 40px}";
const css = {
  code: ".perspective-text.svelte-1dc02nj.svelte-1dc02nj{color:#fff;font-family:Arial;font-size:12.2em;font-weight:900;letter-spacing:-8px;margin-left:1.5em;perspective:23rem;position:absolute;text-transform:uppercase;z-index:1}.viewAll.svelte-1dc02nj.svelte-1dc02nj:hover{text-decoration:underline}.perspective-line.svelte-1dc02nj.svelte-1dc02nj{height:1.4em;overflow-x:hidden}p.svelte-1dc02nj.svelte-1dc02nj{height:1.4em;line-height:1.4em;margin:0}.perspective-line.svelte-1dc02nj.svelte-1dc02nj{overflow-x:hidden!important;position:static}.perspective-line.svelte-1dc02nj:hover p.svelte-1dc02nj{transform:rotate(4deg)}.perspective-line.svelte-1dc02nj.svelte-1dc02nj:first-child{left:29px}.perspective-line.svelte-1dc02nj.svelte-1dc02nj:nth-child(2){left:58px}.perspective-line.svelte-1dc02nj.svelte-1dc02nj:nth-child(3){left:87px}.perspective-line.svelte-1dc02nj.svelte-1dc02nj:nth-child(4){left:116px}.perspective-line.svelte-1dc02nj.svelte-1dc02nj:nth-child(5){left:145px}.perspective-line.svelte-1dc02nj:hover p.svelte-1dc02nj{transform:translateY(-50px)}p.svelte-1dc02nj.svelte-1dc02nj{transition:all .5s ease-in-out}body{background-image:radial-gradient(#000 1px,transparent 0);background-position:-19px -19px;background-size:40px 40px}",
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<!-- HOME PAGE OF WEBSITE\\n\\n\\n\\n\\n\\n\\n -->\\n<script lang=\\"ts\\" context=\\"module\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\"throw\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\n/**\\n * @type {import('@sveltejs/kit').Load}\\n */\\nexport function load({ fetch }) {\\n    return __awaiter(this, void 0, void 0, function* () {\\n        return {\\n            props: {\\n                blogs: yield fetch(\`/blog.json?recent=\${5}\`).then((res) => res.json()),\\n            },\\n        };\\n    });\\n}\\n<\/script>\\n\\n<script lang=\\"ts\\">// Imports\\nimport HeadTags from '$components/head-tags/HeadTags.svelte';\\nimport BlogPost from '$components/blog-post/BlogPost.svelte';\\nimport ProjectCard from '$components/project-card/ProjectCard.svelte';\\n;\\n;\\n;\\nimport { LoggerUtils } from '$lib/utils/logger';\\nimport { convertToSlug } from '$utils/convert-to-slug';\\n// Exports\\nexport let blogs;\\n// Add metatags for page\\n/**\\n * @type {IMetaTagProperties}\\n */\\nconst metaData = {\\n    title: \`LOOSE LIPS | Live\`,\\n    description: 'Loose lips label radio and blogging website).',\\n    keywords: ['radio', 'mixes', 'london radio', 'music'],\\n};\\n// EVENTS DATA\\nconst events = [\\n    {\\n        title: 'Loose Lips presents: Sunil Sharpe, Cersy & Kortzer',\\n        description: 'Loose Lips brings the legendary Irish turntablist Sunil Sharpe to an exciting new Manchester spot fitted with a beautiful Danley soundsystem. Supported by up and coming techno talent Cersy, and Loose Lips resident Kortzer.',\\n        slug: 'https://github.com/navneetsharmaui/sveltekit-starter',\\n        img: 'https://imgproxy.ra.co/_/quality:66/w:1500/rt:fill/aHR0cHM6Ly9pbWFnZXMucmEuY28vODkxMjlmZGEzN2EzZjIxMDEwOTg1YzZiZmNmNjVjZDFlMGI1ZWIwYi5wbmc=',\\n        icon: '',\\n        date: '28/01/2023',\\n    },\\n];\\nconst mostRecentBlogs = blogs\\n    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))\\n    .slice(0, 3);\\nlet searchValue = '';\\n$: filteredBlogPosts = blogs\\n    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))\\n    .filter((blog) => blog.title.toLowerCase().includes(searchValue.toLowerCase()));\\n// End: Local component properties\\n// Local Methods\\nlet listWithDuplicatetags = [];\\nblogs.forEach((blog) => {\\n    listWithDuplicatetags =\\n        listWithDuplicatetags.length === 0 ? [...blog.tags] : [...listWithDuplicatetags, ...blog.tags];\\n});\\n$: tags = [...new Set(listWithDuplicatetags)];\\n<\/script>\\n\\n<!-- Start: Header Tag -->\\n<HeadTags metaData=\\"{metaData}\\" />\\n<!-- End: Header Tag -->\\n\\n<div class=\\"perspective-text\\">\\n\\t<div class=\\"perspective-line\\">\\n\\t  <p style=\\"margin-left: 23px;\\" class=\\"text-black dark:text-white\\">LOOSE </p>\\n\\t</div>\\n\\t<div class=\\"perspective-line\\">\\n\\t  <p style=\\"margin-left: 56px;\\" class=\\"text-black dark:text-white\\">LIPS</p>\\n\\t</div>\\n\\t<div class=\\"perspective-line\\">\\n\\t  <p style=\\"margin-left: 14px;\\" class=\\"text-black dark:text-white\\">2.0</p>\\n\\t</div>\\n  </div>\\n<!-- Start: Home Page container -->\\n\\n<div class=\\"flex flex-col justify-center items-start max-w-2xl mx-auto mb-16 hover:transform-rotate(4deg)\\">\\n\\t\\n\\t<img src=\\"images/logo-loose-lips.gif\\" alt=\\"\\" style=\\"margin-top: -2vh;\\">\\n\\n\\t<a href=\\"#featured\\" style=\\"\\nwidth: 0;\\nheight: 0;\\nborder-left: 40px solid transparent;\\nborder-right: 40px solid transparent;\\nborder-top: 25px solid #8ef6cf;\\ndisplay: block;\\nmargin:auto;\\nmargin-top:5%;\\ncolor: white;\\nz-index:15;\\ntransform: translate(-50%, 0px);\\">\\n</a>\\n<p class=\\"font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white\\" style=\\"margin: auto;transform: rotate(-15deg);\\" >HAVE A LOOKSY</p>\\n\\n</div>\\n<div class=\\"p-5\\">\\n\\t<h2 id=\\"featured\\" class=\\"font-bold text-2xl md:text-4xl tracking-tight mb-4 max-w-5xl text-black dark:text-white\\"> Featured </h2>\\n\\t<img src=\\"images/DIDO_WEB.jpg\\" alt=\\"featured\\" style=\\"margin-bottom: 2.5em;\\">\\n\\t<iframe width=\\"560\\" height=\\"315\\" src=\\"https://www.youtube.com/embed/asEvnIJ7GfA\\" title=\\"YouTube video player\\" frameborder=\\"0\\" allow=\\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\\" allowfullscreen></iframe>\\n\\t\\t\\n</div>\\n<div class=\\"flex flex-row flex-wrap w-full mt-4 items-center\\">\\n\\t{#each tags as tag, index (tag)}\\n\\t\\t<a\\n\\t\\t\\tsveltekit:prefetch\\n\\t\\t\\thref=\\"{\`/tags/\${convertToSlug(tag)}\`}\\"\\n\\t\\t\\taria-label=\\"{tag}\\"\\n\\t\\t\\tclass=\\"text-xl font-bold text-black-400 text-black dark:text-white hover:text-white dark:hover:text-white\\"\\n\\t\\t>\\n\\t\\t\\t{tag.toUpperCase()}\\n\\t\\t</a>\\n\\t\\t{#if index !== tags.length - 1}\\n\\t\\t\\t<p class=\\"mr-2 ml-2 text-black dark:text-white\\">\\n\\t\\t\\t\\t{\` \u2022 \`}\\n\\t\\t\\t</p>\\n\\t\\t{/if}\\n\\t{/each}\\n</div>\\n<div class=\\"flex flex-row justify-center items-start max-w-6xl mx-auto mb-16 hover:transform-rotate(4deg)\\">\\n\\n\\t\\t\\t<!-- Start: Popular Blog Section -->\\n\\t\\t\\t<h2 class=\\"font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white mt-8em\\" style=\\"margin-top: 15%;\\"> Recent Posts </h2>\\n\\t\\t\\t<div>\\n\\t\\t\\t\\t\\n\\t\\t\\t</div>\\n\\t\\t\\t{#if blogs.length > 0}\\n\\t\\t\\t\\t{#each blogs as blog, index (blog.slug)}\\n\\n\\t\\t\\t\\t<div class=\\"p-5\\">\\n\\t\\t\\t\\t\\t<BlogPost blog=\\"{blog}\\" />\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\n\\t\\t\\t\\t{/each}\\n\\t\\t\\t{/if}\\n\\t\\t\\t<!-- End: Popular Blog Section -->\\n\\n\\t\\t\\t\\n\\t\\t\\n</div>\\n\\n<div class=\\"flex flex-row justify-center items-start max-w-6xl mx-auto mb-16 hover:transform-rotate(4deg)\\">\\n\\n\\t<!-- Start: Popular Blog Section -->\\n\\t<h2 class=\\"font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white mt-8em\\" > Editorial Posts </h2>\\n\\t<div>\\n\\t\\t\\n\\t</div>\\n\\t{#if blogs.length > 0}\\n\\t\\t{#each blogs as blog, index (blog.slug)}\\n\\n\\t\\t<div class=\\"p-5\\">\\n\\t\\t\\t<BlogPost blog=\\"{blog}\\" />\\n\\t\\t</div>\\n\\t\\t\\t\\t\\n\\t\\t{/each}\\n\\t{/if}\\n\\t<!-- End: Popular Blog Section -->\\n\\n\\t\\n\\n</div>\\n\\n<div class=\\"flex flex-row justify-left items-start max-w-2xl mx-auto\\">\\n\\t<div class=\\"p-5\\">\\n<!-- Start: Events -->\\n\\t<h2 class=\\"font-bold text-2xl md:text-2xl tracking-tight mb-2 max-w-1xl text-black dark:text-white\\"> Upcoming Events </h2>\\n\\t{#if events.length > 0}\\n\\t\\t{#each events as event}\\n\\t\\t\\t<ProjectCard project=\\"{event}\\" />\\n\\t\\t{/each}\\n\\t{/if}\\n\\t<a href=\\"events\\" class=\\"viewAll\\">\\n\\t\\t<p class=\\"font-italic text-m text-white\\">View past events</p>\\n\\t</a>\\n\\t<!-- End: Top Events -->\\n\\t</div>\\n\\n</div>\\n<!-- End: Home Page container -->\\n<!-- Old code for audio player\\n\\t<div class=\\"audio\\" style=\\"position:fixed;left:0;bottom:0;width:;\\">\\n\\t<Aplayer audio={\\n\\t\\t{name:'\u541B\u306E\u77E5\u3089\u306A\u3044\u7269\u8A9E',\\n\\t\\tartist: 'supercell',\\n\\t\\tcover: 'https://blog-static.fengkx.top/svelte-aplayer/bakemonogatari-ed.jpg',\\n\\t\\turl: \\"https://blog-static.fengkx.top/svelte-aplayer/bakemonogatari-ed.mp3\\"}} />\\n\\n</div> -->\\n<style>.perspective-text{color:#fff;font-family:Arial;font-size:12.2em;font-weight:900;letter-spacing:-8px;margin-left:1.5em;perspective:23rem;position:absolute;text-transform:uppercase;z-index:1}.viewAll:hover{text-decoration:underline}.perspective-line{height:1.4em;overflow-x:hidden}p{height:1.4em;line-height:1.4em;margin:0}.perspective-line{overflow-x:hidden!important;position:static}.perspective-line:hover p{transform:rotate(4deg)}.perspective-line:first-child{left:29px}.perspective-line:nth-child(2){left:58px}.perspective-line:nth-child(3){left:87px}.perspective-line:nth-child(4){left:116px}.perspective-line:nth-child(5){left:145px}.perspective-line:hover p{transform:translateY(-50px)}p{transition:all .5s ease-in-out}:global(body){background-image:radial-gradient(#000 1px,transparent 0);background-position:-19px -19px;background-size:40px 40px}</style>\\n"],"names":[],"mappings":"AAiNO,+CAAiB,CAAC,MAAM,IAAI,CAAC,YAAY,KAAK,CAAC,UAAU,MAAM,CAAC,YAAY,GAAG,CAAC,eAAe,IAAI,CAAC,YAAY,KAAK,CAAC,YAAY,KAAK,CAAC,SAAS,QAAQ,CAAC,eAAe,SAAS,CAAC,QAAQ,CAAC,CAAC,sCAAQ,MAAM,CAAC,gBAAgB,SAAS,CAAC,+CAAiB,CAAC,OAAO,KAAK,CAAC,WAAW,MAAM,CAAC,+BAAC,CAAC,OAAO,KAAK,CAAC,YAAY,KAAK,CAAC,OAAO,CAAC,CAAC,+CAAiB,CAAC,WAAW,MAAM,UAAU,CAAC,SAAS,MAAM,CAAC,gCAAiB,MAAM,CAAC,gBAAC,CAAC,UAAU,OAAO,IAAI,CAAC,CAAC,+CAAiB,YAAY,CAAC,KAAK,IAAI,CAAC,+CAAiB,WAAW,CAAC,CAAC,CAAC,KAAK,IAAI,CAAC,+CAAiB,WAAW,CAAC,CAAC,CAAC,KAAK,IAAI,CAAC,+CAAiB,WAAW,CAAC,CAAC,CAAC,KAAK,KAAK,CAAC,+CAAiB,WAAW,CAAC,CAAC,CAAC,KAAK,KAAK,CAAC,gCAAiB,MAAM,CAAC,gBAAC,CAAC,UAAU,WAAW,KAAK,CAAC,CAAC,+BAAC,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,WAAW,CAAC,AAAQ,IAAI,AAAC,CAAC,iBAAiB,gBAAgB,IAAI,CAAC,GAAG,CAAC,WAAW,CAAC,CAAC,CAAC,CAAC,oBAAoB,KAAK,CAAC,KAAK,CAAC,gBAAgB,IAAI,CAAC,IAAI,CAAC"}`
};
var __awaiter$6 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve2) {
      resolve2(value);
    });
  }
  return new (P || (P = Promise))(function(resolve2, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function load$6({ fetch: fetch2 }) {
  return __awaiter$6(this, void 0, void 0, function* () {
    return {
      props: {
        blogs: yield fetch2(`/blog.json?recent=${5}`).then((res) => res.json())
      }
    };
  });
}
let searchValue = "";
const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let tags;
  let { blogs } = $$props;
  const metaData = {
    title: `LOOSE LIPS | Live`,
    description: "Loose lips label radio and blogging website).",
    keywords: ["radio", "mixes", "london radio", "music"]
  };
  const events = [
    {
      title: "Loose Lips presents: Sunil Sharpe, Cersy & Kortzer",
      description: "Loose Lips brings the legendary Irish turntablist Sunil Sharpe to an exciting new Manchester spot fitted with a beautiful Danley soundsystem. Supported by up and coming techno talent Cersy, and Loose Lips resident Kortzer.",
      slug: "https://github.com/navneetsharmaui/sveltekit-starter",
      img: "https://imgproxy.ra.co/_/quality:66/w:1500/rt:fill/aHR0cHM6Ly9pbWFnZXMucmEuY28vODkxMjlmZGEzN2EzZjIxMDEwOTg1YzZiZmNmNjVjZDFlMGI1ZWIwYi5wbmc=",
      icon: "",
      date: "28/01/2023"
    }
  ];
  blogs.sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date))).slice(0, 3);
  let listWithDuplicatetags = [];
  blogs.forEach((blog) => {
    listWithDuplicatetags = listWithDuplicatetags.length === 0 ? [...blog.tags] : [...listWithDuplicatetags, ...blog.tags];
  });
  if ($$props.blogs === void 0 && $$bindings.blogs && blogs !== void 0)
    $$bindings.blogs(blogs);
  $$result.css.add(css);
  blogs.sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date))).filter((blog) => blog.title.toLowerCase().includes(searchValue.toLowerCase()));
  tags = [...new Set(listWithDuplicatetags)];
  return `





${validate_component(HeadTags, "HeadTags").$$render($$result, { metaData }, {}, {})}


<div class="${"perspective-text svelte-1dc02nj"}"><div class="${"perspective-line svelte-1dc02nj"}"><p style="${"margin-left: 23px;"}" class="${"text-black dark:text-white svelte-1dc02nj"}">LOOSE </p></div>
	<div class="${"perspective-line svelte-1dc02nj"}"><p style="${"margin-left: 56px;"}" class="${"text-black dark:text-white svelte-1dc02nj"}">LIPS</p></div>
	<div class="${"perspective-line svelte-1dc02nj"}"><p style="${"margin-left: 14px;"}" class="${"text-black dark:text-white svelte-1dc02nj"}">2.0</p></div></div>


<div class="${"flex flex-col justify-center items-start max-w-2xl mx-auto mb-16 hover:transform-rotate(4deg)"}"><img src="${"images/logo-loose-lips.gif"}" alt="${""}" style="${"margin-top: -2vh;"}">

	<a href="${"#featured"}" style="${"width: 0; height: 0; border-left: 40px solid transparent; border-right: 40px solid transparent; border-top: 25px solid #8ef6cf; display: block; margin:auto; margin-top:5%; color: white; z-index:15; transform: translate(-50%, 0px);"}"></a>
<p class="${"font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white svelte-1dc02nj"}" style="${"margin: auto;transform: rotate(-15deg);"}">HAVE A LOOKSY</p></div>
<div class="${"p-5"}"><h2 id="${"featured"}" class="${"font-bold text-2xl md:text-4xl tracking-tight mb-4 max-w-5xl text-black dark:text-white"}">Featured </h2>
	<img src="${"images/DIDO_WEB.jpg"}" alt="${"featured"}" style="${"margin-bottom: 2.5em;"}">
	<iframe width="${"560"}" height="${"315"}" src="${"https://www.youtube.com/embed/asEvnIJ7GfA"}" title="${"YouTube video player"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"}" allowfullscreen></iframe></div>
<div class="${"flex flex-row flex-wrap w-full mt-4 items-center"}">${each(tags, (tag, index2) => `<a sveltekit:prefetch${add_attribute("href", `/tags/${convertToSlug(tag)}`, 0)}${add_attribute("aria-label", tag, 0)} class="${"text-xl font-bold text-black-400 text-black dark:text-white hover:text-white dark:hover:text-white"}">${escape(tag.toUpperCase())}</a>
		${index2 !== tags.length - 1 ? `<p class="${"mr-2 ml-2 text-black dark:text-white svelte-1dc02nj"}">${escape(` \u2022 `)}
			</p>` : ``}`)}</div>
<div class="${"flex flex-row justify-center items-start max-w-6xl mx-auto mb-16 hover:transform-rotate(4deg)"}">
			<h2 class="${"font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white mt-8em"}" style="${"margin-top: 15%;"}">Recent Posts </h2>
			<div></div>
			${blogs.length > 0 ? `${each(blogs, (blog, index2) => `<div class="${"p-5"}">${validate_component(BlogPost, "BlogPost").$$render($$result, { blog }, {}, {})}
				</div>`)}` : ``}
			</div>

<div class="${"flex flex-row justify-center items-start max-w-6xl mx-auto mb-16 hover:transform-rotate(4deg)"}">
	<h2 class="${"font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white mt-8em"}">Editorial Posts </h2>
	<div></div>
	${blogs.length > 0 ? `${each(blogs, (blog, index2) => `<div class="${"p-5"}">${validate_component(BlogPost, "BlogPost").$$render($$result, { blog }, {}, {})}
		</div>`)}` : ``}
	</div>

<div class="${"flex flex-row justify-left items-start max-w-2xl mx-auto"}"><div class="${"p-5"}">
	<h2 class="${"font-bold text-2xl md:text-2xl tracking-tight mb-2 max-w-1xl text-black dark:text-white"}">Upcoming Events </h2>
	${events.length > 0 ? `${each(events, (event) => `${validate_component(ProjectCard, "ProjectCard").$$render($$result, { project: event }, {}, {})}`)}` : ``}
	<a href="${"events"}" class="${"viewAll svelte-1dc02nj"}"><p class="${"font-italic text-m text-white svelte-1dc02nj"}">View past events</p></a>
	</div></div>

`;
});
var index$f = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes,
  load: load$6
});
const Track = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { track } = $$props;
  if ($$props.track === void 0 && $$bindings.track && track !== void 0)
    $$bindings.track(track);
  return `${track ? `<div class="${"flex flex-row items-baseline border-b border-gray-100 dark:border-gray-800 max-w-3xl w-full mt-8"}"><p class="${"text-sm font-bold text-gray-500 dark:text-gray-400"}">${escape(track.ranking)}</p>
			<div class="${"flex flex-col pl-3"}">${validate_component(ExternalLink, "ExternalLink").$$render($$result, {
    href: track.songUrl,
    cssClasses: "font-medium text-gray-900 dark:text-gray-100 truncate w-60 sm:w-96 md:w-full",
    ariaLabel: track.title
  }, {}, { default: () => `${escape(track.title)}` })}
				<p class="${"text-gray-500 mb-4 truncate w-60 sm:w-96 md:w-full"}" color="${"gray.500"}">${escape(track.artist)}</p></div></div>` : ``}`;
});
const TopTracks = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { topTracks } = $$props;
  if ($$props.topTracks === void 0 && $$bindings.topTracks && topTracks !== void 0)
    $$bindings.topTracks(topTracks);
  return `${each(topTracks, (topTrack, index2) => `${validate_component(Track, "Track").$$render($$result, { track: topTrack }, {}, {})}`)}`;
});
var __awaiter$5 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve2) {
      resolve2(value);
    });
  }
  return new (P || (P = Promise))(function(resolve2, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function load$5({ fetch: fetch2 }) {
  return __awaiter$5(this, void 0, void 0, function* () {
    return {
      props: {
        topTracks: yield fetch2(`/api/top-tracks.json`).then((res) => res.json())
      }
    };
  });
}
const Dashboard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { topTracks } = $$props;
  const metaData = {
    title: "Dashboard | Sveltekit Blog",
    description: "Dashboard page of Sveltekit blog starter project",
    url: "/dashboard",
    keywords: ["sveltekit", "sveltekit starter", "sveltekit starter dashboard"],
    searchUrl: "/dashboard"
  };
  if ($$props.topTracks === void 0 && $$bindings.topTracks && topTracks !== void 0)
    $$bindings.topTracks(topTracks);
  return `
${validate_component(HeadTags, "HeadTags").$$render($$result, { metaData }, {}, {})}


<div class="${"flex flex-col justify-center items-start max-w-2xl mx-auto mb-16"}"><h1 class="${"font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white"}">Dashboard </h1>
	<div class="${"mb-8"}"><p class="${"text-gray-600 dark:text-gray-400 mb-4"}">This the dashboard view for my portfolio to track the metric related to the various platforms I use and are
			availabe for the public use. Right now it just tracks GitHub metrics.
		</p></div>
	<h2 class="${"font-bold text-3xl tracking-tight mb-4 mt-16 text-black dark:text-white"}">Top Tracks </h2>
	<p class="${"text-gray-600 dark:text-gray-400 mb-4"}">Curious what I&#39;m currently jamming to? Here&#39;s my top tracks on Spotify updated daily.
	</p>
	${validate_component(TopTracks, "TopTracks").$$render($$result, { topTracks }, {}, {})}</div>`;
});
var index$e = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Dashboard,
  load: load$5
});
const hydrate$1 = dev;
const router$1 = browser;
const prerender$1 = true;
const Projects = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const metaData = {
    title: "Project | Sveltekit Blog",
    description: "Project page of Sveltekit blog starter project",
    url: "/projects",
    keywords: ["sveltekit", "sveltekit starter", "sveltekit starter about"],
    searchUrl: "/projects"
  };
  return `
${validate_component(HeadTags, "HeadTags").$$render($$result, { metaData }, {}, {})}



<div class="${"flex flex-col justify-center items-start max-w-2xl mx-auto mb-16"}"><h1 class="${"font-bold text-3xl md:text-5xl tracking-tight mb-4 dark:text-white"}">Coming soon... </h1></div>
`;
});
var index$d = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Projects,
  hydrate: hydrate$1,
  router: router$1,
  prerender: prerender$1
});
const SnippetCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title = "" } = $$props;
  let { description: description2 = "" } = $$props;
  let { slug = "" } = $$props;
  let { logo = "" } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.description === void 0 && $$bindings.description && description2 !== void 0)
    $$bindings.description(description2);
  if ($$props.slug === void 0 && $$bindings.slug && slug !== void 0)
    $$bindings.slug(slug);
  if ($$props.logo === void 0 && $$bindings.logo && logo !== void 0)
    $$bindings.logo(logo);
  return `<a sveltekit:prefetch${add_attribute("href", `/snippets/${slug}`, 0)} class="${"border border-grey-200 dark:border-gray-900 rounded filter hover:shadow-md dark:hover:shadow-dark p-4 w-full"}"><img${add_attribute("alt", title, 0)}${add_attribute("height", 32, 0)}${add_attribute("width", 32, 0)}${add_attribute("src", `/logos/${logo}`, 0)} class="${"filter drop-shadow rounded-full"}">
	<h3 class="${"text-lg font-bold text-left mt-2 text-gray-900 dark:text-gray-100"}">${escape(title)}</h3>
	<p class="${"mt-1 text-gray-700 dark:text-gray-400"}">${escape(description2)}</p></a>`;
});
var __awaiter$4 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve2) {
      resolve2(value);
    });
  }
  return new (P || (P = Promise))(function(resolve2, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function load$4({ fetch: fetch2 }) {
  return __awaiter$4(this, void 0, void 0, function* () {
    return {
      props: {
        snippets: yield fetch2("/snippets.json").then((res) => res.json())
      }
    };
  });
}
const Snippets = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { snippets } = $$props;
  const metaData = {
    title: "Snippets | Sveltekit Blog",
    description: "Snippets page of Sveltekit blog starter project",
    url: "/snippets",
    keywords: ["sveltekit", "sveltekit starter", "sveltekit snippets"],
    searchUrl: "/snippets"
  };
  if ($$props.snippets === void 0 && $$bindings.snippets && snippets !== void 0)
    $$bindings.snippets(snippets);
  return `
${validate_component(HeadTags, "HeadTags").$$render($$result, { metaData }, {}, {})}



<div class="${"flex flex-col justify-center items-start max-w-2xl mx-auto mb-16"}"><h1 class="${"font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white"}">Code Snippets </h1>
	<p class="${"text-gray-600 dark:text-gray-400 mb-4"}">These are a collection of code snippets I&#39;ve used in the past and saved. Some are Serverless Functions, which
		include set up instructions. Others are anything from random CSS snippets to Node.js scripts.
	</p>
	<div class="${"grid gap-4 grid-cols-1 sm:grid-cols-2 my-2 w-full mt-4"}">${each(snippets, (snippet, index2) => `${validate_component(SnippetCard, "SnippetCard").$$render($$result, {
    title: snippet.title,
    slug: snippet.slug,
    logo: snippet.logo,
    description: snippet.description
  }, {}, {})}`)}</div></div>


`;
});
var index$c = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Snippets,
  load: load$4
});
const linkStyles = "inline-flex text-gray-700 hover:text-gray-800";
const ShareButtons = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { url } = $$props;
  let { title } = $$props;
  let { description: description2 } = $$props;
  const encodedURL = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description2);
  if ($$props.url === void 0 && $$bindings.url && url !== void 0)
    $$bindings.url(url);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.description === void 0 && $$bindings.description && description2 !== void 0)
    $$bindings.description(description2);
  return `${validate_component(ExternalLink, "ExternalLink").$$render($$result, {
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`,
    cssClasses: linkStyles,
    ariaLabel: `Share ${title} on Facebook`
  }, {}, {
    default: () => `${validate_component(Icon, "Icon").$$render($$result, {
      data: faFacebook,
      class: "mr-3",
      scale: 1.5
    }, {}, {})}`
  })}
${validate_component(ExternalLink, "ExternalLink").$$render($$result, {
    href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedURL}&title=${encodedTitle}&summary=${encodedDescription}&source=LinkedIn`,
    cssClasses: linkStyles,
    ariaLabel: `Share ${title} on LinkedIn`
  }, {}, {
    default: () => `${validate_component(Icon, "Icon").$$render($$result, {
      data: faLinkedin,
      class: "mx-3",
      scale: 1.5
    }, {}, {})}`
  })}
${validate_component(ExternalLink, "ExternalLink").$$render($$result, {
    href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedURL}`,
    cssClasses: linkStyles,
    ariaLabel: `Share ${title} on Twitter`
  }, {}, {
    default: () => `${validate_component(Icon, "Icon").$$render($$result, {
      data: faTwitter,
      class: "mx-3",
      scale: 1.5
    }, {}, {})}`
  })}
${validate_component(ExternalLink, "ExternalLink").$$render($$result, {
    href: `https://www.reddit.com/submit?url=${encodedURL}&title=${encodedTitle}`,
    cssClasses: linkStyles,
    ariaLabel: `Share ${title} on Reddit`
  }, {}, {
    default: () => `${validate_component(Icon, "Icon").$$render($$result, {
      data: faReddit,
      class: "mx-3",
      scale: 1.5
    }, {}, {})}`
  })}`;
});
function toDate(date) {
  if (!date)
    return new Date();
  return typeof date === "string" ? new Date(date) : date;
}
function blogTypeDate(date) {
  return toDate(date).toLocaleDateString(void 0, {
    year: "numeric",
    month: "long",
    day: "2-digit"
  });
}
const SnippetsLayout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title = "" } = $$props;
  let { slug = "" } = $$props;
  let { description: description2 = "" } = $$props;
  let { tags = [] } = $$props;
  let { date = "" } = $$props;
  let { author = "" } = $$props;
  let { logo = "" } = $$props;
  let readingTimeDuration = "";
  const editUrl = `${environment.gitHubConfig.GITHUB_SNIPPETS_EDIT_URL}/${slug}/index.md`;
  const discussUrl = `${environment.twitterConfig.TWITTER_SEARCH_URL}?q=${encodeURIComponent(`https://sveltekit-blog-starter.vercel.app/snippets/${slug}`)}`;
  let metaData = {
    title: `${title} | Sveltekit`,
    description: `${description2}`,
    url: `/snippets/${slug}`,
    keywords: ["sveltekit blog", "sveltekit starter", "svelte starter", "svelte", ...tags],
    searchUrl: `/blog/${slug}`,
    image: `/images/snippets/${slug}/banner.jpg`,
    twitter: {
      label1: "Written by",
      data1: author,
      label2: "Published on",
      data2: blogTypeDate(date)
    },
    openGraph: { type: "article" }
  };
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.slug === void 0 && $$bindings.slug && slug !== void 0)
    $$bindings.slug(slug);
  if ($$props.description === void 0 && $$bindings.description && description2 !== void 0)
    $$bindings.description(description2);
  if ($$props.tags === void 0 && $$bindings.tags && tags !== void 0)
    $$bindings.tags(tags);
  if ($$props.date === void 0 && $$bindings.date && date !== void 0)
    $$bindings.date(date);
  if ($$props.author === void 0 && $$bindings.author && author !== void 0)
    $$bindings.author(author);
  if ($$props.logo === void 0 && $$bindings.logo && logo !== void 0)
    $$bindings.logo(logo);
  {
    {
      if (title && slug) {
        metaData = {
          title: `${title} | Sveltekit`,
          url: `/snippets/${slug}`,
          keywords: [
            "sveltekit blog",
            "sveltekit starter",
            "svelte starter",
            "svelte",
            ...tags
          ],
          searchUrl: `/snippets/${slug}`,
          description: `${description2}`,
          image: `/images/snippets/${slug}/banner.jpg`,
          twitter: {
            label1: "Written by",
            data1: author,
            label2: "Published on",
            data2: blogTypeDate(date)
          },
          openGraph: { type: "article" }
        };
      }
    }
  }
  return `
${validate_component(HeadTags, "HeadTags").$$render($$result, { metaData }, {}, {})}


<article class="${"flex flex-col justify-center items-start max-w-2xl mx-auto mb-16 w-full"}"><div class="${"flex justify-between w-full mb-8"}"><div><h1 class="${"font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white"}">${escape(title)}</h1>
			<p class="${"text-gray-700 dark:text-gray-300"}">${escape(description2)}</p></div>
		<div class="${"mt-2 sm:mt-0"}"><img${add_attribute("alt", title, 0)}${add_attribute("height", 48, 0)}${add_attribute("width", 48, 0)}${add_attribute("src", `/logos/${logo}`, 0)} class="${"drop-shadow rounded-full"}"></div></div>
	<div class="${"flex flex-col md:flex-row justify-between items-start md:items-center w-full mt-2"}"><div class="${"flex items-center"}"><img${add_attribute("alt", "Sveltekit Blogger", 0)}${add_attribute("src", "/images/author/favicon-32x32.png", 0)} class="${"rounded-full w-7 h-7"}">
			<p class="${"text-sm text-gray-700 dark:text-gray-300 ml-2"}">${escape(author)}
				${escape(" / ")}
				${escape(blogTypeDate(date))}</p></div>
		<p class="${"text-sm text-gray-500 min-w-32 mt-2 md:mt-0"}">${escape(readingTimeDuration)}</p></div>
	<div class="${"prose dark:prose-dark max-w-none w-full"}" id="${"blog-conent"}">${slots.default ? slots.default({}) : ``}</div>
	<div class="${"mt-8"}"><p class="${"text-sm text-gray-700 dark:text-gray-300 mb-4"}">${escape("Share the code snippet on")}</p>
		${validate_component(ShareButtons, "ShareButtons").$$render($$result, {
    title,
    description: description2,
    url: `${environment.launchURL}/snippets/${slug}`
  }, {}, {})}</div>
	<div class="${"text-sm text-gray-700 dark:text-gray-300 mt-8"}">${validate_component(ExternalLink, "ExternalLink").$$render($$result, {
    href: discussUrl,
    ariaLabel: title,
    cssClasses: "text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-500"
  }, {}, {
    default: () => `${escape("Discuss on Twitter")}`
  })}
		${escape(` \u2022 `)}
		${validate_component(ExternalLink, "ExternalLink").$$render($$result, {
    href: editUrl,
    ariaLabel: title,
    cssClasses: "text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-500"
  }, {}, {
    default: () => `${escape("Edit on GitHub")}`
  })}</div></article>`;
});
const metadata$5 = {
  "layout": "snippet",
  "title": "Yet Another Snippet",
  "description": "Page views over a given range.",
  "logo": "google-analytics.png",
  "slug": "yet-another-snippet",
  "author": "Sveltekit Blogger",
  "date": "2021-08-01",
  "banner": "/images/snippets/yet-another-snippet/banner.jpg",
  "published": true,
  "tags": ["snippets", "google", "Programming"]
};
const Yet_another_snippet = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(SnippetsLayout, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign($$props, metadata$5), {}, {
    default: () => `<pre class="${"language-ts"}"><!-- HTML_TAG_START -->${`<code class="language-ts">
<span class="token keyword">import</span> <span class="token punctuation">&#123;</span> ReactiveFormsModule <span class="token punctuation">&#125;</span> <span class="token keyword">from</span> <span class="token string">'@angular/forms'</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">NgModule</span></span><span class="token punctuation">(</span><span class="token punctuation">&#123;</span>
  imports<span class="token operator">:</span> <span class="token punctuation">[</span>
    ReactiveFormsModule
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">&#125;</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">AppModule</span> <span class="token punctuation">&#123;</span> <span class="token punctuation">&#125;</span></code>`}<!-- HTML_TAG_END --></pre>
<h2 id="${"usage"}"><a class="${"anchor"}" href="${"#usage"}">Usage</a></h2>
<pre class="${"language-ts"}"><!-- HTML_TAG_START -->${`<code class="language-ts">
<span class="token keyword">import</span> <span class="token punctuation">&#123;</span> Component <span class="token punctuation">&#125;</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">&#123;</span> FormControl <span class="token punctuation">&#125;</span> <span class="token keyword">from</span> <span class="token string">'@angular/forms'</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Component</span></span><span class="token punctuation">(</span><span class="token punctuation">&#123;</span>
  selector<span class="token operator">:</span> <span class="token string">'app-name-editor'</span><span class="token punctuation">,</span>
  templateUrl<span class="token operator">:</span> <span class="token string">'./name-editor.component.html'</span><span class="token punctuation">,</span>
  styleUrls<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">'./name-editor.component.css'</span><span class="token punctuation">]</span>
<span class="token punctuation">&#125;</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">NameEditorComponent</span> <span class="token punctuation">&#123;</span>
  name <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FormControl</span><span class="token punctuation">(</span><span class="token string">''</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">&#125;</span></code>`}<!-- HTML_TAG_END --></pre>
<p>Aliquam id mauris ornare, semper lorem eget, volutpat tortor. Phasellus neque urna, maximus non ornare non, tristique aliquam metus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec laoreet eleifend quam eget semper. Phasellus porttitor massa eget tristique tempus. Sed posuere, ex et tristique ultrices, nulla ligula dictum lacus, ut commodo nisi neque ut mi. In auctor lacus sem, vitae commodo sem tempor vel. Proin viverra aliquam eros. Vestibulum imperdiet diam a diam suscipit tincidunt. Sed vitae orci nunc.</p>
<h2 id="${"pellentesque"}"><a class="${"anchor"}" href="${"#pellentesque"}">Pellentesque</a></h2>
<p>Pellentesque id metus sed arcu egestas posuere vehicula eget magna. Praesent eu dui sed eros blandit volutpat tempus sit amet magna. Vestibulum sed ex a lorem imperdiet eleifend. Nulla ultricies tortor sit amet volutpat accumsan. Sed non nunc dignissim, aliquet nunc at, fringilla nisl. Donec pharetra feugiat sapien viverra posuere. Suspendisse et aliquet urna. Cras at nibh nec lacus vehicula scelerisque. In iaculis, nibh nec congue congue, augue diam rhoncus lorem, feugiat dapibus sem nulla ut diam. Integer fringilla eget erat nec imperdiet. Nam accumsan et arcu sed sodales. Donec rutrum mi quam, nec fermentum nibh finibus nec. Proin semper, lacus et hendrerit suscipit, lorem nunc pharetra augue, vel pretium sem urna ut urna.</p>`
  })}`;
});
var index$b = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Yet_another_snippet,
  metadata: metadata$5
});
const metadata$4 = {
  "layout": "snippet",
  "title": "A Second Snippet",
  "description": "Page views over a given range.",
  "logo": "google-analytics.png",
  "slug": "second-snippet",
  "author": "Sveltekit Blogger",
  "date": "2021-08-01",
  "banner": "/images/snippets/second-snippet/banner.jpg",
  "published": true,
  "tags": ["snippets", "google", "Programming"]
};
const Second_snippet = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(SnippetsLayout, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign($$props, metadata$4), {}, {
    default: () => `<pre class="${"language-ts"}"><!-- HTML_TAG_START -->${`<code class="language-ts">
<span class="token keyword">import</span> <span class="token punctuation">&#123;</span> ReactiveFormsModule <span class="token punctuation">&#125;</span> <span class="token keyword">from</span> <span class="token string">'@angular/forms'</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">NgModule</span></span><span class="token punctuation">(</span><span class="token punctuation">&#123;</span>
  imports<span class="token operator">:</span> <span class="token punctuation">[</span>
    ReactiveFormsModule
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">&#125;</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">AppModule</span> <span class="token punctuation">&#123;</span> <span class="token punctuation">&#125;</span></code>`}<!-- HTML_TAG_END --></pre>
<h2 id="${"usage"}"><a class="${"anchor"}" href="${"#usage"}">Usage</a></h2>
<pre class="${"language-ts"}"><!-- HTML_TAG_START -->${`<code class="language-ts">
<span class="token keyword">import</span> <span class="token punctuation">&#123;</span> Component <span class="token punctuation">&#125;</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">&#123;</span> FormControl <span class="token punctuation">&#125;</span> <span class="token keyword">from</span> <span class="token string">'@angular/forms'</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Component</span></span><span class="token punctuation">(</span><span class="token punctuation">&#123;</span>
  selector<span class="token operator">:</span> <span class="token string">'app-name-editor'</span><span class="token punctuation">,</span>
  templateUrl<span class="token operator">:</span> <span class="token string">'./name-editor.component.html'</span><span class="token punctuation">,</span>
  styleUrls<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">'./name-editor.component.css'</span><span class="token punctuation">]</span>
<span class="token punctuation">&#125;</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">NameEditorComponent</span> <span class="token punctuation">&#123;</span>
  name <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FormControl</span><span class="token punctuation">(</span><span class="token string">''</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">&#125;</span></code>`}<!-- HTML_TAG_END --></pre>
<p>Aliquam id mauris ornare, semper lorem eget, volutpat tortor. Phasellus neque urna, maximus non ornare non, tristique aliquam metus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec laoreet eleifend quam eget semper. Phasellus porttitor massa eget tristique tempus. Sed posuere, ex et tristique ultrices, nulla ligula dictum lacus, ut commodo nisi neque ut mi. In auctor lacus sem, vitae commodo sem tempor vel. Proin viverra aliquam eros. Vestibulum imperdiet diam a diam suscipit tincidunt. Sed vitae orci nunc.</p>
<h2 id="${"pellentesque"}"><a class="${"anchor"}" href="${"#pellentesque"}">Pellentesque</a></h2>
<p>Pellentesque id metus sed arcu egestas posuere vehicula eget magna. Praesent eu dui sed eros blandit volutpat tempus sit amet magna. Vestibulum sed ex a lorem imperdiet eleifend. Nulla ultricies tortor sit amet volutpat accumsan. Sed non nunc dignissim, aliquet nunc at, fringilla nisl. Donec pharetra feugiat sapien viverra posuere. Suspendisse et aliquet urna. Cras at nibh nec lacus vehicula scelerisque. In iaculis, nibh nec congue congue, augue diam rhoncus lorem, feugiat dapibus sem nulla ut diam. Integer fringilla eget erat nec imperdiet. Nam accumsan et arcu sed sodales. Donec rutrum mi quam, nec fermentum nibh finibus nec. Proin semper, lacus et hendrerit suscipit, lorem nunc pharetra augue, vel pretium sem urna ut urna.</p>`
  })}`;
});
var index$a = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Second_snippet,
  metadata: metadata$4
});
const metadata$3 = {
  "layout": "snippet",
  "title": "First Snippet",
  "description": "Page views over a given range.",
  "logo": "google-analytics.png",
  "slug": "first-snippet",
  "author": "Sveltekit Blogger",
  "date": "2021-08-01",
  "banner": "/images/snippets/fist-snippet/banner.jpg",
  "published": true,
  "tags": ["snippets", "google", "Programming"]
};
const First_snippet = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(SnippetsLayout, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign($$props, metadata$3), {}, {
    default: () => `<pre class="${"language-ts"}"><!-- HTML_TAG_START -->${`<code class="language-ts">
<span class="token keyword">import</span> <span class="token punctuation">&#123;</span> ReactiveFormsModule <span class="token punctuation">&#125;</span> <span class="token keyword">from</span> <span class="token string">'@angular/forms'</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">NgModule</span></span><span class="token punctuation">(</span><span class="token punctuation">&#123;</span>
  imports<span class="token operator">:</span> <span class="token punctuation">[</span>
    ReactiveFormsModule
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">&#125;</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">AppModule</span> <span class="token punctuation">&#123;</span> <span class="token punctuation">&#125;</span></code>`}<!-- HTML_TAG_END --></pre>
<h2 id="${"usage"}"><a class="${"anchor"}" href="${"#usage"}">Usage</a></h2>
<pre class="${"language-ts"}"><!-- HTML_TAG_START -->${`<code class="language-ts">
<span class="token keyword">import</span> <span class="token punctuation">&#123;</span> Component <span class="token punctuation">&#125;</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">&#123;</span> FormControl <span class="token punctuation">&#125;</span> <span class="token keyword">from</span> <span class="token string">'@angular/forms'</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Component</span></span><span class="token punctuation">(</span><span class="token punctuation">&#123;</span>
  selector<span class="token operator">:</span> <span class="token string">'app-name-editor'</span><span class="token punctuation">,</span>
  templateUrl<span class="token operator">:</span> <span class="token string">'./name-editor.component.html'</span><span class="token punctuation">,</span>
  styleUrls<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">'./name-editor.component.css'</span><span class="token punctuation">]</span>
<span class="token punctuation">&#125;</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">NameEditorComponent</span> <span class="token punctuation">&#123;</span>
  name <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FormControl</span><span class="token punctuation">(</span><span class="token string">''</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">&#125;</span></code>`}<!-- HTML_TAG_END --></pre>
<p>Aliquam id mauris ornare, semper lorem eget, volutpat tortor. Phasellus neque urna, maximus non ornare non, tristique aliquam metus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec laoreet eleifend quam eget semper. Phasellus porttitor massa eget tristique tempus. Sed posuere, ex et tristique ultrices, nulla ligula dictum lacus, ut commodo nisi neque ut mi. In auctor lacus sem, vitae commodo sem tempor vel. Proin viverra aliquam eros. Vestibulum imperdiet diam a diam suscipit tincidunt. Sed vitae orci nunc.</p>
<h2 id="${"pellentesque"}"><a class="${"anchor"}" href="${"#pellentesque"}">Pellentesque</a></h2>
<p>Pellentesque id metus sed arcu egestas posuere vehicula eget magna. Praesent eu dui sed eros blandit volutpat tempus sit amet magna. Vestibulum sed ex a lorem imperdiet eleifend. Nulla ultricies tortor sit amet volutpat accumsan. Sed non nunc dignissim, aliquet nunc at, fringilla nisl. Donec pharetra feugiat sapien viverra posuere. Suspendisse et aliquet urna. Cras at nibh nec lacus vehicula scelerisque. In iaculis, nibh nec congue congue, augue diam rhoncus lorem, feugiat dapibus sem nulla ut diam. Integer fringilla eget erat nec imperdiet. Nam accumsan et arcu sed sodales. Donec rutrum mi quam, nec fermentum nibh finibus nec. Proin semper, lacus et hendrerit suscipit, lorem nunc pharetra augue, vel pretium sem urna ut urna.</p>`
  })}`;
});
var index$9 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": First_snippet,
  metadata: metadata$3
});
var __awaiter$3 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve2) {
      resolve2(value);
    });
  }
  return new (P || (P = Promise))(function(resolve2, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function load$3({ fetch: fetch2 }) {
  return __awaiter$3(this, void 0, void 0, function* () {
    return {
      props: {
        blogs: yield fetch2(`/blog.json?recent=${5}`).then((res) => res.json())
      }
    };
  });
}
const Events = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const metaData = {
    title: `LOOSE LIPS | Live`,
    description: "Loose lips label radio and blogging website).",
    keywords: ["radio", "mixes", "london radio", "music"]
  };
  const events = [
    {
      title: "Loose Lips presents: Sunil Sharpe, Cersy & Kortzer",
      description: "Loose Lips brings the legendary Irish turntablist Sunil Sharpe to an exciting new Manchester spot fitted with a beautiful Danley soundsystem. Supported by up and coming techno talent Cersy, and Loose Lips resident Kortzer.",
      slug: "https://github.com/navneetsharmaui/sveltekit-starter",
      img: "https://imgproxy.ra.co/_/quality:66/w:1500/rt:fill/aHR0cHM6Ly9pbWFnZXMucmEuY28vODkxMjlmZGEzN2EzZjIxMDEwOTg1YzZiZmNmNjVjZDFlMGI1ZWIwYi5wbmc=",
      icon: "",
      date: "28/01/2023"
    }
  ];
  return `


 




${validate_component(HeadTags, "HeadTags").$$render($$result, { metaData }, {}, {})}




<div class="${"flex flex-col justify-center items-start max-w-2xl mx-auto mb-16"}">
		<h2 class="${"font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black dark:text-white"}">Upcoming Events </h2>
		${events.length > 0 ? `${each(events, (event) => `${validate_component(ProjectCard, "ProjectCard").$$render($$result, { project: event }, {}, {})}`)}` : ``}
		<a href="${"events"}" class="${"viewAll"}"><p class="${"font-italic text-m text-white"}">View past events</p></a>

			
			<h2 class="${"font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black dark:text-white"}">Past Events </h2>
			${events.length > 0 ? `${each(events, (event) => `${validate_component(ProjectCard, "ProjectCard").$$render($$result, { project: event }, {}, {})}`)}` : ``}
			<a href="${"events"}" class="${"viewAll"}"><p class="${"font-italic text-m text-white"}">View past events</p></a></div>`;
});
var index$8 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Events,
  load: load$3
});
const About = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const metaData = {
    title: "About | Sveltekit Blog",
    description: "About page of Sveltekit blog starter project",
    url: "/about",
    keywords: ["sveltekit", "sveltekit starter", "sveltekit starter about"],
    searchUrl: "/about"
  };
  return `
${validate_component(HeadTags, "HeadTags").$$render($$result, { metaData }, {}, {})}



<div class="${"flex flex-col justify-center items-start max-w-2xl mx-auto mb-16"}"><h1 class="${"font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white"}">Coming soon </h1></div>
`;
});
var index$7 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": About
});
var __awaiter$2 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve2) {
      resolve2(value);
    });
  }
  return new (P || (P = Promise))(function(resolve2, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function load$2({ fetch: fetch2 }) {
  return __awaiter$2(this, void 0, void 0, function* () {
    return {
      props: {
        blogs: yield fetch2("/blog.json").then((res) => res.json())
      }
    };
  });
}
const Blog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let filteredBlogPosts;
  let tags;
  let { blogs } = $$props;
  const metaData = {
    title: "Blogs | Sveltekit Blog",
    description: "Blog page of Sveltekit blog starter project",
    url: "/blog",
    keywords: ["sveltekit", "sveltekit starter", "sveltekit starter about"],
    searchUrl: "/blog"
  };
  const mostRecentBlogs = blogs.sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date))).slice(0, 3);
  let searchValue2 = "";
  let listWithDuplicatetags = [];
  blogs.forEach((blog) => {
    listWithDuplicatetags = listWithDuplicatetags.length === 0 ? [...blog.tags] : [...listWithDuplicatetags, ...blog.tags];
  });
  if ($$props.blogs === void 0 && $$bindings.blogs && blogs !== void 0)
    $$bindings.blogs(blogs);
  filteredBlogPosts = blogs.sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date))).filter((blog) => blog.title.toLowerCase().includes(searchValue2.toLowerCase()));
  tags = [...new Set(listWithDuplicatetags)];
  return `
${validate_component(HeadTags, "HeadTags").$$render($$result, { metaData }, {}, {})}



<div class="${"flex flex-col justify-center items-start max-w-2xl mx-auto mb-16"}"><h1 class="${"font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white"}">Blog </h1>

	<p class="${"text-gray-600 dark:text-gray-400 mb-4"}">Discover a wealth of music-related content with our extensive collection of blog posts. From in-depth album reviews and artist interviews to the latest industry news and concert coverage, our team of passionate music enthusiasts bring you the best of the music scene.
		</p>
	<div class="${"flex flex-row flex-wrap w-full mt-4 items-center"}">${each(tags, (tag, index2) => `<a sveltekit:prefetch${add_attribute("href", `/tags/${convertToSlug(tag)}`, 0)}${add_attribute("aria-label", tag, 0)} class="${"text-xl font-bold text-black-400 text-black dark:text-white hover:text-white dark:hover:text-white"}">${escape(tag.toUpperCase())}</a>
			${index2 !== tags.length - 1 ? `<p class="${"mr-2 ml-2 text-black dark:text-white"}">${escape(` \u2022 `)}
				</p>` : ``}`)}</div>
	
	<div class="${"relative w-full mb-4"}"><input aria-label="${"Search articles"}" type="${"text"}" placeholder="${"Search articles"}" class="${"px-4 py-2 border border-gray-300 dark:border-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"}"${add_attribute("value", searchValue2, 0)}>
		<svg class="${"absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300"}" xmlns="${"http://www.w3.org/2000/svg"}" fill="${"none"}" viewBox="${"0 0 24 24"}" stroke="${"currentColor"}"><path stroke-linecap="${"round"}" stroke-linejoin="${"round"}"${add_attribute("stroke-width", 2, 0)} d="${"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"}"></path></svg></div>
	
	
	${`<h2 class="${"font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black dark:text-white"}">Most Recent
		</h2>
		${each(mostRecentBlogs, (blog, index2) => `${validate_component(BlogPost, "BlogPost").$$render($$result, { blog }, {}, {})}`)}`}
	

	
	<h2 class="${"font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black dark:text-white"}">All Posts </h2>
	${filteredBlogPosts.length === 0 ? `<p class="${"text-gray-600 dark:text-gray-400 mb-4"}">No posts found. </p>` : `${each(filteredBlogPosts, (blog, index2) => `${validate_component(BlogPost, "BlogPost").$$render($$result, { blog }, {}, {})}`)}`}</div>


`;
});
var index$6 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Blog,
  load: load$2
});
const NextArticle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { previousHref = "" } = $$props;
  let { nextHref = "" } = $$props;
  if ($$props.previousHref === void 0 && $$bindings.previousHref && previousHref !== void 0)
    $$bindings.previousHref(previousHref);
  if ($$props.nextHref === void 0 && $$bindings.nextHref && nextHref !== void 0)
    $$bindings.nextHref(nextHref);
  return `<div class="${"flex flex-wrap mb-10 pt-2 pb-2"}"><div class="${"flex w-1/2 justify-start"}">${previousHref ? `<a sveltekit:prefetch${add_attribute("href", previousHref, 0)} aria-label="${"previous"}"><small class="${"block text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-500"}">Previous article
				</small></a>` : ``}</div>
	<div class="${"flex w-1/2 justify-end"}">${nextHref ? `<a sveltekit:prefetch${add_attribute("href", nextHref, 0)} aria-label="${"next"}"><small class="${"block text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-500"}">Next article
				</small></a>` : ``}</div></div>`;
});
const BlogLayout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title = "" } = $$props;
  let { slug = "" } = $$props;
  let { description: description2 = "" } = $$props;
  let { tags = [] } = $$props;
  let { date = "" } = $$props;
  let { author = "" } = $$props;
  let { previousArticleLink = "" } = $$props;
  let { nextArticleLink = "" } = $$props;
  let readingTimeDuration = "";
  const editUrl = `${environment.gitHubConfig.GITHUB_BLOG_EDIT_URL}/${slug}/index.md`;
  const discussUrl = `${environment.twitterConfig.TWITTER_SEARCH_URL}?q=${encodeURIComponent(`https://sveltekit-blog-starter.vercel.app/blog/${slug}`)}`;
  let metaData = {
    title: `${title} | Sveltekit`,
    description: `${description2}`,
    url: `/blog/${slug}`,
    keywords: ["sveltekit blog", "sveltekit starter", "svelte starter", "svelte", ...tags],
    searchUrl: `/blog/${slug}`,
    image: `/images/blogs/${slug}/banner.jpg`,
    twitter: {
      label1: "Written by",
      data1: author,
      label2: "Published on",
      data2: blogTypeDate(date)
    },
    openGraph: { type: "article" }
  };
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.slug === void 0 && $$bindings.slug && slug !== void 0)
    $$bindings.slug(slug);
  if ($$props.description === void 0 && $$bindings.description && description2 !== void 0)
    $$bindings.description(description2);
  if ($$props.tags === void 0 && $$bindings.tags && tags !== void 0)
    $$bindings.tags(tags);
  if ($$props.date === void 0 && $$bindings.date && date !== void 0)
    $$bindings.date(date);
  if ($$props.author === void 0 && $$bindings.author && author !== void 0)
    $$bindings.author(author);
  if ($$props.previousArticleLink === void 0 && $$bindings.previousArticleLink && previousArticleLink !== void 0)
    $$bindings.previousArticleLink(previousArticleLink);
  if ($$props.nextArticleLink === void 0 && $$bindings.nextArticleLink && nextArticleLink !== void 0)
    $$bindings.nextArticleLink(nextArticleLink);
  {
    {
      if (title && slug) {
        metaData = {
          title: `${title} | Sveltekit`,
          url: `/blog/${slug}`,
          keywords: [
            "sveltekit blog",
            "sveltekit starter",
            "svelte starter",
            "svelte",
            ...tags
          ],
          searchUrl: `/blog/${slug}`,
          description: `${description2}`,
          image: `/images/blogs/${slug}/banner.jpg`,
          twitter: {
            label1: "Written by",
            data1: author,
            label2: "Published on",
            data2: blogTypeDate(date)
          },
          openGraph: { type: "article" }
        };
      }
    }
  }
  return `
${validate_component(HeadTags, "HeadTags").$$render($$result, { metaData }, {}, {})}


<article class="${"flex flex-col justify-center items-start max-w-2xl mx-auto mb-16 w-full"}"><h1 class="${"font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white"}">${escape(title)}</h1>
	<div class="${"flex flex-col md:flex-row justify-between items-start md:items-center w-full mt-2"}"><div class="${"flex items-center"}"><img${add_attribute("alt", "Sveltekit Blogger", 0)}${add_attribute("src", "/images/author/favicon-32x32.png", 0)} class="${"rounded-full w-7 h-7"}">
			<p class="${"text-sm text-gray-700 dark:text-gray-300 ml-2"}">${escape(author)}
				${escape(" / ")}
				${escape(blogTypeDate(date))}</p></div>
		<p class="${"text-sm text-gray-500 min-w-32 mt-2 md:mt-0"}">${escape(readingTimeDuration)}</p></div>
	<div class="${"prose dark:prose-dark max-w-none w-full"}" id="${"blog-conent"}">${slots.default ? slots.default({}) : ``}</div>
	<div class="${"mt-8"}">${validate_component(TagsContainer, "TagsContainer").$$render($$result, { tags }, {}, {})}</div>
	<div class="${"mt-8"}"><p class="${"text-sm text-gray-700 dark:text-gray-300 mb-4"}">${escape("Share the article on")}</p>
		${validate_component(ShareButtons, "ShareButtons").$$render($$result, {
    title,
    description: description2,
    url: `${environment.launchURL}/blog/${slug}`
  }, {}, {})}</div>
	<div class="${"text-sm text-gray-700 dark:text-gray-300 mt-8"}">${validate_component(ExternalLink, "ExternalLink").$$render($$result, {
    href: discussUrl,
    ariaLabel: title,
    cssClasses: "text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-500"
  }, {}, {
    default: () => `${escape("Discuss on Twitter")}`
  })}
		${escape(` \u2022 `)}
		${validate_component(ExternalLink, "ExternalLink").$$render($$result, {
    href: editUrl,
    ariaLabel: title,
    cssClasses: "text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-500"
  }, {}, {
    default: () => `${escape("Edit on GitHub")}`
  })}</div>
	${previousArticleLink || nextArticleLink ? `<div class="${"mt-8 w-full"}">${validate_component(NextArticle, "NextArticle").$$render($$result, {
    previousHref: previousArticleLink,
    nextHref: nextArticleLink
  }, {}, {})}</div>` : ``}</article>`;
});
const metadata$2 = {
  "layout": "blog",
  "title": "10/10 DJ Sets that I was too tired to write about in 2022",
  "slug": "1010-dj-sets-that-i-was-too-tired-to-write-about-in-2022",
  "description": "This is Will's ninth post-lockdown gig review, as always he did not receive payment or press tickets for this, just went as a punter and felt like there was a story there.",
  "author": "Will Soer",
  "date": "2022-07-09",
  "banner": "https://web.archive.org/web/20221110171633im_/https://loose-lips.co.uk/img/blog/634d58f9a3591/634d58f9a4a49.jpg",
  "published": true,
  "tags": ["Event Review"]
};
const _1010_dj_sets_that_i_was_too_tired_to_write_about_in_2022 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(BlogLayout, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign($$props, metadata$2), {}, {
    default: () => `<p><a href="${"http://google.com.au/"}" rel="${"nofollow"}"><img src="${"https://web.archive.org/web/20221110171515im_/https://loose-lips.co.uk/img/wysiwyg/634d5881bf12c.jpg"}"></a></p>
<blockquote><p>This is Will\u2019s ninth post-lockdown gig review, as always he did not receive payment or press tickets for this, just went as a punter and felt like there was a story there. You can read his other ones here.</p></blockquote>
<p>Blah blah blah burnout post covid you know the drill. I was just thinking back on this year, and I realised that something strange has happened, or rather something strange for a person like me who makes sense of the world through stories and narratives, who likes to note down interesting occurrences and discuss them with pals. I was finding it tricky to remember my top nights out of 2022 off the top of my head.\xA0</p>
<p>I asked my partner and our best bud (we often go out as a three), and they said the same thing. I imagine that a lot of the DJs feel the same way, I saw a lot of them talking about 2022 as the longer summer of their lives, and we\u2019re just now starting to see a wave of amazing artists cancelling shows or tours for financial reasons (eg Santigold, Blue Lab Beats and Animal Collective).\xA0</p>
<p>Well you know what, I may be lying in a puddle on the sofa with a head full of phlegm and 404 page errors, but goddamn it I will not let these post-lockdown memories be lost to the sands of time. These artists are fighting for their craft and our shuffling feet, and they deserve to be remembered, even if I don\u2019t have the notes to put together a proper review; the track IDs I mention are mostly just songs that me or my buds recognized. Let\u2019s get into it.</p>
<p><a href="${"http://google.com.au/"}" rel="${"nofollow"}"><img src="${"https://web.archive.org/web/20221110171654im_/https://loose-lips.co.uk/img/wysiwyg/63500b74f41f5.jpg"}"></a></p>
<h2 id="${"moxie--uniiqu3---melt-festival-11--120622"}"><a class="${"anchor"}" href="${"#moxie--uniiqu3---melt-festival-11--120622"}">Moxie &amp; UNIIQU3 - Melt Festival, 11 &amp; 12/06/22</a></h2>
<p>Two totally different DJ sets from the best blockbuster dance festival in Europe, I\u2019m calling it; diverse crowds, beautiful surroundings, you can swim in the lake in the morning to cool off, and it\u2019s near Berlin so people with more serotonin than me can just keep going! This year\u2019s event was a slightly funny one as the festival had been off for a year, so naturally there were some hiccups in the organisation, including moving the all-night stage right next to the campsite, not great for crotchety old men like me who like to sleep sometimes. However, one really cool addition to the festival was the \u2018Radio\u2019 stage, which was also right next to the campsite, but was only on in the daytime. Moreover, it was on an actual beach, you could literally wade in and out of the crowd, or lie on the side, love it.\xA0</p>
<p>Moxie (my favourite House/Techno DJ) did two DJ sets in the weekend, one of them was at the iconic \u2018Big Wheel\u2019 stage underneath an enormous crane (this\xA0kinda vibe), and one was at the Radio stage. The latter was a gorgeous moment for me, dancing with my eyes gazing out towards the water to glistening metropolitan grooves, the kind of moment that\u2019s hard to write about really, though I will share my favourite track ID, from a producer who Moxie plays out a lot; Leave Your Life by Alex Kassian. I mean, just listen to that tune, it is simply perfect. Or go ahead and\xA0listen to the full set, like all of the Radio stage sets it was livestreamed. I should say that the guy in the photo above isn\u2019t me, although he was clearly having a great time too.</p>
<p>Then there was UNIIQU3, on the last night of Melt festival, at the Big Wheel stage. Jersey Club really is just the best genre to make me feel crazy, partly because it\u2019s crazy how many times I\u2019ve had to dance to music that isn\u2019t Jersey Club. Last year I went crazy watching Anu play a load of Jersey Club tunes, and this year we got to New Jersey Club\u2019s hometown club queen. It was a lovely moment as my festi crew had strayed and split at points over the weekend (I spent most of that Moxie set solo), but at this time we were all together, throwing it down and being silly in the sunshine #yolo, memory is fuzzy but I thiiiink she played Twerkulater by City Girls, and she definitely played her own tunes; personal anthem Microdosing plus a fucking huge remix she made of Where\u2019s Your Head At by Basement Jaxx.\xA0</p>
<p><a href="${"http://google.com.au/"}" rel="${"nofollow"}"><img src="${"https://web.archive.org/web/20221110171619im_/https://loose-lips.co.uk/img/wysiwyg/63500c79df595.jpg"}"></a></p>
<p><a href="${"http://google.com.au/"}" rel="${"nofollow"}"><img src="${"https://web.archive.org/web/20221110171713im_/https://loose-lips.co.uk/img/wysiwyg/63500c8c8b0c4.jpg"}"></a></p>
<h2 id="${"ag---vogue-fabrics-dalston-290722"}"><a class="${"anchor"}" href="${"#ag---vogue-fabrics-dalston-290722"}">A.G - Vogue Fabrics Dalston, 29/07/22</a></h2>
<p>This was comfortably my favourite set of the year so far, it\u2019s also the main reason I wanted to write this article. I know a few others that I want to cover off the top of my head, but this was comfortably the best DJ set that I experienced this year (judged purely in terms of the music), and funnily enough it was the same day that my second favourite album of the year was released too; Renaissance by Beyonc\xE9. A.G didn\u2019t fuck around, she played like three different tracks of that album, along with recent hits like Doja by Central Cee, looping that iconic \u2018how can I be homophobic, my b***h is gay\u2019 lyric.</p>
<p>It\u2019s funny, a lot of DJs will use famous tracks to inject some life into their set, but A.G fucking bulldozed the vibe with bangers, blending up to three of them at once and twisting them in insanely creative ways that responded to the queer dancefloor in front of her, maybe my favourite was her playing a Drill remix of Lady Gaga\u2019s Just Dance, with those massive synths sounded like heroin.</p>
<p>The crowd was a starkly contrasted mixture of Dalston queers and random dudes, and one of the two main speaker stacks was broken for a lot of the night, but you really cannot keep the baddest of them all down, she destroyed it and twisted it with meta moments like playing Beyonc\xE9\u2019s Alien Superstar, with its intro \u2018Please do not be alarmed, remain calm, do not attempt to leave the dancefloor, the DJ booth is conducting a troubleshoot test of the entire system.\u2019</p>
<p>Side-note; A.G released a really sick grime instrumental production around that time called GML, with a set of different versions with different vocal styles on top of it, perfect for looping over and over in the afterglow of the dance. But yeah for the love of god people book A.G if you really wanna make people dance. I know I sound performative saying that and my audience for these articles isn\u2019t too London promoters, it my mates and my mum, but I really really mean it.</p>
<p><a href="${"http://google.com.au/"}" rel="${"nofollow"}"><img src="${"https://web.archive.org/web/20221110171559im_/https://loose-lips.co.uk/img/wysiwyg/634d56d31fbf3.jpg"}"></a></p>
<h2 id="${"shivum-sharma---keep-hush-at-the-victoria-dalston-170822"}"><a class="${"anchor"}" href="${"#shivum-sharma---keep-hush-at-the-victoria-dalston-170822"}">Shivum Sharma - Keep Hush at the Victoria Dalston, 17/08/22</a></h2>
<p>This was a super bizarre one, 6pm on a Wednesday in the back of a pub, we thought Shivum was going to perform some tunes from his gorgeous, lush, super chill debut EP, as this event was under his name, but instead it was a dance event that he had curated themselves, and he DJ-ed at the very start! All the DJs were sick - Lexii had a MVP moment playing a Jersey Club remix of Waiting For Tonight by Jennifer Lopez, seriously gucci shit. But my favourite set was Shivum\u2019s, it was really smooth and sweet and elevated, just like their EP, but also totally different because it was, you know, a dance music DJ set.\xA0</p>
<p>About halfway through the set, he played a voguey blend of SWV - Rain, really cute moment as it been a really rainy track that day, my bud Angus (who helped me write this review) had actually been playing the original that day at the deli where he works, lovely. Around the end there was also a remix of Liquorice\xA0by Azealia Banks, just to get my late-period-Millennial heart a flutter. Beaut. Here\u2019s a link to the stream!</p>
<p><a href="${"http://google.com.au/"}" rel="${"nofollow"}"><img src="${"https://web.archive.org/web/20221110171550im_/https://loose-lips.co.uk/img/wysiwyg/634d57ed9977c.jpg"}"></a></p>
<h2 id="${"ok-williams---possibly-maybe-adonis-200822"}"><a class="${"anchor"}" href="${"#ok-williams---possibly-maybe-adonis-200822"}">OK Williams - Possibly Maybe, Adonis, 20/08/22</a></h2>
<p>This one was absolute rave bliss, taking place at the Cause\u2019s temporary outdoor home out in Canning Town, with cable cars dotting the distant sunset. It\u2019s worth mentioning at this point that, like a few of the events I\u2019ve covered so far, this was a queer event, and moreover this particular event, Adonis, was home to a real queer community, 97% gay men. Add into this the fact that almost all the DJs were women/female-presenting, and you\u2019ve got a really fun cock-tail. Ugh look guys I\u2019m flagging, my standard of writing is not where I want it to be, you get the idea if was a cool event for me. So cool that I found myself having these big revelations about myself my life and my partner and my friend and sharing them with tears in my eyes, I\u2019m really grateful to the Adonis crowd for welcoming us.</p>
<p>ANYWAY the outdoor part of the event was headlined by OK Williams, and to nobody\u2019s surprise she smashed it, total vibes from start to finish. At one point my partner had an \u2018OH MY GOD THIS SONG\u2019 moment that meant we had to run over to the dance floor (Saturday Night - Whigfield) only to bump into my buddy who had just had the exact same moment for the previous track; Sfire 7 (by Sfire, an early project from the late trans production visionary Sophie). At the very end, OK Williams was playing some big housey tune, blended it into a looped beat, this big bumping tribalistic rrrrraaaaaawwwwr type of vibe, and then slowed that beat down, unlooped it, and allowed the track to reveal itself as Gimme More by Britney Spears (although my partner had already worked this out, come on Will you know this, I walk to this song so often). Fuuuuck me we cheered, and this gorgeous queen whose outfit we had been admiring earlier climbed up into the rafters above the DJ decks and hung above us like a sexy bat.</p>
<p><a href="${"http://google.com.au/"}" rel="${"nofollow"}"><img src="${"https://web.archive.org/web/20221110171522im_/https://loose-lips.co.uk/img/wysiwyg/634d57fa6a91b.jpg"}"></a></p>
<h2 id="${"shy-one-martelo--benji-b---notting-hill-carnival-deviation-stage-280822"}"><a class="${"anchor"}" href="${"#shy-one-martelo--benji-b---notting-hill-carnival-deviation-stage-280822"}">Shy One, Martelo &amp; Benji B - Notting Hill Carnival Deviation stage, 28/08/22</a></h2>
<p>Notting Hill Carnival! One of my all-time favourite DJs and curators Benji B usually puts on his Deviation sound system there, I was worried it might be off this year but with two days to go he shares a cheeky animation of a whistle with a rave siren behind it on Instagram. It\u2019s back at St Luke\u2019s Road, the same place as last time in 2019, that August day I managed to catch the last half hour, having been working as a tour guide that day and somehow found my friends, using only the word \u2018deviation\u2019 and strangers\u2019 directions. Well, I got a Monday to Friday job now muthafuckas, giving me enough time to rest and be nice and sober on a Saturday before heading to carnival nice n early the next day, with those same people I went to meet back in 2019, my partner and my best mate.</p>
<p>The stage is at the edge of the carnival site, near a tube station, so it creeps up on us suddenly as we arrive at 12:45am. Shy one had just started DJing, and the mc Judah has been wheeling up almost all of her tracks, \u201Cno no no it\u2019s the Magnum talking\u201D, referring to a drink that Shy One just bought that morning in an off license. How do I know that???? She posted it in her insta story, alongside her set times, she was the only DJ I knew was coming up. And yeah wowwwww she killed it, starting with a set of old school Reggae classics before sliding into modern times, with Blind To You by Collie Buddz, Fall In Love by Popcaan and Ramping Shop by Vybz Cartel. Oooooooooooh baby it felt good, the crowds hadn\u2019t bulked yet, people were smiling, there was a random guy doing his plants on a balcony behind the stage and ye waved and the crowd whooped. A couple of times Benji B reached forward and clicked a small synth looking thing next to the decks, manipulating a serene rave siren. Ooooh ah oooh ah ooooh.</p>
<p><a href="${"http://google.com.au/"}" rel="${"nofollow"}"><img src="${"https://web.archive.org/web/20221110171516im_/https://loose-lips.co.uk/img/wysiwyg/634d581931145.jpg"}"></a></p>
<p>Then Martelo came in and the crowd got packed but he kept us moving baby, turned the tempo up dramatically, beautiful scenes, also layering in some balmy bangers like Together by Ruff Sqwad, Wasting Time\xA0by Brent Faiyaz and Millionaire by Kelis ooooh yes. You know I was actually listening to Martelo live on nts when I first got my job offer (having been trying to get a steady gig for like 16 months) what serendipity, he\u2019s so sick.</p>
<p>We headed out as Sherelle came on, as the crowds were getting pretty rammed and we deserved a break. We then made the stupid mistake of trying to find a friend of ours (hands up that was my idea, I thought I could be special and pull it off), a friend whose group headed on after we got there, then my pals had to use the toilet and this took them an hour etc etc, leaving me writing the last few stand 4:12pm queuing for food whilst my mates search for toilets. I didn\u2019t have the boost in my system to keep raving it up in the masses, but I got to see the quality, the sauce, the niceness.</p>
<p>Well, that\u2019s what I wrote at 4:12pm. After wolfing down my food and finding my partner and my bud by some toilets with a humungous we caught up about our day, and decided to go back to the Deviation stage for one last hurrah. We arrived to find the music was off, someone had been injured opposite the stage and police were demanding that the crowd make way. It took ages for this to happen, and even then the police wouldn\u2019t ok the music, leading to this really weird situation.</p>
<p>MC Judah standing on stage, he had been addressing the crowd over and over and over asking us to make way, and now he\u2019s addressing the constable (he stutters), \u2018we\u2019ve done what you said, please can we turn the music back on\u2026 please\u2026 <em>looks out across the stage</em> well I wait for your signal.\u201D A few minutes later he repeated this, waited again, until finally he announced that the music was returning. The crazy thing is that, after a couple of rapid fire sets from a DJ and a rap performance from the Minikingz, it all ended in a 30 minute DJ set from Benji B. 30 minutes to justify all of that effort and waiting, just as I\u2019d experienced 3 years ago. He didn\u2019t need it, the final 3 minutes alone were worth the entry price, he finished off with Rock The Boat\xA0by Aaliyah and Family Ties by Baby Keem. Water and fire. A lot of that final set was at the gradual, head nod tempo of Rock The Boat, waves of bass rippling through us alongside the shaking sweaty tides of the crowd, yes Benji, nothing I love more than a DJ who cuts the tempo at the moment of climax, easy, there\u2019s nowhere that we need to get to, the procession of punters trying to get from one side of the crowd to another can march on and our legs may ache but we stay here and bathe in excellence.</p>
<p><a href="${"http://google.com.au/"}" rel="${"nofollow"}"><img src="${"https://web.archive.org/web/20221110171520im_/https://loose-lips.co.uk/img/wysiwyg/634d58509b092.jpg"}"></a></p>
<h2 id="${"digital-mystikz---waterworks-festival-september-17th"}"><a class="${"anchor"}" href="${"#digital-mystikz---waterworks-festival-september-17th"}">Digital Mystikz - Waterworks Festival, September 17th</a></h2>
<p>This festival was all a bit up and down for me, my head just wasn\u2019t quite and some of the programming was a bit confusing. I actually messaged waterworks\u2019 Instagram account to complain about it like a fucking nerd; \u201CHello hello, only saying this as last year\u2019s festival was an absolute 10/10 for me and I hold it in such high regard, I\u2019m a little bit disappointed with the way that this year\u2019s set times are stacked up. I really loved how last year finished with a bunch of female DJs getting the stage-headline slot that they deserved and don\u2019t tend to get at other events (Josey Rebelle / Saoirse / Shanti Celeste), all of this year\u2019s stage headliners are male, and most of them are really big. But yeah I\u2019m still super super super excited for the festival and I get that there were probably outside influences to this, just wanted to say this in case anyone in the team is interested.\u201D</p>
<p>As we came to the end of the day, the problem for us wasn\u2019t just that the a lot of the headliners weren\u2019t particularly musically exciting for us, but the more interesting ones were just too rammed, we went from stage to stage to stage, no no no. Just when all was seemingly lost, we wandered over to the Siren stage (which last year had been an utter roadblock), and lo and behold, Digital Mystikz (the only non-white headliner) were playing to a nice comfy crowd with space to dance near the bass. They also had Sgt Pokes and Flowdan on the mics, the latter did a bit of Horror Show Style, mmmm baby I love that tune. Anyway at this point we had 45 minutes left of the festival, I ran to the bar to grab us some drinks, this process took longer than I\u2019d have liked but I got back with 35 minutes to spare.</p>
<p>\u201CThis is our last song!\u201D WHAT THE FUCK, oh god I do remember that a couple of the stages were finishing 30 mins early but I swear this wasn\u2019t one of them, agggggghhhh fuck no time for whinging, let\u2019s just enjoy this dirty stinking bass while we can. The track ends and cuts to silence. \u201CActually I don\u2019t think it\u2019s fair that we finish now, do you?\u201D The next track begins. They pranked us!!! Ahaha amazing, what a croc, now we can get back to being very excited and giddy and shaking our butts to a VIP remix of Coki\u2019s Night. \u201CLet\u2019s get emotional, guys\u2026 I know you\u2019re actually sweet, even when you got a screw face I know you don\u2019t mean it\u201D mate I may well get up onstage and give you a kiss if you keep going like this, you saved my life. Dubstep forever!</p>
<p><a href="${"http://google.com.au/"}" rel="${"nofollow"}"><img src="${"https://web.archive.org/web/20221110171515im_/https://loose-lips.co.uk/img/wysiwyg/634d5881bf12c.jpg"}"></a></p>`
  })}`;
});
var index$5 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _1010_dj_sets_that_i_was_too_tired_to_write_about_in_2022,
  metadata: metadata$2
});
const metadata$1 = {
  "layout": "blog",
  "title": "Elkka (live) @ Corsica Studios - 09/02/22",
  "slug": "elkka-live-at-corsica-studios-090222",
  "description": "This is Will's seventh post-lockdown gig review, as always he did not receive payment or press tickets for this, just went as a punter and felt like there was a story there. ",
  "author": "Will Soer",
  "date": "2021-09-01",
  "banner": "https://web.archive.org/web/20220218205113im_/https://loose-lips.co.uk/img/blog/620d4f6948465/620d4f6949320.jpg",
  "published": true,
  "tags": ["Event Review"]
};
const Elkka_live_at_corsica_studios_090222 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(BlogLayout, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign($$props, metadata$1), {}, {
    default: () => `<p><a href="${"http://google.com.au/"}" rel="${"nofollow"}"><img src="${"https://web.archive.org/web/20220218205113im_/https://loose-lips.co.uk/img/blog/620d4f6948465/620d4f6949320.jpg"}"></a></p>
<blockquote><p>This is Will\u2019s seventh post-lockdown gig review, as always he did not receive payment or press tickets for this, just went as a punter and felt like there was a story there. You can read his other ones here</p></blockquote>
<p>Elkka only played her first live (ie: non-DJ) gig in the summer of 2020. I caught the end of her set when she supported Jon Hopkins, Moderat and Max Cooper back in October, and thought it was awesome, the music was ecstatic and colourful, I preferred it to all the rest of the night\u2019s tunes. It felt right for 2021, all the tension and build up and excitement and complexity of these times. She had recently delivered a fantastic DJ mix for RA, telling them in the accompanying interview that \u2018I love both DJing and performing live but I think live shows are that bit more personal and vulnerable for me. I sing on some tracks here and there and that connects with people on a different level, I believe.\u2019 I really liked her Euphoric Melodies\xA0EP, and its follow-up\xA0Harmonic Frequencies, so when a headline gig at Corsica Studios came up I snatched up a couple of tickets. I invited my mate \u2018M\u2019 with whom I used to share a flat, both of us have taken on more time consuming jobs since then and have spent considerably less time mucking about in the kitchen or the dancefloor, so it seemed like a good time to catch back up.</p>
<p>Now the last time I went to Corsica Studios for a gig (as opposed to a 6am-finish clubnight), it was for Mansur Brown. It was an intimate, sold out gig like this one, with fans gathered in a tight cluster beneath the stage. We all love to feel close to the artist, but I often find tight crowds awkward and uncomfortable, that other kind of intimacy where you\u2019re packed up against people who are all looking out of the crowd and into something else, like you\u2019re queuing up for something. I also feel uncomfortable when my big head blocks someone else\u2019s view, especially as I really don\u2019t like having the back of someone\u2019s head up against my face either. That Mansur Brown gig was one of them, my gig buddy was super late, we were stood in a kind of bottleneck at the back of the room (which confusingly seemed to contain as many people as the main room itself). At these kinds of gigs it sometimes feels like you\u2019ve turned up to strengthen your bond to the artist, but you\u2019ll enjoy listening to the music more when you take it into a different setting, when you can sit down, go for a run, dance around in your room.</p>
<p>This is awkwardness can be exacerbated by the whole post-covid social awkwardness situation, and also by gigs that aren\u2019t visually engaging, when those little bits of perspective that you do get don\u2019t quite justify the squeeze of the crowd. The lead singer from Franz Ferdinand once commented on the acts popular whilst his band was coming up in the early 00s, how they wanted to bring some showmanship to a scene full of blokes standing at laptops, semi-motionless, watched by a motionless crowd. At their worst, live synthesizer gigs can be like watching someone playing video games without being able to see the screen. At their best they can be, well, they can be all sorts of things. Back in my first ever Loose Lips piece in 2018, I wrote that \u2018at their best, live electronic performances can help fans respect and explore the human musicianship that goes into making it.\u2019 I think what I was trying to say was that you can watch a human in a properly explorative, creative state, free to the tap directly into their own inspiration. A state where, as described by Ralph Waldo Emerson, \u2018the laws of the universe will appear less complex, and solitude will not be solitude.\u2019 These musical performances can channel the classic dance music emotions of excitement and tension, and other feelings too. Seeing someone press a switch and immediately feeling the music in their head flood into yours, that\u2019s another kind of intimacy.</p>
<p>But yeah, like I said I really didn\u2019t want to get bottlenecked again, especially as M is even taller than me, so I suggested we get to the gig really early, so early that even with M turning up 1 hour late it was still easy for us to nab a spot to the side of the space and near the front, where we could clearly see the gig without blocking anyone\u2019s view. I didn\u2019t mind M being late, he gave me enough warning that I was able to switch part of my journey from bus to walk, and enjoy listening to this amazing project (listen to it soon before it gets taken down!) that Benji B and Virgil Abloh put together their Virgil\u2019s last ever Louis Vuitton show, creatively directing a collaboration between Tyler the Creator, legendary Brazilian composer Arthur Verocai and the first ever all-BAME orchestra, the Chineke! Orchestra. It\u2019s amazing, I thoroughly recommend it, and it was a great thing to listen to before the absolutely total opposite was presented by Elkka, one vision presented by one woman with a set of machines and a microphone, set up on a stage about a foot or so above the ground.</p>
<p><a href="${"http://google.com.au/"}" rel="${"nofollow"}"><img src="${"https://web.archive.org/web/20220218205628im_/https://loose-lips.co.uk/img/wysiwyg/620d56ca675af.JPG"}"></a></p>
<p>It wasn\u2019t just Elkka\u2019s singing that made the show feel intimate, it was clear that she was actually feeling this music. It\u2019s not that she was dancing, so much as she was moving around the instruments and allowing the music to move through her. At one of my favourite moments she kind of looked like she was stood facing into gale force winds at a cliff\u2019s edge, staying connected to the synth by the tips of her fingers. The function of this music that she\u2019s aiming for very universal, music to heal to, music to re-energise you, memories of connection and burnt orange vibes to pull the sunshine into your lockdown bedroom and get you back on your feet. When I say that the show felt intimate, I don\u2019t mean it in the sense of a singer songwriter sharing personal experiences, it was intimate like the \u2018peace be with you\u2019 and touch of hands at church, mutual intimacy that gives both participants direction for their own private moments.\xA0</p>
<p>It\u2019s like how both of Elkka\u2019s EP cover artworks feature photos of her with her eyes closed, the focus is not just on her, but on the practice of getting close to own your essence. I could try and go into more of my memories of the gig, which tracks sounded best and the story of how I jussst missed out on a swig from the bottle of Tequila that she passed into the crowd, but it\u2019s not the story of the night that I particularly wanted to share in this review; I went to a gig, enjoyed it, had a little dance with a good friend of mine, got a McPlant with him at Waterloo afterwards and parted with a hearty hug, we both had a great time. The story that I found more interesting was the way that Elkka was able to deliver a performance that felt really pure and powerful and direct, the product of genuinely valuing the healing powers of music. As M once said to me, \u2018what I care about is the beat and what it does to me.\u2019 The gig was great, I\u2019m really excited to see what Elkka does next.\xA0</p>
<p><a href="${"http://google.com.au/"}" rel="${"nofollow"}"><img src="${"https://web.archive.org/web/20220219023454im_/https://loose-lips.co.uk/img/wysiwyg/620d56d7e64dd.JPG"}"></a></p>`
  })}`;
});
var index$4 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Elkka_live_at_corsica_studios_090222,
  metadata: metadata$1
});
const metadata = {
  "layout": "blog",
  "title": "sphie resuscitation kim-cosmik remix",
  "slug": "sphie-resuscitation-kim-cosmik-remix",
  "author": "Will Soer",
  "description": "Truly it was a great journey, and in it I met with many, whom to know was to love; but whom never could I see again; for life has not space enough; and each must do his duty to the security and well-being of the Redoubt.",
  "banner": "https://web.archive.org/web/20220403120820im_/https://loose-lips.co.uk/img/blog/62236a21df6f3/62236a21e07cc.jpg",
  "tags": ["Review"],
  "date": "2022-03-19",
  "published": true
};
const Sphie_resuscitation_kim_cosmik_remix = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(BlogLayout, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign($$props, metadata), {}, {
    default: () => `<p><a href="${"http://google.com.au/"}" rel="${"nofollow"}"><img src="${"https://web.archive.org/web/20220403120820im_/https://loose-lips.co.uk/img/blog/62236a21df6f3/62236a21e07cc.jpg"}"></a></p>
<p>Oooooh daym you do it well. This tune (available on bandcamp and soundcloud\xA0now) is simultaneously so\xA0rude and so inviting. I really don\u2019t like doing track or album reviews, I find them to be a really boring way of promoting music whilst simultaneously indulging in the fantasy that us music journalists have some kind of objective understanding of what\u2019s good. But this track is just perfect for me so I don\u2019t need to try and be objective, it\u2019s peak out of body pop, exactly the kind of thing I would play on my show, Kim Cosmik must have surely known this when she sent it to me (it\u2019s released on her label, Cybersoul).\xA0</p>
<p>It reminds me of early midtempo Electro classics like Cybotron\u2019s 1983 tune Clear, and yet it doesn\u2019t feel retro at all because the gritty RUDE beat is meshed into this web of utopian sass. It reminds me of a ridiculously good animated Netflix show called Arcane,\xA0it mixed elements of fantasy and steampunk, tracking the development of a very society whose sophisticated technology combines clockwork with intrinsically powerful materials. One character named Sevika has a bionic arm, containing a mechanism that pumps her veins with \u2018Shimmer\u2019, a translucent, radioactive liquid. Sevika is a villain in the show, but if she had a non-evil-twin sister who used shimmer to colour her hair and power her synthesizer, this would be the kind of music that she would make, designed to soundtrack illegal zeppelin raves. Exquisite.\xA0</p>
<p><a href="${"http://google.com.au/"}" rel="${"nofollow"}"><img src="${"https://web.archive.org/web/20220403120820im_/https://loose-lips.co.uk/img/wysiwyg/6246f1d6152a5.jpg"}"></a></p>`
  })}`;
});
var index$3 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Sphie_resuscitation_kim_cosmik_remix,
  metadata
});
const hydrate = dev;
const router = browser;
const prerender = true;
const Crew = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const metaData = {
    title: "Project | Sveltekit Blog",
    description: "Project page of Sveltekit blog starter project",
    url: "/projects",
    keywords: ["sveltekit", "sveltekit starter", "sveltekit starter about"],
    searchUrl: "/projects"
  };
  return `
${validate_component(HeadTags, "HeadTags").$$render($$result, { metaData }, {}, {})}



<div class="${"flex flex-col justify-center items-start max-w-2xl mx-auto mb-16"}"><h1 class="${"font-bold text-3xl md:text-5xl tracking-tight mb-4 dark:text-white"}">Coming soon... </h1></div>
`;
});
var index$2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Crew,
  hydrate,
  router,
  prerender
});
var __awaiter$1 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve2) {
      resolve2(value);
    });
  }
  return new (P || (P = Promise))(function(resolve2, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function load$1({ fetch: fetch2 }) {
  return __awaiter$1(this, void 0, void 0, function* () {
    return {
      props: {
        blogs: yield fetch2("/blog.json").then((res) => res.json())
      }
    };
  });
}
const Tags = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let tags;
  let metaData;
  let { blogs } = $$props;
  let listWithDuplicatetags = [];
  blogs.forEach((blog) => {
    listWithDuplicatetags = listWithDuplicatetags.length === 0 ? [...blog.tags] : [...listWithDuplicatetags, ...blog.tags];
  });
  if ($$props.blogs === void 0 && $$bindings.blogs && blogs !== void 0)
    $$bindings.blogs(blogs);
  tags = [...new Set(listWithDuplicatetags)];
  metaData = {
    title: "Tags | Sveltekit Blog",
    description: "Tags page of Sveltekit blog starter project",
    url: "/tags",
    keywords: [
      "sveltekit",
      "sveltekit starter",
      "sveltekit starter tags",
      "svelte starter tags",
      ...tags
    ],
    searchUrl: "/tags"
  };
  return `
${validate_component(HeadTags, "HeadTags").$$render($$result, { metaData }, {}, {})}



<div class="${"flex flex-col justify-center items-start max-w-2xl mx-auto mb-16"}"><h1 class="${"font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white"}">Tags </h1>
	<p class="${"text-gray-600 dark:text-gray-400 mb-4"}">There are ${escape(tags.length)} different tags to which the blogs belongs to. You can use the following tags to get the blogs/articles
		which belongs to them. These tags will help you find the articles easily if you know which tag they belongs to.
	</p>
	<div class="${"flex flex-row flex-wrap w-full mt-4 items-center"}">${each(tags, (tag, index2) => `<a sveltekit:prefetch${add_attribute("href", `/tags/${convertToSlug(tag)}`, 0)}${add_attribute("aria-label", tag, 0)} class="${"text-xs text-gray-400 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-500"}">${escape(tag.toUpperCase())}</a>
			${index2 !== tags.length - 1 ? `<p class="${"mr-2 ml-2 text-gray-500 dark:text-gray-50"}">${escape(` \u2022 `)}
				</p>` : ``}`)}</div></div>


`;
});
var index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Tags,
  load: load$1
});
const convertToSentence = (value) => `${value.charAt(0).toUpperCase()}${value.substr(1).toLocaleLowerCase().replace(/-/g, " ")}`;
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve2) {
      resolve2(value);
    });
  }
  return new (P || (P = Promise))(function(resolve2, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
function load({ page: page2, fetch: fetch2 }) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const blogsPromise = yield fetch2(`/blog.json`);
      const blogs = yield blogsPromise.json();
      const blogsByTag = blogs.filter((post) => !post.tags ? [] : new RegExp(post.tags.join("|"), "i").test(convertToSentence(page2.params.tag)));
      return {
        props: { blogs: blogsByTag, tag: page2.params.tag }
      };
    } catch (error2) {
      console.error(error2);
    }
  });
}
const U5Btagu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let readableTag;
  let filteredBlogPosts;
  let { blogs } = $$props;
  let { tag } = $$props;
  let metaData = {
    title: `${convertToSentence(tag)} | Sveltekit`,
    description: "Sveltekit starter project created with sveltekit, typescript, tailwindcss, postcss, husky, and storybook. The project has the structure set up for the scaleable project. (sveltekit, typescript, tailwindcss, postcss, husky, Storybook).",
    url: `/tags/${tag}`,
    keywords: ["sveltekit", "sveltekit starter", "sveltekit starter users", tag],
    searchUrl: `/tags/${tag}`
  };
  let searchValue2 = "";
  if ($$props.blogs === void 0 && $$bindings.blogs && blogs !== void 0)
    $$bindings.blogs(blogs);
  if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0)
    $$bindings.tag(tag);
  readableTag = convertToSentence(tag);
  filteredBlogPosts = blogs.sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date))).filter((blog) => blog.title.toLowerCase().includes(searchValue2.toLowerCase()));
  return `
${validate_component(HeadTags, "HeadTags").$$render($$result, { metaData }, {}, {})}



<div class="${"flex flex-col justify-center items-start max-w-2xl mx-auto mb-16"}"><h1 class="${"font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white"}">${escape(readableTag)}</h1>
	<p class="${"text-gray-600 dark:text-gray-400 mb-4"}">There ${escape(blogs.length > 1 ? `are ${blogs.length} articles` : `is ${blogs.length} article`)} that belongs to the tag
		${escape(readableTag)}. Articles which belongs only to the tag ${escape(readableTag)} will appear here. A particular article may belong
		to multiple tags. Use the search below to filter by title.
	</p>
	
	<div class="${"relative w-full mb-4"}"><input aria-label="${"Search articles"}" type="${"text"}" placeholder="${"Search articles"}" class="${"px-4 py-2 border border-gray-300 dark:border-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"}"${add_attribute("value", searchValue2, 0)}>
		<svg class="${"absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300"}" xmlns="${"http://www.w3.org/2000/svg"}" fill="${"none"}" viewBox="${"0 0 24 24"}" stroke="${"currentColor"}"><path stroke-linecap="${"round"}" stroke-linejoin="${"round"}"${add_attribute("stroke-width", 2, 0)} d="${"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"}"></path></svg></div>
	

	
	<h3 class="${"font-bold text-2xl md:text-4xl tracking-tight mb-4 mt-8 text-black dark:text-white"}">All Posts </h3>
	${filteredBlogPosts.length === 0 ? `<p class="${"text-gray-600 dark:text-gray-400 mb-4"}">No posts found. </p>` : `${each(filteredBlogPosts, (blog, index2) => `${validate_component(BlogPost, "BlogPost").$$render($$result, { blog }, {}, {})}`)}`}</div>


`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Btagu5D,
  load
});
export { init, render };
