(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.getQueryData = factory());
})(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function commonjsRequire (path) {
		throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global$O =
	  // eslint-disable-next-line es/no-global-this -- safe
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  // eslint-disable-next-line no-restricted-globals -- safe
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func -- fallback
	  (function () { return this; })() || Function('return this')();

	var objectGetOwnPropertyDescriptor = {};

	var fails$13 = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	var fails$12 = fails$13;

	// Detect IE8's incomplete defineProperty implementation
	var descriptors = !fails$12(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var objectPropertyIsEnumerable = {};

	var $propertyIsEnumerable$1 = {}.propertyIsEnumerable;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor$8 = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor$8 && !$propertyIsEnumerable$1.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
	objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor$8(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable$1;

	var createPropertyDescriptor$9 = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString$v = {}.toString;

	var classofRaw$1 = function (it) {
	  return toString$v.call(it).slice(8, -1);
	};

	var fails$11 = fails$13;
	var classof$d = classofRaw$1;

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails$11(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classof$d(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible$i = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings
	var IndexedObject$4 = indexedObject;
	var requireObjectCoercible$h = requireObjectCoercible$i;

	var toIndexedObject$d = function (it) {
	  return IndexedObject$4(requireObjectCoercible$h(it));
	};

	// `IsCallable` abstract operation
	// https://tc39.es/ecma262/#sec-iscallable
	var isCallable$u = function (argument) {
	  return typeof argument === 'function';
	};

	var isCallable$t = isCallable$u;

	var isObject$G = function (it) {
	  return typeof it === 'object' ? it !== null : isCallable$t(it);
	};

	var global$N = global$O;
	var isCallable$s = isCallable$u;

	var aFunction = function (argument) {
	  return isCallable$s(argument) ? argument : undefined;
	};

	var getBuiltIn$f = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(global$N[namespace]) : global$N[namespace] && global$N[namespace][method];
	};

	var getBuiltIn$e = getBuiltIn$f;

	var engineUserAgent = getBuiltIn$e('navigator', 'userAgent') || '';

	var global$M = global$O;
	var userAgent$7 = engineUserAgent;

	var process$4 = global$M.process;
	var Deno = global$M.Deno;
	var versions = process$4 && process$4.versions || Deno && Deno.version;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] < 4 ? 1 : match[0] + match[1];
	} else if (userAgent$7) {
	  match = userAgent$7.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = userAgent$7.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	/* eslint-disable es/no-symbol -- required for testing */

	var V8_VERSION$3 = engineV8Version;
	var fails$10 = fails$13;

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
	var nativeSymbol$1 = !!Object.getOwnPropertySymbols && !fails$10(function () {
	  var symbol = Symbol();
	  // Chrome 38 Symbol has incorrect toString conversion
	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
	  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
	    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	    !Symbol.sham && V8_VERSION$3 && V8_VERSION$3 < 41;
	});

	/* eslint-disable es/no-symbol -- required for testing */

	var NATIVE_SYMBOL$2 = nativeSymbol$1;

	var useSymbolAsUid = NATIVE_SYMBOL$2
	  && !Symbol.sham
	  && typeof Symbol.iterator == 'symbol';

	var isCallable$r = isCallable$u;
	var getBuiltIn$d = getBuiltIn$f;
	var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

	var isSymbol$9 = USE_SYMBOL_AS_UID$1 ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn$d('Symbol');
	  return isCallable$r($Symbol) && Object(it) instanceof $Symbol;
	};

	var tryToString$3 = function (argument) {
	  try {
	    return String(argument);
	  } catch (error) {
	    return 'Object';
	  }
	};

	var isCallable$q = isCallable$u;
	var tryToString$2 = tryToString$3;

	// `Assert: IsCallable(argument) is true`
	var aCallable$f = function (argument) {
	  if (isCallable$q(argument)) return argument;
	  throw TypeError(tryToString$2(argument) + ' is not a function');
	};

	var aCallable$e = aCallable$f;

	// `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod
	var getMethod$9 = function (V, P) {
	  var func = V[P];
	  return func == null ? undefined : aCallable$e(func);
	};

	var isCallable$p = isCallable$u;
	var isObject$F = isObject$G;

	// `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive
	var ordinaryToPrimitive$2 = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && isCallable$p(fn = input.toString) && !isObject$F(val = fn.call(input))) return val;
	  if (isCallable$p(fn = input.valueOf) && !isObject$F(val = fn.call(input))) return val;
	  if (pref !== 'string' && isCallable$p(fn = input.toString) && !isObject$F(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var shared$5 = {exports: {}};

	var isPure = false;

	var global$L = global$O;

	var setGlobal$3 = function (key, value) {
	  try {
	    // eslint-disable-next-line es/no-object-defineproperty -- safe
	    Object.defineProperty(global$L, key, { value: value, configurable: true, writable: true });
	  } catch (error) {
	    global$L[key] = value;
	  } return value;
	};

	var global$K = global$O;
	var setGlobal$2 = setGlobal$3;

	var SHARED = '__core-js_shared__';
	var store$3 = global$K[SHARED] || setGlobal$2(SHARED, {});

	var sharedStore = store$3;

	var store$2 = sharedStore;

	(shared$5.exports = function (key, value) {
	  return store$2[key] || (store$2[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.18.3',
	  mode: 'global',
	  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
	});

	var requireObjectCoercible$g = requireObjectCoercible$i;

	// `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject
	var toObject$q = function (argument) {
	  return Object(requireObjectCoercible$g(argument));
	};

	var toObject$p = toObject$q;

	var hasOwnProperty$b = {}.hasOwnProperty;

	// `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty
	var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty$b.call(toObject$p(it), key);
	};

	var id$2 = 0;
	var postfix = Math.random();

	var uid$5 = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id$2 + postfix).toString(36);
	};

	var global$J = global$O;
	var shared$4 = shared$5.exports;
	var hasOwn$l = hasOwnProperty_1;
	var uid$4 = uid$5;
	var NATIVE_SYMBOL$1 = nativeSymbol$1;
	var USE_SYMBOL_AS_UID = useSymbolAsUid;

	var WellKnownSymbolsStore$1 = shared$4('wks');
	var Symbol$9 = global$J.Symbol;
	var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$9 : Symbol$9 && Symbol$9.withoutSetter || uid$4;

	var wellKnownSymbol$x = function (name) {
	  if (!hasOwn$l(WellKnownSymbolsStore$1, name) || !(NATIVE_SYMBOL$1 || typeof WellKnownSymbolsStore$1[name] == 'string')) {
	    if (NATIVE_SYMBOL$1 && hasOwn$l(Symbol$9, name)) {
	      WellKnownSymbolsStore$1[name] = Symbol$9[name];
	    } else {
	      WellKnownSymbolsStore$1[name] = createWellKnownSymbol('Symbol.' + name);
	    }
	  } return WellKnownSymbolsStore$1[name];
	};

	var isObject$E = isObject$G;
	var isSymbol$8 = isSymbol$9;
	var getMethod$8 = getMethod$9;
	var ordinaryToPrimitive$1 = ordinaryToPrimitive$2;
	var wellKnownSymbol$w = wellKnownSymbol$x;

	var TO_PRIMITIVE$2 = wellKnownSymbol$w('toPrimitive');

	// `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive
	var toPrimitive$3 = function (input, pref) {
	  if (!isObject$E(input) || isSymbol$8(input)) return input;
	  var exoticToPrim = getMethod$8(input, TO_PRIMITIVE$2);
	  var result;
	  if (exoticToPrim) {
	    if (pref === undefined) pref = 'default';
	    result = exoticToPrim.call(input, pref);
	    if (!isObject$E(result) || isSymbol$8(result)) return result;
	    throw TypeError("Can't convert object to primitive value");
	  }
	  if (pref === undefined) pref = 'number';
	  return ordinaryToPrimitive$1(input, pref);
	};

	var toPrimitive$2 = toPrimitive$3;
	var isSymbol$7 = isSymbol$9;

	// `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey
	var toPropertyKey$8 = function (argument) {
	  var key = toPrimitive$2(argument, 'string');
	  return isSymbol$7(key) ? key : String(key);
	};

	var global$I = global$O;
	var isObject$D = isObject$G;

	var document$3 = global$I.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS$1 = isObject$D(document$3) && isObject$D(document$3.createElement);

	var documentCreateElement$2 = function (it) {
	  return EXISTS$1 ? document$3.createElement(it) : {};
	};

	var DESCRIPTORS$w = descriptors;
	var fails$$ = fails$13;
	var createElement$1 = documentCreateElement$2;

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !DESCRIPTORS$w && !fails$$(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
	  return Object.defineProperty(createElement$1('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var DESCRIPTORS$v = descriptors;
	var propertyIsEnumerableModule$2 = objectPropertyIsEnumerable;
	var createPropertyDescriptor$8 = createPropertyDescriptor$9;
	var toIndexedObject$c = toIndexedObject$d;
	var toPropertyKey$7 = toPropertyKey$8;
	var hasOwn$k = hasOwnProperty_1;
	var IE8_DOM_DEFINE$1 = ie8DomDefine;

	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	objectGetOwnPropertyDescriptor.f = DESCRIPTORS$v ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject$c(O);
	  P = toPropertyKey$7(P);
	  if (IE8_DOM_DEFINE$1) try {
	    return $getOwnPropertyDescriptor$1(O, P);
	  } catch (error) { /* empty */ }
	  if (hasOwn$k(O, P)) return createPropertyDescriptor$8(!propertyIsEnumerableModule$2.f.call(O, P), O[P]);
	};

	var objectDefineProperty = {};

	var isObject$C = isObject$G;

	// `Assert: Type(argument) is Object`
	var anObject$z = function (argument) {
	  if (isObject$C(argument)) return argument;
	  throw TypeError(String(argument) + ' is not an object');
	};

	var DESCRIPTORS$u = descriptors;
	var IE8_DOM_DEFINE = ie8DomDefine;
	var anObject$y = anObject$z;
	var toPropertyKey$6 = toPropertyKey$8;

	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var $defineProperty$1 = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	objectDefineProperty.f = DESCRIPTORS$u ? $defineProperty$1 : function defineProperty(O, P, Attributes) {
	  anObject$y(O);
	  P = toPropertyKey$6(P);
	  anObject$y(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return $defineProperty$1(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var DESCRIPTORS$t = descriptors;
	var definePropertyModule$c = objectDefineProperty;
	var createPropertyDescriptor$7 = createPropertyDescriptor$9;

	var createNonEnumerableProperty$d = DESCRIPTORS$t ? function (object, key, value) {
	  return definePropertyModule$c.f(object, key, createPropertyDescriptor$7(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var redefine$j = {exports: {}};

	var isCallable$o = isCallable$u;
	var store$1 = sharedStore;

	var functionToString = Function.toString;

	// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
	if (!isCallable$o(store$1.inspectSource)) {
	  store$1.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource$4 = store$1.inspectSource;

	var global$H = global$O;
	var isCallable$n = isCallable$u;
	var inspectSource$3 = inspectSource$4;

	var WeakMap$3 = global$H.WeakMap;

	var nativeWeakMap = isCallable$n(WeakMap$3) && /native code/.test(inspectSource$3(WeakMap$3));

	var shared$3 = shared$5.exports;
	var uid$3 = uid$5;

	var keys$7 = shared$3('keys');

	var sharedKey$4 = function (key) {
	  return keys$7[key] || (keys$7[key] = uid$3(key));
	};

	var hiddenKeys$6 = {};

	var NATIVE_WEAK_MAP$1 = nativeWeakMap;
	var global$G = global$O;
	var isObject$B = isObject$G;
	var createNonEnumerableProperty$c = createNonEnumerableProperty$d;
	var hasOwn$j = hasOwnProperty_1;
	var shared$2 = sharedStore;
	var sharedKey$3 = sharedKey$4;
	var hiddenKeys$5 = hiddenKeys$6;

	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var WeakMap$2 = global$G.WeakMap;
	var set$3, get$2, has;

	var enforce = function (it) {
	  return has(it) ? get$2(it) : set$3(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject$B(it) || (state = get$2(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (NATIVE_WEAK_MAP$1 || shared$2.state) {
	  var store = shared$2.state || (shared$2.state = new WeakMap$2());
	  var wmget = store.get;
	  var wmhas = store.has;
	  var wmset = store.set;
	  set$3 = function (it, metadata) {
	    if (wmhas.call(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    wmset.call(store, it, metadata);
	    return metadata;
	  };
	  get$2 = function (it) {
	    return wmget.call(store, it) || {};
	  };
	  has = function (it) {
	    return wmhas.call(store, it);
	  };
	} else {
	  var STATE = sharedKey$3('state');
	  hiddenKeys$5[STATE] = true;
	  set$3 = function (it, metadata) {
	    if (hasOwn$j(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty$c(it, STATE, metadata);
	    return metadata;
	  };
	  get$2 = function (it) {
	    return hasOwn$j(it, STATE) ? it[STATE] : {};
	  };
	  has = function (it) {
	    return hasOwn$j(it, STATE);
	  };
	}

	var internalState = {
	  set: set$3,
	  get: get$2,
	  has: has,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var DESCRIPTORS$s = descriptors;
	var hasOwn$i = hasOwnProperty_1;

	var FunctionPrototype$2 = Function.prototype;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getDescriptor = DESCRIPTORS$s && Object.getOwnPropertyDescriptor;

	var EXISTS = hasOwn$i(FunctionPrototype$2, 'name');
	// additional protection from minified / mangled / dropped function names
	var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
	var CONFIGURABLE = EXISTS && (!DESCRIPTORS$s || (DESCRIPTORS$s && getDescriptor(FunctionPrototype$2, 'name').configurable));

	var functionName = {
	  EXISTS: EXISTS,
	  PROPER: PROPER,
	  CONFIGURABLE: CONFIGURABLE
	};

	var global$F = global$O;
	var isCallable$m = isCallable$u;
	var hasOwn$h = hasOwnProperty_1;
	var createNonEnumerableProperty$b = createNonEnumerableProperty$d;
	var setGlobal$1 = setGlobal$3;
	var inspectSource$2 = inspectSource$4;
	var InternalStateModule$b = internalState;
	var CONFIGURABLE_FUNCTION_NAME$2 = functionName.CONFIGURABLE;

	var getInternalState$a = InternalStateModule$b.get;
	var enforceInternalState$1 = InternalStateModule$b.enforce;
	var TEMPLATE = String(String).split('String');

	(redefine$j.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  var name = options && options.name !== undefined ? options.name : key;
	  var state;
	  if (isCallable$m(value)) {
	    if (String(name).slice(0, 7) === 'Symbol(') {
	      name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
	    }
	    if (!hasOwn$h(value, 'name') || (CONFIGURABLE_FUNCTION_NAME$2 && value.name !== name)) {
	      createNonEnumerableProperty$b(value, 'name', name);
	    }
	    state = enforceInternalState$1(value);
	    if (!state.source) {
	      state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
	    }
	  }
	  if (O === global$F) {
	    if (simple) O[key] = value;
	    else setGlobal$1(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }
	  if (simple) O[key] = value;
	  else createNonEnumerableProperty$b(O, key, value);
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return isCallable$m(this) && getInternalState$a(this).source || inspectSource$2(this);
	});

	var objectGetOwnPropertyNames = {};

	var ceil$2 = Math.ceil;
	var floor$a = Math.floor;

	// `ToIntegerOrInfinity` abstract operation
	// https://tc39.es/ecma262/#sec-tointegerorinfinity
	var toIntegerOrInfinity$h = function (argument) {
	  var number = +argument;
	  // eslint-disable-next-line no-self-compare -- safe
	  return number !== number || number === 0 ? 0 : (number > 0 ? floor$a : ceil$2)(number);
	};

	var toIntegerOrInfinity$g = toIntegerOrInfinity$h;

	var max$5 = Math.max;
	var min$9 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex$8 = function (index, length) {
	  var integer = toIntegerOrInfinity$g(index);
	  return integer < 0 ? max$5(integer + length, 0) : min$9(integer, length);
	};

	var toIntegerOrInfinity$f = toIntegerOrInfinity$h;

	var min$8 = Math.min;

	// `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength
	var toLength$d = function (argument) {
	  return argument > 0 ? min$8(toIntegerOrInfinity$f(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var toLength$c = toLength$d;

	// `LengthOfArrayLike` abstract operation
	// https://tc39.es/ecma262/#sec-lengthofarraylike
	var lengthOfArrayLike$l = function (obj) {
	  return toLength$c(obj.length);
	};

	var toIndexedObject$b = toIndexedObject$d;
	var toAbsoluteIndex$7 = toAbsoluteIndex$8;
	var lengthOfArrayLike$k = lengthOfArrayLike$l;

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod$6 = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject$b($this);
	    var length = lengthOfArrayLike$k(O);
	    var index = toAbsoluteIndex$7(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare -- NaN check
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.es/ecma262/#sec-array.prototype.includes
	  includes: createMethod$6(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod$6(false)
	};

	var hasOwn$g = hasOwnProperty_1;
	var toIndexedObject$a = toIndexedObject$d;
	var indexOf = arrayIncludes.indexOf;
	var hiddenKeys$4 = hiddenKeys$6;

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject$a(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !hasOwn$g(hiddenKeys$4, key) && hasOwn$g(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (hasOwn$g(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys$3 = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	var internalObjectKeys$1 = objectKeysInternal;
	var enumBugKeys$2 = enumBugKeys$3;

	var hiddenKeys$3 = enumBugKeys$2.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	// eslint-disable-next-line es/no-object-getownpropertynames -- safe
	objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return internalObjectKeys$1(O, hiddenKeys$3);
	};

	var objectGetOwnPropertySymbols = {};

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
	objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

	var getBuiltIn$c = getBuiltIn$f;
	var getOwnPropertyNamesModule$2 = objectGetOwnPropertyNames;
	var getOwnPropertySymbolsModule$2 = objectGetOwnPropertySymbols;
	var anObject$x = anObject$z;

	// all object keys, includes non-enumerable and symbols
	var ownKeys$3 = getBuiltIn$c('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = getOwnPropertyNamesModule$2.f(anObject$x(it));
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule$2.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var hasOwn$f = hasOwnProperty_1;
	var ownKeys$2 = ownKeys$3;
	var getOwnPropertyDescriptorModule$6 = objectGetOwnPropertyDescriptor;
	var definePropertyModule$b = objectDefineProperty;

	var copyConstructorProperties$3 = function (target, source) {
	  var keys = ownKeys$2(source);
	  var defineProperty = definePropertyModule$b.f;
	  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule$6.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!hasOwn$f(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var fails$_ = fails$13;
	var isCallable$l = isCallable$u;

	var replacement = /#|\.prototype\./;

	var isForced$5 = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : isCallable$l(detection) ? fails$_(detection)
	    : !!detection;
	};

	var normalize = isForced$5.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced$5.data = {};
	var NATIVE = isForced$5.NATIVE = 'N';
	var POLYFILL = isForced$5.POLYFILL = 'P';

	var isForced_1 = isForced$5;

	var global$E = global$O;
	var getOwnPropertyDescriptor$7 = objectGetOwnPropertyDescriptor.f;
	var createNonEnumerableProperty$a = createNonEnumerableProperty$d;
	var redefine$i = redefine$j.exports;
	var setGlobal = setGlobal$3;
	var copyConstructorProperties$2 = copyConstructorProperties$3;
	var isForced$4 = isForced_1;

	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	  options.name        - the .name of the function if it does not match the key
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global$E;
	  } else if (STATIC) {
	    target = global$E[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global$E[TARGET] || {}).prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$7(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced$4(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties$2(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty$a(sourceProperty, 'sham', true);
	    }
	    // extend global
	    redefine$i(target, key, sourceProperty, options);
	  }
	};

	var classof$c = classofRaw$1;

	// `IsArray` abstract operation
	// https://tc39.es/ecma262/#sec-isarray
	// eslint-disable-next-line es/no-array-isarray -- safe
	var isArray$g = Array.isArray || function isArray(argument) {
	  return classof$c(argument) == 'Array';
	};

	var wellKnownSymbol$v = wellKnownSymbol$x;

	var TO_STRING_TAG$4 = wellKnownSymbol$v('toStringTag');
	var test$2 = {};

	test$2[TO_STRING_TAG$4] = 'z';

	var toStringTagSupport = String(test$2) === '[object z]';

	var TO_STRING_TAG_SUPPORT$2 = toStringTagSupport;
	var isCallable$k = isCallable$u;
	var classofRaw = classofRaw$1;
	var wellKnownSymbol$u = wellKnownSymbol$x;

	var TO_STRING_TAG$3 = wellKnownSymbol$u('toStringTag');
	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof$b = TO_STRING_TAG_SUPPORT$2 ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$3)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) == 'Object' && isCallable$k(O.callee) ? 'Arguments' : result;
	};

	var classof$a = classof$b;

	var toString$u = function (argument) {
	  if (classof$a(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
	  return String(argument);
	};

	var internalObjectKeys = objectKeysInternal;
	var enumBugKeys$1 = enumBugKeys$3;

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	// eslint-disable-next-line es/no-object-keys -- safe
	var objectKeys$4 = Object.keys || function keys(O) {
	  return internalObjectKeys(O, enumBugKeys$1);
	};

	var DESCRIPTORS$r = descriptors;
	var definePropertyModule$a = objectDefineProperty;
	var anObject$w = anObject$z;
	var objectKeys$3 = objectKeys$4;

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe
	var objectDefineProperties = DESCRIPTORS$r ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject$w(O);
	  var keys = objectKeys$3(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) definePropertyModule$a.f(O, key = keys[index++], Properties[key]);
	  return O;
	};

	var getBuiltIn$b = getBuiltIn$f;

	var html$2 = getBuiltIn$b('document', 'documentElement');

	/* global ActiveXObject -- old IE, WSH */

	var anObject$v = anObject$z;
	var defineProperties$2 = objectDefineProperties;
	var enumBugKeys = enumBugKeys$3;
	var hiddenKeys$2 = hiddenKeys$6;
	var html$1 = html$2;
	var documentCreateElement$1 = documentCreateElement$2;
	var sharedKey$2 = sharedKey$4;

	var GT = '>';
	var LT = '<';
	var PROTOTYPE$2 = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO$1 = sharedKey$2('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement$1('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html$1.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    activeXDocument = new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = typeof document != 'undefined'
	    ? document.domain && activeXDocument
	      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
	      : NullProtoObjectViaIFrame()
	    : NullProtoObjectViaActiveX(activeXDocument); // WSH
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE$2][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys$2[IE_PROTO$1] = true;

	// `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create
	var objectCreate$1 = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE$2] = anObject$v(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE$2] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO$1] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : defineProperties$2(result, Properties);
	};

	var objectGetOwnPropertyNamesExternal = {};

	/* eslint-disable es/no-object-getownpropertynames -- safe */

	var toIndexedObject$9 = toIndexedObject$d;
	var $getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;

	var toString$t = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return $getOwnPropertyNames$1(it);
	  } catch (error) {
	    return windowNames.slice();
	  }
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	objectGetOwnPropertyNamesExternal.f = function getOwnPropertyNames(it) {
	  return windowNames && toString$t.call(it) == '[object Window]'
	    ? getWindowNames(it)
	    : $getOwnPropertyNames$1(toIndexedObject$9(it));
	};

	var wellKnownSymbolWrapped = {};

	var wellKnownSymbol$t = wellKnownSymbol$x;

	wellKnownSymbolWrapped.f = wellKnownSymbol$t;

	var global$D = global$O;

	var path$1 = global$D;

	var path = path$1;
	var hasOwn$e = hasOwnProperty_1;
	var wrappedWellKnownSymbolModule$1 = wellKnownSymbolWrapped;
	var defineProperty$f = objectDefineProperty.f;

	var defineWellKnownSymbol$e = function (NAME) {
	  var Symbol = path.Symbol || (path.Symbol = {});
	  if (!hasOwn$e(Symbol, NAME)) defineProperty$f(Symbol, NAME, {
	    value: wrappedWellKnownSymbolModule$1.f(NAME)
	  });
	};

	var defineProperty$e = objectDefineProperty.f;
	var hasOwn$d = hasOwnProperty_1;
	var wellKnownSymbol$s = wellKnownSymbol$x;

	var TO_STRING_TAG$2 = wellKnownSymbol$s('toStringTag');

	var setToStringTag$b = function (it, TAG, STATIC) {
	  if (it && !hasOwn$d(it = STATIC ? it : it.prototype, TO_STRING_TAG$2)) {
	    defineProperty$e(it, TO_STRING_TAG$2, { configurable: true, value: TAG });
	  }
	};

	var aCallable$d = aCallable$f;

	// optional / simple context binding
	var functionBindContext = function (fn, that, length) {
	  aCallable$d(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 0: return function () {
	      return fn.call(that);
	    };
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var fails$Z = fails$13;
	var isCallable$j = isCallable$u;
	var classof$9 = classof$b;
	var getBuiltIn$a = getBuiltIn$f;
	var inspectSource$1 = inspectSource$4;

	var empty = [];
	var construct$1 = getBuiltIn$a('Reflect', 'construct');
	var constructorRegExp = /^\s*(?:class|function)\b/;
	var exec$1 = constructorRegExp.exec;
	var INCORRECT_TO_STRING = !constructorRegExp.exec(function () { /* empty */ });

	var isConstructorModern = function (argument) {
	  if (!isCallable$j(argument)) return false;
	  try {
	    construct$1(Object, empty, argument);
	    return true;
	  } catch (error) {
	    return false;
	  }
	};

	var isConstructorLegacy = function (argument) {
	  if (!isCallable$j(argument)) return false;
	  switch (classof$9(argument)) {
	    case 'AsyncFunction':
	    case 'GeneratorFunction':
	    case 'AsyncGeneratorFunction': return false;
	    // we can't check .prototype since constructors produced by .bind haven't it
	  } return INCORRECT_TO_STRING || !!exec$1.call(constructorRegExp, inspectSource$1(argument));
	};

	// `IsConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-isconstructor
	var isConstructor$5 = !construct$1 || fails$Z(function () {
	  var called;
	  return isConstructorModern(isConstructorModern.call)
	    || !isConstructorModern(Object)
	    || !isConstructorModern(function () { called = true; })
	    || called;
	}) ? isConstructorLegacy : isConstructorModern;

	var isArray$f = isArray$g;
	var isConstructor$4 = isConstructor$5;
	var isObject$A = isObject$G;
	var wellKnownSymbol$r = wellKnownSymbol$x;

	var SPECIES$6 = wellKnownSymbol$r('species');

	// a part of `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	var arraySpeciesConstructor$1 = function (originalArray) {
	  var C;
	  if (isArray$f(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (isConstructor$4(C) && (C === Array || isArray$f(C.prototype))) C = undefined;
	    else if (isObject$A(C)) {
	      C = C[SPECIES$6];
	      if (C === null) C = undefined;
	    }
	  } return C === undefined ? Array : C;
	};

	var arraySpeciesConstructor = arraySpeciesConstructor$1;

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate$5 = function (originalArray, length) {
	  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
	};

	var bind$a = functionBindContext;
	var IndexedObject$3 = indexedObject;
	var toObject$o = toObject$q;
	var lengthOfArrayLike$j = lengthOfArrayLike$l;
	var arraySpeciesCreate$4 = arraySpeciesCreate$5;

	var push$1 = [].push;

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
	var createMethod$5 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var IS_FILTER_REJECT = TYPE == 7;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject$o($this);
	    var self = IndexedObject$3(O);
	    var boundFunction = bind$a(callbackfn, that, 3);
	    var length = lengthOfArrayLike$j(self);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate$4;
	    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push$1.call(target, value); // filter
	        } else switch (TYPE) {
	          case 4: return false;             // every
	          case 7: push$1.call(target, value); // filterReject
	        }
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.es/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$5(0),
	  // `Array.prototype.map` method
	  // https://tc39.es/ecma262/#sec-array.prototype.map
	  map: createMethod$5(1),
	  // `Array.prototype.filter` method
	  // https://tc39.es/ecma262/#sec-array.prototype.filter
	  filter: createMethod$5(2),
	  // `Array.prototype.some` method
	  // https://tc39.es/ecma262/#sec-array.prototype.some
	  some: createMethod$5(3),
	  // `Array.prototype.every` method
	  // https://tc39.es/ecma262/#sec-array.prototype.every
	  every: createMethod$5(4),
	  // `Array.prototype.find` method
	  // https://tc39.es/ecma262/#sec-array.prototype.find
	  find: createMethod$5(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$5(6),
	  // `Array.prototype.filterReject` method
	  // https://github.com/tc39/proposal-array-filtering
	  filterReject: createMethod$5(7)
	};

	var $$2t = _export;
	var global$C = global$O;
	var getBuiltIn$9 = getBuiltIn$f;
	var DESCRIPTORS$q = descriptors;
	var NATIVE_SYMBOL = nativeSymbol$1;
	var fails$Y = fails$13;
	var hasOwn$c = hasOwnProperty_1;
	var isArray$e = isArray$g;
	var isCallable$i = isCallable$u;
	var isObject$z = isObject$G;
	var isSymbol$6 = isSymbol$9;
	var anObject$u = anObject$z;
	var toObject$n = toObject$q;
	var toIndexedObject$8 = toIndexedObject$d;
	var toPropertyKey$5 = toPropertyKey$8;
	var $toString$3 = toString$u;
	var createPropertyDescriptor$6 = createPropertyDescriptor$9;
	var nativeObjectCreate = objectCreate$1;
	var objectKeys$2 = objectKeys$4;
	var getOwnPropertyNamesModule$1 = objectGetOwnPropertyNames;
	var getOwnPropertyNamesExternal = objectGetOwnPropertyNamesExternal;
	var getOwnPropertySymbolsModule$1 = objectGetOwnPropertySymbols;
	var getOwnPropertyDescriptorModule$5 = objectGetOwnPropertyDescriptor;
	var definePropertyModule$9 = objectDefineProperty;
	var propertyIsEnumerableModule$1 = objectPropertyIsEnumerable;
	var redefine$h = redefine$j.exports;
	var shared$1 = shared$5.exports;
	var sharedKey$1 = sharedKey$4;
	var hiddenKeys$1 = hiddenKeys$6;
	var uid$2 = uid$5;
	var wellKnownSymbol$q = wellKnownSymbol$x;
	var wrappedWellKnownSymbolModule = wellKnownSymbolWrapped;
	var defineWellKnownSymbol$d = defineWellKnownSymbol$e;
	var setToStringTag$a = setToStringTag$b;
	var InternalStateModule$a = internalState;
	var $forEach$2 = arrayIteration.forEach;

	var HIDDEN = sharedKey$1('hidden');
	var SYMBOL = 'Symbol';
	var PROTOTYPE$1 = 'prototype';
	var TO_PRIMITIVE$1 = wellKnownSymbol$q('toPrimitive');
	var setInternalState$a = InternalStateModule$a.set;
	var getInternalState$9 = InternalStateModule$a.getterFor(SYMBOL);
	var ObjectPrototype$3 = Object[PROTOTYPE$1];
	var $Symbol = global$C.Symbol;
	var $stringify$1 = getBuiltIn$9('JSON', 'stringify');
	var nativeGetOwnPropertyDescriptor$2 = getOwnPropertyDescriptorModule$5.f;
	var nativeDefineProperty$1 = definePropertyModule$9.f;
	var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
	var nativePropertyIsEnumerable = propertyIsEnumerableModule$1.f;
	var AllSymbols = shared$1('symbols');
	var ObjectPrototypeSymbols = shared$1('op-symbols');
	var StringToSymbolRegistry = shared$1('string-to-symbol-registry');
	var SymbolToStringRegistry = shared$1('symbol-to-string-registry');
	var WellKnownSymbolsStore = shared$1('wks');
	var QObject = global$C.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDescriptor = DESCRIPTORS$q && fails$Y(function () {
	  return nativeObjectCreate(nativeDefineProperty$1({}, 'a', {
	    get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (O, P, Attributes) {
	  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$2(ObjectPrototype$3, P);
	  if (ObjectPrototypeDescriptor) delete ObjectPrototype$3[P];
	  nativeDefineProperty$1(O, P, Attributes);
	  if (ObjectPrototypeDescriptor && O !== ObjectPrototype$3) {
	    nativeDefineProperty$1(ObjectPrototype$3, P, ObjectPrototypeDescriptor);
	  }
	} : nativeDefineProperty$1;

	var wrap$1 = function (tag, description) {
	  var symbol = AllSymbols[tag] = nativeObjectCreate($Symbol[PROTOTYPE$1]);
	  setInternalState$a(symbol, {
	    type: SYMBOL,
	    tag: tag,
	    description: description
	  });
	  if (!DESCRIPTORS$q) symbol.description = description;
	  return symbol;
	};

	var $defineProperty = function defineProperty(O, P, Attributes) {
	  if (O === ObjectPrototype$3) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
	  anObject$u(O);
	  var key = toPropertyKey$5(P);
	  anObject$u(Attributes);
	  if (hasOwn$c(AllSymbols, key)) {
	    if (!Attributes.enumerable) {
	      if (!hasOwn$c(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor$6(1, {}));
	      O[HIDDEN][key] = true;
	    } else {
	      if (hasOwn$c(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
	      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor$6(0, false) });
	    } return setSymbolDescriptor(O, key, Attributes);
	  } return nativeDefineProperty$1(O, key, Attributes);
	};

	var $defineProperties = function defineProperties(O, Properties) {
	  anObject$u(O);
	  var properties = toIndexedObject$8(Properties);
	  var keys = objectKeys$2(properties).concat($getOwnPropertySymbols(properties));
	  $forEach$2(keys, function (key) {
	    if (!DESCRIPTORS$q || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
	  });
	  return O;
	};

	var $create = function create(O, Properties) {
	  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
	};

	var $propertyIsEnumerable = function propertyIsEnumerable(V) {
	  var P = toPropertyKey$5(V);
	  var enumerable = nativePropertyIsEnumerable.call(this, P);
	  if (this === ObjectPrototype$3 && hasOwn$c(AllSymbols, P) && !hasOwn$c(ObjectPrototypeSymbols, P)) return false;
	  return enumerable || !hasOwn$c(this, P) || !hasOwn$c(AllSymbols, P) || hasOwn$c(this, HIDDEN) && this[HIDDEN][P]
	    ? enumerable : true;
	};

	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
	  var it = toIndexedObject$8(O);
	  var key = toPropertyKey$5(P);
	  if (it === ObjectPrototype$3 && hasOwn$c(AllSymbols, key) && !hasOwn$c(ObjectPrototypeSymbols, key)) return;
	  var descriptor = nativeGetOwnPropertyDescriptor$2(it, key);
	  if (descriptor && hasOwn$c(AllSymbols, key) && !(hasOwn$c(it, HIDDEN) && it[HIDDEN][key])) {
	    descriptor.enumerable = true;
	  }
	  return descriptor;
	};

	var $getOwnPropertyNames = function getOwnPropertyNames(O) {
	  var names = nativeGetOwnPropertyNames(toIndexedObject$8(O));
	  var result = [];
	  $forEach$2(names, function (key) {
	    if (!hasOwn$c(AllSymbols, key) && !hasOwn$c(hiddenKeys$1, key)) result.push(key);
	  });
	  return result;
	};

	var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
	  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$3;
	  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject$8(O));
	  var result = [];
	  $forEach$2(names, function (key) {
	    if (hasOwn$c(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwn$c(ObjectPrototype$3, key))) {
	      result.push(AllSymbols[key]);
	    }
	  });
	  return result;
	};

	// `Symbol` constructor
	// https://tc39.es/ecma262/#sec-symbol-constructor
	if (!NATIVE_SYMBOL) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
	    var description = !arguments.length || arguments[0] === undefined ? undefined : $toString$3(arguments[0]);
	    var tag = uid$2(description);
	    var setter = function (value) {
	      if (this === ObjectPrototype$3) setter.call(ObjectPrototypeSymbols, value);
	      if (hasOwn$c(this, HIDDEN) && hasOwn$c(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDescriptor(this, tag, createPropertyDescriptor$6(1, value));
	    };
	    if (DESCRIPTORS$q && USE_SETTER) setSymbolDescriptor(ObjectPrototype$3, tag, { configurable: true, set: setter });
	    return wrap$1(tag, description);
	  };

	  redefine$h($Symbol[PROTOTYPE$1], 'toString', function toString() {
	    return getInternalState$9(this).tag;
	  });

	  redefine$h($Symbol, 'withoutSetter', function (description) {
	    return wrap$1(uid$2(description), description);
	  });

	  propertyIsEnumerableModule$1.f = $propertyIsEnumerable;
	  definePropertyModule$9.f = $defineProperty;
	  getOwnPropertyDescriptorModule$5.f = $getOwnPropertyDescriptor;
	  getOwnPropertyNamesModule$1.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
	  getOwnPropertySymbolsModule$1.f = $getOwnPropertySymbols;

	  wrappedWellKnownSymbolModule.f = function (name) {
	    return wrap$1(wellKnownSymbol$q(name), name);
	  };

	  if (DESCRIPTORS$q) {
	    // https://github.com/tc39/proposal-Symbol-description
	    nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
	      configurable: true,
	      get: function description() {
	        return getInternalState$9(this).description;
	      }
	    });
	    {
	      redefine$h(ObjectPrototype$3, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
	    }
	  }
	}

	$$2t({ global: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
	  Symbol: $Symbol
	});

	$forEach$2(objectKeys$2(WellKnownSymbolsStore), function (name) {
	  defineWellKnownSymbol$d(name);
	});

	$$2t({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
	  // `Symbol.for` method
	  // https://tc39.es/ecma262/#sec-symbol.for
	  'for': function (key) {
	    var string = $toString$3(key);
	    if (hasOwn$c(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
	    var symbol = $Symbol(string);
	    StringToSymbolRegistry[string] = symbol;
	    SymbolToStringRegistry[symbol] = string;
	    return symbol;
	  },
	  // `Symbol.keyFor` method
	  // https://tc39.es/ecma262/#sec-symbol.keyfor
	  keyFor: function keyFor(sym) {
	    if (!isSymbol$6(sym)) throw TypeError(sym + ' is not a symbol');
	    if (hasOwn$c(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
	  },
	  useSetter: function () { USE_SETTER = true; },
	  useSimple: function () { USE_SETTER = false; }
	});

	$$2t({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS$q }, {
	  // `Object.create` method
	  // https://tc39.es/ecma262/#sec-object.create
	  create: $create,
	  // `Object.defineProperty` method
	  // https://tc39.es/ecma262/#sec-object.defineproperty
	  defineProperty: $defineProperty,
	  // `Object.defineProperties` method
	  // https://tc39.es/ecma262/#sec-object.defineproperties
	  defineProperties: $defineProperties,
	  // `Object.getOwnPropertyDescriptor` method
	  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
	});

	$$2t({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
	  // `Object.getOwnPropertyNames` method
	  // https://tc39.es/ecma262/#sec-object.getownpropertynames
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // `Object.getOwnPropertySymbols` method
	  // https://tc39.es/ecma262/#sec-object.getownpropertysymbols
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	$$2t({ target: 'Object', stat: true, forced: fails$Y(function () { getOwnPropertySymbolsModule$1.f(1); }) }, {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    return getOwnPropertySymbolsModule$1.f(toObject$n(it));
	  }
	});

	// `JSON.stringify` method behavior with symbols
	// https://tc39.es/ecma262/#sec-json.stringify
	if ($stringify$1) {
	  var FORCED_JSON_STRINGIFY = !NATIVE_SYMBOL || fails$Y(function () {
	    var symbol = $Symbol();
	    // MS Edge converts symbol values to JSON as {}
	    return $stringify$1([symbol]) != '[null]'
	      // WebKit converts symbol values to JSON as null
	      || $stringify$1({ a: symbol }) != '{}'
	      // V8 throws on boxed symbols
	      || $stringify$1(Object(symbol)) != '{}';
	  });

	  $$2t({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
	    // eslint-disable-next-line no-unused-vars -- required for `.length`
	    stringify: function stringify(it, replacer, space) {
	      var args = [it];
	      var index = 1;
	      var $replacer;
	      while (arguments.length > index) args.push(arguments[index++]);
	      $replacer = replacer;
	      if (!isObject$z(replacer) && it === undefined || isSymbol$6(it)) return; // IE8 returns string on undefined
	      if (!isArray$e(replacer)) replacer = function (key, value) {
	        if (isCallable$i($replacer)) value = $replacer.call(this, key, value);
	        if (!isSymbol$6(value)) return value;
	      };
	      args[1] = replacer;
	      return $stringify$1.apply(null, args);
	    }
	  });
	}

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
	if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE$1]) {
	  var valueOf$1 = $Symbol[PROTOTYPE$1].valueOf;
	  redefine$h($Symbol[PROTOTYPE$1], TO_PRIMITIVE$1, function () {
	    return valueOf$1.apply(this, arguments);
	  });
	}
	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag$a($Symbol, SYMBOL);

	hiddenKeys$1[HIDDEN] = true;

	var $$2s = _export;
	var DESCRIPTORS$p = descriptors;
	var global$B = global$O;
	var hasOwn$b = hasOwnProperty_1;
	var isCallable$h = isCallable$u;
	var isObject$y = isObject$G;
	var defineProperty$d = objectDefineProperty.f;
	var copyConstructorProperties$1 = copyConstructorProperties$3;

	var NativeSymbol = global$B.Symbol;

	if (DESCRIPTORS$p && isCallable$h(NativeSymbol) && (!('description' in NativeSymbol.prototype) ||
	  // Safari 12 bug
	  NativeSymbol().description !== undefined
	)) {
	  var EmptyStringDescriptionStore = {};
	  // wrap Symbol constructor for correct work with undefined description
	  var SymbolWrapper = function Symbol() {
	    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
	    var result = this instanceof SymbolWrapper
	      ? new NativeSymbol(description)
	      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
	      : description === undefined ? NativeSymbol() : NativeSymbol(description);
	    if (description === '') EmptyStringDescriptionStore[result] = true;
	    return result;
	  };
	  copyConstructorProperties$1(SymbolWrapper, NativeSymbol);
	  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
	  symbolPrototype.constructor = SymbolWrapper;

	  var symbolToString$1 = symbolPrototype.toString;
	  var nativeSymbol = String(NativeSymbol('test')) == 'Symbol(test)';
	  var regexp = /^Symbol\((.*)\)[^)]+$/;
	  defineProperty$d(symbolPrototype, 'description', {
	    configurable: true,
	    get: function description() {
	      var symbol = isObject$y(this) ? this.valueOf() : this;
	      var string = symbolToString$1.call(symbol);
	      if (hasOwn$b(EmptyStringDescriptionStore, symbol)) return '';
	      var desc = nativeSymbol ? string.slice(7, -1) : string.replace(regexp, '$1');
	      return desc === '' ? undefined : desc;
	    }
	  });

	  $$2s({ global: true, forced: true }, {
	    Symbol: SymbolWrapper
	  });
	}

	var defineWellKnownSymbol$c = defineWellKnownSymbol$e;

	// `Symbol.asyncIterator` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.asynciterator
	defineWellKnownSymbol$c('asyncIterator');

	var defineWellKnownSymbol$b = defineWellKnownSymbol$e;

	// `Symbol.hasInstance` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.hasinstance
	defineWellKnownSymbol$b('hasInstance');

	var defineWellKnownSymbol$a = defineWellKnownSymbol$e;

	// `Symbol.isConcatSpreadable` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.isconcatspreadable
	defineWellKnownSymbol$a('isConcatSpreadable');

	var defineWellKnownSymbol$9 = defineWellKnownSymbol$e;

	// `Symbol.iterator` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.iterator
	defineWellKnownSymbol$9('iterator');

	var defineWellKnownSymbol$8 = defineWellKnownSymbol$e;

	// `Symbol.match` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.match
	defineWellKnownSymbol$8('match');

	var defineWellKnownSymbol$7 = defineWellKnownSymbol$e;

	// `Symbol.matchAll` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.matchall
	defineWellKnownSymbol$7('matchAll');

	var defineWellKnownSymbol$6 = defineWellKnownSymbol$e;

	// `Symbol.replace` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.replace
	defineWellKnownSymbol$6('replace');

	var defineWellKnownSymbol$5 = defineWellKnownSymbol$e;

	// `Symbol.search` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.search
	defineWellKnownSymbol$5('search');

	var defineWellKnownSymbol$4 = defineWellKnownSymbol$e;

	// `Symbol.species` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.species
	defineWellKnownSymbol$4('species');

	var defineWellKnownSymbol$3 = defineWellKnownSymbol$e;

	// `Symbol.split` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.split
	defineWellKnownSymbol$3('split');

	var defineWellKnownSymbol$2 = defineWellKnownSymbol$e;

	// `Symbol.toPrimitive` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.toprimitive
	defineWellKnownSymbol$2('toPrimitive');

	var defineWellKnownSymbol$1 = defineWellKnownSymbol$e;

	// `Symbol.toStringTag` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.tostringtag
	defineWellKnownSymbol$1('toStringTag');

	var defineWellKnownSymbol = defineWellKnownSymbol$e;

	// `Symbol.unscopables` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.unscopables
	defineWellKnownSymbol('unscopables');

	var fails$X = fails$13;

	var correctPrototypeGetter = !fails$X(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var hasOwn$a = hasOwnProperty_1;
	var isCallable$g = isCallable$u;
	var toObject$m = toObject$q;
	var sharedKey = sharedKey$4;
	var CORRECT_PROTOTYPE_GETTER$2 = correctPrototypeGetter;

	var IE_PROTO = sharedKey('IE_PROTO');
	var ObjectPrototype$2 = Object.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof
	// eslint-disable-next-line es/no-object-getprototypeof -- safe
	var objectGetPrototypeOf$1 = CORRECT_PROTOTYPE_GETTER$2 ? Object.getPrototypeOf : function (O) {
	  var object = toObject$m(O);
	  if (hasOwn$a(object, IE_PROTO)) return object[IE_PROTO];
	  var constructor = object.constructor;
	  if (isCallable$g(constructor) && object instanceof constructor) {
	    return constructor.prototype;
	  } return object instanceof Object ? ObjectPrototype$2 : null;
	};

	var isCallable$f = isCallable$u;

	var aPossiblePrototype$2 = function (argument) {
	  if (typeof argument === 'object' || isCallable$f(argument)) return argument;
	  throw TypeError("Can't set " + String(argument) + ' as a prototype');
	};

	/* eslint-disable no-proto -- safe */

	var anObject$t = anObject$z;
	var aPossiblePrototype$1 = aPossiblePrototype$2;

	// `Object.setPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	// eslint-disable-next-line es/no-object-setprototypeof -- safe
	var objectSetPrototypeOf$1 = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
	    setter.call(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    anObject$t(O);
	    aPossiblePrototype$1(proto);
	    if (CORRECT_SETTER) setter.call(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var isObject$x = isObject$G;
	var createNonEnumerableProperty$9 = createNonEnumerableProperty$d;

	// `InstallErrorCause` abstract operation
	// https://tc39.es/proposal-error-cause/#sec-errorobjects-install-error-cause
	var installErrorCause$1 = function (O, options) {
	  if (isObject$x(options) && 'cause' in options) {
	    createNonEnumerableProperty$9(O, 'cause', options.cause);
	  }
	};

	var iterators = {};

	var wellKnownSymbol$p = wellKnownSymbol$x;
	var Iterators$4 = iterators;

	var ITERATOR$a = wellKnownSymbol$p('iterator');
	var ArrayPrototype$2 = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod$3 = function (it) {
	  return it !== undefined && (Iterators$4.Array === it || ArrayPrototype$2[ITERATOR$a] === it);
	};

	var classof$8 = classof$b;
	var getMethod$7 = getMethod$9;
	var Iterators$3 = iterators;
	var wellKnownSymbol$o = wellKnownSymbol$x;

	var ITERATOR$9 = wellKnownSymbol$o('iterator');

	var getIteratorMethod$5 = function (it) {
	  if (it != undefined) return getMethod$7(it, ITERATOR$9)
	    || getMethod$7(it, '@@iterator')
	    || Iterators$3[classof$8(it)];
	};

	var aCallable$c = aCallable$f;
	var anObject$s = anObject$z;
	var getIteratorMethod$4 = getIteratorMethod$5;

	var getIterator$4 = function (argument, usingIterator) {
	  var iteratorMethod = arguments.length < 2 ? getIteratorMethod$4(argument) : usingIterator;
	  if (aCallable$c(iteratorMethod)) return anObject$s(iteratorMethod.call(argument));
	  throw TypeError(String(argument) + ' is not iterable');
	};

	var anObject$r = anObject$z;
	var getMethod$6 = getMethod$9;

	var iteratorClose$2 = function (iterator, kind, value) {
	  var innerResult, innerError;
	  anObject$r(iterator);
	  try {
	    innerResult = getMethod$6(iterator, 'return');
	    if (!innerResult) {
	      if (kind === 'throw') throw value;
	      return value;
	    }
	    innerResult = innerResult.call(iterator);
	  } catch (error) {
	    innerError = true;
	    innerResult = error;
	  }
	  if (kind === 'throw') throw value;
	  if (innerError) throw innerResult;
	  anObject$r(innerResult);
	  return value;
	};

	var anObject$q = anObject$z;
	var isArrayIteratorMethod$2 = isArrayIteratorMethod$3;
	var lengthOfArrayLike$i = lengthOfArrayLike$l;
	var bind$9 = functionBindContext;
	var getIterator$3 = getIterator$4;
	var getIteratorMethod$3 = getIteratorMethod$5;
	var iteratorClose$1 = iteratorClose$2;

	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};

	var iterate$8 = function (iterable, unboundFunction, options) {
	  var that = options && options.that;
	  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
	  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
	  var INTERRUPTED = !!(options && options.INTERRUPTED);
	  var fn = bind$9(unboundFunction, that, 1 + AS_ENTRIES + INTERRUPTED);
	  var iterator, iterFn, index, length, result, next, step;

	  var stop = function (condition) {
	    if (iterator) iteratorClose$1(iterator, 'normal', condition);
	    return new Result(true, condition);
	  };

	  var callFn = function (value) {
	    if (AS_ENTRIES) {
	      anObject$q(value);
	      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
	    } return INTERRUPTED ? fn(value, stop) : fn(value);
	  };

	  if (IS_ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod$3(iterable);
	    if (!iterFn) throw TypeError(String(iterable) + ' is not iterable');
	    // optimisation for array iterators
	    if (isArrayIteratorMethod$2(iterFn)) {
	      for (index = 0, length = lengthOfArrayLike$i(iterable); length > index; index++) {
	        result = callFn(iterable[index]);
	        if (result && result instanceof Result) return result;
	      } return new Result(false);
	    }
	    iterator = getIterator$3(iterable, iterFn);
	  }

	  next = iterator.next;
	  while (!(step = next.call(iterator)).done) {
	    try {
	      result = callFn(step.value);
	    } catch (error) {
	      iteratorClose$1(iterator, 'throw', error);
	    }
	    if (typeof result == 'object' && result && result instanceof Result) return result;
	  } return new Result(false);
	};

	var $$2r = _export;
	var getPrototypeOf$9 = objectGetPrototypeOf$1;
	var setPrototypeOf$7 = objectSetPrototypeOf$1;
	var copyConstructorProperties = copyConstructorProperties$3;
	var create$8 = objectCreate$1;
	var createNonEnumerableProperty$8 = createNonEnumerableProperty$d;
	var createPropertyDescriptor$5 = createPropertyDescriptor$9;
	var installErrorCause = installErrorCause$1;
	var iterate$7 = iterate$8;
	var toString$s = toString$u;

	var $AggregateError = function AggregateError(errors, message /* , options */) {
	  var that = this;
	  var options = arguments.length > 2 ? arguments[2] : undefined;
	  if (!(that instanceof $AggregateError)) return new $AggregateError(errors, message, options);
	  if (setPrototypeOf$7) {
	    // eslint-disable-next-line unicorn/error-message -- expected
	    that = setPrototypeOf$7(new Error(undefined), getPrototypeOf$9(that));
	  }
	  if (message !== undefined) createNonEnumerableProperty$8(that, 'message', toString$s(message));
	  installErrorCause(that, options);
	  var errorsArray = [];
	  iterate$7(errors, errorsArray.push, { that: errorsArray });
	  createNonEnumerableProperty$8(that, 'errors', errorsArray);
	  return that;
	};

	if (setPrototypeOf$7) setPrototypeOf$7($AggregateError, Error);
	else copyConstructorProperties($AggregateError, Error);

	$AggregateError.prototype = create$8(Error.prototype, {
	  constructor: createPropertyDescriptor$5(1, $AggregateError),
	  message: createPropertyDescriptor$5(1, ''),
	  name: createPropertyDescriptor$5(1, 'AggregateError')
	});

	// `AggregateError` constructor
	// https://tc39.es/ecma262/#sec-aggregate-error-constructor
	$$2r({ global: true }, {
	  AggregateError: $AggregateError
	});

	var wellKnownSymbol$n = wellKnownSymbol$x;
	var create$7 = objectCreate$1;
	var definePropertyModule$8 = objectDefineProperty;

	var UNSCOPABLES = wellKnownSymbol$n('unscopables');
	var ArrayPrototype$1 = Array.prototype;

	// Array.prototype[@@unscopables]
	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
	  definePropertyModule$8.f(ArrayPrototype$1, UNSCOPABLES, {
	    configurable: true,
	    value: create$7(null)
	  });
	}

	// add a key to Array.prototype[@@unscopables]
	var addToUnscopables$9 = function (key) {
	  ArrayPrototype$1[UNSCOPABLES][key] = true;
	};

	var $$2q = _export;
	var toObject$l = toObject$q;
	var lengthOfArrayLike$h = lengthOfArrayLike$l;
	var toIntegerOrInfinity$e = toIntegerOrInfinity$h;
	var addToUnscopables$8 = addToUnscopables$9;

	// `Array.prototype.at` method
	// https://github.com/tc39/proposal-relative-indexing-method
	$$2q({ target: 'Array', proto: true }, {
	  at: function at(index) {
	    var O = toObject$l(this);
	    var len = lengthOfArrayLike$h(O);
	    var relativeIndex = toIntegerOrInfinity$e(index);
	    var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
	    return (k < 0 || k >= len) ? undefined : O[k];
	  }
	});

	addToUnscopables$8('at');

	var toPropertyKey$4 = toPropertyKey$8;
	var definePropertyModule$7 = objectDefineProperty;
	var createPropertyDescriptor$4 = createPropertyDescriptor$9;

	var createProperty$7 = function (object, key, value) {
	  var propertyKey = toPropertyKey$4(key);
	  if (propertyKey in object) definePropertyModule$7.f(object, propertyKey, createPropertyDescriptor$4(0, value));
	  else object[propertyKey] = value;
	};

	var fails$W = fails$13;
	var wellKnownSymbol$m = wellKnownSymbol$x;
	var V8_VERSION$2 = engineV8Version;

	var SPECIES$5 = wellKnownSymbol$m('species');

	var arrayMethodHasSpeciesSupport$5 = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return V8_VERSION$2 >= 51 || !fails$W(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$5] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var $$2p = _export;
	var fails$V = fails$13;
	var isArray$d = isArray$g;
	var isObject$w = isObject$G;
	var toObject$k = toObject$q;
	var lengthOfArrayLike$g = lengthOfArrayLike$l;
	var createProperty$6 = createProperty$7;
	var arraySpeciesCreate$3 = arraySpeciesCreate$5;
	var arrayMethodHasSpeciesSupport$4 = arrayMethodHasSpeciesSupport$5;
	var wellKnownSymbol$l = wellKnownSymbol$x;
	var V8_VERSION$1 = engineV8Version;

	var IS_CONCAT_SPREADABLE = wellKnownSymbol$l('isConcatSpreadable');
	var MAX_SAFE_INTEGER$3 = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

	// We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679
	var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION$1 >= 51 || !fails$V(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});

	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport$4('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject$w(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray$d(O);
	};

	var FORCED$s = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

	// `Array.prototype.concat` method
	// https://tc39.es/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	$$2p({ target: 'Array', proto: true, forced: FORCED$s }, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  concat: function concat(arg) {
	    var O = toObject$k(this);
	    var A = arraySpeciesCreate$3(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable(E)) {
	        len = lengthOfArrayLike$g(E);
	        if (n + len > MAX_SAFE_INTEGER$3) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty$6(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER$3) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty$6(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	var toObject$j = toObject$q;
	var toAbsoluteIndex$6 = toAbsoluteIndex$8;
	var lengthOfArrayLike$f = lengthOfArrayLike$l;

	var min$7 = Math.min;

	// `Array.prototype.copyWithin` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.copywithin
	// eslint-disable-next-line es/no-array-prototype-copywithin -- safe
	var arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
	  var O = toObject$j(this);
	  var len = lengthOfArrayLike$f(O);
	  var to = toAbsoluteIndex$6(target, len);
	  var from = toAbsoluteIndex$6(start, len);
	  var end = arguments.length > 2 ? arguments[2] : undefined;
	  var count = min$7((end === undefined ? len : toAbsoluteIndex$6(end, len)) - from, len - to);
	  var inc = 1;
	  if (from < to && to < from + count) {
	    inc = -1;
	    from += count - 1;
	    to += count - 1;
	  }
	  while (count-- > 0) {
	    if (from in O) O[to] = O[from];
	    else delete O[to];
	    to += inc;
	    from += inc;
	  } return O;
	};

	var $$2o = _export;
	var copyWithin = arrayCopyWithin;
	var addToUnscopables$7 = addToUnscopables$9;

	// `Array.prototype.copyWithin` method
	// https://tc39.es/ecma262/#sec-array.prototype.copywithin
	$$2o({ target: 'Array', proto: true }, {
	  copyWithin: copyWithin
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$7('copyWithin');

	var fails$U = fails$13;

	var arrayMethodIsStrict$9 = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails$U(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	var $$2n = _export;
	var $every$1 = arrayIteration.every;
	var arrayMethodIsStrict$8 = arrayMethodIsStrict$9;

	var STRICT_METHOD$8 = arrayMethodIsStrict$8('every');

	// `Array.prototype.every` method
	// https://tc39.es/ecma262/#sec-array.prototype.every
	$$2n({ target: 'Array', proto: true, forced: !STRICT_METHOD$8 }, {
	  every: function every(callbackfn /* , thisArg */) {
	    return $every$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var toObject$i = toObject$q;
	var toAbsoluteIndex$5 = toAbsoluteIndex$8;
	var lengthOfArrayLike$e = lengthOfArrayLike$l;

	// `Array.prototype.fill` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.fill
	var arrayFill$1 = function fill(value /* , start = 0, end = @length */) {
	  var O = toObject$i(this);
	  var length = lengthOfArrayLike$e(O);
	  var argumentsLength = arguments.length;
	  var index = toAbsoluteIndex$5(argumentsLength > 1 ? arguments[1] : undefined, length);
	  var end = argumentsLength > 2 ? arguments[2] : undefined;
	  var endPos = end === undefined ? length : toAbsoluteIndex$5(end, length);
	  while (endPos > index) O[index++] = value;
	  return O;
	};

	var $$2m = _export;
	var fill = arrayFill$1;
	var addToUnscopables$6 = addToUnscopables$9;

	// `Array.prototype.fill` method
	// https://tc39.es/ecma262/#sec-array.prototype.fill
	$$2m({ target: 'Array', proto: true }, {
	  fill: fill
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$6('fill');

	var $$2l = _export;
	var $filter$1 = arrayIteration.filter;
	var arrayMethodHasSpeciesSupport$3 = arrayMethodHasSpeciesSupport$5;

	var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport$3('filter');

	// `Array.prototype.filter` method
	// https://tc39.es/ecma262/#sec-array.prototype.filter
	// with adding support of @@species
	$$2l({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$3 }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $$2k = _export;
	var $find$1 = arrayIteration.find;
	var addToUnscopables$5 = addToUnscopables$9;

	var FIND = 'find';
	var SKIPS_HOLES$1 = true;

	// Shouldn't skip holes
	if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES$1 = false; });

	// `Array.prototype.find` method
	// https://tc39.es/ecma262/#sec-array.prototype.find
	$$2k({ target: 'Array', proto: true, forced: SKIPS_HOLES$1 }, {
	  find: function find(callbackfn /* , that = undefined */) {
	    return $find$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$5(FIND);

	var $$2j = _export;
	var $findIndex$1 = arrayIteration.findIndex;
	var addToUnscopables$4 = addToUnscopables$9;

	var FIND_INDEX = 'findIndex';
	var SKIPS_HOLES = true;

	// Shouldn't skip holes
	if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES = false; });

	// `Array.prototype.findIndex` method
	// https://tc39.es/ecma262/#sec-array.prototype.findindex
	$$2j({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
	  findIndex: function findIndex(callbackfn /* , that = undefined */) {
	    return $findIndex$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$4(FIND_INDEX);

	var isArray$c = isArray$g;
	var lengthOfArrayLike$d = lengthOfArrayLike$l;
	var bind$8 = functionBindContext;

	// `FlattenIntoArray` abstract operation
	// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
	var flattenIntoArray$2 = function (target, original, source, sourceLen, start, depth, mapper, thisArg) {
	  var targetIndex = start;
	  var sourceIndex = 0;
	  var mapFn = mapper ? bind$8(mapper, thisArg, 3) : false;
	  var element, elementLen;

	  while (sourceIndex < sourceLen) {
	    if (sourceIndex in source) {
	      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

	      if (depth > 0 && isArray$c(element)) {
	        elementLen = lengthOfArrayLike$d(element);
	        targetIndex = flattenIntoArray$2(target, original, element, elementLen, targetIndex, depth - 1) - 1;
	      } else {
	        if (targetIndex >= 0x1FFFFFFFFFFFFF) throw TypeError('Exceed the acceptable array length');
	        target[targetIndex] = element;
	      }

	      targetIndex++;
	    }
	    sourceIndex++;
	  }
	  return targetIndex;
	};

	var flattenIntoArray_1 = flattenIntoArray$2;

	var $$2i = _export;
	var flattenIntoArray$1 = flattenIntoArray_1;
	var toObject$h = toObject$q;
	var lengthOfArrayLike$c = lengthOfArrayLike$l;
	var toIntegerOrInfinity$d = toIntegerOrInfinity$h;
	var arraySpeciesCreate$2 = arraySpeciesCreate$5;

	// `Array.prototype.flat` method
	// https://tc39.es/ecma262/#sec-array.prototype.flat
	$$2i({ target: 'Array', proto: true }, {
	  flat: function flat(/* depthArg = 1 */) {
	    var depthArg = arguments.length ? arguments[0] : undefined;
	    var O = toObject$h(this);
	    var sourceLen = lengthOfArrayLike$c(O);
	    var A = arraySpeciesCreate$2(O, 0);
	    A.length = flattenIntoArray$1(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toIntegerOrInfinity$d(depthArg));
	    return A;
	  }
	});

	var $$2h = _export;
	var flattenIntoArray = flattenIntoArray_1;
	var aCallable$b = aCallable$f;
	var toObject$g = toObject$q;
	var lengthOfArrayLike$b = lengthOfArrayLike$l;
	var arraySpeciesCreate$1 = arraySpeciesCreate$5;

	// `Array.prototype.flatMap` method
	// https://tc39.es/ecma262/#sec-array.prototype.flatmap
	$$2h({ target: 'Array', proto: true }, {
	  flatMap: function flatMap(callbackfn /* , thisArg */) {
	    var O = toObject$g(this);
	    var sourceLen = lengthOfArrayLike$b(O);
	    var A;
	    aCallable$b(callbackfn);
	    A = arraySpeciesCreate$1(O, 0);
	    A.length = flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    return A;
	  }
	});

	var $forEach$1 = arrayIteration.forEach;
	var arrayMethodIsStrict$7 = arrayMethodIsStrict$9;

	var STRICT_METHOD$7 = arrayMethodIsStrict$7('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.foreach
	var arrayForEach = !STRICT_METHOD$7 ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	// eslint-disable-next-line es/no-array-prototype-foreach -- safe
	} : [].forEach;

	var $$2g = _export;
	var forEach$2 = arrayForEach;

	// `Array.prototype.forEach` method
	// https://tc39.es/ecma262/#sec-array.prototype.foreach
	// eslint-disable-next-line es/no-array-prototype-foreach -- safe
	$$2g({ target: 'Array', proto: true, forced: [].forEach != forEach$2 }, {
	  forEach: forEach$2
	});

	var anObject$p = anObject$z;
	var iteratorClose = iteratorClose$2;

	// call something on iterator step with safe closing on error
	var callWithSafeIterationClosing$1 = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject$p(value)[0], value[1]) : fn(value);
	  } catch (error) {
	    iteratorClose(iterator, 'throw', error);
	  }
	};

	var bind$7 = functionBindContext;
	var toObject$f = toObject$q;
	var callWithSafeIterationClosing = callWithSafeIterationClosing$1;
	var isArrayIteratorMethod$1 = isArrayIteratorMethod$3;
	var isConstructor$3 = isConstructor$5;
	var lengthOfArrayLike$a = lengthOfArrayLike$l;
	var createProperty$5 = createProperty$7;
	var getIterator$2 = getIterator$4;
	var getIteratorMethod$2 = getIteratorMethod$5;

	// `Array.from` method implementation
	// https://tc39.es/ecma262/#sec-array.from
	var arrayFrom$1 = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	  var O = toObject$f(arrayLike);
	  var IS_CONSTRUCTOR = isConstructor$3(this);
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  if (mapping) mapfn = bind$7(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
	  var iteratorMethod = getIteratorMethod$2(O);
	  var index = 0;
	  var length, result, step, iterator, next, value;
	  // if the target is not iterable or it's an array with the default iterator - use a simple case
	  if (iteratorMethod && !(this == Array && isArrayIteratorMethod$1(iteratorMethod))) {
	    iterator = getIterator$2(O, iteratorMethod);
	    next = iterator.next;
	    result = IS_CONSTRUCTOR ? new this() : [];
	    for (;!(step = next.call(iterator)).done; index++) {
	      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
	      createProperty$5(result, index, value);
	    }
	  } else {
	    length = lengthOfArrayLike$a(O);
	    result = IS_CONSTRUCTOR ? new this(length) : Array(length);
	    for (;length > index; index++) {
	      value = mapping ? mapfn(O[index], index) : O[index];
	      createProperty$5(result, index, value);
	    }
	  }
	  result.length = index;
	  return result;
	};

	var wellKnownSymbol$k = wellKnownSymbol$x;

	var ITERATOR$8 = wellKnownSymbol$k('iterator');
	var SAFE_CLOSING = false;

	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return { done: !!called++ };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };
	  iteratorWithReturn[ITERATOR$8] = function () {
	    return this;
	  };
	  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
	  Array.from(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration$4 = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    object[ITERATOR$8] = function () {
	      return {
	        next: function () {
	          return { done: ITERATION_SUPPORT = true };
	        }
	      };
	    };
	    exec(object);
	  } catch (error) { /* empty */ }
	  return ITERATION_SUPPORT;
	};

	var $$2f = _export;
	var from = arrayFrom$1;
	var checkCorrectnessOfIteration$3 = checkCorrectnessOfIteration$4;

	var INCORRECT_ITERATION$1 = !checkCorrectnessOfIteration$3(function (iterable) {
	  // eslint-disable-next-line es/no-array-from -- required for testing
	  Array.from(iterable);
	});

	// `Array.from` method
	// https://tc39.es/ecma262/#sec-array.from
	$$2f({ target: 'Array', stat: true, forced: INCORRECT_ITERATION$1 }, {
	  from: from
	});

	var $$2e = _export;
	var $includes$1 = arrayIncludes.includes;
	var addToUnscopables$3 = addToUnscopables$9;

	// `Array.prototype.includes` method
	// https://tc39.es/ecma262/#sec-array.prototype.includes
	$$2e({ target: 'Array', proto: true }, {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes$1(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$3('includes');

	/* eslint-disable es/no-array-prototype-indexof -- required for testing */
	var $$2d = _export;
	var $indexOf$1 = arrayIncludes.indexOf;
	var arrayMethodIsStrict$6 = arrayMethodIsStrict$9;

	var nativeIndexOf = [].indexOf;

	var NEGATIVE_ZERO$1 = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
	var STRICT_METHOD$6 = arrayMethodIsStrict$6('indexOf');

	// `Array.prototype.indexOf` method
	// https://tc39.es/ecma262/#sec-array.prototype.indexof
	$$2d({ target: 'Array', proto: true, forced: NEGATIVE_ZERO$1 || !STRICT_METHOD$6 }, {
	  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
	    return NEGATIVE_ZERO$1
	      // convert -0 to +0
	      ? nativeIndexOf.apply(this, arguments) || 0
	      : $indexOf$1(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $$2c = _export;
	var isArray$b = isArray$g;

	// `Array.isArray` method
	// https://tc39.es/ecma262/#sec-array.isarray
	$$2c({ target: 'Array', stat: true }, {
	  isArray: isArray$b
	});

	var fails$T = fails$13;
	var isCallable$e = isCallable$u;
	var getPrototypeOf$8 = objectGetPrototypeOf$1;
	var redefine$g = redefine$j.exports;
	var wellKnownSymbol$j = wellKnownSymbol$x;

	var ITERATOR$7 = wellKnownSymbol$j('iterator');
	var BUGGY_SAFARI_ITERATORS$1 = false;

	// `%IteratorPrototype%` object
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

	/* eslint-disable es/no-array-prototype-keys -- safe */
	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
	  else {
	    PrototypeOfArrayIteratorPrototype = getPrototypeOf$8(getPrototypeOf$8(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
	  }
	}

	var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == undefined || fails$T(function () {
	  var test = {};
	  // FF44- legacy iterators case
	  return IteratorPrototype$2[ITERATOR$7].call(test) !== test;
	});

	if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

	// `%IteratorPrototype%[@@iterator]()` method
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
	if (!isCallable$e(IteratorPrototype$2[ITERATOR$7])) {
	  redefine$g(IteratorPrototype$2, ITERATOR$7, function () {
	    return this;
	  });
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype$2,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
	};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;
	var create$6 = objectCreate$1;
	var createPropertyDescriptor$3 = createPropertyDescriptor$9;
	var setToStringTag$9 = setToStringTag$b;
	var Iterators$2 = iterators;

	var returnThis$1 = function () { return this; };

	var createIteratorConstructor$3 = function (IteratorConstructor, NAME, next) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = create$6(IteratorPrototype$1, { next: createPropertyDescriptor$3(1, next) });
	  setToStringTag$9(IteratorConstructor, TO_STRING_TAG, false);
	  Iterators$2[TO_STRING_TAG] = returnThis$1;
	  return IteratorConstructor;
	};

	var $$2b = _export;
	var FunctionName$1 = functionName;
	var isCallable$d = isCallable$u;
	var createIteratorConstructor$2 = createIteratorConstructor$3;
	var getPrototypeOf$7 = objectGetPrototypeOf$1;
	var setPrototypeOf$6 = objectSetPrototypeOf$1;
	var setToStringTag$8 = setToStringTag$b;
	var createNonEnumerableProperty$7 = createNonEnumerableProperty$d;
	var redefine$f = redefine$j.exports;
	var wellKnownSymbol$i = wellKnownSymbol$x;
	var Iterators$1 = iterators;
	var IteratorsCore = iteratorsCore;

	var PROPER_FUNCTION_NAME$4 = FunctionName$1.PROPER;
	var CONFIGURABLE_FUNCTION_NAME$1 = FunctionName$1.CONFIGURABLE;
	var IteratorPrototype = IteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$6 = wellKnownSymbol$i('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis = function () { return this; };

	var defineIterator$3 = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor$2(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
	    switch (KIND) {
	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
	    } return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$6]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = getPrototypeOf$7(anyNativeIterator.call(new Iterable()));
	    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
	      if (getPrototypeOf$7(CurrentIteratorPrototype) !== IteratorPrototype) {
	        if (setPrototypeOf$6) {
	          setPrototypeOf$6(CurrentIteratorPrototype, IteratorPrototype);
	        } else if (!isCallable$d(CurrentIteratorPrototype[ITERATOR$6])) {
	          redefine$f(CurrentIteratorPrototype, ITERATOR$6, returnThis);
	        }
	      }
	      // Set @@toStringTag to native iterators
	      setToStringTag$8(CurrentIteratorPrototype, TO_STRING_TAG, true);
	    }
	  }

	  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
	  if (PROPER_FUNCTION_NAME$4 && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    if (CONFIGURABLE_FUNCTION_NAME$1) {
	      createNonEnumerableProperty$7(IterablePrototype, 'name', VALUES);
	    } else {
	      INCORRECT_VALUES_NAME = true;
	      defaultIterator = function values() { return nativeIterator.call(this); };
	    }
	  }

	  // export additional methods
	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        redefine$f(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else $$2b({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
	  }

	  // define iterator
	  if (IterablePrototype[ITERATOR$6] !== defaultIterator) {
	    redefine$f(IterablePrototype, ITERATOR$6, defaultIterator, { name: DEFAULT });
	  }
	  Iterators$1[NAME] = defaultIterator;

	  return methods;
	};

	var toIndexedObject$7 = toIndexedObject$d;
	var addToUnscopables$2 = addToUnscopables$9;
	var Iterators = iterators;
	var InternalStateModule$9 = internalState;
	var defineIterator$2 = defineIterator$3;

	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState$9 = InternalStateModule$9.set;
	var getInternalState$8 = InternalStateModule$9.getterFor(ARRAY_ITERATOR);

	// `Array.prototype.entries` method
	// https://tc39.es/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.es/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.es/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.es/ecma262/#sec-createarrayiterator
	var es_array_iterator = defineIterator$2(Array, 'Array', function (iterated, kind) {
	  setInternalState$9(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject$7(iterated), // target
	    index: 0,                          // next index
	    kind: kind                         // kind
	  });
	// `%ArrayIteratorPrototype%.next` method
	// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState$8(this);
	  var target = state.target;
	  var kind = state.kind;
	  var index = state.index++;
	  if (!target || index >= target.length) {
	    state.target = undefined;
	    return { value: undefined, done: true };
	  }
	  if (kind == 'keys') return { value: index, done: false };
	  if (kind == 'values') return { value: target[index], done: false };
	  return { value: [index, target[index]], done: false };
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.es/ecma262/#sec-createmappedargumentsobject
	Iterators.Arguments = Iterators.Array;

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$2('keys');
	addToUnscopables$2('values');
	addToUnscopables$2('entries');

	var $$2a = _export;
	var IndexedObject$2 = indexedObject;
	var toIndexedObject$6 = toIndexedObject$d;
	var arrayMethodIsStrict$5 = arrayMethodIsStrict$9;

	var nativeJoin = [].join;

	var ES3_STRINGS = IndexedObject$2 != Object;
	var STRICT_METHOD$5 = arrayMethodIsStrict$5('join', ',');

	// `Array.prototype.join` method
	// https://tc39.es/ecma262/#sec-array.prototype.join
	$$2a({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$5 }, {
	  join: function join(separator) {
	    return nativeJoin.call(toIndexedObject$6(this), separator === undefined ? ',' : separator);
	  }
	});

	/* eslint-disable es/no-array-prototype-lastindexof -- safe */
	var toIndexedObject$5 = toIndexedObject$d;
	var toIntegerOrInfinity$c = toIntegerOrInfinity$h;
	var lengthOfArrayLike$9 = lengthOfArrayLike$l;
	var arrayMethodIsStrict$4 = arrayMethodIsStrict$9;

	var min$6 = Math.min;
	var $lastIndexOf$1 = [].lastIndexOf;
	var NEGATIVE_ZERO = !!$lastIndexOf$1 && 1 / [1].lastIndexOf(1, -0) < 0;
	var STRICT_METHOD$4 = arrayMethodIsStrict$4('lastIndexOf');
	var FORCED$r = NEGATIVE_ZERO || !STRICT_METHOD$4;

	// `Array.prototype.lastIndexOf` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.lastindexof
	var arrayLastIndexOf = FORCED$r ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
	  // convert -0 to +0
	  if (NEGATIVE_ZERO) return $lastIndexOf$1.apply(this, arguments) || 0;
	  var O = toIndexedObject$5(this);
	  var length = lengthOfArrayLike$9(O);
	  var index = length - 1;
	  if (arguments.length > 1) index = min$6(index, toIntegerOrInfinity$c(arguments[1]));
	  if (index < 0) index = length + index;
	  for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
	  return -1;
	} : $lastIndexOf$1;

	var $$29 = _export;
	var lastIndexOf = arrayLastIndexOf;

	// `Array.prototype.lastIndexOf` method
	// https://tc39.es/ecma262/#sec-array.prototype.lastindexof
	// eslint-disable-next-line es/no-array-prototype-lastindexof -- required for testing
	$$29({ target: 'Array', proto: true, forced: lastIndexOf !== [].lastIndexOf }, {
	  lastIndexOf: lastIndexOf
	});

	var $$28 = _export;
	var $map$1 = arrayIteration.map;
	var arrayMethodHasSpeciesSupport$2 = arrayMethodHasSpeciesSupport$5;

	var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport$2('map');

	// `Array.prototype.map` method
	// https://tc39.es/ecma262/#sec-array.prototype.map
	// with adding support of @@species
	$$28({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 }, {
	  map: function map(callbackfn /* , thisArg */) {
	    return $map$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $$27 = _export;
	var fails$S = fails$13;
	var isConstructor$2 = isConstructor$5;
	var createProperty$4 = createProperty$7;

	var ISNT_GENERIC = fails$S(function () {
	  function F() { /* empty */ }
	  // eslint-disable-next-line es/no-array-of -- required for testing
	  return !(Array.of.call(F) instanceof F);
	});

	// `Array.of` method
	// https://tc39.es/ecma262/#sec-array.of
	// WebKit Array.of isn't generic
	$$27({ target: 'Array', stat: true, forced: ISNT_GENERIC }, {
	  of: function of(/* ...args */) {
	    var index = 0;
	    var argumentsLength = arguments.length;
	    var result = new (isConstructor$2(this) ? this : Array)(argumentsLength);
	    while (argumentsLength > index) createProperty$4(result, index, arguments[index++]);
	    result.length = argumentsLength;
	    return result;
	  }
	});

	var aCallable$a = aCallable$f;
	var toObject$e = toObject$q;
	var IndexedObject$1 = indexedObject;
	var lengthOfArrayLike$8 = lengthOfArrayLike$l;

	// `Array.prototype.{ reduce, reduceRight }` methods implementation
	var createMethod$4 = function (IS_RIGHT) {
	  return function (that, callbackfn, argumentsLength, memo) {
	    aCallable$a(callbackfn);
	    var O = toObject$e(that);
	    var self = IndexedObject$1(O);
	    var length = lengthOfArrayLike$8(O);
	    var index = IS_RIGHT ? length - 1 : 0;
	    var i = IS_RIGHT ? -1 : 1;
	    if (argumentsLength < 2) while (true) {
	      if (index in self) {
	        memo = self[index];
	        index += i;
	        break;
	      }
	      index += i;
	      if (IS_RIGHT ? index < 0 : length <= index) {
	        throw TypeError('Reduce of empty array with no initial value');
	      }
	    }
	    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
	      memo = callbackfn(memo, self[index], index, O);
	    }
	    return memo;
	  };
	};

	var arrayReduce = {
	  // `Array.prototype.reduce` method
	  // https://tc39.es/ecma262/#sec-array.prototype.reduce
	  left: createMethod$4(false),
	  // `Array.prototype.reduceRight` method
	  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
	  right: createMethod$4(true)
	};

	var classof$7 = classofRaw$1;
	var global$A = global$O;

	var engineIsNode = classof$7(global$A.process) == 'process';

	var $$26 = _export;
	var $reduce$1 = arrayReduce.left;
	var arrayMethodIsStrict$3 = arrayMethodIsStrict$9;
	var CHROME_VERSION$1 = engineV8Version;
	var IS_NODE$5 = engineIsNode;

	var STRICT_METHOD$3 = arrayMethodIsStrict$3('reduce');
	// Chrome 80-82 has a critical bug
	// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
	var CHROME_BUG$1 = !IS_NODE$5 && CHROME_VERSION$1 > 79 && CHROME_VERSION$1 < 83;

	// `Array.prototype.reduce` method
	// https://tc39.es/ecma262/#sec-array.prototype.reduce
	$$26({ target: 'Array', proto: true, forced: !STRICT_METHOD$3 || CHROME_BUG$1 }, {
	  reduce: function reduce(callbackfn /* , initialValue */) {
	    return $reduce$1(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $$25 = _export;
	var $reduceRight$1 = arrayReduce.right;
	var arrayMethodIsStrict$2 = arrayMethodIsStrict$9;
	var CHROME_VERSION = engineV8Version;
	var IS_NODE$4 = engineIsNode;

	var STRICT_METHOD$2 = arrayMethodIsStrict$2('reduceRight');
	// Chrome 80-82 has a critical bug
	// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
	var CHROME_BUG = !IS_NODE$4 && CHROME_VERSION > 79 && CHROME_VERSION < 83;

	// `Array.prototype.reduceRight` method
	// https://tc39.es/ecma262/#sec-array.prototype.reduceright
	$$25({ target: 'Array', proto: true, forced: !STRICT_METHOD$2 || CHROME_BUG }, {
	  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
	    return $reduceRight$1(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $$24 = _export;
	var isArray$a = isArray$g;

	var nativeReverse = [].reverse;
	var test$1 = [1, 2];

	// `Array.prototype.reverse` method
	// https://tc39.es/ecma262/#sec-array.prototype.reverse
	// fix for Safari 12.0 bug
	// https://bugs.webkit.org/show_bug.cgi?id=188794
	$$24({ target: 'Array', proto: true, forced: String(test$1) === String(test$1.reverse()) }, {
	  reverse: function reverse() {
	    // eslint-disable-next-line no-self-assign -- dirty hack
	    if (isArray$a(this)) this.length = this.length;
	    return nativeReverse.call(this);
	  }
	});

	var $$23 = _export;
	var isArray$9 = isArray$g;
	var isConstructor$1 = isConstructor$5;
	var isObject$v = isObject$G;
	var toAbsoluteIndex$4 = toAbsoluteIndex$8;
	var lengthOfArrayLike$7 = lengthOfArrayLike$l;
	var toIndexedObject$4 = toIndexedObject$d;
	var createProperty$3 = createProperty$7;
	var wellKnownSymbol$h = wellKnownSymbol$x;
	var arrayMethodHasSpeciesSupport$1 = arrayMethodHasSpeciesSupport$5;

	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport$1('slice');

	var SPECIES$4 = wellKnownSymbol$h('species');
	var nativeSlice = [].slice;
	var max$4 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.es/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	$$23({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject$4(this);
	    var length = lengthOfArrayLike$7(O);
	    var k = toAbsoluteIndex$4(start, length);
	    var fin = toAbsoluteIndex$4(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray$9(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (isConstructor$1(Constructor) && (Constructor === Array || isArray$9(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject$v(Constructor)) {
	        Constructor = Constructor[SPECIES$4];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === Array || Constructor === undefined) {
	        return nativeSlice.call(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? Array : Constructor)(max$4(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty$3(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	var $$22 = _export;
	var $some$1 = arrayIteration.some;
	var arrayMethodIsStrict$1 = arrayMethodIsStrict$9;

	var STRICT_METHOD$1 = arrayMethodIsStrict$1('some');

	// `Array.prototype.some` method
	// https://tc39.es/ecma262/#sec-array.prototype.some
	$$22({ target: 'Array', proto: true, forced: !STRICT_METHOD$1 }, {
	  some: function some(callbackfn /* , thisArg */) {
	    return $some$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// TODO: use something more complex like timsort?
	var floor$9 = Math.floor;

	var mergeSort = function (array, comparefn) {
	  var length = array.length;
	  var middle = floor$9(length / 2);
	  return length < 8 ? insertionSort(array, comparefn) : merge(
	    mergeSort(array.slice(0, middle), comparefn),
	    mergeSort(array.slice(middle), comparefn),
	    comparefn
	  );
	};

	var insertionSort = function (array, comparefn) {
	  var length = array.length;
	  var i = 1;
	  var element, j;

	  while (i < length) {
	    j = i;
	    element = array[i];
	    while (j && comparefn(array[j - 1], element) > 0) {
	      array[j] = array[--j];
	    }
	    if (j !== i++) array[j] = element;
	  } return array;
	};

	var merge = function (left, right, comparefn) {
	  var llength = left.length;
	  var rlength = right.length;
	  var lindex = 0;
	  var rindex = 0;
	  var result = [];

	  while (lindex < llength || rindex < rlength) {
	    if (lindex < llength && rindex < rlength) {
	      result.push(comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]);
	    } else {
	      result.push(lindex < llength ? left[lindex++] : right[rindex++]);
	    }
	  } return result;
	};

	var arraySort = mergeSort;

	var userAgent$6 = engineUserAgent;

	var firefox = userAgent$6.match(/firefox\/(\d+)/i);

	var engineFfVersion = !!firefox && +firefox[1];

	var UA = engineUserAgent;

	var engineIsIeOrEdge = /MSIE|Trident/.test(UA);

	var userAgent$5 = engineUserAgent;

	var webkit = userAgent$5.match(/AppleWebKit\/(\d+)\./);

	var engineWebkitVersion = !!webkit && +webkit[1];

	var $$21 = _export;
	var aCallable$9 = aCallable$f;
	var toObject$d = toObject$q;
	var lengthOfArrayLike$6 = lengthOfArrayLike$l;
	var toString$r = toString$u;
	var fails$R = fails$13;
	var internalSort$1 = arraySort;
	var arrayMethodIsStrict = arrayMethodIsStrict$9;
	var FF$1 = engineFfVersion;
	var IE_OR_EDGE$1 = engineIsIeOrEdge;
	var V8$1 = engineV8Version;
	var WEBKIT$2 = engineWebkitVersion;

	var test = [];
	var nativeSort$1 = test.sort;

	// IE8-
	var FAILS_ON_UNDEFINED = fails$R(function () {
	  test.sort(undefined);
	});
	// V8 bug
	var FAILS_ON_NULL = fails$R(function () {
	  test.sort(null);
	});
	// Old WebKit
	var STRICT_METHOD = arrayMethodIsStrict('sort');

	var STABLE_SORT$1 = !fails$R(function () {
	  // feature detection can be too slow, so check engines versions
	  if (V8$1) return V8$1 < 70;
	  if (FF$1 && FF$1 > 3) return;
	  if (IE_OR_EDGE$1) return true;
	  if (WEBKIT$2) return WEBKIT$2 < 603;

	  var result = '';
	  var code, chr, value, index;

	  // generate an array with more 512 elements (Chakra and old V8 fails only in this case)
	  for (code = 65; code < 76; code++) {
	    chr = String.fromCharCode(code);

	    switch (code) {
	      case 66: case 69: case 70: case 72: value = 3; break;
	      case 68: case 71: value = 4; break;
	      default: value = 2;
	    }

	    for (index = 0; index < 47; index++) {
	      test.push({ k: chr + index, v: value });
	    }
	  }

	  test.sort(function (a, b) { return b.v - a.v; });

	  for (index = 0; index < test.length; index++) {
	    chr = test[index].k.charAt(0);
	    if (result.charAt(result.length - 1) !== chr) result += chr;
	  }

	  return result !== 'DGBEFHACIJK';
	});

	var FORCED$q = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD || !STABLE_SORT$1;

	var getSortCompare$1 = function (comparefn) {
	  return function (x, y) {
	    if (y === undefined) return -1;
	    if (x === undefined) return 1;
	    if (comparefn !== undefined) return +comparefn(x, y) || 0;
	    return toString$r(x) > toString$r(y) ? 1 : -1;
	  };
	};

	// `Array.prototype.sort` method
	// https://tc39.es/ecma262/#sec-array.prototype.sort
	$$21({ target: 'Array', proto: true, forced: FORCED$q }, {
	  sort: function sort(comparefn) {
	    if (comparefn !== undefined) aCallable$9(comparefn);

	    var array = toObject$d(this);

	    if (STABLE_SORT$1) return comparefn === undefined ? nativeSort$1.call(array) : nativeSort$1.call(array, comparefn);

	    var items = [];
	    var arrayLength = lengthOfArrayLike$6(array);
	    var itemsLength, index;

	    for (index = 0; index < arrayLength; index++) {
	      if (index in array) items.push(array[index]);
	    }

	    items = internalSort$1(items, getSortCompare$1(comparefn));
	    itemsLength = items.length;
	    index = 0;

	    while (index < itemsLength) array[index] = items[index++];
	    while (index < arrayLength) delete array[index++];

	    return array;
	  }
	});

	var getBuiltIn$8 = getBuiltIn$f;
	var definePropertyModule$6 = objectDefineProperty;
	var wellKnownSymbol$g = wellKnownSymbol$x;
	var DESCRIPTORS$o = descriptors;

	var SPECIES$3 = wellKnownSymbol$g('species');

	var setSpecies$6 = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn$8(CONSTRUCTOR_NAME);
	  var defineProperty = definePropertyModule$6.f;

	  if (DESCRIPTORS$o && Constructor && !Constructor[SPECIES$3]) {
	    defineProperty(Constructor, SPECIES$3, {
	      configurable: true,
	      get: function () { return this; }
	    });
	  }
	};

	var setSpecies$5 = setSpecies$6;

	// `Array[@@species]` getter
	// https://tc39.es/ecma262/#sec-get-array-@@species
	setSpecies$5('Array');

	var $$20 = _export;
	var toAbsoluteIndex$3 = toAbsoluteIndex$8;
	var toIntegerOrInfinity$b = toIntegerOrInfinity$h;
	var lengthOfArrayLike$5 = lengthOfArrayLike$l;
	var toObject$c = toObject$q;
	var arraySpeciesCreate = arraySpeciesCreate$5;
	var createProperty$2 = createProperty$7;
	var arrayMethodHasSpeciesSupport = arrayMethodHasSpeciesSupport$5;

	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');

	var max$3 = Math.max;
	var min$5 = Math.min;
	var MAX_SAFE_INTEGER$2 = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

	// `Array.prototype.splice` method
	// https://tc39.es/ecma262/#sec-array.prototype.splice
	// with adding support of @@species
	$$20({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
	  splice: function splice(start, deleteCount /* , ...items */) {
	    var O = toObject$c(this);
	    var len = lengthOfArrayLike$5(O);
	    var actualStart = toAbsoluteIndex$3(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;
	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min$5(max$3(toIntegerOrInfinity$b(deleteCount), 0), len - actualStart);
	    }
	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$2) {
	      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
	    }
	    A = arraySpeciesCreate(O, actualDeleteCount);
	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty$2(A, k, O[from]);
	    }
	    A.length = actualDeleteCount;
	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	    }
	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }
	    O.length = len - actualDeleteCount + insertCount;
	    return A;
	  }
	});

	// this method was added to unscopables after implementation
	// in popular engines, so it's moved to a separate module
	var addToUnscopables$1 = addToUnscopables$9;

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$1('flat');

	// this method was added to unscopables after implementation
	// in popular engines, so it's moved to a separate module
	var addToUnscopables = addToUnscopables$9;

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('flatMap');

	// eslint-disable-next-line es/no-typed-arrays -- safe
	var arrayBufferNative = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined';

	var redefine$e = redefine$j.exports;

	var redefineAll$6 = function (target, src, options) {
	  for (var key in src) redefine$e(target, key, src[key], options);
	  return target;
	};

	var anInstance$8 = function (it, Constructor, name) {
	  if (it instanceof Constructor) return it;
	  throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
	};

	var toIntegerOrInfinity$a = toIntegerOrInfinity$h;
	var toLength$b = toLength$d;

	// `ToIndex` abstract operation
	// https://tc39.es/ecma262/#sec-toindex
	var toIndex$2 = function (it) {
	  if (it === undefined) return 0;
	  var number = toIntegerOrInfinity$a(it);
	  var length = toLength$b(number);
	  if (number !== length) throw RangeError('Wrong length or index');
	  return length;
	};

	// IEEE754 conversions based on https://github.com/feross/ieee754
	var abs$7 = Math.abs;
	var pow$4 = Math.pow;
	var floor$8 = Math.floor;
	var log$8 = Math.log;
	var LN2$2 = Math.LN2;

	var pack = function (number, mantissaLength, bytes) {
	  var buffer = new Array(bytes);
	  var exponentLength = bytes * 8 - mantissaLength - 1;
	  var eMax = (1 << exponentLength) - 1;
	  var eBias = eMax >> 1;
	  var rt = mantissaLength === 23 ? pow$4(2, -24) - pow$4(2, -77) : 0;
	  var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
	  var index = 0;
	  var exponent, mantissa, c;
	  number = abs$7(number);
	  // eslint-disable-next-line no-self-compare -- NaN check
	  if (number != number || number === Infinity) {
	    // eslint-disable-next-line no-self-compare -- NaN check
	    mantissa = number != number ? 1 : 0;
	    exponent = eMax;
	  } else {
	    exponent = floor$8(log$8(number) / LN2$2);
	    if (number * (c = pow$4(2, -exponent)) < 1) {
	      exponent--;
	      c *= 2;
	    }
	    if (exponent + eBias >= 1) {
	      number += rt / c;
	    } else {
	      number += rt * pow$4(2, 1 - eBias);
	    }
	    if (number * c >= 2) {
	      exponent++;
	      c /= 2;
	    }
	    if (exponent + eBias >= eMax) {
	      mantissa = 0;
	      exponent = eMax;
	    } else if (exponent + eBias >= 1) {
	      mantissa = (number * c - 1) * pow$4(2, mantissaLength);
	      exponent = exponent + eBias;
	    } else {
	      mantissa = number * pow$4(2, eBias - 1) * pow$4(2, mantissaLength);
	      exponent = 0;
	    }
	  }
	  for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8);
	  exponent = exponent << mantissaLength | mantissa;
	  exponentLength += mantissaLength;
	  for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8);
	  buffer[--index] |= sign * 128;
	  return buffer;
	};

	var unpack = function (buffer, mantissaLength) {
	  var bytes = buffer.length;
	  var exponentLength = bytes * 8 - mantissaLength - 1;
	  var eMax = (1 << exponentLength) - 1;
	  var eBias = eMax >> 1;
	  var nBits = exponentLength - 7;
	  var index = bytes - 1;
	  var sign = buffer[index--];
	  var exponent = sign & 127;
	  var mantissa;
	  sign >>= 7;
	  for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8);
	  mantissa = exponent & (1 << -nBits) - 1;
	  exponent >>= -nBits;
	  nBits += mantissaLength;
	  for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8);
	  if (exponent === 0) {
	    exponent = 1 - eBias;
	  } else if (exponent === eMax) {
	    return mantissa ? NaN : sign ? -Infinity : Infinity;
	  } else {
	    mantissa = mantissa + pow$4(2, mantissaLength);
	    exponent = exponent - eBias;
	  } return (sign ? -1 : 1) * mantissa * pow$4(2, exponent - mantissaLength);
	};

	var ieee754 = {
	  pack: pack,
	  unpack: unpack
	};

	var global$z = global$O;
	var DESCRIPTORS$n = descriptors;
	var NATIVE_ARRAY_BUFFER$2 = arrayBufferNative;
	var FunctionName = functionName;
	var createNonEnumerableProperty$6 = createNonEnumerableProperty$d;
	var redefineAll$5 = redefineAll$6;
	var fails$Q = fails$13;
	var anInstance$7 = anInstance$8;
	var toIntegerOrInfinity$9 = toIntegerOrInfinity$h;
	var toLength$a = toLength$d;
	var toIndex$1 = toIndex$2;
	var IEEE754 = ieee754;
	var getPrototypeOf$6 = objectGetPrototypeOf$1;
	var setPrototypeOf$5 = objectSetPrototypeOf$1;
	var getOwnPropertyNames$4 = objectGetOwnPropertyNames.f;
	var defineProperty$c = objectDefineProperty.f;
	var arrayFill = arrayFill$1;
	var setToStringTag$7 = setToStringTag$b;
	var InternalStateModule$8 = internalState;

	var PROPER_FUNCTION_NAME$3 = FunctionName.PROPER;
	var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
	var getInternalState$7 = InternalStateModule$8.get;
	var setInternalState$8 = InternalStateModule$8.set;
	var ARRAY_BUFFER$1 = 'ArrayBuffer';
	var DATA_VIEW = 'DataView';
	var PROTOTYPE = 'prototype';
	var WRONG_LENGTH$1 = 'Wrong length';
	var WRONG_INDEX = 'Wrong index';
	var NativeArrayBuffer$1 = global$z[ARRAY_BUFFER$1];
	var $ArrayBuffer = NativeArrayBuffer$1;
	var $DataView = global$z[DATA_VIEW];
	var $DataViewPrototype = $DataView && $DataView[PROTOTYPE];
	var ObjectPrototype$1 = Object.prototype;
	var RangeError$2 = global$z.RangeError;

	var packIEEE754 = IEEE754.pack;
	var unpackIEEE754 = IEEE754.unpack;

	var packInt8 = function (number) {
	  return [number & 0xFF];
	};

	var packInt16 = function (number) {
	  return [number & 0xFF, number >> 8 & 0xFF];
	};

	var packInt32 = function (number) {
	  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
	};

	var unpackInt32 = function (buffer) {
	  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
	};

	var packFloat32 = function (number) {
	  return packIEEE754(number, 23, 4);
	};

	var packFloat64 = function (number) {
	  return packIEEE754(number, 52, 8);
	};

	var addGetter$1 = function (Constructor, key) {
	  defineProperty$c(Constructor[PROTOTYPE], key, { get: function () { return getInternalState$7(this)[key]; } });
	};

	var get$1 = function (view, count, index, isLittleEndian) {
	  var intIndex = toIndex$1(index);
	  var store = getInternalState$7(view);
	  if (intIndex + count > store.byteLength) throw RangeError$2(WRONG_INDEX);
	  var bytes = getInternalState$7(store.buffer).bytes;
	  var start = intIndex + store.byteOffset;
	  var pack = bytes.slice(start, start + count);
	  return isLittleEndian ? pack : pack.reverse();
	};

	var set$2 = function (view, count, index, conversion, value, isLittleEndian) {
	  var intIndex = toIndex$1(index);
	  var store = getInternalState$7(view);
	  if (intIndex + count > store.byteLength) throw RangeError$2(WRONG_INDEX);
	  var bytes = getInternalState$7(store.buffer).bytes;
	  var start = intIndex + store.byteOffset;
	  var pack = conversion(+value);
	  for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
	};

	if (!NATIVE_ARRAY_BUFFER$2) {
	  $ArrayBuffer = function ArrayBuffer(length) {
	    anInstance$7(this, $ArrayBuffer, ARRAY_BUFFER$1);
	    var byteLength = toIndex$1(length);
	    setInternalState$8(this, {
	      bytes: arrayFill.call(new Array(byteLength), 0),
	      byteLength: byteLength
	    });
	    if (!DESCRIPTORS$n) this.byteLength = byteLength;
	  };

	  $DataView = function DataView(buffer, byteOffset, byteLength) {
	    anInstance$7(this, $DataView, DATA_VIEW);
	    anInstance$7(buffer, $ArrayBuffer, DATA_VIEW);
	    var bufferLength = getInternalState$7(buffer).byteLength;
	    var offset = toIntegerOrInfinity$9(byteOffset);
	    if (offset < 0 || offset > bufferLength) throw RangeError$2('Wrong offset');
	    byteLength = byteLength === undefined ? bufferLength - offset : toLength$a(byteLength);
	    if (offset + byteLength > bufferLength) throw RangeError$2(WRONG_LENGTH$1);
	    setInternalState$8(this, {
	      buffer: buffer,
	      byteLength: byteLength,
	      byteOffset: offset
	    });
	    if (!DESCRIPTORS$n) {
	      this.buffer = buffer;
	      this.byteLength = byteLength;
	      this.byteOffset = offset;
	    }
	  };

	  if (DESCRIPTORS$n) {
	    addGetter$1($ArrayBuffer, 'byteLength');
	    addGetter$1($DataView, 'buffer');
	    addGetter$1($DataView, 'byteLength');
	    addGetter$1($DataView, 'byteOffset');
	  }

	  redefineAll$5($DataView[PROTOTYPE], {
	    getInt8: function getInt8(byteOffset) {
	      return get$1(this, 1, byteOffset)[0] << 24 >> 24;
	    },
	    getUint8: function getUint8(byteOffset) {
	      return get$1(this, 1, byteOffset)[0];
	    },
	    getInt16: function getInt16(byteOffset /* , littleEndian */) {
	      var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
	      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
	    },
	    getUint16: function getUint16(byteOffset /* , littleEndian */) {
	      var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
	      return bytes[1] << 8 | bytes[0];
	    },
	    getInt32: function getInt32(byteOffset /* , littleEndian */) {
	      return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
	    },
	    getUint32: function getUint32(byteOffset /* , littleEndian */) {
	      return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
	    },
	    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
	    },
	    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get$1(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
	    },
	    setInt8: function setInt8(byteOffset, value) {
	      set$2(this, 1, byteOffset, packInt8, value);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      set$2(this, 1, byteOffset, packInt8, value);
	    },
	    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
	      set$2(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
	      set$2(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
	      set$2(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
	      set$2(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
	      set$2(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
	      set$2(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
	    }
	  });
	} else {
	  var INCORRECT_ARRAY_BUFFER_NAME = PROPER_FUNCTION_NAME$3 && NativeArrayBuffer$1.name !== ARRAY_BUFFER$1;
	  /* eslint-disable no-new -- required for testing */
	  if (!fails$Q(function () {
	    NativeArrayBuffer$1(1);
	  }) || !fails$Q(function () {
	    new NativeArrayBuffer$1(-1);
	  }) || fails$Q(function () {
	    new NativeArrayBuffer$1();
	    new NativeArrayBuffer$1(1.5);
	    new NativeArrayBuffer$1(NaN);
	    return INCORRECT_ARRAY_BUFFER_NAME && !CONFIGURABLE_FUNCTION_NAME;
	  })) {
	  /* eslint-enable no-new -- required for testing */
	    $ArrayBuffer = function ArrayBuffer(length) {
	      anInstance$7(this, $ArrayBuffer);
	      return new NativeArrayBuffer$1(toIndex$1(length));
	    };
	    var ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE] = NativeArrayBuffer$1[PROTOTYPE];
	    for (var keys$6 = getOwnPropertyNames$4(NativeArrayBuffer$1), j$1 = 0, key$1; keys$6.length > j$1;) {
	      if (!((key$1 = keys$6[j$1++]) in $ArrayBuffer)) {
	        createNonEnumerableProperty$6($ArrayBuffer, key$1, NativeArrayBuffer$1[key$1]);
	      }
	    }
	    ArrayBufferPrototype.constructor = $ArrayBuffer;
	  } else if (INCORRECT_ARRAY_BUFFER_NAME && CONFIGURABLE_FUNCTION_NAME) {
	    createNonEnumerableProperty$6(NativeArrayBuffer$1, 'name', ARRAY_BUFFER$1);
	  }

	  // WebKit bug - the same parent prototype for typed arrays and data view
	  if (setPrototypeOf$5 && getPrototypeOf$6($DataViewPrototype) !== ObjectPrototype$1) {
	    setPrototypeOf$5($DataViewPrototype, ObjectPrototype$1);
	  }

	  // iOS Safari 7.x bug
	  var testView = new $DataView(new $ArrayBuffer(2));
	  var $setInt8 = $DataViewPrototype.setInt8;
	  testView.setInt8(0, 2147483648);
	  testView.setInt8(1, 2147483649);
	  if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll$5($DataViewPrototype, {
	    setInt8: function setInt8(byteOffset, value) {
	      $setInt8.call(this, byteOffset, value << 24 >> 24);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      $setInt8.call(this, byteOffset, value << 24 >> 24);
	    }
	  }, { unsafe: true });
	}

	setToStringTag$7($ArrayBuffer, ARRAY_BUFFER$1);
	setToStringTag$7($DataView, DATA_VIEW);

	var arrayBuffer = {
	  ArrayBuffer: $ArrayBuffer,
	  DataView: $DataView
	};

	var $$1$ = _export;
	var global$y = global$O;
	var arrayBufferModule = arrayBuffer;
	var setSpecies$4 = setSpecies$6;

	var ARRAY_BUFFER = 'ArrayBuffer';
	var ArrayBuffer$4 = arrayBufferModule[ARRAY_BUFFER];
	var NativeArrayBuffer = global$y[ARRAY_BUFFER];

	// `ArrayBuffer` constructor
	// https://tc39.es/ecma262/#sec-arraybuffer-constructor
	$$1$({ global: true, forced: NativeArrayBuffer !== ArrayBuffer$4 }, {
	  ArrayBuffer: ArrayBuffer$4
	});

	setSpecies$4(ARRAY_BUFFER);

	var NATIVE_ARRAY_BUFFER$1 = arrayBufferNative;
	var DESCRIPTORS$m = descriptors;
	var global$x = global$O;
	var isCallable$c = isCallable$u;
	var isObject$u = isObject$G;
	var hasOwn$9 = hasOwnProperty_1;
	var classof$6 = classof$b;
	var tryToString$1 = tryToString$3;
	var createNonEnumerableProperty$5 = createNonEnumerableProperty$d;
	var redefine$d = redefine$j.exports;
	var defineProperty$b = objectDefineProperty.f;
	var getPrototypeOf$5 = objectGetPrototypeOf$1;
	var setPrototypeOf$4 = objectSetPrototypeOf$1;
	var wellKnownSymbol$f = wellKnownSymbol$x;
	var uid$1 = uid$5;

	var Int8Array$3 = global$x.Int8Array;
	var Int8ArrayPrototype = Int8Array$3 && Int8Array$3.prototype;
	var Uint8ClampedArray = global$x.Uint8ClampedArray;
	var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
	var TypedArray$1 = Int8Array$3 && getPrototypeOf$5(Int8Array$3);
	var TypedArrayPrototype$1 = Int8ArrayPrototype && getPrototypeOf$5(Int8ArrayPrototype);
	var ObjectPrototype = Object.prototype;
	var isPrototypeOf = ObjectPrototype.isPrototypeOf;

	var TO_STRING_TAG$1 = wellKnownSymbol$f('toStringTag');
	var TYPED_ARRAY_TAG$1 = uid$1('TYPED_ARRAY_TAG');
	var TYPED_ARRAY_CONSTRUCTOR$2 = uid$1('TYPED_ARRAY_CONSTRUCTOR');
	// Fixing native typed arrays in Opera Presto crashes the browser, see #595
	var NATIVE_ARRAY_BUFFER_VIEWS$3 = NATIVE_ARRAY_BUFFER$1 && !!setPrototypeOf$4 && classof$6(global$x.opera) !== 'Opera';
	var TYPED_ARRAY_TAG_REQIRED = false;
	var NAME$1, Constructor, Prototype;

	var TypedArrayConstructorsList = {
	  Int8Array: 1,
	  Uint8Array: 1,
	  Uint8ClampedArray: 1,
	  Int16Array: 2,
	  Uint16Array: 2,
	  Int32Array: 4,
	  Uint32Array: 4,
	  Float32Array: 4,
	  Float64Array: 8
	};

	var BigIntArrayConstructorsList = {
	  BigInt64Array: 8,
	  BigUint64Array: 8
	};

	var isView = function isView(it) {
	  if (!isObject$u(it)) return false;
	  var klass = classof$6(it);
	  return klass === 'DataView'
	    || hasOwn$9(TypedArrayConstructorsList, klass)
	    || hasOwn$9(BigIntArrayConstructorsList, klass);
	};

	var isTypedArray$3 = function (it) {
	  if (!isObject$u(it)) return false;
	  var klass = classof$6(it);
	  return hasOwn$9(TypedArrayConstructorsList, klass)
	    || hasOwn$9(BigIntArrayConstructorsList, klass);
	};

	var aTypedArray$n = function (it) {
	  if (isTypedArray$3(it)) return it;
	  throw TypeError('Target is not a typed array');
	};

	var aTypedArrayConstructor$4 = function (C) {
	  if (isCallable$c(C) && (!setPrototypeOf$4 || isPrototypeOf.call(TypedArray$1, C))) return C;
	  throw TypeError(tryToString$1(C) + ' is not a typed array constructor');
	};

	var exportTypedArrayMethod$o = function (KEY, property, forced) {
	  if (!DESCRIPTORS$m) return;
	  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
	    var TypedArrayConstructor = global$x[ARRAY];
	    if (TypedArrayConstructor && hasOwn$9(TypedArrayConstructor.prototype, KEY)) try {
	      delete TypedArrayConstructor.prototype[KEY];
	    } catch (error) { /* empty */ }
	  }
	  if (!TypedArrayPrototype$1[KEY] || forced) {
	    redefine$d(TypedArrayPrototype$1, KEY, forced ? property
	      : NATIVE_ARRAY_BUFFER_VIEWS$3 && Int8ArrayPrototype[KEY] || property);
	  }
	};

	var exportTypedArrayStaticMethod$2 = function (KEY, property, forced) {
	  var ARRAY, TypedArrayConstructor;
	  if (!DESCRIPTORS$m) return;
	  if (setPrototypeOf$4) {
	    if (forced) for (ARRAY in TypedArrayConstructorsList) {
	      TypedArrayConstructor = global$x[ARRAY];
	      if (TypedArrayConstructor && hasOwn$9(TypedArrayConstructor, KEY)) try {
	        delete TypedArrayConstructor[KEY];
	      } catch (error) { /* empty */ }
	    }
	    if (!TypedArray$1[KEY] || forced) {
	      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
	      try {
	        return redefine$d(TypedArray$1, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS$3 && TypedArray$1[KEY] || property);
	      } catch (error) { /* empty */ }
	    } else return;
	  }
	  for (ARRAY in TypedArrayConstructorsList) {
	    TypedArrayConstructor = global$x[ARRAY];
	    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
	      redefine$d(TypedArrayConstructor, KEY, property);
	    }
	  }
	};

	for (NAME$1 in TypedArrayConstructorsList) {
	  Constructor = global$x[NAME$1];
	  Prototype = Constructor && Constructor.prototype;
	  if (Prototype) createNonEnumerableProperty$5(Prototype, TYPED_ARRAY_CONSTRUCTOR$2, Constructor);
	  else NATIVE_ARRAY_BUFFER_VIEWS$3 = false;
	}

	for (NAME$1 in BigIntArrayConstructorsList) {
	  Constructor = global$x[NAME$1];
	  Prototype = Constructor && Constructor.prototype;
	  if (Prototype) createNonEnumerableProperty$5(Prototype, TYPED_ARRAY_CONSTRUCTOR$2, Constructor);
	}

	// WebKit bug - typed arrays constructors prototype is Object.prototype
	if (!NATIVE_ARRAY_BUFFER_VIEWS$3 || !isCallable$c(TypedArray$1) || TypedArray$1 === Function.prototype) {
	  // eslint-disable-next-line no-shadow -- safe
	  TypedArray$1 = function TypedArray() {
	    throw TypeError('Incorrect invocation');
	  };
	  if (NATIVE_ARRAY_BUFFER_VIEWS$3) for (NAME$1 in TypedArrayConstructorsList) {
	    if (global$x[NAME$1]) setPrototypeOf$4(global$x[NAME$1], TypedArray$1);
	  }
	}

	if (!NATIVE_ARRAY_BUFFER_VIEWS$3 || !TypedArrayPrototype$1 || TypedArrayPrototype$1 === ObjectPrototype) {
	  TypedArrayPrototype$1 = TypedArray$1.prototype;
	  if (NATIVE_ARRAY_BUFFER_VIEWS$3) for (NAME$1 in TypedArrayConstructorsList) {
	    if (global$x[NAME$1]) setPrototypeOf$4(global$x[NAME$1].prototype, TypedArrayPrototype$1);
	  }
	}

	// WebKit bug - one more object in Uint8ClampedArray prototype chain
	if (NATIVE_ARRAY_BUFFER_VIEWS$3 && getPrototypeOf$5(Uint8ClampedArrayPrototype) !== TypedArrayPrototype$1) {
	  setPrototypeOf$4(Uint8ClampedArrayPrototype, TypedArrayPrototype$1);
	}

	if (DESCRIPTORS$m && !hasOwn$9(TypedArrayPrototype$1, TO_STRING_TAG$1)) {
	  TYPED_ARRAY_TAG_REQIRED = true;
	  defineProperty$b(TypedArrayPrototype$1, TO_STRING_TAG$1, { get: function () {
	    return isObject$u(this) ? this[TYPED_ARRAY_TAG$1] : undefined;
	  } });
	  for (NAME$1 in TypedArrayConstructorsList) if (global$x[NAME$1]) {
	    createNonEnumerableProperty$5(global$x[NAME$1], TYPED_ARRAY_TAG$1, NAME$1);
	  }
	}

	var arrayBufferViewCore = {
	  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS$3,
	  TYPED_ARRAY_CONSTRUCTOR: TYPED_ARRAY_CONSTRUCTOR$2,
	  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG$1,
	  aTypedArray: aTypedArray$n,
	  aTypedArrayConstructor: aTypedArrayConstructor$4,
	  exportTypedArrayMethod: exportTypedArrayMethod$o,
	  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod$2,
	  isView: isView,
	  isTypedArray: isTypedArray$3,
	  TypedArray: TypedArray$1,
	  TypedArrayPrototype: TypedArrayPrototype$1
	};

	var $$1_ = _export;
	var ArrayBufferViewCore$q = arrayBufferViewCore;

	var NATIVE_ARRAY_BUFFER_VIEWS$2 = ArrayBufferViewCore$q.NATIVE_ARRAY_BUFFER_VIEWS;

	// `ArrayBuffer.isView` method
	// https://tc39.es/ecma262/#sec-arraybuffer.isview
	$$1_({ target: 'ArrayBuffer', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS$2 }, {
	  isView: ArrayBufferViewCore$q.isView
	});

	var isConstructor = isConstructor$5;
	var tryToString = tryToString$3;

	// `Assert: IsConstructor(argument) is true`
	var aConstructor$3 = function (argument) {
	  if (isConstructor(argument)) return argument;
	  throw TypeError(tryToString(argument) + ' is not a constructor');
	};

	var anObject$o = anObject$z;
	var aConstructor$2 = aConstructor$3;
	var wellKnownSymbol$e = wellKnownSymbol$x;

	var SPECIES$2 = wellKnownSymbol$e('species');

	// `SpeciesConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-speciesconstructor
	var speciesConstructor$6 = function (O, defaultConstructor) {
	  var C = anObject$o(O).constructor;
	  var S;
	  return C === undefined || (S = anObject$o(C)[SPECIES$2]) == undefined ? defaultConstructor : aConstructor$2(S);
	};

	var $$1Z = _export;
	var fails$P = fails$13;
	var ArrayBufferModule$2 = arrayBuffer;
	var anObject$n = anObject$z;
	var toAbsoluteIndex$2 = toAbsoluteIndex$8;
	var toLength$9 = toLength$d;
	var speciesConstructor$5 = speciesConstructor$6;

	var ArrayBuffer$3 = ArrayBufferModule$2.ArrayBuffer;
	var DataView$4 = ArrayBufferModule$2.DataView;
	var nativeArrayBufferSlice = ArrayBuffer$3.prototype.slice;

	var INCORRECT_SLICE = fails$P(function () {
	  return !new ArrayBuffer$3(2).slice(1, undefined).byteLength;
	});

	// `ArrayBuffer.prototype.slice` method
	// https://tc39.es/ecma262/#sec-arraybuffer.prototype.slice
	$$1Z({ target: 'ArrayBuffer', proto: true, unsafe: true, forced: INCORRECT_SLICE }, {
	  slice: function slice(start, end) {
	    if (nativeArrayBufferSlice !== undefined && end === undefined) {
	      return nativeArrayBufferSlice.call(anObject$n(this), start); // FF fix
	    }
	    var length = anObject$n(this).byteLength;
	    var first = toAbsoluteIndex$2(start, length);
	    var fin = toAbsoluteIndex$2(end === undefined ? length : end, length);
	    var result = new (speciesConstructor$5(this, ArrayBuffer$3))(toLength$9(fin - first));
	    var viewSource = new DataView$4(this);
	    var viewTarget = new DataView$4(result);
	    var index = 0;
	    while (first < fin) {
	      viewTarget.setUint8(index++, viewSource.getUint8(first++));
	    } return result;
	  }
	});

	var $$1Y = _export;
	var ArrayBufferModule$1 = arrayBuffer;
	var NATIVE_ARRAY_BUFFER = arrayBufferNative;

	// `DataView` constructor
	// https://tc39.es/ecma262/#sec-dataview-constructor
	$$1Y({ global: true, forced: !NATIVE_ARRAY_BUFFER }, {
	  DataView: ArrayBufferModule$1.DataView
	});

	var $$1X = _export;
	var fails$O = fails$13;

	var FORCED$p = fails$O(function () {
	  return new Date(16e11).getYear() !== 120;
	});

	var getFullYear = Date.prototype.getFullYear;

	// `Date.prototype.getYear` method
	// https://tc39.es/ecma262/#sec-date.prototype.getyear
	$$1X({ target: 'Date', proto: true, forced: FORCED$p }, {
	  getYear: function getYear() {
	    return getFullYear.call(this) - 1900;
	  }
	});

	var $$1W = _export;

	// `Date.now` method
	// https://tc39.es/ecma262/#sec-date.now
	$$1W({ target: 'Date', stat: true }, {
	  now: function now() {
	    return new Date().getTime();
	  }
	});

	var $$1V = _export;
	var toIntegerOrInfinity$8 = toIntegerOrInfinity$h;

	var getTime$3 = Date.prototype.getTime;
	var setFullYear = Date.prototype.setFullYear;

	// `Date.prototype.setYear` method
	// https://tc39.es/ecma262/#sec-date.prototype.setyear
	$$1V({ target: 'Date', proto: true }, {
	  setYear: function setYear(year) {
	    // validate
	    getTime$3.call(this);
	    var yi = toIntegerOrInfinity$8(year);
	    var yyyy = 0 <= yi && yi <= 99 ? yi + 1900 : yi;
	    return setFullYear.call(this, yyyy);
	  }
	});

	var $$1U = _export;

	// `Date.prototype.toGMTString` method
	// https://tc39.es/ecma262/#sec-date.prototype.togmtstring
	$$1U({ target: 'Date', proto: true }, {
	  toGMTString: Date.prototype.toUTCString
	});

	var toIntegerOrInfinity$7 = toIntegerOrInfinity$h;
	var toString$q = toString$u;
	var requireObjectCoercible$f = requireObjectCoercible$i;

	// `String.prototype.repeat` method implementation
	// https://tc39.es/ecma262/#sec-string.prototype.repeat
	var stringRepeat = function repeat(count) {
	  var str = toString$q(requireObjectCoercible$f(this));
	  var result = '';
	  var n = toIntegerOrInfinity$7(count);
	  if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
	  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
	  return result;
	};

	// https://github.com/tc39/proposal-string-pad-start-end
	var toLength$8 = toLength$d;
	var toString$p = toString$u;
	var repeat$2 = stringRepeat;
	var requireObjectCoercible$e = requireObjectCoercible$i;

	var ceil$1 = Math.ceil;

	// `String.prototype.{ padStart, padEnd }` methods implementation
	var createMethod$3 = function (IS_END) {
	  return function ($this, maxLength, fillString) {
	    var S = toString$p(requireObjectCoercible$e($this));
	    var intMaxLength = toLength$8(maxLength);
	    var stringLength = S.length;
	    var fillStr = fillString === undefined ? ' ' : toString$p(fillString);
	    var fillLen, stringFiller;
	    if (intMaxLength <= stringLength || fillStr == '') return S;
	    fillLen = intMaxLength - stringLength;
	    stringFiller = repeat$2.call(fillStr, ceil$1(fillLen / fillStr.length));
	    if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
	    return IS_END ? S + stringFiller : stringFiller + S;
	  };
	};

	var stringPad = {
	  // `String.prototype.padStart` method
	  // https://tc39.es/ecma262/#sec-string.prototype.padstart
	  start: createMethod$3(false),
	  // `String.prototype.padEnd` method
	  // https://tc39.es/ecma262/#sec-string.prototype.padend
	  end: createMethod$3(true)
	};

	var fails$N = fails$13;
	var padStart = stringPad.start;

	var abs$6 = Math.abs;
	var DatePrototype$2 = Date.prototype;
	var getTime$2 = DatePrototype$2.getTime;
	var nativeDateToISOString = DatePrototype$2.toISOString;

	// `Date.prototype.toISOString` method implementation
	// https://tc39.es/ecma262/#sec-date.prototype.toisostring
	// PhantomJS / old WebKit fails here:
	var dateToIsoString = (fails$N(function () {
	  return nativeDateToISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
	}) || !fails$N(function () {
	  nativeDateToISOString.call(new Date(NaN));
	})) ? function toISOString() {
	  if (!isFinite(getTime$2.call(this))) throw RangeError('Invalid time value');
	  var date = this;
	  var year = date.getUTCFullYear();
	  var milliseconds = date.getUTCMilliseconds();
	  var sign = year < 0 ? '-' : year > 9999 ? '+' : '';
	  return sign + padStart(abs$6(year), sign ? 6 : 4, 0) +
	    '-' + padStart(date.getUTCMonth() + 1, 2, 0) +
	    '-' + padStart(date.getUTCDate(), 2, 0) +
	    'T' + padStart(date.getUTCHours(), 2, 0) +
	    ':' + padStart(date.getUTCMinutes(), 2, 0) +
	    ':' + padStart(date.getUTCSeconds(), 2, 0) +
	    '.' + padStart(milliseconds, 3, 0) +
	    'Z';
	} : nativeDateToISOString;

	var $$1T = _export;
	var toISOString = dateToIsoString;

	// `Date.prototype.toISOString` method
	// https://tc39.es/ecma262/#sec-date.prototype.toisostring
	// PhantomJS / old WebKit has a broken implementations
	$$1T({ target: 'Date', proto: true, forced: Date.prototype.toISOString !== toISOString }, {
	  toISOString: toISOString
	});

	var $$1S = _export;
	var fails$M = fails$13;
	var toObject$b = toObject$q;
	var toPrimitive$1 = toPrimitive$3;

	var FORCED$o = fails$M(function () {
	  return new Date(NaN).toJSON() !== null
	    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
	});

	// `Date.prototype.toJSON` method
	// https://tc39.es/ecma262/#sec-date.prototype.tojson
	$$1S({ target: 'Date', proto: true, forced: FORCED$o }, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  toJSON: function toJSON(key) {
	    var O = toObject$b(this);
	    var pv = toPrimitive$1(O, 'number');
	    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
	  }
	});

	var anObject$m = anObject$z;
	var ordinaryToPrimitive = ordinaryToPrimitive$2;

	// `Date.prototype[@@toPrimitive](hint)` method implementation
	// https://tc39.es/ecma262/#sec-date.prototype-@@toprimitive
	var dateToPrimitive$1 = function (hint) {
	  anObject$m(this);
	  if (hint === 'string' || hint === 'default') hint = 'string';
	  else if (hint !== 'number') throw TypeError('Incorrect hint');
	  return ordinaryToPrimitive(this, hint);
	};

	var redefine$c = redefine$j.exports;
	var dateToPrimitive = dateToPrimitive$1;
	var wellKnownSymbol$d = wellKnownSymbol$x;

	var TO_PRIMITIVE = wellKnownSymbol$d('toPrimitive');
	var DatePrototype$1 = Date.prototype;

	// `Date.prototype[@@toPrimitive]` method
	// https://tc39.es/ecma262/#sec-date.prototype-@@toprimitive
	if (!(TO_PRIMITIVE in DatePrototype$1)) {
	  redefine$c(DatePrototype$1, TO_PRIMITIVE, dateToPrimitive);
	}

	var redefine$b = redefine$j.exports;

	var DatePrototype = Date.prototype;
	var INVALID_DATE = 'Invalid Date';
	var TO_STRING$1 = 'toString';
	var nativeDateToString = DatePrototype[TO_STRING$1];
	var getTime$1 = DatePrototype.getTime;

	// `Date.prototype.toString` method
	// https://tc39.es/ecma262/#sec-date.prototype.tostring
	if (String(new Date(NaN)) != INVALID_DATE) {
	  redefine$b(DatePrototype, TO_STRING$1, function toString() {
	    var value = getTime$1.call(this);
	    // eslint-disable-next-line no-self-compare -- NaN check
	    return value === value ? nativeDateToString.call(this) : INVALID_DATE;
	  });
	}

	var $$1R = _export;
	var toString$o = toString$u;

	var raw = /[\w*+\-./@]/;

	var hex$1 = function (code, length) {
	  var result = code.toString(16);
	  while (result.length < length) result = '0' + result;
	  return result;
	};

	// `escape` method
	// https://tc39.es/ecma262/#sec-escape-string
	$$1R({ global: true }, {
	  escape: function escape(string) {
	    var str = toString$o(string);
	    var result = '';
	    var length = str.length;
	    var index = 0;
	    var chr, code;
	    while (index < length) {
	      chr = str.charAt(index++);
	      if (raw.test(chr)) {
	        result += chr;
	      } else {
	        code = chr.charCodeAt(0);
	        if (code < 256) {
	          result += '%' + hex$1(code, 2);
	        } else {
	          result += '%u' + hex$1(code, 4).toUpperCase();
	        }
	      }
	    } return result;
	  }
	});

	var aCallable$8 = aCallable$f;
	var isObject$t = isObject$G;

	var slice$2 = [].slice;
	var factories = {};

	var construct = function (C, argsLength, args) {
	  if (!(argsLength in factories)) {
	    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
	    // eslint-disable-next-line no-new-func -- we have no proper alternatives, IE8- only
	    factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
	  } return factories[argsLength](C, args);
	};

	// `Function.prototype.bind` method implementation
	// https://tc39.es/ecma262/#sec-function.prototype.bind
	var functionBind = Function.bind || function bind(that /* , ...args */) {
	  var fn = aCallable$8(this);
	  var partArgs = slice$2.call(arguments, 1);
	  var boundFunction = function bound(/* args... */) {
	    var args = partArgs.concat(slice$2.call(arguments));
	    return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
	  };
	  if (isObject$t(fn.prototype)) boundFunction.prototype = fn.prototype;
	  return boundFunction;
	};

	var $$1Q = _export;
	var bind$6 = functionBind;

	// `Function.prototype.bind` method
	// https://tc39.es/ecma262/#sec-function.prototype.bind
	$$1Q({ target: 'Function', proto: true }, {
	  bind: bind$6
	});

	var isCallable$b = isCallable$u;
	var isObject$s = isObject$G;
	var definePropertyModule$5 = objectDefineProperty;
	var getPrototypeOf$4 = objectGetPrototypeOf$1;
	var wellKnownSymbol$c = wellKnownSymbol$x;

	var HAS_INSTANCE = wellKnownSymbol$c('hasInstance');
	var FunctionPrototype$1 = Function.prototype;

	// `Function.prototype[@@hasInstance]` method
	// https://tc39.es/ecma262/#sec-function.prototype-@@hasinstance
	if (!(HAS_INSTANCE in FunctionPrototype$1)) {
	  definePropertyModule$5.f(FunctionPrototype$1, HAS_INSTANCE, { value: function (O) {
	    if (!isCallable$b(this) || !isObject$s(O)) return false;
	    if (!isObject$s(this.prototype)) return O instanceof this;
	    // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
	    while (O = getPrototypeOf$4(O)) if (this.prototype === O) return true;
	    return false;
	  } });
	}

	var DESCRIPTORS$l = descriptors;
	var FUNCTION_NAME_EXISTS = functionName.EXISTS;
	var defineProperty$a = objectDefineProperty.f;

	var FunctionPrototype = Function.prototype;
	var FunctionPrototypeToString = FunctionPrototype.toString;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME = 'name';

	// Function instances `.name` property
	// https://tc39.es/ecma262/#sec-function-instances-name
	if (DESCRIPTORS$l && !FUNCTION_NAME_EXISTS) {
	  defineProperty$a(FunctionPrototype, NAME, {
	    configurable: true,
	    get: function () {
	      try {
	        return FunctionPrototypeToString.call(this).match(nameRE)[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	var $$1P = _export;
	var global$w = global$O;

	// `globalThis` object
	// https://tc39.es/ecma262/#sec-globalthis
	$$1P({ global: true }, {
	  globalThis: global$w
	});

	var $$1O = _export;
	var getBuiltIn$7 = getBuiltIn$f;
	var fails$L = fails$13;

	var $stringify = getBuiltIn$7('JSON', 'stringify');
	var re = /[\uD800-\uDFFF]/g;
	var low = /^[\uD800-\uDBFF]$/;
	var hi = /^[\uDC00-\uDFFF]$/;

	var fix = function (match, offset, string) {
	  var prev = string.charAt(offset - 1);
	  var next = string.charAt(offset + 1);
	  if ((low.test(match) && !hi.test(next)) || (hi.test(match) && !low.test(prev))) {
	    return '\\u' + match.charCodeAt(0).toString(16);
	  } return match;
	};

	var FORCED$n = fails$L(function () {
	  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
	    || $stringify('\uDEAD') !== '"\\udead"';
	});

	if ($stringify) {
	  // `JSON.stringify` method
	  // https://tc39.es/ecma262/#sec-json.stringify
	  // https://github.com/tc39/proposal-well-formed-stringify
	  $$1O({ target: 'JSON', stat: true, forced: FORCED$n }, {
	    // eslint-disable-next-line no-unused-vars -- required for `.length`
	    stringify: function stringify(it, replacer, space) {
	      var result = $stringify.apply(null, arguments);
	      return typeof result == 'string' ? result.replace(re, fix) : result;
	    }
	  });
	}

	var global$v = global$O;
	var setToStringTag$6 = setToStringTag$b;

	// JSON[@@toStringTag] property
	// https://tc39.es/ecma262/#sec-json-@@tostringtag
	setToStringTag$6(global$v.JSON, 'JSON', true);

	var internalMetadata = {exports: {}};

	var fails$K = fails$13;

	var freezing = !fails$K(function () {
	  // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
	  return Object.isExtensible(Object.preventExtensions({}));
	});

	var $$1N = _export;
	var hiddenKeys = hiddenKeys$6;
	var isObject$r = isObject$G;
	var hasOwn$8 = hasOwnProperty_1;
	var defineProperty$9 = objectDefineProperty.f;
	var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
	var getOwnPropertyNamesExternalModule = objectGetOwnPropertyNamesExternal;
	var uid = uid$5;
	var FREEZING$4 = freezing;

	var REQUIRED = false;
	var METADATA = uid('meta');
	var id$1 = 0;

	// eslint-disable-next-line es/no-object-isextensible -- safe
	var isExtensible$1 = Object.isExtensible || function () {
	  return true;
	};

	var setMetadata = function (it) {
	  defineProperty$9(it, METADATA, { value: {
	    objectID: 'O' + id$1++, // object ID
	    weakData: {}          // weak collections IDs
	  } });
	};

	var fastKey$1 = function (it, create) {
	  // return a primitive with prefix
	  if (!isObject$r(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!hasOwn$8(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible$1(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMetadata(it);
	  // return object ID
	  } return it[METADATA].objectID;
	};

	var getWeakData$1 = function (it, create) {
	  if (!hasOwn$8(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible$1(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMetadata(it);
	  // return the store of weak collections IDs
	  } return it[METADATA].weakData;
	};

	// add metadata on freeze-family methods calling
	var onFreeze$3 = function (it) {
	  if (FREEZING$4 && REQUIRED && isExtensible$1(it) && !hasOwn$8(it, METADATA)) setMetadata(it);
	  return it;
	};

	var enable = function () {
	  meta.enable = function () { /* empty */ };
	  REQUIRED = true;
	  var getOwnPropertyNames = getOwnPropertyNamesModule.f;
	  var splice = [].splice;
	  var test = {};
	  test[METADATA] = 1;

	  // prevent exposing of metadata key
	  if (getOwnPropertyNames(test).length) {
	    getOwnPropertyNamesModule.f = function (it) {
	      var result = getOwnPropertyNames(it);
	      for (var i = 0, length = result.length; i < length; i++) {
	        if (result[i] === METADATA) {
	          splice.call(result, i, 1);
	          break;
	        }
	      } return result;
	    };

	    $$1N({ target: 'Object', stat: true, forced: true }, {
	      getOwnPropertyNames: getOwnPropertyNamesExternalModule.f
	    });
	  }
	};

	var meta = internalMetadata.exports = {
	  enable: enable,
	  fastKey: fastKey$1,
	  getWeakData: getWeakData$1,
	  onFreeze: onFreeze$3
	};

	hiddenKeys[METADATA] = true;

	var isCallable$a = isCallable$u;
	var isObject$q = isObject$G;
	var setPrototypeOf$3 = objectSetPrototypeOf$1;

	// makes subclassing work correct for wrapped built-ins
	var inheritIfRequired$4 = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if (
	    // it can work only with native `setPrototypeOf`
	    setPrototypeOf$3 &&
	    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	    isCallable$a(NewTarget = dummy.constructor) &&
	    NewTarget !== Wrapper &&
	    isObject$q(NewTargetPrototype = NewTarget.prototype) &&
	    NewTargetPrototype !== Wrapper.prototype
	  ) setPrototypeOf$3($this, NewTargetPrototype);
	  return $this;
	};

	var $$1M = _export;
	var global$u = global$O;
	var isForced$3 = isForced_1;
	var redefine$a = redefine$j.exports;
	var InternalMetadataModule$1 = internalMetadata.exports;
	var iterate$6 = iterate$8;
	var anInstance$6 = anInstance$8;
	var isCallable$9 = isCallable$u;
	var isObject$p = isObject$G;
	var fails$J = fails$13;
	var checkCorrectnessOfIteration$2 = checkCorrectnessOfIteration$4;
	var setToStringTag$5 = setToStringTag$b;
	var inheritIfRequired$3 = inheritIfRequired$4;

	var collection$4 = function (CONSTRUCTOR_NAME, wrapper, common) {
	  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
	  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
	  var ADDER = IS_MAP ? 'set' : 'add';
	  var NativeConstructor = global$u[CONSTRUCTOR_NAME];
	  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
	  var Constructor = NativeConstructor;
	  var exported = {};

	  var fixMethod = function (KEY) {
	    var nativeMethod = NativePrototype[KEY];
	    redefine$a(NativePrototype, KEY,
	      KEY == 'add' ? function add(value) {
	        nativeMethod.call(this, value === 0 ? 0 : value);
	        return this;
	      } : KEY == 'delete' ? function (key) {
	        return IS_WEAK && !isObject$p(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
	      } : KEY == 'get' ? function get(key) {
	        return IS_WEAK && !isObject$p(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
	      } : KEY == 'has' ? function has(key) {
	        return IS_WEAK && !isObject$p(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
	      } : function set(key, value) {
	        nativeMethod.call(this, key === 0 ? 0 : key, value);
	        return this;
	      }
	    );
	  };

	  var REPLACE = isForced$3(
	    CONSTRUCTOR_NAME,
	    !isCallable$9(NativeConstructor) || !(IS_WEAK || NativePrototype.forEach && !fails$J(function () {
	      new NativeConstructor().entries().next();
	    }))
	  );

	  if (REPLACE) {
	    // create collection constructor
	    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
	    InternalMetadataModule$1.enable();
	  } else if (isForced$3(CONSTRUCTOR_NAME, true)) {
	    var instance = new Constructor();
	    // early implementations not supports chaining
	    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
	    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
	    var THROWS_ON_PRIMITIVES = fails$J(function () { instance.has(1); });
	    // most early implementations doesn't supports iterables, most modern - not close it correctly
	    // eslint-disable-next-line no-new -- required for testing
	    var ACCEPT_ITERABLES = checkCorrectnessOfIteration$2(function (iterable) { new NativeConstructor(iterable); });
	    // for early implementations -0 and +0 not the same
	    var BUGGY_ZERO = !IS_WEAK && fails$J(function () {
	      // V8 ~ Chromium 42- fails only with 5+ elements
	      var $instance = new NativeConstructor();
	      var index = 5;
	      while (index--) $instance[ADDER](index, index);
	      return !$instance.has(-0);
	    });

	    if (!ACCEPT_ITERABLES) {
	      Constructor = wrapper(function (dummy, iterable) {
	        anInstance$6(dummy, Constructor, CONSTRUCTOR_NAME);
	        var that = inheritIfRequired$3(new NativeConstructor(), dummy, Constructor);
	        if (iterable != undefined) iterate$6(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
	        return that;
	      });
	      Constructor.prototype = NativePrototype;
	      NativePrototype.constructor = Constructor;
	    }

	    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }

	    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

	    // weak collections should not contains .clear method
	    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
	  }

	  exported[CONSTRUCTOR_NAME] = Constructor;
	  $$1M({ global: true, forced: Constructor != NativeConstructor }, exported);

	  setToStringTag$5(Constructor, CONSTRUCTOR_NAME);

	  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

	  return Constructor;
	};

	var defineProperty$8 = objectDefineProperty.f;
	var create$5 = objectCreate$1;
	var redefineAll$4 = redefineAll$6;
	var bind$5 = functionBindContext;
	var anInstance$5 = anInstance$8;
	var iterate$5 = iterate$8;
	var defineIterator$1 = defineIterator$3;
	var setSpecies$3 = setSpecies$6;
	var DESCRIPTORS$k = descriptors;
	var fastKey = internalMetadata.exports.fastKey;
	var InternalStateModule$7 = internalState;

	var setInternalState$7 = InternalStateModule$7.set;
	var internalStateGetterFor$1 = InternalStateModule$7.getterFor;

	var collectionStrong$2 = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      anInstance$5(that, C, CONSTRUCTOR_NAME);
	      setInternalState$7(that, {
	        type: CONSTRUCTOR_NAME,
	        index: create$5(null),
	        first: undefined,
	        last: undefined,
	        size: 0
	      });
	      if (!DESCRIPTORS$k) that.size = 0;
	      if (iterable != undefined) iterate$5(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
	    });

	    var getInternalState = internalStateGetterFor$1(CONSTRUCTOR_NAME);

	    var define = function (that, key, value) {
	      var state = getInternalState(that);
	      var entry = getEntry(that, key);
	      var previous, index;
	      // change existing entry
	      if (entry) {
	        entry.value = value;
	      // create new entry
	      } else {
	        state.last = entry = {
	          index: index = fastKey(key, true),
	          key: key,
	          value: value,
	          previous: previous = state.last,
	          next: undefined,
	          removed: false
	        };
	        if (!state.first) state.first = entry;
	        if (previous) previous.next = entry;
	        if (DESCRIPTORS$k) state.size++;
	        else that.size++;
	        // add to index
	        if (index !== 'F') state.index[index] = entry;
	      } return that;
	    };

	    var getEntry = function (that, key) {
	      var state = getInternalState(that);
	      // fast case
	      var index = fastKey(key);
	      var entry;
	      if (index !== 'F') return state.index[index];
	      // frozen object case
	      for (entry = state.first; entry; entry = entry.next) {
	        if (entry.key == key) return entry;
	      }
	    };

	    redefineAll$4(C.prototype, {
	      // `{ Map, Set }.prototype.clear()` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.clear
	      // https://tc39.es/ecma262/#sec-set.prototype.clear
	      clear: function clear() {
	        var that = this;
	        var state = getInternalState(that);
	        var data = state.index;
	        var entry = state.first;
	        while (entry) {
	          entry.removed = true;
	          if (entry.previous) entry.previous = entry.previous.next = undefined;
	          delete data[entry.index];
	          entry = entry.next;
	        }
	        state.first = state.last = undefined;
	        if (DESCRIPTORS$k) state.size = 0;
	        else that.size = 0;
	      },
	      // `{ Map, Set }.prototype.delete(key)` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.delete
	      // https://tc39.es/ecma262/#sec-set.prototype.delete
	      'delete': function (key) {
	        var that = this;
	        var state = getInternalState(that);
	        var entry = getEntry(that, key);
	        if (entry) {
	          var next = entry.next;
	          var prev = entry.previous;
	          delete state.index[entry.index];
	          entry.removed = true;
	          if (prev) prev.next = next;
	          if (next) next.previous = prev;
	          if (state.first == entry) state.first = next;
	          if (state.last == entry) state.last = prev;
	          if (DESCRIPTORS$k) state.size--;
	          else that.size--;
	        } return !!entry;
	      },
	      // `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.foreach
	      // https://tc39.es/ecma262/#sec-set.prototype.foreach
	      forEach: function forEach(callbackfn /* , that = undefined */) {
	        var state = getInternalState(this);
	        var boundFunction = bind$5(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
	        var entry;
	        while (entry = entry ? entry.next : state.first) {
	          boundFunction(entry.value, entry.key, this);
	          // revert to the last existing entry
	          while (entry && entry.removed) entry = entry.previous;
	        }
	      },
	      // `{ Map, Set}.prototype.has(key)` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.has
	      // https://tc39.es/ecma262/#sec-set.prototype.has
	      has: function has(key) {
	        return !!getEntry(this, key);
	      }
	    });

	    redefineAll$4(C.prototype, IS_MAP ? {
	      // `Map.prototype.get(key)` method
	      // https://tc39.es/ecma262/#sec-map.prototype.get
	      get: function get(key) {
	        var entry = getEntry(this, key);
	        return entry && entry.value;
	      },
	      // `Map.prototype.set(key, value)` method
	      // https://tc39.es/ecma262/#sec-map.prototype.set
	      set: function set(key, value) {
	        return define(this, key === 0 ? 0 : key, value);
	      }
	    } : {
	      // `Set.prototype.add(value)` method
	      // https://tc39.es/ecma262/#sec-set.prototype.add
	      add: function add(value) {
	        return define(this, value = value === 0 ? 0 : value, value);
	      }
	    });
	    if (DESCRIPTORS$k) defineProperty$8(C.prototype, 'size', {
	      get: function () {
	        return getInternalState(this).size;
	      }
	    });
	    return C;
	  },
	  setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
	    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
	    var getInternalCollectionState = internalStateGetterFor$1(CONSTRUCTOR_NAME);
	    var getInternalIteratorState = internalStateGetterFor$1(ITERATOR_NAME);
	    // `{ Map, Set }.prototype.{ keys, values, entries, @@iterator }()` methods
	    // https://tc39.es/ecma262/#sec-map.prototype.entries
	    // https://tc39.es/ecma262/#sec-map.prototype.keys
	    // https://tc39.es/ecma262/#sec-map.prototype.values
	    // https://tc39.es/ecma262/#sec-map.prototype-@@iterator
	    // https://tc39.es/ecma262/#sec-set.prototype.entries
	    // https://tc39.es/ecma262/#sec-set.prototype.keys
	    // https://tc39.es/ecma262/#sec-set.prototype.values
	    // https://tc39.es/ecma262/#sec-set.prototype-@@iterator
	    defineIterator$1(C, CONSTRUCTOR_NAME, function (iterated, kind) {
	      setInternalState$7(this, {
	        type: ITERATOR_NAME,
	        target: iterated,
	        state: getInternalCollectionState(iterated),
	        kind: kind,
	        last: undefined
	      });
	    }, function () {
	      var state = getInternalIteratorState(this);
	      var kind = state.kind;
	      var entry = state.last;
	      // revert to the last existing entry
	      while (entry && entry.removed) entry = entry.previous;
	      // get next entry
	      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
	        // or finish the iteration
	        state.target = undefined;
	        return { value: undefined, done: true };
	      }
	      // return step by kind
	      if (kind == 'keys') return { value: entry.key, done: false };
	      if (kind == 'values') return { value: entry.value, done: false };
	      return { value: [entry.key, entry.value], done: false };
	    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

	    // `{ Map, Set }.prototype[@@species]` accessors
	    // https://tc39.es/ecma262/#sec-get-map-@@species
	    // https://tc39.es/ecma262/#sec-get-set-@@species
	    setSpecies$3(CONSTRUCTOR_NAME);
	  }
	};

	var collection$3 = collection$4;
	var collectionStrong$1 = collectionStrong$2;

	// `Map` constructor
	// https://tc39.es/ecma262/#sec-map-objects
	collection$3('Map', function (init) {
	  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong$1);

	var log$7 = Math.log;

	// `Math.log1p` method implementation
	// https://tc39.es/ecma262/#sec-math.log1p
	// eslint-disable-next-line es/no-math-log1p -- safe
	var mathLog1p = Math.log1p || function log1p(x) {
	  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log$7(1 + x);
	};

	var $$1L = _export;
	var log1p$1 = mathLog1p;

	// eslint-disable-next-line es/no-math-acosh -- required for testing
	var $acosh = Math.acosh;
	var log$6 = Math.log;
	var sqrt$2 = Math.sqrt;
	var LN2$1 = Math.LN2;

	var FORCED$m = !$acosh
	  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
	  || Math.floor($acosh(Number.MAX_VALUE)) != 710
	  // Tor Browser bug: Math.acosh(Infinity) -> NaN
	  || $acosh(Infinity) != Infinity;

	// `Math.acosh` method
	// https://tc39.es/ecma262/#sec-math.acosh
	$$1L({ target: 'Math', stat: true, forced: FORCED$m }, {
	  acosh: function acosh(x) {
	    return (x = +x) < 1 ? NaN : x > 94906265.62425156
	      ? log$6(x) + LN2$1
	      : log1p$1(x - 1 + sqrt$2(x - 1) * sqrt$2(x + 1));
	  }
	});

	var $$1K = _export;

	// eslint-disable-next-line es/no-math-asinh -- required for testing
	var $asinh = Math.asinh;
	var log$5 = Math.log;
	var sqrt$1 = Math.sqrt;

	function asinh(x) {
	  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log$5(x + sqrt$1(x * x + 1));
	}

	// `Math.asinh` method
	// https://tc39.es/ecma262/#sec-math.asinh
	// Tor Browser bug: Math.asinh(0) -> -0
	$$1K({ target: 'Math', stat: true, forced: !($asinh && 1 / $asinh(0) > 0) }, {
	  asinh: asinh
	});

	var $$1J = _export;

	// eslint-disable-next-line es/no-math-atanh -- required for testing
	var $atanh = Math.atanh;
	var log$4 = Math.log;

	// `Math.atanh` method
	// https://tc39.es/ecma262/#sec-math.atanh
	// Tor Browser bug: Math.atanh(-0) -> 0
	$$1J({ target: 'Math', stat: true, forced: !($atanh && 1 / $atanh(-0) < 0) }, {
	  atanh: function atanh(x) {
	    return (x = +x) == 0 ? x : log$4((1 + x) / (1 - x)) / 2;
	  }
	});

	// `Math.sign` method implementation
	// https://tc39.es/ecma262/#sec-math.sign
	// eslint-disable-next-line es/no-math-sign -- safe
	var mathSign = Math.sign || function sign(x) {
	  // eslint-disable-next-line no-self-compare -- NaN check
	  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
	};

	var $$1I = _export;
	var sign$2 = mathSign;

	var abs$5 = Math.abs;
	var pow$3 = Math.pow;

	// `Math.cbrt` method
	// https://tc39.es/ecma262/#sec-math.cbrt
	$$1I({ target: 'Math', stat: true }, {
	  cbrt: function cbrt(x) {
	    return sign$2(x = +x) * pow$3(abs$5(x), 1 / 3);
	  }
	});

	var $$1H = _export;

	var floor$7 = Math.floor;
	var log$3 = Math.log;
	var LOG2E = Math.LOG2E;

	// `Math.clz32` method
	// https://tc39.es/ecma262/#sec-math.clz32
	$$1H({ target: 'Math', stat: true }, {
	  clz32: function clz32(x) {
	    return (x >>>= 0) ? 31 - floor$7(log$3(x + 0.5) * LOG2E) : 32;
	  }
	});

	// eslint-disable-next-line es/no-math-expm1 -- safe
	var $expm1 = Math.expm1;
	var exp$2 = Math.exp;

	// `Math.expm1` method implementation
	// https://tc39.es/ecma262/#sec-math.expm1
	var mathExpm1 = (!$expm1
	  // Old FF bug
	  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
	  // Tor Browser bug
	  || $expm1(-2e-17) != -2e-17
	) ? function expm1(x) {
	  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp$2(x) - 1;
	} : $expm1;

	var $$1G = _export;
	var expm1$3 = mathExpm1;

	// eslint-disable-next-line es/no-math-cosh -- required for testing
	var $cosh = Math.cosh;
	var abs$4 = Math.abs;
	var E$1 = Math.E;

	// `Math.cosh` method
	// https://tc39.es/ecma262/#sec-math.cosh
	$$1G({ target: 'Math', stat: true, forced: !$cosh || $cosh(710) === Infinity }, {
	  cosh: function cosh(x) {
	    var t = expm1$3(abs$4(x) - 1) + 1;
	    return (t + 1 / (t * E$1 * E$1)) * (E$1 / 2);
	  }
	});

	var $$1F = _export;
	var expm1$2 = mathExpm1;

	// `Math.expm1` method
	// https://tc39.es/ecma262/#sec-math.expm1
	// eslint-disable-next-line es/no-math-expm1 -- required for testing
	$$1F({ target: 'Math', stat: true, forced: expm1$2 != Math.expm1 }, { expm1: expm1$2 });

	var sign$1 = mathSign;

	var abs$3 = Math.abs;
	var pow$2 = Math.pow;
	var EPSILON = pow$2(2, -52);
	var EPSILON32 = pow$2(2, -23);
	var MAX32 = pow$2(2, 127) * (2 - EPSILON32);
	var MIN32 = pow$2(2, -126);

	var roundTiesToEven = function (n) {
	  return n + 1 / EPSILON - 1 / EPSILON;
	};

	// `Math.fround` method implementation
	// https://tc39.es/ecma262/#sec-math.fround
	// eslint-disable-next-line es/no-math-fround -- safe
	var mathFround = Math.fround || function fround(x) {
	  var $abs = abs$3(x);
	  var $sign = sign$1(x);
	  var a, result;
	  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
	  a = (1 + EPSILON32 / EPSILON) * $abs;
	  result = a - (a - $abs);
	  // eslint-disable-next-line no-self-compare -- NaN check
	  if (result > MAX32 || result != result) return $sign * Infinity;
	  return $sign * result;
	};

	var $$1E = _export;
	var fround = mathFround;

	// `Math.fround` method
	// https://tc39.es/ecma262/#sec-math.fround
	$$1E({ target: 'Math', stat: true }, { fround: fround });

	var $$1D = _export;

	// eslint-disable-next-line es/no-math-hypot -- required for testing
	var $hypot = Math.hypot;
	var abs$2 = Math.abs;
	var sqrt = Math.sqrt;

	// Chrome 77 bug
	// https://bugs.chromium.org/p/v8/issues/detail?id=9546
	var BUGGY = !!$hypot && $hypot(Infinity, NaN) !== Infinity;

	// `Math.hypot` method
	// https://tc39.es/ecma262/#sec-math.hypot
	$$1D({ target: 'Math', stat: true, forced: BUGGY }, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  hypot: function hypot(value1, value2) {
	    var sum = 0;
	    var i = 0;
	    var aLen = arguments.length;
	    var larg = 0;
	    var arg, div;
	    while (i < aLen) {
	      arg = abs$2(arguments[i++]);
	      if (larg < arg) {
	        div = larg / arg;
	        sum = sum * div * div + 1;
	        larg = arg;
	      } else if (arg > 0) {
	        div = arg / larg;
	        sum += div * div;
	      } else sum += arg;
	    }
	    return larg === Infinity ? Infinity : larg * sqrt(sum);
	  }
	});

	var $$1C = _export;
	var fails$I = fails$13;

	// eslint-disable-next-line es/no-math-imul -- required for testing
	var $imul = Math.imul;

	var FORCED$l = fails$I(function () {
	  return $imul(0xFFFFFFFF, 5) != -5 || $imul.length != 2;
	});

	// `Math.imul` method
	// https://tc39.es/ecma262/#sec-math.imul
	// some WebKit versions fails with big numbers, some has wrong arity
	$$1C({ target: 'Math', stat: true, forced: FORCED$l }, {
	  imul: function imul(x, y) {
	    var UINT16 = 0xFFFF;
	    var xn = +x;
	    var yn = +y;
	    var xl = UINT16 & xn;
	    var yl = UINT16 & yn;
	    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
	  }
	});

	var $$1B = _export;

	var log$2 = Math.log;
	var LOG10E = Math.LOG10E;

	// `Math.log10` method
	// https://tc39.es/ecma262/#sec-math.log10
	$$1B({ target: 'Math', stat: true }, {
	  log10: function log10(x) {
	    return log$2(x) * LOG10E;
	  }
	});

	var $$1A = _export;
	var log1p = mathLog1p;

	// `Math.log1p` method
	// https://tc39.es/ecma262/#sec-math.log1p
	$$1A({ target: 'Math', stat: true }, { log1p: log1p });

	var $$1z = _export;

	var log$1 = Math.log;
	var LN2 = Math.LN2;

	// `Math.log2` method
	// https://tc39.es/ecma262/#sec-math.log2
	$$1z({ target: 'Math', stat: true }, {
	  log2: function log2(x) {
	    return log$1(x) / LN2;
	  }
	});

	var $$1y = _export;
	var sign = mathSign;

	// `Math.sign` method
	// https://tc39.es/ecma262/#sec-math.sign
	$$1y({ target: 'Math', stat: true }, {
	  sign: sign
	});

	var $$1x = _export;
	var fails$H = fails$13;
	var expm1$1 = mathExpm1;

	var abs$1 = Math.abs;
	var exp$1 = Math.exp;
	var E = Math.E;

	var FORCED$k = fails$H(function () {
	  // eslint-disable-next-line es/no-math-sinh -- required for testing
	  return Math.sinh(-2e-17) != -2e-17;
	});

	// `Math.sinh` method
	// https://tc39.es/ecma262/#sec-math.sinh
	// V8 near Chromium 38 has a problem with very small numbers
	$$1x({ target: 'Math', stat: true, forced: FORCED$k }, {
	  sinh: function sinh(x) {
	    return abs$1(x = +x) < 1 ? (expm1$1(x) - expm1$1(-x)) / 2 : (exp$1(x - 1) - exp$1(-x - 1)) * (E / 2);
	  }
	});

	var $$1w = _export;
	var expm1 = mathExpm1;

	var exp = Math.exp;

	// `Math.tanh` method
	// https://tc39.es/ecma262/#sec-math.tanh
	$$1w({ target: 'Math', stat: true }, {
	  tanh: function tanh(x) {
	    var a = expm1(x = +x);
	    var b = expm1(-x);
	    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
	  }
	});

	var setToStringTag$4 = setToStringTag$b;

	// Math[@@toStringTag] property
	// https://tc39.es/ecma262/#sec-math-@@tostringtag
	setToStringTag$4(Math, 'Math', true);

	var $$1v = _export;

	var ceil = Math.ceil;
	var floor$6 = Math.floor;

	// `Math.trunc` method
	// https://tc39.es/ecma262/#sec-math.trunc
	$$1v({ target: 'Math', stat: true }, {
	  trunc: function trunc(it) {
	    return (it > 0 ? floor$6 : ceil)(it);
	  }
	});

	var valueOf = 1.0.valueOf;

	// `thisNumberValue` abstract operation
	// https://tc39.es/ecma262/#sec-thisnumbervalue
	var thisNumberValue$3 = function (value) {
	  return valueOf.call(value);
	};

	// a string of all valid unicode whitespaces
	var whitespaces$4 = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
	  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var requireObjectCoercible$d = requireObjectCoercible$i;
	var toString$n = toString$u;
	var whitespaces$3 = whitespaces$4;

	var whitespace = '[' + whitespaces$3 + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$');

	// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
	var createMethod$2 = function (TYPE) {
	  return function ($this) {
	    var string = toString$n(requireObjectCoercible$d($this));
	    if (TYPE & 1) string = string.replace(ltrim, '');
	    if (TYPE & 2) string = string.replace(rtrim, '');
	    return string;
	  };
	};

	var stringTrim = {
	  // `String.prototype.{ trimLeft, trimStart }` methods
	  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
	  start: createMethod$2(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.es/ecma262/#sec-string.prototype.trimend
	  end: createMethod$2(2),
	  // `String.prototype.trim` method
	  // https://tc39.es/ecma262/#sec-string.prototype.trim
	  trim: createMethod$2(3)
	};

	var DESCRIPTORS$j = descriptors;
	var global$t = global$O;
	var isForced$2 = isForced_1;
	var redefine$9 = redefine$j.exports;
	var hasOwn$7 = hasOwnProperty_1;
	var inheritIfRequired$2 = inheritIfRequired$4;
	var isSymbol$5 = isSymbol$9;
	var toPrimitive = toPrimitive$3;
	var fails$G = fails$13;
	var getOwnPropertyNames$3 = objectGetOwnPropertyNames.f;
	var getOwnPropertyDescriptor$6 = objectGetOwnPropertyDescriptor.f;
	var defineProperty$7 = objectDefineProperty.f;
	var thisNumberValue$2 = thisNumberValue$3;
	var trim$2 = stringTrim.trim;

	var NUMBER = 'Number';
	var NativeNumber = global$t[NUMBER];
	var NumberPrototype = NativeNumber.prototype;

	// `ToNumeric` abstract operation
	// https://tc39.es/ecma262/#sec-tonumeric
	var toNumeric = function (value) {
	  var primValue = toPrimitive(value, 'number');
	  return typeof primValue === 'bigint' ? primValue : toNumber(primValue);
	};

	// `ToNumber` abstract operation
	// https://tc39.es/ecma262/#sec-tonumber
	var toNumber = function (argument) {
	  var it = toPrimitive(argument, 'number');
	  var first, third, radix, maxCode, digits, length, index, code;
	  if (isSymbol$5(it)) throw TypeError('Cannot convert a Symbol value to a number');
	  if (typeof it == 'string' && it.length > 2) {
	    it = trim$2(it);
	    first = it.charCodeAt(0);
	    if (first === 43 || first === 45) {
	      third = it.charCodeAt(2);
	      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
	    } else if (first === 48) {
	      switch (it.charCodeAt(1)) {
	        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
	        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
	        default: return +it;
	      }
	      digits = it.slice(2);
	      length = digits.length;
	      for (index = 0; index < length; index++) {
	        code = digits.charCodeAt(index);
	        // parseInt parses a string to a first unavailable symbol
	        // but ToNumber should return NaN if a string contains unavailable symbols
	        if (code < 48 || code > maxCode) return NaN;
	      } return parseInt(digits, radix);
	    }
	  } return +it;
	};

	// `Number` constructor
	// https://tc39.es/ecma262/#sec-number-constructor
	if (isForced$2(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
	  var NumberWrapper = function Number(value) {
	    var n = arguments.length < 1 ? 0 : NativeNumber(toNumeric(value));
	    var dummy = this;
	    // check on 1..constructor(foo) case
	    return dummy instanceof NumberWrapper && fails$G(function () { thisNumberValue$2(dummy); })
	      ? inheritIfRequired$2(Object(n), dummy, NumberWrapper) : n;
	  };
	  for (var keys$5 = DESCRIPTORS$j ? getOwnPropertyNames$3(NativeNumber) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES2015 (in case, if modules with ES2015 Number statics required before):
	    'EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,' +
	    // ESNext
	    'fromString,range'
	  ).split(','), j = 0, key; keys$5.length > j; j++) {
	    if (hasOwn$7(NativeNumber, key = keys$5[j]) && !hasOwn$7(NumberWrapper, key)) {
	      defineProperty$7(NumberWrapper, key, getOwnPropertyDescriptor$6(NativeNumber, key));
	    }
	  }
	  NumberWrapper.prototype = NumberPrototype;
	  NumberPrototype.constructor = NumberWrapper;
	  redefine$9(global$t, NUMBER, NumberWrapper);
	}

	var $$1u = _export;

	// `Number.EPSILON` constant
	// https://tc39.es/ecma262/#sec-number.epsilon
	$$1u({ target: 'Number', stat: true }, {
	  EPSILON: Math.pow(2, -52)
	});

	var global$s = global$O;

	var globalIsFinite = global$s.isFinite;

	// `Number.isFinite` method
	// https://tc39.es/ecma262/#sec-number.isfinite
	// eslint-disable-next-line es/no-number-isfinite -- safe
	var numberIsFinite$1 = Number.isFinite || function isFinite(it) {
	  return typeof it == 'number' && globalIsFinite(it);
	};

	var $$1t = _export;
	var numberIsFinite = numberIsFinite$1;

	// `Number.isFinite` method
	// https://tc39.es/ecma262/#sec-number.isfinite
	$$1t({ target: 'Number', stat: true }, { isFinite: numberIsFinite });

	var isObject$o = isObject$G;

	var floor$5 = Math.floor;

	// `IsIntegralNumber` abstract operation
	// https://tc39.es/ecma262/#sec-isintegralnumber
	// eslint-disable-next-line es/no-number-isinteger -- safe
	var isIntegralNumber$3 = Number.isInteger || function isInteger(it) {
	  return !isObject$o(it) && isFinite(it) && floor$5(it) === it;
	};

	var $$1s = _export;
	var isIntegralNumber$2 = isIntegralNumber$3;

	// `Number.isInteger` method
	// https://tc39.es/ecma262/#sec-number.isinteger
	$$1s({ target: 'Number', stat: true }, {
	  isInteger: isIntegralNumber$2
	});

	var $$1r = _export;

	// `Number.isNaN` method
	// https://tc39.es/ecma262/#sec-number.isnan
	$$1r({ target: 'Number', stat: true }, {
	  isNaN: function isNaN(number) {
	    // eslint-disable-next-line no-self-compare -- NaN check
	    return number != number;
	  }
	});

	var $$1q = _export;
	var isIntegralNumber$1 = isIntegralNumber$3;

	var abs = Math.abs;

	// `Number.isSafeInteger` method
	// https://tc39.es/ecma262/#sec-number.issafeinteger
	$$1q({ target: 'Number', stat: true }, {
	  isSafeInteger: function isSafeInteger(number) {
	    return isIntegralNumber$1(number) && abs(number) <= 0x1FFFFFFFFFFFFF;
	  }
	});

	var $$1p = _export;

	// `Number.MAX_SAFE_INTEGER` constant
	// https://tc39.es/ecma262/#sec-number.max_safe_integer
	$$1p({ target: 'Number', stat: true }, {
	  MAX_SAFE_INTEGER: 0x1FFFFFFFFFFFFF
	});

	var $$1o = _export;

	// `Number.MIN_SAFE_INTEGER` constant
	// https://tc39.es/ecma262/#sec-number.min_safe_integer
	$$1o({ target: 'Number', stat: true }, {
	  MIN_SAFE_INTEGER: -0x1FFFFFFFFFFFFF
	});

	var global$r = global$O;
	var fails$F = fails$13;
	var toString$m = toString$u;
	var trim$1 = stringTrim.trim;
	var whitespaces$2 = whitespaces$4;

	var $parseFloat$1 = global$r.parseFloat;
	var Symbol$8 = global$r.Symbol;
	var ITERATOR$5 = Symbol$8 && Symbol$8.iterator;
	var FORCED$j = 1 / $parseFloat$1(whitespaces$2 + '-0') !== -Infinity
	  // MS Edge 18- broken with boxed symbols
	  || (ITERATOR$5 && !fails$F(function () { $parseFloat$1(Object(ITERATOR$5)); }));

	// `parseFloat` method
	// https://tc39.es/ecma262/#sec-parsefloat-string
	var numberParseFloat = FORCED$j ? function parseFloat(string) {
	  var trimmedString = trim$1(toString$m(string));
	  var result = $parseFloat$1(trimmedString);
	  return result === 0 && trimmedString.charAt(0) == '-' ? -0 : result;
	} : $parseFloat$1;

	var $$1n = _export;
	var parseFloat$1 = numberParseFloat;

	// `Number.parseFloat` method
	// https://tc39.es/ecma262/#sec-number.parseFloat
	// eslint-disable-next-line es/no-number-parsefloat -- required for testing
	$$1n({ target: 'Number', stat: true, forced: Number.parseFloat != parseFloat$1 }, {
	  parseFloat: parseFloat$1
	});

	var global$q = global$O;
	var fails$E = fails$13;
	var toString$l = toString$u;
	var trim = stringTrim.trim;
	var whitespaces$1 = whitespaces$4;

	var $parseInt$1 = global$q.parseInt;
	var Symbol$7 = global$q.Symbol;
	var ITERATOR$4 = Symbol$7 && Symbol$7.iterator;
	var hex = /^[+-]?0x/i;
	var FORCED$i = $parseInt$1(whitespaces$1 + '08') !== 8 || $parseInt$1(whitespaces$1 + '0x16') !== 22
	  // MS Edge 18- broken with boxed symbols
	  || (ITERATOR$4 && !fails$E(function () { $parseInt$1(Object(ITERATOR$4)); }));

	// `parseInt` method
	// https://tc39.es/ecma262/#sec-parseint-string-radix
	var numberParseInt = FORCED$i ? function parseInt(string, radix) {
	  var S = trim(toString$l(string));
	  return $parseInt$1(S, (radix >>> 0) || (hex.test(S) ? 16 : 10));
	} : $parseInt$1;

	var $$1m = _export;
	var parseInt$1 = numberParseInt;

	// `Number.parseInt` method
	// https://tc39.es/ecma262/#sec-number.parseint
	// eslint-disable-next-line es/no-number-parseint -- required for testing
	$$1m({ target: 'Number', stat: true, forced: Number.parseInt != parseInt$1 }, {
	  parseInt: parseInt$1
	});

	var $$1l = _export;
	var toIntegerOrInfinity$6 = toIntegerOrInfinity$h;
	var thisNumberValue$1 = thisNumberValue$3;
	var repeat$1 = stringRepeat;
	var fails$D = fails$13;

	var nativeToFixed = 1.0.toFixed;
	var floor$4 = Math.floor;

	var pow$1 = function (x, n, acc) {
	  return n === 0 ? acc : n % 2 === 1 ? pow$1(x, n - 1, acc * x) : pow$1(x * x, n / 2, acc);
	};

	var log = function (x) {
	  var n = 0;
	  var x2 = x;
	  while (x2 >= 4096) {
	    n += 12;
	    x2 /= 4096;
	  }
	  while (x2 >= 2) {
	    n += 1;
	    x2 /= 2;
	  } return n;
	};

	var multiply = function (data, n, c) {
	  var index = -1;
	  var c2 = c;
	  while (++index < 6) {
	    c2 += n * data[index];
	    data[index] = c2 % 1e7;
	    c2 = floor$4(c2 / 1e7);
	  }
	};

	var divide = function (data, n) {
	  var index = 6;
	  var c = 0;
	  while (--index >= 0) {
	    c += data[index];
	    data[index] = floor$4(c / n);
	    c = (c % n) * 1e7;
	  }
	};

	var dataToString = function (data) {
	  var index = 6;
	  var s = '';
	  while (--index >= 0) {
	    if (s !== '' || index === 0 || data[index] !== 0) {
	      var t = String(data[index]);
	      s = s === '' ? t : s + repeat$1.call('0', 7 - t.length) + t;
	    }
	  } return s;
	};

	var FORCED$h = nativeToFixed && (
	  0.00008.toFixed(3) !== '0.000' ||
	  0.9.toFixed(0) !== '1' ||
	  1.255.toFixed(2) !== '1.25' ||
	  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
	) || !fails$D(function () {
	  // V8 ~ Android 4.3-
	  nativeToFixed.call({});
	});

	// `Number.prototype.toFixed` method
	// https://tc39.es/ecma262/#sec-number.prototype.tofixed
	$$1l({ target: 'Number', proto: true, forced: FORCED$h }, {
	  toFixed: function toFixed(fractionDigits) {
	    var number = thisNumberValue$1(this);
	    var fractDigits = toIntegerOrInfinity$6(fractionDigits);
	    var data = [0, 0, 0, 0, 0, 0];
	    var sign = '';
	    var result = '0';
	    var e, z, j, k;

	    if (fractDigits < 0 || fractDigits > 20) throw RangeError('Incorrect fraction digits');
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (number != number) return 'NaN';
	    if (number <= -1e21 || number >= 1e21) return String(number);
	    if (number < 0) {
	      sign = '-';
	      number = -number;
	    }
	    if (number > 1e-21) {
	      e = log(number * pow$1(2, 69, 1)) - 69;
	      z = e < 0 ? number * pow$1(2, -e, 1) : number / pow$1(2, e, 1);
	      z *= 0x10000000000000;
	      e = 52 - e;
	      if (e > 0) {
	        multiply(data, 0, z);
	        j = fractDigits;
	        while (j >= 7) {
	          multiply(data, 1e7, 0);
	          j -= 7;
	        }
	        multiply(data, pow$1(10, j, 1), 0);
	        j = e - 1;
	        while (j >= 23) {
	          divide(data, 1 << 23);
	          j -= 23;
	        }
	        divide(data, 1 << j);
	        multiply(data, 1, 1);
	        divide(data, 2);
	        result = dataToString(data);
	      } else {
	        multiply(data, 0, z);
	        multiply(data, 1 << -e, 0);
	        result = dataToString(data) + repeat$1.call('0', fractDigits);
	      }
	    }
	    if (fractDigits > 0) {
	      k = result.length;
	      result = sign + (k <= fractDigits
	        ? '0.' + repeat$1.call('0', fractDigits - k) + result
	        : result.slice(0, k - fractDigits) + '.' + result.slice(k - fractDigits));
	    } else {
	      result = sign + result;
	    } return result;
	  }
	});

	var $$1k = _export;
	var fails$C = fails$13;
	var thisNumberValue = thisNumberValue$3;

	var nativeToPrecision = 1.0.toPrecision;

	var FORCED$g = fails$C(function () {
	  // IE7-
	  return nativeToPrecision.call(1, undefined) !== '1';
	}) || !fails$C(function () {
	  // V8 ~ Android 4.3-
	  nativeToPrecision.call({});
	});

	// `Number.prototype.toPrecision` method
	// https://tc39.es/ecma262/#sec-number.prototype.toprecision
	$$1k({ target: 'Number', proto: true, forced: FORCED$g }, {
	  toPrecision: function toPrecision(precision) {
	    return precision === undefined
	      ? nativeToPrecision.call(thisNumberValue(this))
	      : nativeToPrecision.call(thisNumberValue(this), precision);
	  }
	});

	var DESCRIPTORS$i = descriptors;
	var fails$B = fails$13;
	var objectKeys$1 = objectKeys$4;
	var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
	var propertyIsEnumerableModule = objectPropertyIsEnumerable;
	var toObject$a = toObject$q;
	var IndexedObject = indexedObject;

	// eslint-disable-next-line es/no-object-assign -- safe
	var $assign = Object.assign;
	// eslint-disable-next-line es/no-object-defineproperty -- required for testing
	var defineProperty$6 = Object.defineProperty;

	// `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	var objectAssign = !$assign || fails$B(function () {
	  // should have correct order of operations (Edge bug)
	  if (DESCRIPTORS$i && $assign({ b: 1 }, $assign(defineProperty$6({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty$6(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), { b: 2 })).b !== 1) return true;
	  // should work with symbols and should have deterministic property order (V8 bug)
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line es/no-symbol -- safe
	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
	  return $assign({}, A)[symbol] != 7 || objectKeys$1($assign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
	  var T = toObject$a(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
	  var propertyIsEnumerable = propertyIsEnumerableModule.f;
	  while (argumentsLength > index) {
	    var S = IndexedObject(arguments[index++]);
	    var keys = getOwnPropertySymbols ? objectKeys$1(S).concat(getOwnPropertySymbols(S)) : objectKeys$1(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) {
	      key = keys[j++];
	      if (!DESCRIPTORS$i || propertyIsEnumerable.call(S, key)) T[key] = S[key];
	    }
	  } return T;
	} : $assign;

	var $$1j = _export;
	var assign$1 = objectAssign;

	// `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	// eslint-disable-next-line es/no-object-assign -- required for testing
	$$1j({ target: 'Object', stat: true, forced: Object.assign !== assign$1 }, {
	  assign: assign$1
	});

	var $$1i = _export;
	var DESCRIPTORS$h = descriptors;
	var create$4 = objectCreate$1;

	// `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create
	$$1i({ target: 'Object', stat: true, sham: !DESCRIPTORS$h }, {
	  create: create$4
	});

	var global$p = global$O;
	var fails$A = fails$13;
	var WEBKIT$1 = engineWebkitVersion;

	// Forced replacement object prototype accessors methods
	var objectPrototypeAccessorsForced = !fails$A(function () {
	  // This feature detection crashes old WebKit
	  // https://github.com/zloirock/core-js/issues/232
	  if (WEBKIT$1 && WEBKIT$1 < 535) return;
	  var key = Math.random();
	  // In FF throws only define methods
	  // eslint-disable-next-line no-undef, no-useless-call -- required for testing
	  __defineSetter__.call(null, key, function () { /* empty */ });
	  delete global$p[key];
	});

	var $$1h = _export;
	var DESCRIPTORS$g = descriptors;
	var FORCED$f = objectPrototypeAccessorsForced;
	var aCallable$7 = aCallable$f;
	var toObject$9 = toObject$q;
	var definePropertyModule$4 = objectDefineProperty;

	// `Object.prototype.__defineGetter__` method
	// https://tc39.es/ecma262/#sec-object.prototype.__defineGetter__
	if (DESCRIPTORS$g) {
	  $$1h({ target: 'Object', proto: true, forced: FORCED$f }, {
	    __defineGetter__: function __defineGetter__(P, getter) {
	      definePropertyModule$4.f(toObject$9(this), P, { get: aCallable$7(getter), enumerable: true, configurable: true });
	    }
	  });
	}

	var $$1g = _export;
	var DESCRIPTORS$f = descriptors;
	var defineProperties$1 = objectDefineProperties;

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	$$1g({ target: 'Object', stat: true, forced: !DESCRIPTORS$f, sham: !DESCRIPTORS$f }, {
	  defineProperties: defineProperties$1
	});

	var $$1f = _export;
	var DESCRIPTORS$e = descriptors;
	var objectDefinePropertyModile = objectDefineProperty;

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	$$1f({ target: 'Object', stat: true, forced: !DESCRIPTORS$e, sham: !DESCRIPTORS$e }, {
	  defineProperty: objectDefinePropertyModile.f
	});

	var $$1e = _export;
	var DESCRIPTORS$d = descriptors;
	var FORCED$e = objectPrototypeAccessorsForced;
	var aCallable$6 = aCallable$f;
	var toObject$8 = toObject$q;
	var definePropertyModule$3 = objectDefineProperty;

	// `Object.prototype.__defineSetter__` method
	// https://tc39.es/ecma262/#sec-object.prototype.__defineSetter__
	if (DESCRIPTORS$d) {
	  $$1e({ target: 'Object', proto: true, forced: FORCED$e }, {
	    __defineSetter__: function __defineSetter__(P, setter) {
	      definePropertyModule$3.f(toObject$8(this), P, { set: aCallable$6(setter), enumerable: true, configurable: true });
	    }
	  });
	}

	var DESCRIPTORS$c = descriptors;
	var objectKeys = objectKeys$4;
	var toIndexedObject$3 = toIndexedObject$d;
	var propertyIsEnumerable$2 = objectPropertyIsEnumerable.f;

	// `Object.{ entries, values }` methods implementation
	var createMethod$1 = function (TO_ENTRIES) {
	  return function (it) {
	    var O = toIndexedObject$3(it);
	    var keys = objectKeys(O);
	    var length = keys.length;
	    var i = 0;
	    var result = [];
	    var key;
	    while (length > i) {
	      key = keys[i++];
	      if (!DESCRIPTORS$c || propertyIsEnumerable$2.call(O, key)) {
	        result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
	      }
	    }
	    return result;
	  };
	};

	var objectToArray = {
	  // `Object.entries` method
	  // https://tc39.es/ecma262/#sec-object.entries
	  entries: createMethod$1(true),
	  // `Object.values` method
	  // https://tc39.es/ecma262/#sec-object.values
	  values: createMethod$1(false)
	};

	var $$1d = _export;
	var $entries = objectToArray.entries;

	// `Object.entries` method
	// https://tc39.es/ecma262/#sec-object.entries
	$$1d({ target: 'Object', stat: true }, {
	  entries: function entries(O) {
	    return $entries(O);
	  }
	});

	var $$1c = _export;
	var FREEZING$3 = freezing;
	var fails$z = fails$13;
	var isObject$n = isObject$G;
	var onFreeze$2 = internalMetadata.exports.onFreeze;

	// eslint-disable-next-line es/no-object-freeze -- safe
	var $freeze = Object.freeze;
	var FAILS_ON_PRIMITIVES$9 = fails$z(function () { $freeze(1); });

	// `Object.freeze` method
	// https://tc39.es/ecma262/#sec-object.freeze
	$$1c({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$9, sham: !FREEZING$3 }, {
	  freeze: function freeze(it) {
	    return $freeze && isObject$n(it) ? $freeze(onFreeze$2(it)) : it;
	  }
	});

	var $$1b = _export;
	var iterate$4 = iterate$8;
	var createProperty$1 = createProperty$7;

	// `Object.fromEntries` method
	// https://github.com/tc39/proposal-object-from-entries
	$$1b({ target: 'Object', stat: true }, {
	  fromEntries: function fromEntries(iterable) {
	    var obj = {};
	    iterate$4(iterable, function (k, v) {
	      createProperty$1(obj, k, v);
	    }, { AS_ENTRIES: true });
	    return obj;
	  }
	});

	var $$1a = _export;
	var fails$y = fails$13;
	var toIndexedObject$2 = toIndexedObject$d;
	var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var DESCRIPTORS$b = descriptors;

	var FAILS_ON_PRIMITIVES$8 = fails$y(function () { nativeGetOwnPropertyDescriptor$1(1); });
	var FORCED$d = !DESCRIPTORS$b || FAILS_ON_PRIMITIVES$8;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	$$1a({ target: 'Object', stat: true, forced: FORCED$d, sham: !DESCRIPTORS$b }, {
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
	    return nativeGetOwnPropertyDescriptor$1(toIndexedObject$2(it), key);
	  }
	});

	var $$19 = _export;
	var DESCRIPTORS$a = descriptors;
	var ownKeys$1 = ownKeys$3;
	var toIndexedObject$1 = toIndexedObject$d;
	var getOwnPropertyDescriptorModule$4 = objectGetOwnPropertyDescriptor;
	var createProperty = createProperty$7;

	// `Object.getOwnPropertyDescriptors` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
	$$19({ target: 'Object', stat: true, sham: !DESCRIPTORS$a }, {
	  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
	    var O = toIndexedObject$1(object);
	    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule$4.f;
	    var keys = ownKeys$1(O);
	    var result = {};
	    var index = 0;
	    var key, descriptor;
	    while (keys.length > index) {
	      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
	      if (descriptor !== undefined) createProperty(result, key, descriptor);
	    }
	    return result;
	  }
	});

	var $$18 = _export;
	var fails$x = fails$13;
	var getOwnPropertyNames$2 = objectGetOwnPropertyNamesExternal.f;

	// eslint-disable-next-line es/no-object-getownpropertynames -- required for testing
	var FAILS_ON_PRIMITIVES$7 = fails$x(function () { return !Object.getOwnPropertyNames(1); });

	// `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	$$18({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$7 }, {
	  getOwnPropertyNames: getOwnPropertyNames$2
	});

	var $$17 = _export;
	var fails$w = fails$13;
	var toObject$7 = toObject$q;
	var nativeGetPrototypeOf = objectGetPrototypeOf$1;
	var CORRECT_PROTOTYPE_GETTER$1 = correctPrototypeGetter;

	var FAILS_ON_PRIMITIVES$6 = fails$w(function () { nativeGetPrototypeOf(1); });

	// `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof
	$$17({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$6, sham: !CORRECT_PROTOTYPE_GETTER$1 }, {
	  getPrototypeOf: function getPrototypeOf(it) {
	    return nativeGetPrototypeOf(toObject$7(it));
	  }
	});

	var $$16 = _export;
	var hasOwn$6 = hasOwnProperty_1;

	// `Object.hasOwn` method
	// https://github.com/tc39/proposal-accessible-object-hasownproperty
	$$16({ target: 'Object', stat: true }, {
	  hasOwn: hasOwn$6
	});

	// `SameValue` abstract operation
	// https://tc39.es/ecma262/#sec-samevalue
	// eslint-disable-next-line es/no-object-is -- safe
	var sameValue$1 = Object.is || function is(x, y) {
	  // eslint-disable-next-line no-self-compare -- NaN check
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};

	var $$15 = _export;
	var is = sameValue$1;

	// `Object.is` method
	// https://tc39.es/ecma262/#sec-object.is
	$$15({ target: 'Object', stat: true }, {
	  is: is
	});

	var $$14 = _export;
	var fails$v = fails$13;
	var isObject$m = isObject$G;

	// eslint-disable-next-line es/no-object-isextensible -- safe
	var $isExtensible = Object.isExtensible;
	var FAILS_ON_PRIMITIVES$5 = fails$v(function () { $isExtensible(1); });

	// `Object.isExtensible` method
	// https://tc39.es/ecma262/#sec-object.isextensible
	$$14({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$5 }, {
	  isExtensible: function isExtensible(it) {
	    return isObject$m(it) ? $isExtensible ? $isExtensible(it) : true : false;
	  }
	});

	var $$13 = _export;
	var fails$u = fails$13;
	var isObject$l = isObject$G;

	// eslint-disable-next-line es/no-object-isfrozen -- safe
	var $isFrozen = Object.isFrozen;
	var FAILS_ON_PRIMITIVES$4 = fails$u(function () { $isFrozen(1); });

	// `Object.isFrozen` method
	// https://tc39.es/ecma262/#sec-object.isfrozen
	$$13({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$4 }, {
	  isFrozen: function isFrozen(it) {
	    return isObject$l(it) ? $isFrozen ? $isFrozen(it) : false : true;
	  }
	});

	var $$12 = _export;
	var fails$t = fails$13;
	var isObject$k = isObject$G;

	// eslint-disable-next-line es/no-object-issealed -- safe
	var $isSealed = Object.isSealed;
	var FAILS_ON_PRIMITIVES$3 = fails$t(function () { $isSealed(1); });

	// `Object.isSealed` method
	// https://tc39.es/ecma262/#sec-object.issealed
	$$12({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$3 }, {
	  isSealed: function isSealed(it) {
	    return isObject$k(it) ? $isSealed ? $isSealed(it) : false : true;
	  }
	});

	var $$11 = _export;
	var toObject$6 = toObject$q;
	var nativeKeys$2 = objectKeys$4;
	var fails$s = fails$13;

	var FAILS_ON_PRIMITIVES$2 = fails$s(function () { nativeKeys$2(1); });

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	$$11({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$2 }, {
	  keys: function keys(it) {
	    return nativeKeys$2(toObject$6(it));
	  }
	});

	var $$10 = _export;
	var DESCRIPTORS$9 = descriptors;
	var FORCED$c = objectPrototypeAccessorsForced;
	var toObject$5 = toObject$q;
	var toPropertyKey$3 = toPropertyKey$8;
	var getPrototypeOf$3 = objectGetPrototypeOf$1;
	var getOwnPropertyDescriptor$5 = objectGetOwnPropertyDescriptor.f;

	// `Object.prototype.__lookupGetter__` method
	// https://tc39.es/ecma262/#sec-object.prototype.__lookupGetter__
	if (DESCRIPTORS$9) {
	  $$10({ target: 'Object', proto: true, forced: FORCED$c }, {
	    __lookupGetter__: function __lookupGetter__(P) {
	      var O = toObject$5(this);
	      var key = toPropertyKey$3(P);
	      var desc;
	      do {
	        if (desc = getOwnPropertyDescriptor$5(O, key)) return desc.get;
	      } while (O = getPrototypeOf$3(O));
	    }
	  });
	}

	var $$$ = _export;
	var DESCRIPTORS$8 = descriptors;
	var FORCED$b = objectPrototypeAccessorsForced;
	var toObject$4 = toObject$q;
	var toPropertyKey$2 = toPropertyKey$8;
	var getPrototypeOf$2 = objectGetPrototypeOf$1;
	var getOwnPropertyDescriptor$4 = objectGetOwnPropertyDescriptor.f;

	// `Object.prototype.__lookupSetter__` method
	// https://tc39.es/ecma262/#sec-object.prototype.__lookupSetter__
	if (DESCRIPTORS$8) {
	  $$$({ target: 'Object', proto: true, forced: FORCED$b }, {
	    __lookupSetter__: function __lookupSetter__(P) {
	      var O = toObject$4(this);
	      var key = toPropertyKey$2(P);
	      var desc;
	      do {
	        if (desc = getOwnPropertyDescriptor$4(O, key)) return desc.set;
	      } while (O = getPrototypeOf$2(O));
	    }
	  });
	}

	var $$_ = _export;
	var isObject$j = isObject$G;
	var onFreeze$1 = internalMetadata.exports.onFreeze;
	var FREEZING$2 = freezing;
	var fails$r = fails$13;

	// eslint-disable-next-line es/no-object-preventextensions -- safe
	var $preventExtensions = Object.preventExtensions;
	var FAILS_ON_PRIMITIVES$1 = fails$r(function () { $preventExtensions(1); });

	// `Object.preventExtensions` method
	// https://tc39.es/ecma262/#sec-object.preventextensions
	$$_({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$1, sham: !FREEZING$2 }, {
	  preventExtensions: function preventExtensions(it) {
	    return $preventExtensions && isObject$j(it) ? $preventExtensions(onFreeze$1(it)) : it;
	  }
	});

	var $$Z = _export;
	var isObject$i = isObject$G;
	var onFreeze = internalMetadata.exports.onFreeze;
	var FREEZING$1 = freezing;
	var fails$q = fails$13;

	// eslint-disable-next-line es/no-object-seal -- safe
	var $seal = Object.seal;
	var FAILS_ON_PRIMITIVES = fails$q(function () { $seal(1); });

	// `Object.seal` method
	// https://tc39.es/ecma262/#sec-object.seal
	$$Z({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !FREEZING$1 }, {
	  seal: function seal(it) {
	    return $seal && isObject$i(it) ? $seal(onFreeze(it)) : it;
	  }
	});

	var $$Y = _export;
	var setPrototypeOf$2 = objectSetPrototypeOf$1;

	// `Object.setPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.setprototypeof
	$$Y({ target: 'Object', stat: true }, {
	  setPrototypeOf: setPrototypeOf$2
	});

	var TO_STRING_TAG_SUPPORT$1 = toStringTagSupport;
	var classof$5 = classof$b;

	// `Object.prototype.toString` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.tostring
	var objectToString$2 = TO_STRING_TAG_SUPPORT$1 ? {}.toString : function toString() {
	  return '[object ' + classof$5(this) + ']';
	};

	var TO_STRING_TAG_SUPPORT = toStringTagSupport;
	var redefine$8 = redefine$j.exports;
	var toString$k = objectToString$2;

	// `Object.prototype.toString` method
	// https://tc39.es/ecma262/#sec-object.prototype.tostring
	if (!TO_STRING_TAG_SUPPORT) {
	  redefine$8(Object.prototype, 'toString', toString$k, { unsafe: true });
	}

	var $$X = _export;
	var $values = objectToArray.values;

	// `Object.values` method
	// https://tc39.es/ecma262/#sec-object.values
	$$X({ target: 'Object', stat: true }, {
	  values: function values(O) {
	    return $values(O);
	  }
	});

	var $$W = _export;
	var $parseFloat = numberParseFloat;

	// `parseFloat` method
	// https://tc39.es/ecma262/#sec-parsefloat-string
	$$W({ global: true, forced: parseFloat != $parseFloat }, {
	  parseFloat: $parseFloat
	});

	var $$V = _export;
	var $parseInt = numberParseInt;

	// `parseInt` method
	// https://tc39.es/ecma262/#sec-parseint-string-radix
	$$V({ global: true, forced: parseInt != $parseInt }, {
	  parseInt: $parseInt
	});

	var global$o = global$O;

	var nativePromiseConstructor = global$o.Promise;

	var userAgent$4 = engineUserAgent;

	var engineIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent$4);

	var global$n = global$O;
	var isCallable$8 = isCallable$u;
	var fails$p = fails$13;
	var bind$4 = functionBindContext;
	var html = html$2;
	var createElement = documentCreateElement$2;
	var IS_IOS$1 = engineIsIos;
	var IS_NODE$3 = engineIsNode;

	var set$1 = global$n.setImmediate;
	var clear = global$n.clearImmediate;
	var process$3 = global$n.process;
	var MessageChannel = global$n.MessageChannel;
	var Dispatch = global$n.Dispatch;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var location, defer, channel, port;

	try {
	  // Deno throws a ReferenceError on `location` access without `--location` flag
	  location = global$n.location;
	} catch (error) { /* empty */ }

	var run = function (id) {
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  if (queue.hasOwnProperty(id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};

	var runner = function (id) {
	  return function () {
	    run(id);
	  };
	};

	var listener = function (event) {
	  run(event.data);
	};

	var post = function (id) {
	  // old engines have not location.origin
	  global$n.postMessage(String(id), location.protocol + '//' + location.host);
	};

	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!set$1 || !clear) {
	  set$1 = function setImmediate(fn) {
	    var args = [];
	    var argumentsLength = arguments.length;
	    var i = 1;
	    while (argumentsLength > i) args.push(arguments[i++]);
	    queue[++counter] = function () {
	      // eslint-disable-next-line no-new-func -- spec requirement
	      (isCallable$8(fn) ? fn : Function(fn)).apply(undefined, args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clear = function clearImmediate(id) {
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if (IS_NODE$3) {
	    defer = function (id) {
	      process$3.nextTick(runner(id));
	    };
	  // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(runner(id));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  // except iOS - https://github.com/zloirock/core-js/issues/624
	  } else if (MessageChannel && !IS_IOS$1) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = bind$4(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (
	    global$n.addEventListener &&
	    isCallable$8(global$n.postMessage) &&
	    !global$n.importScripts &&
	    location && location.protocol !== 'file:' &&
	    !fails$p(post)
	  ) {
	    defer = post;
	    global$n.addEventListener('message', listener, false);
	  // IE8-
	  } else if (ONREADYSTATECHANGE in createElement('script')) {
	    defer = function (id) {
	      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
	        html.removeChild(this);
	        run(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function (id) {
	      setTimeout(runner(id), 0);
	    };
	  }
	}

	var task$2 = {
	  set: set$1,
	  clear: clear
	};

	var userAgent$3 = engineUserAgent;
	var global$m = global$O;

	var engineIsIosPebble = /ipad|iphone|ipod/i.test(userAgent$3) && global$m.Pebble !== undefined;

	var userAgent$2 = engineUserAgent;

	var engineIsWebosWebkit = /web0s(?!.*chrome)/i.test(userAgent$2);

	var global$l = global$O;
	var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;
	var macrotask = task$2.set;
	var IS_IOS = engineIsIos;
	var IS_IOS_PEBBLE = engineIsIosPebble;
	var IS_WEBOS_WEBKIT = engineIsWebosWebkit;
	var IS_NODE$2 = engineIsNode;

	var MutationObserver = global$l.MutationObserver || global$l.WebKitMutationObserver;
	var document$2 = global$l.document;
	var process$2 = global$l.process;
	var Promise$3 = global$l.Promise;
	// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
	var queueMicrotaskDescriptor = getOwnPropertyDescriptor$3(global$l, 'queueMicrotask');
	var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

	var flush, head, last$2, notify$1, toggle, node, promise, then;

	// modern engines have queueMicrotask method
	if (!queueMicrotask) {
	  flush = function () {
	    var parent, fn;
	    if (IS_NODE$2 && (parent = process$2.domain)) parent.exit();
	    while (head) {
	      fn = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch (error) {
	        if (head) notify$1();
	        else last$2 = undefined;
	        throw error;
	      }
	    } last$2 = undefined;
	    if (parent) parent.enter();
	  };

	  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
	  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
	  if (!IS_IOS && !IS_NODE$2 && !IS_WEBOS_WEBKIT && MutationObserver && document$2) {
	    toggle = true;
	    node = document$2.createTextNode('');
	    new MutationObserver(flush).observe(node, { characterData: true });
	    notify$1 = function () {
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (!IS_IOS_PEBBLE && Promise$3 && Promise$3.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    promise = Promise$3.resolve(undefined);
	    // workaround of WebKit ~ iOS Safari 10.1 bug
	    promise.constructor = Promise$3;
	    then = promise.then;
	    notify$1 = function () {
	      then.call(promise, flush);
	    };
	  // Node.js without promises
	  } else if (IS_NODE$2) {
	    notify$1 = function () {
	      process$2.nextTick(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify$1 = function () {
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(global$l, flush);
	    };
	  }
	}

	var microtask$2 = queueMicrotask || function (fn) {
	  var task = { fn: fn, next: undefined };
	  if (last$2) last$2.next = task;
	  if (!head) {
	    head = task;
	    notify$1();
	  } last$2 = task;
	};

	var newPromiseCapability$2 = {};

	var aCallable$5 = aCallable$f;

	var PromiseCapability = function (C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aCallable$5(resolve);
	  this.reject = aCallable$5(reject);
	};

	// `NewPromiseCapability` abstract operation
	// https://tc39.es/ecma262/#sec-newpromisecapability
	newPromiseCapability$2.f = function (C) {
	  return new PromiseCapability(C);
	};

	var anObject$l = anObject$z;
	var isObject$h = isObject$G;
	var newPromiseCapability$1 = newPromiseCapability$2;

	var promiseResolve$2 = function (C, x) {
	  anObject$l(C);
	  if (isObject$h(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability$1.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var global$k = global$O;

	var hostReportErrors$1 = function (a, b) {
	  var console = global$k.console;
	  if (console && console.error) {
	    arguments.length === 1 ? console.error(a) : console.error(a, b);
	  }
	};

	var perform$3 = function (exec) {
	  try {
	    return { error: false, value: exec() };
	  } catch (error) {
	    return { error: true, value: error };
	  }
	};

	var engineIsBrowser = typeof window == 'object';

	var $$U = _export;
	var global$j = global$O;
	var getBuiltIn$6 = getBuiltIn$f;
	var NativePromise$1 = nativePromiseConstructor;
	var redefine$7 = redefine$j.exports;
	var redefineAll$3 = redefineAll$6;
	var setPrototypeOf$1 = objectSetPrototypeOf$1;
	var setToStringTag$3 = setToStringTag$b;
	var setSpecies$2 = setSpecies$6;
	var aCallable$4 = aCallable$f;
	var isCallable$7 = isCallable$u;
	var isObject$g = isObject$G;
	var anInstance$4 = anInstance$8;
	var inspectSource = inspectSource$4;
	var iterate$3 = iterate$8;
	var checkCorrectnessOfIteration$1 = checkCorrectnessOfIteration$4;
	var speciesConstructor$4 = speciesConstructor$6;
	var task$1 = task$2.set;
	var microtask$1 = microtask$2;
	var promiseResolve$1 = promiseResolve$2;
	var hostReportErrors = hostReportErrors$1;
	var newPromiseCapabilityModule$2 = newPromiseCapability$2;
	var perform$2 = perform$3;
	var InternalStateModule$6 = internalState;
	var isForced$1 = isForced_1;
	var wellKnownSymbol$b = wellKnownSymbol$x;
	var IS_BROWSER = engineIsBrowser;
	var IS_NODE$1 = engineIsNode;
	var V8_VERSION = engineV8Version;

	var SPECIES$1 = wellKnownSymbol$b('species');
	var PROMISE = 'Promise';
	var getInternalState$6 = InternalStateModule$6.get;
	var setInternalState$6 = InternalStateModule$6.set;
	var getInternalPromiseState = InternalStateModule$6.getterFor(PROMISE);
	var NativePromisePrototype = NativePromise$1 && NativePromise$1.prototype;
	var PromiseConstructor = NativePromise$1;
	var PromiseConstructorPrototype = NativePromisePrototype;
	var TypeError$1 = global$j.TypeError;
	var document$1 = global$j.document;
	var process$1 = global$j.process;
	var newPromiseCapability = newPromiseCapabilityModule$2.f;
	var newGenericPromiseCapability = newPromiseCapability;
	var DISPATCH_EVENT = !!(document$1 && document$1.createEvent && global$j.dispatchEvent);
	var NATIVE_REJECTION_EVENT = isCallable$7(global$j.PromiseRejectionEvent);
	var UNHANDLED_REJECTION = 'unhandledrejection';
	var REJECTION_HANDLED = 'rejectionhandled';
	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	var HANDLED = 1;
	var UNHANDLED = 2;
	var SUBCLASSING = false;
	var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

	var FORCED$a = isForced$1(PROMISE, function () {
	  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(PromiseConstructor);
	  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(PromiseConstructor);
	  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	  // We can't detect it synchronously, so just check versions
	  if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true;
	  // We can't use @@species feature detection in V8 since it causes
	  // deoptimization and performance degradation
	  // https://github.com/zloirock/core-js/issues/679
	  if (V8_VERSION >= 51 && /native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) return false;
	  // Detect correctness of subclassing with @@species support
	  var promise = new PromiseConstructor(function (resolve) { resolve(1); });
	  var FakePromise = function (exec) {
	    exec(function () { /* empty */ }, function () { /* empty */ });
	  };
	  var constructor = promise.constructor = {};
	  constructor[SPECIES$1] = FakePromise;
	  SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
	  if (!SUBCLASSING) return true;
	  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	  return !GLOBAL_CORE_JS_PROMISE && IS_BROWSER && !NATIVE_REJECTION_EVENT;
	});

	var INCORRECT_ITERATION = FORCED$a || !checkCorrectnessOfIteration$1(function (iterable) {
	  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
	});

	// helpers
	var isThenable = function (it) {
	  var then;
	  return isObject$g(it) && isCallable$7(then = it.then) ? then : false;
	};

	var notify = function (state, isReject) {
	  if (state.notified) return;
	  state.notified = true;
	  var chain = state.reactions;
	  microtask$1(function () {
	    var value = state.value;
	    var ok = state.state == FULFILLED;
	    var index = 0;
	    // variable length - can't use forEach
	    while (chain.length > index) {
	      var reaction = chain[index++];
	      var handler = ok ? reaction.ok : reaction.fail;
	      var resolve = reaction.resolve;
	      var reject = reaction.reject;
	      var domain = reaction.domain;
	      var result, then, exited;
	      try {
	        if (handler) {
	          if (!ok) {
	            if (state.rejection === UNHANDLED) onHandleUnhandled(state);
	            state.rejection = HANDLED;
	          }
	          if (handler === true) result = value;
	          else {
	            if (domain) domain.enter();
	            result = handler(value); // can throw
	            if (domain) {
	              domain.exit();
	              exited = true;
	            }
	          }
	          if (result === reaction.promise) {
	            reject(TypeError$1('Promise-chain cycle'));
	          } else if (then = isThenable(result)) {
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch (error) {
	        if (domain && !exited) domain.exit();
	        reject(error);
	      }
	    }
	    state.reactions = [];
	    state.notified = false;
	    if (isReject && !state.rejection) onUnhandled(state);
	  });
	};

	var dispatchEvent = function (name, promise, reason) {
	  var event, handler;
	  if (DISPATCH_EVENT) {
	    event = document$1.createEvent('Event');
	    event.promise = promise;
	    event.reason = reason;
	    event.initEvent(name, false, true);
	    global$j.dispatchEvent(event);
	  } else event = { promise: promise, reason: reason };
	  if (!NATIVE_REJECTION_EVENT && (handler = global$j['on' + name])) handler(event);
	  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
	};

	var onUnhandled = function (state) {
	  task$1.call(global$j, function () {
	    var promise = state.facade;
	    var value = state.value;
	    var IS_UNHANDLED = isUnhandled(state);
	    var result;
	    if (IS_UNHANDLED) {
	      result = perform$2(function () {
	        if (IS_NODE$1) {
	          process$1.emit('unhandledRejection', value, promise);
	        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      state.rejection = IS_NODE$1 || isUnhandled(state) ? UNHANDLED : HANDLED;
	      if (result.error) throw result.value;
	    }
	  });
	};

	var isUnhandled = function (state) {
	  return state.rejection !== HANDLED && !state.parent;
	};

	var onHandleUnhandled = function (state) {
	  task$1.call(global$j, function () {
	    var promise = state.facade;
	    if (IS_NODE$1) {
	      process$1.emit('rejectionHandled', promise);
	    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
	  });
	};

	var bind$3 = function (fn, state, unwrap) {
	  return function (value) {
	    fn(state, value, unwrap);
	  };
	};

	var internalReject = function (state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  state.value = value;
	  state.state = REJECTED;
	  notify(state, true);
	};

	var internalResolve = function (state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  try {
	    if (state.facade === value) throw TypeError$1("Promise can't be resolved itself");
	    var then = isThenable(value);
	    if (then) {
	      microtask$1(function () {
	        var wrapper = { done: false };
	        try {
	          then.call(value,
	            bind$3(internalResolve, wrapper, state),
	            bind$3(internalReject, wrapper, state)
	          );
	        } catch (error) {
	          internalReject(wrapper, error, state);
	        }
	      });
	    } else {
	      state.value = value;
	      state.state = FULFILLED;
	      notify(state, false);
	    }
	  } catch (error) {
	    internalReject({ done: false }, error, state);
	  }
	};

	// constructor polyfill
	if (FORCED$a) {
	  // 25.4.3.1 Promise(executor)
	  PromiseConstructor = function Promise(executor) {
	    anInstance$4(this, PromiseConstructor, PROMISE);
	    aCallable$4(executor);
	    Internal.call(this);
	    var state = getInternalState$6(this);
	    try {
	      executor(bind$3(internalResolve, state), bind$3(internalReject, state));
	    } catch (error) {
	      internalReject(state, error);
	    }
	  };
	  PromiseConstructorPrototype = PromiseConstructor.prototype;
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  Internal = function Promise(executor) {
	    setInternalState$6(this, {
	      type: PROMISE,
	      done: false,
	      notified: false,
	      parent: false,
	      reactions: [],
	      rejection: false,
	      state: PENDING,
	      value: undefined
	    });
	  };
	  Internal.prototype = redefineAll$3(PromiseConstructorPrototype, {
	    // `Promise.prototype.then` method
	    // https://tc39.es/ecma262/#sec-promise.prototype.then
	    then: function then(onFulfilled, onRejected) {
	      var state = getInternalPromiseState(this);
	      var reaction = newPromiseCapability(speciesConstructor$4(this, PromiseConstructor));
	      reaction.ok = isCallable$7(onFulfilled) ? onFulfilled : true;
	      reaction.fail = isCallable$7(onRejected) && onRejected;
	      reaction.domain = IS_NODE$1 ? process$1.domain : undefined;
	      state.parent = true;
	      state.reactions.push(reaction);
	      if (state.state != PENDING) notify(state, false);
	      return reaction.promise;
	    },
	    // `Promise.prototype.catch` method
	    // https://tc39.es/ecma262/#sec-promise.prototype.catch
	    'catch': function (onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });
	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    var state = getInternalState$6(promise);
	    this.promise = promise;
	    this.resolve = bind$3(internalResolve, state);
	    this.reject = bind$3(internalReject, state);
	  };
	  newPromiseCapabilityModule$2.f = newPromiseCapability = function (C) {
	    return C === PromiseConstructor || C === PromiseWrapper
	      ? new OwnPromiseCapability(C)
	      : newGenericPromiseCapability(C);
	  };

	  if (isCallable$7(NativePromise$1) && NativePromisePrototype !== Object.prototype) {
	    nativeThen = NativePromisePrototype.then;

	    if (!SUBCLASSING) {
	      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
	      redefine$7(NativePromisePrototype, 'then', function then(onFulfilled, onRejected) {
	        var that = this;
	        return new PromiseConstructor(function (resolve, reject) {
	          nativeThen.call(that, resolve, reject);
	        }).then(onFulfilled, onRejected);
	      // https://github.com/zloirock/core-js/issues/640
	      }, { unsafe: true });

	      // makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
	      redefine$7(NativePromisePrototype, 'catch', PromiseConstructorPrototype['catch'], { unsafe: true });
	    }

	    // make `.constructor === Promise` work for native promise-based APIs
	    try {
	      delete NativePromisePrototype.constructor;
	    } catch (error) { /* empty */ }

	    // make `instanceof Promise` work for native promise-based APIs
	    if (setPrototypeOf$1) {
	      setPrototypeOf$1(NativePromisePrototype, PromiseConstructorPrototype);
	    }
	  }
	}

	$$U({ global: true, wrap: true, forced: FORCED$a }, {
	  Promise: PromiseConstructor
	});

	setToStringTag$3(PromiseConstructor, PROMISE, false);
	setSpecies$2(PROMISE);

	PromiseWrapper = getBuiltIn$6(PROMISE);

	// statics
	$$U({ target: PROMISE, stat: true, forced: FORCED$a }, {
	  // `Promise.reject` method
	  // https://tc39.es/ecma262/#sec-promise.reject
	  reject: function reject(r) {
	    var capability = newPromiseCapability(this);
	    capability.reject.call(undefined, r);
	    return capability.promise;
	  }
	});

	$$U({ target: PROMISE, stat: true, forced: FORCED$a }, {
	  // `Promise.resolve` method
	  // https://tc39.es/ecma262/#sec-promise.resolve
	  resolve: function resolve(x) {
	    return promiseResolve$1(this, x);
	  }
	});

	$$U({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
	  // `Promise.all` method
	  // https://tc39.es/ecma262/#sec-promise.all
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform$2(function () {
	      var $promiseResolve = aCallable$4(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate$3(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        $promiseResolve.call(C, promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  },
	  // `Promise.race` method
	  // https://tc39.es/ecma262/#sec-promise.race
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var reject = capability.reject;
	    var result = perform$2(function () {
	      var $promiseResolve = aCallable$4(C.resolve);
	      iterate$3(iterable, function (promise) {
	        $promiseResolve.call(C, promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	var $$T = _export;
	var aCallable$3 = aCallable$f;
	var newPromiseCapabilityModule$1 = newPromiseCapability$2;
	var perform$1 = perform$3;
	var iterate$2 = iterate$8;

	// `Promise.allSettled` method
	// https://tc39.es/ecma262/#sec-promise.allsettled
	$$T({ target: 'Promise', stat: true }, {
	  allSettled: function allSettled(iterable) {
	    var C = this;
	    var capability = newPromiseCapabilityModule$1.f(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform$1(function () {
	      var promiseResolve = aCallable$3(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate$2(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        promiseResolve.call(C, promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = { status: 'fulfilled', value: value };
	          --remaining || resolve(values);
	        }, function (error) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = { status: 'rejected', reason: error };
	          --remaining || resolve(values);
	        });
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	var $$S = _export;
	var aCallable$2 = aCallable$f;
	var getBuiltIn$5 = getBuiltIn$f;
	var newPromiseCapabilityModule = newPromiseCapability$2;
	var perform = perform$3;
	var iterate$1 = iterate$8;

	var PROMISE_ANY_ERROR = 'No one promise resolved';

	// `Promise.any` method
	// https://tc39.es/ecma262/#sec-promise.any
	$$S({ target: 'Promise', stat: true }, {
	  any: function any(iterable) {
	    var C = this;
	    var capability = newPromiseCapabilityModule.f(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var promiseResolve = aCallable$2(C.resolve);
	      var errors = [];
	      var counter = 0;
	      var remaining = 1;
	      var alreadyResolved = false;
	      iterate$1(iterable, function (promise) {
	        var index = counter++;
	        var alreadyRejected = false;
	        errors.push(undefined);
	        remaining++;
	        promiseResolve.call(C, promise).then(function (value) {
	          if (alreadyRejected || alreadyResolved) return;
	          alreadyResolved = true;
	          resolve(value);
	        }, function (error) {
	          if (alreadyRejected || alreadyResolved) return;
	          alreadyRejected = true;
	          errors[index] = error;
	          --remaining || reject(new (getBuiltIn$5('AggregateError'))(errors, PROMISE_ANY_ERROR));
	        });
	      });
	      --remaining || reject(new (getBuiltIn$5('AggregateError'))(errors, PROMISE_ANY_ERROR));
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	var $$R = _export;
	var NativePromise = nativePromiseConstructor;
	var fails$o = fails$13;
	var getBuiltIn$4 = getBuiltIn$f;
	var isCallable$6 = isCallable$u;
	var speciesConstructor$3 = speciesConstructor$6;
	var promiseResolve = promiseResolve$2;
	var redefine$6 = redefine$j.exports;

	// Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
	var NON_GENERIC = !!NativePromise && fails$o(function () {
	  NativePromise.prototype['finally'].call({ then: function () { /* empty */ } }, function () { /* empty */ });
	});

	// `Promise.prototype.finally` method
	// https://tc39.es/ecma262/#sec-promise.prototype.finally
	$$R({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
	  'finally': function (onFinally) {
	    var C = speciesConstructor$3(this, getBuiltIn$4('Promise'));
	    var isFunction = isCallable$6(onFinally);
	    return this.then(
	      isFunction ? function (x) {
	        return promiseResolve(C, onFinally()).then(function () { return x; });
	      } : onFinally,
	      isFunction ? function (e) {
	        return promiseResolve(C, onFinally()).then(function () { throw e; });
	      } : onFinally
	    );
	  }
	});

	// makes sure that native promise-based APIs `Promise#finally` properly works with patched `Promise#then`
	if (isCallable$6(NativePromise)) {
	  var method = getBuiltIn$4('Promise').prototype['finally'];
	  if (NativePromise.prototype['finally'] !== method) {
	    redefine$6(NativePromise.prototype, 'finally', method, { unsafe: true });
	  }
	}

	var $$Q = _export;
	var getBuiltIn$3 = getBuiltIn$f;
	var aCallable$1 = aCallable$f;
	var anObject$k = anObject$z;
	var fails$n = fails$13;

	var nativeApply = getBuiltIn$3('Reflect', 'apply');
	var functionApply = Function.apply;

	// MS Edge argumentsList argument is optional
	var OPTIONAL_ARGUMENTS_LIST = !fails$n(function () {
	  nativeApply(function () { /* empty */ });
	});

	// `Reflect.apply` method
	// https://tc39.es/ecma262/#sec-reflect.apply
	$$Q({ target: 'Reflect', stat: true, forced: OPTIONAL_ARGUMENTS_LIST }, {
	  apply: function apply(target, thisArgument, argumentsList) {
	    aCallable$1(target);
	    anObject$k(argumentsList);
	    return nativeApply
	      ? nativeApply(target, thisArgument, argumentsList)
	      : functionApply.call(target, thisArgument, argumentsList);
	  }
	});

	var $$P = _export;
	var getBuiltIn$2 = getBuiltIn$f;
	var aConstructor$1 = aConstructor$3;
	var anObject$j = anObject$z;
	var isObject$f = isObject$G;
	var create$3 = objectCreate$1;
	var bind$2 = functionBind;
	var fails$m = fails$13;

	var nativeConstruct = getBuiltIn$2('Reflect', 'construct');

	// `Reflect.construct` method
	// https://tc39.es/ecma262/#sec-reflect.construct
	// MS Edge supports only 2 arguments and argumentsList argument is optional
	// FF Nightly sets third argument as `new.target`, but does not create `this` from it
	var NEW_TARGET_BUG = fails$m(function () {
	  function F() { /* empty */ }
	  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
	});
	var ARGS_BUG = !fails$m(function () {
	  nativeConstruct(function () { /* empty */ });
	});
	var FORCED$9 = NEW_TARGET_BUG || ARGS_BUG;

	$$P({ target: 'Reflect', stat: true, forced: FORCED$9, sham: FORCED$9 }, {
	  construct: function construct(Target, args /* , newTarget */) {
	    aConstructor$1(Target);
	    anObject$j(args);
	    var newTarget = arguments.length < 3 ? Target : aConstructor$1(arguments[2]);
	    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
	    if (Target == newTarget) {
	      // w/o altered newTarget, optimization for 0-4 arguments
	      switch (args.length) {
	        case 0: return new Target();
	        case 1: return new Target(args[0]);
	        case 2: return new Target(args[0], args[1]);
	        case 3: return new Target(args[0], args[1], args[2]);
	        case 4: return new Target(args[0], args[1], args[2], args[3]);
	      }
	      // w/o altered newTarget, lot of arguments case
	      var $args = [null];
	      $args.push.apply($args, args);
	      return new (bind$2.apply(Target, $args))();
	    }
	    // with altered newTarget, not support built-in constructors
	    var proto = newTarget.prototype;
	    var instance = create$3(isObject$f(proto) ? proto : Object.prototype);
	    var result = Function.apply.call(Target, instance, args);
	    return isObject$f(result) ? result : instance;
	  }
	});

	var $$O = _export;
	var DESCRIPTORS$7 = descriptors;
	var anObject$i = anObject$z;
	var toPropertyKey$1 = toPropertyKey$8;
	var definePropertyModule$2 = objectDefineProperty;
	var fails$l = fails$13;

	// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
	var ERROR_INSTEAD_OF_FALSE = fails$l(function () {
	  // eslint-disable-next-line es/no-reflect -- required for testing
	  Reflect.defineProperty(definePropertyModule$2.f({}, 1, { value: 1 }), 1, { value: 2 });
	});

	// `Reflect.defineProperty` method
	// https://tc39.es/ecma262/#sec-reflect.defineproperty
	$$O({ target: 'Reflect', stat: true, forced: ERROR_INSTEAD_OF_FALSE, sham: !DESCRIPTORS$7 }, {
	  defineProperty: function defineProperty(target, propertyKey, attributes) {
	    anObject$i(target);
	    var key = toPropertyKey$1(propertyKey);
	    anObject$i(attributes);
	    try {
	      definePropertyModule$2.f(target, key, attributes);
	      return true;
	    } catch (error) {
	      return false;
	    }
	  }
	});

	var $$N = _export;
	var anObject$h = anObject$z;
	var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;

	// `Reflect.deleteProperty` method
	// https://tc39.es/ecma262/#sec-reflect.deleteproperty
	$$N({ target: 'Reflect', stat: true }, {
	  deleteProperty: function deleteProperty(target, propertyKey) {
	    var descriptor = getOwnPropertyDescriptor$2(anObject$h(target), propertyKey);
	    return descriptor && !descriptor.configurable ? false : delete target[propertyKey];
	  }
	});

	var hasOwn$5 = hasOwnProperty_1;

	var isDataDescriptor$2 = function (descriptor) {
	  return descriptor !== undefined && (hasOwn$5(descriptor, 'value') || hasOwn$5(descriptor, 'writable'));
	};

	var $$M = _export;
	var isObject$e = isObject$G;
	var anObject$g = anObject$z;
	var isDataDescriptor$1 = isDataDescriptor$2;
	var getOwnPropertyDescriptorModule$3 = objectGetOwnPropertyDescriptor;
	var getPrototypeOf$1 = objectGetPrototypeOf$1;

	// `Reflect.get` method
	// https://tc39.es/ecma262/#sec-reflect.get
	function get(target, propertyKey /* , receiver */) {
	  var receiver = arguments.length < 3 ? target : arguments[2];
	  var descriptor, prototype;
	  if (anObject$g(target) === receiver) return target[propertyKey];
	  descriptor = getOwnPropertyDescriptorModule$3.f(target, propertyKey);
	  if (descriptor) return isDataDescriptor$1(descriptor)
	    ? descriptor.value
	    : descriptor.get === undefined ? undefined : descriptor.get.call(receiver);
	  if (isObject$e(prototype = getPrototypeOf$1(target))) return get(prototype, propertyKey, receiver);
	}

	$$M({ target: 'Reflect', stat: true }, {
	  get: get
	});

	var $$L = _export;
	var DESCRIPTORS$6 = descriptors;
	var anObject$f = anObject$z;
	var getOwnPropertyDescriptorModule$2 = objectGetOwnPropertyDescriptor;

	// `Reflect.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-reflect.getownpropertydescriptor
	$$L({ target: 'Reflect', stat: true, sham: !DESCRIPTORS$6 }, {
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
	    return getOwnPropertyDescriptorModule$2.f(anObject$f(target), propertyKey);
	  }
	});

	var $$K = _export;
	var anObject$e = anObject$z;
	var objectGetPrototypeOf = objectGetPrototypeOf$1;
	var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;

	// `Reflect.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-reflect.getprototypeof
	$$K({ target: 'Reflect', stat: true, sham: !CORRECT_PROTOTYPE_GETTER }, {
	  getPrototypeOf: function getPrototypeOf(target) {
	    return objectGetPrototypeOf(anObject$e(target));
	  }
	});

	var $$J = _export;

	// `Reflect.has` method
	// https://tc39.es/ecma262/#sec-reflect.has
	$$J({ target: 'Reflect', stat: true }, {
	  has: function has(target, propertyKey) {
	    return propertyKey in target;
	  }
	});

	var $$I = _export;
	var anObject$d = anObject$z;

	// eslint-disable-next-line es/no-object-isextensible -- safe
	var objectIsExtensible = Object.isExtensible;

	// `Reflect.isExtensible` method
	// https://tc39.es/ecma262/#sec-reflect.isextensible
	$$I({ target: 'Reflect', stat: true }, {
	  isExtensible: function isExtensible(target) {
	    anObject$d(target);
	    return objectIsExtensible ? objectIsExtensible(target) : true;
	  }
	});

	var $$H = _export;
	var ownKeys = ownKeys$3;

	// `Reflect.ownKeys` method
	// https://tc39.es/ecma262/#sec-reflect.ownkeys
	$$H({ target: 'Reflect', stat: true }, {
	  ownKeys: ownKeys
	});

	var $$G = _export;
	var getBuiltIn$1 = getBuiltIn$f;
	var anObject$c = anObject$z;
	var FREEZING = freezing;

	// `Reflect.preventExtensions` method
	// https://tc39.es/ecma262/#sec-reflect.preventextensions
	$$G({ target: 'Reflect', stat: true, sham: !FREEZING }, {
	  preventExtensions: function preventExtensions(target) {
	    anObject$c(target);
	    try {
	      var objectPreventExtensions = getBuiltIn$1('Object', 'preventExtensions');
	      if (objectPreventExtensions) objectPreventExtensions(target);
	      return true;
	    } catch (error) {
	      return false;
	    }
	  }
	});

	var $$F = _export;
	var anObject$b = anObject$z;
	var isObject$d = isObject$G;
	var isDataDescriptor = isDataDescriptor$2;
	var fails$k = fails$13;
	var definePropertyModule$1 = objectDefineProperty;
	var getOwnPropertyDescriptorModule$1 = objectGetOwnPropertyDescriptor;
	var getPrototypeOf = objectGetPrototypeOf$1;
	var createPropertyDescriptor$2 = createPropertyDescriptor$9;

	// `Reflect.set` method
	// https://tc39.es/ecma262/#sec-reflect.set
	function set(target, propertyKey, V /* , receiver */) {
	  var receiver = arguments.length < 4 ? target : arguments[3];
	  var ownDescriptor = getOwnPropertyDescriptorModule$1.f(anObject$b(target), propertyKey);
	  var existingDescriptor, prototype, setter;
	  if (!ownDescriptor) {
	    if (isObject$d(prototype = getPrototypeOf(target))) {
	      return set(prototype, propertyKey, V, receiver);
	    }
	    ownDescriptor = createPropertyDescriptor$2(0);
	  }
	  if (isDataDescriptor(ownDescriptor)) {
	    if (ownDescriptor.writable === false || !isObject$d(receiver)) return false;
	    if (existingDescriptor = getOwnPropertyDescriptorModule$1.f(receiver, propertyKey)) {
	      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
	      existingDescriptor.value = V;
	      definePropertyModule$1.f(receiver, propertyKey, existingDescriptor);
	    } else definePropertyModule$1.f(receiver, propertyKey, createPropertyDescriptor$2(0, V));
	  } else {
	    setter = ownDescriptor.set;
	    if (setter === undefined) return false;
	    setter.call(receiver, V);
	  } return true;
	}

	// MS Edge 17-18 Reflect.set allows setting the property to object
	// with non-writable property on the prototype
	var MS_EDGE_BUG = fails$k(function () {
	  var Constructor = function () { /* empty */ };
	  var object = definePropertyModule$1.f(new Constructor(), 'a', { configurable: true });
	  // eslint-disable-next-line es/no-reflect -- required for testing
	  return Reflect.set(Constructor.prototype, 'a', 1, object) !== false;
	});

	$$F({ target: 'Reflect', stat: true, forced: MS_EDGE_BUG }, {
	  set: set
	});

	var $$E = _export;
	var anObject$a = anObject$z;
	var aPossiblePrototype = aPossiblePrototype$2;
	var objectSetPrototypeOf = objectSetPrototypeOf$1;

	// `Reflect.setPrototypeOf` method
	// https://tc39.es/ecma262/#sec-reflect.setprototypeof
	if (objectSetPrototypeOf) $$E({ target: 'Reflect', stat: true }, {
	  setPrototypeOf: function setPrototypeOf(target, proto) {
	    anObject$a(target);
	    aPossiblePrototype(proto);
	    try {
	      objectSetPrototypeOf(target, proto);
	      return true;
	    } catch (error) {
	      return false;
	    }
	  }
	});

	var $$D = _export;
	var global$i = global$O;
	var setToStringTag$2 = setToStringTag$b;

	$$D({ global: true }, { Reflect: {} });

	// Reflect[@@toStringTag] property
	// https://tc39.es/ecma262/#sec-reflect-@@tostringtag
	setToStringTag$2(global$i.Reflect, 'Reflect', true);

	var isObject$c = isObject$G;
	var classof$4 = classofRaw$1;
	var wellKnownSymbol$a = wellKnownSymbol$x;

	var MATCH$2 = wellKnownSymbol$a('match');

	// `IsRegExp` abstract operation
	// https://tc39.es/ecma262/#sec-isregexp
	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject$c(it) && ((isRegExp = it[MATCH$2]) !== undefined ? !!isRegExp : classof$4(it) == 'RegExp');
	};

	var anObject$9 = anObject$z;

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags$1 = function () {
	  var that = anObject$9(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var regexpStickyHelpers = {};

	var fails$j = fails$13;
	var global$h = global$O;

	// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	var $RegExp$2 = global$h.RegExp;

	regexpStickyHelpers.UNSUPPORTED_Y = fails$j(function () {
	  var re = $RegExp$2('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	});

	regexpStickyHelpers.BROKEN_CARET = fails$j(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = $RegExp$2('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});

	var fails$i = fails$13;
	var global$g = global$O;

	// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
	var $RegExp$1 = global$g.RegExp;

	var regexpUnsupportedDotAll = fails$i(function () {
	  var re = $RegExp$1('.', 's');
	  return !(re.dotAll && re.exec('\n') && re.flags === 's');
	});

	var fails$h = fails$13;
	var global$f = global$O;

	// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
	var $RegExp = global$f.RegExp;

	var regexpUnsupportedNcg = fails$h(function () {
	  var re = $RegExp('(?<a>b)', 'g');
	  return re.exec('b').groups.a !== 'b' ||
	    'b'.replace(re, '$<a>c') !== 'bc';
	});

	var DESCRIPTORS$5 = descriptors;
	var global$e = global$O;
	var isForced = isForced_1;
	var inheritIfRequired$1 = inheritIfRequired$4;
	var createNonEnumerableProperty$4 = createNonEnumerableProperty$d;
	var defineProperty$5 = objectDefineProperty.f;
	var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
	var isRegExp$4 = isRegexp;
	var toString$j = toString$u;
	var getFlags = regexpFlags$1;
	var stickyHelpers$2 = regexpStickyHelpers;
	var redefine$5 = redefine$j.exports;
	var fails$g = fails$13;
	var hasOwn$4 = hasOwnProperty_1;
	var enforceInternalState = internalState.enforce;
	var setSpecies$1 = setSpecies$6;
	var wellKnownSymbol$9 = wellKnownSymbol$x;
	var UNSUPPORTED_DOT_ALL$2 = regexpUnsupportedDotAll;
	var UNSUPPORTED_NCG$1 = regexpUnsupportedNcg;

	var MATCH$1 = wellKnownSymbol$9('match');
	var NativeRegExp = global$e.RegExp;
	var RegExpPrototype$6 = NativeRegExp.prototype;
	// TODO: Use only propper RegExpIdentifierName
	var IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
	var re1 = /a/g;
	var re2 = /a/g;

	// "new" should create a new object, old webkit bug
	var CORRECT_NEW = new NativeRegExp(re1) !== re1;

	var UNSUPPORTED_Y$3 = stickyHelpers$2.UNSUPPORTED_Y;

	var BASE_FORCED = DESCRIPTORS$5 &&
	  (!CORRECT_NEW || UNSUPPORTED_Y$3 || UNSUPPORTED_DOT_ALL$2 || UNSUPPORTED_NCG$1 || fails$g(function () {
	    re2[MATCH$1] = false;
	    // RegExp constructor can alter flags and IsRegExp works correct with @@match
	    return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
	  }));

	var handleDotAll = function (string) {
	  var length = string.length;
	  var index = 0;
	  var result = '';
	  var brackets = false;
	  var chr;
	  for (; index <= length; index++) {
	    chr = string.charAt(index);
	    if (chr === '\\') {
	      result += chr + string.charAt(++index);
	      continue;
	    }
	    if (!brackets && chr === '.') {
	      result += '[\\s\\S]';
	    } else {
	      if (chr === '[') {
	        brackets = true;
	      } else if (chr === ']') {
	        brackets = false;
	      } result += chr;
	    }
	  } return result;
	};

	var handleNCG = function (string) {
	  var length = string.length;
	  var index = 0;
	  var result = '';
	  var named = [];
	  var names = {};
	  var brackets = false;
	  var ncg = false;
	  var groupid = 0;
	  var groupname = '';
	  var chr;
	  for (; index <= length; index++) {
	    chr = string.charAt(index);
	    if (chr === '\\') {
	      chr = chr + string.charAt(++index);
	    } else if (chr === ']') {
	      brackets = false;
	    } else if (!brackets) switch (true) {
	      case chr === '[':
	        brackets = true;
	        break;
	      case chr === '(':
	        if (IS_NCG.test(string.slice(index + 1))) {
	          index += 2;
	          ncg = true;
	        }
	        result += chr;
	        groupid++;
	        continue;
	      case chr === '>' && ncg:
	        if (groupname === '' || hasOwn$4(names, groupname)) {
	          throw new SyntaxError('Invalid capture group name');
	        }
	        names[groupname] = true;
	        named.push([groupname, groupid]);
	        ncg = false;
	        groupname = '';
	        continue;
	    }
	    if (ncg) groupname += chr;
	    else result += chr;
	  } return [result, named];
	};

	// `RegExp` constructor
	// https://tc39.es/ecma262/#sec-regexp-constructor
	if (isForced('RegExp', BASE_FORCED)) {
	  var RegExpWrapper = function RegExp(pattern, flags) {
	    var thisIsRegExp = this instanceof RegExpWrapper;
	    var patternIsRegExp = isRegExp$4(pattern);
	    var flagsAreUndefined = flags === undefined;
	    var groups = [];
	    var rawPattern = pattern;
	    var rawFlags, dotAll, sticky, handled, result, state;

	    if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) {
	      return pattern;
	    }

	    if (patternIsRegExp || pattern instanceof RegExpWrapper) {
	      pattern = pattern.source;
	      if (flagsAreUndefined) flags = 'flags' in rawPattern ? rawPattern.flags : getFlags.call(rawPattern);
	    }

	    pattern = pattern === undefined ? '' : toString$j(pattern);
	    flags = flags === undefined ? '' : toString$j(flags);
	    rawPattern = pattern;

	    if (UNSUPPORTED_DOT_ALL$2 && 'dotAll' in re1) {
	      dotAll = !!flags && flags.indexOf('s') > -1;
	      if (dotAll) flags = flags.replace(/s/g, '');
	    }

	    rawFlags = flags;

	    if (UNSUPPORTED_Y$3 && 'sticky' in re1) {
	      sticky = !!flags && flags.indexOf('y') > -1;
	      if (sticky) flags = flags.replace(/y/g, '');
	    }

	    if (UNSUPPORTED_NCG$1) {
	      handled = handleNCG(pattern);
	      pattern = handled[0];
	      groups = handled[1];
	    }

	    result = inheritIfRequired$1(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype$6, RegExpWrapper);

	    if (dotAll || sticky || groups.length) {
	      state = enforceInternalState(result);
	      if (dotAll) {
	        state.dotAll = true;
	        state.raw = RegExpWrapper(handleDotAll(pattern), rawFlags);
	      }
	      if (sticky) state.sticky = true;
	      if (groups.length) state.groups = groups;
	    }

	    if (pattern !== rawPattern) try {
	      // fails in old engines, but we have no alternatives for unsupported regex syntax
	      createNonEnumerableProperty$4(result, 'source', rawPattern === '' ? '(?:)' : rawPattern);
	    } catch (error) { /* empty */ }

	    return result;
	  };

	  var proxy = function (key) {
	    key in RegExpWrapper || defineProperty$5(RegExpWrapper, key, {
	      configurable: true,
	      get: function () { return NativeRegExp[key]; },
	      set: function (it) { NativeRegExp[key] = it; }
	    });
	  };

	  for (var keys$4 = getOwnPropertyNames$1(NativeRegExp), index = 0; keys$4.length > index;) {
	    proxy(keys$4[index++]);
	  }

	  RegExpPrototype$6.constructor = RegExpWrapper;
	  RegExpWrapper.prototype = RegExpPrototype$6;
	  redefine$5(global$e, 'RegExp', RegExpWrapper);
	}

	// https://tc39.es/ecma262/#sec-get-regexp-@@species
	setSpecies$1('RegExp');

	var DESCRIPTORS$4 = descriptors;
	var UNSUPPORTED_DOT_ALL$1 = regexpUnsupportedDotAll;
	var defineProperty$4 = objectDefineProperty.f;
	var getInternalState$5 = internalState.get;
	var RegExpPrototype$5 = RegExp.prototype;

	// `RegExp.prototype.dotAll` getter
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.dotall
	if (DESCRIPTORS$4 && UNSUPPORTED_DOT_ALL$1) {
	  defineProperty$4(RegExpPrototype$5, 'dotAll', {
	    configurable: true,
	    get: function () {
	      if (this === RegExpPrototype$5) return undefined;
	      // We can't use InternalStateModule.getterFor because
	      // we don't add metadata for regexps created by a literal.
	      if (this instanceof RegExp) {
	        return !!getInternalState$5(this).dotAll;
	      }
	      throw TypeError('Incompatible receiver, RegExp required');
	    }
	  });
	}

	/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
	/* eslint-disable regexp/no-useless-quantifier -- testing */
	var toString$i = toString$u;
	var regexpFlags = regexpFlags$1;
	var stickyHelpers$1 = regexpStickyHelpers;
	var shared = shared$5.exports;
	var create$2 = objectCreate$1;
	var getInternalState$4 = internalState.get;
	var UNSUPPORTED_DOT_ALL = regexpUnsupportedDotAll;
	var UNSUPPORTED_NCG = regexpUnsupportedNcg;

	var nativeExec = RegExp.prototype.exec;
	var nativeReplace = shared('native-string-replace', String.prototype.replace);

	var patchedExec = nativeExec;

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	})();

	var UNSUPPORTED_Y$2 = stickyHelpers$1.UNSUPPORTED_Y || stickyHelpers$1.BROKEN_CARET;

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$2 || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;

	if (PATCH) {
	  // eslint-disable-next-line max-statements -- TODO
	  patchedExec = function exec(string) {
	    var re = this;
	    var state = getInternalState$4(re);
	    var str = toString$i(string);
	    var raw = state.raw;
	    var result, reCopy, lastIndex, match, i, object, group;

	    if (raw) {
	      raw.lastIndex = re.lastIndex;
	      result = patchedExec.call(raw, str);
	      re.lastIndex = raw.lastIndex;
	      return result;
	    }

	    var groups = state.groups;
	    var sticky = UNSUPPORTED_Y$2 && re.sticky;
	    var flags = regexpFlags.call(re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = flags.replace('y', '');
	      if (flags.indexOf('g') === -1) {
	        flags += 'g';
	      }

	      strCopy = str.slice(re.lastIndex);
	      // Support anchored sticky behavior.
	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str.charAt(re.lastIndex - 1) !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      }
	      // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.
	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }
	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

	    match = nativeExec.call(sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = match.input.slice(charsAdded);
	        match[0] = match[0].slice(charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    if (match && groups) {
	      match.groups = object = create$2(null);
	      for (i = 0; i < groups.length; i++) {
	        group = groups[i];
	        object[group[0]] = match[group[1]];
	      }
	    }

	    return match;
	  };
	}

	var regexpExec$3 = patchedExec;

	var $$C = _export;
	var exec = regexpExec$3;

	// `RegExp.prototype.exec` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.exec
	$$C({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
	  exec: exec
	});

	var DESCRIPTORS$3 = descriptors;
	var objectDefinePropertyModule = objectDefineProperty;
	var regExpFlags = regexpFlags$1;
	var fails$f = fails$13;

	var FORCED$8 = DESCRIPTORS$3 && fails$f(function () {
	  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	  return Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags').get.call({ dotAll: true, sticky: true }) !== 'sy';
	});

	// `RegExp.prototype.flags` getter
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
	if (FORCED$8) objectDefinePropertyModule.f(RegExp.prototype, 'flags', {
	  configurable: true,
	  get: regExpFlags
	});

	var DESCRIPTORS$2 = descriptors;
	var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y;
	var defineProperty$3 = objectDefineProperty.f;
	var getInternalState$3 = internalState.get;
	var RegExpPrototype$4 = RegExp.prototype;

	// `RegExp.prototype.sticky` getter
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.sticky
	if (DESCRIPTORS$2 && UNSUPPORTED_Y$1) {
	  defineProperty$3(RegExpPrototype$4, 'sticky', {
	    configurable: true,
	    get: function () {
	      if (this === RegExpPrototype$4) return undefined;
	      // We can't use InternalStateModule.getterFor because
	      // we don't add metadata for regexps created by a literal.
	      if (this instanceof RegExp) {
	        return !!getInternalState$3(this).sticky;
	      }
	      throw TypeError('Incompatible receiver, RegExp required');
	    }
	  });
	}

	// TODO: Remove from `core-js@4` since it's moved to entry points

	var $$B = _export;
	var isCallable$5 = isCallable$u;
	var isObject$b = isObject$G;

	var DELEGATES_TO_EXEC = function () {
	  var execCalled = false;
	  var re = /[ac]/;
	  re.exec = function () {
	    execCalled = true;
	    return /./.exec.apply(this, arguments);
	  };
	  return re.test('abc') === true && execCalled;
	}();

	var nativeTest = /./.test;

	// `RegExp.prototype.test` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.test
	$$B({ target: 'RegExp', proto: true, forced: !DELEGATES_TO_EXEC }, {
	  test: function (str) {
	    var exec = this.exec;
	    if (!isCallable$5(exec)) return nativeTest.call(this, str);
	    var result = exec.call(this, str);
	    if (result !== null && !isObject$b(result)) {
	      throw new Error('RegExp exec method returned something other than an Object or null');
	    }
	    return !!result;
	  }
	});

	var PROPER_FUNCTION_NAME$2 = functionName.PROPER;
	var redefine$4 = redefine$j.exports;
	var anObject$8 = anObject$z;
	var $toString$2 = toString$u;
	var fails$e = fails$13;
	var flags = regexpFlags$1;

	var TO_STRING = 'toString';
	var RegExpPrototype$3 = RegExp.prototype;
	var nativeToString = RegExpPrototype$3[TO_STRING];

	var NOT_GENERIC = fails$e(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
	// FF44- RegExp#toString has a wrong name
	var INCORRECT_NAME = PROPER_FUNCTION_NAME$2 && nativeToString.name != TO_STRING;

	// `RegExp.prototype.toString` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
	if (NOT_GENERIC || INCORRECT_NAME) {
	  redefine$4(RegExp.prototype, TO_STRING, function toString() {
	    var R = anObject$8(this);
	    var p = $toString$2(R.source);
	    var rf = R.flags;
	    var f = $toString$2(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype$3) ? flags.call(R) : rf);
	    return '/' + p + '/' + f;
	  }, { unsafe: true });
	}

	var collection$2 = collection$4;
	var collectionStrong = collectionStrong$2;

	// `Set` constructor
	// https://tc39.es/ecma262/#sec-set-objects
	collection$2('Set', function (init) {
	  return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong);

	var $$A = _export;
	var requireObjectCoercible$c = requireObjectCoercible$i;
	var toIntegerOrInfinity$5 = toIntegerOrInfinity$h;
	var toString$h = toString$u;
	var fails$d = fails$13;

	var FORCED$7 = fails$d(function () {
	  return '𠮷'.at(0) !== '\uD842';
	});

	// `String.prototype.at` method
	// https://github.com/tc39/proposal-relative-indexing-method
	$$A({ target: 'String', proto: true, forced: FORCED$7 }, {
	  at: function at(index) {
	    var S = toString$h(requireObjectCoercible$c(this));
	    var len = S.length;
	    var relativeIndex = toIntegerOrInfinity$5(index);
	    var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
	    return (k < 0 || k >= len) ? undefined : S.charAt(k);
	  }
	});

	var toIntegerOrInfinity$4 = toIntegerOrInfinity$h;
	var toString$g = toString$u;
	var requireObjectCoercible$b = requireObjectCoercible$i;

	var createMethod = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = toString$g(requireObjectCoercible$b($this));
	    var position = toIntegerOrInfinity$4(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = S.charCodeAt(position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING ? S.charAt(position) : first
	        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod(true)
	};

	var $$z = _export;
	var codeAt$1 = stringMultibyte.codeAt;

	// `String.prototype.codePointAt` method
	// https://tc39.es/ecma262/#sec-string.prototype.codepointat
	$$z({ target: 'String', proto: true }, {
	  codePointAt: function codePointAt(pos) {
	    return codeAt$1(this, pos);
	  }
	});

	var isRegExp$3 = isRegexp;

	var notARegexp = function (it) {
	  if (isRegExp$3(it)) {
	    throw TypeError("The method doesn't accept regular expressions");
	  } return it;
	};

	var wellKnownSymbol$8 = wellKnownSymbol$x;

	var MATCH = wellKnownSymbol$8('match');

	var correctIsRegexpLogic = function (METHOD_NAME) {
	  var regexp = /./;
	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (error1) {
	    try {
	      regexp[MATCH] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (error2) { /* empty */ }
	  } return false;
	};

	var $$y = _export;
	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var toLength$7 = toLength$d;
	var toString$f = toString$u;
	var notARegExp$2 = notARegexp;
	var requireObjectCoercible$a = requireObjectCoercible$i;
	var correctIsRegExpLogic$2 = correctIsRegexpLogic;

	// eslint-disable-next-line es/no-string-prototype-endswith -- safe
	var $endsWith = ''.endsWith;
	var min$4 = Math.min;

	var CORRECT_IS_REGEXP_LOGIC$1 = correctIsRegExpLogic$2('endsWith');
	// https://github.com/zloirock/core-js/pull/702
	var MDN_POLYFILL_BUG$1 = !CORRECT_IS_REGEXP_LOGIC$1 && !!function () {
	  var descriptor = getOwnPropertyDescriptor$1(String.prototype, 'endsWith');
	  return descriptor && !descriptor.writable;
	}();

	// `String.prototype.endsWith` method
	// https://tc39.es/ecma262/#sec-string.prototype.endswith
	$$y({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG$1 && !CORRECT_IS_REGEXP_LOGIC$1 }, {
	  endsWith: function endsWith(searchString /* , endPosition = @length */) {
	    var that = toString$f(requireObjectCoercible$a(this));
	    notARegExp$2(searchString);
	    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
	    var len = that.length;
	    var end = endPosition === undefined ? len : min$4(toLength$7(endPosition), len);
	    var search = toString$f(searchString);
	    return $endsWith
	      ? $endsWith.call(that, search, end)
	      : that.slice(end - search.length, end) === search;
	  }
	});

	var $$x = _export;
	var toAbsoluteIndex$1 = toAbsoluteIndex$8;

	var fromCharCode$1 = String.fromCharCode;
	// eslint-disable-next-line es/no-string-fromcodepoint -- required for testing
	var $fromCodePoint = String.fromCodePoint;

	// length should be 1, old FF problem
	var INCORRECT_LENGTH = !!$fromCodePoint && $fromCodePoint.length != 1;

	// `String.fromCodePoint` method
	// https://tc39.es/ecma262/#sec-string.fromcodepoint
	$$x({ target: 'String', stat: true, forced: INCORRECT_LENGTH }, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  fromCodePoint: function fromCodePoint(x) {
	    var elements = [];
	    var length = arguments.length;
	    var i = 0;
	    var code;
	    while (length > i) {
	      code = +arguments[i++];
	      if (toAbsoluteIndex$1(code, 0x10FFFF) !== code) throw RangeError(code + ' is not a valid code point');
	      elements.push(code < 0x10000
	        ? fromCharCode$1(code)
	        : fromCharCode$1(((code -= 0x10000) >> 10) + 0xD800, code % 0x400 + 0xDC00)
	      );
	    } return elements.join('');
	  }
	});

	var $$w = _export;
	var notARegExp$1 = notARegexp;
	var requireObjectCoercible$9 = requireObjectCoercible$i;
	var toString$e = toString$u;
	var correctIsRegExpLogic$1 = correctIsRegexpLogic;

	// `String.prototype.includes` method
	// https://tc39.es/ecma262/#sec-string.prototype.includes
	$$w({ target: 'String', proto: true, forced: !correctIsRegExpLogic$1('includes') }, {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~toString$e(requireObjectCoercible$9(this))
	      .indexOf(toString$e(notARegExp$1(searchString)), arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var charAt$1 = stringMultibyte.charAt;
	var toString$d = toString$u;
	var InternalStateModule$5 = internalState;
	var defineIterator = defineIterator$3;

	var STRING_ITERATOR = 'String Iterator';
	var setInternalState$5 = InternalStateModule$5.set;
	var getInternalState$2 = InternalStateModule$5.getterFor(STRING_ITERATOR);

	// `String.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
	defineIterator(String, 'String', function (iterated) {
	  setInternalState$5(this, {
	    type: STRING_ITERATOR,
	    string: toString$d(iterated),
	    index: 0
	  });
	// `%StringIteratorPrototype%.next` method
	// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState$2(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return { value: undefined, done: true };
	  point = charAt$1(string, index);
	  state.index += point.length;
	  return { value: point, done: false };
	});

	// TODO: Remove from `core-js@4` since it's moved to entry points

	var redefine$3 = redefine$j.exports;
	var regexpExec$2 = regexpExec$3;
	var fails$c = fails$13;
	var wellKnownSymbol$7 = wellKnownSymbol$x;
	var createNonEnumerableProperty$3 = createNonEnumerableProperty$d;

	var SPECIES = wellKnownSymbol$7('species');
	var RegExpPrototype$2 = RegExp.prototype;

	var fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
	  var SYMBOL = wellKnownSymbol$7(KEY);

	  var DELEGATES_TO_SYMBOL = !fails$c(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails$c(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {};
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES] = function () { return re; };
	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () { execCalled = true; return null; };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    FORCED
	  ) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      var $exec = regexp.exec;
	      if ($exec === regexpExec$2 || $exec === RegExpPrototype$2.exec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
	        }
	        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
	      }
	      return { done: false };
	    });

	    redefine$3(String.prototype, KEY, methods[0]);
	    redefine$3(RegExpPrototype$2, SYMBOL, methods[1]);
	  }

	  if (SHAM) createNonEnumerableProperty$3(RegExpPrototype$2[SYMBOL], 'sham', true);
	};

	var charAt = stringMultibyte.charAt;

	// `AdvanceStringIndex` abstract operation
	// https://tc39.es/ecma262/#sec-advancestringindex
	var advanceStringIndex$4 = function (S, index, unicode) {
	  return index + (unicode ? charAt(S, index).length : 1);
	};

	var anObject$7 = anObject$z;
	var isCallable$4 = isCallable$u;
	var classof$3 = classofRaw$1;
	var regexpExec$1 = regexpExec$3;

	// `RegExpExec` abstract operation
	// https://tc39.es/ecma262/#sec-regexpexec
	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (isCallable$4(exec)) {
	    var result = exec.call(R, S);
	    if (result !== null) anObject$7(result);
	    return result;
	  }
	  if (classof$3(R) === 'RegExp') return regexpExec$1.call(R, S);
	  throw TypeError('RegExp#exec called on incompatible receiver');
	};

	var fixRegExpWellKnownSymbolLogic$3 = fixRegexpWellKnownSymbolLogic;
	var anObject$6 = anObject$z;
	var toLength$6 = toLength$d;
	var toString$c = toString$u;
	var requireObjectCoercible$8 = requireObjectCoercible$i;
	var getMethod$5 = getMethod$9;
	var advanceStringIndex$3 = advanceStringIndex$4;
	var regExpExec$3 = regexpExecAbstract;

	// @@match logic
	fixRegExpWellKnownSymbolLogic$3('match', function (MATCH, nativeMatch, maybeCallNative) {
	  return [
	    // `String.prototype.match` method
	    // https://tc39.es/ecma262/#sec-string.prototype.match
	    function match(regexp) {
	      var O = requireObjectCoercible$8(this);
	      var matcher = regexp == undefined ? undefined : getMethod$5(regexp, MATCH);
	      return matcher ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](toString$c(O));
	    },
	    // `RegExp.prototype[@@match]` method
	    // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
	    function (string) {
	      var rx = anObject$6(this);
	      var S = toString$c(string);
	      var res = maybeCallNative(nativeMatch, rx, S);

	      if (res.done) return res.value;

	      if (!rx.global) return regExpExec$3(rx, S);

	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	      var A = [];
	      var n = 0;
	      var result;
	      while ((result = regExpExec$3(rx, S)) !== null) {
	        var matchStr = toString$c(result[0]);
	        A[n] = matchStr;
	        if (matchStr === '') rx.lastIndex = advanceStringIndex$3(S, toLength$6(rx.lastIndex), fullUnicode);
	        n++;
	      }
	      return n === 0 ? null : A;
	    }
	  ];
	});

	/* eslint-disable es/no-string-prototype-matchall -- safe */
	var $$v = _export;
	var createIteratorConstructor$1 = createIteratorConstructor$3;
	var requireObjectCoercible$7 = requireObjectCoercible$i;
	var toLength$5 = toLength$d;
	var toString$b = toString$u;
	var anObject$5 = anObject$z;
	var classof$2 = classofRaw$1;
	var isRegExp$2 = isRegexp;
	var getRegExpFlags$1 = regexpFlags$1;
	var getMethod$4 = getMethod$9;
	var redefine$2 = redefine$j.exports;
	var fails$b = fails$13;
	var wellKnownSymbol$6 = wellKnownSymbol$x;
	var speciesConstructor$2 = speciesConstructor$6;
	var advanceStringIndex$2 = advanceStringIndex$4;
	var regExpExec$2 = regexpExecAbstract;
	var InternalStateModule$4 = internalState;
	var IS_PURE$1 = isPure;

	var MATCH_ALL = wellKnownSymbol$6('matchAll');
	var REGEXP_STRING = 'RegExp String';
	var REGEXP_STRING_ITERATOR = REGEXP_STRING + ' Iterator';
	var setInternalState$4 = InternalStateModule$4.set;
	var getInternalState$1 = InternalStateModule$4.getterFor(REGEXP_STRING_ITERATOR);
	var RegExpPrototype$1 = RegExp.prototype;
	var nativeMatchAll = ''.matchAll;

	var WORKS_WITH_NON_GLOBAL_REGEX = !!nativeMatchAll && !fails$b(function () {
	  'a'.matchAll(/./);
	});

	// eslint-disable-next-line max-len -- ignore
	var $RegExpStringIterator = createIteratorConstructor$1(function RegExpStringIterator(regexp, string, global, fullUnicode) {
	  setInternalState$4(this, {
	    type: REGEXP_STRING_ITERATOR,
	    regexp: regexp,
	    string: string,
	    global: global,
	    unicode: fullUnicode,
	    done: false
	  });
	}, REGEXP_STRING, function next() {
	  var state = getInternalState$1(this);
	  if (state.done) return { value: undefined, done: true };
	  var R = state.regexp;
	  var S = state.string;
	  var match = regExpExec$2(R, S);
	  if (match === null) return { value: undefined, done: state.done = true };
	  if (state.global) {
	    if (toString$b(match[0]) === '') R.lastIndex = advanceStringIndex$2(S, toLength$5(R.lastIndex), state.unicode);
	    return { value: match, done: false };
	  }
	  state.done = true;
	  return { value: match, done: false };
	});

	var $matchAll = function (string) {
	  var R = anObject$5(this);
	  var S = toString$b(string);
	  var C, flagsValue, flags, matcher, global, fullUnicode;
	  C = speciesConstructor$2(R, RegExp);
	  flagsValue = R.flags;
	  if (flagsValue === undefined && R instanceof RegExp && !('flags' in RegExpPrototype$1)) {
	    flagsValue = getRegExpFlags$1.call(R);
	  }
	  flags = flagsValue === undefined ? '' : toString$b(flagsValue);
	  matcher = new C(C === RegExp ? R.source : R, flags);
	  global = !!~flags.indexOf('g');
	  fullUnicode = !!~flags.indexOf('u');
	  matcher.lastIndex = toLength$5(R.lastIndex);
	  return new $RegExpStringIterator(matcher, S, global, fullUnicode);
	};

	// `String.prototype.matchAll` method
	// https://tc39.es/ecma262/#sec-string.prototype.matchall
	$$v({ target: 'String', proto: true, forced: WORKS_WITH_NON_GLOBAL_REGEX }, {
	  matchAll: function matchAll(regexp) {
	    var O = requireObjectCoercible$7(this);
	    var flags, S, matcher, rx;
	    if (regexp != null) {
	      if (isRegExp$2(regexp)) {
	        flags = toString$b(requireObjectCoercible$7('flags' in RegExpPrototype$1
	          ? regexp.flags
	          : getRegExpFlags$1.call(regexp)
	        ));
	        if (!~flags.indexOf('g')) throw TypeError('`.matchAll` does not allow non-global regexes');
	      }
	      if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll.apply(O, arguments);
	      matcher = getMethod$4(regexp, MATCH_ALL);
	      if (matcher === undefined && IS_PURE$1 && classof$2(regexp) == 'RegExp') matcher = $matchAll;
	      if (matcher) return matcher.call(regexp, O);
	    } else if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll.apply(O, arguments);
	    S = toString$b(O);
	    rx = new RegExp(regexp, 'g');
	    return rx[MATCH_ALL](S);
	  }
	});

	MATCH_ALL in RegExpPrototype$1 || redefine$2(RegExpPrototype$1, MATCH_ALL, $matchAll);

	// https://github.com/zloirock/core-js/issues/280
	var userAgent$1 = engineUserAgent;

	var stringPadWebkitBug = /Version\/10(?:\.\d+){1,2}(?: [\w./]+)?(?: Mobile\/\w+)? Safari\//.test(userAgent$1);

	var $$u = _export;
	var $padEnd = stringPad.end;
	var WEBKIT_BUG$1 = stringPadWebkitBug;

	// `String.prototype.padEnd` method
	// https://tc39.es/ecma262/#sec-string.prototype.padend
	$$u({ target: 'String', proto: true, forced: WEBKIT_BUG$1 }, {
	  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
	    return $padEnd(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $$t = _export;
	var $padStart = stringPad.start;
	var WEBKIT_BUG = stringPadWebkitBug;

	// `String.prototype.padStart` method
	// https://tc39.es/ecma262/#sec-string.prototype.padstart
	$$t({ target: 'String', proto: true, forced: WEBKIT_BUG }, {
	  padStart: function padStart(maxLength /* , fillString = ' ' */) {
	    return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $$s = _export;
	var toIndexedObject = toIndexedObject$d;
	var toObject$3 = toObject$q;
	var toString$a = toString$u;
	var lengthOfArrayLike$4 = lengthOfArrayLike$l;

	var ArrayPrototype = Array.prototype;
	var push = ArrayPrototype.push;
	var join = ArrayPrototype.join;

	// `String.raw` method
	// https://tc39.es/ecma262/#sec-string.raw
	$$s({ target: 'String', stat: true }, {
	  raw: function raw(template) {
	    var rawTemplate = toIndexedObject(toObject$3(template).raw);
	    var literalSegments = lengthOfArrayLike$4(rawTemplate);
	    var argumentsLength = arguments.length;
	    var elements = [];
	    var i = 0;
	    while (literalSegments > i) {
	      push.call(elements, toString$a(rawTemplate[i++]));
	      if (i === literalSegments) return join.call(elements, '');
	      if (i < argumentsLength) push.call(elements, toString$a(arguments[i]));
	    }
	  }
	});

	var $$r = _export;
	var repeat = stringRepeat;

	// `String.prototype.repeat` method
	// https://tc39.es/ecma262/#sec-string.prototype.repeat
	$$r({ target: 'String', proto: true }, {
	  repeat: repeat
	});

	var toObject$2 = toObject$q;

	var floor$3 = Math.floor;
	var replace$1 = ''.replace;
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

	// `GetSubstitution` abstract operation
	// https://tc39.es/ecma262/#sec-getsubstitution
	var getSubstitution$2 = function (matched, str, position, captures, namedCaptures, replacement) {
	  var tailPos = position + matched.length;
	  var m = captures.length;
	  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
	  if (namedCaptures !== undefined) {
	    namedCaptures = toObject$2(namedCaptures);
	    symbols = SUBSTITUTION_SYMBOLS;
	  }
	  return replace$1.call(replacement, symbols, function (match, ch) {
	    var capture;
	    switch (ch.charAt(0)) {
	      case '$': return '$';
	      case '&': return matched;
	      case '`': return str.slice(0, position);
	      case "'": return str.slice(tailPos);
	      case '<':
	        capture = namedCaptures[ch.slice(1, -1)];
	        break;
	      default: // \d\d?
	        var n = +ch;
	        if (n === 0) return match;
	        if (n > m) {
	          var f = floor$3(n / 10);
	          if (f === 0) return match;
	          if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
	          return match;
	        }
	        capture = captures[n - 1];
	    }
	    return capture === undefined ? '' : capture;
	  });
	};

	var fixRegExpWellKnownSymbolLogic$2 = fixRegexpWellKnownSymbolLogic;
	var fails$a = fails$13;
	var anObject$4 = anObject$z;
	var isCallable$3 = isCallable$u;
	var toIntegerOrInfinity$3 = toIntegerOrInfinity$h;
	var toLength$4 = toLength$d;
	var toString$9 = toString$u;
	var requireObjectCoercible$6 = requireObjectCoercible$i;
	var advanceStringIndex$1 = advanceStringIndex$4;
	var getMethod$3 = getMethod$9;
	var getSubstitution$1 = getSubstitution$2;
	var regExpExec$1 = regexpExecAbstract;
	var wellKnownSymbol$5 = wellKnownSymbol$x;

	var REPLACE$1 = wellKnownSymbol$5('replace');
	var max$2 = Math.max;
	var min$3 = Math.min;

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	};

	// IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
	var REPLACE_KEEPS_$0 = (function () {
	  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
	  return 'a'.replace(/./, '$0') === '$0';
	})();

	// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
	  if (/./[REPLACE$1]) {
	    return /./[REPLACE$1]('a', '$0') === '';
	  }
	  return false;
	})();

	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails$a(function () {
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = { a: '7' };
	    return result;
	  };
	  // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
	  return ''.replace(re, '$<a>') !== '7';
	});

	// @@replace logic
	fixRegExpWellKnownSymbolLogic$2('replace', function (_, nativeReplace, maybeCallNative) {
	  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

	  return [
	    // `String.prototype.replace` method
	    // https://tc39.es/ecma262/#sec-string.prototype.replace
	    function replace(searchValue, replaceValue) {
	      var O = requireObjectCoercible$6(this);
	      var replacer = searchValue == undefined ? undefined : getMethod$3(searchValue, REPLACE$1);
	      return replacer
	        ? replacer.call(searchValue, O, replaceValue)
	        : nativeReplace.call(toString$9(O), searchValue, replaceValue);
	    },
	    // `RegExp.prototype[@@replace]` method
	    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
	    function (string, replaceValue) {
	      var rx = anObject$4(this);
	      var S = toString$9(string);

	      if (
	        typeof replaceValue === 'string' &&
	        replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1 &&
	        replaceValue.indexOf('$<') === -1
	      ) {
	        var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
	        if (res.done) return res.value;
	      }

	      var functionalReplace = isCallable$3(replaceValue);
	      if (!functionalReplace) replaceValue = toString$9(replaceValue);

	      var global = rx.global;
	      if (global) {
	        var fullUnicode = rx.unicode;
	        rx.lastIndex = 0;
	      }
	      var results = [];
	      while (true) {
	        var result = regExpExec$1(rx, S);
	        if (result === null) break;

	        results.push(result);
	        if (!global) break;

	        var matchStr = toString$9(result[0]);
	        if (matchStr === '') rx.lastIndex = advanceStringIndex$1(S, toLength$4(rx.lastIndex), fullUnicode);
	      }

	      var accumulatedResult = '';
	      var nextSourcePosition = 0;
	      for (var i = 0; i < results.length; i++) {
	        result = results[i];

	        var matched = toString$9(result[0]);
	        var position = max$2(min$3(toIntegerOrInfinity$3(result.index), S.length), 0);
	        var captures = [];
	        // NOTE: This is equivalent to
	        //   captures = result.slice(1).map(maybeToString)
	        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
	        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
	        var namedCaptures = result.groups;
	        if (functionalReplace) {
	          var replacerArgs = [matched].concat(captures, position, S);
	          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
	          var replacement = toString$9(replaceValue.apply(undefined, replacerArgs));
	        } else {
	          replacement = getSubstitution$1(matched, S, position, captures, namedCaptures, replaceValue);
	        }
	        if (position >= nextSourcePosition) {
	          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
	          nextSourcePosition = position + matched.length;
	        }
	      }
	      return accumulatedResult + S.slice(nextSourcePosition);
	    }
	  ];
	}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

	var $$q = _export;
	var requireObjectCoercible$5 = requireObjectCoercible$i;
	var isCallable$2 = isCallable$u;
	var isRegExp$1 = isRegexp;
	var toString$8 = toString$u;
	var getMethod$2 = getMethod$9;
	var getRegExpFlags = regexpFlags$1;
	var getSubstitution = getSubstitution$2;
	var wellKnownSymbol$4 = wellKnownSymbol$x;

	var REPLACE = wellKnownSymbol$4('replace');
	var RegExpPrototype = RegExp.prototype;
	var max$1 = Math.max;

	var stringIndexOf = function (string, searchValue, fromIndex) {
	  if (fromIndex > string.length) return -1;
	  if (searchValue === '') return fromIndex;
	  return string.indexOf(searchValue, fromIndex);
	};

	// `String.prototype.replaceAll` method
	// https://tc39.es/ecma262/#sec-string.prototype.replaceall
	$$q({ target: 'String', proto: true }, {
	  replaceAll: function replaceAll(searchValue, replaceValue) {
	    var O = requireObjectCoercible$5(this);
	    var IS_REG_EXP, flags, replacer, string, searchString, functionalReplace, searchLength, advanceBy, replacement;
	    var position = 0;
	    var endOfLastMatch = 0;
	    var result = '';
	    if (searchValue != null) {
	      IS_REG_EXP = isRegExp$1(searchValue);
	      if (IS_REG_EXP) {
	        flags = toString$8(requireObjectCoercible$5('flags' in RegExpPrototype
	          ? searchValue.flags
	          : getRegExpFlags.call(searchValue)
	        ));
	        if (!~flags.indexOf('g')) throw TypeError('`.replaceAll` does not allow non-global regexes');
	      }
	      replacer = getMethod$2(searchValue, REPLACE);
	      if (replacer) {
	        return replacer.call(searchValue, O, replaceValue);
	      }
	    }
	    string = toString$8(O);
	    searchString = toString$8(searchValue);
	    functionalReplace = isCallable$2(replaceValue);
	    if (!functionalReplace) replaceValue = toString$8(replaceValue);
	    searchLength = searchString.length;
	    advanceBy = max$1(1, searchLength);
	    position = stringIndexOf(string, searchString, 0);
	    while (position !== -1) {
	      if (functionalReplace) {
	        replacement = toString$8(replaceValue(searchString, position, string));
	      } else {
	        replacement = getSubstitution(searchString, string, position, [], undefined, replaceValue);
	      }
	      result += string.slice(endOfLastMatch, position) + replacement;
	      endOfLastMatch = position + searchLength;
	      position = stringIndexOf(string, searchString, position + advanceBy);
	    }
	    if (endOfLastMatch < string.length) {
	      result += string.slice(endOfLastMatch);
	    }
	    return result;
	  }
	});

	var fixRegExpWellKnownSymbolLogic$1 = fixRegexpWellKnownSymbolLogic;
	var anObject$3 = anObject$z;
	var requireObjectCoercible$4 = requireObjectCoercible$i;
	var sameValue = sameValue$1;
	var toString$7 = toString$u;
	var getMethod$1 = getMethod$9;
	var regExpExec = regexpExecAbstract;

	// @@search logic
	fixRegExpWellKnownSymbolLogic$1('search', function (SEARCH, nativeSearch, maybeCallNative) {
	  return [
	    // `String.prototype.search` method
	    // https://tc39.es/ecma262/#sec-string.prototype.search
	    function search(regexp) {
	      var O = requireObjectCoercible$4(this);
	      var searcher = regexp == undefined ? undefined : getMethod$1(regexp, SEARCH);
	      return searcher ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](toString$7(O));
	    },
	    // `RegExp.prototype[@@search]` method
	    // https://tc39.es/ecma262/#sec-regexp.prototype-@@search
	    function (string) {
	      var rx = anObject$3(this);
	      var S = toString$7(string);
	      var res = maybeCallNative(nativeSearch, rx, S);

	      if (res.done) return res.value;

	      var previousLastIndex = rx.lastIndex;
	      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
	      var result = regExpExec(rx, S);
	      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
	      return result === null ? -1 : result.index;
	    }
	  ];
	});

	var fixRegExpWellKnownSymbolLogic = fixRegexpWellKnownSymbolLogic;
	var isRegExp = isRegexp;
	var anObject$2 = anObject$z;
	var requireObjectCoercible$3 = requireObjectCoercible$i;
	var speciesConstructor$1 = speciesConstructor$6;
	var advanceStringIndex = advanceStringIndex$4;
	var toLength$3 = toLength$d;
	var toString$6 = toString$u;
	var getMethod = getMethod$9;
	var callRegExpExec = regexpExecAbstract;
	var regexpExec = regexpExec$3;
	var stickyHelpers = regexpStickyHelpers;
	var fails$9 = fails$13;

	var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;
	var arrayPush$4 = [].push;
	var min$2 = Math.min;
	var MAX_UINT32 = 0xFFFFFFFF;

	// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper
	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails$9(function () {
	  // eslint-disable-next-line regexp/no-empty-group -- required for testing
	  var re = /(?:)/;
	  var originalExec = re.exec;
	  re.exec = function () { return originalExec.apply(this, arguments); };
	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	// @@split logic
	fixRegExpWellKnownSymbolLogic('split', function (SPLIT, nativeSplit, maybeCallNative) {
	  var internalSplit;
	  if (
	    'abbc'.split(/(b)*/)[1] == 'c' ||
	    // eslint-disable-next-line regexp/no-empty-group -- required for testing
	    'test'.split(/(?:)/, -1).length != 4 ||
	    'ab'.split(/(?:ab)*/).length != 2 ||
	    '.'.split(/(.?)(.?)/).length != 4 ||
	    // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
	    '.'.split(/()()/).length > 1 ||
	    ''.split(/.?/).length
	  ) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = toString$6(requireObjectCoercible$3(this));
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (separator === undefined) return [string];
	      // If `separator` is not a regex, use native split
	      if (!isRegExp(separator)) {
	        return nativeSplit.call(string, separator, lim);
	      }
	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') +
	                  (separator.multiline ? 'm' : '') +
	                  (separator.unicode ? 'u' : '') +
	                  (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0;
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;
	      while (match = regexpExec.call(separatorCopy, string)) {
	        lastIndex = separatorCopy.lastIndex;
	        if (lastIndex > lastLastIndex) {
	          output.push(string.slice(lastLastIndex, match.index));
	          if (match.length > 1 && match.index < string.length) arrayPush$4.apply(output, match.slice(1));
	          lastLength = match[0].length;
	          lastLastIndex = lastIndex;
	          if (output.length >= lim) break;
	        }
	        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
	      }
	      if (lastLastIndex === string.length) {
	        if (lastLength || !separatorCopy.test('')) output.push('');
	      } else output.push(string.slice(lastLastIndex));
	      return output.length > lim ? output.slice(0, lim) : output;
	    };
	  // Chakra, V8
	  } else if ('0'.split(undefined, 0).length) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
	    };
	  } else internalSplit = nativeSplit;

	  return [
	    // `String.prototype.split` method
	    // https://tc39.es/ecma262/#sec-string.prototype.split
	    function split(separator, limit) {
	      var O = requireObjectCoercible$3(this);
	      var splitter = separator == undefined ? undefined : getMethod(separator, SPLIT);
	      return splitter
	        ? splitter.call(separator, O, limit)
	        : internalSplit.call(toString$6(O), separator, limit);
	    },
	    // `RegExp.prototype[@@split]` method
	    // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
	    //
	    // NOTE: This cannot be properly polyfilled in engines that don't support
	    // the 'y' flag.
	    function (string, limit) {
	      var rx = anObject$2(this);
	      var S = toString$6(string);
	      var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);

	      if (res.done) return res.value;

	      var C = speciesConstructor$1(rx, RegExp);

	      var unicodeMatching = rx.unicode;
	      var flags = (rx.ignoreCase ? 'i' : '') +
	                  (rx.multiline ? 'm' : '') +
	                  (rx.unicode ? 'u' : '') +
	                  (UNSUPPORTED_Y ? 'g' : 'y');

	      // ^(? + rx + ) is needed, in combination with some S slicing, to
	      // simulate the 'y' flag.
	      var splitter = new C(UNSUPPORTED_Y ? '^(?:' + rx.source + ')' : rx, flags);
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
	      var p = 0;
	      var q = 0;
	      var A = [];
	      while (q < S.length) {
	        splitter.lastIndex = UNSUPPORTED_Y ? 0 : q;
	        var z = callRegExpExec(splitter, UNSUPPORTED_Y ? S.slice(q) : S);
	        var e;
	        if (
	          z === null ||
	          (e = min$2(toLength$3(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p
	        ) {
	          q = advanceStringIndex(S, q, unicodeMatching);
	        } else {
	          A.push(S.slice(p, q));
	          if (A.length === lim) return A;
	          for (var i = 1; i <= z.length - 1; i++) {
	            A.push(z[i]);
	            if (A.length === lim) return A;
	          }
	          q = p = e;
	        }
	      }
	      A.push(S.slice(p));
	      return A;
	    }
	  ];
	}, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y);

	var $$p = _export;
	var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	var toLength$2 = toLength$d;
	var toString$5 = toString$u;
	var notARegExp = notARegexp;
	var requireObjectCoercible$2 = requireObjectCoercible$i;
	var correctIsRegExpLogic = correctIsRegexpLogic;

	// eslint-disable-next-line es/no-string-prototype-startswith -- safe
	var $startsWith = ''.startsWith;
	var min$1 = Math.min;

	var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('startsWith');
	// https://github.com/zloirock/core-js/pull/702
	var MDN_POLYFILL_BUG = !CORRECT_IS_REGEXP_LOGIC && !!function () {
	  var descriptor = getOwnPropertyDescriptor(String.prototype, 'startsWith');
	  return descriptor && !descriptor.writable;
	}();

	// `String.prototype.startsWith` method
	// https://tc39.es/ecma262/#sec-string.prototype.startswith
	$$p({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
	  startsWith: function startsWith(searchString /* , position = 0 */) {
	    var that = toString$5(requireObjectCoercible$2(this));
	    notARegExp(searchString);
	    var index = toLength$2(min$1(arguments.length > 1 ? arguments[1] : undefined, that.length));
	    var search = toString$5(searchString);
	    return $startsWith
	      ? $startsWith.call(that, search, index)
	      : that.slice(index, index + search.length) === search;
	  }
	});

	var $$o = _export;
	var requireObjectCoercible$1 = requireObjectCoercible$i;
	var toIntegerOrInfinity$2 = toIntegerOrInfinity$h;
	var toString$4 = toString$u;

	var slice$1 = ''.slice;
	var max = Math.max;
	var min = Math.min;

	// eslint-disable-next-line unicorn/prefer-string-slice -- required for testing
	var FORCED$6 = !''.substr || 'ab'.substr(-1) !== 'b';

	// `String.prototype.substr` method
	// https://tc39.es/ecma262/#sec-string.prototype.substr
	$$o({ target: 'String', proto: true, forced: FORCED$6 }, {
	  substr: function substr(start, length) {
	    var that = toString$4(requireObjectCoercible$1(this));
	    var size = that.length;
	    var intStart = toIntegerOrInfinity$2(start);
	    var intLength, intEnd;
	    if (intStart === Infinity) intStart = 0;
	    if (intStart < 0) intStart = max(size + intStart, 0);
	    intLength = length === undefined ? size : toIntegerOrInfinity$2(length);
	    if (intLength <= 0 || intLength === Infinity) return '';
	    intEnd = min(intStart + intLength, size);
	    return intStart >= intEnd ? '' : slice$1.call(that, intStart, intEnd);
	  }
	});

	var PROPER_FUNCTION_NAME$1 = functionName.PROPER;
	var fails$8 = fails$13;
	var whitespaces = whitespaces$4;

	var non = '\u200B\u0085\u180E';

	// check that a method works with the correct list
	// of whitespaces and has a correct name
	var stringTrimForced = function (METHOD_NAME) {
	  return fails$8(function () {
	    return !!whitespaces[METHOD_NAME]()
	      || non[METHOD_NAME]() !== non
	      || (PROPER_FUNCTION_NAME$1 && whitespaces[METHOD_NAME].name !== METHOD_NAME);
	  });
	};

	var $$n = _export;
	var $trim = stringTrim.trim;
	var forcedStringTrimMethod$2 = stringTrimForced;

	// `String.prototype.trim` method
	// https://tc39.es/ecma262/#sec-string.prototype.trim
	$$n({ target: 'String', proto: true, forced: forcedStringTrimMethod$2('trim') }, {
	  trim: function trim() {
	    return $trim(this);
	  }
	});

	var $$m = _export;
	var $trimEnd = stringTrim.end;
	var forcedStringTrimMethod$1 = stringTrimForced;

	var FORCED$5 = forcedStringTrimMethod$1('trimEnd');

	var trimEnd = FORCED$5 ? function trimEnd() {
	  return $trimEnd(this);
	// eslint-disable-next-line es/no-string-prototype-trimstart-trimend -- safe
	} : ''.trimEnd;

	// `String.prototype.{ trimEnd, trimRight }` methods
	// https://tc39.es/ecma262/#sec-string.prototype.trimend
	// https://tc39.es/ecma262/#String.prototype.trimright
	$$m({ target: 'String', proto: true, name: 'trimEnd', forced: FORCED$5 }, {
	  trimEnd: trimEnd,
	  trimRight: trimEnd
	});

	var $$l = _export;
	var $trimStart = stringTrim.start;
	var forcedStringTrimMethod = stringTrimForced;

	var FORCED$4 = forcedStringTrimMethod('trimStart');

	var trimStart = FORCED$4 ? function trimStart() {
	  return $trimStart(this);
	// eslint-disable-next-line es/no-string-prototype-trimstart-trimend -- safe
	} : ''.trimStart;

	// `String.prototype.{ trimStart, trimLeft }` methods
	// https://tc39.es/ecma262/#sec-string.prototype.trimstart
	// https://tc39.es/ecma262/#String.prototype.trimleft
	$$l({ target: 'String', proto: true, name: 'trimStart', forced: FORCED$4 }, {
	  trimStart: trimStart,
	  trimLeft: trimStart
	});

	var requireObjectCoercible = requireObjectCoercible$i;
	var toString$3 = toString$u;

	var quot = /"/g;

	// `CreateHTML` abstract operation
	// https://tc39.es/ecma262/#sec-createhtml
	var createHtml = function (string, tag, attribute, value) {
	  var S = toString$3(requireObjectCoercible(string));
	  var p1 = '<' + tag;
	  if (attribute !== '') p1 += ' ' + attribute + '="' + toString$3(value).replace(quot, '&quot;') + '"';
	  return p1 + '>' + S + '</' + tag + '>';
	};

	var fails$7 = fails$13;

	// check the existence of a method, lowercase
	// of a tag and escaping quotes in arguments
	var stringHtmlForced = function (METHOD_NAME) {
	  return fails$7(function () {
	    var test = ''[METHOD_NAME]('"');
	    return test !== test.toLowerCase() || test.split('"').length > 3;
	  });
	};

	var $$k = _export;
	var createHTML$c = createHtml;
	var forcedStringHTMLMethod$c = stringHtmlForced;

	// `String.prototype.anchor` method
	// https://tc39.es/ecma262/#sec-string.prototype.anchor
	$$k({ target: 'String', proto: true, forced: forcedStringHTMLMethod$c('anchor') }, {
	  anchor: function anchor(name) {
	    return createHTML$c(this, 'a', 'name', name);
	  }
	});

	var $$j = _export;
	var createHTML$b = createHtml;
	var forcedStringHTMLMethod$b = stringHtmlForced;

	// `String.prototype.big` method
	// https://tc39.es/ecma262/#sec-string.prototype.big
	$$j({ target: 'String', proto: true, forced: forcedStringHTMLMethod$b('big') }, {
	  big: function big() {
	    return createHTML$b(this, 'big', '', '');
	  }
	});

	var $$i = _export;
	var createHTML$a = createHtml;
	var forcedStringHTMLMethod$a = stringHtmlForced;

	// `String.prototype.blink` method
	// https://tc39.es/ecma262/#sec-string.prototype.blink
	$$i({ target: 'String', proto: true, forced: forcedStringHTMLMethod$a('blink') }, {
	  blink: function blink() {
	    return createHTML$a(this, 'blink', '', '');
	  }
	});

	var $$h = _export;
	var createHTML$9 = createHtml;
	var forcedStringHTMLMethod$9 = stringHtmlForced;

	// `String.prototype.bold` method
	// https://tc39.es/ecma262/#sec-string.prototype.bold
	$$h({ target: 'String', proto: true, forced: forcedStringHTMLMethod$9('bold') }, {
	  bold: function bold() {
	    return createHTML$9(this, 'b', '', '');
	  }
	});

	var $$g = _export;
	var createHTML$8 = createHtml;
	var forcedStringHTMLMethod$8 = stringHtmlForced;

	// `String.prototype.fixed` method
	// https://tc39.es/ecma262/#sec-string.prototype.fixed
	$$g({ target: 'String', proto: true, forced: forcedStringHTMLMethod$8('fixed') }, {
	  fixed: function fixed() {
	    return createHTML$8(this, 'tt', '', '');
	  }
	});

	var $$f = _export;
	var createHTML$7 = createHtml;
	var forcedStringHTMLMethod$7 = stringHtmlForced;

	// `String.prototype.fontcolor` method
	// https://tc39.es/ecma262/#sec-string.prototype.fontcolor
	$$f({ target: 'String', proto: true, forced: forcedStringHTMLMethod$7('fontcolor') }, {
	  fontcolor: function fontcolor(color) {
	    return createHTML$7(this, 'font', 'color', color);
	  }
	});

	var $$e = _export;
	var createHTML$6 = createHtml;
	var forcedStringHTMLMethod$6 = stringHtmlForced;

	// `String.prototype.fontsize` method
	// https://tc39.es/ecma262/#sec-string.prototype.fontsize
	$$e({ target: 'String', proto: true, forced: forcedStringHTMLMethod$6('fontsize') }, {
	  fontsize: function fontsize(size) {
	    return createHTML$6(this, 'font', 'size', size);
	  }
	});

	var $$d = _export;
	var createHTML$5 = createHtml;
	var forcedStringHTMLMethod$5 = stringHtmlForced;

	// `String.prototype.italics` method
	// https://tc39.es/ecma262/#sec-string.prototype.italics
	$$d({ target: 'String', proto: true, forced: forcedStringHTMLMethod$5('italics') }, {
	  italics: function italics() {
	    return createHTML$5(this, 'i', '', '');
	  }
	});

	var $$c = _export;
	var createHTML$4 = createHtml;
	var forcedStringHTMLMethod$4 = stringHtmlForced;

	// `String.prototype.link` method
	// https://tc39.es/ecma262/#sec-string.prototype.link
	$$c({ target: 'String', proto: true, forced: forcedStringHTMLMethod$4('link') }, {
	  link: function link(url) {
	    return createHTML$4(this, 'a', 'href', url);
	  }
	});

	var $$b = _export;
	var createHTML$3 = createHtml;
	var forcedStringHTMLMethod$3 = stringHtmlForced;

	// `String.prototype.small` method
	// https://tc39.es/ecma262/#sec-string.prototype.small
	$$b({ target: 'String', proto: true, forced: forcedStringHTMLMethod$3('small') }, {
	  small: function small() {
	    return createHTML$3(this, 'small', '', '');
	  }
	});

	var $$a = _export;
	var createHTML$2 = createHtml;
	var forcedStringHTMLMethod$2 = stringHtmlForced;

	// `String.prototype.strike` method
	// https://tc39.es/ecma262/#sec-string.prototype.strike
	$$a({ target: 'String', proto: true, forced: forcedStringHTMLMethod$2('strike') }, {
	  strike: function strike() {
	    return createHTML$2(this, 'strike', '', '');
	  }
	});

	var $$9 = _export;
	var createHTML$1 = createHtml;
	var forcedStringHTMLMethod$1 = stringHtmlForced;

	// `String.prototype.sub` method
	// https://tc39.es/ecma262/#sec-string.prototype.sub
	$$9({ target: 'String', proto: true, forced: forcedStringHTMLMethod$1('sub') }, {
	  sub: function sub() {
	    return createHTML$1(this, 'sub', '', '');
	  }
	});

	var $$8 = _export;
	var createHTML = createHtml;
	var forcedStringHTMLMethod = stringHtmlForced;

	// `String.prototype.sup` method
	// https://tc39.es/ecma262/#sec-string.prototype.sup
	$$8({ target: 'String', proto: true, forced: forcedStringHTMLMethod('sup') }, {
	  sup: function sup() {
	    return createHTML(this, 'sup', '', '');
	  }
	});

	var typedArrayConstructor = {exports: {}};

	/* eslint-disable no-new -- required for testing */

	var global$d = global$O;
	var fails$6 = fails$13;
	var checkCorrectnessOfIteration = checkCorrectnessOfIteration$4;
	var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

	var ArrayBuffer$2 = global$d.ArrayBuffer;
	var Int8Array$2 = global$d.Int8Array;

	var typedArrayConstructorsRequireWrappers = !NATIVE_ARRAY_BUFFER_VIEWS$1 || !fails$6(function () {
	  Int8Array$2(1);
	}) || !fails$6(function () {
	  new Int8Array$2(-1);
	}) || !checkCorrectnessOfIteration(function (iterable) {
	  new Int8Array$2();
	  new Int8Array$2(null);
	  new Int8Array$2(1.5);
	  new Int8Array$2(iterable);
	}, true) || fails$6(function () {
	  // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
	  return new Int8Array$2(new ArrayBuffer$2(2), 1, undefined).length !== 1;
	});

	var toIntegerOrInfinity$1 = toIntegerOrInfinity$h;

	var toPositiveInteger$1 = function (it) {
	  var result = toIntegerOrInfinity$1(it);
	  if (result < 0) throw RangeError("The argument can't be less than 0");
	  return result;
	};

	var toPositiveInteger = toPositiveInteger$1;

	var toOffset$2 = function (it, BYTES) {
	  var offset = toPositiveInteger(it);
	  if (offset % BYTES) throw RangeError('Wrong offset');
	  return offset;
	};

	var aConstructor = aConstructor$3;
	var toObject$1 = toObject$q;
	var lengthOfArrayLike$3 = lengthOfArrayLike$l;
	var getIterator$1 = getIterator$4;
	var getIteratorMethod$1 = getIteratorMethod$5;
	var isArrayIteratorMethod = isArrayIteratorMethod$3;
	var bind$1 = functionBindContext;
	var aTypedArrayConstructor$3 = arrayBufferViewCore.aTypedArrayConstructor;

	var typedArrayFrom$2 = function from(source /* , mapfn, thisArg */) {
	  var C = aConstructor(this);
	  var O = toObject$1(source);
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  var iteratorMethod = getIteratorMethod$1(O);
	  var i, length, result, step, iterator, next;
	  if (iteratorMethod && !isArrayIteratorMethod(iteratorMethod)) {
	    iterator = getIterator$1(O, iteratorMethod);
	    next = iterator.next;
	    O = [];
	    while (!(step = next.call(iterator)).done) {
	      O.push(step.value);
	    }
	  }
	  if (mapping && argumentsLength > 2) {
	    mapfn = bind$1(mapfn, arguments[2], 2);
	  }
	  length = lengthOfArrayLike$3(O);
	  result = new (aTypedArrayConstructor$3(C))(length);
	  for (i = 0; length > i; i++) {
	    result[i] = mapping ? mapfn(O[i], i) : O[i];
	  }
	  return result;
	};

	var $$7 = _export;
	var global$c = global$O;
	var DESCRIPTORS$1 = descriptors;
	var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS$2 = typedArrayConstructorsRequireWrappers;
	var ArrayBufferViewCore$p = arrayBufferViewCore;
	var ArrayBufferModule = arrayBuffer;
	var anInstance$3 = anInstance$8;
	var createPropertyDescriptor$1 = createPropertyDescriptor$9;
	var createNonEnumerableProperty$2 = createNonEnumerableProperty$d;
	var isIntegralNumber = isIntegralNumber$3;
	var toLength$1 = toLength$d;
	var toIndex = toIndex$2;
	var toOffset$1 = toOffset$2;
	var toPropertyKey = toPropertyKey$8;
	var hasOwn$3 = hasOwnProperty_1;
	var classof$1 = classof$b;
	var isObject$a = isObject$G;
	var isSymbol$4 = isSymbol$9;
	var create$1 = objectCreate$1;
	var setPrototypeOf = objectSetPrototypeOf$1;
	var getOwnPropertyNames = objectGetOwnPropertyNames.f;
	var typedArrayFrom$1 = typedArrayFrom$2;
	var forEach$1 = arrayIteration.forEach;
	var setSpecies = setSpecies$6;
	var definePropertyModule = objectDefineProperty;
	var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
	var InternalStateModule$3 = internalState;
	var inheritIfRequired = inheritIfRequired$4;

	var getInternalState = InternalStateModule$3.get;
	var setInternalState$3 = InternalStateModule$3.set;
	var nativeDefineProperty = definePropertyModule.f;
	var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
	var round = Math.round;
	var RangeError$1 = global$c.RangeError;
	var ArrayBuffer$1 = ArrayBufferModule.ArrayBuffer;
	var DataView$3 = ArrayBufferModule.DataView;
	var NATIVE_ARRAY_BUFFER_VIEWS = ArrayBufferViewCore$p.NATIVE_ARRAY_BUFFER_VIEWS;
	var TYPED_ARRAY_CONSTRUCTOR$1 = ArrayBufferViewCore$p.TYPED_ARRAY_CONSTRUCTOR;
	var TYPED_ARRAY_TAG = ArrayBufferViewCore$p.TYPED_ARRAY_TAG;
	var TypedArray = ArrayBufferViewCore$p.TypedArray;
	var TypedArrayPrototype = ArrayBufferViewCore$p.TypedArrayPrototype;
	var aTypedArrayConstructor$2 = ArrayBufferViewCore$p.aTypedArrayConstructor;
	var isTypedArray$2 = ArrayBufferViewCore$p.isTypedArray;
	var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
	var WRONG_LENGTH = 'Wrong length';

	var fromList = function (C, list) {
	  var index = 0;
	  var length = list.length;
	  var result = new (aTypedArrayConstructor$2(C))(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	};

	var addGetter = function (it, key) {
	  nativeDefineProperty(it, key, { get: function () {
	    return getInternalState(this)[key];
	  } });
	};

	var isArrayBuffer = function (it) {
	  var klass;
	  return it instanceof ArrayBuffer$1 || (klass = classof$1(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
	};

	var isTypedArrayIndex = function (target, key) {
	  return isTypedArray$2(target)
	    && !isSymbol$4(key)
	    && key in target
	    && isIntegralNumber(+key)
	    && key >= 0;
	};

	var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
	  key = toPropertyKey(key);
	  return isTypedArrayIndex(target, key)
	    ? createPropertyDescriptor$1(2, target[key])
	    : nativeGetOwnPropertyDescriptor(target, key);
	};

	var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
	  key = toPropertyKey(key);
	  if (isTypedArrayIndex(target, key)
	    && isObject$a(descriptor)
	    && hasOwn$3(descriptor, 'value')
	    && !hasOwn$3(descriptor, 'get')
	    && !hasOwn$3(descriptor, 'set')
	    // TODO: add validation descriptor w/o calling accessors
	    && !descriptor.configurable
	    && (!hasOwn$3(descriptor, 'writable') || descriptor.writable)
	    && (!hasOwn$3(descriptor, 'enumerable') || descriptor.enumerable)
	  ) {
	    target[key] = descriptor.value;
	    return target;
	  } return nativeDefineProperty(target, key, descriptor);
	};

	if (DESCRIPTORS$1) {
	  if (!NATIVE_ARRAY_BUFFER_VIEWS) {
	    getOwnPropertyDescriptorModule.f = wrappedGetOwnPropertyDescriptor;
	    definePropertyModule.f = wrappedDefineProperty;
	    addGetter(TypedArrayPrototype, 'buffer');
	    addGetter(TypedArrayPrototype, 'byteOffset');
	    addGetter(TypedArrayPrototype, 'byteLength');
	    addGetter(TypedArrayPrototype, 'length');
	  }

	  $$7({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
	    getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
	    defineProperty: wrappedDefineProperty
	  });

	  typedArrayConstructor.exports = function (TYPE, wrapper, CLAMPED) {
	    var BYTES = TYPE.match(/\d+$/)[0] / 8;
	    var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
	    var GETTER = 'get' + TYPE;
	    var SETTER = 'set' + TYPE;
	    var NativeTypedArrayConstructor = global$c[CONSTRUCTOR_NAME];
	    var TypedArrayConstructor = NativeTypedArrayConstructor;
	    var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
	    var exported = {};

	    var getter = function (that, index) {
	      var data = getInternalState(that);
	      return data.view[GETTER](index * BYTES + data.byteOffset, true);
	    };

	    var setter = function (that, index, value) {
	      var data = getInternalState(that);
	      if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
	      data.view[SETTER](index * BYTES + data.byteOffset, value, true);
	    };

	    var addElement = function (that, index) {
	      nativeDefineProperty(that, index, {
	        get: function () {
	          return getter(this, index);
	        },
	        set: function (value) {
	          return setter(this, index, value);
	        },
	        enumerable: true
	      });
	    };

	    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
	      TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
	        anInstance$3(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
	        var index = 0;
	        var byteOffset = 0;
	        var buffer, byteLength, length;
	        if (!isObject$a(data)) {
	          length = toIndex(data);
	          byteLength = length * BYTES;
	          buffer = new ArrayBuffer$1(byteLength);
	        } else if (isArrayBuffer(data)) {
	          buffer = data;
	          byteOffset = toOffset$1(offset, BYTES);
	          var $len = data.byteLength;
	          if ($length === undefined) {
	            if ($len % BYTES) throw RangeError$1(WRONG_LENGTH);
	            byteLength = $len - byteOffset;
	            if (byteLength < 0) throw RangeError$1(WRONG_LENGTH);
	          } else {
	            byteLength = toLength$1($length) * BYTES;
	            if (byteLength + byteOffset > $len) throw RangeError$1(WRONG_LENGTH);
	          }
	          length = byteLength / BYTES;
	        } else if (isTypedArray$2(data)) {
	          return fromList(TypedArrayConstructor, data);
	        } else {
	          return typedArrayFrom$1.call(TypedArrayConstructor, data);
	        }
	        setInternalState$3(that, {
	          buffer: buffer,
	          byteOffset: byteOffset,
	          byteLength: byteLength,
	          length: length,
	          view: new DataView$3(buffer)
	        });
	        while (index < length) addElement(that, index++);
	      });

	      if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray);
	      TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = create$1(TypedArrayPrototype);
	    } else if (TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS$2) {
	      TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
	        anInstance$3(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME);
	        return inheritIfRequired(function () {
	          if (!isObject$a(data)) return new NativeTypedArrayConstructor(toIndex(data));
	          if (isArrayBuffer(data)) return $length !== undefined
	            ? new NativeTypedArrayConstructor(data, toOffset$1(typedArrayOffset, BYTES), $length)
	            : typedArrayOffset !== undefined
	              ? new NativeTypedArrayConstructor(data, toOffset$1(typedArrayOffset, BYTES))
	              : new NativeTypedArrayConstructor(data);
	          if (isTypedArray$2(data)) return fromList(TypedArrayConstructor, data);
	          return typedArrayFrom$1.call(TypedArrayConstructor, data);
	        }(), dummy, TypedArrayConstructor);
	      });

	      if (setPrototypeOf) setPrototypeOf(TypedArrayConstructor, TypedArray);
	      forEach$1(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
	        if (!(key in TypedArrayConstructor)) {
	          createNonEnumerableProperty$2(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
	        }
	      });
	      TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
	    }

	    if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
	      createNonEnumerableProperty$2(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
	    }

	    createNonEnumerableProperty$2(TypedArrayConstructorPrototype, TYPED_ARRAY_CONSTRUCTOR$1, TypedArrayConstructor);

	    if (TYPED_ARRAY_TAG) {
	      createNonEnumerableProperty$2(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
	    }

	    exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

	    $$7({
	      global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
	    }, exported);

	    if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
	      createNonEnumerableProperty$2(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
	    }

	    if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
	      createNonEnumerableProperty$2(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
	    }

	    setSpecies(CONSTRUCTOR_NAME);
	  };
	} else typedArrayConstructor.exports = function () { /* empty */ };

	var createTypedArrayConstructor$8 = typedArrayConstructor.exports;

	// `Float32Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$8('Float32', function (init) {
	  return function Float32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var createTypedArrayConstructor$7 = typedArrayConstructor.exports;

	// `Float64Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$7('Float64', function (init) {
	  return function Float64Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var createTypedArrayConstructor$6 = typedArrayConstructor.exports;

	// `Int8Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$6('Int8', function (init) {
	  return function Int8Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var createTypedArrayConstructor$5 = typedArrayConstructor.exports;

	// `Int16Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$5('Int16', function (init) {
	  return function Int16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var createTypedArrayConstructor$4 = typedArrayConstructor.exports;

	// `Int32Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$4('Int32', function (init) {
	  return function Int32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var createTypedArrayConstructor$3 = typedArrayConstructor.exports;

	// `Uint8Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$3('Uint8', function (init) {
	  return function Uint8Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var createTypedArrayConstructor$2 = typedArrayConstructor.exports;

	// `Uint8ClampedArray` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$2('Uint8', function (init) {
	  return function Uint8ClampedArray(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	}, true);

	var createTypedArrayConstructor$1 = typedArrayConstructor.exports;

	// `Uint16Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$1('Uint16', function (init) {
	  return function Uint16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var createTypedArrayConstructor = typedArrayConstructor.exports;

	// `Uint32Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor('Uint32', function (init) {
	  return function Uint32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var ArrayBufferViewCore$o = arrayBufferViewCore;
	var lengthOfArrayLike$2 = lengthOfArrayLike$l;
	var toIntegerOrInfinity = toIntegerOrInfinity$h;

	var aTypedArray$m = ArrayBufferViewCore$o.aTypedArray;
	var exportTypedArrayMethod$n = ArrayBufferViewCore$o.exportTypedArrayMethod;

	// `%TypedArray%.prototype.at` method
	// https://github.com/tc39/proposal-relative-indexing-method
	exportTypedArrayMethod$n('at', function at(index) {
	  var O = aTypedArray$m(this);
	  var len = lengthOfArrayLike$2(O);
	  var relativeIndex = toIntegerOrInfinity(index);
	  var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
	  return (k < 0 || k >= len) ? undefined : O[k];
	});

	var ArrayBufferViewCore$n = arrayBufferViewCore;
	var $copyWithin = arrayCopyWithin;

	var aTypedArray$l = ArrayBufferViewCore$n.aTypedArray;
	var exportTypedArrayMethod$m = ArrayBufferViewCore$n.exportTypedArrayMethod;

	// `%TypedArray%.prototype.copyWithin` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin
	exportTypedArrayMethod$m('copyWithin', function copyWithin(target, start /* , end */) {
	  return $copyWithin.call(aTypedArray$l(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
	});

	var ArrayBufferViewCore$m = arrayBufferViewCore;
	var $every = arrayIteration.every;

	var aTypedArray$k = ArrayBufferViewCore$m.aTypedArray;
	var exportTypedArrayMethod$l = ArrayBufferViewCore$m.exportTypedArrayMethod;

	// `%TypedArray%.prototype.every` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.every
	exportTypedArrayMethod$l('every', function every(callbackfn /* , thisArg */) {
	  return $every(aTypedArray$k(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$l = arrayBufferViewCore;
	var $fill = arrayFill$1;

	var aTypedArray$j = ArrayBufferViewCore$l.aTypedArray;
	var exportTypedArrayMethod$k = ArrayBufferViewCore$l.exportTypedArrayMethod;

	// `%TypedArray%.prototype.fill` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill
	// eslint-disable-next-line no-unused-vars -- required for `.length`
	exportTypedArrayMethod$k('fill', function fill(value /* , start, end */) {
	  return $fill.apply(aTypedArray$j(this), arguments);
	});

	var arrayFromConstructorAndList$1 = function (Constructor, list) {
	  var index = 0;
	  var length = list.length;
	  var result = new Constructor(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	};

	var ArrayBufferViewCore$k = arrayBufferViewCore;
	var speciesConstructor = speciesConstructor$6;

	var TYPED_ARRAY_CONSTRUCTOR = ArrayBufferViewCore$k.TYPED_ARRAY_CONSTRUCTOR;
	var aTypedArrayConstructor$1 = ArrayBufferViewCore$k.aTypedArrayConstructor;

	// a part of `TypedArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#typedarray-species-create
	var typedArraySpeciesConstructor$4 = function (originalArray) {
	  return aTypedArrayConstructor$1(speciesConstructor(originalArray, originalArray[TYPED_ARRAY_CONSTRUCTOR]));
	};

	var arrayFromConstructorAndList = arrayFromConstructorAndList$1;
	var typedArraySpeciesConstructor$3 = typedArraySpeciesConstructor$4;

	var typedArrayFromSpeciesAndList = function (instance, list) {
	  return arrayFromConstructorAndList(typedArraySpeciesConstructor$3(instance), list);
	};

	var ArrayBufferViewCore$j = arrayBufferViewCore;
	var $filter = arrayIteration.filter;
	var fromSpeciesAndList = typedArrayFromSpeciesAndList;

	var aTypedArray$i = ArrayBufferViewCore$j.aTypedArray;
	var exportTypedArrayMethod$j = ArrayBufferViewCore$j.exportTypedArrayMethod;

	// `%TypedArray%.prototype.filter` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter
	exportTypedArrayMethod$j('filter', function filter(callbackfn /* , thisArg */) {
	  var list = $filter(aTypedArray$i(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  return fromSpeciesAndList(this, list);
	});

	var ArrayBufferViewCore$i = arrayBufferViewCore;
	var $find = arrayIteration.find;

	var aTypedArray$h = ArrayBufferViewCore$i.aTypedArray;
	var exportTypedArrayMethod$i = ArrayBufferViewCore$i.exportTypedArrayMethod;

	// `%TypedArray%.prototype.find` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.find
	exportTypedArrayMethod$i('find', function find(predicate /* , thisArg */) {
	  return $find(aTypedArray$h(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$h = arrayBufferViewCore;
	var $findIndex = arrayIteration.findIndex;

	var aTypedArray$g = ArrayBufferViewCore$h.aTypedArray;
	var exportTypedArrayMethod$h = ArrayBufferViewCore$h.exportTypedArrayMethod;

	// `%TypedArray%.prototype.findIndex` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.findindex
	exportTypedArrayMethod$h('findIndex', function findIndex(predicate /* , thisArg */) {
	  return $findIndex(aTypedArray$g(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$g = arrayBufferViewCore;
	var $forEach = arrayIteration.forEach;

	var aTypedArray$f = ArrayBufferViewCore$g.aTypedArray;
	var exportTypedArrayMethod$g = ArrayBufferViewCore$g.exportTypedArrayMethod;

	// `%TypedArray%.prototype.forEach` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach
	exportTypedArrayMethod$g('forEach', function forEach(callbackfn /* , thisArg */) {
	  $forEach(aTypedArray$f(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS$1 = typedArrayConstructorsRequireWrappers;
	var exportTypedArrayStaticMethod$1 = arrayBufferViewCore.exportTypedArrayStaticMethod;
	var typedArrayFrom = typedArrayFrom$2;

	// `%TypedArray%.from` method
	// https://tc39.es/ecma262/#sec-%typedarray%.from
	exportTypedArrayStaticMethod$1('from', typedArrayFrom, TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS$1);

	var ArrayBufferViewCore$f = arrayBufferViewCore;
	var $includes = arrayIncludes.includes;

	var aTypedArray$e = ArrayBufferViewCore$f.aTypedArray;
	var exportTypedArrayMethod$f = ArrayBufferViewCore$f.exportTypedArrayMethod;

	// `%TypedArray%.prototype.includes` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.includes
	exportTypedArrayMethod$f('includes', function includes(searchElement /* , fromIndex */) {
	  return $includes(aTypedArray$e(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$e = arrayBufferViewCore;
	var $indexOf = arrayIncludes.indexOf;

	var aTypedArray$d = ArrayBufferViewCore$e.aTypedArray;
	var exportTypedArrayMethod$e = ArrayBufferViewCore$e.exportTypedArrayMethod;

	// `%TypedArray%.prototype.indexOf` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof
	exportTypedArrayMethod$e('indexOf', function indexOf(searchElement /* , fromIndex */) {
	  return $indexOf(aTypedArray$d(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var global$b = global$O;
	var PROPER_FUNCTION_NAME = functionName.PROPER;
	var ArrayBufferViewCore$d = arrayBufferViewCore;
	var ArrayIterators = es_array_iterator;
	var wellKnownSymbol$3 = wellKnownSymbol$x;

	var ITERATOR$3 = wellKnownSymbol$3('iterator');
	var Uint8Array$3 = global$b.Uint8Array;
	var arrayValues = ArrayIterators.values;
	var arrayKeys = ArrayIterators.keys;
	var arrayEntries = ArrayIterators.entries;
	var aTypedArray$c = ArrayBufferViewCore$d.aTypedArray;
	var exportTypedArrayMethod$d = ArrayBufferViewCore$d.exportTypedArrayMethod;
	var nativeTypedArrayIterator = Uint8Array$3 && Uint8Array$3.prototype[ITERATOR$3];

	var PROPER_ARRAY_VALUES_NAME = !!nativeTypedArrayIterator && nativeTypedArrayIterator.name === 'values';

	var typedArrayValues = function values() {
	  return arrayValues.call(aTypedArray$c(this));
	};

	// `%TypedArray%.prototype.entries` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.entries
	exportTypedArrayMethod$d('entries', function entries() {
	  return arrayEntries.call(aTypedArray$c(this));
	});
	// `%TypedArray%.prototype.keys` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.keys
	exportTypedArrayMethod$d('keys', function keys() {
	  return arrayKeys.call(aTypedArray$c(this));
	});
	// `%TypedArray%.prototype.values` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.values
	exportTypedArrayMethod$d('values', typedArrayValues, PROPER_FUNCTION_NAME && !PROPER_ARRAY_VALUES_NAME);
	// `%TypedArray%.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator
	exportTypedArrayMethod$d(ITERATOR$3, typedArrayValues, PROPER_FUNCTION_NAME && !PROPER_ARRAY_VALUES_NAME);

	var ArrayBufferViewCore$c = arrayBufferViewCore;

	var aTypedArray$b = ArrayBufferViewCore$c.aTypedArray;
	var exportTypedArrayMethod$c = ArrayBufferViewCore$c.exportTypedArrayMethod;
	var $join = [].join;

	// `%TypedArray%.prototype.join` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.join
	// eslint-disable-next-line no-unused-vars -- required for `.length`
	exportTypedArrayMethod$c('join', function join(separator) {
	  return $join.apply(aTypedArray$b(this), arguments);
	});

	var ArrayBufferViewCore$b = arrayBufferViewCore;
	var $lastIndexOf = arrayLastIndexOf;

	var aTypedArray$a = ArrayBufferViewCore$b.aTypedArray;
	var exportTypedArrayMethod$b = ArrayBufferViewCore$b.exportTypedArrayMethod;

	// `%TypedArray%.prototype.lastIndexOf` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.lastindexof
	// eslint-disable-next-line no-unused-vars -- required for `.length`
	exportTypedArrayMethod$b('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
	  return $lastIndexOf.apply(aTypedArray$a(this), arguments);
	});

	var ArrayBufferViewCore$a = arrayBufferViewCore;
	var $map = arrayIteration.map;
	var typedArraySpeciesConstructor$2 = typedArraySpeciesConstructor$4;

	var aTypedArray$9 = ArrayBufferViewCore$a.aTypedArray;
	var exportTypedArrayMethod$a = ArrayBufferViewCore$a.exportTypedArrayMethod;

	// `%TypedArray%.prototype.map` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.map
	exportTypedArrayMethod$a('map', function map(mapfn /* , thisArg */) {
	  return $map(aTypedArray$9(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
	    return new (typedArraySpeciesConstructor$2(O))(length);
	  });
	});

	var ArrayBufferViewCore$9 = arrayBufferViewCore;
	var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = typedArrayConstructorsRequireWrappers;

	var aTypedArrayConstructor = ArrayBufferViewCore$9.aTypedArrayConstructor;
	var exportTypedArrayStaticMethod = ArrayBufferViewCore$9.exportTypedArrayStaticMethod;

	// `%TypedArray%.of` method
	// https://tc39.es/ecma262/#sec-%typedarray%.of
	exportTypedArrayStaticMethod('of', function of(/* ...items */) {
	  var index = 0;
	  var length = arguments.length;
	  var result = new (aTypedArrayConstructor(this))(length);
	  while (length > index) result[index] = arguments[index++];
	  return result;
	}, TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS);

	var ArrayBufferViewCore$8 = arrayBufferViewCore;
	var $reduce = arrayReduce.left;

	var aTypedArray$8 = ArrayBufferViewCore$8.aTypedArray;
	var exportTypedArrayMethod$9 = ArrayBufferViewCore$8.exportTypedArrayMethod;

	// `%TypedArray%.prototype.reduce` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce
	exportTypedArrayMethod$9('reduce', function reduce(callbackfn /* , initialValue */) {
	  return $reduce(aTypedArray$8(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$7 = arrayBufferViewCore;
	var $reduceRight = arrayReduce.right;

	var aTypedArray$7 = ArrayBufferViewCore$7.aTypedArray;
	var exportTypedArrayMethod$8 = ArrayBufferViewCore$7.exportTypedArrayMethod;

	// `%TypedArray%.prototype.reduceRicht` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright
	exportTypedArrayMethod$8('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
	  return $reduceRight(aTypedArray$7(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$6 = arrayBufferViewCore;

	var aTypedArray$6 = ArrayBufferViewCore$6.aTypedArray;
	var exportTypedArrayMethod$7 = ArrayBufferViewCore$6.exportTypedArrayMethod;
	var floor$2 = Math.floor;

	// `%TypedArray%.prototype.reverse` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse
	exportTypedArrayMethod$7('reverse', function reverse() {
	  var that = this;
	  var length = aTypedArray$6(that).length;
	  var middle = floor$2(length / 2);
	  var index = 0;
	  var value;
	  while (index < middle) {
	    value = that[index];
	    that[index++] = that[--length];
	    that[length] = value;
	  } return that;
	});

	var ArrayBufferViewCore$5 = arrayBufferViewCore;
	var lengthOfArrayLike$1 = lengthOfArrayLike$l;
	var toOffset = toOffset$2;
	var toObject = toObject$q;
	var fails$5 = fails$13;

	var aTypedArray$5 = ArrayBufferViewCore$5.aTypedArray;
	var exportTypedArrayMethod$6 = ArrayBufferViewCore$5.exportTypedArrayMethod;

	var FORCED$3 = fails$5(function () {
	  // eslint-disable-next-line es/no-typed-arrays -- required for testing
	  new Int8Array(1).set({});
	});

	// `%TypedArray%.prototype.set` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
	exportTypedArrayMethod$6('set', function set(arrayLike /* , offset */) {
	  aTypedArray$5(this);
	  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
	  var length = this.length;
	  var src = toObject(arrayLike);
	  var len = lengthOfArrayLike$1(src);
	  var index = 0;
	  if (len + offset > length) throw RangeError('Wrong length');
	  while (index < len) this[offset + index] = src[index++];
	}, FORCED$3);

	var ArrayBufferViewCore$4 = arrayBufferViewCore;
	var typedArraySpeciesConstructor$1 = typedArraySpeciesConstructor$4;
	var fails$4 = fails$13;

	var aTypedArray$4 = ArrayBufferViewCore$4.aTypedArray;
	var exportTypedArrayMethod$5 = ArrayBufferViewCore$4.exportTypedArrayMethod;
	var $slice$1 = [].slice;

	var FORCED$2 = fails$4(function () {
	  // eslint-disable-next-line es/no-typed-arrays -- required for testing
	  new Int8Array(1).slice();
	});

	// `%TypedArray%.prototype.slice` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice
	exportTypedArrayMethod$5('slice', function slice(start, end) {
	  var list = $slice$1.call(aTypedArray$4(this), start, end);
	  var C = typedArraySpeciesConstructor$1(this);
	  var index = 0;
	  var length = list.length;
	  var result = new C(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	}, FORCED$2);

	var ArrayBufferViewCore$3 = arrayBufferViewCore;
	var $some = arrayIteration.some;

	var aTypedArray$3 = ArrayBufferViewCore$3.aTypedArray;
	var exportTypedArrayMethod$4 = ArrayBufferViewCore$3.exportTypedArrayMethod;

	// `%TypedArray%.prototype.some` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.some
	exportTypedArrayMethod$4('some', function some(callbackfn /* , thisArg */) {
	  return $some(aTypedArray$3(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$2 = arrayBufferViewCore;
	var global$a = global$O;
	var fails$3 = fails$13;
	var aCallable = aCallable$f;
	var lengthOfArrayLike = lengthOfArrayLike$l;
	var internalSort = arraySort;
	var FF = engineFfVersion;
	var IE_OR_EDGE = engineIsIeOrEdge;
	var V8 = engineV8Version;
	var WEBKIT = engineWebkitVersion;

	var aTypedArray$2 = ArrayBufferViewCore$2.aTypedArray;
	var exportTypedArrayMethod$3 = ArrayBufferViewCore$2.exportTypedArrayMethod;
	var Uint16Array = global$a.Uint16Array;
	var nativeSort = Uint16Array && Uint16Array.prototype.sort;

	// WebKit
	var ACCEPT_INCORRECT_ARGUMENTS = !!nativeSort && !fails$3(function () {
	  var array = new Uint16Array(2);
	  array.sort(null);
	  array.sort({});
	});

	var STABLE_SORT = !!nativeSort && !fails$3(function () {
	  // feature detection can be too slow, so check engines versions
	  if (V8) return V8 < 74;
	  if (FF) return FF < 67;
	  if (IE_OR_EDGE) return true;
	  if (WEBKIT) return WEBKIT < 602;

	  var array = new Uint16Array(516);
	  var expected = Array(516);
	  var index, mod;

	  for (index = 0; index < 516; index++) {
	    mod = index % 4;
	    array[index] = 515 - index;
	    expected[index] = index - 2 * mod + 3;
	  }

	  array.sort(function (a, b) {
	    return (a / 4 | 0) - (b / 4 | 0);
	  });

	  for (index = 0; index < 516; index++) {
	    if (array[index] !== expected[index]) return true;
	  }
	});

	var getSortCompare = function (comparefn) {
	  return function (x, y) {
	    if (comparefn !== undefined) return +comparefn(x, y) || 0;
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (y !== y) return -1;
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (x !== x) return 1;
	    if (x === 0 && y === 0) return 1 / x > 0 && 1 / y < 0 ? 1 : -1;
	    return x > y;
	  };
	};

	// `%TypedArray%.prototype.sort` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
	exportTypedArrayMethod$3('sort', function sort(comparefn) {
	  var array = this;
	  if (comparefn !== undefined) aCallable(comparefn);
	  if (STABLE_SORT) return nativeSort.call(array, comparefn);

	  aTypedArray$2(array);
	  var arrayLength = lengthOfArrayLike(array);
	  var items = Array(arrayLength);
	  var index;

	  for (index = 0; index < arrayLength; index++) {
	    items[index] = array[index];
	  }

	  items = internalSort(array, getSortCompare(comparefn));

	  for (index = 0; index < arrayLength; index++) {
	    array[index] = items[index];
	  }

	  return array;
	}, !STABLE_SORT || ACCEPT_INCORRECT_ARGUMENTS);

	var ArrayBufferViewCore$1 = arrayBufferViewCore;
	var toLength = toLength$d;
	var toAbsoluteIndex = toAbsoluteIndex$8;
	var typedArraySpeciesConstructor = typedArraySpeciesConstructor$4;

	var aTypedArray$1 = ArrayBufferViewCore$1.aTypedArray;
	var exportTypedArrayMethod$2 = ArrayBufferViewCore$1.exportTypedArrayMethod;

	// `%TypedArray%.prototype.subarray` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray
	exportTypedArrayMethod$2('subarray', function subarray(begin, end) {
	  var O = aTypedArray$1(this);
	  var length = O.length;
	  var beginIndex = toAbsoluteIndex(begin, length);
	  var C = typedArraySpeciesConstructor(O);
	  return new C(
	    O.buffer,
	    O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
	    toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex)
	  );
	});

	var global$9 = global$O;
	var ArrayBufferViewCore = arrayBufferViewCore;
	var fails$2 = fails$13;

	var Int8Array$1 = global$9.Int8Array;
	var aTypedArray = ArrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$1 = ArrayBufferViewCore.exportTypedArrayMethod;
	var $toLocaleString = [].toLocaleString;
	var $slice = [].slice;

	// iOS Safari 6.x fails here
	var TO_LOCALE_STRING_BUG = !!Int8Array$1 && fails$2(function () {
	  $toLocaleString.call(new Int8Array$1(1));
	});

	var FORCED$1 = fails$2(function () {
	  return [1, 2].toLocaleString() != new Int8Array$1([1, 2]).toLocaleString();
	}) || !fails$2(function () {
	  Int8Array$1.prototype.toLocaleString.call([1, 2]);
	});

	// `%TypedArray%.prototype.toLocaleString` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring
	exportTypedArrayMethod$1('toLocaleString', function toLocaleString() {
	  return $toLocaleString.apply(TO_LOCALE_STRING_BUG ? $slice.call(aTypedArray(this)) : aTypedArray(this), arguments);
	}, FORCED$1);

	var exportTypedArrayMethod = arrayBufferViewCore.exportTypedArrayMethod;
	var fails$1 = fails$13;
	var global$8 = global$O;

	var Uint8Array$2 = global$8.Uint8Array;
	var Uint8ArrayPrototype = Uint8Array$2 && Uint8Array$2.prototype || {};
	var arrayToString = [].toString;
	var arrayJoin = [].join;

	if (fails$1(function () { arrayToString.call({}); })) {
	  arrayToString = function toString() {
	    return arrayJoin.call(this);
	  };
	}

	var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

	// `%TypedArray%.prototype.toString` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tostring
	exportTypedArrayMethod('toString', arrayToString, IS_NOT_ARRAY_METHOD);

	var $$6 = _export;
	var toString$2 = toString$u;

	var fromCharCode = String.fromCharCode;
	var hex2 = /^[\da-f]{2}$/i;
	var hex4 = /^[\da-f]{4}$/i;

	// `unescape` method
	// https://tc39.es/ecma262/#sec-unescape-string
	$$6({ global: true }, {
	  unescape: function unescape(string) {
	    var str = toString$2(string);
	    var result = '';
	    var length = str.length;
	    var index = 0;
	    var chr, slice;
	    while (index < length) {
	      chr = str.charAt(index++);
	      if (chr === '%') {
	        if (str.charAt(index) === 'u') {
	          slice = str.slice(index + 1, index + 5);
	          if (hex4.test(slice)) {
	            result += fromCharCode(parseInt(slice, 16));
	            index += 5;
	            continue;
	          }
	        } else {
	          slice = str.slice(index, index + 2);
	          if (hex2.test(slice)) {
	            result += fromCharCode(parseInt(slice, 16));
	            index += 2;
	            continue;
	          }
	        }
	      }
	      result += chr;
	    } return result;
	  }
	});

	var redefineAll$2 = redefineAll$6;
	var getWeakData = internalMetadata.exports.getWeakData;
	var anObject$1 = anObject$z;
	var isObject$9 = isObject$G;
	var anInstance$2 = anInstance$8;
	var iterate = iterate$8;
	var ArrayIterationModule = arrayIteration;
	var hasOwn$2 = hasOwnProperty_1;
	var InternalStateModule$2 = internalState;

	var setInternalState$2 = InternalStateModule$2.set;
	var internalStateGetterFor = InternalStateModule$2.getterFor;
	var find$1 = ArrayIterationModule.find;
	var findIndex = ArrayIterationModule.findIndex;
	var id = 0;

	// fallback for uncaught frozen keys
	var uncaughtFrozenStore = function (store) {
	  return store.frozen || (store.frozen = new UncaughtFrozenStore());
	};

	var UncaughtFrozenStore = function () {
	  this.entries = [];
	};

	var findUncaughtFrozen = function (store, key) {
	  return find$1(store.entries, function (it) {
	    return it[0] === key;
	  });
	};

	UncaughtFrozenStore.prototype = {
	  get: function (key) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) return entry[1];
	  },
	  has: function (key) {
	    return !!findUncaughtFrozen(this, key);
	  },
	  set: function (key, value) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) entry[1] = value;
	    else this.entries.push([key, value]);
	  },
	  'delete': function (key) {
	    var index = findIndex(this.entries, function (it) {
	      return it[0] === key;
	    });
	    if (~index) this.entries.splice(index, 1);
	    return !!~index;
	  }
	};

	var collectionWeak$2 = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      anInstance$2(that, C, CONSTRUCTOR_NAME);
	      setInternalState$2(that, {
	        type: CONSTRUCTOR_NAME,
	        id: id++,
	        frozen: undefined
	      });
	      if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
	    });

	    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

	    var define = function (that, key, value) {
	      var state = getInternalState(that);
	      var data = getWeakData(anObject$1(key), true);
	      if (data === true) uncaughtFrozenStore(state).set(key, value);
	      else data[state.id] = value;
	      return that;
	    };

	    redefineAll$2(C.prototype, {
	      // `{ WeakMap, WeakSet }.prototype.delete(key)` methods
	      // https://tc39.es/ecma262/#sec-weakmap.prototype.delete
	      // https://tc39.es/ecma262/#sec-weakset.prototype.delete
	      'delete': function (key) {
	        var state = getInternalState(this);
	        if (!isObject$9(key)) return false;
	        var data = getWeakData(key);
	        if (data === true) return uncaughtFrozenStore(state)['delete'](key);
	        return data && hasOwn$2(data, state.id) && delete data[state.id];
	      },
	      // `{ WeakMap, WeakSet }.prototype.has(key)` methods
	      // https://tc39.es/ecma262/#sec-weakmap.prototype.has
	      // https://tc39.es/ecma262/#sec-weakset.prototype.has
	      has: function has(key) {
	        var state = getInternalState(this);
	        if (!isObject$9(key)) return false;
	        var data = getWeakData(key);
	        if (data === true) return uncaughtFrozenStore(state).has(key);
	        return data && hasOwn$2(data, state.id);
	      }
	    });

	    redefineAll$2(C.prototype, IS_MAP ? {
	      // `WeakMap.prototype.get(key)` method
	      // https://tc39.es/ecma262/#sec-weakmap.prototype.get
	      get: function get(key) {
	        var state = getInternalState(this);
	        if (isObject$9(key)) {
	          var data = getWeakData(key);
	          if (data === true) return uncaughtFrozenStore(state).get(key);
	          return data ? data[state.id] : undefined;
	        }
	      },
	      // `WeakMap.prototype.set(key, value)` method
	      // https://tc39.es/ecma262/#sec-weakmap.prototype.set
	      set: function set(key, value) {
	        return define(this, key, value);
	      }
	    } : {
	      // `WeakSet.prototype.add(value)` method
	      // https://tc39.es/ecma262/#sec-weakset.prototype.add
	      add: function add(value) {
	        return define(this, value, true);
	      }
	    });

	    return C;
	  }
	};

	var global$7 = global$O;
	var redefineAll$1 = redefineAll$6;
	var InternalMetadataModule = internalMetadata.exports;
	var collection$1 = collection$4;
	var collectionWeak$1 = collectionWeak$2;
	var isObject$8 = isObject$G;
	var enforceIternalState = internalState.enforce;
	var NATIVE_WEAK_MAP = nativeWeakMap;

	var IS_IE11 = !global$7.ActiveXObject && 'ActiveXObject' in global$7;
	// eslint-disable-next-line es/no-object-isextensible -- safe
	var isExtensible = Object.isExtensible;
	var InternalWeakMap;

	var wrapper = function (init) {
	  return function WeakMap() {
	    return init(this, arguments.length ? arguments[0] : undefined);
	  };
	};

	// `WeakMap` constructor
	// https://tc39.es/ecma262/#sec-weakmap-constructor
	var $WeakMap = collection$1('WeakMap', wrapper, collectionWeak$1);

	// IE11 WeakMap frozen keys fix
	// We can't use feature detection because it crash some old IE builds
	// https://github.com/zloirock/core-js/issues/485
	if (NATIVE_WEAK_MAP && IS_IE11) {
	  InternalWeakMap = collectionWeak$1.getConstructor(wrapper, 'WeakMap', true);
	  InternalMetadataModule.enable();
	  var WeakMapPrototype = $WeakMap.prototype;
	  var nativeDelete = WeakMapPrototype['delete'];
	  var nativeHas = WeakMapPrototype.has;
	  var nativeGet = WeakMapPrototype.get;
	  var nativeSet = WeakMapPrototype.set;
	  redefineAll$1(WeakMapPrototype, {
	    'delete': function (key) {
	      if (isObject$8(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeDelete.call(this, key) || state.frozen['delete'](key);
	      } return nativeDelete.call(this, key);
	    },
	    has: function has(key) {
	      if (isObject$8(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeHas.call(this, key) || state.frozen.has(key);
	      } return nativeHas.call(this, key);
	    },
	    get: function get(key) {
	      if (isObject$8(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeHas.call(this, key) ? nativeGet.call(this, key) : state.frozen.get(key);
	      } return nativeGet.call(this, key);
	    },
	    set: function set(key, value) {
	      if (isObject$8(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        nativeHas.call(this, key) ? nativeSet.call(this, key, value) : state.frozen.set(key, value);
	      } else nativeSet.call(this, key, value);
	      return this;
	    }
	  });
	}

	var collection = collection$4;
	var collectionWeak = collectionWeak$2;

	// `WeakSet` constructor
	// https://tc39.es/ecma262/#sec-weakset-constructor
	collection('WeakSet', function (init) {
	  return function WeakSet() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionWeak);

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
	var documentCreateElement = documentCreateElement$2;

	var classList = documentCreateElement('span').classList;
	var DOMTokenListPrototype$2 = classList && classList.constructor && classList.constructor.prototype;

	var domTokenListPrototype = DOMTokenListPrototype$2 === Object.prototype ? undefined : DOMTokenListPrototype$2;

	var global$6 = global$O;
	var DOMIterables$1 = domIterables;
	var DOMTokenListPrototype$1 = domTokenListPrototype;
	var forEach = arrayForEach;
	var createNonEnumerableProperty$1 = createNonEnumerableProperty$d;

	var handlePrototype$1 = function (CollectionPrototype) {
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
	    createNonEnumerableProperty$1(CollectionPrototype, 'forEach', forEach);
	  } catch (error) {
	    CollectionPrototype.forEach = forEach;
	  }
	};

	for (var COLLECTION_NAME$1 in DOMIterables$1) {
	  if (DOMIterables$1[COLLECTION_NAME$1]) {
	    handlePrototype$1(global$6[COLLECTION_NAME$1] && global$6[COLLECTION_NAME$1].prototype);
	  }
	}

	handlePrototype$1(DOMTokenListPrototype$1);

	var global$5 = global$O;
	var DOMIterables = domIterables;
	var DOMTokenListPrototype = domTokenListPrototype;
	var ArrayIteratorMethods = es_array_iterator;
	var createNonEnumerableProperty = createNonEnumerableProperty$d;
	var wellKnownSymbol$2 = wellKnownSymbol$x;

	var ITERATOR$2 = wellKnownSymbol$2('iterator');
	var TO_STRING_TAG = wellKnownSymbol$2('toStringTag');
	var ArrayValues = ArrayIteratorMethods.values;

	var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
	  if (CollectionPrototype) {
	    // some Chrome versions have non-configurable methods on DOMTokenList
	    if (CollectionPrototype[ITERATOR$2] !== ArrayValues) try {
	      createNonEnumerableProperty(CollectionPrototype, ITERATOR$2, ArrayValues);
	    } catch (error) {
	      CollectionPrototype[ITERATOR$2] = ArrayValues;
	    }
	    if (!CollectionPrototype[TO_STRING_TAG]) {
	      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
	    }
	    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
	      // some Chrome versions have non-configurable methods on DOMTokenList
	      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
	        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
	      } catch (error) {
	        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
	      }
	    }
	  }
	};

	for (var COLLECTION_NAME in DOMIterables) {
	  handlePrototype(global$5[COLLECTION_NAME] && global$5[COLLECTION_NAME].prototype, COLLECTION_NAME);
	}

	handlePrototype(DOMTokenListPrototype, 'DOMTokenList');

	var $$5 = _export;
	var global$4 = global$O;
	var task = task$2;

	var FORCED = !global$4.setImmediate || !global$4.clearImmediate;

	// http://w3c.github.io/setImmediate/
	$$5({ global: true, bind: true, enumerable: true, forced: FORCED }, {
	  // `setImmediate` method
	  // http://w3c.github.io/setImmediate/#si-setImmediate
	  setImmediate: task.set,
	  // `clearImmediate` method
	  // http://w3c.github.io/setImmediate/#si-clearImmediate
	  clearImmediate: task.clear
	});

	var $$4 = _export;
	var global$3 = global$O;
	var microtask = microtask$2;
	var IS_NODE = engineIsNode;

	var process = global$3.process;

	// `queueMicrotask` method
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-queuemicrotask
	$$4({ global: true, enumerable: true, noTargetGet: true }, {
	  queueMicrotask: function queueMicrotask(fn) {
	    var domain = IS_NODE && process.domain;
	    microtask(domain ? domain.bind(fn) : fn);
	  }
	});

	var $$3 = _export;
	var global$2 = global$O;
	var isCallable$1 = isCallable$u;
	var userAgent = engineUserAgent;

	var slice = [].slice;
	var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check

	var wrap = function (scheduler) {
	  return function (handler, timeout /* , ...arguments */) {
	    var boundArgs = arguments.length > 2;
	    var args = boundArgs ? slice.call(arguments, 2) : undefined;
	    return scheduler(boundArgs ? function () {
	      // eslint-disable-next-line no-new-func -- spec requirement
	      (isCallable$1(handler) ? handler : Function(handler)).apply(this, args);
	    } : handler, timeout);
	  };
	};

	// ie9- setTimeout & setInterval additional parameters fix
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
	$$3({ global: true, bind: true, forced: MSIE }, {
	  // `setTimeout` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
	  setTimeout: wrap(global$2.setTimeout),
	  // `setInterval` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
	  setInterval: wrap(global$2.setInterval)
	});

	var fails = fails$13;
	var wellKnownSymbol$1 = wellKnownSymbol$x;
	var IS_PURE = isPure;

	var ITERATOR$1 = wellKnownSymbol$1('iterator');

	var nativeUrl = !fails(function () {
	  var url = new URL('b?a=1&b=2&c=3', 'http://a');
	  var searchParams = url.searchParams;
	  var result = '';
	  url.pathname = 'c%20d';
	  searchParams.forEach(function (value, key) {
	    searchParams['delete']('b');
	    result += key + value;
	  });
	  return (IS_PURE && !url.toJSON)
	    || !searchParams.sort
	    || url.href !== 'http://a/c%20d?a=1&c=3'
	    || searchParams.get('c') !== '3'
	    || String(new URLSearchParams('?a=1')) !== 'a=1'
	    || !searchParams[ITERATOR$1]
	    // throws in Edge
	    || new URL('https://a@b').username !== 'a'
	    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
	    // not punycoded in Edge
	    || new URL('http://тест').host !== 'xn--e1aybc'
	    // not escaped in Chrome 62-
	    || new URL('http://a#б').hash !== '#%D0%B1'
	    // fails in Chrome 66-
	    || result !== 'a1c3'
	    // throws in Safari
	    || new URL('http://x', undefined).host !== 'x';
	});

	// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
	var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
	var base = 36;
	var tMin = 1;
	var tMax = 26;
	var skew = 38;
	var damp = 700;
	var initialBias = 72;
	var initialN = 128; // 0x80
	var delimiter = '-'; // '\x2D'
	var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
	var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
	var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
	var baseMinusTMin = base - tMin;
	var floor$1 = Math.floor;
	var stringFromCharCode = String.fromCharCode;

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 */
	var ucs2decode = function (string) {
	  var output = [];
	  var counter = 0;
	  var length = string.length;
	  while (counter < length) {
	    var value = string.charCodeAt(counter++);
	    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
	      // It's a high surrogate, and there is a next character.
	      var extra = string.charCodeAt(counter++);
	      if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
	        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
	      } else {
	        // It's an unmatched surrogate; only append this code unit, in case the
	        // next code unit is the high surrogate of a surrogate pair.
	        output.push(value);
	        counter--;
	      }
	    } else {
	      output.push(value);
	    }
	  }
	  return output;
	};

	/**
	 * Converts a digit/integer into a basic code point.
	 */
	var digitToBasic = function (digit) {
	  //  0..25 map to ASCII a..z or A..Z
	  // 26..35 map to ASCII 0..9
	  return digit + 22 + 75 * (digit < 26);
	};

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 */
	var adapt = function (delta, numPoints, firstTime) {
	  var k = 0;
	  delta = firstTime ? floor$1(delta / damp) : delta >> 1;
	  delta += floor$1(delta / numPoints);
	  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
	    delta = floor$1(delta / baseMinusTMin);
	  }
	  return floor$1(k + (baseMinusTMin + 1) * delta / (delta + skew));
	};

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 */
	// eslint-disable-next-line max-statements -- TODO
	var encode = function (input) {
	  var output = [];

	  // Convert the input in UCS-2 to an array of Unicode code points.
	  input = ucs2decode(input);

	  // Cache the length.
	  var inputLength = input.length;

	  // Initialize the state.
	  var n = initialN;
	  var delta = 0;
	  var bias = initialBias;
	  var i, currentValue;

	  // Handle the basic code points.
	  for (i = 0; i < input.length; i++) {
	    currentValue = input[i];
	    if (currentValue < 0x80) {
	      output.push(stringFromCharCode(currentValue));
	    }
	  }

	  var basicLength = output.length; // number of basic code points.
	  var handledCPCount = basicLength; // number of code points that have been handled;

	  // Finish the basic string with a delimiter unless it's empty.
	  if (basicLength) {
	    output.push(delimiter);
	  }

	  // Main encoding loop:
	  while (handledCPCount < inputLength) {
	    // All non-basic code points < n have been handled already. Find the next larger one:
	    var m = maxInt;
	    for (i = 0; i < input.length; i++) {
	      currentValue = input[i];
	      if (currentValue >= n && currentValue < m) {
	        m = currentValue;
	      }
	    }

	    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
	    var handledCPCountPlusOne = handledCPCount + 1;
	    if (m - n > floor$1((maxInt - delta) / handledCPCountPlusOne)) {
	      throw RangeError(OVERFLOW_ERROR);
	    }

	    delta += (m - n) * handledCPCountPlusOne;
	    n = m;

	    for (i = 0; i < input.length; i++) {
	      currentValue = input[i];
	      if (currentValue < n && ++delta > maxInt) {
	        throw RangeError(OVERFLOW_ERROR);
	      }
	      if (currentValue == n) {
	        // Represent delta as a generalized variable-length integer.
	        var q = delta;
	        for (var k = base; /* no condition */; k += base) {
	          var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
	          if (q < t) break;
	          var qMinusT = q - t;
	          var baseMinusT = base - t;
	          output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
	          q = floor$1(qMinusT / baseMinusT);
	        }

	        output.push(stringFromCharCode(digitToBasic(q)));
	        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
	        delta = 0;
	        ++handledCPCount;
	      }
	    }

	    ++delta;
	    ++n;
	  }
	  return output.join('');
	};

	var stringPunycodeToAscii = function (input) {
	  var encoded = [];
	  var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
	  var i, label;
	  for (i = 0; i < labels.length; i++) {
	    label = labels[i];
	    encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
	  }
	  return encoded.join('.');
	};

	// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`

	var $$2 = _export;
	var getBuiltIn = getBuiltIn$f;
	var USE_NATIVE_URL$1 = nativeUrl;
	var redefine$1 = redefine$j.exports;
	var redefineAll = redefineAll$6;
	var setToStringTag$1 = setToStringTag$b;
	var createIteratorConstructor = createIteratorConstructor$3;
	var InternalStateModule$1 = internalState;
	var anInstance$1 = anInstance$8;
	var isCallable = isCallable$u;
	var hasOwn$1 = hasOwnProperty_1;
	var bind = functionBindContext;
	var classof = classof$b;
	var anObject = anObject$z;
	var isObject$7 = isObject$G;
	var $toString$1 = toString$u;
	var create = objectCreate$1;
	var createPropertyDescriptor = createPropertyDescriptor$9;
	var getIterator = getIterator$4;
	var getIteratorMethod = getIteratorMethod$5;
	var wellKnownSymbol = wellKnownSymbol$x;

	var nativeFetch = getBuiltIn('fetch');
	var NativeRequest = getBuiltIn('Request');
	var RequestPrototype = NativeRequest && NativeRequest.prototype;
	var Headers = getBuiltIn('Headers');
	var ITERATOR = wellKnownSymbol('iterator');
	var URL_SEARCH_PARAMS = 'URLSearchParams';
	var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
	var setInternalState$1 = InternalStateModule$1.set;
	var getInternalParamsState = InternalStateModule$1.getterFor(URL_SEARCH_PARAMS);
	var getInternalIteratorState = InternalStateModule$1.getterFor(URL_SEARCH_PARAMS_ITERATOR);

	var plus = /\+/g;
	var sequences = Array(4);

	var percentSequence = function (bytes) {
	  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
	};

	var percentDecode = function (sequence) {
	  try {
	    return decodeURIComponent(sequence);
	  } catch (error) {
	    return sequence;
	  }
	};

	var deserialize = function (it) {
	  var result = it.replace(plus, ' ');
	  var bytes = 4;
	  try {
	    return decodeURIComponent(result);
	  } catch (error) {
	    while (bytes) {
	      result = result.replace(percentSequence(bytes--), percentDecode);
	    }
	    return result;
	  }
	};

	var find = /[!'()~]|%20/g;

	var replace = {
	  '!': '%21',
	  "'": '%27',
	  '(': '%28',
	  ')': '%29',
	  '~': '%7E',
	  '%20': '+'
	};

	var replacer = function (match) {
	  return replace[match];
	};

	var serialize = function (it) {
	  return encodeURIComponent(it).replace(find, replacer);
	};

	var parseSearchParams = function (result, query) {
	  if (query) {
	    var attributes = query.split('&');
	    var index = 0;
	    var attribute, entry;
	    while (index < attributes.length) {
	      attribute = attributes[index++];
	      if (attribute.length) {
	        entry = attribute.split('=');
	        result.push({
	          key: deserialize(entry.shift()),
	          value: deserialize(entry.join('='))
	        });
	      }
	    }
	  }
	};

	var updateSearchParams = function (query) {
	  this.entries.length = 0;
	  parseSearchParams(this.entries, query);
	};

	var validateArgumentsLength = function (passed, required) {
	  if (passed < required) throw TypeError('Not enough arguments');
	};

	var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
	  setInternalState$1(this, {
	    type: URL_SEARCH_PARAMS_ITERATOR,
	    iterator: getIterator(getInternalParamsState(params).entries),
	    kind: kind
	  });
	}, 'Iterator', function next() {
	  var state = getInternalIteratorState(this);
	  var kind = state.kind;
	  var step = state.iterator.next();
	  var entry = step.value;
	  if (!step.done) {
	    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
	  } return step;
	});

	// `URLSearchParams` constructor
	// https://url.spec.whatwg.org/#interface-urlsearchparams
	var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
	  anInstance$1(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
	  var init = arguments.length > 0 ? arguments[0] : undefined;
	  var that = this;
	  var entries = [];
	  var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

	  setInternalState$1(that, {
	    type: URL_SEARCH_PARAMS,
	    entries: entries,
	    updateURL: function () { /* empty */ },
	    updateSearchParams: updateSearchParams
	  });

	  if (init !== undefined) {
	    if (isObject$7(init)) {
	      iteratorMethod = getIteratorMethod(init);
	      if (iteratorMethod) {
	        iterator = getIterator(init, iteratorMethod);
	        next = iterator.next;
	        while (!(step = next.call(iterator)).done) {
	          entryIterator = getIterator(anObject(step.value));
	          entryNext = entryIterator.next;
	          if (
	            (first = entryNext.call(entryIterator)).done ||
	            (second = entryNext.call(entryIterator)).done ||
	            !entryNext.call(entryIterator).done
	          ) throw TypeError('Expected sequence with length 2');
	          entries.push({ key: $toString$1(first.value), value: $toString$1(second.value) });
	        }
	      } else for (key in init) if (hasOwn$1(init, key)) entries.push({ key: key, value: $toString$1(init[key]) });
	    } else {
	      parseSearchParams(
	        entries,
	        typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : $toString$1(init)
	      );
	    }
	  }
	};

	var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

	redefineAll(URLSearchParamsPrototype, {
	  // `URLSearchParams.prototype.append` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
	  append: function append(name, value) {
	    validateArgumentsLength(arguments.length, 2);
	    var state = getInternalParamsState(this);
	    state.entries.push({ key: $toString$1(name), value: $toString$1(value) });
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.delete` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
	  'delete': function (name) {
	    validateArgumentsLength(arguments.length, 1);
	    var state = getInternalParamsState(this);
	    var entries = state.entries;
	    var key = $toString$1(name);
	    var index = 0;
	    while (index < entries.length) {
	      if (entries[index].key === key) entries.splice(index, 1);
	      else index++;
	    }
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.get` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
	  get: function get(name) {
	    validateArgumentsLength(arguments.length, 1);
	    var entries = getInternalParamsState(this).entries;
	    var key = $toString$1(name);
	    var index = 0;
	    for (; index < entries.length; index++) {
	      if (entries[index].key === key) return entries[index].value;
	    }
	    return null;
	  },
	  // `URLSearchParams.prototype.getAll` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
	  getAll: function getAll(name) {
	    validateArgumentsLength(arguments.length, 1);
	    var entries = getInternalParamsState(this).entries;
	    var key = $toString$1(name);
	    var result = [];
	    var index = 0;
	    for (; index < entries.length; index++) {
	      if (entries[index].key === key) result.push(entries[index].value);
	    }
	    return result;
	  },
	  // `URLSearchParams.prototype.has` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
	  has: function has(name) {
	    validateArgumentsLength(arguments.length, 1);
	    var entries = getInternalParamsState(this).entries;
	    var key = $toString$1(name);
	    var index = 0;
	    while (index < entries.length) {
	      if (entries[index++].key === key) return true;
	    }
	    return false;
	  },
	  // `URLSearchParams.prototype.set` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
	  set: function set(name, value) {
	    validateArgumentsLength(arguments.length, 1);
	    var state = getInternalParamsState(this);
	    var entries = state.entries;
	    var found = false;
	    var key = $toString$1(name);
	    var val = $toString$1(value);
	    var index = 0;
	    var entry;
	    for (; index < entries.length; index++) {
	      entry = entries[index];
	      if (entry.key === key) {
	        if (found) entries.splice(index--, 1);
	        else {
	          found = true;
	          entry.value = val;
	        }
	      }
	    }
	    if (!found) entries.push({ key: key, value: val });
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.sort` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
	  sort: function sort() {
	    var state = getInternalParamsState(this);
	    var entries = state.entries;
	    // Array#sort is not stable in some engines
	    var slice = entries.slice();
	    var entry, entriesIndex, sliceIndex;
	    entries.length = 0;
	    for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
	      entry = slice[sliceIndex];
	      for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
	        if (entries[entriesIndex].key > entry.key) {
	          entries.splice(entriesIndex, 0, entry);
	          break;
	        }
	      }
	      if (entriesIndex === sliceIndex) entries.push(entry);
	    }
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.forEach` method
	  forEach: function forEach(callback /* , thisArg */) {
	    var entries = getInternalParamsState(this).entries;
	    var boundFunction = bind(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
	    var index = 0;
	    var entry;
	    while (index < entries.length) {
	      entry = entries[index++];
	      boundFunction(entry.value, entry.key, this);
	    }
	  },
	  // `URLSearchParams.prototype.keys` method
	  keys: function keys() {
	    return new URLSearchParamsIterator(this, 'keys');
	  },
	  // `URLSearchParams.prototype.values` method
	  values: function values() {
	    return new URLSearchParamsIterator(this, 'values');
	  },
	  // `URLSearchParams.prototype.entries` method
	  entries: function entries() {
	    return new URLSearchParamsIterator(this, 'entries');
	  }
	}, { enumerable: true });

	// `URLSearchParams.prototype[@@iterator]` method
	redefine$1(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries, { name: 'entries' });

	// `URLSearchParams.prototype.toString` method
	// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
	redefine$1(URLSearchParamsPrototype, 'toString', function toString() {
	  var entries = getInternalParamsState(this).entries;
	  var result = [];
	  var index = 0;
	  var entry;
	  while (index < entries.length) {
	    entry = entries[index++];
	    result.push(serialize(entry.key) + '=' + serialize(entry.value));
	  } return result.join('&');
	}, { enumerable: true });

	setToStringTag$1(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

	$$2({ global: true, forced: !USE_NATIVE_URL$1 }, {
	  URLSearchParams: URLSearchParamsConstructor
	});

	// Wrap `fetch` and `Request` for correct work with polyfilled `URLSearchParams`
	if (!USE_NATIVE_URL$1 && isCallable(Headers)) {
	  var wrapRequestOptions = function (init) {
	    if (isObject$7(init)) {
	      var body = init.body;
	      var headers;
	      if (classof(body) === URL_SEARCH_PARAMS) {
	        headers = init.headers ? new Headers(init.headers) : new Headers();
	        if (!headers.has('content-type')) {
	          headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	        }
	        return create(init, {
	          body: createPropertyDescriptor(0, String(body)),
	          headers: createPropertyDescriptor(0, headers)
	        });
	      }
	    } return init;
	  };

	  if (isCallable(nativeFetch)) {
	    $$2({ global: true, enumerable: true, forced: true }, {
	      fetch: function fetch(input /* , init */) {
	        return nativeFetch(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
	      }
	    });
	  }

	  if (isCallable(NativeRequest)) {
	    var RequestConstructor = function Request(input /* , init */) {
	      anInstance$1(this, RequestConstructor, 'Request');
	      return new NativeRequest(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
	    };

	    RequestPrototype.constructor = RequestConstructor;
	    RequestConstructor.prototype = RequestPrototype;

	    $$2({ global: true, forced: true }, {
	      Request: RequestConstructor
	    });
	  }
	}

	var web_urlSearchParams = {
	  URLSearchParams: URLSearchParamsConstructor,
	  getState: getInternalParamsState
	};

	// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`

	var $$1 = _export;
	var DESCRIPTORS = descriptors;
	var USE_NATIVE_URL = nativeUrl;
	var global$1 = global$O;
	var defineProperties = objectDefineProperties;
	var redefine = redefine$j.exports;
	var anInstance = anInstance$8;
	var hasOwn = hasOwnProperty_1;
	var assign = objectAssign;
	var arrayFrom = arrayFrom$1;
	var codeAt = stringMultibyte.codeAt;
	var toASCII = stringPunycodeToAscii;
	var $toString = toString$u;
	var setToStringTag = setToStringTag$b;
	var URLSearchParamsModule = web_urlSearchParams;
	var InternalStateModule = internalState;

	var NativeURL = global$1.URL;
	var URLSearchParams$1 = URLSearchParamsModule.URLSearchParams;
	var getInternalSearchParamsState = URLSearchParamsModule.getState;
	var setInternalState = InternalStateModule.set;
	var getInternalURLState = InternalStateModule.getterFor('URL');
	var floor = Math.floor;
	var pow = Math.pow;

	var INVALID_AUTHORITY = 'Invalid authority';
	var INVALID_SCHEME = 'Invalid scheme';
	var INVALID_HOST = 'Invalid host';
	var INVALID_PORT = 'Invalid port';

	var ALPHA = /[a-z]/i;
	// eslint-disable-next-line regexp/no-obscure-range -- safe
	var ALPHANUMERIC = /[\d+-.a-z]/i;
	var DIGIT = /\d/;
	var HEX_START = /^0x/i;
	var OCT = /^[0-7]+$/;
	var DEC = /^\d+$/;
	var HEX = /^[\da-f]+$/i;
	/* eslint-disable regexp/no-control-character -- safe */
	var FORBIDDEN_HOST_CODE_POINT = /[\0\t\n\r #%/:<>?@[\\\]^|]/;
	var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\0\t\n\r #/:<>?@[\\\]^|]/;
	var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u0020]+|[\u0000-\u0020]+$/g;
	var TAB_AND_NEW_LINE = /[\t\n\r]/g;
	/* eslint-enable regexp/no-control-character -- safe */
	var EOF;

	var parseHost = function (url, input) {
	  var result, codePoints, index;
	  if (input.charAt(0) == '[') {
	    if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
	    result = parseIPv6(input.slice(1, -1));
	    if (!result) return INVALID_HOST;
	    url.host = result;
	  // opaque host
	  } else if (!isSpecial(url)) {
	    if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
	    result = '';
	    codePoints = arrayFrom(input);
	    for (index = 0; index < codePoints.length; index++) {
	      result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
	    }
	    url.host = result;
	  } else {
	    input = toASCII(input);
	    if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
	    result = parseIPv4(input);
	    if (result === null) return INVALID_HOST;
	    url.host = result;
	  }
	};

	var parseIPv4 = function (input) {
	  var parts = input.split('.');
	  var partsLength, numbers, index, part, radix, number, ipv4;
	  if (parts.length && parts[parts.length - 1] == '') {
	    parts.pop();
	  }
	  partsLength = parts.length;
	  if (partsLength > 4) return input;
	  numbers = [];
	  for (index = 0; index < partsLength; index++) {
	    part = parts[index];
	    if (part == '') return input;
	    radix = 10;
	    if (part.length > 1 && part.charAt(0) == '0') {
	      radix = HEX_START.test(part) ? 16 : 8;
	      part = part.slice(radix == 8 ? 1 : 2);
	    }
	    if (part === '') {
	      number = 0;
	    } else {
	      if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
	      number = parseInt(part, radix);
	    }
	    numbers.push(number);
	  }
	  for (index = 0; index < partsLength; index++) {
	    number = numbers[index];
	    if (index == partsLength - 1) {
	      if (number >= pow(256, 5 - partsLength)) return null;
	    } else if (number > 255) return null;
	  }
	  ipv4 = numbers.pop();
	  for (index = 0; index < numbers.length; index++) {
	    ipv4 += numbers[index] * pow(256, 3 - index);
	  }
	  return ipv4;
	};

	// eslint-disable-next-line max-statements -- TODO
	var parseIPv6 = function (input) {
	  var address = [0, 0, 0, 0, 0, 0, 0, 0];
	  var pieceIndex = 0;
	  var compress = null;
	  var pointer = 0;
	  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

	  var chr = function () {
	    return input.charAt(pointer);
	  };

	  if (chr() == ':') {
	    if (input.charAt(1) != ':') return;
	    pointer += 2;
	    pieceIndex++;
	    compress = pieceIndex;
	  }
	  while (chr()) {
	    if (pieceIndex == 8) return;
	    if (chr() == ':') {
	      if (compress !== null) return;
	      pointer++;
	      pieceIndex++;
	      compress = pieceIndex;
	      continue;
	    }
	    value = length = 0;
	    while (length < 4 && HEX.test(chr())) {
	      value = value * 16 + parseInt(chr(), 16);
	      pointer++;
	      length++;
	    }
	    if (chr() == '.') {
	      if (length == 0) return;
	      pointer -= length;
	      if (pieceIndex > 6) return;
	      numbersSeen = 0;
	      while (chr()) {
	        ipv4Piece = null;
	        if (numbersSeen > 0) {
	          if (chr() == '.' && numbersSeen < 4) pointer++;
	          else return;
	        }
	        if (!DIGIT.test(chr())) return;
	        while (DIGIT.test(chr())) {
	          number = parseInt(chr(), 10);
	          if (ipv4Piece === null) ipv4Piece = number;
	          else if (ipv4Piece == 0) return;
	          else ipv4Piece = ipv4Piece * 10 + number;
	          if (ipv4Piece > 255) return;
	          pointer++;
	        }
	        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
	        numbersSeen++;
	        if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
	      }
	      if (numbersSeen != 4) return;
	      break;
	    } else if (chr() == ':') {
	      pointer++;
	      if (!chr()) return;
	    } else if (chr()) return;
	    address[pieceIndex++] = value;
	  }
	  if (compress !== null) {
	    swaps = pieceIndex - compress;
	    pieceIndex = 7;
	    while (pieceIndex != 0 && swaps > 0) {
	      swap = address[pieceIndex];
	      address[pieceIndex--] = address[compress + swaps - 1];
	      address[compress + --swaps] = swap;
	    }
	  } else if (pieceIndex != 8) return;
	  return address;
	};

	var findLongestZeroSequence = function (ipv6) {
	  var maxIndex = null;
	  var maxLength = 1;
	  var currStart = null;
	  var currLength = 0;
	  var index = 0;
	  for (; index < 8; index++) {
	    if (ipv6[index] !== 0) {
	      if (currLength > maxLength) {
	        maxIndex = currStart;
	        maxLength = currLength;
	      }
	      currStart = null;
	      currLength = 0;
	    } else {
	      if (currStart === null) currStart = index;
	      ++currLength;
	    }
	  }
	  if (currLength > maxLength) {
	    maxIndex = currStart;
	    maxLength = currLength;
	  }
	  return maxIndex;
	};

	var serializeHost = function (host) {
	  var result, index, compress, ignore0;
	  // ipv4
	  if (typeof host == 'number') {
	    result = [];
	    for (index = 0; index < 4; index++) {
	      result.unshift(host % 256);
	      host = floor(host / 256);
	    } return result.join('.');
	  // ipv6
	  } else if (typeof host == 'object') {
	    result = '';
	    compress = findLongestZeroSequence(host);
	    for (index = 0; index < 8; index++) {
	      if (ignore0 && host[index] === 0) continue;
	      if (ignore0) ignore0 = false;
	      if (compress === index) {
	        result += index ? ':' : '::';
	        ignore0 = true;
	      } else {
	        result += host[index].toString(16);
	        if (index < 7) result += ':';
	      }
	    }
	    return '[' + result + ']';
	  } return host;
	};

	var C0ControlPercentEncodeSet = {};
	var fragmentPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
	  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
	});
	var pathPercentEncodeSet = assign({}, fragmentPercentEncodeSet, {
	  '#': 1, '?': 1, '{': 1, '}': 1
	});
	var userinfoPercentEncodeSet = assign({}, pathPercentEncodeSet, {
	  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
	});

	var percentEncode = function (chr, set) {
	  var code = codeAt(chr, 0);
	  return code > 0x20 && code < 0x7F && !hasOwn(set, chr) ? chr : encodeURIComponent(chr);
	};

	var specialSchemes = {
	  ftp: 21,
	  file: null,
	  http: 80,
	  https: 443,
	  ws: 80,
	  wss: 443
	};

	var isSpecial = function (url) {
	  return hasOwn(specialSchemes, url.scheme);
	};

	var includesCredentials = function (url) {
	  return url.username != '' || url.password != '';
	};

	var cannotHaveUsernamePasswordPort = function (url) {
	  return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
	};

	var isWindowsDriveLetter = function (string, normalized) {
	  var second;
	  return string.length == 2 && ALPHA.test(string.charAt(0))
	    && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
	};

	var startsWithWindowsDriveLetter = function (string) {
	  var third;
	  return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
	    string.length == 2 ||
	    ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
	  );
	};

	var shortenURLsPath = function (url) {
	  var path = url.path;
	  var pathSize = path.length;
	  if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
	    path.pop();
	  }
	};

	var isSingleDot = function (segment) {
	  return segment === '.' || segment.toLowerCase() === '%2e';
	};

	var isDoubleDot = function (segment) {
	  segment = segment.toLowerCase();
	  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
	};

	// States:
	var SCHEME_START = {};
	var SCHEME = {};
	var NO_SCHEME = {};
	var SPECIAL_RELATIVE_OR_AUTHORITY = {};
	var PATH_OR_AUTHORITY = {};
	var RELATIVE = {};
	var RELATIVE_SLASH = {};
	var SPECIAL_AUTHORITY_SLASHES = {};
	var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
	var AUTHORITY = {};
	var HOST = {};
	var HOSTNAME = {};
	var PORT = {};
	var FILE = {};
	var FILE_SLASH = {};
	var FILE_HOST = {};
	var PATH_START = {};
	var PATH = {};
	var CANNOT_BE_A_BASE_URL_PATH = {};
	var QUERY = {};
	var FRAGMENT = {};

	// eslint-disable-next-line max-statements -- TODO
	var parseURL = function (url, input, stateOverride, base) {
	  var state = stateOverride || SCHEME_START;
	  var pointer = 0;
	  var buffer = '';
	  var seenAt = false;
	  var seenBracket = false;
	  var seenPasswordToken = false;
	  var codePoints, chr, bufferCodePoints, failure;

	  if (!stateOverride) {
	    url.scheme = '';
	    url.username = '';
	    url.password = '';
	    url.host = null;
	    url.port = null;
	    url.path = [];
	    url.query = null;
	    url.fragment = null;
	    url.cannotBeABaseURL = false;
	    input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
	  }

	  input = input.replace(TAB_AND_NEW_LINE, '');

	  codePoints = arrayFrom(input);

	  while (pointer <= codePoints.length) {
	    chr = codePoints[pointer];
	    switch (state) {
	      case SCHEME_START:
	        if (chr && ALPHA.test(chr)) {
	          buffer += chr.toLowerCase();
	          state = SCHEME;
	        } else if (!stateOverride) {
	          state = NO_SCHEME;
	          continue;
	        } else return INVALID_SCHEME;
	        break;

	      case SCHEME:
	        if (chr && (ALPHANUMERIC.test(chr) || chr == '+' || chr == '-' || chr == '.')) {
	          buffer += chr.toLowerCase();
	        } else if (chr == ':') {
	          if (stateOverride && (
	            (isSpecial(url) != hasOwn(specialSchemes, buffer)) ||
	            (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
	            (url.scheme == 'file' && !url.host)
	          )) return;
	          url.scheme = buffer;
	          if (stateOverride) {
	            if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
	            return;
	          }
	          buffer = '';
	          if (url.scheme == 'file') {
	            state = FILE;
	          } else if (isSpecial(url) && base && base.scheme == url.scheme) {
	            state = SPECIAL_RELATIVE_OR_AUTHORITY;
	          } else if (isSpecial(url)) {
	            state = SPECIAL_AUTHORITY_SLASHES;
	          } else if (codePoints[pointer + 1] == '/') {
	            state = PATH_OR_AUTHORITY;
	            pointer++;
	          } else {
	            url.cannotBeABaseURL = true;
	            url.path.push('');
	            state = CANNOT_BE_A_BASE_URL_PATH;
	          }
	        } else if (!stateOverride) {
	          buffer = '';
	          state = NO_SCHEME;
	          pointer = 0;
	          continue;
	        } else return INVALID_SCHEME;
	        break;

	      case NO_SCHEME:
	        if (!base || (base.cannotBeABaseURL && chr != '#')) return INVALID_SCHEME;
	        if (base.cannotBeABaseURL && chr == '#') {
	          url.scheme = base.scheme;
	          url.path = base.path.slice();
	          url.query = base.query;
	          url.fragment = '';
	          url.cannotBeABaseURL = true;
	          state = FRAGMENT;
	          break;
	        }
	        state = base.scheme == 'file' ? FILE : RELATIVE;
	        continue;

	      case SPECIAL_RELATIVE_OR_AUTHORITY:
	        if (chr == '/' && codePoints[pointer + 1] == '/') {
	          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
	          pointer++;
	        } else {
	          state = RELATIVE;
	          continue;
	        } break;

	      case PATH_OR_AUTHORITY:
	        if (chr == '/') {
	          state = AUTHORITY;
	          break;
	        } else {
	          state = PATH;
	          continue;
	        }

	      case RELATIVE:
	        url.scheme = base.scheme;
	        if (chr == EOF) {
	          url.username = base.username;
	          url.password = base.password;
	          url.host = base.host;
	          url.port = base.port;
	          url.path = base.path.slice();
	          url.query = base.query;
	        } else if (chr == '/' || (chr == '\\' && isSpecial(url))) {
	          state = RELATIVE_SLASH;
	        } else if (chr == '?') {
	          url.username = base.username;
	          url.password = base.password;
	          url.host = base.host;
	          url.port = base.port;
	          url.path = base.path.slice();
	          url.query = '';
	          state = QUERY;
	        } else if (chr == '#') {
	          url.username = base.username;
	          url.password = base.password;
	          url.host = base.host;
	          url.port = base.port;
	          url.path = base.path.slice();
	          url.query = base.query;
	          url.fragment = '';
	          state = FRAGMENT;
	        } else {
	          url.username = base.username;
	          url.password = base.password;
	          url.host = base.host;
	          url.port = base.port;
	          url.path = base.path.slice();
	          url.path.pop();
	          state = PATH;
	          continue;
	        } break;

	      case RELATIVE_SLASH:
	        if (isSpecial(url) && (chr == '/' || chr == '\\')) {
	          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
	        } else if (chr == '/') {
	          state = AUTHORITY;
	        } else {
	          url.username = base.username;
	          url.password = base.password;
	          url.host = base.host;
	          url.port = base.port;
	          state = PATH;
	          continue;
	        } break;

	      case SPECIAL_AUTHORITY_SLASHES:
	        state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
	        if (chr != '/' || buffer.charAt(pointer + 1) != '/') continue;
	        pointer++;
	        break;

	      case SPECIAL_AUTHORITY_IGNORE_SLASHES:
	        if (chr != '/' && chr != '\\') {
	          state = AUTHORITY;
	          continue;
	        } break;

	      case AUTHORITY:
	        if (chr == '@') {
	          if (seenAt) buffer = '%40' + buffer;
	          seenAt = true;
	          bufferCodePoints = arrayFrom(buffer);
	          for (var i = 0; i < bufferCodePoints.length; i++) {
	            var codePoint = bufferCodePoints[i];
	            if (codePoint == ':' && !seenPasswordToken) {
	              seenPasswordToken = true;
	              continue;
	            }
	            var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
	            if (seenPasswordToken) url.password += encodedCodePoints;
	            else url.username += encodedCodePoints;
	          }
	          buffer = '';
	        } else if (
	          chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
	          (chr == '\\' && isSpecial(url))
	        ) {
	          if (seenAt && buffer == '') return INVALID_AUTHORITY;
	          pointer -= arrayFrom(buffer).length + 1;
	          buffer = '';
	          state = HOST;
	        } else buffer += chr;
	        break;

	      case HOST:
	      case HOSTNAME:
	        if (stateOverride && url.scheme == 'file') {
	          state = FILE_HOST;
	          continue;
	        } else if (chr == ':' && !seenBracket) {
	          if (buffer == '') return INVALID_HOST;
	          failure = parseHost(url, buffer);
	          if (failure) return failure;
	          buffer = '';
	          state = PORT;
	          if (stateOverride == HOSTNAME) return;
	        } else if (
	          chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
	          (chr == '\\' && isSpecial(url))
	        ) {
	          if (isSpecial(url) && buffer == '') return INVALID_HOST;
	          if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
	          failure = parseHost(url, buffer);
	          if (failure) return failure;
	          buffer = '';
	          state = PATH_START;
	          if (stateOverride) return;
	          continue;
	        } else {
	          if (chr == '[') seenBracket = true;
	          else if (chr == ']') seenBracket = false;
	          buffer += chr;
	        } break;

	      case PORT:
	        if (DIGIT.test(chr)) {
	          buffer += chr;
	        } else if (
	          chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
	          (chr == '\\' && isSpecial(url)) ||
	          stateOverride
	        ) {
	          if (buffer != '') {
	            var port = parseInt(buffer, 10);
	            if (port > 0xFFFF) return INVALID_PORT;
	            url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
	            buffer = '';
	          }
	          if (stateOverride) return;
	          state = PATH_START;
	          continue;
	        } else return INVALID_PORT;
	        break;

	      case FILE:
	        url.scheme = 'file';
	        if (chr == '/' || chr == '\\') state = FILE_SLASH;
	        else if (base && base.scheme == 'file') {
	          if (chr == EOF) {
	            url.host = base.host;
	            url.path = base.path.slice();
	            url.query = base.query;
	          } else if (chr == '?') {
	            url.host = base.host;
	            url.path = base.path.slice();
	            url.query = '';
	            state = QUERY;
	          } else if (chr == '#') {
	            url.host = base.host;
	            url.path = base.path.slice();
	            url.query = base.query;
	            url.fragment = '';
	            state = FRAGMENT;
	          } else {
	            if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
	              url.host = base.host;
	              url.path = base.path.slice();
	              shortenURLsPath(url);
	            }
	            state = PATH;
	            continue;
	          }
	        } else {
	          state = PATH;
	          continue;
	        } break;

	      case FILE_SLASH:
	        if (chr == '/' || chr == '\\') {
	          state = FILE_HOST;
	          break;
	        }
	        if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
	          if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);
	          else url.host = base.host;
	        }
	        state = PATH;
	        continue;

	      case FILE_HOST:
	        if (chr == EOF || chr == '/' || chr == '\\' || chr == '?' || chr == '#') {
	          if (!stateOverride && isWindowsDriveLetter(buffer)) {
	            state = PATH;
	          } else if (buffer == '') {
	            url.host = '';
	            if (stateOverride) return;
	            state = PATH_START;
	          } else {
	            failure = parseHost(url, buffer);
	            if (failure) return failure;
	            if (url.host == 'localhost') url.host = '';
	            if (stateOverride) return;
	            buffer = '';
	            state = PATH_START;
	          } continue;
	        } else buffer += chr;
	        break;

	      case PATH_START:
	        if (isSpecial(url)) {
	          state = PATH;
	          if (chr != '/' && chr != '\\') continue;
	        } else if (!stateOverride && chr == '?') {
	          url.query = '';
	          state = QUERY;
	        } else if (!stateOverride && chr == '#') {
	          url.fragment = '';
	          state = FRAGMENT;
	        } else if (chr != EOF) {
	          state = PATH;
	          if (chr != '/') continue;
	        } break;

	      case PATH:
	        if (
	          chr == EOF || chr == '/' ||
	          (chr == '\\' && isSpecial(url)) ||
	          (!stateOverride && (chr == '?' || chr == '#'))
	        ) {
	          if (isDoubleDot(buffer)) {
	            shortenURLsPath(url);
	            if (chr != '/' && !(chr == '\\' && isSpecial(url))) {
	              url.path.push('');
	            }
	          } else if (isSingleDot(buffer)) {
	            if (chr != '/' && !(chr == '\\' && isSpecial(url))) {
	              url.path.push('');
	            }
	          } else {
	            if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
	              if (url.host) url.host = '';
	              buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
	            }
	            url.path.push(buffer);
	          }
	          buffer = '';
	          if (url.scheme == 'file' && (chr == EOF || chr == '?' || chr == '#')) {
	            while (url.path.length > 1 && url.path[0] === '') {
	              url.path.shift();
	            }
	          }
	          if (chr == '?') {
	            url.query = '';
	            state = QUERY;
	          } else if (chr == '#') {
	            url.fragment = '';
	            state = FRAGMENT;
	          }
	        } else {
	          buffer += percentEncode(chr, pathPercentEncodeSet);
	        } break;

	      case CANNOT_BE_A_BASE_URL_PATH:
	        if (chr == '?') {
	          url.query = '';
	          state = QUERY;
	        } else if (chr == '#') {
	          url.fragment = '';
	          state = FRAGMENT;
	        } else if (chr != EOF) {
	          url.path[0] += percentEncode(chr, C0ControlPercentEncodeSet);
	        } break;

	      case QUERY:
	        if (!stateOverride && chr == '#') {
	          url.fragment = '';
	          state = FRAGMENT;
	        } else if (chr != EOF) {
	          if (chr == "'" && isSpecial(url)) url.query += '%27';
	          else if (chr == '#') url.query += '%23';
	          else url.query += percentEncode(chr, C0ControlPercentEncodeSet);
	        } break;

	      case FRAGMENT:
	        if (chr != EOF) url.fragment += percentEncode(chr, fragmentPercentEncodeSet);
	        break;
	    }

	    pointer++;
	  }
	};

	// `URL` constructor
	// https://url.spec.whatwg.org/#url-class
	var URLConstructor = function URL(url /* , base */) {
	  var that = anInstance(this, URLConstructor, 'URL');
	  var base = arguments.length > 1 ? arguments[1] : undefined;
	  var urlString = $toString(url);
	  var state = setInternalState(that, { type: 'URL' });
	  var baseState, failure;
	  if (base !== undefined) {
	    if (base instanceof URLConstructor) baseState = getInternalURLState(base);
	    else {
	      failure = parseURL(baseState = {}, $toString(base));
	      if (failure) throw TypeError(failure);
	    }
	  }
	  failure = parseURL(state, urlString, null, baseState);
	  if (failure) throw TypeError(failure);
	  var searchParams = state.searchParams = new URLSearchParams$1();
	  var searchParamsState = getInternalSearchParamsState(searchParams);
	  searchParamsState.updateSearchParams(state.query);
	  searchParamsState.updateURL = function () {
	    state.query = String(searchParams) || null;
	  };
	  if (!DESCRIPTORS) {
	    that.href = serializeURL.call(that);
	    that.origin = getOrigin.call(that);
	    that.protocol = getProtocol.call(that);
	    that.username = getUsername.call(that);
	    that.password = getPassword.call(that);
	    that.host = getHost.call(that);
	    that.hostname = getHostname.call(that);
	    that.port = getPort.call(that);
	    that.pathname = getPathname.call(that);
	    that.search = getSearch.call(that);
	    that.searchParams = getSearchParams.call(that);
	    that.hash = getHash.call(that);
	  }
	};

	var URLPrototype = URLConstructor.prototype;

	var serializeURL = function () {
	  var url = getInternalURLState(this);
	  var scheme = url.scheme;
	  var username = url.username;
	  var password = url.password;
	  var host = url.host;
	  var port = url.port;
	  var path = url.path;
	  var query = url.query;
	  var fragment = url.fragment;
	  var output = scheme + ':';
	  if (host !== null) {
	    output += '//';
	    if (includesCredentials(url)) {
	      output += username + (password ? ':' + password : '') + '@';
	    }
	    output += serializeHost(host);
	    if (port !== null) output += ':' + port;
	  } else if (scheme == 'file') output += '//';
	  output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
	  if (query !== null) output += '?' + query;
	  if (fragment !== null) output += '#' + fragment;
	  return output;
	};

	var getOrigin = function () {
	  var url = getInternalURLState(this);
	  var scheme = url.scheme;
	  var port = url.port;
	  if (scheme == 'blob') try {
	    return new URLConstructor(scheme.path[0]).origin;
	  } catch (error) {
	    return 'null';
	  }
	  if (scheme == 'file' || !isSpecial(url)) return 'null';
	  return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
	};

	var getProtocol = function () {
	  return getInternalURLState(this).scheme + ':';
	};

	var getUsername = function () {
	  return getInternalURLState(this).username;
	};

	var getPassword = function () {
	  return getInternalURLState(this).password;
	};

	var getHost = function () {
	  var url = getInternalURLState(this);
	  var host = url.host;
	  var port = url.port;
	  return host === null ? ''
	    : port === null ? serializeHost(host)
	    : serializeHost(host) + ':' + port;
	};

	var getHostname = function () {
	  var host = getInternalURLState(this).host;
	  return host === null ? '' : serializeHost(host);
	};

	var getPort = function () {
	  var port = getInternalURLState(this).port;
	  return port === null ? '' : String(port);
	};

	var getPathname = function () {
	  var url = getInternalURLState(this);
	  var path = url.path;
	  return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
	};

	var getSearch = function () {
	  var query = getInternalURLState(this).query;
	  return query ? '?' + query : '';
	};

	var getSearchParams = function () {
	  return getInternalURLState(this).searchParams;
	};

	var getHash = function () {
	  var fragment = getInternalURLState(this).fragment;
	  return fragment ? '#' + fragment : '';
	};

	var accessorDescriptor = function (getter, setter) {
	  return { get: getter, set: setter, configurable: true, enumerable: true };
	};

	if (DESCRIPTORS) {
	  defineProperties(URLPrototype, {
	    // `URL.prototype.href` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-href
	    href: accessorDescriptor(serializeURL, function (href) {
	      var url = getInternalURLState(this);
	      var urlString = $toString(href);
	      var failure = parseURL(url, urlString);
	      if (failure) throw TypeError(failure);
	      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
	    }),
	    // `URL.prototype.origin` getter
	    // https://url.spec.whatwg.org/#dom-url-origin
	    origin: accessorDescriptor(getOrigin),
	    // `URL.prototype.protocol` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-protocol
	    protocol: accessorDescriptor(getProtocol, function (protocol) {
	      var url = getInternalURLState(this);
	      parseURL(url, $toString(protocol) + ':', SCHEME_START);
	    }),
	    // `URL.prototype.username` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-username
	    username: accessorDescriptor(getUsername, function (username) {
	      var url = getInternalURLState(this);
	      var codePoints = arrayFrom($toString(username));
	      if (cannotHaveUsernamePasswordPort(url)) return;
	      url.username = '';
	      for (var i = 0; i < codePoints.length; i++) {
	        url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
	      }
	    }),
	    // `URL.prototype.password` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-password
	    password: accessorDescriptor(getPassword, function (password) {
	      var url = getInternalURLState(this);
	      var codePoints = arrayFrom($toString(password));
	      if (cannotHaveUsernamePasswordPort(url)) return;
	      url.password = '';
	      for (var i = 0; i < codePoints.length; i++) {
	        url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
	      }
	    }),
	    // `URL.prototype.host` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-host
	    host: accessorDescriptor(getHost, function (host) {
	      var url = getInternalURLState(this);
	      if (url.cannotBeABaseURL) return;
	      parseURL(url, $toString(host), HOST);
	    }),
	    // `URL.prototype.hostname` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-hostname
	    hostname: accessorDescriptor(getHostname, function (hostname) {
	      var url = getInternalURLState(this);
	      if (url.cannotBeABaseURL) return;
	      parseURL(url, $toString(hostname), HOSTNAME);
	    }),
	    // `URL.prototype.port` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-port
	    port: accessorDescriptor(getPort, function (port) {
	      var url = getInternalURLState(this);
	      if (cannotHaveUsernamePasswordPort(url)) return;
	      port = $toString(port);
	      if (port == '') url.port = null;
	      else parseURL(url, port, PORT);
	    }),
	    // `URL.prototype.pathname` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-pathname
	    pathname: accessorDescriptor(getPathname, function (pathname) {
	      var url = getInternalURLState(this);
	      if (url.cannotBeABaseURL) return;
	      url.path = [];
	      parseURL(url, $toString(pathname), PATH_START);
	    }),
	    // `URL.prototype.search` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-search
	    search: accessorDescriptor(getSearch, function (search) {
	      var url = getInternalURLState(this);
	      search = $toString(search);
	      if (search == '') {
	        url.query = null;
	      } else {
	        if ('?' == search.charAt(0)) search = search.slice(1);
	        url.query = '';
	        parseURL(url, search, QUERY);
	      }
	      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
	    }),
	    // `URL.prototype.searchParams` getter
	    // https://url.spec.whatwg.org/#dom-url-searchparams
	    searchParams: accessorDescriptor(getSearchParams),
	    // `URL.prototype.hash` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-hash
	    hash: accessorDescriptor(getHash, function (hash) {
	      var url = getInternalURLState(this);
	      hash = $toString(hash);
	      if (hash == '') {
	        url.fragment = null;
	        return;
	      }
	      if ('#' == hash.charAt(0)) hash = hash.slice(1);
	      url.fragment = '';
	      parseURL(url, hash, FRAGMENT);
	    })
	  });
	}

	// `URL.prototype.toJSON` method
	// https://url.spec.whatwg.org/#dom-url-tojson
	redefine(URLPrototype, 'toJSON', function toJSON() {
	  return serializeURL.call(this);
	}, { enumerable: true });

	// `URL.prototype.toString` method
	// https://url.spec.whatwg.org/#URL-stringification-behavior
	redefine(URLPrototype, 'toString', function toString() {
	  return serializeURL.call(this);
	}, { enumerable: true });

	if (NativeURL) {
	  var nativeCreateObjectURL = NativeURL.createObjectURL;
	  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
	  // `URL.createObjectURL` method
	  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
	    return nativeCreateObjectURL.apply(NativeURL, arguments);
	  });
	  // `URL.revokeObjectURL` method
	  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
	    return nativeRevokeObjectURL.apply(NativeURL, arguments);
	  });
	}

	setToStringTag(URLConstructor, 'URL');

	$$1({ global: true, forced: !USE_NATIVE_URL, sham: !DESCRIPTORS }, {
	  URL: URLConstructor
	});

	var $ = _export;

	// `URL.prototype.toJSON` method
	// https://url.spec.whatwg.org/#dom-url-tojson
	$({ target: 'URL', proto: true, enumerable: true }, {
	  toJSON: function toJSON() {
	    return URL.prototype.toString.call(this);
	  }
	});

	var runtime = {exports: {}};

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	(function (module) {
	var runtime = (function (exports) {

	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined$1; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

	  function define(obj, key, value) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	    return obj[key];
	  }
	  try {
	    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
	    define({}, "");
	  } catch (err) {
	    define = function(obj, key, value) {
	      return obj[key] = value;
	    };
	  }

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	    var generator = Object.create(protoGenerator.prototype);
	    var context = new Context(tryLocsList || []);

	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);

	    return generator;
	  }
	  exports.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  // This is a polyfill for %IteratorPrototype% for environments that
	  // don't natively support it.
	  var IteratorPrototype = {};
	  define(IteratorPrototype, iteratorSymbol, function () {
	    return this;
	  });

	  var getProto = Object.getPrototypeOf;
	  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	  if (NativeIteratorPrototype &&
	      NativeIteratorPrototype !== Op &&
	      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	    // This environment has a native %IteratorPrototype%; use it instead
	    // of the polyfill.
	    IteratorPrototype = NativeIteratorPrototype;
	  }

	  var Gp = GeneratorFunctionPrototype.prototype =
	    Generator.prototype = Object.create(IteratorPrototype);
	  GeneratorFunction.prototype = GeneratorFunctionPrototype;
	  define(Gp, "constructor", GeneratorFunctionPrototype);
	  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
	  GeneratorFunction.displayName = define(
	    GeneratorFunctionPrototype,
	    toStringTagSymbol,
	    "GeneratorFunction"
	  );

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      define(prototype, method, function(arg) {
	        return this._invoke(method, arg);
	      });
	    });
	  }

	  exports.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };

	  exports.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	      define(genFun, toStringTagSymbol, "GeneratorFunction");
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `hasOwn.call(value, "__await")` to determine if the yielded value is
	  // meant to be awaited.
	  exports.awrap = function(arg) {
	    return { __await: arg };
	  };

	  function AsyncIterator(generator, PromiseImpl) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;
	        if (value &&
	            typeof value === "object" &&
	            hasOwn.call(value, "__await")) {
	          return PromiseImpl.resolve(value.__await).then(function(value) {
	            invoke("next", value, resolve, reject);
	          }, function(err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }

	        return PromiseImpl.resolve(value).then(function(unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration.
	          result.value = unwrapped;
	          resolve(result);
	        }, function(error) {
	          // If a rejected Promise was yielded, throw the rejection back
	          // into the async generator function so it can be handled there.
	          return invoke("throw", error, resolve, reject);
	        });
	      }
	    }

	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new PromiseImpl(function(resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }

	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : callInvokeWithMethodAndArg();
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);
	  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
	    return this;
	  });
	  exports.AsyncIterator = AsyncIterator;

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
	    if (PromiseImpl === void 0) PromiseImpl = Promise;

	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList),
	      PromiseImpl
	    );

	    return exports.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      context.method = method;
	      context.arg = arg;

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          var delegateResult = maybeInvokeDelegate(delegate, context);
	          if (delegateResult) {
	            if (delegateResult === ContinueSentinel) continue;
	            return delegateResult;
	          }
	        }

	        if (context.method === "next") {
	          // Setting context._sent for legacy support of Babel's
	          // function.sent implementation.
	          context.sent = context._sent = context.arg;

	        } else if (context.method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw context.arg;
	          }

	          context.dispatchException(context.arg);

	        } else if (context.method === "return") {
	          context.abrupt("return", context.arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;

	          if (record.arg === ContinueSentinel) {
	            continue;
	          }

	          return {
	            value: record.arg,
	            done: context.done
	          };

	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(context.arg) call above.
	          context.method = "throw";
	          context.arg = record.arg;
	        }
	      }
	    };
	  }

	  // Call delegate.iterator[context.method](context.arg) and handle the
	  // result, either by returning a { value, done } result from the
	  // delegate iterator, or by modifying context.method and context.arg,
	  // setting context.delegate to null, and returning the ContinueSentinel.
	  function maybeInvokeDelegate(delegate, context) {
	    var method = delegate.iterator[context.method];
	    if (method === undefined$1) {
	      // A .throw or .return when the delegate iterator has no .throw
	      // method always terminates the yield* loop.
	      context.delegate = null;

	      if (context.method === "throw") {
	        // Note: ["return"] must be used for ES3 parsing compatibility.
	        if (delegate.iterator["return"]) {
	          // If the delegate iterator has a return method, give it a
	          // chance to clean up.
	          context.method = "return";
	          context.arg = undefined$1;
	          maybeInvokeDelegate(delegate, context);

	          if (context.method === "throw") {
	            // If maybeInvokeDelegate(context) changed context.method from
	            // "return" to "throw", let that override the TypeError below.
	            return ContinueSentinel;
	          }
	        }

	        context.method = "throw";
	        context.arg = new TypeError(
	          "The iterator does not provide a 'throw' method");
	      }

	      return ContinueSentinel;
	    }

	    var record = tryCatch(method, delegate.iterator, context.arg);

	    if (record.type === "throw") {
	      context.method = "throw";
	      context.arg = record.arg;
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    var info = record.arg;

	    if (! info) {
	      context.method = "throw";
	      context.arg = new TypeError("iterator result is not an object");
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    if (info.done) {
	      // Assign the result of the finished delegate to the temporary
	      // variable specified by delegate.resultName (see delegateYield).
	      context[delegate.resultName] = info.value;

	      // Resume execution at the desired location (see delegateYield).
	      context.next = delegate.nextLoc;

	      // If context.method was "throw" but the delegate handled the
	      // exception, let the outer generator proceed normally. If
	      // context.method was "next", forget context.arg since it has been
	      // "consumed" by the delegate iterator. If context.method was
	      // "return", allow the original .return call to continue in the
	      // outer generator.
	      if (context.method !== "return") {
	        context.method = "next";
	        context.arg = undefined$1;
	      }

	    } else {
	      // Re-yield the result returned by the delegate method.
	      return info;
	    }

	    // The delegate iterator is finished, so forget it and continue with
	    // the outer generator.
	    context.delegate = null;
	    return ContinueSentinel;
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  define(Gp, toStringTagSymbol, "Generator");

	  // A Generator should always return itself as the iterator object when the
	  // @@iterator function is called on it. Some browsers' implementations of the
	  // iterator prototype chain incorrectly implement this, causing the Generator
	  // object to not be returned from this call. This ensures that doesn't happen.
	  // See https://github.com/facebook/regenerator/issues/274 for more details.
	  define(Gp, iteratorSymbol, function() {
	    return this;
	  });

	  define(Gp, "toString", function() {
	    return "[object Generator]";
	  });

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  exports.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined$1;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  exports.values = values;

	  function doneResult() {
	    return { value: undefined$1, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined$1;
	      this.done = false;
	      this.delegate = null;

	      this.method = "next";
	      this.arg = undefined$1;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined$1;
	          }
	        }
	      }
	    },

	    stop: function() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;

	        if (caught) {
	          // If the dispatched exception was caught by a catch block,
	          // then let that catch block handle the exception normally.
	          context.method = "next";
	          context.arg = undefined$1;
	        }

	        return !! caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }

	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.method = "next";
	        this.next = finallyEntry.finallyLoc;
	        return ContinueSentinel;
	      }

	      return this.complete(record);
	    },

	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = this.arg = record.arg;
	        this.method = "return";
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }

	      return ContinueSentinel;
	    },

	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      if (this.method === "next") {
	        // Deliberately forget the last sent value so that we don't
	        // accidentally pass it on to the delegate.
	        this.arg = undefined$1;
	      }

	      return ContinueSentinel;
	    }
	  };

	  // Regardless of whether this script is executing as a CommonJS module
	  // or not, return the runtime object so that we can declare the variable
	  // regeneratorRuntime in the outer scope, which allows this module to be
	  // injected easily by `bin/regenerator --include-runtime script.js`.
	  return exports;

	}(
	  // If this script is executing as a CommonJS module, use module.exports
	  // as the regeneratorRuntime namespace. Otherwise create a new empty
	  // object. Either way, the resulting object will be used to initialize
	  // the regeneratorRuntime variable at the top of this file.
	  module.exports 
	));

	try {
	  regeneratorRuntime = runtime;
	} catch (accidentalStrictMode) {
	  // This module should not be running in strict mode, so the above
	  // assignment should always work unless something is misconfigured. Just
	  // in case runtime.js accidentally runs in strict mode, in modern engines
	  // we can explicitly access globalThis. In older engines we can escape
	  // strict mode using a global Function call. This could conceivably fail
	  // if a Content Security Policy forbids using Function, but in that case
	  // the proper solution is to fix the accidental strict mode problem. If
	  // you've misconfigured your bundler to force strict mode and applied a
	  // CSP to forbid Function, and you're not willing to fix either of those
	  // problems, please detail your unique predicament in a GitHub issue.
	  if (typeof globalThis === "object") {
	    globalThis.regeneratorRuntime = runtime;
	  } else {
	    Function("r", "regeneratorRuntime = r")(runtime);
	  }
	}
	}(runtime));

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation.

	Permission to use, copy, modify, and/or distribute this software for any
	purpose with or without fee is hereby granted.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
	REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
	AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
	INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
	LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
	OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
	PERFORMANCE OF THIS SOFTWARE.
	***************************************************************************** */

	var __assign = function() {
	    __assign = Object.assign || function __assign(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};

	/**
	 * Datart
	 *
	 * Copyright 2021
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var _a$3;
	var SortActionType;
	(function (SortActionType) {
	    SortActionType["NONE"] = "NONE";
	    SortActionType["ASC"] = "ASC";
	    SortActionType["DESC"] = "DESC";
	    SortActionType["CUSTOMIZE"] = "CUSTOMIZE";
	})(SortActionType || (SortActionType = {}));
	var FieldFormatType;
	(function (FieldFormatType) {
	    FieldFormatType["DEFAULT"] = "default";
	    FieldFormatType["NUMERIC"] = "numeric";
	    FieldFormatType["CURRENCY"] = "currency";
	    FieldFormatType["PERCENTAGE"] = "percentage";
	    FieldFormatType["SCIENTIFIC"] = "scientificNotation";
	    FieldFormatType["DATE"] = "date";
	    FieldFormatType["CUSTOM"] = "custom";
	})(FieldFormatType || (FieldFormatType = {}));
	var AggregateFieldActionType;
	(function (AggregateFieldActionType) {
	    AggregateFieldActionType["NONE"] = "NONE";
	    AggregateFieldActionType["SUM"] = "SUM";
	    AggregateFieldActionType["AVG"] = "AVG";
	    AggregateFieldActionType["COUNT"] = "COUNT";
	    AggregateFieldActionType["COUNT_DISTINCT"] = "COUNT_DISTINCT";
	    AggregateFieldActionType["MAX"] = "MAX";
	    AggregateFieldActionType["MIN"] = "MIN";
	})(AggregateFieldActionType || (AggregateFieldActionType = {}));
	var FilterConditionType;
	(function (FilterConditionType) {
	    // Real Filters
	    FilterConditionType[FilterConditionType["List"] = 2] = "List";
	    FilterConditionType[FilterConditionType["Customize"] = 4] = "Customize";
	    FilterConditionType[FilterConditionType["Condition"] = 8] = "Condition";
	    FilterConditionType[FilterConditionType["RangeValue"] = 16] = "RangeValue";
	    FilterConditionType[FilterConditionType["Value"] = 32] = "Value";
	    FilterConditionType[FilterConditionType["RangeTime"] = 64] = "RangeTime";
	    FilterConditionType[FilterConditionType["RecommendTime"] = 128] = "RecommendTime";
	    FilterConditionType[FilterConditionType["Time"] = 256] = "Time";
	    FilterConditionType[FilterConditionType["Tree"] = 512] = "Tree";
	    // Logic Filters, and type of `Filter` includes all Real Filters
	    FilterConditionType[FilterConditionType["Filter"] = 1022] = "Filter";
	    FilterConditionType[FilterConditionType["Relation"] = 262144] = "Relation";
	})(FilterConditionType || (FilterConditionType = {}));
	var ChartDataSectionFieldActionType = {
	    Sortable: 'sortable',
	    Alias: 'alias',
	    Format: 'format',
	    Aggregate: 'aggregate',
	    AggregateLimit: 'aggregateLimit',
	    Filter: 'filter',
	    CategoryFilter: 'categoryFilter',
	    Colorize: 'colorize',
	    ColorRange: 'colorRange',
	    ColorizeSingle: 'colorSingle',
	    Size: 'size',
	};
	(_a$3 = {},
	    _a$3[ChartDataSectionFieldActionType.Aggregate] = [
	        AggregateFieldActionType.SUM,
	        AggregateFieldActionType.AVG,
	        AggregateFieldActionType.COUNT,
	        AggregateFieldActionType.COUNT_DISTINCT,
	        AggregateFieldActionType.MAX,
	        AggregateFieldActionType.MIN,
	    ],
	    _a$3[ChartDataSectionFieldActionType.AggregateLimit] = [
	        AggregateFieldActionType.COUNT,
	        AggregateFieldActionType.COUNT_DISTINCT,
	    ],
	    _a$3);
	var ChartDataSectionType;
	(function (ChartDataSectionType) {
	    ChartDataSectionType["GROUP"] = "group";
	    ChartDataSectionType["AGGREGATE"] = "aggregate";
	    ChartDataSectionType["MIXED"] = "mixed";
	    ChartDataSectionType["FILTER"] = "filter";
	    ChartDataSectionType["COLOR"] = "color";
	    ChartDataSectionType["INFO"] = "info";
	    ChartDataSectionType["SIZE"] = "size";
	})(ChartDataSectionType || (ChartDataSectionType = {}));

	/**
	 * Datart
	 *
	 * Copyright 2021
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var ChartDataViewFieldType;
	(function (ChartDataViewFieldType) {
	    ChartDataViewFieldType["STRING"] = "STRING";
	    ChartDataViewFieldType["NUMERIC"] = "NUMERIC";
	    ChartDataViewFieldType["DATE"] = "DATE";
	})(ChartDataViewFieldType || (ChartDataViewFieldType = {}));
	var ChartDataViewFieldCategory;
	(function (ChartDataViewFieldCategory) {
	    ChartDataViewFieldCategory["Field"] = "field";
	    ChartDataViewFieldCategory["Variable"] = "variable";
	    ChartDataViewFieldCategory["ComputedField"] = "computedField";
	    ChartDataViewFieldCategory["AggregateComputedField"] = "aggregateComputedField";
	})(ChartDataViewFieldCategory || (ChartDataViewFieldCategory = {}));

	/** Detect free variable `global` from Node.js. */

	var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

	var _freeGlobal = freeGlobal$1;

	var freeGlobal = _freeGlobal;

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root$9 = freeGlobal || freeSelf || Function('return this')();

	var _root = root$9;

	var root$8 = _root;

	/** Built-in value references. */
	var Symbol$6 = root$8.Symbol;

	var _Symbol = Symbol$6;

	/**
	 * A specialized version of `_.map` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */

	function arrayMap$2(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      result = Array(length);

	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}

	var _arrayMap = arrayMap$2;

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */

	var isArray$8 = Array.isArray;

	var isArray_1 = isArray$8;

	var Symbol$5 = _Symbol;

	/** Used for built-in method references. */
	var objectProto$d = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$a = objectProto$d.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString$1 = objectProto$d.toString;

	/** Built-in value references. */
	var symToStringTag$1 = Symbol$5 ? Symbol$5.toStringTag : undefined;

	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag$1(value) {
	  var isOwn = hasOwnProperty$a.call(value, symToStringTag$1),
	      tag = value[symToStringTag$1];

	  try {
	    value[symToStringTag$1] = undefined;
	    var unmasked = true;
	  } catch (e) {}

	  var result = nativeObjectToString$1.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag$1] = tag;
	    } else {
	      delete value[symToStringTag$1];
	    }
	  }
	  return result;
	}

	var _getRawTag = getRawTag$1;

	/** Used for built-in method references. */

	var objectProto$c = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto$c.toString;

	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString$1(value) {
	  return nativeObjectToString.call(value);
	}

	var _objectToString = objectToString$1;

	var Symbol$4 = _Symbol,
	    getRawTag = _getRawTag,
	    objectToString = _objectToString;

	/** `Object#toString` result references. */
	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';

	/** Built-in value references. */
	var symToStringTag = Symbol$4 ? Symbol$4.toStringTag : undefined;

	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag$6(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag && symToStringTag in Object(value))
	    ? getRawTag(value)
	    : objectToString(value);
	}

	var _baseGetTag = baseGetTag$6;

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */

	function isObjectLike$7(value) {
	  return value != null && typeof value == 'object';
	}

	var isObjectLike_1 = isObjectLike$7;

	var baseGetTag$5 = _baseGetTag,
	    isObjectLike$6 = isObjectLike_1;

	/** `Object#toString` result references. */
	var symbolTag$2 = '[object Symbol]';

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol$3(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike$6(value) && baseGetTag$5(value) == symbolTag$2);
	}

	var isSymbol_1 = isSymbol$3;

	var Symbol$3 = _Symbol,
	    arrayMap$1 = _arrayMap,
	    isArray$7 = isArray_1,
	    isSymbol$2 = isSymbol_1;

	/** Used as references for various `Number` constants. */
	var INFINITY$2 = 1 / 0;

	/** Used to convert symbols to primitives and strings. */
	var symbolProto$1 = Symbol$3 ? Symbol$3.prototype : undefined,
	    symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString$1(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (isArray$7(value)) {
	    // Recursively convert values (susceptible to call stack limits).
	    return arrayMap$1(value, baseToString$1) + '';
	  }
	  if (isSymbol$2(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY$2) ? '-0' : result;
	}

	var _baseToString = baseToString$1;

	var baseToString = _baseToString;

	/**
	 * Converts `value` to a string. An empty string is returned for `null`
	 * and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString$1(value) {
	  return value == null ? '' : baseToString(value);
	}

	var toString_1 = toString$1;

	/**
	 * The base implementation of `_.slice` without an iteratee call guard.
	 *
	 * @private
	 * @param {Array} array The array to slice.
	 * @param {number} [start=0] The start position.
	 * @param {number} [end=array.length] The end position.
	 * @returns {Array} Returns the slice of `array`.
	 */

	function baseSlice$1(array, start, end) {
	  var index = -1,
	      length = array.length;

	  if (start < 0) {
	    start = -start > length ? 0 : (length + start);
	  }
	  end = end > length ? length : end;
	  if (end < 0) {
	    end += length;
	  }
	  length = start > end ? 0 : ((end - start) >>> 0);
	  start >>>= 0;

	  var result = Array(length);
	  while (++index < length) {
	    result[index] = array[index + start];
	  }
	  return result;
	}

	var _baseSlice = baseSlice$1;

	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */

	function listCacheClear$1() {
	  this.__data__ = [];
	  this.size = 0;
	}

	var _listCacheClear = listCacheClear$1;

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */

	function eq$2(value, other) {
	  return value === other || (value !== value && other !== other);
	}

	var eq_1 = eq$2;

	var eq$1 = eq_1;

	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf$4(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq$1(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}

	var _assocIndexOf = assocIndexOf$4;

	var assocIndexOf$3 = _assocIndexOf;

	/** Used for built-in method references. */
	var arrayProto = Array.prototype;

	/** Built-in value references. */
	var splice = arrayProto.splice;

	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete$1(key) {
	  var data = this.__data__,
	      index = assocIndexOf$3(data, key);

	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  --this.size;
	  return true;
	}

	var _listCacheDelete = listCacheDelete$1;

	var assocIndexOf$2 = _assocIndexOf;

	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet$1(key) {
	  var data = this.__data__,
	      index = assocIndexOf$2(data, key);

	  return index < 0 ? undefined : data[index][1];
	}

	var _listCacheGet = listCacheGet$1;

	var assocIndexOf$1 = _assocIndexOf;

	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas$1(key) {
	  return assocIndexOf$1(this.__data__, key) > -1;
	}

	var _listCacheHas = listCacheHas$1;

	var assocIndexOf = _assocIndexOf;

	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet$1(key, value) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    ++this.size;
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}

	var _listCacheSet = listCacheSet$1;

	var listCacheClear = _listCacheClear,
	    listCacheDelete = _listCacheDelete,
	    listCacheGet = _listCacheGet,
	    listCacheHas = _listCacheHas,
	    listCacheSet = _listCacheSet;

	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache$4(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `ListCache`.
	ListCache$4.prototype.clear = listCacheClear;
	ListCache$4.prototype['delete'] = listCacheDelete;
	ListCache$4.prototype.get = listCacheGet;
	ListCache$4.prototype.has = listCacheHas;
	ListCache$4.prototype.set = listCacheSet;

	var _ListCache = ListCache$4;

	var ListCache$3 = _ListCache;

	/**
	 * Removes all key-value entries from the stack.
	 *
	 * @private
	 * @name clear
	 * @memberOf Stack
	 */
	function stackClear$1() {
	  this.__data__ = new ListCache$3;
	  this.size = 0;
	}

	var _stackClear = stackClear$1;

	/**
	 * Removes `key` and its value from the stack.
	 *
	 * @private
	 * @name delete
	 * @memberOf Stack
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */

	function stackDelete$1(key) {
	  var data = this.__data__,
	      result = data['delete'](key);

	  this.size = data.size;
	  return result;
	}

	var _stackDelete = stackDelete$1;

	/**
	 * Gets the stack value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Stack
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */

	function stackGet$1(key) {
	  return this.__data__.get(key);
	}

	var _stackGet = stackGet$1;

	/**
	 * Checks if a stack value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Stack
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */

	function stackHas$1(key) {
	  return this.__data__.has(key);
	}

	var _stackHas = stackHas$1;

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */

	function isObject$6(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}

	var isObject_1 = isObject$6;

	var baseGetTag$4 = _baseGetTag,
	    isObject$5 = isObject_1;

	/** `Object#toString` result references. */
	var asyncTag = '[object AsyncFunction]',
	    funcTag$2 = '[object Function]',
	    genTag$1 = '[object GeneratorFunction]',
	    proxyTag = '[object Proxy]';

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction$2(value) {
	  if (!isObject$5(value)) {
	    return false;
	  }
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
	  var tag = baseGetTag$4(value);
	  return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
	}

	var isFunction_1 = isFunction$2;

	var root$7 = _root;

	/** Used to detect overreaching core-js shims. */
	var coreJsData$1 = root$7['__core-js_shared__'];

	var _coreJsData = coreJsData$1;

	var coreJsData = _coreJsData;

	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());

	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked$1(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}

	var _isMasked = isMasked$1;

	/** Used for built-in method references. */

	var funcProto$2 = Function.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString$2 = funcProto$2.toString;

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to convert.
	 * @returns {string} Returns the source code.
	 */
	function toSource$2(func) {
	  if (func != null) {
	    try {
	      return funcToString$2.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}

	var _toSource = toSource$2;

	var isFunction$1 = isFunction_1,
	    isMasked = _isMasked,
	    isObject$4 = isObject_1,
	    toSource$1 = _toSource;

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for built-in method references. */
	var funcProto$1 = Function.prototype,
	    objectProto$b = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString$1 = funcProto$1.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty$9 = objectProto$b.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString$1.call(hasOwnProperty$9).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative$1(value) {
	  if (!isObject$4(value) || isMasked(value)) {
	    return false;
	  }
	  var pattern = isFunction$1(value) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource$1(value));
	}

	var _baseIsNative = baseIsNative$1;

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */

	function getValue$2(object, key) {
	  return object == null ? undefined : object[key];
	}

	var _getValue = getValue$2;

	var baseIsNative = _baseIsNative,
	    getValue$1 = _getValue;

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative$7(object, key) {
	  var value = getValue$1(object, key);
	  return baseIsNative(value) ? value : undefined;
	}

	var _getNative = getNative$7;

	var getNative$6 = _getNative,
	    root$6 = _root;

	/* Built-in method references that are verified to be native. */
	var Map$4 = getNative$6(root$6, 'Map');

	var _Map = Map$4;

	var getNative$5 = _getNative;

	/* Built-in method references that are verified to be native. */
	var nativeCreate$4 = getNative$5(Object, 'create');

	var _nativeCreate = nativeCreate$4;

	var nativeCreate$3 = _nativeCreate;

	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear$1() {
	  this.__data__ = nativeCreate$3 ? nativeCreate$3(null) : {};
	  this.size = 0;
	}

	var _hashClear = hashClear$1;

	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */

	function hashDelete$1(key) {
	  var result = this.has(key) && delete this.__data__[key];
	  this.size -= result ? 1 : 0;
	  return result;
	}

	var _hashDelete = hashDelete$1;

	var nativeCreate$2 = _nativeCreate;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

	/** Used for built-in method references. */
	var objectProto$a = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet$1(key) {
	  var data = this.__data__;
	  if (nativeCreate$2) {
	    var result = data[key];
	    return result === HASH_UNDEFINED$1 ? undefined : result;
	  }
	  return hasOwnProperty$8.call(data, key) ? data[key] : undefined;
	}

	var _hashGet = hashGet$1;

	var nativeCreate$1 = _nativeCreate;

	/** Used for built-in method references. */
	var objectProto$9 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas$1(key) {
	  var data = this.__data__;
	  return nativeCreate$1 ? (data[key] !== undefined) : hasOwnProperty$7.call(data, key);
	}

	var _hashHas = hashHas$1;

	var nativeCreate = _nativeCreate;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet$1(key, value) {
	  var data = this.__data__;
	  this.size += this.has(key) ? 0 : 1;
	  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	  return this;
	}

	var _hashSet = hashSet$1;

	var hashClear = _hashClear,
	    hashDelete = _hashDelete,
	    hashGet = _hashGet,
	    hashHas = _hashHas,
	    hashSet = _hashSet;

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash$1(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `Hash`.
	Hash$1.prototype.clear = hashClear;
	Hash$1.prototype['delete'] = hashDelete;
	Hash$1.prototype.get = hashGet;
	Hash$1.prototype.has = hashHas;
	Hash$1.prototype.set = hashSet;

	var _Hash = Hash$1;

	var Hash = _Hash,
	    ListCache$2 = _ListCache,
	    Map$3 = _Map;

	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear$1() {
	  this.size = 0;
	  this.__data__ = {
	    'hash': new Hash,
	    'map': new (Map$3 || ListCache$2),
	    'string': new Hash
	  };
	}

	var _mapCacheClear = mapCacheClear$1;

	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */

	function isKeyable$1(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}

	var _isKeyable = isKeyable$1;

	var isKeyable = _isKeyable;

	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData$4(map, key) {
	  var data = map.__data__;
	  return isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}

	var _getMapData = getMapData$4;

	var getMapData$3 = _getMapData;

	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete$1(key) {
	  var result = getMapData$3(this, key)['delete'](key);
	  this.size -= result ? 1 : 0;
	  return result;
	}

	var _mapCacheDelete = mapCacheDelete$1;

	var getMapData$2 = _getMapData;

	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet$1(key) {
	  return getMapData$2(this, key).get(key);
	}

	var _mapCacheGet = mapCacheGet$1;

	var getMapData$1 = _getMapData;

	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas$1(key) {
	  return getMapData$1(this, key).has(key);
	}

	var _mapCacheHas = mapCacheHas$1;

	var getMapData = _getMapData;

	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet$1(key, value) {
	  var data = getMapData(this, key),
	      size = data.size;

	  data.set(key, value);
	  this.size += data.size == size ? 0 : 1;
	  return this;
	}

	var _mapCacheSet = mapCacheSet$1;

	var mapCacheClear = _mapCacheClear,
	    mapCacheDelete = _mapCacheDelete,
	    mapCacheGet = _mapCacheGet,
	    mapCacheHas = _mapCacheHas,
	    mapCacheSet = _mapCacheSet;

	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache$2(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `MapCache`.
	MapCache$2.prototype.clear = mapCacheClear;
	MapCache$2.prototype['delete'] = mapCacheDelete;
	MapCache$2.prototype.get = mapCacheGet;
	MapCache$2.prototype.has = mapCacheHas;
	MapCache$2.prototype.set = mapCacheSet;

	var _MapCache = MapCache$2;

	var ListCache$1 = _ListCache,
	    Map$2 = _Map,
	    MapCache$1 = _MapCache;

	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/**
	 * Sets the stack `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Stack
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the stack cache instance.
	 */
	function stackSet$1(key, value) {
	  var data = this.__data__;
	  if (data instanceof ListCache$1) {
	    var pairs = data.__data__;
	    if (!Map$2 || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
	      pairs.push([key, value]);
	      this.size = ++data.size;
	      return this;
	    }
	    data = this.__data__ = new MapCache$1(pairs);
	  }
	  data.set(key, value);
	  this.size = data.size;
	  return this;
	}

	var _stackSet = stackSet$1;

	var ListCache = _ListCache,
	    stackClear = _stackClear,
	    stackDelete = _stackDelete,
	    stackGet = _stackGet,
	    stackHas = _stackHas,
	    stackSet = _stackSet;

	/**
	 * Creates a stack cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Stack$1(entries) {
	  var data = this.__data__ = new ListCache(entries);
	  this.size = data.size;
	}

	// Add methods to `Stack`.
	Stack$1.prototype.clear = stackClear;
	Stack$1.prototype['delete'] = stackDelete;
	Stack$1.prototype.get = stackGet;
	Stack$1.prototype.has = stackHas;
	Stack$1.prototype.set = stackSet;

	var _Stack = Stack$1;

	/**
	 * A specialized version of `_.forEach` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns `array`.
	 */

	function arrayEach$1(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length;

	  while (++index < length) {
	    if (iteratee(array[index], index, array) === false) {
	      break;
	    }
	  }
	  return array;
	}

	var _arrayEach = arrayEach$1;

	var getNative$4 = _getNative;

	var defineProperty$2 = (function() {
	  try {
	    var func = getNative$4(Object, 'defineProperty');
	    func({}, '', {});
	    return func;
	  } catch (e) {}
	}());

	var _defineProperty = defineProperty$2;

	var defineProperty$1 = _defineProperty;

	/**
	 * The base implementation of `assignValue` and `assignMergeValue` without
	 * value checks.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function baseAssignValue$2(object, key, value) {
	  if (key == '__proto__' && defineProperty$1) {
	    defineProperty$1(object, key, {
	      'configurable': true,
	      'enumerable': true,
	      'value': value,
	      'writable': true
	    });
	  } else {
	    object[key] = value;
	  }
	}

	var _baseAssignValue = baseAssignValue$2;

	var baseAssignValue$1 = _baseAssignValue,
	    eq = eq_1;

	/** Used for built-in method references. */
	var objectProto$8 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue$3(object, key, value) {
	  var objValue = object[key];
	  if (!(hasOwnProperty$6.call(object, key) && eq(objValue, value)) ||
	      (value === undefined && !(key in object))) {
	    baseAssignValue$1(object, key, value);
	  }
	}

	var _assignValue = assignValue$3;

	var assignValue$2 = _assignValue,
	    baseAssignValue = _baseAssignValue;

	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */
	function copyObject$5(source, props, object, customizer) {
	  var isNew = !object;
	  object || (object = {});

	  var index = -1,
	      length = props.length;

	  while (++index < length) {
	    var key = props[index];

	    var newValue = customizer
	      ? customizer(object[key], source[key], key, object, source)
	      : undefined;

	    if (newValue === undefined) {
	      newValue = source[key];
	    }
	    if (isNew) {
	      baseAssignValue(object, key, newValue);
	    } else {
	      assignValue$2(object, key, newValue);
	    }
	  }
	  return object;
	}

	var _copyObject = copyObject$5;

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */

	function baseTimes$1(n, iteratee) {
	  var index = -1,
	      result = Array(n);

	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}

	var _baseTimes = baseTimes$1;

	var baseGetTag$3 = _baseGetTag,
	    isObjectLike$5 = isObjectLike_1;

	/** `Object#toString` result references. */
	var argsTag$2 = '[object Arguments]';

	/**
	 * The base implementation of `_.isArguments`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 */
	function baseIsArguments$1(value) {
	  return isObjectLike$5(value) && baseGetTag$3(value) == argsTag$2;
	}

	var _baseIsArguments = baseIsArguments$1;

	var baseIsArguments = _baseIsArguments,
	    isObjectLike$4 = isObjectLike_1;

	/** Used for built-in method references. */
	var objectProto$7 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

	/** Built-in value references. */
	var propertyIsEnumerable$1 = objectProto$7.propertyIsEnumerable;

	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	var isArguments$3 = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
	  return isObjectLike$4(value) && hasOwnProperty$5.call(value, 'callee') &&
	    !propertyIsEnumerable$1.call(value, 'callee');
	};

	var isArguments_1 = isArguments$3;

	var isBuffer$2 = {exports: {}};

	/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */

	function stubFalse() {
	  return false;
	}

	var stubFalse_1 = stubFalse;

	(function (module, exports) {
	var root = _root,
	    stubFalse = stubFalse_1;

	/** Detect free variable `exports`. */
	var freeExports = exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : undefined;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

	/**
	 * Checks if `value` is a buffer.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	 * @example
	 *
	 * _.isBuffer(new Buffer(2));
	 * // => true
	 *
	 * _.isBuffer(new Uint8Array(2));
	 * // => false
	 */
	var isBuffer = nativeIsBuffer || stubFalse;

	module.exports = isBuffer;
	}(isBuffer$2, isBuffer$2.exports));

	/** Used as references for various `Number` constants. */

	var MAX_SAFE_INTEGER$1 = 9007199254740991;

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex$3(value, length) {
	  var type = typeof value;
	  length = length == null ? MAX_SAFE_INTEGER$1 : length;

	  return !!length &&
	    (type == 'number' ||
	      (type != 'symbol' && reIsUint.test(value))) &&
	        (value > -1 && value % 1 == 0 && value < length);
	}

	var _isIndex = isIndex$3;

	/** Used as references for various `Number` constants. */

	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength$3(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	var isLength_1 = isLength$3;

	var baseGetTag$2 = _baseGetTag,
	    isLength$2 = isLength_1,
	    isObjectLike$3 = isObjectLike_1;

	/** `Object#toString` result references. */
	var argsTag$1 = '[object Arguments]',
	    arrayTag$1 = '[object Array]',
	    boolTag$2 = '[object Boolean]',
	    dateTag$2 = '[object Date]',
	    errorTag$1 = '[object Error]',
	    funcTag$1 = '[object Function]',
	    mapTag$4 = '[object Map]',
	    numberTag$2 = '[object Number]',
	    objectTag$3 = '[object Object]',
	    regexpTag$2 = '[object RegExp]',
	    setTag$4 = '[object Set]',
	    stringTag$2 = '[object String]',
	    weakMapTag$2 = '[object WeakMap]';

	var arrayBufferTag$2 = '[object ArrayBuffer]',
	    dataViewTag$3 = '[object DataView]',
	    float32Tag$2 = '[object Float32Array]',
	    float64Tag$2 = '[object Float64Array]',
	    int8Tag$2 = '[object Int8Array]',
	    int16Tag$2 = '[object Int16Array]',
	    int32Tag$2 = '[object Int32Array]',
	    uint8Tag$2 = '[object Uint8Array]',
	    uint8ClampedTag$2 = '[object Uint8ClampedArray]',
	    uint16Tag$2 = '[object Uint16Array]',
	    uint32Tag$2 = '[object Uint32Array]';

	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] =
	typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] =
	typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] =
	typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] =
	typedArrayTags[uint32Tag$2] = true;
	typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] =
	typedArrayTags[arrayBufferTag$2] = typedArrayTags[boolTag$2] =
	typedArrayTags[dataViewTag$3] = typedArrayTags[dateTag$2] =
	typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] =
	typedArrayTags[mapTag$4] = typedArrayTags[numberTag$2] =
	typedArrayTags[objectTag$3] = typedArrayTags[regexpTag$2] =
	typedArrayTags[setTag$4] = typedArrayTags[stringTag$2] =
	typedArrayTags[weakMapTag$2] = false;

	/**
	 * The base implementation of `_.isTypedArray` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 */
	function baseIsTypedArray$1(value) {
	  return isObjectLike$3(value) &&
	    isLength$2(value.length) && !!typedArrayTags[baseGetTag$2(value)];
	}

	var _baseIsTypedArray = baseIsTypedArray$1;

	/**
	 * The base implementation of `_.unary` without support for storing metadata.
	 *
	 * @private
	 * @param {Function} func The function to cap arguments for.
	 * @returns {Function} Returns the new capped function.
	 */

	function baseUnary$3(func) {
	  return function(value) {
	    return func(value);
	  };
	}

	var _baseUnary = baseUnary$3;

	var _nodeUtil = {exports: {}};

	(function (module, exports) {
	var freeGlobal = _freeGlobal;

	/** Detect free variable `exports`. */
	var freeExports = exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Detect free variable `process` from Node.js. */
	var freeProcess = moduleExports && freeGlobal.process;

	/** Used to access faster Node.js helpers. */
	var nodeUtil = (function() {
	  try {
	    // Use `util.types` for Node.js 10+.
	    var types = freeModule && freeModule.require && freeModule.require('util').types;

	    if (types) {
	      return types;
	    }

	    // Legacy `process.binding('util')` for Node.js < 10.
	    return freeProcess && freeProcess.binding && freeProcess.binding('util');
	  } catch (e) {}
	}());

	module.exports = nodeUtil;
	}(_nodeUtil, _nodeUtil.exports));

	var baseIsTypedArray = _baseIsTypedArray,
	    baseUnary$2 = _baseUnary,
	    nodeUtil$2 = _nodeUtil.exports;

	/* Node.js helper references. */
	var nodeIsTypedArray = nodeUtil$2 && nodeUtil$2.isTypedArray;

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	var isTypedArray$1 = nodeIsTypedArray ? baseUnary$2(nodeIsTypedArray) : baseIsTypedArray;

	var isTypedArray_1 = isTypedArray$1;

	var baseTimes = _baseTimes,
	    isArguments$2 = isArguments_1,
	    isArray$6 = isArray_1,
	    isBuffer$1 = isBuffer$2.exports,
	    isIndex$2 = _isIndex,
	    isTypedArray = isTypedArray_1;

	/** Used for built-in method references. */
	var objectProto$6 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

	/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */
	function arrayLikeKeys$2(value, inherited) {
	  var isArr = isArray$6(value),
	      isArg = !isArr && isArguments$2(value),
	      isBuff = !isArr && !isArg && isBuffer$1(value),
	      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
	      skipIndexes = isArr || isArg || isBuff || isType,
	      result = skipIndexes ? baseTimes(value.length, String) : [],
	      length = result.length;

	  for (var key in value) {
	    if ((inherited || hasOwnProperty$4.call(value, key)) &&
	        !(skipIndexes && (
	           // Safari 9 has enumerable `arguments.length` in strict mode.
	           key == 'length' ||
	           // Node.js 0.10 has enumerable non-index properties on buffers.
	           (isBuff && (key == 'offset' || key == 'parent')) ||
	           // PhantomJS 2 has enumerable non-index properties on typed arrays.
	           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
	           // Skip index properties.
	           isIndex$2(key, length)
	        ))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _arrayLikeKeys = arrayLikeKeys$2;

	/** Used for built-in method references. */

	var objectProto$5 = Object.prototype;

	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype$3(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$5;

	  return value === proto;
	}

	var _isPrototype = isPrototype$3;

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */

	function overArg$2(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}

	var _overArg = overArg$2;

	var overArg$1 = _overArg;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeKeys$1 = overArg$1(Object.keys, Object);

	var _nativeKeys = nativeKeys$1;

	var isPrototype$2 = _isPrototype,
	    nativeKeys = _nativeKeys;

	/** Used for built-in method references. */
	var objectProto$4 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

	/**
	 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys$1(object) {
	  if (!isPrototype$2(object)) {
	    return nativeKeys(object);
	  }
	  var result = [];
	  for (var key in Object(object)) {
	    if (hasOwnProperty$3.call(object, key) && key != 'constructor') {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _baseKeys = baseKeys$1;

	var isFunction = isFunction_1,
	    isLength$1 = isLength_1;

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike$2(value) {
	  return value != null && isLength$1(value.length) && !isFunction(value);
	}

	var isArrayLike_1 = isArrayLike$2;

	var arrayLikeKeys$1 = _arrayLikeKeys,
	    baseKeys = _baseKeys,
	    isArrayLike$1 = isArrayLike_1;

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys$3(object) {
	  return isArrayLike$1(object) ? arrayLikeKeys$1(object) : baseKeys(object);
	}

	var keys_1 = keys$3;

	var copyObject$4 = _copyObject,
	    keys$2 = keys_1;

	/**
	 * The base implementation of `_.assign` without support for multiple sources
	 * or `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
	function baseAssign$1(object, source) {
	  return object && copyObject$4(source, keys$2(source), object);
	}

	var _baseAssign = baseAssign$1;

	/**
	 * This function is like
	 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * except that it includes inherited enumerable properties.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */

	function nativeKeysIn$1(object) {
	  var result = [];
	  if (object != null) {
	    for (var key in Object(object)) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _nativeKeysIn = nativeKeysIn$1;

	var isObject$3 = isObject_1,
	    isPrototype$1 = _isPrototype,
	    nativeKeysIn = _nativeKeysIn;

	/** Used for built-in method references. */
	var objectProto$3 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

	/**
	 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeysIn$1(object) {
	  if (!isObject$3(object)) {
	    return nativeKeysIn(object);
	  }
	  var isProto = isPrototype$1(object),
	      result = [];

	  for (var key in object) {
	    if (!(key == 'constructor' && (isProto || !hasOwnProperty$2.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _baseKeysIn = baseKeysIn$1;

	var arrayLikeKeys = _arrayLikeKeys,
	    baseKeysIn = _baseKeysIn,
	    isArrayLike = isArrayLike_1;

	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn$3(object) {
	  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
	}

	var keysIn_1 = keysIn$3;

	var copyObject$3 = _copyObject,
	    keysIn$2 = keysIn_1;

	/**
	 * The base implementation of `_.assignIn` without support for multiple sources
	 * or `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
	function baseAssignIn$1(object, source) {
	  return object && copyObject$3(source, keysIn$2(source), object);
	}

	var _baseAssignIn = baseAssignIn$1;

	var _cloneBuffer = {exports: {}};

	(function (module, exports) {
	var root = _root;

	/** Detect free variable `exports`. */
	var freeExports = exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : undefined,
	    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

	/**
	 * Creates a clone of  `buffer`.
	 *
	 * @private
	 * @param {Buffer} buffer The buffer to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Buffer} Returns the cloned buffer.
	 */
	function cloneBuffer(buffer, isDeep) {
	  if (isDeep) {
	    return buffer.slice();
	  }
	  var length = buffer.length,
	      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

	  buffer.copy(result);
	  return result;
	}

	module.exports = cloneBuffer;
	}(_cloneBuffer, _cloneBuffer.exports));

	/**
	 * Copies the values of `source` to `array`.
	 *
	 * @private
	 * @param {Array} source The array to copy values from.
	 * @param {Array} [array=[]] The array to copy values to.
	 * @returns {Array} Returns `array`.
	 */

	function copyArray$1(source, array) {
	  var index = -1,
	      length = source.length;

	  array || (array = Array(length));
	  while (++index < length) {
	    array[index] = source[index];
	  }
	  return array;
	}

	var _copyArray = copyArray$1;

	/**
	 * A specialized version of `_.filter` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 */

	function arrayFilter$1(array, predicate) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      resIndex = 0,
	      result = [];

	  while (++index < length) {
	    var value = array[index];
	    if (predicate(value, index, array)) {
	      result[resIndex++] = value;
	    }
	  }
	  return result;
	}

	var _arrayFilter = arrayFilter$1;

	/**
	 * This method returns a new empty array.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {Array} Returns the new empty array.
	 * @example
	 *
	 * var arrays = _.times(2, _.stubArray);
	 *
	 * ////console.log(arrays);
	 * // => [[], []]
	 *
	 * ////console.log(arrays[0] === arrays[1]);
	 * // => false
	 */

	function stubArray$2() {
	  return [];
	}

	var stubArray_1 = stubArray$2;

	var arrayFilter = _arrayFilter,
	    stubArray$1 = stubArray_1;

	/** Used for built-in method references. */
	var objectProto$2 = Object.prototype;

	/** Built-in value references. */
	var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

	/**
	 * Creates an array of the own enumerable symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbols$3 = !nativeGetSymbols$1 ? stubArray$1 : function(object) {
	  if (object == null) {
	    return [];
	  }
	  object = Object(object);
	  return arrayFilter(nativeGetSymbols$1(object), function(symbol) {
	    return propertyIsEnumerable.call(object, symbol);
	  });
	};

	var _getSymbols = getSymbols$3;

	var copyObject$2 = _copyObject,
	    getSymbols$2 = _getSymbols;

	/**
	 * Copies own symbols of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy symbols from.
	 * @param {Object} [object={}] The object to copy symbols to.
	 * @returns {Object} Returns `object`.
	 */
	function copySymbols$1(source, object) {
	  return copyObject$2(source, getSymbols$2(source), object);
	}

	var _copySymbols = copySymbols$1;

	/**
	 * Appends the elements of `values` to `array`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to append.
	 * @returns {Array} Returns `array`.
	 */

	function arrayPush$3(array, values) {
	  var index = -1,
	      length = values.length,
	      offset = array.length;

	  while (++index < length) {
	    array[offset + index] = values[index];
	  }
	  return array;
	}

	var _arrayPush = arrayPush$3;

	var overArg = _overArg;

	/** Built-in value references. */
	var getPrototype$3 = overArg(Object.getPrototypeOf, Object);

	var _getPrototype = getPrototype$3;

	var arrayPush$2 = _arrayPush,
	    getPrototype$2 = _getPrototype,
	    getSymbols$1 = _getSymbols,
	    stubArray = stubArray_1;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetSymbols = Object.getOwnPropertySymbols;

	/**
	 * Creates an array of the own and inherited enumerable symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbolsIn$2 = !nativeGetSymbols ? stubArray : function(object) {
	  var result = [];
	  while (object) {
	    arrayPush$2(result, getSymbols$1(object));
	    object = getPrototype$2(object);
	  }
	  return result;
	};

	var _getSymbolsIn = getSymbolsIn$2;

	var copyObject$1 = _copyObject,
	    getSymbolsIn$1 = _getSymbolsIn;

	/**
	 * Copies own and inherited symbols of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy symbols from.
	 * @param {Object} [object={}] The object to copy symbols to.
	 * @returns {Object} Returns `object`.
	 */
	function copySymbolsIn$1(source, object) {
	  return copyObject$1(source, getSymbolsIn$1(source), object);
	}

	var _copySymbolsIn = copySymbolsIn$1;

	var arrayPush$1 = _arrayPush,
	    isArray$5 = isArray_1;

	/**
	 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
	 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @param {Function} symbolsFunc The function to get the symbols of `object`.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function baseGetAllKeys$2(object, keysFunc, symbolsFunc) {
	  var result = keysFunc(object);
	  return isArray$5(object) ? result : arrayPush$1(result, symbolsFunc(object));
	}

	var _baseGetAllKeys = baseGetAllKeys$2;

	var baseGetAllKeys$1 = _baseGetAllKeys,
	    getSymbols = _getSymbols,
	    keys$1 = keys_1;

	/**
	 * Creates an array of own enumerable property names and symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function getAllKeys$1(object) {
	  return baseGetAllKeys$1(object, keys$1, getSymbols);
	}

	var _getAllKeys = getAllKeys$1;

	var baseGetAllKeys = _baseGetAllKeys,
	    getSymbolsIn = _getSymbolsIn,
	    keysIn$1 = keysIn_1;

	/**
	 * Creates an array of own and inherited enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function getAllKeysIn$2(object) {
	  return baseGetAllKeys(object, keysIn$1, getSymbolsIn);
	}

	var _getAllKeysIn = getAllKeysIn$2;

	var getNative$3 = _getNative,
	    root$5 = _root;

	/* Built-in method references that are verified to be native. */
	var DataView$2 = getNative$3(root$5, 'DataView');

	var _DataView = DataView$2;

	var getNative$2 = _getNative,
	    root$4 = _root;

	/* Built-in method references that are verified to be native. */
	var Promise$2 = getNative$2(root$4, 'Promise');

	var _Promise = Promise$2;

	var getNative$1 = _getNative,
	    root$3 = _root;

	/* Built-in method references that are verified to be native. */
	var Set$2 = getNative$1(root$3, 'Set');

	var _Set = Set$2;

	var getNative = _getNative,
	    root$2 = _root;

	/* Built-in method references that are verified to be native. */
	var WeakMap$1 = getNative(root$2, 'WeakMap');

	var _WeakMap = WeakMap$1;

	var DataView$1 = _DataView,
	    Map$1 = _Map,
	    Promise$1 = _Promise,
	    Set$1 = _Set,
	    WeakMap = _WeakMap,
	    baseGetTag$1 = _baseGetTag,
	    toSource = _toSource;

	/** `Object#toString` result references. */
	var mapTag$3 = '[object Map]',
	    objectTag$2 = '[object Object]',
	    promiseTag = '[object Promise]',
	    setTag$3 = '[object Set]',
	    weakMapTag$1 = '[object WeakMap]';

	var dataViewTag$2 = '[object DataView]';

	/** Used to detect maps, sets, and weakmaps. */
	var dataViewCtorString = toSource(DataView$1),
	    mapCtorString = toSource(Map$1),
	    promiseCtorString = toSource(Promise$1),
	    setCtorString = toSource(Set$1),
	    weakMapCtorString = toSource(WeakMap);

	/**
	 * Gets the `toStringTag` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	var getTag$3 = baseGetTag$1;

	// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
	if ((DataView$1 && getTag$3(new DataView$1(new ArrayBuffer(1))) != dataViewTag$2) ||
	    (Map$1 && getTag$3(new Map$1) != mapTag$3) ||
	    (Promise$1 && getTag$3(Promise$1.resolve()) != promiseTag) ||
	    (Set$1 && getTag$3(new Set$1) != setTag$3) ||
	    (WeakMap && getTag$3(new WeakMap) != weakMapTag$1)) {
	  getTag$3 = function(value) {
	    var result = baseGetTag$1(value),
	        Ctor = result == objectTag$2 ? value.constructor : undefined,
	        ctorString = Ctor ? toSource(Ctor) : '';

	    if (ctorString) {
	      switch (ctorString) {
	        case dataViewCtorString: return dataViewTag$2;
	        case mapCtorString: return mapTag$3;
	        case promiseCtorString: return promiseTag;
	        case setCtorString: return setTag$3;
	        case weakMapCtorString: return weakMapTag$1;
	      }
	    }
	    return result;
	  };
	}

	var _getTag = getTag$3;

	/** Used for built-in method references. */

	var objectProto$1 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

	/**
	 * Initializes an array clone.
	 *
	 * @private
	 * @param {Array} array The array to clone.
	 * @returns {Array} Returns the initialized clone.
	 */
	function initCloneArray$1(array) {
	  var length = array.length,
	      result = new array.constructor(length);

	  // Add properties assigned by `RegExp#exec`.
	  if (length && typeof array[0] == 'string' && hasOwnProperty$1.call(array, 'index')) {
	    result.index = array.index;
	    result.input = array.input;
	  }
	  return result;
	}

	var _initCloneArray = initCloneArray$1;

	var root$1 = _root;

	/** Built-in value references. */
	var Uint8Array$1 = root$1.Uint8Array;

	var _Uint8Array = Uint8Array$1;

	var Uint8Array = _Uint8Array;

	/**
	 * Creates a clone of `arrayBuffer`.
	 *
	 * @private
	 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
	 * @returns {ArrayBuffer} Returns the cloned array buffer.
	 */
	function cloneArrayBuffer$3(arrayBuffer) {
	  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
	  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
	  return result;
	}

	var _cloneArrayBuffer = cloneArrayBuffer$3;

	var cloneArrayBuffer$2 = _cloneArrayBuffer;

	/**
	 * Creates a clone of `dataView`.
	 *
	 * @private
	 * @param {Object} dataView The data view to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned data view.
	 */
	function cloneDataView$1(dataView, isDeep) {
	  var buffer = isDeep ? cloneArrayBuffer$2(dataView.buffer) : dataView.buffer;
	  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
	}

	var _cloneDataView = cloneDataView$1;

	/** Used to match `RegExp` flags from their coerced string values. */

	var reFlags = /\w*$/;

	/**
	 * Creates a clone of `regexp`.
	 *
	 * @private
	 * @param {Object} regexp The regexp to clone.
	 * @returns {Object} Returns the cloned regexp.
	 */
	function cloneRegExp$1(regexp) {
	  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
	  result.lastIndex = regexp.lastIndex;
	  return result;
	}

	var _cloneRegExp = cloneRegExp$1;

	var Symbol$2 = _Symbol;

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol$2 ? Symbol$2.prototype : undefined,
	    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

	/**
	 * Creates a clone of the `symbol` object.
	 *
	 * @private
	 * @param {Object} symbol The symbol object to clone.
	 * @returns {Object} Returns the cloned symbol object.
	 */
	function cloneSymbol$1(symbol) {
	  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
	}

	var _cloneSymbol = cloneSymbol$1;

	var cloneArrayBuffer$1 = _cloneArrayBuffer;

	/**
	 * Creates a clone of `typedArray`.
	 *
	 * @private
	 * @param {Object} typedArray The typed array to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned typed array.
	 */
	function cloneTypedArray$1(typedArray, isDeep) {
	  var buffer = isDeep ? cloneArrayBuffer$1(typedArray.buffer) : typedArray.buffer;
	  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
	}

	var _cloneTypedArray = cloneTypedArray$1;

	var cloneArrayBuffer = _cloneArrayBuffer,
	    cloneDataView = _cloneDataView,
	    cloneRegExp = _cloneRegExp,
	    cloneSymbol = _cloneSymbol,
	    cloneTypedArray = _cloneTypedArray;

	/** `Object#toString` result references. */
	var boolTag$1 = '[object Boolean]',
	    dateTag$1 = '[object Date]',
	    mapTag$2 = '[object Map]',
	    numberTag$1 = '[object Number]',
	    regexpTag$1 = '[object RegExp]',
	    setTag$2 = '[object Set]',
	    stringTag$1 = '[object String]',
	    symbolTag$1 = '[object Symbol]';

	var arrayBufferTag$1 = '[object ArrayBuffer]',
	    dataViewTag$1 = '[object DataView]',
	    float32Tag$1 = '[object Float32Array]',
	    float64Tag$1 = '[object Float64Array]',
	    int8Tag$1 = '[object Int8Array]',
	    int16Tag$1 = '[object Int16Array]',
	    int32Tag$1 = '[object Int32Array]',
	    uint8Tag$1 = '[object Uint8Array]',
	    uint8ClampedTag$1 = '[object Uint8ClampedArray]',
	    uint16Tag$1 = '[object Uint16Array]',
	    uint32Tag$1 = '[object Uint32Array]';

	/**
	 * Initializes an object clone based on its `toStringTag`.
	 *
	 * **Note:** This function only supports cloning values with tags of
	 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @param {string} tag The `toStringTag` of the object to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneByTag$1(object, tag, isDeep) {
	  var Ctor = object.constructor;
	  switch (tag) {
	    case arrayBufferTag$1:
	      return cloneArrayBuffer(object);

	    case boolTag$1:
	    case dateTag$1:
	      return new Ctor(+object);

	    case dataViewTag$1:
	      return cloneDataView(object, isDeep);

	    case float32Tag$1: case float64Tag$1:
	    case int8Tag$1: case int16Tag$1: case int32Tag$1:
	    case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
	      return cloneTypedArray(object, isDeep);

	    case mapTag$2:
	      return new Ctor;

	    case numberTag$1:
	    case stringTag$1:
	      return new Ctor(object);

	    case regexpTag$1:
	      return cloneRegExp(object);

	    case setTag$2:
	      return new Ctor;

	    case symbolTag$1:
	      return cloneSymbol(object);
	  }
	}

	var _initCloneByTag = initCloneByTag$1;

	var isObject$2 = isObject_1;

	/** Built-in value references. */
	var objectCreate = Object.create;

	/**
	 * The base implementation of `_.create` without support for assigning
	 * properties to the created object.
	 *
	 * @private
	 * @param {Object} proto The object to inherit from.
	 * @returns {Object} Returns the new object.
	 */
	var baseCreate$1 = (function() {
	  function object() {}
	  return function(proto) {
	    if (!isObject$2(proto)) {
	      return {};
	    }
	    if (objectCreate) {
	      return objectCreate(proto);
	    }
	    object.prototype = proto;
	    var result = new object;
	    object.prototype = undefined;
	    return result;
	  };
	}());

	var _baseCreate = baseCreate$1;

	var baseCreate = _baseCreate,
	    getPrototype$1 = _getPrototype,
	    isPrototype = _isPrototype;

	/**
	 * Initializes an object clone.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneObject$1(object) {
	  return (typeof object.constructor == 'function' && !isPrototype(object))
	    ? baseCreate(getPrototype$1(object))
	    : {};
	}

	var _initCloneObject = initCloneObject$1;

	var getTag$2 = _getTag,
	    isObjectLike$2 = isObjectLike_1;

	/** `Object#toString` result references. */
	var mapTag$1 = '[object Map]';

	/**
	 * The base implementation of `_.isMap` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
	 */
	function baseIsMap$1(value) {
	  return isObjectLike$2(value) && getTag$2(value) == mapTag$1;
	}

	var _baseIsMap = baseIsMap$1;

	var baseIsMap = _baseIsMap,
	    baseUnary$1 = _baseUnary,
	    nodeUtil$1 = _nodeUtil.exports;

	/* Node.js helper references. */
	var nodeIsMap = nodeUtil$1 && nodeUtil$1.isMap;

	/**
	 * Checks if `value` is classified as a `Map` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
	 * @example
	 *
	 * _.isMap(new Map);
	 * // => true
	 *
	 * _.isMap(new WeakMap);
	 * // => false
	 */
	var isMap$1 = nodeIsMap ? baseUnary$1(nodeIsMap) : baseIsMap;

	var isMap_1 = isMap$1;

	var getTag$1 = _getTag,
	    isObjectLike$1 = isObjectLike_1;

	/** `Object#toString` result references. */
	var setTag$1 = '[object Set]';

	/**
	 * The base implementation of `_.isSet` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
	 */
	function baseIsSet$1(value) {
	  return isObjectLike$1(value) && getTag$1(value) == setTag$1;
	}

	var _baseIsSet = baseIsSet$1;

	var baseIsSet = _baseIsSet,
	    baseUnary = _baseUnary,
	    nodeUtil = _nodeUtil.exports;

	/* Node.js helper references. */
	var nodeIsSet = nodeUtil && nodeUtil.isSet;

	/**
	 * Checks if `value` is classified as a `Set` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
	 * @example
	 *
	 * _.isSet(new Set);
	 * // => true
	 *
	 * _.isSet(new WeakSet);
	 * // => false
	 */
	var isSet$1 = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

	var isSet_1 = isSet$1;

	var Stack = _Stack,
	    arrayEach = _arrayEach,
	    assignValue$1 = _assignValue,
	    baseAssign = _baseAssign,
	    baseAssignIn = _baseAssignIn,
	    cloneBuffer = _cloneBuffer.exports,
	    copyArray = _copyArray,
	    copySymbols = _copySymbols,
	    copySymbolsIn = _copySymbolsIn,
	    getAllKeys = _getAllKeys,
	    getAllKeysIn$1 = _getAllKeysIn,
	    getTag = _getTag,
	    initCloneArray = _initCloneArray,
	    initCloneByTag = _initCloneByTag,
	    initCloneObject = _initCloneObject,
	    isArray$4 = isArray_1,
	    isBuffer = isBuffer$2.exports,
	    isMap = isMap_1,
	    isObject$1 = isObject_1,
	    isSet = isSet_1,
	    keys = keys_1,
	    keysIn = keysIn_1;

	/** Used to compose bitmasks for cloning. */
	var CLONE_DEEP_FLAG$1 = 1,
	    CLONE_FLAT_FLAG$1 = 2,
	    CLONE_SYMBOLS_FLAG$1 = 4;

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag$1 = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    symbolTag = '[object Symbol]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/** Used to identify `toStringTag` values supported by `_.clone`. */
	var cloneableTags = {};
	cloneableTags[argsTag] = cloneableTags[arrayTag] =
	cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
	cloneableTags[boolTag] = cloneableTags[dateTag] =
	cloneableTags[float32Tag] = cloneableTags[float64Tag] =
	cloneableTags[int8Tag] = cloneableTags[int16Tag] =
	cloneableTags[int32Tag] = cloneableTags[mapTag] =
	cloneableTags[numberTag] = cloneableTags[objectTag$1] =
	cloneableTags[regexpTag] = cloneableTags[setTag] =
	cloneableTags[stringTag] = cloneableTags[symbolTag] =
	cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
	cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
	cloneableTags[errorTag] = cloneableTags[funcTag] =
	cloneableTags[weakMapTag] = false;

	/**
	 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
	 * traversed objects.
	 *
	 * @private
	 * @param {*} value The value to clone.
	 * @param {boolean} bitmask The bitmask flags.
	 *  1 - Deep clone
	 *  2 - Flatten inherited properties
	 *  4 - Clone symbols
	 * @param {Function} [customizer] The function to customize cloning.
	 * @param {string} [key] The key of `value`.
	 * @param {Object} [object] The parent object of `value`.
	 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
	 * @returns {*} Returns the cloned value.
	 */
	function baseClone$1(value, bitmask, customizer, key, object, stack) {
	  var result,
	      isDeep = bitmask & CLONE_DEEP_FLAG$1,
	      isFlat = bitmask & CLONE_FLAT_FLAG$1,
	      isFull = bitmask & CLONE_SYMBOLS_FLAG$1;

	  if (customizer) {
	    result = object ? customizer(value, key, object, stack) : customizer(value);
	  }
	  if (result !== undefined) {
	    return result;
	  }
	  if (!isObject$1(value)) {
	    return value;
	  }
	  var isArr = isArray$4(value);
	  if (isArr) {
	    result = initCloneArray(value);
	    if (!isDeep) {
	      return copyArray(value, result);
	    }
	  } else {
	    var tag = getTag(value),
	        isFunc = tag == funcTag || tag == genTag;

	    if (isBuffer(value)) {
	      return cloneBuffer(value, isDeep);
	    }
	    if (tag == objectTag$1 || tag == argsTag || (isFunc && !object)) {
	      result = (isFlat || isFunc) ? {} : initCloneObject(value);
	      if (!isDeep) {
	        return isFlat
	          ? copySymbolsIn(value, baseAssignIn(result, value))
	          : copySymbols(value, baseAssign(result, value));
	      }
	    } else {
	      if (!cloneableTags[tag]) {
	        return object ? value : {};
	      }
	      result = initCloneByTag(value, tag, isDeep);
	    }
	  }
	  // Check for circular references and return its corresponding clone.
	  stack || (stack = new Stack);
	  var stacked = stack.get(value);
	  if (stacked) {
	    return stacked;
	  }
	  stack.set(value, result);

	  if (isSet(value)) {
	    value.forEach(function(subValue) {
	      result.add(baseClone$1(subValue, bitmask, customizer, subValue, value, stack));
	    });
	  } else if (isMap(value)) {
	    value.forEach(function(subValue, key) {
	      result.set(key, baseClone$1(subValue, bitmask, customizer, key, value, stack));
	    });
	  }

	  var keysFunc = isFull
	    ? (isFlat ? getAllKeysIn$1 : getAllKeys)
	    : (isFlat ? keysIn : keys);

	  var props = isArr ? undefined : keysFunc(value);
	  arrayEach(props || value, function(subValue, key) {
	    if (props) {
	      key = subValue;
	      subValue = value[key];
	    }
	    // Recursively populate clone (susceptible to call stack limits).
	    assignValue$1(result, key, baseClone$1(subValue, bitmask, customizer, key, value, stack));
	  });
	  return result;
	}

	var _baseClone = baseClone$1;

	/**
	 * This method returns the first argument it receives.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 *
	 * ////console.log(_.identity(object) === object);
	 * // => true
	 */

	function identity$1(value) {
	  return value;
	}

	var identity_1 = identity$1;

	var isArray$3 = isArray_1,
	    isSymbol$1 = isSymbol_1;

	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/;

	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey$1(value, object) {
	  if (isArray$3(value)) {
	    return false;
	  }
	  var type = typeof value;
	  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
	      value == null || isSymbol$1(value)) {
	    return true;
	  }
	  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
	    (object != null && value in Object(object));
	}

	var _isKey = isKey$1;

	var MapCache = _MapCache;

	/** Error message constants. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/**
	 * Creates a function that memoizes the result of `func`. If `resolver` is
	 * provided, it determines the cache key for storing the result based on the
	 * arguments provided to the memoized function. By default, the first argument
	 * provided to the memoized function is used as the map cache key. The `func`
	 * is invoked with the `this` binding of the memoized function.
	 *
	 * **Note:** The cache is exposed as the `cache` property on the memoized
	 * function. Its creation may be customized by replacing the `_.memoize.Cache`
	 * constructor with one whose instances implement the
	 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
	 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to have its output memoized.
	 * @param {Function} [resolver] The function to resolve the cache key.
	 * @returns {Function} Returns the new memoized function.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': 2 };
	 * var other = { 'c': 3, 'd': 4 };
	 *
	 * var values = _.memoize(_.values);
	 * values(object);
	 * // => [1, 2]
	 *
	 * values(other);
	 * // => [3, 4]
	 *
	 * object.a = 2;
	 * values(object);
	 * // => [1, 2]
	 *
	 * // Modify the result cache.
	 * values.cache.set(object, ['a', 'b']);
	 * values(object);
	 * // => ['a', 'b']
	 *
	 * // Replace `_.memoize.Cache`.
	 * _.memoize.Cache = WeakMap;
	 */
	function memoize$1(func, resolver) {
	  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  var memoized = function() {
	    var args = arguments,
	        key = resolver ? resolver.apply(this, args) : args[0],
	        cache = memoized.cache;

	    if (cache.has(key)) {
	      return cache.get(key);
	    }
	    var result = func.apply(this, args);
	    memoized.cache = cache.set(key, result) || cache;
	    return result;
	  };
	  memoized.cache = new (memoize$1.Cache || MapCache);
	  return memoized;
	}

	// Expose `MapCache`.
	memoize$1.Cache = MapCache;

	var memoize_1 = memoize$1;

	var memoize = memoize_1;

	/** Used as the maximum memoize cache size. */
	var MAX_MEMOIZE_SIZE = 500;

	/**
	 * A specialized version of `_.memoize` which clears the memoized function's
	 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
	 *
	 * @private
	 * @param {Function} func The function to have its output memoized.
	 * @returns {Function} Returns the new memoized function.
	 */
	function memoizeCapped$1(func) {
	  var result = memoize(func, function(key) {
	    if (cache.size === MAX_MEMOIZE_SIZE) {
	      cache.clear();
	    }
	    return key;
	  });

	  var cache = result.cache;
	  return result;
	}

	var _memoizeCapped = memoizeCapped$1;

	var memoizeCapped = _memoizeCapped;

	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;

	/**
	 * Converts `string` to a property path array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the property path array.
	 */
	var stringToPath$1 = memoizeCapped(function(string) {
	  var result = [];
	  if (string.charCodeAt(0) === 46 /* . */) {
	    result.push('');
	  }
	  string.replace(rePropName, function(match, number, quote, subString) {
	    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	});

	var _stringToPath = stringToPath$1;

	var isArray$2 = isArray_1,
	    isKey = _isKey,
	    stringToPath = _stringToPath,
	    toString = toString_1;

	/**
	 * Casts `value` to a path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {Array} Returns the cast property path array.
	 */
	function castPath$6(value, object) {
	  if (isArray$2(value)) {
	    return value;
	  }
	  return isKey(value, object) ? [value] : stringToPath(toString(value));
	}

	var _castPath = castPath$6;

	/**
	 * Gets the last element of `array`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Array
	 * @param {Array} array The array to query.
	 * @returns {*} Returns the last element of `array`.
	 * @example
	 *
	 * _.last([1, 2, 3]);
	 * // => 3
	 */

	function last$1(array) {
	  var length = array == null ? 0 : array.length;
	  return length ? array[length - 1] : undefined;
	}

	var last_1 = last$1;

	var isSymbol = isSymbol_1;

	/** Used as references for various `Number` constants. */
	var INFINITY$1 = 1 / 0;

	/**
	 * Converts `value` to a string key if it's not a string or symbol.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {string|symbol} Returns the key.
	 */
	function toKey$4(value) {
	  if (typeof value == 'string' || isSymbol(value)) {
	    return value;
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
	}

	var _toKey = toKey$4;

	var castPath$5 = _castPath,
	    toKey$3 = _toKey;

	/**
	 * The base implementation of `_.get` without support for default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet$2(object, path) {
	  path = castPath$5(path, object);

	  var index = 0,
	      length = path.length;

	  while (object != null && index < length) {
	    object = object[toKey$3(path[index++])];
	  }
	  return (index && index == length) ? object : undefined;
	}

	var _baseGet = baseGet$2;

	var baseGet$1 = _baseGet,
	    baseSlice = _baseSlice;

	/**
	 * Gets the parent value at `path` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array} path The path to get the parent value of.
	 * @returns {*} Returns the parent value.
	 */
	function parent$1(object, path) {
	  return path.length < 2 ? object : baseGet$1(object, baseSlice(path, 0, -1));
	}

	var _parent = parent$1;

	var castPath$4 = _castPath,
	    last = last_1,
	    parent = _parent,
	    toKey$2 = _toKey;

	/**
	 * The base implementation of `_.unset`.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {Array|string} path The property path to unset.
	 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
	 */
	function baseUnset$1(object, path) {
	  path = castPath$4(path, object);
	  object = parent(object, path);
	  return object == null || delete object[toKey$2(last(path))];
	}

	var _baseUnset = baseUnset$1;

	var baseGetTag = _baseGetTag,
	    getPrototype = _getPrototype,
	    isObjectLike = isObjectLike_1;

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject$1(value) {
	  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
	    funcToString.call(Ctor) == objectCtorString;
	}

	var isPlainObject_1 = isPlainObject$1;

	var isPlainObject = isPlainObject_1;

	/**
	 * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
	 * objects.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @param {string} key The key of the property to inspect.
	 * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
	 */
	function customOmitClone$1(value) {
	  return isPlainObject(value) ? undefined : value;
	}

	var _customOmitClone = customOmitClone$1;

	var Symbol$1 = _Symbol,
	    isArguments$1 = isArguments_1,
	    isArray$1 = isArray_1;

	/** Built-in value references. */
	var spreadableSymbol = Symbol$1 ? Symbol$1.isConcatSpreadable : undefined;

	/**
	 * Checks if `value` is a flattenable `arguments` object or array.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
	 */
	function isFlattenable$1(value) {
	  return isArray$1(value) || isArguments$1(value) ||
	    !!(spreadableSymbol && value && value[spreadableSymbol]);
	}

	var _isFlattenable = isFlattenable$1;

	var arrayPush = _arrayPush,
	    isFlattenable = _isFlattenable;

	/**
	 * The base implementation of `_.flatten` with support for restricting flattening.
	 *
	 * @private
	 * @param {Array} array The array to flatten.
	 * @param {number} depth The maximum recursion depth.
	 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
	 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
	 * @param {Array} [result=[]] The initial result value.
	 * @returns {Array} Returns the new flattened array.
	 */
	function baseFlatten$1(array, depth, predicate, isStrict, result) {
	  var index = -1,
	      length = array.length;

	  predicate || (predicate = isFlattenable);
	  result || (result = []);

	  while (++index < length) {
	    var value = array[index];
	    if (depth > 0 && predicate(value)) {
	      if (depth > 1) {
	        // Recursively flatten arrays (susceptible to call stack limits).
	        baseFlatten$1(value, depth - 1, predicate, isStrict, result);
	      } else {
	        arrayPush(result, value);
	      }
	    } else if (!isStrict) {
	      result[result.length] = value;
	    }
	  }
	  return result;
	}

	var _baseFlatten = baseFlatten$1;

	var baseFlatten = _baseFlatten;

	/**
	 * Flattens `array` a single level deep.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Array
	 * @param {Array} array The array to flatten.
	 * @returns {Array} Returns the new flattened array.
	 * @example
	 *
	 * _.flatten([1, [2, [3, [4]], 5]]);
	 * // => [1, 2, [3, [4]], 5]
	 */
	function flatten$1(array) {
	  var length = array == null ? 0 : array.length;
	  return length ? baseFlatten(array, 1) : [];
	}

	var flatten_1 = flatten$1;

	/**
	 * A faster alternative to `Function#apply`, this function invokes `func`
	 * with the `this` binding of `thisArg` and the arguments of `args`.
	 *
	 * @private
	 * @param {Function} func The function to invoke.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} args The arguments to invoke `func` with.
	 * @returns {*} Returns the result of `func`.
	 */

	function apply$1(func, thisArg, args) {
	  switch (args.length) {
	    case 0: return func.call(thisArg);
	    case 1: return func.call(thisArg, args[0]);
	    case 2: return func.call(thisArg, args[0], args[1]);
	    case 3: return func.call(thisArg, args[0], args[1], args[2]);
	  }
	  return func.apply(thisArg, args);
	}

	var _apply = apply$1;

	var apply = _apply;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;

	/**
	 * A specialized version of `baseRest` which transforms the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @param {Function} transform The rest array transform.
	 * @returns {Function} Returns the new function.
	 */
	function overRest$1(func, start, transform) {
	  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        array = Array(length);

	    while (++index < length) {
	      array[index] = args[start + index];
	    }
	    index = -1;
	    var otherArgs = Array(start + 1);
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = transform(array);
	    return apply(func, this, otherArgs);
	  };
	}

	var _overRest = overRest$1;

	/**
	 * Creates a function that returns `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {*} value The value to return from the new function.
	 * @returns {Function} Returns the new constant function.
	 * @example
	 *
	 * var objects = _.times(2, _.constant({ 'a': 1 }));
	 *
	 * ////console.log(objects);
	 * // => [{ 'a': 1 }, { 'a': 1 }]
	 *
	 * ////console.log(objects[0] === objects[1]);
	 * // => true
	 */

	function constant$1(value) {
	  return function() {
	    return value;
	  };
	}

	var constant_1 = constant$1;

	var constant = constant_1,
	    defineProperty = _defineProperty,
	    identity = identity_1;

	/**
	 * The base implementation of `setToString` without support for hot loop shorting.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var baseSetToString$1 = !defineProperty ? identity : function(func, string) {
	  return defineProperty(func, 'toString', {
	    'configurable': true,
	    'enumerable': false,
	    'value': constant(string),
	    'writable': true
	  });
	};

	var _baseSetToString = baseSetToString$1;

	/** Used to detect hot functions by number of calls within a span of milliseconds. */

	var HOT_COUNT = 800,
	    HOT_SPAN = 16;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeNow = Date.now;

	/**
	 * Creates a function that'll short out and invoke `identity` instead
	 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
	 * milliseconds.
	 *
	 * @private
	 * @param {Function} func The function to restrict.
	 * @returns {Function} Returns the new shortable function.
	 */
	function shortOut$1(func) {
	  var count = 0,
	      lastCalled = 0;

	  return function() {
	    var stamp = nativeNow(),
	        remaining = HOT_SPAN - (stamp - lastCalled);

	    lastCalled = stamp;
	    if (remaining > 0) {
	      if (++count >= HOT_COUNT) {
	        return arguments[0];
	      }
	    } else {
	      count = 0;
	    }
	    return func.apply(undefined, arguments);
	  };
	}

	var _shortOut = shortOut$1;

	var baseSetToString = _baseSetToString,
	    shortOut = _shortOut;

	/**
	 * Sets the `toString` method of `func` to return `string`.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var setToString$1 = shortOut(baseSetToString);

	var _setToString = setToString$1;

	var flatten = flatten_1,
	    overRest = _overRest,
	    setToString = _setToString;

	/**
	 * A specialized version of `baseRest` which flattens the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @returns {Function} Returns the new function.
	 */
	function flatRest$2(func) {
	  return setToString(overRest(func, undefined, flatten), func + '');
	}

	var _flatRest = flatRest$2;

	var arrayMap = _arrayMap,
	    baseClone = _baseClone,
	    baseUnset = _baseUnset,
	    castPath$3 = _castPath,
	    copyObject = _copyObject,
	    customOmitClone = _customOmitClone,
	    flatRest$1 = _flatRest,
	    getAllKeysIn = _getAllKeysIn;

	/** Used to compose bitmasks for cloning. */
	var CLONE_DEEP_FLAG = 1,
	    CLONE_FLAT_FLAG = 2,
	    CLONE_SYMBOLS_FLAG = 4;

	/**
	 * The opposite of `_.pick`; this method creates an object composed of the
	 * own and inherited enumerable property paths of `object` that are not omitted.
	 *
	 * **Note:** This method is considerably slower than `_.pick`.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The source object.
	 * @param {...(string|string[])} [paths] The property paths to omit.
	 * @returns {Object} Returns the new object.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': '2', 'c': 3 };
	 *
	 * _.omit(object, ['a', 'c']);
	 * // => { 'b': '2' }
	 */
	flatRest$1(function(object, paths) {
	  var result = {};
	  if (object == null) {
	    return result;
	  }
	  var isDeep = false;
	  paths = arrayMap(paths, function(path) {
	    path = castPath$3(path, object);
	    isDeep || (isDeep = path.length > 1);
	    return path;
	  });
	  copyObject(object, getAllKeysIn(object), result);
	  if (isDeep) {
	    result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
	  }
	  var length = paths.length;
	  while (length--) {
	    baseUnset(result, paths[length]);
	  }
	  return result;
	});

	var assignValue = _assignValue,
	    castPath$2 = _castPath,
	    isIndex$1 = _isIndex,
	    isObject = isObject_1,
	    toKey$1 = _toKey;

	/**
	 * The base implementation of `_.set`.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {Array|string} path The path of the property to set.
	 * @param {*} value The value to set.
	 * @param {Function} [customizer] The function to customize path creation.
	 * @returns {Object} Returns `object`.
	 */
	function baseSet$1(object, path, value, customizer) {
	  if (!isObject(object)) {
	    return object;
	  }
	  path = castPath$2(path, object);

	  var index = -1,
	      length = path.length,
	      lastIndex = length - 1,
	      nested = object;

	  while (nested != null && ++index < length) {
	    var key = toKey$1(path[index]),
	        newValue = value;

	    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
	      return object;
	    }

	    if (index != lastIndex) {
	      var objValue = nested[key];
	      newValue = customizer ? customizer(objValue, key, nested) : undefined;
	      if (newValue === undefined) {
	        newValue = isObject(objValue)
	          ? objValue
	          : (isIndex$1(path[index + 1]) ? [] : {});
	      }
	    }
	    assignValue(nested, key, newValue);
	    nested = nested[key];
	  }
	  return object;
	}

	var _baseSet = baseSet$1;

	var baseGet = _baseGet,
	    baseSet = _baseSet,
	    castPath$1 = _castPath;

	/**
	 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The source object.
	 * @param {string[]} paths The property paths to pick.
	 * @param {Function} predicate The function invoked per property.
	 * @returns {Object} Returns the new object.
	 */
	function basePickBy$1(object, paths, predicate) {
	  var index = -1,
	      length = paths.length,
	      result = {};

	  while (++index < length) {
	    var path = paths[index],
	        value = baseGet(object, path);

	    if (predicate(value, path)) {
	      baseSet(result, castPath$1(path, object), value);
	    }
	  }
	  return result;
	}

	var _basePickBy = basePickBy$1;

	/**
	 * The base implementation of `_.hasIn` without support for deep paths.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {Array|string} key The key to check.
	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
	 */

	function baseHasIn$1(object, key) {
	  return object != null && key in Object(object);
	}

	var _baseHasIn = baseHasIn$1;

	var castPath = _castPath,
	    isArguments = isArguments_1,
	    isArray = isArray_1,
	    isIndex = _isIndex,
	    isLength = isLength_1,
	    toKey = _toKey;

	/**
	 * Checks if `path` exists on `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @param {Function} hasFunc The function to check properties.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 */
	function hasPath$1(object, path, hasFunc) {
	  path = castPath(path, object);

	  var index = -1,
	      length = path.length,
	      result = false;

	  while (++index < length) {
	    var key = toKey(path[index]);
	    if (!(result = object != null && hasFunc(object, key))) {
	      break;
	    }
	    object = object[key];
	  }
	  if (result || ++index != length) {
	    return result;
	  }
	  length = object == null ? 0 : object.length;
	  return !!length && isLength(length) && isIndex(key, length) &&
	    (isArray(object) || isArguments(object));
	}

	var _hasPath = hasPath$1;

	var baseHasIn = _baseHasIn,
	    hasPath = _hasPath;

	/**
	 * Checks if `path` is a direct or inherited property of `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 * @example
	 *
	 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
	 *
	 * _.hasIn(object, 'a');
	 * // => true
	 *
	 * _.hasIn(object, 'a.b');
	 * // => true
	 *
	 * _.hasIn(object, ['a', 'b']);
	 * // => true
	 *
	 * _.hasIn(object, 'b');
	 * // => false
	 */
	function hasIn$1(object, path) {
	  return object != null && hasPath(object, path, baseHasIn);
	}

	var hasIn_1 = hasIn$1;

	var basePickBy = _basePickBy,
	    hasIn = hasIn_1;

	/**
	 * The base implementation of `_.pick` without support for individual
	 * property identifiers.
	 *
	 * @private
	 * @param {Object} object The source object.
	 * @param {string[]} paths The property paths to pick.
	 * @returns {Object} Returns the new object.
	 */
	function basePick$1(object, paths) {
	  return basePickBy(object, paths, function(value, path) {
	    return hasIn(object, path);
	  });
	}

	var _basePick = basePick$1;

	var basePick = _basePick,
	    flatRest = _flatRest;

	/**
	 * Creates an object composed of the picked `object` properties.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The source object.
	 * @param {...(string|string[])} [paths] The property paths to pick.
	 * @returns {Object} Returns the new object.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': '2', 'c': 3 };
	 *
	 * _.pick(object, ['a', 'c']);
	 * // => { 'a': 1, 'c': 3 }
	 */
	flatRest(function(object, paths) {
	  return object == null ? {} : basePick(object, paths);
	});

	/**
	 * This method returns `undefined`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.3.0
	 * @category Util
	 * @example
	 *
	 * _.times(2, _.noop);
	 * // => [undefined, undefined]
	 */

	function noop$1() {
	  // No operation performed.
	}

	var noop_1 = noop$1;

	/**
	 * Converts `set` to an array of its values.
	 *
	 * @private
	 * @param {Object} set The set to convert.
	 * @returns {Array} Returns the values.
	 */

	function setToArray$1(set) {
	  var index = -1,
	      result = Array(set.size);

	  set.forEach(function(value) {
	    result[++index] = value;
	  });
	  return result;
	}

	var _setToArray = setToArray$1;

	var Set = _Set,
	    noop = noop_1,
	    setToArray = _setToArray;

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/**
	 * Creates a set object of `values`.
	 *
	 * @private
	 * @param {Array} values The values to add to the set.
	 * @returns {Object} Returns the new set.
	 */
	!(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
	  return new Set(values);
	};

	/**
	 * Datart
	 *
	 * Copyright 2021
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	function isUndefined(o) {
	    return o === undefined;
	}
	function isEmpty(o) {
	    return o === null || isUndefined(o);
	}
	function IsKeyIn(o, key) {
	    return !!o && typeof o === 'object' && key in o;
	}
	function isEmptyArray(value) {
	    if (isEmpty(value)) {
	        return true;
	    }
	    return Array.isArray(value) && !(value === null || value === void 0 ? void 0 : value.length);
	}

	// spacing
	// base color
	var BLUE = '#1B9AEE';
	/* gray
	 *
	 * as reference
	 * G10 - body background
	 * G20 - split line light
	 * G30 - split line dark
	 * G40 - border
	 * G50 - disabled font
	 * G60 - light font
	 * G70 - secondary font
	 * G80 - font
	 */
	var WHITE = '#FFFFFF';
	var G90 = '#212529';
	// theme color
	var PRIMARY = BLUE;
	var FONT_FAMILY = '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

	/**
	 * Datart
	 *
	 * Copyright 2021
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var _a$2;
	var StorageKeys;
	(function (StorageKeys) {
	    StorageKeys["AuthorizationToken"] = "AUTHORIZATION_TOKEN";
	    StorageKeys["LoggedInUser"] = "LOGGED_IN_USER";
	    StorageKeys["ShareClientId"] = "SHARE_CLIENT_ID";
	})(StorageKeys || (StorageKeys = {}));
	var CommonFormTypes;
	(function (CommonFormTypes) {
	    CommonFormTypes["Add"] = "add";
	    CommonFormTypes["Edit"] = "edit";
	})(CommonFormTypes || (CommonFormTypes = {}));
	(_a$2 = {},
	    _a$2[CommonFormTypes.Add] = '新建',
	    _a$2[CommonFormTypes.Edit] = '编辑',
	    _a$2);
	var RECOMMEND_TIME = {
	    TODAY: 'today',
	    YESTERDAY: 'yesterday',
	    THISWEEK: 'this_week',
	    LAST_7_DAYS: 'last_7_days',
	    LAST_30_DAYS: 'last_30_days',
	    LAST_90_DAYS: 'last_90_days',
	    LAST_1_MONTH: 'last_1_month',
	    LAST_1_YEAR: 'last_1_year',
	};
	var FilterSqlOperator;
	(function (FilterSqlOperator) {
	    FilterSqlOperator["Equal"] = "EQ";
	    FilterSqlOperator["NotEqual"] = "NE";
	    FilterSqlOperator["Null"] = "IS_NULL";
	    FilterSqlOperator["NotNull"] = "NOT_NULL";
	    FilterSqlOperator["Contain"] = "LIKE";
	    FilterSqlOperator["NotContain"] = "NOT_LIKE";
	    FilterSqlOperator["PrefixContain"] = "PREFIX_LIKE";
	    FilterSqlOperator["NotPrefixContain"] = "PREFIX_NOT_LIKE";
	    FilterSqlOperator["SuffixContain"] = "SUFFIX_LIKE";
	    FilterSqlOperator["NotSuffixContain"] = "SUFFIX_NOT_LIKE";
	    FilterSqlOperator["Between"] = "BETWEEN";
	    FilterSqlOperator["In"] = "IN";
	    FilterSqlOperator["NotIn"] = "NOT_IN";
	    FilterSqlOperator["LessThan"] = "LT";
	    FilterSqlOperator["GreaterThan"] = "GT";
	    FilterSqlOperator["LessThanOrEqual"] = "LTE";
	    FilterSqlOperator["GreaterThanOrEqual"] = "GTE";
	})(FilterSqlOperator || (FilterSqlOperator = {}));
	var FILTER_TIME_FORMATTER_IN_QUERY = 'yyyy-MM-DD HH:mm:ss';
	var NumberUnitKey;
	(function (NumberUnitKey) {
	    NumberUnitKey["None"] = "none";
	    // English Unit
	    NumberUnitKey["Thousand"] = "thousand";
	    NumberUnitKey["Million"] = "million";
	    NumberUnitKey["Billion"] = "billion";
	    // Chinese Unit
	    NumberUnitKey["Wan"] = "wan";
	    NumberUnitKey["Yi"] = "yi";
	})(NumberUnitKey || (NumberUnitKey = {}));
	new Map([
	    [NumberUnitKey.None, [1, '']],
	    [NumberUnitKey.Thousand, [Math.pow(10, 3), 'K']],
	    [NumberUnitKey.Million, [Math.pow(10, 6), 'M']],
	    [NumberUnitKey.Billion, [Math.pow(10, 10), 'B']],
	    [NumberUnitKey.Wan, [Math.pow(10, 4), '万']],
	    [NumberUnitKey.Yi, [Math.pow(10, 8), '亿']],
	]);

	var root = _root;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	root.isFinite;

	var moment$1 = {exports: {}};

	(function (module, exports) {
	(function (global, factory) {
	    module.exports = factory() ;
	}(commonjsGlobal, (function () {
	    var hookCallback;

	    function hooks() {
	        return hookCallback.apply(null, arguments);
	    }

	    // This is done to register the method called with moment()
	    // without creating circular dependencies.
	    function setHookCallback(callback) {
	        hookCallback = callback;
	    }

	    function isArray(input) {
	        return (
	            input instanceof Array ||
	            Object.prototype.toString.call(input) === '[object Array]'
	        );
	    }

	    function isObject(input) {
	        // IE8 will treat undefined and null as object if it wasn't for
	        // input != null
	        return (
	            input != null &&
	            Object.prototype.toString.call(input) === '[object Object]'
	        );
	    }

	    function hasOwnProp(a, b) {
	        return Object.prototype.hasOwnProperty.call(a, b);
	    }

	    function isObjectEmpty(obj) {
	        if (Object.getOwnPropertyNames) {
	            return Object.getOwnPropertyNames(obj).length === 0;
	        } else {
	            var k;
	            for (k in obj) {
	                if (hasOwnProp(obj, k)) {
	                    return false;
	                }
	            }
	            return true;
	        }
	    }

	    function isUndefined(input) {
	        return input === void 0;
	    }

	    function isNumber(input) {
	        return (
	            typeof input === 'number' ||
	            Object.prototype.toString.call(input) === '[object Number]'
	        );
	    }

	    function isDate(input) {
	        return (
	            input instanceof Date ||
	            Object.prototype.toString.call(input) === '[object Date]'
	        );
	    }

	    function map(arr, fn) {
	        var res = [],
	            i;
	        for (i = 0; i < arr.length; ++i) {
	            res.push(fn(arr[i], i));
	        }
	        return res;
	    }

	    function extend(a, b) {
	        for (var i in b) {
	            if (hasOwnProp(b, i)) {
	                a[i] = b[i];
	            }
	        }

	        if (hasOwnProp(b, 'toString')) {
	            a.toString = b.toString;
	        }

	        if (hasOwnProp(b, 'valueOf')) {
	            a.valueOf = b.valueOf;
	        }

	        return a;
	    }

	    function createUTC(input, format, locale, strict) {
	        return createLocalOrUTC(input, format, locale, strict, true).utc();
	    }

	    function defaultParsingFlags() {
	        // We need to deep clone this object.
	        return {
	            empty: false,
	            unusedTokens: [],
	            unusedInput: [],
	            overflow: -2,
	            charsLeftOver: 0,
	            nullInput: false,
	            invalidEra: null,
	            invalidMonth: null,
	            invalidFormat: false,
	            userInvalidated: false,
	            iso: false,
	            parsedDateParts: [],
	            era: null,
	            meridiem: null,
	            rfc2822: false,
	            weekdayMismatch: false,
	        };
	    }

	    function getParsingFlags(m) {
	        if (m._pf == null) {
	            m._pf = defaultParsingFlags();
	        }
	        return m._pf;
	    }

	    var some;
	    if (Array.prototype.some) {
	        some = Array.prototype.some;
	    } else {
	        some = function (fun) {
	            var t = Object(this),
	                len = t.length >>> 0,
	                i;

	            for (i = 0; i < len; i++) {
	                if (i in t && fun.call(this, t[i], i, t)) {
	                    return true;
	                }
	            }

	            return false;
	        };
	    }

	    function isValid(m) {
	        if (m._isValid == null) {
	            var flags = getParsingFlags(m),
	                parsedParts = some.call(flags.parsedDateParts, function (i) {
	                    return i != null;
	                }),
	                isNowValid =
	                    !isNaN(m._d.getTime()) &&
	                    flags.overflow < 0 &&
	                    !flags.empty &&
	                    !flags.invalidEra &&
	                    !flags.invalidMonth &&
	                    !flags.invalidWeekday &&
	                    !flags.weekdayMismatch &&
	                    !flags.nullInput &&
	                    !flags.invalidFormat &&
	                    !flags.userInvalidated &&
	                    (!flags.meridiem || (flags.meridiem && parsedParts));

	            if (m._strict) {
	                isNowValid =
	                    isNowValid &&
	                    flags.charsLeftOver === 0 &&
	                    flags.unusedTokens.length === 0 &&
	                    flags.bigHour === undefined;
	            }

	            if (Object.isFrozen == null || !Object.isFrozen(m)) {
	                m._isValid = isNowValid;
	            } else {
	                return isNowValid;
	            }
	        }
	        return m._isValid;
	    }

	    function createInvalid(flags) {
	        var m = createUTC(NaN);
	        if (flags != null) {
	            extend(getParsingFlags(m), flags);
	        } else {
	            getParsingFlags(m).userInvalidated = true;
	        }

	        return m;
	    }

	    // Plugins that add properties should also add the key here (null value),
	    // so we can properly clone ourselves.
	    var momentProperties = (hooks.momentProperties = []),
	        updateInProgress = false;

	    function copyConfig(to, from) {
	        var i, prop, val;

	        if (!isUndefined(from._isAMomentObject)) {
	            to._isAMomentObject = from._isAMomentObject;
	        }
	        if (!isUndefined(from._i)) {
	            to._i = from._i;
	        }
	        if (!isUndefined(from._f)) {
	            to._f = from._f;
	        }
	        if (!isUndefined(from._l)) {
	            to._l = from._l;
	        }
	        if (!isUndefined(from._strict)) {
	            to._strict = from._strict;
	        }
	        if (!isUndefined(from._tzm)) {
	            to._tzm = from._tzm;
	        }
	        if (!isUndefined(from._isUTC)) {
	            to._isUTC = from._isUTC;
	        }
	        if (!isUndefined(from._offset)) {
	            to._offset = from._offset;
	        }
	        if (!isUndefined(from._pf)) {
	            to._pf = getParsingFlags(from);
	        }
	        if (!isUndefined(from._locale)) {
	            to._locale = from._locale;
	        }

	        if (momentProperties.length > 0) {
	            for (i = 0; i < momentProperties.length; i++) {
	                prop = momentProperties[i];
	                val = from[prop];
	                if (!isUndefined(val)) {
	                    to[prop] = val;
	                }
	            }
	        }

	        return to;
	    }

	    // Moment prototype object
	    function Moment(config) {
	        copyConfig(this, config);
	        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
	        if (!this.isValid()) {
	            this._d = new Date(NaN);
	        }
	        // Prevent infinite loop in case updateOffset creates new moment
	        // objects.
	        if (updateInProgress === false) {
	            updateInProgress = true;
	            hooks.updateOffset(this);
	            updateInProgress = false;
	        }
	    }

	    function isMoment(obj) {
	        return (
	            obj instanceof Moment || (obj != null && obj._isAMomentObject != null)
	        );
	    }

	    function warn(msg) {
	        if (
	            hooks.suppressDeprecationWarnings === false &&
	            typeof console !== 'undefined' &&
	            console.warn
	        ) {
	            console.warn('Deprecation warning: ' + msg);
	        }
	    }

	    function deprecate(msg, fn) {
	        var firstTime = true;

	        return extend(function () {
	            if (hooks.deprecationHandler != null) {
	                hooks.deprecationHandler(null, msg);
	            }
	            if (firstTime) {
	                var args = [],
	                    arg,
	                    i,
	                    key;
	                for (i = 0; i < arguments.length; i++) {
	                    arg = '';
	                    if (typeof arguments[i] === 'object') {
	                        arg += '\n[' + i + '] ';
	                        for (key in arguments[0]) {
	                            if (hasOwnProp(arguments[0], key)) {
	                                arg += key + ': ' + arguments[0][key] + ', ';
	                            }
	                        }
	                        arg = arg.slice(0, -2); // Remove trailing comma and space
	                    } else {
	                        arg = arguments[i];
	                    }
	                    args.push(arg);
	                }
	                warn(
	                    msg +
	                        '\nArguments: ' +
	                        Array.prototype.slice.call(args).join('') +
	                        '\n' +
	                        new Error().stack
	                );
	                firstTime = false;
	            }
	            return fn.apply(this, arguments);
	        }, fn);
	    }

	    var deprecations = {};

	    function deprecateSimple(name, msg) {
	        if (hooks.deprecationHandler != null) {
	            hooks.deprecationHandler(name, msg);
	        }
	        if (!deprecations[name]) {
	            warn(msg);
	            deprecations[name] = true;
	        }
	    }

	    hooks.suppressDeprecationWarnings = false;
	    hooks.deprecationHandler = null;

	    function isFunction(input) {
	        return (
	            (typeof Function !== 'undefined' && input instanceof Function) ||
	            Object.prototype.toString.call(input) === '[object Function]'
	        );
	    }

	    function set(config) {
	        var prop, i;
	        for (i in config) {
	            if (hasOwnProp(config, i)) {
	                prop = config[i];
	                if (isFunction(prop)) {
	                    this[i] = prop;
	                } else {
	                    this['_' + i] = prop;
	                }
	            }
	        }
	        this._config = config;
	        // Lenient ordinal parsing accepts just a number in addition to
	        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
	        // TODO: Remove "ordinalParse" fallback in next major release.
	        this._dayOfMonthOrdinalParseLenient = new RegExp(
	            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
	                '|' +
	                /\d{1,2}/.source
	        );
	    }

	    function mergeConfigs(parentConfig, childConfig) {
	        var res = extend({}, parentConfig),
	            prop;
	        for (prop in childConfig) {
	            if (hasOwnProp(childConfig, prop)) {
	                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
	                    res[prop] = {};
	                    extend(res[prop], parentConfig[prop]);
	                    extend(res[prop], childConfig[prop]);
	                } else if (childConfig[prop] != null) {
	                    res[prop] = childConfig[prop];
	                } else {
	                    delete res[prop];
	                }
	            }
	        }
	        for (prop in parentConfig) {
	            if (
	                hasOwnProp(parentConfig, prop) &&
	                !hasOwnProp(childConfig, prop) &&
	                isObject(parentConfig[prop])
	            ) {
	                // make sure changes to properties don't modify parent config
	                res[prop] = extend({}, res[prop]);
	            }
	        }
	        return res;
	    }

	    function Locale(config) {
	        if (config != null) {
	            this.set(config);
	        }
	    }

	    var keys;

	    if (Object.keys) {
	        keys = Object.keys;
	    } else {
	        keys = function (obj) {
	            var i,
	                res = [];
	            for (i in obj) {
	                if (hasOwnProp(obj, i)) {
	                    res.push(i);
	                }
	            }
	            return res;
	        };
	    }

	    var defaultCalendar = {
	        sameDay: '[Today at] LT',
	        nextDay: '[Tomorrow at] LT',
	        nextWeek: 'dddd [at] LT',
	        lastDay: '[Yesterday at] LT',
	        lastWeek: '[Last] dddd [at] LT',
	        sameElse: 'L',
	    };

	    function calendar(key, mom, now) {
	        var output = this._calendar[key] || this._calendar['sameElse'];
	        return isFunction(output) ? output.call(mom, now) : output;
	    }

	    function zeroFill(number, targetLength, forceSign) {
	        var absNumber = '' + Math.abs(number),
	            zerosToFill = targetLength - absNumber.length,
	            sign = number >= 0;
	        return (
	            (sign ? (forceSign ? '+' : '') : '-') +
	            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) +
	            absNumber
	        );
	    }

	    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
	        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
	        formatFunctions = {},
	        formatTokenFunctions = {};

	    // token:    'M'
	    // padded:   ['MM', 2]
	    // ordinal:  'Mo'
	    // callback: function () { this.month() + 1 }
	    function addFormatToken(token, padded, ordinal, callback) {
	        var func = callback;
	        if (typeof callback === 'string') {
	            func = function () {
	                return this[callback]();
	            };
	        }
	        if (token) {
	            formatTokenFunctions[token] = func;
	        }
	        if (padded) {
	            formatTokenFunctions[padded[0]] = function () {
	                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
	            };
	        }
	        if (ordinal) {
	            formatTokenFunctions[ordinal] = function () {
	                return this.localeData().ordinal(
	                    func.apply(this, arguments),
	                    token
	                );
	            };
	        }
	    }

	    function removeFormattingTokens(input) {
	        if (input.match(/\[[\s\S]/)) {
	            return input.replace(/^\[|\]$/g, '');
	        }
	        return input.replace(/\\/g, '');
	    }

	    function makeFormatFunction(format) {
	        var array = format.match(formattingTokens),
	            i,
	            length;

	        for (i = 0, length = array.length; i < length; i++) {
	            if (formatTokenFunctions[array[i]]) {
	                array[i] = formatTokenFunctions[array[i]];
	            } else {
	                array[i] = removeFormattingTokens(array[i]);
	            }
	        }

	        return function (mom) {
	            var output = '',
	                i;
	            for (i = 0; i < length; i++) {
	                output += isFunction(array[i])
	                    ? array[i].call(mom, format)
	                    : array[i];
	            }
	            return output;
	        };
	    }

	    // format date using native date object
	    function formatMoment(m, format) {
	        if (!m.isValid()) {
	            return m.localeData().invalidDate();
	        }

	        format = expandFormat(format, m.localeData());
	        formatFunctions[format] =
	            formatFunctions[format] || makeFormatFunction(format);

	        return formatFunctions[format](m);
	    }

	    function expandFormat(format, locale) {
	        var i = 5;

	        function replaceLongDateFormatTokens(input) {
	            return locale.longDateFormat(input) || input;
	        }

	        localFormattingTokens.lastIndex = 0;
	        while (i >= 0 && localFormattingTokens.test(format)) {
	            format = format.replace(
	                localFormattingTokens,
	                replaceLongDateFormatTokens
	            );
	            localFormattingTokens.lastIndex = 0;
	            i -= 1;
	        }

	        return format;
	    }

	    var defaultLongDateFormat = {
	        LTS: 'h:mm:ss A',
	        LT: 'h:mm A',
	        L: 'MM/DD/YYYY',
	        LL: 'MMMM D, YYYY',
	        LLL: 'MMMM D, YYYY h:mm A',
	        LLLL: 'dddd, MMMM D, YYYY h:mm A',
	    };

	    function longDateFormat(key) {
	        var format = this._longDateFormat[key],
	            formatUpper = this._longDateFormat[key.toUpperCase()];

	        if (format || !formatUpper) {
	            return format;
	        }

	        this._longDateFormat[key] = formatUpper
	            .match(formattingTokens)
	            .map(function (tok) {
	                if (
	                    tok === 'MMMM' ||
	                    tok === 'MM' ||
	                    tok === 'DD' ||
	                    tok === 'dddd'
	                ) {
	                    return tok.slice(1);
	                }
	                return tok;
	            })
	            .join('');

	        return this._longDateFormat[key];
	    }

	    var defaultInvalidDate = 'Invalid date';

	    function invalidDate() {
	        return this._invalidDate;
	    }

	    var defaultOrdinal = '%d',
	        defaultDayOfMonthOrdinalParse = /\d{1,2}/;

	    function ordinal(number) {
	        return this._ordinal.replace('%d', number);
	    }

	    var defaultRelativeTime = {
	        future: 'in %s',
	        past: '%s ago',
	        s: 'a few seconds',
	        ss: '%d seconds',
	        m: 'a minute',
	        mm: '%d minutes',
	        h: 'an hour',
	        hh: '%d hours',
	        d: 'a day',
	        dd: '%d days',
	        w: 'a week',
	        ww: '%d weeks',
	        M: 'a month',
	        MM: '%d months',
	        y: 'a year',
	        yy: '%d years',
	    };

	    function relativeTime(number, withoutSuffix, string, isFuture) {
	        var output = this._relativeTime[string];
	        return isFunction(output)
	            ? output(number, withoutSuffix, string, isFuture)
	            : output.replace(/%d/i, number);
	    }

	    function pastFuture(diff, output) {
	        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
	        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
	    }

	    var aliases = {};

	    function addUnitAlias(unit, shorthand) {
	        var lowerCase = unit.toLowerCase();
	        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
	    }

	    function normalizeUnits(units) {
	        return typeof units === 'string'
	            ? aliases[units] || aliases[units.toLowerCase()]
	            : undefined;
	    }

	    function normalizeObjectUnits(inputObject) {
	        var normalizedInput = {},
	            normalizedProp,
	            prop;

	        for (prop in inputObject) {
	            if (hasOwnProp(inputObject, prop)) {
	                normalizedProp = normalizeUnits(prop);
	                if (normalizedProp) {
	                    normalizedInput[normalizedProp] = inputObject[prop];
	                }
	            }
	        }

	        return normalizedInput;
	    }

	    var priorities = {};

	    function addUnitPriority(unit, priority) {
	        priorities[unit] = priority;
	    }

	    function getPrioritizedUnits(unitsObj) {
	        var units = [],
	            u;
	        for (u in unitsObj) {
	            if (hasOwnProp(unitsObj, u)) {
	                units.push({ unit: u, priority: priorities[u] });
	            }
	        }
	        units.sort(function (a, b) {
	            return a.priority - b.priority;
	        });
	        return units;
	    }

	    function isLeapYear(year) {
	        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	    }

	    function absFloor(number) {
	        if (number < 0) {
	            // -0 -> 0
	            return Math.ceil(number) || 0;
	        } else {
	            return Math.floor(number);
	        }
	    }

	    function toInt(argumentForCoercion) {
	        var coercedNumber = +argumentForCoercion,
	            value = 0;

	        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
	            value = absFloor(coercedNumber);
	        }

	        return value;
	    }

	    function makeGetSet(unit, keepTime) {
	        return function (value) {
	            if (value != null) {
	                set$1(this, unit, value);
	                hooks.updateOffset(this, keepTime);
	                return this;
	            } else {
	                return get(this, unit);
	            }
	        };
	    }

	    function get(mom, unit) {
	        return mom.isValid()
	            ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]()
	            : NaN;
	    }

	    function set$1(mom, unit, value) {
	        if (mom.isValid() && !isNaN(value)) {
	            if (
	                unit === 'FullYear' &&
	                isLeapYear(mom.year()) &&
	                mom.month() === 1 &&
	                mom.date() === 29
	            ) {
	                value = toInt(value);
	                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](
	                    value,
	                    mom.month(),
	                    daysInMonth(value, mom.month())
	                );
	            } else {
	                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
	            }
	        }
	    }

	    // MOMENTS

	    function stringGet(units) {
	        units = normalizeUnits(units);
	        if (isFunction(this[units])) {
	            return this[units]();
	        }
	        return this;
	    }

	    function stringSet(units, value) {
	        if (typeof units === 'object') {
	            units = normalizeObjectUnits(units);
	            var prioritized = getPrioritizedUnits(units),
	                i;
	            for (i = 0; i < prioritized.length; i++) {
	                this[prioritized[i].unit](units[prioritized[i].unit]);
	            }
	        } else {
	            units = normalizeUnits(units);
	            if (isFunction(this[units])) {
	                return this[units](value);
	            }
	        }
	        return this;
	    }

	    var match1 = /\d/, //       0 - 9
	        match2 = /\d\d/, //      00 - 99
	        match3 = /\d{3}/, //     000 - 999
	        match4 = /\d{4}/, //    0000 - 9999
	        match6 = /[+-]?\d{6}/, // -999999 - 999999
	        match1to2 = /\d\d?/, //       0 - 99
	        match3to4 = /\d\d\d\d?/, //     999 - 9999
	        match5to6 = /\d\d\d\d\d\d?/, //   99999 - 999999
	        match1to3 = /\d{1,3}/, //       0 - 999
	        match1to4 = /\d{1,4}/, //       0 - 9999
	        match1to6 = /[+-]?\d{1,6}/, // -999999 - 999999
	        matchUnsigned = /\d+/, //       0 - inf
	        matchSigned = /[+-]?\d+/, //    -inf - inf
	        matchOffset = /Z|[+-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
	        matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, // +00 -00 +00:00 -00:00 +0000 -0000 or Z
	        matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
	        // any word (or two) characters or numbers including two/three word month in arabic.
	        // includes scottish gaelic two word and hyphenated months
	        matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
	        regexes;

	    regexes = {};

	    function addRegexToken(token, regex, strictRegex) {
	        regexes[token] = isFunction(regex)
	            ? regex
	            : function (isStrict, localeData) {
	                  return isStrict && strictRegex ? strictRegex : regex;
	              };
	    }

	    function getParseRegexForToken(token, config) {
	        if (!hasOwnProp(regexes, token)) {
	            return new RegExp(unescapeFormat(token));
	        }

	        return regexes[token](config._strict, config._locale);
	    }

	    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
	    function unescapeFormat(s) {
	        return regexEscape(
	            s
	                .replace('\\', '')
	                .replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (
	                    matched,
	                    p1,
	                    p2,
	                    p3,
	                    p4
	                ) {
	                    return p1 || p2 || p3 || p4;
	                })
	        );
	    }

	    function regexEscape(s) {
	        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	    }

	    var tokens = {};

	    function addParseToken(token, callback) {
	        var i,
	            func = callback;
	        if (typeof token === 'string') {
	            token = [token];
	        }
	        if (isNumber(callback)) {
	            func = function (input, array) {
	                array[callback] = toInt(input);
	            };
	        }
	        for (i = 0; i < token.length; i++) {
	            tokens[token[i]] = func;
	        }
	    }

	    function addWeekParseToken(token, callback) {
	        addParseToken(token, function (input, array, config, token) {
	            config._w = config._w || {};
	            callback(input, config._w, config, token);
	        });
	    }

	    function addTimeToArrayFromToken(token, input, config) {
	        if (input != null && hasOwnProp(tokens, token)) {
	            tokens[token](input, config._a, config, token);
	        }
	    }

	    var YEAR = 0,
	        MONTH = 1,
	        DATE = 2,
	        HOUR = 3,
	        MINUTE = 4,
	        SECOND = 5,
	        MILLISECOND = 6,
	        WEEK = 7,
	        WEEKDAY = 8;

	    function mod(n, x) {
	        return ((n % x) + x) % x;
	    }

	    var indexOf;

	    if (Array.prototype.indexOf) {
	        indexOf = Array.prototype.indexOf;
	    } else {
	        indexOf = function (o) {
	            // I know
	            var i;
	            for (i = 0; i < this.length; ++i) {
	                if (this[i] === o) {
	                    return i;
	                }
	            }
	            return -1;
	        };
	    }

	    function daysInMonth(year, month) {
	        if (isNaN(year) || isNaN(month)) {
	            return NaN;
	        }
	        var modMonth = mod(month, 12);
	        year += (month - modMonth) / 12;
	        return modMonth === 1
	            ? isLeapYear(year)
	                ? 29
	                : 28
	            : 31 - ((modMonth % 7) % 2);
	    }

	    // FORMATTING

	    addFormatToken('M', ['MM', 2], 'Mo', function () {
	        return this.month() + 1;
	    });

	    addFormatToken('MMM', 0, 0, function (format) {
	        return this.localeData().monthsShort(this, format);
	    });

	    addFormatToken('MMMM', 0, 0, function (format) {
	        return this.localeData().months(this, format);
	    });

	    // ALIASES

	    addUnitAlias('month', 'M');

	    // PRIORITY

	    addUnitPriority('month', 8);

	    // PARSING

	    addRegexToken('M', match1to2);
	    addRegexToken('MM', match1to2, match2);
	    addRegexToken('MMM', function (isStrict, locale) {
	        return locale.monthsShortRegex(isStrict);
	    });
	    addRegexToken('MMMM', function (isStrict, locale) {
	        return locale.monthsRegex(isStrict);
	    });

	    addParseToken(['M', 'MM'], function (input, array) {
	        array[MONTH] = toInt(input) - 1;
	    });

	    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
	        var month = config._locale.monthsParse(input, token, config._strict);
	        // if we didn't find a month name, mark the date as invalid.
	        if (month != null) {
	            array[MONTH] = month;
	        } else {
	            getParsingFlags(config).invalidMonth = input;
	        }
	    });

	    // LOCALES

	    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split(
	            '_'
	        ),
	        defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split(
	            '_'
	        ),
	        MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
	        defaultMonthsShortRegex = matchWord,
	        defaultMonthsRegex = matchWord;

	    function localeMonths(m, format) {
	        if (!m) {
	            return isArray(this._months)
	                ? this._months
	                : this._months['standalone'];
	        }
	        return isArray(this._months)
	            ? this._months[m.month()]
	            : this._months[
	                  (this._months.isFormat || MONTHS_IN_FORMAT).test(format)
	                      ? 'format'
	                      : 'standalone'
	              ][m.month()];
	    }

	    function localeMonthsShort(m, format) {
	        if (!m) {
	            return isArray(this._monthsShort)
	                ? this._monthsShort
	                : this._monthsShort['standalone'];
	        }
	        return isArray(this._monthsShort)
	            ? this._monthsShort[m.month()]
	            : this._monthsShort[
	                  MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'
	              ][m.month()];
	    }

	    function handleStrictParse(monthName, format, strict) {
	        var i,
	            ii,
	            mom,
	            llc = monthName.toLocaleLowerCase();
	        if (!this._monthsParse) {
	            // this is not used
	            this._monthsParse = [];
	            this._longMonthsParse = [];
	            this._shortMonthsParse = [];
	            for (i = 0; i < 12; ++i) {
	                mom = createUTC([2000, i]);
	                this._shortMonthsParse[i] = this.monthsShort(
	                    mom,
	                    ''
	                ).toLocaleLowerCase();
	                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
	            }
	        }

	        if (strict) {
	            if (format === 'MMM') {
	                ii = indexOf.call(this._shortMonthsParse, llc);
	                return ii !== -1 ? ii : null;
	            } else {
	                ii = indexOf.call(this._longMonthsParse, llc);
	                return ii !== -1 ? ii : null;
	            }
	        } else {
	            if (format === 'MMM') {
	                ii = indexOf.call(this._shortMonthsParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._longMonthsParse, llc);
	                return ii !== -1 ? ii : null;
	            } else {
	                ii = indexOf.call(this._longMonthsParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._shortMonthsParse, llc);
	                return ii !== -1 ? ii : null;
	            }
	        }
	    }

	    function localeMonthsParse(monthName, format, strict) {
	        var i, mom, regex;

	        if (this._monthsParseExact) {
	            return handleStrictParse.call(this, monthName, format, strict);
	        }

	        if (!this._monthsParse) {
	            this._monthsParse = [];
	            this._longMonthsParse = [];
	            this._shortMonthsParse = [];
	        }

	        // TODO: add sorting
	        // Sorting makes sure if one month (or abbr) is a prefix of another
	        // see sorting in computeMonthsParse
	        for (i = 0; i < 12; i++) {
	            // make the regex if we don't have it already
	            mom = createUTC([2000, i]);
	            if (strict && !this._longMonthsParse[i]) {
	                this._longMonthsParse[i] = new RegExp(
	                    '^' + this.months(mom, '').replace('.', '') + '$',
	                    'i'
	                );
	                this._shortMonthsParse[i] = new RegExp(
	                    '^' + this.monthsShort(mom, '').replace('.', '') + '$',
	                    'i'
	                );
	            }
	            if (!strict && !this._monthsParse[i]) {
	                regex =
	                    '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
	                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
	            }
	            // test the regex
	            if (
	                strict &&
	                format === 'MMMM' &&
	                this._longMonthsParse[i].test(monthName)
	            ) {
	                return i;
	            } else if (
	                strict &&
	                format === 'MMM' &&
	                this._shortMonthsParse[i].test(monthName)
	            ) {
	                return i;
	            } else if (!strict && this._monthsParse[i].test(monthName)) {
	                return i;
	            }
	        }
	    }

	    // MOMENTS

	    function setMonth(mom, value) {
	        var dayOfMonth;

	        if (!mom.isValid()) {
	            // No op
	            return mom;
	        }

	        if (typeof value === 'string') {
	            if (/^\d+$/.test(value)) {
	                value = toInt(value);
	            } else {
	                value = mom.localeData().monthsParse(value);
	                // TODO: Another silent failure?
	                if (!isNumber(value)) {
	                    return mom;
	                }
	            }
	        }

	        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
	        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
	        return mom;
	    }

	    function getSetMonth(value) {
	        if (value != null) {
	            setMonth(this, value);
	            hooks.updateOffset(this, true);
	            return this;
	        } else {
	            return get(this, 'Month');
	        }
	    }

	    function getDaysInMonth() {
	        return daysInMonth(this.year(), this.month());
	    }

	    function monthsShortRegex(isStrict) {
	        if (this._monthsParseExact) {
	            if (!hasOwnProp(this, '_monthsRegex')) {
	                computeMonthsParse.call(this);
	            }
	            if (isStrict) {
	                return this._monthsShortStrictRegex;
	            } else {
	                return this._monthsShortRegex;
	            }
	        } else {
	            if (!hasOwnProp(this, '_monthsShortRegex')) {
	                this._monthsShortRegex = defaultMonthsShortRegex;
	            }
	            return this._monthsShortStrictRegex && isStrict
	                ? this._monthsShortStrictRegex
	                : this._monthsShortRegex;
	        }
	    }

	    function monthsRegex(isStrict) {
	        if (this._monthsParseExact) {
	            if (!hasOwnProp(this, '_monthsRegex')) {
	                computeMonthsParse.call(this);
	            }
	            if (isStrict) {
	                return this._monthsStrictRegex;
	            } else {
	                return this._monthsRegex;
	            }
	        } else {
	            if (!hasOwnProp(this, '_monthsRegex')) {
	                this._monthsRegex = defaultMonthsRegex;
	            }
	            return this._monthsStrictRegex && isStrict
	                ? this._monthsStrictRegex
	                : this._monthsRegex;
	        }
	    }

	    function computeMonthsParse() {
	        function cmpLenRev(a, b) {
	            return b.length - a.length;
	        }

	        var shortPieces = [],
	            longPieces = [],
	            mixedPieces = [],
	            i,
	            mom;
	        for (i = 0; i < 12; i++) {
	            // make the regex if we don't have it already
	            mom = createUTC([2000, i]);
	            shortPieces.push(this.monthsShort(mom, ''));
	            longPieces.push(this.months(mom, ''));
	            mixedPieces.push(this.months(mom, ''));
	            mixedPieces.push(this.monthsShort(mom, ''));
	        }
	        // Sorting makes sure if one month (or abbr) is a prefix of another it
	        // will match the longer piece.
	        shortPieces.sort(cmpLenRev);
	        longPieces.sort(cmpLenRev);
	        mixedPieces.sort(cmpLenRev);
	        for (i = 0; i < 12; i++) {
	            shortPieces[i] = regexEscape(shortPieces[i]);
	            longPieces[i] = regexEscape(longPieces[i]);
	        }
	        for (i = 0; i < 24; i++) {
	            mixedPieces[i] = regexEscape(mixedPieces[i]);
	        }

	        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
	        this._monthsShortRegex = this._monthsRegex;
	        this._monthsStrictRegex = new RegExp(
	            '^(' + longPieces.join('|') + ')',
	            'i'
	        );
	        this._monthsShortStrictRegex = new RegExp(
	            '^(' + shortPieces.join('|') + ')',
	            'i'
	        );
	    }

	    // FORMATTING

	    addFormatToken('Y', 0, 0, function () {
	        var y = this.year();
	        return y <= 9999 ? zeroFill(y, 4) : '+' + y;
	    });

	    addFormatToken(0, ['YY', 2], 0, function () {
	        return this.year() % 100;
	    });

	    addFormatToken(0, ['YYYY', 4], 0, 'year');
	    addFormatToken(0, ['YYYYY', 5], 0, 'year');
	    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

	    // ALIASES

	    addUnitAlias('year', 'y');

	    // PRIORITIES

	    addUnitPriority('year', 1);

	    // PARSING

	    addRegexToken('Y', matchSigned);
	    addRegexToken('YY', match1to2, match2);
	    addRegexToken('YYYY', match1to4, match4);
	    addRegexToken('YYYYY', match1to6, match6);
	    addRegexToken('YYYYYY', match1to6, match6);

	    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
	    addParseToken('YYYY', function (input, array) {
	        array[YEAR] =
	            input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
	    });
	    addParseToken('YY', function (input, array) {
	        array[YEAR] = hooks.parseTwoDigitYear(input);
	    });
	    addParseToken('Y', function (input, array) {
	        array[YEAR] = parseInt(input, 10);
	    });

	    // HELPERS

	    function daysInYear(year) {
	        return isLeapYear(year) ? 366 : 365;
	    }

	    // HOOKS

	    hooks.parseTwoDigitYear = function (input) {
	        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
	    };

	    // MOMENTS

	    var getSetYear = makeGetSet('FullYear', true);

	    function getIsLeapYear() {
	        return isLeapYear(this.year());
	    }

	    function createDate(y, m, d, h, M, s, ms) {
	        // can't just apply() to create a date:
	        // https://stackoverflow.com/q/181348
	        var date;
	        // the date constructor remaps years 0-99 to 1900-1999
	        if (y < 100 && y >= 0) {
	            // preserve leap years using a full 400 year cycle, then reset
	            date = new Date(y + 400, m, d, h, M, s, ms);
	            if (isFinite(date.getFullYear())) {
	                date.setFullYear(y);
	            }
	        } else {
	            date = new Date(y, m, d, h, M, s, ms);
	        }

	        return date;
	    }

	    function createUTCDate(y) {
	        var date, args;
	        // the Date.UTC function remaps years 0-99 to 1900-1999
	        if (y < 100 && y >= 0) {
	            args = Array.prototype.slice.call(arguments);
	            // preserve leap years using a full 400 year cycle, then reset
	            args[0] = y + 400;
	            date = new Date(Date.UTC.apply(null, args));
	            if (isFinite(date.getUTCFullYear())) {
	                date.setUTCFullYear(y);
	            }
	        } else {
	            date = new Date(Date.UTC.apply(null, arguments));
	        }

	        return date;
	    }

	    // start-of-first-week - start-of-year
	    function firstWeekOffset(year, dow, doy) {
	        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
	            fwd = 7 + dow - doy,
	            // first-week day local weekday -- which local weekday is fwd
	            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

	        return -fwdlw + fwd - 1;
	    }

	    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
	    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
	        var localWeekday = (7 + weekday - dow) % 7,
	            weekOffset = firstWeekOffset(year, dow, doy),
	            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
	            resYear,
	            resDayOfYear;

	        if (dayOfYear <= 0) {
	            resYear = year - 1;
	            resDayOfYear = daysInYear(resYear) + dayOfYear;
	        } else if (dayOfYear > daysInYear(year)) {
	            resYear = year + 1;
	            resDayOfYear = dayOfYear - daysInYear(year);
	        } else {
	            resYear = year;
	            resDayOfYear = dayOfYear;
	        }

	        return {
	            year: resYear,
	            dayOfYear: resDayOfYear,
	        };
	    }

	    function weekOfYear(mom, dow, doy) {
	        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
	            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
	            resWeek,
	            resYear;

	        if (week < 1) {
	            resYear = mom.year() - 1;
	            resWeek = week + weeksInYear(resYear, dow, doy);
	        } else if (week > weeksInYear(mom.year(), dow, doy)) {
	            resWeek = week - weeksInYear(mom.year(), dow, doy);
	            resYear = mom.year() + 1;
	        } else {
	            resYear = mom.year();
	            resWeek = week;
	        }

	        return {
	            week: resWeek,
	            year: resYear,
	        };
	    }

	    function weeksInYear(year, dow, doy) {
	        var weekOffset = firstWeekOffset(year, dow, doy),
	            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
	        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
	    }

	    // FORMATTING

	    addFormatToken('w', ['ww', 2], 'wo', 'week');
	    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

	    // ALIASES

	    addUnitAlias('week', 'w');
	    addUnitAlias('isoWeek', 'W');

	    // PRIORITIES

	    addUnitPriority('week', 5);
	    addUnitPriority('isoWeek', 5);

	    // PARSING

	    addRegexToken('w', match1to2);
	    addRegexToken('ww', match1to2, match2);
	    addRegexToken('W', match1to2);
	    addRegexToken('WW', match1to2, match2);

	    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (
	        input,
	        week,
	        config,
	        token
	    ) {
	        week[token.substr(0, 1)] = toInt(input);
	    });

	    // HELPERS

	    // LOCALES

	    function localeWeek(mom) {
	        return weekOfYear(mom, this._week.dow, this._week.doy).week;
	    }

	    var defaultLocaleWeek = {
	        dow: 0, // Sunday is the first day of the week.
	        doy: 6, // The week that contains Jan 6th is the first week of the year.
	    };

	    function localeFirstDayOfWeek() {
	        return this._week.dow;
	    }

	    function localeFirstDayOfYear() {
	        return this._week.doy;
	    }

	    // MOMENTS

	    function getSetWeek(input) {
	        var week = this.localeData().week(this);
	        return input == null ? week : this.add((input - week) * 7, 'd');
	    }

	    function getSetISOWeek(input) {
	        var week = weekOfYear(this, 1, 4).week;
	        return input == null ? week : this.add((input - week) * 7, 'd');
	    }

	    // FORMATTING

	    addFormatToken('d', 0, 'do', 'day');

	    addFormatToken('dd', 0, 0, function (format) {
	        return this.localeData().weekdaysMin(this, format);
	    });

	    addFormatToken('ddd', 0, 0, function (format) {
	        return this.localeData().weekdaysShort(this, format);
	    });

	    addFormatToken('dddd', 0, 0, function (format) {
	        return this.localeData().weekdays(this, format);
	    });

	    addFormatToken('e', 0, 0, 'weekday');
	    addFormatToken('E', 0, 0, 'isoWeekday');

	    // ALIASES

	    addUnitAlias('day', 'd');
	    addUnitAlias('weekday', 'e');
	    addUnitAlias('isoWeekday', 'E');

	    // PRIORITY
	    addUnitPriority('day', 11);
	    addUnitPriority('weekday', 11);
	    addUnitPriority('isoWeekday', 11);

	    // PARSING

	    addRegexToken('d', match1to2);
	    addRegexToken('e', match1to2);
	    addRegexToken('E', match1to2);
	    addRegexToken('dd', function (isStrict, locale) {
	        return locale.weekdaysMinRegex(isStrict);
	    });
	    addRegexToken('ddd', function (isStrict, locale) {
	        return locale.weekdaysShortRegex(isStrict);
	    });
	    addRegexToken('dddd', function (isStrict, locale) {
	        return locale.weekdaysRegex(isStrict);
	    });

	    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
	        var weekday = config._locale.weekdaysParse(input, token, config._strict);
	        // if we didn't get a weekday name, mark the date as invalid
	        if (weekday != null) {
	            week.d = weekday;
	        } else {
	            getParsingFlags(config).invalidWeekday = input;
	        }
	    });

	    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
	        week[token] = toInt(input);
	    });

	    // HELPERS

	    function parseWeekday(input, locale) {
	        if (typeof input !== 'string') {
	            return input;
	        }

	        if (!isNaN(input)) {
	            return parseInt(input, 10);
	        }

	        input = locale.weekdaysParse(input);
	        if (typeof input === 'number') {
	            return input;
	        }

	        return null;
	    }

	    function parseIsoWeekday(input, locale) {
	        if (typeof input === 'string') {
	            return locale.weekdaysParse(input) % 7 || 7;
	        }
	        return isNaN(input) ? null : input;
	    }

	    // LOCALES
	    function shiftWeekdays(ws, n) {
	        return ws.slice(n, 7).concat(ws.slice(0, n));
	    }

	    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
	            '_'
	        ),
	        defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
	        defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
	        defaultWeekdaysRegex = matchWord,
	        defaultWeekdaysShortRegex = matchWord,
	        defaultWeekdaysMinRegex = matchWord;

	    function localeWeekdays(m, format) {
	        var weekdays = isArray(this._weekdays)
	            ? this._weekdays
	            : this._weekdays[
	                  m && m !== true && this._weekdays.isFormat.test(format)
	                      ? 'format'
	                      : 'standalone'
	              ];
	        return m === true
	            ? shiftWeekdays(weekdays, this._week.dow)
	            : m
	            ? weekdays[m.day()]
	            : weekdays;
	    }

	    function localeWeekdaysShort(m) {
	        return m === true
	            ? shiftWeekdays(this._weekdaysShort, this._week.dow)
	            : m
	            ? this._weekdaysShort[m.day()]
	            : this._weekdaysShort;
	    }

	    function localeWeekdaysMin(m) {
	        return m === true
	            ? shiftWeekdays(this._weekdaysMin, this._week.dow)
	            : m
	            ? this._weekdaysMin[m.day()]
	            : this._weekdaysMin;
	    }

	    function handleStrictParse$1(weekdayName, format, strict) {
	        var i,
	            ii,
	            mom,
	            llc = weekdayName.toLocaleLowerCase();
	        if (!this._weekdaysParse) {
	            this._weekdaysParse = [];
	            this._shortWeekdaysParse = [];
	            this._minWeekdaysParse = [];

	            for (i = 0; i < 7; ++i) {
	                mom = createUTC([2000, 1]).day(i);
	                this._minWeekdaysParse[i] = this.weekdaysMin(
	                    mom,
	                    ''
	                ).toLocaleLowerCase();
	                this._shortWeekdaysParse[i] = this.weekdaysShort(
	                    mom,
	                    ''
	                ).toLocaleLowerCase();
	                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
	            }
	        }

	        if (strict) {
	            if (format === 'dddd') {
	                ii = indexOf.call(this._weekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            } else if (format === 'ddd') {
	                ii = indexOf.call(this._shortWeekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            } else {
	                ii = indexOf.call(this._minWeekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            }
	        } else {
	            if (format === 'dddd') {
	                ii = indexOf.call(this._weekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._shortWeekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._minWeekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            } else if (format === 'ddd') {
	                ii = indexOf.call(this._shortWeekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._weekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._minWeekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            } else {
	                ii = indexOf.call(this._minWeekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._weekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._shortWeekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            }
	        }
	    }

	    function localeWeekdaysParse(weekdayName, format, strict) {
	        var i, mom, regex;

	        if (this._weekdaysParseExact) {
	            return handleStrictParse$1.call(this, weekdayName, format, strict);
	        }

	        if (!this._weekdaysParse) {
	            this._weekdaysParse = [];
	            this._minWeekdaysParse = [];
	            this._shortWeekdaysParse = [];
	            this._fullWeekdaysParse = [];
	        }

	        for (i = 0; i < 7; i++) {
	            // make the regex if we don't have it already

	            mom = createUTC([2000, 1]).day(i);
	            if (strict && !this._fullWeekdaysParse[i]) {
	                this._fullWeekdaysParse[i] = new RegExp(
	                    '^' + this.weekdays(mom, '').replace('.', '\\.?') + '$',
	                    'i'
	                );
	                this._shortWeekdaysParse[i] = new RegExp(
	                    '^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$',
	                    'i'
	                );
	                this._minWeekdaysParse[i] = new RegExp(
	                    '^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$',
	                    'i'
	                );
	            }
	            if (!this._weekdaysParse[i]) {
	                regex =
	                    '^' +
	                    this.weekdays(mom, '') +
	                    '|^' +
	                    this.weekdaysShort(mom, '') +
	                    '|^' +
	                    this.weekdaysMin(mom, '');
	                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
	            }
	            // test the regex
	            if (
	                strict &&
	                format === 'dddd' &&
	                this._fullWeekdaysParse[i].test(weekdayName)
	            ) {
	                return i;
	            } else if (
	                strict &&
	                format === 'ddd' &&
	                this._shortWeekdaysParse[i].test(weekdayName)
	            ) {
	                return i;
	            } else if (
	                strict &&
	                format === 'dd' &&
	                this._minWeekdaysParse[i].test(weekdayName)
	            ) {
	                return i;
	            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
	                return i;
	            }
	        }
	    }

	    // MOMENTS

	    function getSetDayOfWeek(input) {
	        if (!this.isValid()) {
	            return input != null ? this : NaN;
	        }
	        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
	        if (input != null) {
	            input = parseWeekday(input, this.localeData());
	            return this.add(input - day, 'd');
	        } else {
	            return day;
	        }
	    }

	    function getSetLocaleDayOfWeek(input) {
	        if (!this.isValid()) {
	            return input != null ? this : NaN;
	        }
	        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
	        return input == null ? weekday : this.add(input - weekday, 'd');
	    }

	    function getSetISODayOfWeek(input) {
	        if (!this.isValid()) {
	            return input != null ? this : NaN;
	        }

	        // behaves the same as moment#day except
	        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
	        // as a setter, sunday should belong to the previous week.

	        if (input != null) {
	            var weekday = parseIsoWeekday(input, this.localeData());
	            return this.day(this.day() % 7 ? weekday : weekday - 7);
	        } else {
	            return this.day() || 7;
	        }
	    }

	    function weekdaysRegex(isStrict) {
	        if (this._weekdaysParseExact) {
	            if (!hasOwnProp(this, '_weekdaysRegex')) {
	                computeWeekdaysParse.call(this);
	            }
	            if (isStrict) {
	                return this._weekdaysStrictRegex;
	            } else {
	                return this._weekdaysRegex;
	            }
	        } else {
	            if (!hasOwnProp(this, '_weekdaysRegex')) {
	                this._weekdaysRegex = defaultWeekdaysRegex;
	            }
	            return this._weekdaysStrictRegex && isStrict
	                ? this._weekdaysStrictRegex
	                : this._weekdaysRegex;
	        }
	    }

	    function weekdaysShortRegex(isStrict) {
	        if (this._weekdaysParseExact) {
	            if (!hasOwnProp(this, '_weekdaysRegex')) {
	                computeWeekdaysParse.call(this);
	            }
	            if (isStrict) {
	                return this._weekdaysShortStrictRegex;
	            } else {
	                return this._weekdaysShortRegex;
	            }
	        } else {
	            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
	                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
	            }
	            return this._weekdaysShortStrictRegex && isStrict
	                ? this._weekdaysShortStrictRegex
	                : this._weekdaysShortRegex;
	        }
	    }

	    function weekdaysMinRegex(isStrict) {
	        if (this._weekdaysParseExact) {
	            if (!hasOwnProp(this, '_weekdaysRegex')) {
	                computeWeekdaysParse.call(this);
	            }
	            if (isStrict) {
	                return this._weekdaysMinStrictRegex;
	            } else {
	                return this._weekdaysMinRegex;
	            }
	        } else {
	            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
	                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
	            }
	            return this._weekdaysMinStrictRegex && isStrict
	                ? this._weekdaysMinStrictRegex
	                : this._weekdaysMinRegex;
	        }
	    }

	    function computeWeekdaysParse() {
	        function cmpLenRev(a, b) {
	            return b.length - a.length;
	        }

	        var minPieces = [],
	            shortPieces = [],
	            longPieces = [],
	            mixedPieces = [],
	            i,
	            mom,
	            minp,
	            shortp,
	            longp;
	        for (i = 0; i < 7; i++) {
	            // make the regex if we don't have it already
	            mom = createUTC([2000, 1]).day(i);
	            minp = regexEscape(this.weekdaysMin(mom, ''));
	            shortp = regexEscape(this.weekdaysShort(mom, ''));
	            longp = regexEscape(this.weekdays(mom, ''));
	            minPieces.push(minp);
	            shortPieces.push(shortp);
	            longPieces.push(longp);
	            mixedPieces.push(minp);
	            mixedPieces.push(shortp);
	            mixedPieces.push(longp);
	        }
	        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
	        // will match the longer piece.
	        minPieces.sort(cmpLenRev);
	        shortPieces.sort(cmpLenRev);
	        longPieces.sort(cmpLenRev);
	        mixedPieces.sort(cmpLenRev);

	        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
	        this._weekdaysShortRegex = this._weekdaysRegex;
	        this._weekdaysMinRegex = this._weekdaysRegex;

	        this._weekdaysStrictRegex = new RegExp(
	            '^(' + longPieces.join('|') + ')',
	            'i'
	        );
	        this._weekdaysShortStrictRegex = new RegExp(
	            '^(' + shortPieces.join('|') + ')',
	            'i'
	        );
	        this._weekdaysMinStrictRegex = new RegExp(
	            '^(' + minPieces.join('|') + ')',
	            'i'
	        );
	    }

	    // FORMATTING

	    function hFormat() {
	        return this.hours() % 12 || 12;
	    }

	    function kFormat() {
	        return this.hours() || 24;
	    }

	    addFormatToken('H', ['HH', 2], 0, 'hour');
	    addFormatToken('h', ['hh', 2], 0, hFormat);
	    addFormatToken('k', ['kk', 2], 0, kFormat);

	    addFormatToken('hmm', 0, 0, function () {
	        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
	    });

	    addFormatToken('hmmss', 0, 0, function () {
	        return (
	            '' +
	            hFormat.apply(this) +
	            zeroFill(this.minutes(), 2) +
	            zeroFill(this.seconds(), 2)
	        );
	    });

	    addFormatToken('Hmm', 0, 0, function () {
	        return '' + this.hours() + zeroFill(this.minutes(), 2);
	    });

	    addFormatToken('Hmmss', 0, 0, function () {
	        return (
	            '' +
	            this.hours() +
	            zeroFill(this.minutes(), 2) +
	            zeroFill(this.seconds(), 2)
	        );
	    });

	    function meridiem(token, lowercase) {
	        addFormatToken(token, 0, 0, function () {
	            return this.localeData().meridiem(
	                this.hours(),
	                this.minutes(),
	                lowercase
	            );
	        });
	    }

	    meridiem('a', true);
	    meridiem('A', false);

	    // ALIASES

	    addUnitAlias('hour', 'h');

	    // PRIORITY
	    addUnitPriority('hour', 13);

	    // PARSING

	    function matchMeridiem(isStrict, locale) {
	        return locale._meridiemParse;
	    }

	    addRegexToken('a', matchMeridiem);
	    addRegexToken('A', matchMeridiem);
	    addRegexToken('H', match1to2);
	    addRegexToken('h', match1to2);
	    addRegexToken('k', match1to2);
	    addRegexToken('HH', match1to2, match2);
	    addRegexToken('hh', match1to2, match2);
	    addRegexToken('kk', match1to2, match2);

	    addRegexToken('hmm', match3to4);
	    addRegexToken('hmmss', match5to6);
	    addRegexToken('Hmm', match3to4);
	    addRegexToken('Hmmss', match5to6);

	    addParseToken(['H', 'HH'], HOUR);
	    addParseToken(['k', 'kk'], function (input, array, config) {
	        var kInput = toInt(input);
	        array[HOUR] = kInput === 24 ? 0 : kInput;
	    });
	    addParseToken(['a', 'A'], function (input, array, config) {
	        config._isPm = config._locale.isPM(input);
	        config._meridiem = input;
	    });
	    addParseToken(['h', 'hh'], function (input, array, config) {
	        array[HOUR] = toInt(input);
	        getParsingFlags(config).bigHour = true;
	    });
	    addParseToken('hmm', function (input, array, config) {
	        var pos = input.length - 2;
	        array[HOUR] = toInt(input.substr(0, pos));
	        array[MINUTE] = toInt(input.substr(pos));
	        getParsingFlags(config).bigHour = true;
	    });
	    addParseToken('hmmss', function (input, array, config) {
	        var pos1 = input.length - 4,
	            pos2 = input.length - 2;
	        array[HOUR] = toInt(input.substr(0, pos1));
	        array[MINUTE] = toInt(input.substr(pos1, 2));
	        array[SECOND] = toInt(input.substr(pos2));
	        getParsingFlags(config).bigHour = true;
	    });
	    addParseToken('Hmm', function (input, array, config) {
	        var pos = input.length - 2;
	        array[HOUR] = toInt(input.substr(0, pos));
	        array[MINUTE] = toInt(input.substr(pos));
	    });
	    addParseToken('Hmmss', function (input, array, config) {
	        var pos1 = input.length - 4,
	            pos2 = input.length - 2;
	        array[HOUR] = toInt(input.substr(0, pos1));
	        array[MINUTE] = toInt(input.substr(pos1, 2));
	        array[SECOND] = toInt(input.substr(pos2));
	    });

	    // LOCALES

	    function localeIsPM(input) {
	        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
	        // Using charAt should be more compatible.
	        return (input + '').toLowerCase().charAt(0) === 'p';
	    }

	    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,
	        // Setting the hour should keep the time, because the user explicitly
	        // specified which hour they want. So trying to maintain the same hour (in
	        // a new timezone) makes sense. Adding/subtracting hours does not follow
	        // this rule.
	        getSetHour = makeGetSet('Hours', true);

	    function localeMeridiem(hours, minutes, isLower) {
	        if (hours > 11) {
	            return isLower ? 'pm' : 'PM';
	        } else {
	            return isLower ? 'am' : 'AM';
	        }
	    }

	    var baseConfig = {
	        calendar: defaultCalendar,
	        longDateFormat: defaultLongDateFormat,
	        invalidDate: defaultInvalidDate,
	        ordinal: defaultOrdinal,
	        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
	        relativeTime: defaultRelativeTime,

	        months: defaultLocaleMonths,
	        monthsShort: defaultLocaleMonthsShort,

	        week: defaultLocaleWeek,

	        weekdays: defaultLocaleWeekdays,
	        weekdaysMin: defaultLocaleWeekdaysMin,
	        weekdaysShort: defaultLocaleWeekdaysShort,

	        meridiemParse: defaultLocaleMeridiemParse,
	    };

	    // internal storage for locale config files
	    var locales = {},
	        localeFamilies = {},
	        globalLocale;

	    function commonPrefix(arr1, arr2) {
	        var i,
	            minl = Math.min(arr1.length, arr2.length);
	        for (i = 0; i < minl; i += 1) {
	            if (arr1[i] !== arr2[i]) {
	                return i;
	            }
	        }
	        return minl;
	    }

	    function normalizeLocale(key) {
	        return key ? key.toLowerCase().replace('_', '-') : key;
	    }

	    // pick the locale from the array
	    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
	    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
	    function chooseLocale(names) {
	        var i = 0,
	            j,
	            next,
	            locale,
	            split;

	        while (i < names.length) {
	            split = normalizeLocale(names[i]).split('-');
	            j = split.length;
	            next = normalizeLocale(names[i + 1]);
	            next = next ? next.split('-') : null;
	            while (j > 0) {
	                locale = loadLocale(split.slice(0, j).join('-'));
	                if (locale) {
	                    return locale;
	                }
	                if (
	                    next &&
	                    next.length >= j &&
	                    commonPrefix(split, next) >= j - 1
	                ) {
	                    //the next array item is better than a shallower substring of this one
	                    break;
	                }
	                j--;
	            }
	            i++;
	        }
	        return globalLocale;
	    }

	    function loadLocale(name) {
	        var oldLocale = null,
	            aliasedRequire;
	        // TODO: Find a better way to register and load all the locales in Node
	        if (
	            locales[name] === undefined &&
	            'object' !== 'undefined' &&
	            module &&
	            module.exports
	        ) {
	            try {
	                oldLocale = globalLocale._abbr;
	                aliasedRequire = commonjsRequire;
	                aliasedRequire('./locale/' + name);
	                getSetGlobalLocale(oldLocale);
	            } catch (e) {
	                // mark as not found to avoid repeating expensive file require call causing high CPU
	                // when trying to find en-US, en_US, en-us for every format call
	                locales[name] = null; // null means not found
	            }
	        }
	        return locales[name];
	    }

	    // This function will load locale and then set the global locale.  If
	    // no arguments are passed in, it will simply return the current global
	    // locale key.
	    function getSetGlobalLocale(key, values) {
	        var data;
	        if (key) {
	            if (isUndefined(values)) {
	                data = getLocale(key);
	            } else {
	                data = defineLocale(key, values);
	            }

	            if (data) {
	                // moment.duration._locale = moment._locale = data;
	                globalLocale = data;
	            } else {
	                if (typeof console !== 'undefined' && console.warn) {
	                    //warn user if arguments are passed but the locale could not be set
	                    console.warn(
	                        'Locale ' + key + ' not found. Did you forget to load it?'
	                    );
	                }
	            }
	        }

	        return globalLocale._abbr;
	    }

	    function defineLocale(name, config) {
	        if (config !== null) {
	            var locale,
	                parentConfig = baseConfig;
	            config.abbr = name;
	            if (locales[name] != null) {
	                deprecateSimple(
	                    'defineLocaleOverride',
	                    'use moment.updateLocale(localeName, config) to change ' +
	                        'an existing locale. moment.defineLocale(localeName, ' +
	                        'config) should only be used for creating a new locale ' +
	                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.'
	                );
	                parentConfig = locales[name]._config;
	            } else if (config.parentLocale != null) {
	                if (locales[config.parentLocale] != null) {
	                    parentConfig = locales[config.parentLocale]._config;
	                } else {
	                    locale = loadLocale(config.parentLocale);
	                    if (locale != null) {
	                        parentConfig = locale._config;
	                    } else {
	                        if (!localeFamilies[config.parentLocale]) {
	                            localeFamilies[config.parentLocale] = [];
	                        }
	                        localeFamilies[config.parentLocale].push({
	                            name: name,
	                            config: config,
	                        });
	                        return null;
	                    }
	                }
	            }
	            locales[name] = new Locale(mergeConfigs(parentConfig, config));

	            if (localeFamilies[name]) {
	                localeFamilies[name].forEach(function (x) {
	                    defineLocale(x.name, x.config);
	                });
	            }

	            // backwards compat for now: also set the locale
	            // make sure we set the locale AFTER all child locales have been
	            // created, so we won't end up with the child locale set.
	            getSetGlobalLocale(name);

	            return locales[name];
	        } else {
	            // useful for testing
	            delete locales[name];
	            return null;
	        }
	    }

	    function updateLocale(name, config) {
	        if (config != null) {
	            var locale,
	                tmpLocale,
	                parentConfig = baseConfig;

	            if (locales[name] != null && locales[name].parentLocale != null) {
	                // Update existing child locale in-place to avoid memory-leaks
	                locales[name].set(mergeConfigs(locales[name]._config, config));
	            } else {
	                // MERGE
	                tmpLocale = loadLocale(name);
	                if (tmpLocale != null) {
	                    parentConfig = tmpLocale._config;
	                }
	                config = mergeConfigs(parentConfig, config);
	                if (tmpLocale == null) {
	                    // updateLocale is called for creating a new locale
	                    // Set abbr so it will have a name (getters return
	                    // undefined otherwise).
	                    config.abbr = name;
	                }
	                locale = new Locale(config);
	                locale.parentLocale = locales[name];
	                locales[name] = locale;
	            }

	            // backwards compat for now: also set the locale
	            getSetGlobalLocale(name);
	        } else {
	            // pass null for config to unupdate, useful for tests
	            if (locales[name] != null) {
	                if (locales[name].parentLocale != null) {
	                    locales[name] = locales[name].parentLocale;
	                    if (name === getSetGlobalLocale()) {
	                        getSetGlobalLocale(name);
	                    }
	                } else if (locales[name] != null) {
	                    delete locales[name];
	                }
	            }
	        }
	        return locales[name];
	    }

	    // returns locale data
	    function getLocale(key) {
	        var locale;

	        if (key && key._locale && key._locale._abbr) {
	            key = key._locale._abbr;
	        }

	        if (!key) {
	            return globalLocale;
	        }

	        if (!isArray(key)) {
	            //short-circuit everything else
	            locale = loadLocale(key);
	            if (locale) {
	                return locale;
	            }
	            key = [key];
	        }

	        return chooseLocale(key);
	    }

	    function listLocales() {
	        return keys(locales);
	    }

	    function checkOverflow(m) {
	        var overflow,
	            a = m._a;

	        if (a && getParsingFlags(m).overflow === -2) {
	            overflow =
	                a[MONTH] < 0 || a[MONTH] > 11
	                    ? MONTH
	                    : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH])
	                    ? DATE
	                    : a[HOUR] < 0 ||
	                      a[HOUR] > 24 ||
	                      (a[HOUR] === 24 &&
	                          (a[MINUTE] !== 0 ||
	                              a[SECOND] !== 0 ||
	                              a[MILLISECOND] !== 0))
	                    ? HOUR
	                    : a[MINUTE] < 0 || a[MINUTE] > 59
	                    ? MINUTE
	                    : a[SECOND] < 0 || a[SECOND] > 59
	                    ? SECOND
	                    : a[MILLISECOND] < 0 || a[MILLISECOND] > 999
	                    ? MILLISECOND
	                    : -1;

	            if (
	                getParsingFlags(m)._overflowDayOfYear &&
	                (overflow < YEAR || overflow > DATE)
	            ) {
	                overflow = DATE;
	            }
	            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
	                overflow = WEEK;
	            }
	            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
	                overflow = WEEKDAY;
	            }

	            getParsingFlags(m).overflow = overflow;
	        }

	        return m;
	    }

	    // iso 8601 regex
	    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
	    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
	        basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
	        tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
	        isoDates = [
	            ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
	            ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
	            ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
	            ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
	            ['YYYY-DDD', /\d{4}-\d{3}/],
	            ['YYYY-MM', /\d{4}-\d\d/, false],
	            ['YYYYYYMMDD', /[+-]\d{10}/],
	            ['YYYYMMDD', /\d{8}/],
	            ['GGGG[W]WWE', /\d{4}W\d{3}/],
	            ['GGGG[W]WW', /\d{4}W\d{2}/, false],
	            ['YYYYDDD', /\d{7}/],
	            ['YYYYMM', /\d{6}/, false],
	            ['YYYY', /\d{4}/, false],
	        ],
	        // iso time formats and regexes
	        isoTimes = [
	            ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
	            ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
	            ['HH:mm:ss', /\d\d:\d\d:\d\d/],
	            ['HH:mm', /\d\d:\d\d/],
	            ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
	            ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
	            ['HHmmss', /\d\d\d\d\d\d/],
	            ['HHmm', /\d\d\d\d/],
	            ['HH', /\d\d/],
	        ],
	        aspNetJsonRegex = /^\/?Date\((-?\d+)/i,
	        // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
	        rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
	        obsOffsets = {
	            UT: 0,
	            GMT: 0,
	            EDT: -4 * 60,
	            EST: -5 * 60,
	            CDT: -5 * 60,
	            CST: -6 * 60,
	            MDT: -6 * 60,
	            MST: -7 * 60,
	            PDT: -7 * 60,
	            PST: -8 * 60,
	        };

	    // date from iso format
	    function configFromISO(config) {
	        var i,
	            l,
	            string = config._i,
	            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
	            allowTime,
	            dateFormat,
	            timeFormat,
	            tzFormat;

	        if (match) {
	            getParsingFlags(config).iso = true;

	            for (i = 0, l = isoDates.length; i < l; i++) {
	                if (isoDates[i][1].exec(match[1])) {
	                    dateFormat = isoDates[i][0];
	                    allowTime = isoDates[i][2] !== false;
	                    break;
	                }
	            }
	            if (dateFormat == null) {
	                config._isValid = false;
	                return;
	            }
	            if (match[3]) {
	                for (i = 0, l = isoTimes.length; i < l; i++) {
	                    if (isoTimes[i][1].exec(match[3])) {
	                        // match[2] should be 'T' or space
	                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
	                        break;
	                    }
	                }
	                if (timeFormat == null) {
	                    config._isValid = false;
	                    return;
	                }
	            }
	            if (!allowTime && timeFormat != null) {
	                config._isValid = false;
	                return;
	            }
	            if (match[4]) {
	                if (tzRegex.exec(match[4])) {
	                    tzFormat = 'Z';
	                } else {
	                    config._isValid = false;
	                    return;
	                }
	            }
	            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
	            configFromStringAndFormat(config);
	        } else {
	            config._isValid = false;
	        }
	    }

	    function extractFromRFC2822Strings(
	        yearStr,
	        monthStr,
	        dayStr,
	        hourStr,
	        minuteStr,
	        secondStr
	    ) {
	        var result = [
	            untruncateYear(yearStr),
	            defaultLocaleMonthsShort.indexOf(monthStr),
	            parseInt(dayStr, 10),
	            parseInt(hourStr, 10),
	            parseInt(minuteStr, 10),
	        ];

	        if (secondStr) {
	            result.push(parseInt(secondStr, 10));
	        }

	        return result;
	    }

	    function untruncateYear(yearStr) {
	        var year = parseInt(yearStr, 10);
	        if (year <= 49) {
	            return 2000 + year;
	        } else if (year <= 999) {
	            return 1900 + year;
	        }
	        return year;
	    }

	    function preprocessRFC2822(s) {
	        // Remove comments and folding whitespace and replace multiple-spaces with a single space
	        return s
	            .replace(/\([^)]*\)|[\n\t]/g, ' ')
	            .replace(/(\s\s+)/g, ' ')
	            .replace(/^\s\s*/, '')
	            .replace(/\s\s*$/, '');
	    }

	    function checkWeekday(weekdayStr, parsedInput, config) {
	        if (weekdayStr) {
	            // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
	            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
	                weekdayActual = new Date(
	                    parsedInput[0],
	                    parsedInput[1],
	                    parsedInput[2]
	                ).getDay();
	            if (weekdayProvided !== weekdayActual) {
	                getParsingFlags(config).weekdayMismatch = true;
	                config._isValid = false;
	                return false;
	            }
	        }
	        return true;
	    }

	    function calculateOffset(obsOffset, militaryOffset, numOffset) {
	        if (obsOffset) {
	            return obsOffsets[obsOffset];
	        } else if (militaryOffset) {
	            // the only allowed military tz is Z
	            return 0;
	        } else {
	            var hm = parseInt(numOffset, 10),
	                m = hm % 100,
	                h = (hm - m) / 100;
	            return h * 60 + m;
	        }
	    }

	    // date and time from ref 2822 format
	    function configFromRFC2822(config) {
	        var match = rfc2822.exec(preprocessRFC2822(config._i)),
	            parsedArray;
	        if (match) {
	            parsedArray = extractFromRFC2822Strings(
	                match[4],
	                match[3],
	                match[2],
	                match[5],
	                match[6],
	                match[7]
	            );
	            if (!checkWeekday(match[1], parsedArray, config)) {
	                return;
	            }

	            config._a = parsedArray;
	            config._tzm = calculateOffset(match[8], match[9], match[10]);

	            config._d = createUTCDate.apply(null, config._a);
	            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

	            getParsingFlags(config).rfc2822 = true;
	        } else {
	            config._isValid = false;
	        }
	    }

	    // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict
	    function configFromString(config) {
	        var matched = aspNetJsonRegex.exec(config._i);
	        if (matched !== null) {
	            config._d = new Date(+matched[1]);
	            return;
	        }

	        configFromISO(config);
	        if (config._isValid === false) {
	            delete config._isValid;
	        } else {
	            return;
	        }

	        configFromRFC2822(config);
	        if (config._isValid === false) {
	            delete config._isValid;
	        } else {
	            return;
	        }

	        if (config._strict) {
	            config._isValid = false;
	        } else {
	            // Final attempt, use Input Fallback
	            hooks.createFromInputFallback(config);
	        }
	    }

	    hooks.createFromInputFallback = deprecate(
	        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
	            'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
	            'discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.',
	        function (config) {
	            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
	        }
	    );

	    // Pick the first defined of two or three arguments.
	    function defaults(a, b, c) {
	        if (a != null) {
	            return a;
	        }
	        if (b != null) {
	            return b;
	        }
	        return c;
	    }

	    function currentDateArray(config) {
	        // hooks is actually the exported moment object
	        var nowValue = new Date(hooks.now());
	        if (config._useUTC) {
	            return [
	                nowValue.getUTCFullYear(),
	                nowValue.getUTCMonth(),
	                nowValue.getUTCDate(),
	            ];
	        }
	        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
	    }

	    // convert an array to a date.
	    // the array should mirror the parameters below
	    // note: all values past the year are optional and will default to the lowest possible value.
	    // [year, month, day , hour, minute, second, millisecond]
	    function configFromArray(config) {
	        var i,
	            date,
	            input = [],
	            currentDate,
	            expectedWeekday,
	            yearToUse;

	        if (config._d) {
	            return;
	        }

	        currentDate = currentDateArray(config);

	        //compute day of the year from weeks and weekdays
	        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
	            dayOfYearFromWeekInfo(config);
	        }

	        //if the day of the year is set, figure out what it is
	        if (config._dayOfYear != null) {
	            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

	            if (
	                config._dayOfYear > daysInYear(yearToUse) ||
	                config._dayOfYear === 0
	            ) {
	                getParsingFlags(config)._overflowDayOfYear = true;
	            }

	            date = createUTCDate(yearToUse, 0, config._dayOfYear);
	            config._a[MONTH] = date.getUTCMonth();
	            config._a[DATE] = date.getUTCDate();
	        }

	        // Default to current date.
	        // * if no year, month, day of month are given, default to today
	        // * if day of month is given, default month and year
	        // * if month is given, default only year
	        // * if year is given, don't default anything
	        for (i = 0; i < 3 && config._a[i] == null; ++i) {
	            config._a[i] = input[i] = currentDate[i];
	        }

	        // Zero out whatever was not defaulted, including time
	        for (; i < 7; i++) {
	            config._a[i] = input[i] =
	                config._a[i] == null ? (i === 2 ? 1 : 0) : config._a[i];
	        }

	        // Check for 24:00:00.000
	        if (
	            config._a[HOUR] === 24 &&
	            config._a[MINUTE] === 0 &&
	            config._a[SECOND] === 0 &&
	            config._a[MILLISECOND] === 0
	        ) {
	            config._nextDay = true;
	            config._a[HOUR] = 0;
	        }

	        config._d = (config._useUTC ? createUTCDate : createDate).apply(
	            null,
	            input
	        );
	        expectedWeekday = config._useUTC
	            ? config._d.getUTCDay()
	            : config._d.getDay();

	        // Apply timezone offset from input. The actual utcOffset can be changed
	        // with parseZone.
	        if (config._tzm != null) {
	            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
	        }

	        if (config._nextDay) {
	            config._a[HOUR] = 24;
	        }

	        // check for mismatching day of week
	        if (
	            config._w &&
	            typeof config._w.d !== 'undefined' &&
	            config._w.d !== expectedWeekday
	        ) {
	            getParsingFlags(config).weekdayMismatch = true;
	        }
	    }

	    function dayOfYearFromWeekInfo(config) {
	        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;

	        w = config._w;
	        if (w.GG != null || w.W != null || w.E != null) {
	            dow = 1;
	            doy = 4;

	            // TODO: We need to take the current isoWeekYear, but that depends on
	            // how we interpret now (local, utc, fixed offset). So create
	            // a now version of current config (take local/utc/offset flags, and
	            // create now).
	            weekYear = defaults(
	                w.GG,
	                config._a[YEAR],
	                weekOfYear(createLocal(), 1, 4).year
	            );
	            week = defaults(w.W, 1);
	            weekday = defaults(w.E, 1);
	            if (weekday < 1 || weekday > 7) {
	                weekdayOverflow = true;
	            }
	        } else {
	            dow = config._locale._week.dow;
	            doy = config._locale._week.doy;

	            curWeek = weekOfYear(createLocal(), dow, doy);

	            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

	            // Default to current week.
	            week = defaults(w.w, curWeek.week);

	            if (w.d != null) {
	                // weekday -- low day numbers are considered next week
	                weekday = w.d;
	                if (weekday < 0 || weekday > 6) {
	                    weekdayOverflow = true;
	                }
	            } else if (w.e != null) {
	                // local weekday -- counting starts from beginning of week
	                weekday = w.e + dow;
	                if (w.e < 0 || w.e > 6) {
	                    weekdayOverflow = true;
	                }
	            } else {
	                // default to beginning of week
	                weekday = dow;
	            }
	        }
	        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
	            getParsingFlags(config)._overflowWeeks = true;
	        } else if (weekdayOverflow != null) {
	            getParsingFlags(config)._overflowWeekday = true;
	        } else {
	            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
	            config._a[YEAR] = temp.year;
	            config._dayOfYear = temp.dayOfYear;
	        }
	    }

	    // constant that refers to the ISO standard
	    hooks.ISO_8601 = function () {};

	    // constant that refers to the RFC 2822 form
	    hooks.RFC_2822 = function () {};

	    // date from string and format string
	    function configFromStringAndFormat(config) {
	        // TODO: Move this to another part of the creation flow to prevent circular deps
	        if (config._f === hooks.ISO_8601) {
	            configFromISO(config);
	            return;
	        }
	        if (config._f === hooks.RFC_2822) {
	            configFromRFC2822(config);
	            return;
	        }
	        config._a = [];
	        getParsingFlags(config).empty = true;

	        // This array is used to make a Date, either with `new Date` or `Date.UTC`
	        var string = '' + config._i,
	            i,
	            parsedInput,
	            tokens,
	            token,
	            skipped,
	            stringLength = string.length,
	            totalParsedInputLength = 0,
	            era;

	        tokens =
	            expandFormat(config._f, config._locale).match(formattingTokens) || [];

	        for (i = 0; i < tokens.length; i++) {
	            token = tokens[i];
	            parsedInput = (string.match(getParseRegexForToken(token, config)) ||
	                [])[0];
	            if (parsedInput) {
	                skipped = string.substr(0, string.indexOf(parsedInput));
	                if (skipped.length > 0) {
	                    getParsingFlags(config).unusedInput.push(skipped);
	                }
	                string = string.slice(
	                    string.indexOf(parsedInput) + parsedInput.length
	                );
	                totalParsedInputLength += parsedInput.length;
	            }
	            // don't parse if it's not a known token
	            if (formatTokenFunctions[token]) {
	                if (parsedInput) {
	                    getParsingFlags(config).empty = false;
	                } else {
	                    getParsingFlags(config).unusedTokens.push(token);
	                }
	                addTimeToArrayFromToken(token, parsedInput, config);
	            } else if (config._strict && !parsedInput) {
	                getParsingFlags(config).unusedTokens.push(token);
	            }
	        }

	        // add remaining unparsed input length to the string
	        getParsingFlags(config).charsLeftOver =
	            stringLength - totalParsedInputLength;
	        if (string.length > 0) {
	            getParsingFlags(config).unusedInput.push(string);
	        }

	        // clear _12h flag if hour is <= 12
	        if (
	            config._a[HOUR] <= 12 &&
	            getParsingFlags(config).bigHour === true &&
	            config._a[HOUR] > 0
	        ) {
	            getParsingFlags(config).bigHour = undefined;
	        }

	        getParsingFlags(config).parsedDateParts = config._a.slice(0);
	        getParsingFlags(config).meridiem = config._meridiem;
	        // handle meridiem
	        config._a[HOUR] = meridiemFixWrap(
	            config._locale,
	            config._a[HOUR],
	            config._meridiem
	        );

	        // handle era
	        era = getParsingFlags(config).era;
	        if (era !== null) {
	            config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
	        }

	        configFromArray(config);
	        checkOverflow(config);
	    }

	    function meridiemFixWrap(locale, hour, meridiem) {
	        var isPm;

	        if (meridiem == null) {
	            // nothing to do
	            return hour;
	        }
	        if (locale.meridiemHour != null) {
	            return locale.meridiemHour(hour, meridiem);
	        } else if (locale.isPM != null) {
	            // Fallback
	            isPm = locale.isPM(meridiem);
	            if (isPm && hour < 12) {
	                hour += 12;
	            }
	            if (!isPm && hour === 12) {
	                hour = 0;
	            }
	            return hour;
	        } else {
	            // this is not supposed to happen
	            return hour;
	        }
	    }

	    // date from string and array of format strings
	    function configFromStringAndArray(config) {
	        var tempConfig,
	            bestMoment,
	            scoreToBeat,
	            i,
	            currentScore,
	            validFormatFound,
	            bestFormatIsValid = false;

	        if (config._f.length === 0) {
	            getParsingFlags(config).invalidFormat = true;
	            config._d = new Date(NaN);
	            return;
	        }

	        for (i = 0; i < config._f.length; i++) {
	            currentScore = 0;
	            validFormatFound = false;
	            tempConfig = copyConfig({}, config);
	            if (config._useUTC != null) {
	                tempConfig._useUTC = config._useUTC;
	            }
	            tempConfig._f = config._f[i];
	            configFromStringAndFormat(tempConfig);

	            if (isValid(tempConfig)) {
	                validFormatFound = true;
	            }

	            // if there is any input that was not parsed add a penalty for that format
	            currentScore += getParsingFlags(tempConfig).charsLeftOver;

	            //or tokens
	            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

	            getParsingFlags(tempConfig).score = currentScore;

	            if (!bestFormatIsValid) {
	                if (
	                    scoreToBeat == null ||
	                    currentScore < scoreToBeat ||
	                    validFormatFound
	                ) {
	                    scoreToBeat = currentScore;
	                    bestMoment = tempConfig;
	                    if (validFormatFound) {
	                        bestFormatIsValid = true;
	                    }
	                }
	            } else {
	                if (currentScore < scoreToBeat) {
	                    scoreToBeat = currentScore;
	                    bestMoment = tempConfig;
	                }
	            }
	        }

	        extend(config, bestMoment || tempConfig);
	    }

	    function configFromObject(config) {
	        if (config._d) {
	            return;
	        }

	        var i = normalizeObjectUnits(config._i),
	            dayOrDate = i.day === undefined ? i.date : i.day;
	        config._a = map(
	            [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
	            function (obj) {
	                return obj && parseInt(obj, 10);
	            }
	        );

	        configFromArray(config);
	    }

	    function createFromConfig(config) {
	        var res = new Moment(checkOverflow(prepareConfig(config)));
	        if (res._nextDay) {
	            // Adding is smart enough around DST
	            res.add(1, 'd');
	            res._nextDay = undefined;
	        }

	        return res;
	    }

	    function prepareConfig(config) {
	        var input = config._i,
	            format = config._f;

	        config._locale = config._locale || getLocale(config._l);

	        if (input === null || (format === undefined && input === '')) {
	            return createInvalid({ nullInput: true });
	        }

	        if (typeof input === 'string') {
	            config._i = input = config._locale.preparse(input);
	        }

	        if (isMoment(input)) {
	            return new Moment(checkOverflow(input));
	        } else if (isDate(input)) {
	            config._d = input;
	        } else if (isArray(format)) {
	            configFromStringAndArray(config);
	        } else if (format) {
	            configFromStringAndFormat(config);
	        } else {
	            configFromInput(config);
	        }

	        if (!isValid(config)) {
	            config._d = null;
	        }

	        return config;
	    }

	    function configFromInput(config) {
	        var input = config._i;
	        if (isUndefined(input)) {
	            config._d = new Date(hooks.now());
	        } else if (isDate(input)) {
	            config._d = new Date(input.valueOf());
	        } else if (typeof input === 'string') {
	            configFromString(config);
	        } else if (isArray(input)) {
	            config._a = map(input.slice(0), function (obj) {
	                return parseInt(obj, 10);
	            });
	            configFromArray(config);
	        } else if (isObject(input)) {
	            configFromObject(config);
	        } else if (isNumber(input)) {
	            // from milliseconds
	            config._d = new Date(input);
	        } else {
	            hooks.createFromInputFallback(config);
	        }
	    }

	    function createLocalOrUTC(input, format, locale, strict, isUTC) {
	        var c = {};

	        if (format === true || format === false) {
	            strict = format;
	            format = undefined;
	        }

	        if (locale === true || locale === false) {
	            strict = locale;
	            locale = undefined;
	        }

	        if (
	            (isObject(input) && isObjectEmpty(input)) ||
	            (isArray(input) && input.length === 0)
	        ) {
	            input = undefined;
	        }
	        // object construction must be done this way.
	        // https://github.com/moment/moment/issues/1423
	        c._isAMomentObject = true;
	        c._useUTC = c._isUTC = isUTC;
	        c._l = locale;
	        c._i = input;
	        c._f = format;
	        c._strict = strict;

	        return createFromConfig(c);
	    }

	    function createLocal(input, format, locale, strict) {
	        return createLocalOrUTC(input, format, locale, strict, false);
	    }

	    var prototypeMin = deprecate(
	            'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
	            function () {
	                var other = createLocal.apply(null, arguments);
	                if (this.isValid() && other.isValid()) {
	                    return other < this ? this : other;
	                } else {
	                    return createInvalid();
	                }
	            }
	        ),
	        prototypeMax = deprecate(
	            'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
	            function () {
	                var other = createLocal.apply(null, arguments);
	                if (this.isValid() && other.isValid()) {
	                    return other > this ? this : other;
	                } else {
	                    return createInvalid();
	                }
	            }
	        );

	    // Pick a moment m from moments so that m[fn](other) is true for all
	    // other. This relies on the function fn to be transitive.
	    //
	    // moments should either be an array of moment objects or an array, whose
	    // first element is an array of moment objects.
	    function pickBy(fn, moments) {
	        var res, i;
	        if (moments.length === 1 && isArray(moments[0])) {
	            moments = moments[0];
	        }
	        if (!moments.length) {
	            return createLocal();
	        }
	        res = moments[0];
	        for (i = 1; i < moments.length; ++i) {
	            if (!moments[i].isValid() || moments[i][fn](res)) {
	                res = moments[i];
	            }
	        }
	        return res;
	    }

	    // TODO: Use [].sort instead?
	    function min() {
	        var args = [].slice.call(arguments, 0);

	        return pickBy('isBefore', args);
	    }

	    function max() {
	        var args = [].slice.call(arguments, 0);

	        return pickBy('isAfter', args);
	    }

	    var now = function () {
	        return Date.now ? Date.now() : +new Date();
	    };

	    var ordering = [
	        'year',
	        'quarter',
	        'month',
	        'week',
	        'day',
	        'hour',
	        'minute',
	        'second',
	        'millisecond',
	    ];

	    function isDurationValid(m) {
	        var key,
	            unitHasDecimal = false,
	            i;
	        for (key in m) {
	            if (
	                hasOwnProp(m, key) &&
	                !(
	                    indexOf.call(ordering, key) !== -1 &&
	                    (m[key] == null || !isNaN(m[key]))
	                )
	            ) {
	                return false;
	            }
	        }

	        for (i = 0; i < ordering.length; ++i) {
	            if (m[ordering[i]]) {
	                if (unitHasDecimal) {
	                    return false; // only allow non-integers for smallest unit
	                }
	                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
	                    unitHasDecimal = true;
	                }
	            }
	        }

	        return true;
	    }

	    function isValid$1() {
	        return this._isValid;
	    }

	    function createInvalid$1() {
	        return createDuration(NaN);
	    }

	    function Duration(duration) {
	        var normalizedInput = normalizeObjectUnits(duration),
	            years = normalizedInput.year || 0,
	            quarters = normalizedInput.quarter || 0,
	            months = normalizedInput.month || 0,
	            weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
	            days = normalizedInput.day || 0,
	            hours = normalizedInput.hour || 0,
	            minutes = normalizedInput.minute || 0,
	            seconds = normalizedInput.second || 0,
	            milliseconds = normalizedInput.millisecond || 0;

	        this._isValid = isDurationValid(normalizedInput);

	        // representation for dateAddRemove
	        this._milliseconds =
	            +milliseconds +
	            seconds * 1e3 + // 1000
	            minutes * 6e4 + // 1000 * 60
	            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
	        // Because of dateAddRemove treats 24 hours as different from a
	        // day when working around DST, we need to store them separately
	        this._days = +days + weeks * 7;
	        // It is impossible to translate months into days without knowing
	        // which months you are are talking about, so we have to store
	        // it separately.
	        this._months = +months + quarters * 3 + years * 12;

	        this._data = {};

	        this._locale = getLocale();

	        this._bubble();
	    }

	    function isDuration(obj) {
	        return obj instanceof Duration;
	    }

	    function absRound(number) {
	        if (number < 0) {
	            return Math.round(-1 * number) * -1;
	        } else {
	            return Math.round(number);
	        }
	    }

	    // compare two arrays, return the number of differences
	    function compareArrays(array1, array2, dontConvert) {
	        var len = Math.min(array1.length, array2.length),
	            lengthDiff = Math.abs(array1.length - array2.length),
	            diffs = 0,
	            i;
	        for (i = 0; i < len; i++) {
	            if (
	                (dontConvert && array1[i] !== array2[i]) ||
	                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))
	            ) {
	                diffs++;
	            }
	        }
	        return diffs + lengthDiff;
	    }

	    // FORMATTING

	    function offset(token, separator) {
	        addFormatToken(token, 0, 0, function () {
	            var offset = this.utcOffset(),
	                sign = '+';
	            if (offset < 0) {
	                offset = -offset;
	                sign = '-';
	            }
	            return (
	                sign +
	                zeroFill(~~(offset / 60), 2) +
	                separator +
	                zeroFill(~~offset % 60, 2)
	            );
	        });
	    }

	    offset('Z', ':');
	    offset('ZZ', '');

	    // PARSING

	    addRegexToken('Z', matchShortOffset);
	    addRegexToken('ZZ', matchShortOffset);
	    addParseToken(['Z', 'ZZ'], function (input, array, config) {
	        config._useUTC = true;
	        config._tzm = offsetFromString(matchShortOffset, input);
	    });

	    // HELPERS

	    // timezone chunker
	    // '+10:00' > ['10',  '00']
	    // '-1530'  > ['-15', '30']
	    var chunkOffset = /([\+\-]|\d\d)/gi;

	    function offsetFromString(matcher, string) {
	        var matches = (string || '').match(matcher),
	            chunk,
	            parts,
	            minutes;

	        if (matches === null) {
	            return null;
	        }

	        chunk = matches[matches.length - 1] || [];
	        parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
	        minutes = +(parts[1] * 60) + toInt(parts[2]);

	        return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
	    }

	    // Return a moment from input, that is local/utc/zone equivalent to model.
	    function cloneWithOffset(input, model) {
	        var res, diff;
	        if (model._isUTC) {
	            res = model.clone();
	            diff =
	                (isMoment(input) || isDate(input)
	                    ? input.valueOf()
	                    : createLocal(input).valueOf()) - res.valueOf();
	            // Use low-level api, because this fn is low-level api.
	            res._d.setTime(res._d.valueOf() + diff);
	            hooks.updateOffset(res, false);
	            return res;
	        } else {
	            return createLocal(input).local();
	        }
	    }

	    function getDateOffset(m) {
	        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
	        // https://github.com/moment/moment/pull/1871
	        return -Math.round(m._d.getTimezoneOffset());
	    }

	    // HOOKS

	    // This function will be called whenever a moment is mutated.
	    // It is intended to keep the offset in sync with the timezone.
	    hooks.updateOffset = function () {};

	    // MOMENTS

	    // keepLocalTime = true means only change the timezone, without
	    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
	    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
	    // +0200, so we adjust the time as needed, to be valid.
	    //
	    // Keeping the time actually adds/subtracts (one hour)
	    // from the actual represented time. That is why we call updateOffset
	    // a second time. In case it wants us to change the offset again
	    // _changeInProgress == true case, then we have to adjust, because
	    // there is no such time in the given timezone.
	    function getSetOffset(input, keepLocalTime, keepMinutes) {
	        var offset = this._offset || 0,
	            localAdjust;
	        if (!this.isValid()) {
	            return input != null ? this : NaN;
	        }
	        if (input != null) {
	            if (typeof input === 'string') {
	                input = offsetFromString(matchShortOffset, input);
	                if (input === null) {
	                    return this;
	                }
	            } else if (Math.abs(input) < 16 && !keepMinutes) {
	                input = input * 60;
	            }
	            if (!this._isUTC && keepLocalTime) {
	                localAdjust = getDateOffset(this);
	            }
	            this._offset = input;
	            this._isUTC = true;
	            if (localAdjust != null) {
	                this.add(localAdjust, 'm');
	            }
	            if (offset !== input) {
	                if (!keepLocalTime || this._changeInProgress) {
	                    addSubtract(
	                        this,
	                        createDuration(input - offset, 'm'),
	                        1,
	                        false
	                    );
	                } else if (!this._changeInProgress) {
	                    this._changeInProgress = true;
	                    hooks.updateOffset(this, true);
	                    this._changeInProgress = null;
	                }
	            }
	            return this;
	        } else {
	            return this._isUTC ? offset : getDateOffset(this);
	        }
	    }

	    function getSetZone(input, keepLocalTime) {
	        if (input != null) {
	            if (typeof input !== 'string') {
	                input = -input;
	            }

	            this.utcOffset(input, keepLocalTime);

	            return this;
	        } else {
	            return -this.utcOffset();
	        }
	    }

	    function setOffsetToUTC(keepLocalTime) {
	        return this.utcOffset(0, keepLocalTime);
	    }

	    function setOffsetToLocal(keepLocalTime) {
	        if (this._isUTC) {
	            this.utcOffset(0, keepLocalTime);
	            this._isUTC = false;

	            if (keepLocalTime) {
	                this.subtract(getDateOffset(this), 'm');
	            }
	        }
	        return this;
	    }

	    function setOffsetToParsedOffset() {
	        if (this._tzm != null) {
	            this.utcOffset(this._tzm, false, true);
	        } else if (typeof this._i === 'string') {
	            var tZone = offsetFromString(matchOffset, this._i);
	            if (tZone != null) {
	                this.utcOffset(tZone);
	            } else {
	                this.utcOffset(0, true);
	            }
	        }
	        return this;
	    }

	    function hasAlignedHourOffset(input) {
	        if (!this.isValid()) {
	            return false;
	        }
	        input = input ? createLocal(input).utcOffset() : 0;

	        return (this.utcOffset() - input) % 60 === 0;
	    }

	    function isDaylightSavingTime() {
	        return (
	            this.utcOffset() > this.clone().month(0).utcOffset() ||
	            this.utcOffset() > this.clone().month(5).utcOffset()
	        );
	    }

	    function isDaylightSavingTimeShifted() {
	        if (!isUndefined(this._isDSTShifted)) {
	            return this._isDSTShifted;
	        }

	        var c = {},
	            other;

	        copyConfig(c, this);
	        c = prepareConfig(c);

	        if (c._a) {
	            other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
	            this._isDSTShifted =
	                this.isValid() && compareArrays(c._a, other.toArray()) > 0;
	        } else {
	            this._isDSTShifted = false;
	        }

	        return this._isDSTShifted;
	    }

	    function isLocal() {
	        return this.isValid() ? !this._isUTC : false;
	    }

	    function isUtcOffset() {
	        return this.isValid() ? this._isUTC : false;
	    }

	    function isUtc() {
	        return this.isValid() ? this._isUTC && this._offset === 0 : false;
	    }

	    // ASP.NET json date format regex
	    var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
	        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
	        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
	        // and further modified to allow for strings containing both week and day
	        isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

	    function createDuration(input, key) {
	        var duration = input,
	            // matching against regexp is expensive, do it on demand
	            match = null,
	            sign,
	            ret,
	            diffRes;

	        if (isDuration(input)) {
	            duration = {
	                ms: input._milliseconds,
	                d: input._days,
	                M: input._months,
	            };
	        } else if (isNumber(input) || !isNaN(+input)) {
	            duration = {};
	            if (key) {
	                duration[key] = +input;
	            } else {
	                duration.milliseconds = +input;
	            }
	        } else if ((match = aspNetRegex.exec(input))) {
	            sign = match[1] === '-' ? -1 : 1;
	            duration = {
	                y: 0,
	                d: toInt(match[DATE]) * sign,
	                h: toInt(match[HOUR]) * sign,
	                m: toInt(match[MINUTE]) * sign,
	                s: toInt(match[SECOND]) * sign,
	                ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign, // the millisecond decimal point is included in the match
	            };
	        } else if ((match = isoRegex.exec(input))) {
	            sign = match[1] === '-' ? -1 : 1;
	            duration = {
	                y: parseIso(match[2], sign),
	                M: parseIso(match[3], sign),
	                w: parseIso(match[4], sign),
	                d: parseIso(match[5], sign),
	                h: parseIso(match[6], sign),
	                m: parseIso(match[7], sign),
	                s: parseIso(match[8], sign),
	            };
	        } else if (duration == null) {
	            // checks for null or undefined
	            duration = {};
	        } else if (
	            typeof duration === 'object' &&
	            ('from' in duration || 'to' in duration)
	        ) {
	            diffRes = momentsDifference(
	                createLocal(duration.from),
	                createLocal(duration.to)
	            );

	            duration = {};
	            duration.ms = diffRes.milliseconds;
	            duration.M = diffRes.months;
	        }

	        ret = new Duration(duration);

	        if (isDuration(input) && hasOwnProp(input, '_locale')) {
	            ret._locale = input._locale;
	        }

	        if (isDuration(input) && hasOwnProp(input, '_isValid')) {
	            ret._isValid = input._isValid;
	        }

	        return ret;
	    }

	    createDuration.fn = Duration.prototype;
	    createDuration.invalid = createInvalid$1;

	    function parseIso(inp, sign) {
	        // We'd normally use ~~inp for this, but unfortunately it also
	        // converts floats to ints.
	        // inp may be undefined, so careful calling replace on it.
	        var res = inp && parseFloat(inp.replace(',', '.'));
	        // apply sign while we're at it
	        return (isNaN(res) ? 0 : res) * sign;
	    }

	    function positiveMomentsDifference(base, other) {
	        var res = {};

	        res.months =
	            other.month() - base.month() + (other.year() - base.year()) * 12;
	        if (base.clone().add(res.months, 'M').isAfter(other)) {
	            --res.months;
	        }

	        res.milliseconds = +other - +base.clone().add(res.months, 'M');

	        return res;
	    }

	    function momentsDifference(base, other) {
	        var res;
	        if (!(base.isValid() && other.isValid())) {
	            return { milliseconds: 0, months: 0 };
	        }

	        other = cloneWithOffset(other, base);
	        if (base.isBefore(other)) {
	            res = positiveMomentsDifference(base, other);
	        } else {
	            res = positiveMomentsDifference(other, base);
	            res.milliseconds = -res.milliseconds;
	            res.months = -res.months;
	        }

	        return res;
	    }

	    // TODO: remove 'name' arg after deprecation is removed
	    function createAdder(direction, name) {
	        return function (val, period) {
	            var dur, tmp;
	            //invert the arguments, but complain about it
	            if (period !== null && !isNaN(+period)) {
	                deprecateSimple(
	                    name,
	                    'moment().' +
	                        name +
	                        '(period, number) is deprecated. Please use moment().' +
	                        name +
	                        '(number, period). ' +
	                        'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.'
	                );
	                tmp = val;
	                val = period;
	                period = tmp;
	            }

	            dur = createDuration(val, period);
	            addSubtract(this, dur, direction);
	            return this;
	        };
	    }

	    function addSubtract(mom, duration, isAdding, updateOffset) {
	        var milliseconds = duration._milliseconds,
	            days = absRound(duration._days),
	            months = absRound(duration._months);

	        if (!mom.isValid()) {
	            // No op
	            return;
	        }

	        updateOffset = updateOffset == null ? true : updateOffset;

	        if (months) {
	            setMonth(mom, get(mom, 'Month') + months * isAdding);
	        }
	        if (days) {
	            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
	        }
	        if (milliseconds) {
	            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
	        }
	        if (updateOffset) {
	            hooks.updateOffset(mom, days || months);
	        }
	    }

	    var add = createAdder(1, 'add'),
	        subtract = createAdder(-1, 'subtract');

	    function isString(input) {
	        return typeof input === 'string' || input instanceof String;
	    }

	    // type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
	    function isMomentInput(input) {
	        return (
	            isMoment(input) ||
	            isDate(input) ||
	            isString(input) ||
	            isNumber(input) ||
	            isNumberOrStringArray(input) ||
	            isMomentInputObject(input) ||
	            input === null ||
	            input === undefined
	        );
	    }

	    function isMomentInputObject(input) {
	        var objectTest = isObject(input) && !isObjectEmpty(input),
	            propertyTest = false,
	            properties = [
	                'years',
	                'year',
	                'y',
	                'months',
	                'month',
	                'M',
	                'days',
	                'day',
	                'd',
	                'dates',
	                'date',
	                'D',
	                'hours',
	                'hour',
	                'h',
	                'minutes',
	                'minute',
	                'm',
	                'seconds',
	                'second',
	                's',
	                'milliseconds',
	                'millisecond',
	                'ms',
	            ],
	            i,
	            property;

	        for (i = 0; i < properties.length; i += 1) {
	            property = properties[i];
	            propertyTest = propertyTest || hasOwnProp(input, property);
	        }

	        return objectTest && propertyTest;
	    }

	    function isNumberOrStringArray(input) {
	        var arrayTest = isArray(input),
	            dataTypeTest = false;
	        if (arrayTest) {
	            dataTypeTest =
	                input.filter(function (item) {
	                    return !isNumber(item) && isString(input);
	                }).length === 0;
	        }
	        return arrayTest && dataTypeTest;
	    }

	    function isCalendarSpec(input) {
	        var objectTest = isObject(input) && !isObjectEmpty(input),
	            propertyTest = false,
	            properties = [
	                'sameDay',
	                'nextDay',
	                'lastDay',
	                'nextWeek',
	                'lastWeek',
	                'sameElse',
	            ],
	            i,
	            property;

	        for (i = 0; i < properties.length; i += 1) {
	            property = properties[i];
	            propertyTest = propertyTest || hasOwnProp(input, property);
	        }

	        return objectTest && propertyTest;
	    }

	    function getCalendarFormat(myMoment, now) {
	        var diff = myMoment.diff(now, 'days', true);
	        return diff < -6
	            ? 'sameElse'
	            : diff < -1
	            ? 'lastWeek'
	            : diff < 0
	            ? 'lastDay'
	            : diff < 1
	            ? 'sameDay'
	            : diff < 2
	            ? 'nextDay'
	            : diff < 7
	            ? 'nextWeek'
	            : 'sameElse';
	    }

	    function calendar$1(time, formats) {
	        // Support for single parameter, formats only overload to the calendar function
	        if (arguments.length === 1) {
	            if (!arguments[0]) {
	                time = undefined;
	                formats = undefined;
	            } else if (isMomentInput(arguments[0])) {
	                time = arguments[0];
	                formats = undefined;
	            } else if (isCalendarSpec(arguments[0])) {
	                formats = arguments[0];
	                time = undefined;
	            }
	        }
	        // We want to compare the start of today, vs this.
	        // Getting start-of-today depends on whether we're local/utc/offset or not.
	        var now = time || createLocal(),
	            sod = cloneWithOffset(now, this).startOf('day'),
	            format = hooks.calendarFormat(this, sod) || 'sameElse',
	            output =
	                formats &&
	                (isFunction(formats[format])
	                    ? formats[format].call(this, now)
	                    : formats[format]);

	        return this.format(
	            output || this.localeData().calendar(format, this, createLocal(now))
	        );
	    }

	    function clone() {
	        return new Moment(this);
	    }

	    function isAfter(input, units) {
	        var localInput = isMoment(input) ? input : createLocal(input);
	        if (!(this.isValid() && localInput.isValid())) {
	            return false;
	        }
	        units = normalizeUnits(units) || 'millisecond';
	        if (units === 'millisecond') {
	            return this.valueOf() > localInput.valueOf();
	        } else {
	            return localInput.valueOf() < this.clone().startOf(units).valueOf();
	        }
	    }

	    function isBefore(input, units) {
	        var localInput = isMoment(input) ? input : createLocal(input);
	        if (!(this.isValid() && localInput.isValid())) {
	            return false;
	        }
	        units = normalizeUnits(units) || 'millisecond';
	        if (units === 'millisecond') {
	            return this.valueOf() < localInput.valueOf();
	        } else {
	            return this.clone().endOf(units).valueOf() < localInput.valueOf();
	        }
	    }

	    function isBetween(from, to, units, inclusivity) {
	        var localFrom = isMoment(from) ? from : createLocal(from),
	            localTo = isMoment(to) ? to : createLocal(to);
	        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
	            return false;
	        }
	        inclusivity = inclusivity || '()';
	        return (
	            (inclusivity[0] === '('
	                ? this.isAfter(localFrom, units)
	                : !this.isBefore(localFrom, units)) &&
	            (inclusivity[1] === ')'
	                ? this.isBefore(localTo, units)
	                : !this.isAfter(localTo, units))
	        );
	    }

	    function isSame(input, units) {
	        var localInput = isMoment(input) ? input : createLocal(input),
	            inputMs;
	        if (!(this.isValid() && localInput.isValid())) {
	            return false;
	        }
	        units = normalizeUnits(units) || 'millisecond';
	        if (units === 'millisecond') {
	            return this.valueOf() === localInput.valueOf();
	        } else {
	            inputMs = localInput.valueOf();
	            return (
	                this.clone().startOf(units).valueOf() <= inputMs &&
	                inputMs <= this.clone().endOf(units).valueOf()
	            );
	        }
	    }

	    function isSameOrAfter(input, units) {
	        return this.isSame(input, units) || this.isAfter(input, units);
	    }

	    function isSameOrBefore(input, units) {
	        return this.isSame(input, units) || this.isBefore(input, units);
	    }

	    function diff(input, units, asFloat) {
	        var that, zoneDelta, output;

	        if (!this.isValid()) {
	            return NaN;
	        }

	        that = cloneWithOffset(input, this);

	        if (!that.isValid()) {
	            return NaN;
	        }

	        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

	        units = normalizeUnits(units);

	        switch (units) {
	            case 'year':
	                output = monthDiff(this, that) / 12;
	                break;
	            case 'month':
	                output = monthDiff(this, that);
	                break;
	            case 'quarter':
	                output = monthDiff(this, that) / 3;
	                break;
	            case 'second':
	                output = (this - that) / 1e3;
	                break; // 1000
	            case 'minute':
	                output = (this - that) / 6e4;
	                break; // 1000 * 60
	            case 'hour':
	                output = (this - that) / 36e5;
	                break; // 1000 * 60 * 60
	            case 'day':
	                output = (this - that - zoneDelta) / 864e5;
	                break; // 1000 * 60 * 60 * 24, negate dst
	            case 'week':
	                output = (this - that - zoneDelta) / 6048e5;
	                break; // 1000 * 60 * 60 * 24 * 7, negate dst
	            default:
	                output = this - that;
	        }

	        return asFloat ? output : absFloor(output);
	    }

	    function monthDiff(a, b) {
	        if (a.date() < b.date()) {
	            // end-of-month calculations work correct when the start month has more
	            // days than the end month.
	            return -monthDiff(b, a);
	        }
	        // difference in months
	        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
	            // b is in (anchor - 1 month, anchor + 1 month)
	            anchor = a.clone().add(wholeMonthDiff, 'months'),
	            anchor2,
	            adjust;

	        if (b - anchor < 0) {
	            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
	            // linear across the month
	            adjust = (b - anchor) / (anchor - anchor2);
	        } else {
	            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
	            // linear across the month
	            adjust = (b - anchor) / (anchor2 - anchor);
	        }

	        //check for negative zero, return zero if negative zero
	        return -(wholeMonthDiff + adjust) || 0;
	    }

	    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
	    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

	    function toString() {
	        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
	    }

	    function toISOString(keepOffset) {
	        if (!this.isValid()) {
	            return null;
	        }
	        var utc = keepOffset !== true,
	            m = utc ? this.clone().utc() : this;
	        if (m.year() < 0 || m.year() > 9999) {
	            return formatMoment(
	                m,
	                utc
	                    ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
	                    : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ'
	            );
	        }
	        if (isFunction(Date.prototype.toISOString)) {
	            // native implementation is ~50x faster, use it when we can
	            if (utc) {
	                return this.toDate().toISOString();
	            } else {
	                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000)
	                    .toISOString()
	                    .replace('Z', formatMoment(m, 'Z'));
	            }
	        }
	        return formatMoment(
	            m,
	            utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'
	        );
	    }

	    /**
	     * Return a human readable representation of a moment that can
	     * also be evaluated to get a new moment which is the same
	     *
	     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
	     */
	    function inspect() {
	        if (!this.isValid()) {
	            return 'moment.invalid(/* ' + this._i + ' */)';
	        }
	        var func = 'moment',
	            zone = '',
	            prefix,
	            year,
	            datetime,
	            suffix;
	        if (!this.isLocal()) {
	            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
	            zone = 'Z';
	        }
	        prefix = '[' + func + '("]';
	        year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
	        datetime = '-MM-DD[T]HH:mm:ss.SSS';
	        suffix = zone + '[")]';

	        return this.format(prefix + year + datetime + suffix);
	    }

	    function format(inputString) {
	        if (!inputString) {
	            inputString = this.isUtc()
	                ? hooks.defaultFormatUtc
	                : hooks.defaultFormat;
	        }
	        var output = formatMoment(this, inputString);
	        return this.localeData().postformat(output);
	    }

	    function from(time, withoutSuffix) {
	        if (
	            this.isValid() &&
	            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
	        ) {
	            return createDuration({ to: this, from: time })
	                .locale(this.locale())
	                .humanize(!withoutSuffix);
	        } else {
	            return this.localeData().invalidDate();
	        }
	    }

	    function fromNow(withoutSuffix) {
	        return this.from(createLocal(), withoutSuffix);
	    }

	    function to(time, withoutSuffix) {
	        if (
	            this.isValid() &&
	            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
	        ) {
	            return createDuration({ from: this, to: time })
	                .locale(this.locale())
	                .humanize(!withoutSuffix);
	        } else {
	            return this.localeData().invalidDate();
	        }
	    }

	    function toNow(withoutSuffix) {
	        return this.to(createLocal(), withoutSuffix);
	    }

	    // If passed a locale key, it will set the locale for this
	    // instance.  Otherwise, it will return the locale configuration
	    // variables for this instance.
	    function locale(key) {
	        var newLocaleData;

	        if (key === undefined) {
	            return this._locale._abbr;
	        } else {
	            newLocaleData = getLocale(key);
	            if (newLocaleData != null) {
	                this._locale = newLocaleData;
	            }
	            return this;
	        }
	    }

	    var lang = deprecate(
	        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
	        function (key) {
	            if (key === undefined) {
	                return this.localeData();
	            } else {
	                return this.locale(key);
	            }
	        }
	    );

	    function localeData() {
	        return this._locale;
	    }

	    var MS_PER_SECOND = 1000,
	        MS_PER_MINUTE = 60 * MS_PER_SECOND,
	        MS_PER_HOUR = 60 * MS_PER_MINUTE,
	        MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

	    // actual modulo - handles negative numbers (for dates before 1970):
	    function mod$1(dividend, divisor) {
	        return ((dividend % divisor) + divisor) % divisor;
	    }

	    function localStartOfDate(y, m, d) {
	        // the date constructor remaps years 0-99 to 1900-1999
	        if (y < 100 && y >= 0) {
	            // preserve leap years using a full 400 year cycle, then reset
	            return new Date(y + 400, m, d) - MS_PER_400_YEARS;
	        } else {
	            return new Date(y, m, d).valueOf();
	        }
	    }

	    function utcStartOfDate(y, m, d) {
	        // Date.UTC remaps years 0-99 to 1900-1999
	        if (y < 100 && y >= 0) {
	            // preserve leap years using a full 400 year cycle, then reset
	            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
	        } else {
	            return Date.UTC(y, m, d);
	        }
	    }

	    function startOf(units) {
	        var time, startOfDate;
	        units = normalizeUnits(units);
	        if (units === undefined || units === 'millisecond' || !this.isValid()) {
	            return this;
	        }

	        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

	        switch (units) {
	            case 'year':
	                time = startOfDate(this.year(), 0, 1);
	                break;
	            case 'quarter':
	                time = startOfDate(
	                    this.year(),
	                    this.month() - (this.month() % 3),
	                    1
	                );
	                break;
	            case 'month':
	                time = startOfDate(this.year(), this.month(), 1);
	                break;
	            case 'week':
	                time = startOfDate(
	                    this.year(),
	                    this.month(),
	                    this.date() - this.weekday()
	                );
	                break;
	            case 'isoWeek':
	                time = startOfDate(
	                    this.year(),
	                    this.month(),
	                    this.date() - (this.isoWeekday() - 1)
	                );
	                break;
	            case 'day':
	            case 'date':
	                time = startOfDate(this.year(), this.month(), this.date());
	                break;
	            case 'hour':
	                time = this._d.valueOf();
	                time -= mod$1(
	                    time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
	                    MS_PER_HOUR
	                );
	                break;
	            case 'minute':
	                time = this._d.valueOf();
	                time -= mod$1(time, MS_PER_MINUTE);
	                break;
	            case 'second':
	                time = this._d.valueOf();
	                time -= mod$1(time, MS_PER_SECOND);
	                break;
	        }

	        this._d.setTime(time);
	        hooks.updateOffset(this, true);
	        return this;
	    }

	    function endOf(units) {
	        var time, startOfDate;
	        units = normalizeUnits(units);
	        if (units === undefined || units === 'millisecond' || !this.isValid()) {
	            return this;
	        }

	        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

	        switch (units) {
	            case 'year':
	                time = startOfDate(this.year() + 1, 0, 1) - 1;
	                break;
	            case 'quarter':
	                time =
	                    startOfDate(
	                        this.year(),
	                        this.month() - (this.month() % 3) + 3,
	                        1
	                    ) - 1;
	                break;
	            case 'month':
	                time = startOfDate(this.year(), this.month() + 1, 1) - 1;
	                break;
	            case 'week':
	                time =
	                    startOfDate(
	                        this.year(),
	                        this.month(),
	                        this.date() - this.weekday() + 7
	                    ) - 1;
	                break;
	            case 'isoWeek':
	                time =
	                    startOfDate(
	                        this.year(),
	                        this.month(),
	                        this.date() - (this.isoWeekday() - 1) + 7
	                    ) - 1;
	                break;
	            case 'day':
	            case 'date':
	                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
	                break;
	            case 'hour':
	                time = this._d.valueOf();
	                time +=
	                    MS_PER_HOUR -
	                    mod$1(
	                        time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
	                        MS_PER_HOUR
	                    ) -
	                    1;
	                break;
	            case 'minute':
	                time = this._d.valueOf();
	                time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
	                break;
	            case 'second':
	                time = this._d.valueOf();
	                time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
	                break;
	        }

	        this._d.setTime(time);
	        hooks.updateOffset(this, true);
	        return this;
	    }

	    function valueOf() {
	        return this._d.valueOf() - (this._offset || 0) * 60000;
	    }

	    function unix() {
	        return Math.floor(this.valueOf() / 1000);
	    }

	    function toDate() {
	        return new Date(this.valueOf());
	    }

	    function toArray() {
	        var m = this;
	        return [
	            m.year(),
	            m.month(),
	            m.date(),
	            m.hour(),
	            m.minute(),
	            m.second(),
	            m.millisecond(),
	        ];
	    }

	    function toObject() {
	        var m = this;
	        return {
	            years: m.year(),
	            months: m.month(),
	            date: m.date(),
	            hours: m.hours(),
	            minutes: m.minutes(),
	            seconds: m.seconds(),
	            milliseconds: m.milliseconds(),
	        };
	    }

	    function toJSON() {
	        // new Date(NaN).toJSON() === null
	        return this.isValid() ? this.toISOString() : null;
	    }

	    function isValid$2() {
	        return isValid(this);
	    }

	    function parsingFlags() {
	        return extend({}, getParsingFlags(this));
	    }

	    function invalidAt() {
	        return getParsingFlags(this).overflow;
	    }

	    function creationData() {
	        return {
	            input: this._i,
	            format: this._f,
	            locale: this._locale,
	            isUTC: this._isUTC,
	            strict: this._strict,
	        };
	    }

	    addFormatToken('N', 0, 0, 'eraAbbr');
	    addFormatToken('NN', 0, 0, 'eraAbbr');
	    addFormatToken('NNN', 0, 0, 'eraAbbr');
	    addFormatToken('NNNN', 0, 0, 'eraName');
	    addFormatToken('NNNNN', 0, 0, 'eraNarrow');

	    addFormatToken('y', ['y', 1], 'yo', 'eraYear');
	    addFormatToken('y', ['yy', 2], 0, 'eraYear');
	    addFormatToken('y', ['yyy', 3], 0, 'eraYear');
	    addFormatToken('y', ['yyyy', 4], 0, 'eraYear');

	    addRegexToken('N', matchEraAbbr);
	    addRegexToken('NN', matchEraAbbr);
	    addRegexToken('NNN', matchEraAbbr);
	    addRegexToken('NNNN', matchEraName);
	    addRegexToken('NNNNN', matchEraNarrow);

	    addParseToken(['N', 'NN', 'NNN', 'NNNN', 'NNNNN'], function (
	        input,
	        array,
	        config,
	        token
	    ) {
	        var era = config._locale.erasParse(input, token, config._strict);
	        if (era) {
	            getParsingFlags(config).era = era;
	        } else {
	            getParsingFlags(config).invalidEra = input;
	        }
	    });

	    addRegexToken('y', matchUnsigned);
	    addRegexToken('yy', matchUnsigned);
	    addRegexToken('yyy', matchUnsigned);
	    addRegexToken('yyyy', matchUnsigned);
	    addRegexToken('yo', matchEraYearOrdinal);

	    addParseToken(['y', 'yy', 'yyy', 'yyyy'], YEAR);
	    addParseToken(['yo'], function (input, array, config, token) {
	        var match;
	        if (config._locale._eraYearOrdinalRegex) {
	            match = input.match(config._locale._eraYearOrdinalRegex);
	        }

	        if (config._locale.eraYearOrdinalParse) {
	            array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
	        } else {
	            array[YEAR] = parseInt(input, 10);
	        }
	    });

	    function localeEras(m, format) {
	        var i,
	            l,
	            date,
	            eras = this._eras || getLocale('en')._eras;
	        for (i = 0, l = eras.length; i < l; ++i) {
	            switch (typeof eras[i].since) {
	                case 'string':
	                    // truncate time
	                    date = hooks(eras[i].since).startOf('day');
	                    eras[i].since = date.valueOf();
	                    break;
	            }

	            switch (typeof eras[i].until) {
	                case 'undefined':
	                    eras[i].until = +Infinity;
	                    break;
	                case 'string':
	                    // truncate time
	                    date = hooks(eras[i].until).startOf('day').valueOf();
	                    eras[i].until = date.valueOf();
	                    break;
	            }
	        }
	        return eras;
	    }

	    function localeErasParse(eraName, format, strict) {
	        var i,
	            l,
	            eras = this.eras(),
	            name,
	            abbr,
	            narrow;
	        eraName = eraName.toUpperCase();

	        for (i = 0, l = eras.length; i < l; ++i) {
	            name = eras[i].name.toUpperCase();
	            abbr = eras[i].abbr.toUpperCase();
	            narrow = eras[i].narrow.toUpperCase();

	            if (strict) {
	                switch (format) {
	                    case 'N':
	                    case 'NN':
	                    case 'NNN':
	                        if (abbr === eraName) {
	                            return eras[i];
	                        }
	                        break;

	                    case 'NNNN':
	                        if (name === eraName) {
	                            return eras[i];
	                        }
	                        break;

	                    case 'NNNNN':
	                        if (narrow === eraName) {
	                            return eras[i];
	                        }
	                        break;
	                }
	            } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
	                return eras[i];
	            }
	        }
	    }

	    function localeErasConvertYear(era, year) {
	        var dir = era.since <= era.until ? +1 : -1;
	        if (year === undefined) {
	            return hooks(era.since).year();
	        } else {
	            return hooks(era.since).year() + (year - era.offset) * dir;
	        }
	    }

	    function getEraName() {
	        var i,
	            l,
	            val,
	            eras = this.localeData().eras();
	        for (i = 0, l = eras.length; i < l; ++i) {
	            // truncate time
	            val = this.clone().startOf('day').valueOf();

	            if (eras[i].since <= val && val <= eras[i].until) {
	                return eras[i].name;
	            }
	            if (eras[i].until <= val && val <= eras[i].since) {
	                return eras[i].name;
	            }
	        }

	        return '';
	    }

	    function getEraNarrow() {
	        var i,
	            l,
	            val,
	            eras = this.localeData().eras();
	        for (i = 0, l = eras.length; i < l; ++i) {
	            // truncate time
	            val = this.clone().startOf('day').valueOf();

	            if (eras[i].since <= val && val <= eras[i].until) {
	                return eras[i].narrow;
	            }
	            if (eras[i].until <= val && val <= eras[i].since) {
	                return eras[i].narrow;
	            }
	        }

	        return '';
	    }

	    function getEraAbbr() {
	        var i,
	            l,
	            val,
	            eras = this.localeData().eras();
	        for (i = 0, l = eras.length; i < l; ++i) {
	            // truncate time
	            val = this.clone().startOf('day').valueOf();

	            if (eras[i].since <= val && val <= eras[i].until) {
	                return eras[i].abbr;
	            }
	            if (eras[i].until <= val && val <= eras[i].since) {
	                return eras[i].abbr;
	            }
	        }

	        return '';
	    }

	    function getEraYear() {
	        var i,
	            l,
	            dir,
	            val,
	            eras = this.localeData().eras();
	        for (i = 0, l = eras.length; i < l; ++i) {
	            dir = eras[i].since <= eras[i].until ? +1 : -1;

	            // truncate time
	            val = this.clone().startOf('day').valueOf();

	            if (
	                (eras[i].since <= val && val <= eras[i].until) ||
	                (eras[i].until <= val && val <= eras[i].since)
	            ) {
	                return (
	                    (this.year() - hooks(eras[i].since).year()) * dir +
	                    eras[i].offset
	                );
	            }
	        }

	        return this.year();
	    }

	    function erasNameRegex(isStrict) {
	        if (!hasOwnProp(this, '_erasNameRegex')) {
	            computeErasParse.call(this);
	        }
	        return isStrict ? this._erasNameRegex : this._erasRegex;
	    }

	    function erasAbbrRegex(isStrict) {
	        if (!hasOwnProp(this, '_erasAbbrRegex')) {
	            computeErasParse.call(this);
	        }
	        return isStrict ? this._erasAbbrRegex : this._erasRegex;
	    }

	    function erasNarrowRegex(isStrict) {
	        if (!hasOwnProp(this, '_erasNarrowRegex')) {
	            computeErasParse.call(this);
	        }
	        return isStrict ? this._erasNarrowRegex : this._erasRegex;
	    }

	    function matchEraAbbr(isStrict, locale) {
	        return locale.erasAbbrRegex(isStrict);
	    }

	    function matchEraName(isStrict, locale) {
	        return locale.erasNameRegex(isStrict);
	    }

	    function matchEraNarrow(isStrict, locale) {
	        return locale.erasNarrowRegex(isStrict);
	    }

	    function matchEraYearOrdinal(isStrict, locale) {
	        return locale._eraYearOrdinalRegex || matchUnsigned;
	    }

	    function computeErasParse() {
	        var abbrPieces = [],
	            namePieces = [],
	            narrowPieces = [],
	            mixedPieces = [],
	            i,
	            l,
	            eras = this.eras();

	        for (i = 0, l = eras.length; i < l; ++i) {
	            namePieces.push(regexEscape(eras[i].name));
	            abbrPieces.push(regexEscape(eras[i].abbr));
	            narrowPieces.push(regexEscape(eras[i].narrow));

	            mixedPieces.push(regexEscape(eras[i].name));
	            mixedPieces.push(regexEscape(eras[i].abbr));
	            mixedPieces.push(regexEscape(eras[i].narrow));
	        }

	        this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
	        this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
	        this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
	        this._erasNarrowRegex = new RegExp(
	            '^(' + narrowPieces.join('|') + ')',
	            'i'
	        );
	    }

	    // FORMATTING

	    addFormatToken(0, ['gg', 2], 0, function () {
	        return this.weekYear() % 100;
	    });

	    addFormatToken(0, ['GG', 2], 0, function () {
	        return this.isoWeekYear() % 100;
	    });

	    function addWeekYearFormatToken(token, getter) {
	        addFormatToken(0, [token, token.length], 0, getter);
	    }

	    addWeekYearFormatToken('gggg', 'weekYear');
	    addWeekYearFormatToken('ggggg', 'weekYear');
	    addWeekYearFormatToken('GGGG', 'isoWeekYear');
	    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

	    // ALIASES

	    addUnitAlias('weekYear', 'gg');
	    addUnitAlias('isoWeekYear', 'GG');

	    // PRIORITY

	    addUnitPriority('weekYear', 1);
	    addUnitPriority('isoWeekYear', 1);

	    // PARSING

	    addRegexToken('G', matchSigned);
	    addRegexToken('g', matchSigned);
	    addRegexToken('GG', match1to2, match2);
	    addRegexToken('gg', match1to2, match2);
	    addRegexToken('GGGG', match1to4, match4);
	    addRegexToken('gggg', match1to4, match4);
	    addRegexToken('GGGGG', match1to6, match6);
	    addRegexToken('ggggg', match1to6, match6);

	    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (
	        input,
	        week,
	        config,
	        token
	    ) {
	        week[token.substr(0, 2)] = toInt(input);
	    });

	    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
	        week[token] = hooks.parseTwoDigitYear(input);
	    });

	    // MOMENTS

	    function getSetWeekYear(input) {
	        return getSetWeekYearHelper.call(
	            this,
	            input,
	            this.week(),
	            this.weekday(),
	            this.localeData()._week.dow,
	            this.localeData()._week.doy
	        );
	    }

	    function getSetISOWeekYear(input) {
	        return getSetWeekYearHelper.call(
	            this,
	            input,
	            this.isoWeek(),
	            this.isoWeekday(),
	            1,
	            4
	        );
	    }

	    function getISOWeeksInYear() {
	        return weeksInYear(this.year(), 1, 4);
	    }

	    function getISOWeeksInISOWeekYear() {
	        return weeksInYear(this.isoWeekYear(), 1, 4);
	    }

	    function getWeeksInYear() {
	        var weekInfo = this.localeData()._week;
	        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
	    }

	    function getWeeksInWeekYear() {
	        var weekInfo = this.localeData()._week;
	        return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
	    }

	    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
	        var weeksTarget;
	        if (input == null) {
	            return weekOfYear(this, dow, doy).year;
	        } else {
	            weeksTarget = weeksInYear(input, dow, doy);
	            if (week > weeksTarget) {
	                week = weeksTarget;
	            }
	            return setWeekAll.call(this, input, week, weekday, dow, doy);
	        }
	    }

	    function setWeekAll(weekYear, week, weekday, dow, doy) {
	        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
	            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

	        this.year(date.getUTCFullYear());
	        this.month(date.getUTCMonth());
	        this.date(date.getUTCDate());
	        return this;
	    }

	    // FORMATTING

	    addFormatToken('Q', 0, 'Qo', 'quarter');

	    // ALIASES

	    addUnitAlias('quarter', 'Q');

	    // PRIORITY

	    addUnitPriority('quarter', 7);

	    // PARSING

	    addRegexToken('Q', match1);
	    addParseToken('Q', function (input, array) {
	        array[MONTH] = (toInt(input) - 1) * 3;
	    });

	    // MOMENTS

	    function getSetQuarter(input) {
	        return input == null
	            ? Math.ceil((this.month() + 1) / 3)
	            : this.month((input - 1) * 3 + (this.month() % 3));
	    }

	    // FORMATTING

	    addFormatToken('D', ['DD', 2], 'Do', 'date');

	    // ALIASES

	    addUnitAlias('date', 'D');

	    // PRIORITY
	    addUnitPriority('date', 9);

	    // PARSING

	    addRegexToken('D', match1to2);
	    addRegexToken('DD', match1to2, match2);
	    addRegexToken('Do', function (isStrict, locale) {
	        // TODO: Remove "ordinalParse" fallback in next major release.
	        return isStrict
	            ? locale._dayOfMonthOrdinalParse || locale._ordinalParse
	            : locale._dayOfMonthOrdinalParseLenient;
	    });

	    addParseToken(['D', 'DD'], DATE);
	    addParseToken('Do', function (input, array) {
	        array[DATE] = toInt(input.match(match1to2)[0]);
	    });

	    // MOMENTS

	    var getSetDayOfMonth = makeGetSet('Date', true);

	    // FORMATTING

	    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

	    // ALIASES

	    addUnitAlias('dayOfYear', 'DDD');

	    // PRIORITY
	    addUnitPriority('dayOfYear', 4);

	    // PARSING

	    addRegexToken('DDD', match1to3);
	    addRegexToken('DDDD', match3);
	    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
	        config._dayOfYear = toInt(input);
	    });

	    // HELPERS

	    // MOMENTS

	    function getSetDayOfYear(input) {
	        var dayOfYear =
	            Math.round(
	                (this.clone().startOf('day') - this.clone().startOf('year')) / 864e5
	            ) + 1;
	        return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
	    }

	    // FORMATTING

	    addFormatToken('m', ['mm', 2], 0, 'minute');

	    // ALIASES

	    addUnitAlias('minute', 'm');

	    // PRIORITY

	    addUnitPriority('minute', 14);

	    // PARSING

	    addRegexToken('m', match1to2);
	    addRegexToken('mm', match1to2, match2);
	    addParseToken(['m', 'mm'], MINUTE);

	    // MOMENTS

	    var getSetMinute = makeGetSet('Minutes', false);

	    // FORMATTING

	    addFormatToken('s', ['ss', 2], 0, 'second');

	    // ALIASES

	    addUnitAlias('second', 's');

	    // PRIORITY

	    addUnitPriority('second', 15);

	    // PARSING

	    addRegexToken('s', match1to2);
	    addRegexToken('ss', match1to2, match2);
	    addParseToken(['s', 'ss'], SECOND);

	    // MOMENTS

	    var getSetSecond = makeGetSet('Seconds', false);

	    // FORMATTING

	    addFormatToken('S', 0, 0, function () {
	        return ~~(this.millisecond() / 100);
	    });

	    addFormatToken(0, ['SS', 2], 0, function () {
	        return ~~(this.millisecond() / 10);
	    });

	    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
	    addFormatToken(0, ['SSSS', 4], 0, function () {
	        return this.millisecond() * 10;
	    });
	    addFormatToken(0, ['SSSSS', 5], 0, function () {
	        return this.millisecond() * 100;
	    });
	    addFormatToken(0, ['SSSSSS', 6], 0, function () {
	        return this.millisecond() * 1000;
	    });
	    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
	        return this.millisecond() * 10000;
	    });
	    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
	        return this.millisecond() * 100000;
	    });
	    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
	        return this.millisecond() * 1000000;
	    });

	    // ALIASES

	    addUnitAlias('millisecond', 'ms');

	    // PRIORITY

	    addUnitPriority('millisecond', 16);

	    // PARSING

	    addRegexToken('S', match1to3, match1);
	    addRegexToken('SS', match1to3, match2);
	    addRegexToken('SSS', match1to3, match3);

	    var token, getSetMillisecond;
	    for (token = 'SSSS'; token.length <= 9; token += 'S') {
	        addRegexToken(token, matchUnsigned);
	    }

	    function parseMs(input, array) {
	        array[MILLISECOND] = toInt(('0.' + input) * 1000);
	    }

	    for (token = 'S'; token.length <= 9; token += 'S') {
	        addParseToken(token, parseMs);
	    }

	    getSetMillisecond = makeGetSet('Milliseconds', false);

	    // FORMATTING

	    addFormatToken('z', 0, 0, 'zoneAbbr');
	    addFormatToken('zz', 0, 0, 'zoneName');

	    // MOMENTS

	    function getZoneAbbr() {
	        return this._isUTC ? 'UTC' : '';
	    }

	    function getZoneName() {
	        return this._isUTC ? 'Coordinated Universal Time' : '';
	    }

	    var proto = Moment.prototype;

	    proto.add = add;
	    proto.calendar = calendar$1;
	    proto.clone = clone;
	    proto.diff = diff;
	    proto.endOf = endOf;
	    proto.format = format;
	    proto.from = from;
	    proto.fromNow = fromNow;
	    proto.to = to;
	    proto.toNow = toNow;
	    proto.get = stringGet;
	    proto.invalidAt = invalidAt;
	    proto.isAfter = isAfter;
	    proto.isBefore = isBefore;
	    proto.isBetween = isBetween;
	    proto.isSame = isSame;
	    proto.isSameOrAfter = isSameOrAfter;
	    proto.isSameOrBefore = isSameOrBefore;
	    proto.isValid = isValid$2;
	    proto.lang = lang;
	    proto.locale = locale;
	    proto.localeData = localeData;
	    proto.max = prototypeMax;
	    proto.min = prototypeMin;
	    proto.parsingFlags = parsingFlags;
	    proto.set = stringSet;
	    proto.startOf = startOf;
	    proto.subtract = subtract;
	    proto.toArray = toArray;
	    proto.toObject = toObject;
	    proto.toDate = toDate;
	    proto.toISOString = toISOString;
	    proto.inspect = inspect;
	    if (typeof Symbol !== 'undefined' && Symbol.for != null) {
	        proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
	            return 'Moment<' + this.format() + '>';
	        };
	    }
	    proto.toJSON = toJSON;
	    proto.toString = toString;
	    proto.unix = unix;
	    proto.valueOf = valueOf;
	    proto.creationData = creationData;
	    proto.eraName = getEraName;
	    proto.eraNarrow = getEraNarrow;
	    proto.eraAbbr = getEraAbbr;
	    proto.eraYear = getEraYear;
	    proto.year = getSetYear;
	    proto.isLeapYear = getIsLeapYear;
	    proto.weekYear = getSetWeekYear;
	    proto.isoWeekYear = getSetISOWeekYear;
	    proto.quarter = proto.quarters = getSetQuarter;
	    proto.month = getSetMonth;
	    proto.daysInMonth = getDaysInMonth;
	    proto.week = proto.weeks = getSetWeek;
	    proto.isoWeek = proto.isoWeeks = getSetISOWeek;
	    proto.weeksInYear = getWeeksInYear;
	    proto.weeksInWeekYear = getWeeksInWeekYear;
	    proto.isoWeeksInYear = getISOWeeksInYear;
	    proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
	    proto.date = getSetDayOfMonth;
	    proto.day = proto.days = getSetDayOfWeek;
	    proto.weekday = getSetLocaleDayOfWeek;
	    proto.isoWeekday = getSetISODayOfWeek;
	    proto.dayOfYear = getSetDayOfYear;
	    proto.hour = proto.hours = getSetHour;
	    proto.minute = proto.minutes = getSetMinute;
	    proto.second = proto.seconds = getSetSecond;
	    proto.millisecond = proto.milliseconds = getSetMillisecond;
	    proto.utcOffset = getSetOffset;
	    proto.utc = setOffsetToUTC;
	    proto.local = setOffsetToLocal;
	    proto.parseZone = setOffsetToParsedOffset;
	    proto.hasAlignedHourOffset = hasAlignedHourOffset;
	    proto.isDST = isDaylightSavingTime;
	    proto.isLocal = isLocal;
	    proto.isUtcOffset = isUtcOffset;
	    proto.isUtc = isUtc;
	    proto.isUTC = isUtc;
	    proto.zoneAbbr = getZoneAbbr;
	    proto.zoneName = getZoneName;
	    proto.dates = deprecate(
	        'dates accessor is deprecated. Use date instead.',
	        getSetDayOfMonth
	    );
	    proto.months = deprecate(
	        'months accessor is deprecated. Use month instead',
	        getSetMonth
	    );
	    proto.years = deprecate(
	        'years accessor is deprecated. Use year instead',
	        getSetYear
	    );
	    proto.zone = deprecate(
	        'moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/',
	        getSetZone
	    );
	    proto.isDSTShifted = deprecate(
	        'isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',
	        isDaylightSavingTimeShifted
	    );

	    function createUnix(input) {
	        return createLocal(input * 1000);
	    }

	    function createInZone() {
	        return createLocal.apply(null, arguments).parseZone();
	    }

	    function preParsePostFormat(string) {
	        return string;
	    }

	    var proto$1 = Locale.prototype;

	    proto$1.calendar = calendar;
	    proto$1.longDateFormat = longDateFormat;
	    proto$1.invalidDate = invalidDate;
	    proto$1.ordinal = ordinal;
	    proto$1.preparse = preParsePostFormat;
	    proto$1.postformat = preParsePostFormat;
	    proto$1.relativeTime = relativeTime;
	    proto$1.pastFuture = pastFuture;
	    proto$1.set = set;
	    proto$1.eras = localeEras;
	    proto$1.erasParse = localeErasParse;
	    proto$1.erasConvertYear = localeErasConvertYear;
	    proto$1.erasAbbrRegex = erasAbbrRegex;
	    proto$1.erasNameRegex = erasNameRegex;
	    proto$1.erasNarrowRegex = erasNarrowRegex;

	    proto$1.months = localeMonths;
	    proto$1.monthsShort = localeMonthsShort;
	    proto$1.monthsParse = localeMonthsParse;
	    proto$1.monthsRegex = monthsRegex;
	    proto$1.monthsShortRegex = monthsShortRegex;
	    proto$1.week = localeWeek;
	    proto$1.firstDayOfYear = localeFirstDayOfYear;
	    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

	    proto$1.weekdays = localeWeekdays;
	    proto$1.weekdaysMin = localeWeekdaysMin;
	    proto$1.weekdaysShort = localeWeekdaysShort;
	    proto$1.weekdaysParse = localeWeekdaysParse;

	    proto$1.weekdaysRegex = weekdaysRegex;
	    proto$1.weekdaysShortRegex = weekdaysShortRegex;
	    proto$1.weekdaysMinRegex = weekdaysMinRegex;

	    proto$1.isPM = localeIsPM;
	    proto$1.meridiem = localeMeridiem;

	    function get$1(format, index, field, setter) {
	        var locale = getLocale(),
	            utc = createUTC().set(setter, index);
	        return locale[field](utc, format);
	    }

	    function listMonthsImpl(format, index, field) {
	        if (isNumber(format)) {
	            index = format;
	            format = undefined;
	        }

	        format = format || '';

	        if (index != null) {
	            return get$1(format, index, field, 'month');
	        }

	        var i,
	            out = [];
	        for (i = 0; i < 12; i++) {
	            out[i] = get$1(format, i, field, 'month');
	        }
	        return out;
	    }

	    // ()
	    // (5)
	    // (fmt, 5)
	    // (fmt)
	    // (true)
	    // (true, 5)
	    // (true, fmt, 5)
	    // (true, fmt)
	    function listWeekdaysImpl(localeSorted, format, index, field) {
	        if (typeof localeSorted === 'boolean') {
	            if (isNumber(format)) {
	                index = format;
	                format = undefined;
	            }

	            format = format || '';
	        } else {
	            format = localeSorted;
	            index = format;
	            localeSorted = false;

	            if (isNumber(format)) {
	                index = format;
	                format = undefined;
	            }

	            format = format || '';
	        }

	        var locale = getLocale(),
	            shift = localeSorted ? locale._week.dow : 0,
	            i,
	            out = [];

	        if (index != null) {
	            return get$1(format, (index + shift) % 7, field, 'day');
	        }

	        for (i = 0; i < 7; i++) {
	            out[i] = get$1(format, (i + shift) % 7, field, 'day');
	        }
	        return out;
	    }

	    function listMonths(format, index) {
	        return listMonthsImpl(format, index, 'months');
	    }

	    function listMonthsShort(format, index) {
	        return listMonthsImpl(format, index, 'monthsShort');
	    }

	    function listWeekdays(localeSorted, format, index) {
	        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
	    }

	    function listWeekdaysShort(localeSorted, format, index) {
	        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
	    }

	    function listWeekdaysMin(localeSorted, format, index) {
	        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
	    }

	    getSetGlobalLocale('en', {
	        eras: [
	            {
	                since: '0001-01-01',
	                until: +Infinity,
	                offset: 1,
	                name: 'Anno Domini',
	                narrow: 'AD',
	                abbr: 'AD',
	            },
	            {
	                since: '0000-12-31',
	                until: -Infinity,
	                offset: 1,
	                name: 'Before Christ',
	                narrow: 'BC',
	                abbr: 'BC',
	            },
	        ],
	        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
	        ordinal: function (number) {
	            var b = number % 10,
	                output =
	                    toInt((number % 100) / 10) === 1
	                        ? 'th'
	                        : b === 1
	                        ? 'st'
	                        : b === 2
	                        ? 'nd'
	                        : b === 3
	                        ? 'rd'
	                        : 'th';
	            return number + output;
	        },
	    });

	    // Side effect imports

	    hooks.lang = deprecate(
	        'moment.lang is deprecated. Use moment.locale instead.',
	        getSetGlobalLocale
	    );
	    hooks.langData = deprecate(
	        'moment.langData is deprecated. Use moment.localeData instead.',
	        getLocale
	    );

	    var mathAbs = Math.abs;

	    function abs() {
	        var data = this._data;

	        this._milliseconds = mathAbs(this._milliseconds);
	        this._days = mathAbs(this._days);
	        this._months = mathAbs(this._months);

	        data.milliseconds = mathAbs(data.milliseconds);
	        data.seconds = mathAbs(data.seconds);
	        data.minutes = mathAbs(data.minutes);
	        data.hours = mathAbs(data.hours);
	        data.months = mathAbs(data.months);
	        data.years = mathAbs(data.years);

	        return this;
	    }

	    function addSubtract$1(duration, input, value, direction) {
	        var other = createDuration(input, value);

	        duration._milliseconds += direction * other._milliseconds;
	        duration._days += direction * other._days;
	        duration._months += direction * other._months;

	        return duration._bubble();
	    }

	    // supports only 2.0-style add(1, 's') or add(duration)
	    function add$1(input, value) {
	        return addSubtract$1(this, input, value, 1);
	    }

	    // supports only 2.0-style subtract(1, 's') or subtract(duration)
	    function subtract$1(input, value) {
	        return addSubtract$1(this, input, value, -1);
	    }

	    function absCeil(number) {
	        if (number < 0) {
	            return Math.floor(number);
	        } else {
	            return Math.ceil(number);
	        }
	    }

	    function bubble() {
	        var milliseconds = this._milliseconds,
	            days = this._days,
	            months = this._months,
	            data = this._data,
	            seconds,
	            minutes,
	            hours,
	            years,
	            monthsFromDays;

	        // if we have a mix of positive and negative values, bubble down first
	        // check: https://github.com/moment/moment/issues/2166
	        if (
	            !(
	                (milliseconds >= 0 && days >= 0 && months >= 0) ||
	                (milliseconds <= 0 && days <= 0 && months <= 0)
	            )
	        ) {
	            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
	            days = 0;
	            months = 0;
	        }

	        // The following code bubbles up values, see the tests for
	        // examples of what that means.
	        data.milliseconds = milliseconds % 1000;

	        seconds = absFloor(milliseconds / 1000);
	        data.seconds = seconds % 60;

	        minutes = absFloor(seconds / 60);
	        data.minutes = minutes % 60;

	        hours = absFloor(minutes / 60);
	        data.hours = hours % 24;

	        days += absFloor(hours / 24);

	        // convert days to months
	        monthsFromDays = absFloor(daysToMonths(days));
	        months += monthsFromDays;
	        days -= absCeil(monthsToDays(monthsFromDays));

	        // 12 months -> 1 year
	        years = absFloor(months / 12);
	        months %= 12;

	        data.days = days;
	        data.months = months;
	        data.years = years;

	        return this;
	    }

	    function daysToMonths(days) {
	        // 400 years have 146097 days (taking into account leap year rules)
	        // 400 years have 12 months === 4800
	        return (days * 4800) / 146097;
	    }

	    function monthsToDays(months) {
	        // the reverse of daysToMonths
	        return (months * 146097) / 4800;
	    }

	    function as(units) {
	        if (!this.isValid()) {
	            return NaN;
	        }
	        var days,
	            months,
	            milliseconds = this._milliseconds;

	        units = normalizeUnits(units);

	        if (units === 'month' || units === 'quarter' || units === 'year') {
	            days = this._days + milliseconds / 864e5;
	            months = this._months + daysToMonths(days);
	            switch (units) {
	                case 'month':
	                    return months;
	                case 'quarter':
	                    return months / 3;
	                case 'year':
	                    return months / 12;
	            }
	        } else {
	            // handle milliseconds separately because of floating point math errors (issue #1867)
	            days = this._days + Math.round(monthsToDays(this._months));
	            switch (units) {
	                case 'week':
	                    return days / 7 + milliseconds / 6048e5;
	                case 'day':
	                    return days + milliseconds / 864e5;
	                case 'hour':
	                    return days * 24 + milliseconds / 36e5;
	                case 'minute':
	                    return days * 1440 + milliseconds / 6e4;
	                case 'second':
	                    return days * 86400 + milliseconds / 1000;
	                // Math.floor prevents floating point math errors here
	                case 'millisecond':
	                    return Math.floor(days * 864e5) + milliseconds;
	                default:
	                    throw new Error('Unknown unit ' + units);
	            }
	        }
	    }

	    // TODO: Use this.as('ms')?
	    function valueOf$1() {
	        if (!this.isValid()) {
	            return NaN;
	        }
	        return (
	            this._milliseconds +
	            this._days * 864e5 +
	            (this._months % 12) * 2592e6 +
	            toInt(this._months / 12) * 31536e6
	        );
	    }

	    function makeAs(alias) {
	        return function () {
	            return this.as(alias);
	        };
	    }

	    var asMilliseconds = makeAs('ms'),
	        asSeconds = makeAs('s'),
	        asMinutes = makeAs('m'),
	        asHours = makeAs('h'),
	        asDays = makeAs('d'),
	        asWeeks = makeAs('w'),
	        asMonths = makeAs('M'),
	        asQuarters = makeAs('Q'),
	        asYears = makeAs('y');

	    function clone$1() {
	        return createDuration(this);
	    }

	    function get$2(units) {
	        units = normalizeUnits(units);
	        return this.isValid() ? this[units + 's']() : NaN;
	    }

	    function makeGetter(name) {
	        return function () {
	            return this.isValid() ? this._data[name] : NaN;
	        };
	    }

	    var milliseconds = makeGetter('milliseconds'),
	        seconds = makeGetter('seconds'),
	        minutes = makeGetter('minutes'),
	        hours = makeGetter('hours'),
	        days = makeGetter('days'),
	        months = makeGetter('months'),
	        years = makeGetter('years');

	    function weeks() {
	        return absFloor(this.days() / 7);
	    }

	    var round = Math.round,
	        thresholds = {
	            ss: 44, // a few seconds to seconds
	            s: 45, // seconds to minute
	            m: 45, // minutes to hour
	            h: 22, // hours to day
	            d: 26, // days to month/week
	            w: null, // weeks to month
	            M: 11, // months to year
	        };

	    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
	    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
	        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
	    }

	    function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) {
	        var duration = createDuration(posNegDuration).abs(),
	            seconds = round(duration.as('s')),
	            minutes = round(duration.as('m')),
	            hours = round(duration.as('h')),
	            days = round(duration.as('d')),
	            months = round(duration.as('M')),
	            weeks = round(duration.as('w')),
	            years = round(duration.as('y')),
	            a =
	                (seconds <= thresholds.ss && ['s', seconds]) ||
	                (seconds < thresholds.s && ['ss', seconds]) ||
	                (minutes <= 1 && ['m']) ||
	                (minutes < thresholds.m && ['mm', minutes]) ||
	                (hours <= 1 && ['h']) ||
	                (hours < thresholds.h && ['hh', hours]) ||
	                (days <= 1 && ['d']) ||
	                (days < thresholds.d && ['dd', days]);

	        if (thresholds.w != null) {
	            a =
	                a ||
	                (weeks <= 1 && ['w']) ||
	                (weeks < thresholds.w && ['ww', weeks]);
	        }
	        a = a ||
	            (months <= 1 && ['M']) ||
	            (months < thresholds.M && ['MM', months]) ||
	            (years <= 1 && ['y']) || ['yy', years];

	        a[2] = withoutSuffix;
	        a[3] = +posNegDuration > 0;
	        a[4] = locale;
	        return substituteTimeAgo.apply(null, a);
	    }

	    // This function allows you to set the rounding function for relative time strings
	    function getSetRelativeTimeRounding(roundingFunction) {
	        if (roundingFunction === undefined) {
	            return round;
	        }
	        if (typeof roundingFunction === 'function') {
	            round = roundingFunction;
	            return true;
	        }
	        return false;
	    }

	    // This function allows you to set a threshold for relative time strings
	    function getSetRelativeTimeThreshold(threshold, limit) {
	        if (thresholds[threshold] === undefined) {
	            return false;
	        }
	        if (limit === undefined) {
	            return thresholds[threshold];
	        }
	        thresholds[threshold] = limit;
	        if (threshold === 's') {
	            thresholds.ss = limit - 1;
	        }
	        return true;
	    }

	    function humanize(argWithSuffix, argThresholds) {
	        if (!this.isValid()) {
	            return this.localeData().invalidDate();
	        }

	        var withSuffix = false,
	            th = thresholds,
	            locale,
	            output;

	        if (typeof argWithSuffix === 'object') {
	            argThresholds = argWithSuffix;
	            argWithSuffix = false;
	        }
	        if (typeof argWithSuffix === 'boolean') {
	            withSuffix = argWithSuffix;
	        }
	        if (typeof argThresholds === 'object') {
	            th = Object.assign({}, thresholds, argThresholds);
	            if (argThresholds.s != null && argThresholds.ss == null) {
	                th.ss = argThresholds.s - 1;
	            }
	        }

	        locale = this.localeData();
	        output = relativeTime$1(this, !withSuffix, th, locale);

	        if (withSuffix) {
	            output = locale.pastFuture(+this, output);
	        }

	        return locale.postformat(output);
	    }

	    var abs$1 = Math.abs;

	    function sign(x) {
	        return (x > 0) - (x < 0) || +x;
	    }

	    function toISOString$1() {
	        // for ISO strings we do not use the normal bubbling rules:
	        //  * milliseconds bubble up until they become hours
	        //  * days do not bubble at all
	        //  * months bubble up until they become years
	        // This is because there is no context-free conversion between hours and days
	        // (think of clock changes)
	        // and also not between days and months (28-31 days per month)
	        if (!this.isValid()) {
	            return this.localeData().invalidDate();
	        }

	        var seconds = abs$1(this._milliseconds) / 1000,
	            days = abs$1(this._days),
	            months = abs$1(this._months),
	            minutes,
	            hours,
	            years,
	            s,
	            total = this.asSeconds(),
	            totalSign,
	            ymSign,
	            daysSign,
	            hmsSign;

	        if (!total) {
	            // this is the same as C#'s (Noda) and python (isodate)...
	            // but not other JS (goog.date)
	            return 'P0D';
	        }

	        // 3600 seconds -> 60 minutes -> 1 hour
	        minutes = absFloor(seconds / 60);
	        hours = absFloor(minutes / 60);
	        seconds %= 60;
	        minutes %= 60;

	        // 12 months -> 1 year
	        years = absFloor(months / 12);
	        months %= 12;

	        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
	        s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';

	        totalSign = total < 0 ? '-' : '';
	        ymSign = sign(this._months) !== sign(total) ? '-' : '';
	        daysSign = sign(this._days) !== sign(total) ? '-' : '';
	        hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

	        return (
	            totalSign +
	            'P' +
	            (years ? ymSign + years + 'Y' : '') +
	            (months ? ymSign + months + 'M' : '') +
	            (days ? daysSign + days + 'D' : '') +
	            (hours || minutes || seconds ? 'T' : '') +
	            (hours ? hmsSign + hours + 'H' : '') +
	            (minutes ? hmsSign + minutes + 'M' : '') +
	            (seconds ? hmsSign + s + 'S' : '')
	        );
	    }

	    var proto$2 = Duration.prototype;

	    proto$2.isValid = isValid$1;
	    proto$2.abs = abs;
	    proto$2.add = add$1;
	    proto$2.subtract = subtract$1;
	    proto$2.as = as;
	    proto$2.asMilliseconds = asMilliseconds;
	    proto$2.asSeconds = asSeconds;
	    proto$2.asMinutes = asMinutes;
	    proto$2.asHours = asHours;
	    proto$2.asDays = asDays;
	    proto$2.asWeeks = asWeeks;
	    proto$2.asMonths = asMonths;
	    proto$2.asQuarters = asQuarters;
	    proto$2.asYears = asYears;
	    proto$2.valueOf = valueOf$1;
	    proto$2._bubble = bubble;
	    proto$2.clone = clone$1;
	    proto$2.get = get$2;
	    proto$2.milliseconds = milliseconds;
	    proto$2.seconds = seconds;
	    proto$2.minutes = minutes;
	    proto$2.hours = hours;
	    proto$2.days = days;
	    proto$2.weeks = weeks;
	    proto$2.months = months;
	    proto$2.years = years;
	    proto$2.humanize = humanize;
	    proto$2.toISOString = toISOString$1;
	    proto$2.toString = toISOString$1;
	    proto$2.toJSON = toISOString$1;
	    proto$2.locale = locale;
	    proto$2.localeData = localeData;

	    proto$2.toIsoString = deprecate(
	        'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',
	        toISOString$1
	    );
	    proto$2.lang = lang;

	    // FORMATTING

	    addFormatToken('X', 0, 0, 'unix');
	    addFormatToken('x', 0, 0, 'valueOf');

	    // PARSING

	    addRegexToken('x', matchSigned);
	    addRegexToken('X', matchTimestamp);
	    addParseToken('X', function (input, array, config) {
	        config._d = new Date(parseFloat(input) * 1000);
	    });
	    addParseToken('x', function (input, array, config) {
	        config._d = new Date(toInt(input));
	    });

	    //! moment.js

	    hooks.version = '2.29.1';

	    setHookCallback(createLocal);

	    hooks.fn = proto;
	    hooks.min = min;
	    hooks.max = max;
	    hooks.now = now;
	    hooks.utc = createUTC;
	    hooks.unix = createUnix;
	    hooks.months = listMonths;
	    hooks.isDate = isDate;
	    hooks.locale = getSetGlobalLocale;
	    hooks.invalid = createInvalid;
	    hooks.duration = createDuration;
	    hooks.isMoment = isMoment;
	    hooks.weekdays = listWeekdays;
	    hooks.parseZone = createInZone;
	    hooks.localeData = getLocale;
	    hooks.isDuration = isDuration;
	    hooks.monthsShort = listMonthsShort;
	    hooks.weekdaysMin = listWeekdaysMin;
	    hooks.defineLocale = defineLocale;
	    hooks.updateLocale = updateLocale;
	    hooks.locales = listLocales;
	    hooks.weekdaysShort = listWeekdaysShort;
	    hooks.normalizeUnits = normalizeUnits;
	    hooks.relativeTimeRounding = getSetRelativeTimeRounding;
	    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
	    hooks.calendarFormat = getCalendarFormat;
	    hooks.prototype = proto;

	    // currently HTML5 input type only supports 24-hour formats
	    hooks.HTML5_FMT = {
	        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
	        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
	        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
	        DATE: 'YYYY-MM-DD', // <input type="date" />
	        TIME: 'HH:mm', // <input type="time" />
	        TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
	        TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
	        WEEK: 'GGGG-[W]WW', // <input type="week" />
	        MONTH: 'YYYY-MM', // <input type="month" />
	    };

	    return hooks;

	})));
	}(moment$1));

	var moment = moment$1.exports;

	/**
	 * Datart
	 *
	 * Copyright 2021
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	function getStyleValue(styleConfigs, paths) {
	    return getValue(styleConfigs, paths, 'value');
	}
	function getValue(configs, paths, targetKey) {
	    var key = paths === null || paths === void 0 ? void 0 : paths.shift();
	    var group = configs === null || configs === void 0 ? void 0 : configs.find(function (sc) { return sc.key === key; });
	    if (!group) {
	        return null;
	    }
	    if ((paths === null || paths === void 0 ? void 0 : paths.length) === 0) {
	        return isEmpty(group) ? null : group[targetKey];
	    }
	    return getValue(group.rows || [], paths, targetKey);
	}
	function transformMeta(model) {
	    if (!model) {
	        return undefined;
	    }
	    var jsonObj = JSON.parse(model);
	    return Object.keys(jsonObj).map(function (colKey) { return (__assign(__assign({}, jsonObj[colKey]), { id: colKey, category: ChartDataViewFieldCategory.Field })); });
	}

	var _a$1, _b;
	var VariableTypes;
	(function (VariableTypes) {
	    VariableTypes["Query"] = "QUERY";
	    VariableTypes["Permission"] = "PERMISSION";
	})(VariableTypes || (VariableTypes = {}));
	var VariableScopes;
	(function (VariableScopes) {
	    VariableScopes["Public"] = "PUBLIC";
	    VariableScopes["Private"] = "PRIVATE";
	})(VariableScopes || (VariableScopes = {}));
	var VariableValueTypes;
	(function (VariableValueTypes) {
	    VariableValueTypes["String"] = "STRING";
	    VariableValueTypes["Number"] = "NUMERIC";
	    VariableValueTypes["Date"] = "DATE";
	    VariableValueTypes["Expression"] = "FRAGMENT";
	})(VariableValueTypes || (VariableValueTypes = {}));
	(_a$1 = {},
	    _a$1[VariableTypes.Query] = '查询变量',
	    _a$1[VariableTypes.Permission] = '权限变量',
	    _a$1);
	(_b = {},
	    _b[VariableValueTypes.String] = '字符',
	    _b[VariableValueTypes.Number] = '数值',
	    _b[VariableValueTypes.Date] = '日期',
	    _b[VariableValueTypes.Expression] = '表达式',
	    _b);
	var DEFAULT_VALUE_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

	/**
	 * Datart
	 *
	 * Copyright 2021
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	function getTimeRange(amount, unit) {
	    return function (unitOfTime) {
	        var startTime = moment().add(amount === null || amount === void 0 ? void 0 : amount[0], unit).startOf(unitOfTime);
	        var endTime = moment().add(amount === null || amount === void 0 ? void 0 : amount[1], unit).endOf(unitOfTime);
	        return [
	            startTime.format(DEFAULT_VALUE_DATE_FORMAT),
	            endTime.format(DEFAULT_VALUE_DATE_FORMAT),
	        ];
	    };
	}
	function getTime(amount, unit) {
	    return function (unitOfTime, isStart) {
	        if (!!isStart) {
	            return moment().add(amount, unit).startOf(unitOfTime);
	        }
	        return moment().add(amount, unit).add(1, unit).startOf(unitOfTime);
	    };
	}
	function formatTime(time, format) {
	    return moment(time).format(format);
	}
	function recommendTimeRangeConverter(relativeTimeRange) {
	    var timeRange = getTimeRange()('d');
	    switch (relativeTimeRange) {
	        case RECOMMEND_TIME.TODAY:
	            break;
	        case RECOMMEND_TIME.YESTERDAY:
	            timeRange = getTimeRange([-1, 0], 'd')('d');
	            break;
	        case RECOMMEND_TIME.THISWEEK:
	            timeRange = getTimeRange()('w');
	            break;
	        case RECOMMEND_TIME.LAST_7_DAYS:
	            timeRange = getTimeRange([-7, 0], 'd')('d');
	            break;
	        case RECOMMEND_TIME.LAST_30_DAYS:
	            timeRange = getTimeRange([-30, 0], 'd')('d');
	            break;
	        case RECOMMEND_TIME.LAST_90_DAYS:
	            timeRange = getTimeRange([-90, 0], 'd')('d');
	            break;
	        case RECOMMEND_TIME.LAST_1_MONTH:
	            timeRange = getTimeRange()('M');
	            break;
	        case RECOMMEND_TIME.LAST_1_YEAR:
	            timeRange = getTimeRange()('y');
	            break;
	    }
	    return timeRange;
	}

	/**
	 * Datart
	 *
	 * Copyright 2021
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var transformToViewConfig = function (viewConfig) {
	    var viewConfigMap = viewConfig ? JSON.parse(viewConfig) : {};
	    var obj = {};
	    if (viewConfig) {
	        var fields = [
	            'cache',
	            'cacheExpires',
	            'concurrencyControl',
	            'concurrencyControlMode',
	        ];
	        fields.forEach(function (v) {
	            obj[v] = viewConfigMap === null || viewConfigMap === void 0 ? void 0 : viewConfigMap[v];
	        });
	    }
	    return obj;
	};
	var ChartDataRequestBuilder = /** @class */ (function () {
	    function ChartDataRequestBuilder(dataView, dataConfigs, settingConfigs, pageInfo, script) {
	        this.extraSorters = [];
	        this.normalizeFilters = function (fields) {
	            var _timeConverter = function (visualType, value) {
	                if (visualType !== 'DATE') {
	                    return value;
	                }
	                if (Boolean(value) && typeof value === 'object' && 'unit' in value) {
	                    var time = getTime(+(value.direction + value.amount), value.unit)(value.unit, value.isStart);
	                    return formatTime(time, FILTER_TIME_FORMATTER_IN_QUERY);
	                }
	                return formatTime(value, FILTER_TIME_FORMATTER_IN_QUERY);
	            };
	            var _transformFieldValues = function (field) {
	                var _a, _b, _c, _d, _e, _f;
	                var conditionValue = (_b = (_a = field.filter) === null || _a === void 0 ? void 0 : _a.condition) === null || _b === void 0 ? void 0 : _b.value;
	                if (!conditionValue) {
	                    return null;
	                }
	                if (Array.isArray(conditionValue)) {
	                    return conditionValue
	                        .map(function (v) {
	                        var _a, _b;
	                        if (IsKeyIn(v, 'key')) {
	                            var listItem = v;
	                            if (!listItem.isSelected) {
	                                return undefined;
	                            }
	                            return {
	                                value: listItem.key,
	                                valueType: field.type,
	                            };
	                        }
	                        else {
	                            return {
	                                value: _timeConverter((_b = (_a = field.filter) === null || _a === void 0 ? void 0 : _a.condition) === null || _b === void 0 ? void 0 : _b.visualType, v),
	                                valueType: field.type,
	                            };
	                        }
	                    })
	                        .filter(Boolean);
	                }
	                if (((_d = (_c = field === null || field === void 0 ? void 0 : field.filter) === null || _c === void 0 ? void 0 : _c.condition) === null || _d === void 0 ? void 0 : _d.type) === FilterConditionType.RecommendTime) {
	                    var timeRange = recommendTimeRangeConverter(conditionValue);
	                    return (timeRange || []).map(function (t) { return ({
	                        value: t,
	                        valueType: field.type,
	                    }); });
	                }
	                return [
	                    {
	                        value: _timeConverter((_f = (_e = field.filter) === null || _e === void 0 ? void 0 : _e.condition) === null || _f === void 0 ? void 0 : _f.visualType, conditionValue),
	                        valueType: field.type,
	                    },
	                ];
	            };
	            return fields.map(function (field) {
	                var _a, _b;
	                return ({
	                    aggOperator: field.aggregate === AggregateFieldActionType.NONE
	                        ? null
	                        : field.aggregate,
	                    column: field.colName,
	                    sqlOperator: (_b = (_a = field.filter) === null || _a === void 0 ? void 0 : _a.condition) === null || _b === void 0 ? void 0 : _b.operator,
	                    values: _transformFieldValues(field) || [],
	                });
	            });
	        };
	        this.dataView = dataView;
	        this.chartDataConfigs = dataConfigs || [];
	        this.charSettingConfigs = settingConfigs || [];
	        this.pageInfo = pageInfo || {};
	        this.script = script || false;
	    }
	    ChartDataRequestBuilder.prototype.buildAggregators = function () {
	        var aggColumns = this.chartDataConfigs.reduce(function (acc, cur) {
	            if (!cur.rows) {
	                return acc;
	            }
	            if (cur.type === ChartDataSectionType.AGGREGATE ||
	                cur.type === ChartDataSectionType.SIZE ||
	                cur.type === ChartDataSectionType.INFO) {
	                return acc.concat(cur.rows);
	            }
	            return acc;
	        }, []);
	        return aggColumns.map(function (aggCol) { return ({
	            column: aggCol.colName,
	            sqlOperator: aggCol.aggregate,
	        }); });
	    };
	    ChartDataRequestBuilder.prototype.buildGroups = function () {
	        var groupColumns = this.buildGroupColumns();
	        return groupColumns.map(function (groupCol) { return ({ column: groupCol.colName }); });
	    };
	    ChartDataRequestBuilder.prototype.buildFilters = function () {
	        var fields = (this.chartDataConfigs || [])
	            .reduce(function (acc, cur) {
	            if (!cur.rows || cur.type !== ChartDataSectionType.FILTER) {
	                return acc;
	            }
	            return acc.concat(cur.rows);
	        }, [])
	            .filter(function (col) { var _a; return Boolean((_a = col.filter) === null || _a === void 0 ? void 0 : _a.condition); })
	            .filter(function (col) {
	            var _a, _b, _c, _d, _e;
	            if (Array.isArray((_b = (_a = col.filter) === null || _a === void 0 ? void 0 : _a.condition) === null || _b === void 0 ? void 0 : _b.value)) {
	                return Boolean((_e = (_d = (_c = col.filter) === null || _c === void 0 ? void 0 : _c.condition) === null || _d === void 0 ? void 0 : _d.value) === null || _e === void 0 ? void 0 : _e.length);
	            }
	            return true;
	        })
	            .map(function (col) { return col; });
	        return this.normalizeFilters(fields);
	    };
	    ChartDataRequestBuilder.prototype.buildOrders = function () {
	        var _this = this;
	        var sortColumns = this.chartDataConfigs
	            .reduce(function (acc, cur) {
	            if (!cur.rows) {
	                return acc;
	            }
	            if (cur.type === ChartDataSectionType.GROUP ||
	                cur.type === ChartDataSectionType.AGGREGATE ||
	                cur.type === ChartDataSectionType.MIXED) {
	                return acc.concat(cur.rows);
	            }
	            return acc;
	        }, [])
	            .filter(function (col) {
	            var _a, _b;
	            return ((_a = col === null || col === void 0 ? void 0 : col.sort) === null || _a === void 0 ? void 0 : _a.type) &&
	                [SortActionType.ASC, SortActionType.DESC].includes((_b = col === null || col === void 0 ? void 0 : col.sort) === null || _b === void 0 ? void 0 : _b.type);
	        });
	        var originalSorters = sortColumns.map(function (aggCol) {
	            var _a;
	            return ({
	                column: aggCol.colName,
	                operator: (_a = aggCol.sort) === null || _a === void 0 ? void 0 : _a.type,
	                aggOperator: aggCol.aggregate,
	            });
	        });
	        return originalSorters
	            .reduce(function (acc, cur) {
	            var _a;
	            var uniqSorter = function (sorter) {
	                var _a;
	                return sorter.column + "-" + (((_a = sorter.aggOperator) === null || _a === void 0 ? void 0 : _a.length) > 0 ? sorter.aggOperator : '');
	            };
	            var newSorter = (_a = _this.extraSorters) === null || _a === void 0 ? void 0 : _a.find(function (extraSorter) { return uniqSorter(extraSorter) === uniqSorter(cur); });
	            if (newSorter) {
	                return acc;
	            }
	            return acc.concat([cur]);
	        }, [])
	            .concat(this.extraSorters)
	            .filter(function (sorter) { return Boolean(sorter === null || sorter === void 0 ? void 0 : sorter.operator); });
	    };
	    ChartDataRequestBuilder.prototype.buildPageInfo = function () {
	        var _a;
	        var settingStyles = this.charSettingConfigs;
	        var pageSize = getStyleValue(settingStyles, ['paging', 'pageSize']);
	        var enablePaging = getStyleValue(settingStyles, [
	            'paging',
	            'enablePaging',
	        ]);
	        return {
	            countTotal: !!enablePaging,
	            pageNo: (_a = this.pageInfo) === null || _a === void 0 ? void 0 : _a.pageNo,
	            pageSize: pageSize || 1000,
	        };
	    };
	    ChartDataRequestBuilder.prototype.buildFunctionColumns = function () {
	        var _removeSquareBrackets = function (expression) {
	            if (!expression) {
	                return '';
	            }
	            return expression.replaceAll('[', '').replaceAll(']', '');
	        };
	        return (this.dataView.computedFields || []).map(function (f) { return ({
	            alias: f.id,
	            snippet: _removeSquareBrackets(f.expression),
	        }); });
	    };
	    ChartDataRequestBuilder.prototype.buildSelectColumns = function () {
	        var selectColumns = this.chartDataConfigs.reduce(function (acc, cur) {
	            if (!cur.rows) {
	                return acc;
	            }
	            if (cur.type === ChartDataSectionType.MIXED) {
	                return acc.concat(cur.rows);
	            }
	            return acc;
	        }, []);
	        return selectColumns.map(function (col) { return col.colName; });
	    };
	    ChartDataRequestBuilder.prototype.buildViewConfigs = function () {
	        var _a;
	        return transformToViewConfig((_a = this.dataView) === null || _a === void 0 ? void 0 : _a.config);
	    };
	    ChartDataRequestBuilder.prototype.addExtraSorters = function (sorters) {
	        if (!isEmptyArray(sorters)) {
	            this.extraSorters = this.extraSorters.concat(sorters);
	        }
	        return this;
	    };
	    ChartDataRequestBuilder.prototype.build = function () {
	        var _a;
	        return __assign({ viewId: (_a = this.dataView) === null || _a === void 0 ? void 0 : _a.id, aggregators: this.buildAggregators(), groups: this.buildGroups(), filters: this.buildFilters(), orders: this.buildOrders(), pageInfo: this.buildPageInfo(), functionColumns: this.buildFunctionColumns(), columns: this.buildSelectColumns(), script: this.script }, this.buildViewConfigs());
	    };
	    ChartDataRequestBuilder.prototype.buildGroupColumns = function () {
	        var groupColumns = this.chartDataConfigs.reduce(function (acc, cur) {
	            if (!cur.rows) {
	                return acc;
	            }
	            if (cur.type === ChartDataSectionType.GROUP ||
	                cur.type === ChartDataSectionType.COLOR) {
	                return acc.concat(cur.rows);
	            }
	            return acc;
	        }, []);
	        return groupColumns;
	    };
	    return ChartDataRequestBuilder;
	}());

	/**
	 * Datart
	 *
	 * Copyright 2021
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var ControllerFacadeTypes;
	(function (ControllerFacadeTypes) {
	    ControllerFacadeTypes["DropdownList"] = "dropdownList";
	    ControllerFacadeTypes["RadioGroup"] = "radioGroup";
	    ControllerFacadeTypes["CheckboxGroup"] = "checkboxGroup";
	    ControllerFacadeTypes["MultiDropdownList"] = "multiDropdownList";
	    ControllerFacadeTypes["RangeTime"] = "rangeTime";
	    ControllerFacadeTypes["RangeTimePicker"] = "rangeTimePicker";
	    ControllerFacadeTypes["RecommendTime"] = "recommendTime";
	    ControllerFacadeTypes["RangeValue"] = "rangeValue";
	    ControllerFacadeTypes["Text"] = "text";
	    ControllerFacadeTypes["Tree"] = "tree";
	    ControllerFacadeTypes["Value"] = "value";
	    ControllerFacadeTypes["Time"] = "time";
	    ControllerFacadeTypes["Slider"] = "slider";
	    ControllerFacadeTypes["RangeSlider"] = "rangeSlider";
	})(ControllerFacadeTypes || (ControllerFacadeTypes = {}));
	var ControllerRadioFacadeTypes;
	(function (ControllerRadioFacadeTypes) {
	    ControllerRadioFacadeTypes["Default"] = "default";
	    ControllerRadioFacadeTypes["Button"] = "button";
	})(ControllerRadioFacadeTypes || (ControllerRadioFacadeTypes = {}));
	var TimeFilterValueCategory;
	(function (TimeFilterValueCategory) {
	    TimeFilterValueCategory["Relative"] = "relative";
	    TimeFilterValueCategory["Exact"] = "exact";
	})(TimeFilterValueCategory || (TimeFilterValueCategory = {}));
	var ControllerVisibilityTypes;
	(function (ControllerVisibilityTypes) {
	    ControllerVisibilityTypes["Hide"] = "hide";
	    ControllerVisibilityTypes["Show"] = "show";
	    ControllerVisibilityTypes["Condition"] = "condition";
	})(ControllerVisibilityTypes || (ControllerVisibilityTypes = {}));

	var strEnumType = function (o) {
	    return o.reduce(function (res, key) {
	        res[key] = key;
	        return res;
	    }, Object.create(null));
	};
	var BoardTypeMap = strEnumType(['auto', 'free']);
	//
	strEnumType([
	    'rerender',
	    'clear',
	    'refresh',
	    'resize',
	    'loading',
	    'select',
	    'flush',
	]);
	strEnumType([
	    'chart',
	    'media',
	    'container',
	    'controller',
	    'query',
	    'reset',
	]);
	/**
	 * widgetChart 属于board 内部 配置存在widget 表内,
	 * 没有真实的datachartId
	 */
	strEnumType(['dataChart', 'widgetChart']);

	var _a;
	/** lg: 12,md: 12,sm: 8,xs: 2,xxs: 2 */
	var LAYOUT_COLS = {
	    lg: 12,
	    md: 12,
	    sm: 12,
	    xs: 2,
	    xxs: 2,
	};
	var BackgroundDefault = {
	    color: 'transparent',
	    image: '',
	    size: '100% 100%',
	    repeat: 'no-repeat', //'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat',
	};
	var AutoBoardWidgetBackgroundDefault = __assign(__assign({}, BackgroundDefault), { color: WHITE });
	__assign(__assign({}, BackgroundDefault), { color: PRIMARY });
	var BorderDefault = {
	    radius: 1,
	    width: 1,
	    style: 'solid',
	    color: 'transparent',
	};
	__assign(__assign({}, BorderDefault), { width: 0 });
	// setting
	var TEXT_ALIGN_ENUM = strEnumType(['left', 'center', 'right']);
	var BORDER_STYLE_ENUM = strEnumType([
	    'solid',
	    'dashed',
	    'dotted',
	    'double',
	    'none',
	    'hidden',
	    'ridge',
	    'groove',
	    'inset',
	    'outset',
	]);
	[
	    { name: '无', value: BORDER_STYLE_ENUM.none },
	    { name: '实线', value: BORDER_STYLE_ENUM.solid },
	    { name: '虚线', value: BORDER_STYLE_ENUM.dashed },
	    { name: '点线', value: BORDER_STYLE_ENUM.dotted },
	    { name: '双线', value: BORDER_STYLE_ENUM.double },
	    { name: '隐藏', value: BORDER_STYLE_ENUM.hidden },
	    { name: '凹槽', value: BORDER_STYLE_ENUM.groove },
	    { name: '垄状', value: BORDER_STYLE_ENUM.ridge },
	    { name: 'inset', value: BORDER_STYLE_ENUM.inset },
	    { name: 'outset', value: BORDER_STYLE_ENUM.outset },
	];
	var SCALE_MODE_ENUM = strEnumType([
	    'scaleWidth',
	    'scaleHeight',
	    'scaleFull',
	    'noScale',
	]);
	[
	    { name: '等比宽度缩放', value: SCALE_MODE_ENUM.scaleWidth },
	    { name: '等比高度缩放', value: SCALE_MODE_ENUM.scaleHeight },
	    { name: '全屏铺满', value: SCALE_MODE_ENUM.scaleFull },
	    { name: '实际尺寸', value: SCALE_MODE_ENUM.noScale },
	];
	var ValueOptionTypes;
	(function (ValueOptionTypes) {
	    ValueOptionTypes["Common"] = "common";
	    ValueOptionTypes["Custom"] = "custom";
	})(ValueOptionTypes || (ValueOptionTypes = {}));
	[
	    { name: '常规', value: ValueOptionTypes.Common },
	    { name: '自定义', value: ValueOptionTypes.Custom },
	];
	var ControllerVisibleTypes;
	(function (ControllerVisibleTypes) {
	    ControllerVisibleTypes["Show"] = "show";
	    ControllerVisibleTypes["Hide"] = "hide";
	    ControllerVisibleTypes["Condition"] = "condition";
	})(ControllerVisibleTypes || (ControllerVisibleTypes = {}));
	[
	    { name: '显示', value: ControllerVisibleTypes.Show },
	    { name: '隐藏', value: ControllerVisibleTypes.Hide },
	    { name: '条件', value: ControllerVisibleTypes.Condition },
	];
	[
	    { name: '等于', value: FilterSqlOperator.Equal },
	    { name: '不相等', value: FilterSqlOperator.NotEqual },
	    { name: '包含', value: FilterSqlOperator.In },
	    { name: '不包含', value: FilterSqlOperator.NotIn },
	    { name: '为空', value: FilterSqlOperator.Null },
	    { name: '不为空', value: FilterSqlOperator.NotNull },
	    { name: '前缀包含', value: FilterSqlOperator.PrefixContain },
	    { name: '前缀不包含', value: FilterSqlOperator.NotPrefixContain },
	    { name: '后缀包含', value: FilterSqlOperator.SuffixContain },
	    { name: '后缀不包含', value: FilterSqlOperator.NotSuffixContain },
	    { name: '区间', value: FilterSqlOperator.Between },
	    { name: '大于或等于', value: FilterSqlOperator.GreaterThanOrEqual },
	    { name: '小于或等于', value: FilterSqlOperator.LessThanOrEqual },
	    { name: '大于', value: FilterSqlOperator.GreaterThan },
	    { name: '小于', value: FilterSqlOperator.LessThan },
	];
	(_a = {},
	    _a[ControllerFacadeTypes.DropdownList] = [
	        FilterSqlOperator.Equal,
	        FilterSqlOperator.NotEqual,
	    ],
	    _a[ControllerFacadeTypes.MultiDropdownList] = [
	        FilterSqlOperator.In,
	        FilterSqlOperator.NotIn,
	    ],
	    _a[ControllerFacadeTypes.CheckboxGroup] = [
	        FilterSqlOperator.In,
	        FilterSqlOperator.NotIn,
	    ],
	    _a[ControllerFacadeTypes.RadioGroup] = [
	        FilterSqlOperator.Equal,
	        FilterSqlOperator.NotEqual,
	    ],
	    _a[ControllerFacadeTypes.Text] = [
	        FilterSqlOperator.Equal,
	        FilterSqlOperator.NotEqual,
	        FilterSqlOperator.Contain,
	        FilterSqlOperator.NotContain,
	        FilterSqlOperator.PrefixContain,
	        FilterSqlOperator.NotPrefixContain,
	        FilterSqlOperator.SuffixContain,
	        FilterSqlOperator.NotSuffixContain,
	    ],
	    _a[ControllerFacadeTypes.Value] = [
	        FilterSqlOperator.Equal,
	        FilterSqlOperator.NotEqual,
	        FilterSqlOperator.LessThan,
	        FilterSqlOperator.GreaterThan,
	        FilterSqlOperator.LessThanOrEqual,
	        FilterSqlOperator.GreaterThanOrEqual,
	    ],
	    _a[ControllerFacadeTypes.Time] = [
	        FilterSqlOperator.Equal,
	        FilterSqlOperator.NotEqual,
	        FilterSqlOperator.LessThan,
	        FilterSqlOperator.GreaterThan,
	        FilterSqlOperator.LessThanOrEqual,
	        FilterSqlOperator.GreaterThanOrEqual,
	    ],
	    _a[ControllerFacadeTypes.Slider] = [
	        FilterSqlOperator.Equal,
	        FilterSqlOperator.NotEqual,
	        FilterSqlOperator.LessThan,
	        FilterSqlOperator.GreaterThan,
	        FilterSqlOperator.LessThanOrEqual,
	        FilterSqlOperator.GreaterThanOrEqual,
	    ],
	    _a);
	[
	    { name: '左', value: TEXT_ALIGN_ENUM.left },
	    { name: '中', value: TEXT_ALIGN_ENUM.center },
	];

	/**
	 * Datart
	 *
	 * Copyright 2021
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	[
	    ControllerFacadeTypes.RangeTime,
	    ControllerFacadeTypes.RangeSlider,
	    ControllerFacadeTypes.RangeValue,
	];
	[
	    ControllerFacadeTypes.DropdownList,
	    ControllerFacadeTypes.MultiDropdownList,
	    ControllerFacadeTypes.RadioGroup,
	    ControllerFacadeTypes.Text,
	];
	[
	    ControllerFacadeTypes.RangeValue,
	    ControllerFacadeTypes.Value,
	    ControllerFacadeTypes.Slider,
	    ControllerFacadeTypes.RangeSlider,
	];
	[
	    ControllerFacadeTypes.RangeTime,
	    ControllerFacadeTypes.Time,
	];
	[
	    ControllerFacadeTypes.RangeTime,
	    ControllerFacadeTypes.RangeSlider,
	    ControllerFacadeTypes.RangeValue,
	];
	[
	    ControllerFacadeTypes.DropdownList,
	    ControllerFacadeTypes.MultiDropdownList,
	    ControllerFacadeTypes.RadioGroup,
	    ControllerFacadeTypes.Text,
	];
	[
	    ControllerFacadeTypes.DropdownList,
	    ControllerFacadeTypes.MultiDropdownList,
	    ControllerFacadeTypes.RadioGroup,
	    ControllerFacadeTypes.CheckboxGroup,
	];

	var VALUE_SPLITTER = '###';
	var fontDefault = {
	    fontFamily: FONT_FAMILY,
	    fontSize: '14',
	    fontWeight: 'normal',
	    fontStyle: 'normal',
	    color: G90,
	};
	var convertWidgetRelationsToObj = function (relations) {
	    if (relations === void 0) { relations = []; }
	    return relations.map(function (relation) {
	        try {
	            return __assign(__assign({}, relation), { config: JSON.parse(relation.config) });
	        }
	        catch (error) {
	            return __assign(__assign({}, relation), { config: { RelatedViewMap: {}, filterCovered: false } });
	        }
	    });
	};
	// get some css end
	// Controller
	var getLinkedColumn = function (targetWidgetId, triggerWidget) {
	    var _a, _b, _c, _d;
	    var relations = triggerWidget.relations;
	    var relation = relations.find(function (item) { return item.targetId === targetWidgetId; });
	    return (((_b = (_a = relation === null || relation === void 0 ? void 0 : relation.config) === null || _a === void 0 ? void 0 : _a.widgetToWidget) === null || _b === void 0 ? void 0 : _b.linkerColumn) ||
	        ((_d = (_c = relation === null || relation === void 0 ? void 0 : relation.config) === null || _c === void 0 ? void 0 : _c.widgetToWidget) === null || _d === void 0 ? void 0 : _d.triggerColumn) ||
	        '');
	};
	// TODO chart widget
	var getWidgetMapByServer = function (widgets, dataCharts, filterSearchParamsMap) {
	    var filterSearchParams = filterSearchParamsMap === null || filterSearchParamsMap === void 0 ? void 0 : filterSearchParamsMap.params, isMatchByName = filterSearchParamsMap === null || filterSearchParamsMap === void 0 ? void 0 : filterSearchParamsMap.isMatchByName;
	    var dataChartMap = dataCharts.reduce(function (acc, cur) {
	        acc[cur.id] = cur;
	        return acc;
	    }, {});
	    var widgetMap = widgets.reduce(function (acc, cur) {
	        var viewIds = cur.datachartId
	            ? [dataChartMap[cur.datachartId].viewId]
	            : cur.viewIds;
	        try {
	            var widget = __assign(__assign({}, cur), { config: JSON.parse(cur.config), relations: convertWidgetRelationsToObj(cur.relations), viewIds: viewIds });
	            // TODO migration about font 5 --xld
	            widget.config.nameConfig = __assign(__assign({}, fontDefault), widget.config.nameConfig);
	            // TODO migration about filter --xld
	            if (widget.config.type !== 'filter') {
	                acc[cur.id] = widget;
	            }
	            return acc;
	        }
	        catch (error) {
	            return acc;
	        }
	    }, {});
	    var wrappedDataCharts = [];
	    var controllerWidgets = []; // use for reset button
	    var widgetList = Object.values(widgetMap);
	    // 处理 widget包含关系 containerWidget 被包含的 widget.parentId 不为空
	    widgetList
	        .filter(function (w) { return w.parentId; })
	        .forEach(function (widget) {
	        var parentWidgetId = widget.parentId;
	        var childTabId = widget.config.tabId;
	        var curItem = widgetMap[parentWidgetId].config.content.itemMap[childTabId];
	        if (curItem) {
	            curItem.childWidgetId = widget.id;
	            curItem.name = widget.config.name;
	        }
	        else {
	            var newItem = {
	                tabId: childTabId,
	                name: widget.config.name,
	                childWidgetId: widget.id,
	            };
	            widgetMap[parentWidgetId].config.content.itemMap[childTabId] = newItem;
	        }
	    });
	    // 处理 controller config visibility依赖关系 id, url参数修改filter
	    widgetList
	        .filter(function (w) { return w.config.type === 'controller'; })
	        .forEach(function (widget) {
	        var _a, _b, _c, _d;
	        var content = widget.config.content;
	        // 根据 url参数修改filter 默认值
	        if (filterSearchParams) {
	            var paramsKey = Object.keys(filterSearchParams);
	            var matchKey = isMatchByName ? widget.config.name : widget.id;
	            if (paramsKey.includes(matchKey)) {
	                var _value = isMatchByName
	                    ? filterSearchParams[widget.config.name]
	                    : filterSearchParams[widget.id];
	                switch (content === null || content === void 0 ? void 0 : content.type) {
	                    case ControllerFacadeTypes.RangeTime:
	                        if (content.config.controllerDate &&
	                            ((_a = content.config.controllerDate) === null || _a === void 0 ? void 0 : _a.startTime) &&
	                            ((_b = content.config.controllerDate) === null || _b === void 0 ? void 0 : _b.endTime)) {
	                            content.config.controllerDate.startTime.exactValue =
	                                _value === null || _value === void 0 ? void 0 : _value[0];
	                            content.config.controllerDate.endTime.exactValue = _value === null || _value === void 0 ? void 0 : _value[0];
	                        }
	                        break;
	                    default:
	                        content.config.controllerValues = _value || [];
	                        break;
	                }
	            }
	        }
	        // 通过widget.relation 那里面的 targetId确定 关联controllerWidget 的真实ID
	        var _e = content.config.visibility, visibility = _e.visibilityType, condition = _e.condition;
	        var relations = widget.relations;
	        if (visibility === 'condition' && condition) {
	            var dependentFilterId = (_c = relations
	                .filter(function (re) { return re.config.type === 'controlToControl'; })
	                .map(function (re) { return re.targetId; })) === null || _c === void 0 ? void 0 : _c[0];
	            if (dependentFilterId) {
	                condition.dependentControllerId = dependentFilterId;
	            }
	        }
	        //处理 assistViewFields 旧数据 assistViewFields 是 string 类型 alpha.3版本之后 使用数组存储的 后续版本稳定之后 可以移除此逻辑
	        // TODO migration <<
	        if (typeof ((_d = content === null || content === void 0 ? void 0 : content.config) === null || _d === void 0 ? void 0 : _d.assistViewFields) === 'string') {
	            content.config.assistViewFields = content.config.assistViewFields.split(VALUE_SPLITTER);
	        }
	        // TODO migration >> --xld
	        controllerWidgets.push(widget);
	    });
	    // 处理 自有 chart widgetControl
	    widgetList
	        .filter(function (w) { return w.config.content.type === 'widgetChart'; })
	        .forEach(function (widget) {
	        var _a;
	        var content = widget.config.content;
	        widget.datachartId = ((_a = content.dataChart) === null || _a === void 0 ? void 0 : _a.id) || '';
	        wrappedDataCharts.push(content.dataChart);
	        delete content.dataChart;
	    });
	    return {
	        widgetMap: widgetMap,
	        wrappedDataCharts: wrappedDataCharts,
	        controllerWidgets: controllerWidgets,
	    };
	};

	var getChartDataRequestBuilder = function (dataChart) {
	    var _a, _b, _c, _d, _e;
	    var builder = new ChartDataRequestBuilder({
	        id: dataChart === null || dataChart === void 0 ? void 0 : dataChart.viewId,
	        computedFields: ((_a = dataChart === null || dataChart === void 0 ? void 0 : dataChart.config) === null || _a === void 0 ? void 0 : _a.computedFields) || [],
	    }, (_c = (_b = dataChart === null || dataChart === void 0 ? void 0 : dataChart.config) === null || _b === void 0 ? void 0 : _b.chartConfig) === null || _c === void 0 ? void 0 : _c.datas, (_e = (_d = dataChart === null || dataChart === void 0 ? void 0 : dataChart.config) === null || _d === void 0 ? void 0 : _d.chartConfig) === null || _e === void 0 ? void 0 : _e.settings);
	    return builder;
	};
	var getTneWidgetFiltersAndParams = function (obj) {
	    // TODO chart 本身携带了变量，board没有相关配置的时候要拿到 chart本身的 变量值 Params
	    var chartWidget = obj.chartWidget, widgetMap = obj.widgetMap; obj.params;
	    var controllerWidgets = Object.values(widgetMap).filter(function (widget) { return widget.config.type === 'controller'; });
	    var filterParams = [];
	    var variableParams = {};
	    controllerWidgets.forEach(function (filterWidget) {
	        var _a, _b;
	        var hasRelation = filterWidget.relations.find(function (re) { return re.targetId === chartWidget.id; });
	        if (!hasRelation)
	            return;
	        var content = filterWidget.config.content;
	        var relatedViews = content.relatedViews, controllerConfig = content.config, type = content.type;
	        var relatedViewItem = relatedViews
	            .filter(function (view) { return view.fieldValue; })
	            .find(function (view) { var _a; return view.viewId === ((_a = chartWidget === null || chartWidget === void 0 ? void 0 : chartWidget.viewIds) === null || _a === void 0 ? void 0 : _a[0]); });
	        if (!relatedViewItem)
	            return;
	        var values = getWidgetControlValues({
	            type: type,
	            relatedViewItem: relatedViewItem,
	            config: controllerConfig,
	        });
	        if (!values) {
	            ////console.log("has no FilterValues return on " + chartWidget.id);
	            return;
	        }
	        // 关联变量逻辑
	        if (relatedViewItem.relatedCategory === ChartDataViewFieldCategory.Variable) {
	            var curValues = values.map(function (item) { return String(item.value); });
	            // range类型 控制器关联两个变量的情况 relatedViewItem.fieldValue [string,string]
	            if (Array.isArray(relatedViewItem.fieldValue)) {
	                var key1 = String((_a = relatedViewItem.fieldValue) === null || _a === void 0 ? void 0 : _a[0]);
	                var key2 = String((_b = relatedViewItem.fieldValue) === null || _b === void 0 ? void 0 : _b[1]);
	                //
	                variableParams[key1] = [curValues === null || curValues === void 0 ? void 0 : curValues[0]];
	                variableParams[key2] = [curValues === null || curValues === void 0 ? void 0 : curValues[1]];
	            }
	            else {
	                var key = String(relatedViewItem.fieldValue);
	                //单个变量的取值逻辑 不限制为1个
	                variableParams[key] = curValues;
	            }
	        }
	        // 关联字段 逻辑
	        if (relatedViewItem.relatedCategory === ChartDataViewFieldCategory.Field) {
	            var filter = {
	                aggOperator: null,
	                column: String(relatedViewItem.fieldValue),
	                sqlOperator: controllerConfig.sqlOperator,
	                values: values,
	            };
	            filterParams.push(filter);
	        }
	    });
	    // filter 去重
	    filterParams = getDistinctFiltersByColumn(filterParams);
	    return {
	        filterParams: filterParams,
	        variableParams: variableParams,
	    };
	};
	var getWidgetControlValues = function (opt) {
	    var _a, _b;
	    var type = opt.type, relatedViewItem = opt.relatedViewItem, config = opt.config;
	    var valueType = relatedViewItem.fieldValueType;
	    switch (type) {
	        case ControllerFacadeTypes.RangeTime:
	        case ControllerFacadeTypes.Time:
	            if (!(config === null || config === void 0 ? void 0 : config.controllerDate)) {
	                return false;
	            }
	            var timeValues = getControllerDateValues({
	                controlType: type,
	                filterDate: config.controllerDate,
	                execute: true,
	            });
	            var values = timeValues
	                .filter(function (ele) { return !!ele; })
	                .map(function (ele) {
	                var item = {
	                    value: ele,
	                    valueType: valueType || 'DATE',
	                };
	                return item;
	            });
	            return values[0] ? values : null;
	        case ControllerFacadeTypes.Value:
	        case ControllerFacadeTypes.RangeValue:
	        case ControllerFacadeTypes.Slider:
	            if (!config.controllerValues ||
	                config.controllerValues.length === 0 ||
	                !((_a = config.controllerValues) === null || _a === void 0 ? void 0 : _a[0]))
	                return false;
	            var numericValues = config.controllerValues
	                .filter(function (ele) {
	                if (ele === 0)
	                    return true;
	                return !!ele;
	            })
	                .map(function (ele) {
	                var item = {
	                    value: ele,
	                    valueType: valueType || '',
	                };
	                return item;
	            });
	            return numericValues[0] ? numericValues : false;
	        default:
	            if (!config.controllerValues ||
	                config.controllerValues.length === 0 ||
	                !((_b = config.controllerValues) === null || _b === void 0 ? void 0 : _b[0]))
	                return false;
	            var strValues = config.controllerValues
	                .filter(function (ele) {
	                if (ele.trim() === '')
	                    return false;
	                return !!ele;
	            })
	                .map(function (ele) {
	                var item = {
	                    value: ele.trim(),
	                    valueType: valueType || 'STRING',
	                };
	                return item;
	            });
	            return strValues[0] ? strValues : false;
	    }
	};
	var getControllerDateValues = function (obj) {
	    var _a = obj.filterDate, endTime = _a.endTime, startTime = _a.startTime, pickerType = _a.pickerType;
	    var timeValues = ['', ''];
	    if (startTime.relativeOrExact === TimeFilterValueCategory.Exact) {
	        timeValues[0] = startTime.exactValue;
	    }
	    else {
	        var _b = startTime.relativeValue, amount = _b.amount, unit = _b.unit, direction = _b.direction;
	        var time = getTime(+(direction + amount), unit)(unit, true);
	        timeValues[0] = time.format(DEFAULT_VALUE_DATE_FORMAT);
	    }
	    if (endTime) {
	        if (endTime.relativeOrExact === TimeFilterValueCategory.Exact) {
	            timeValues[1] = endTime.exactValue;
	            if (obj.execute) {
	                timeValues[1] = adjustRangeDataEndValue(pickerType, endTime.exactValue);
	            }
	            else {
	                timeValues[1] = endTime.exactValue;
	            }
	        }
	        else {
	            var _c = endTime.relativeValue, amount = _c.amount, unit = _c.unit, direction = _c.direction;
	            var time = getTime(+(direction + amount), unit)(unit, false);
	            timeValues[1] = time.format(DEFAULT_VALUE_DATE_FORMAT);
	        }
	    }
	    return timeValues;
	};
	var adjustRangeDataEndValue = function (pickerType, timeValue) {
	    if (!timeValue) {
	        return timeValue;
	    }
	    var adjustTime = moment(timeValue);
	    switch (pickerType) {
	        case 'dateTime':
	            // 比较特殊 不做增值处理
	            break;
	        case 'date':
	            adjustTime = adjustTime.add(1, 'days').startOf('days');
	            break;
	        case 'month':
	            adjustTime = adjustTime.add(1, 'months').startOf('months');
	            break;
	        case 'quarter':
	            adjustTime = adjustTime.add(1, 'quarters').startOf('quarters');
	            break;
	        case 'week':
	            adjustTime = adjustTime.add(1, 'weeks').startOf('week');
	            break;
	        case 'year':
	            adjustTime = adjustTime.add(1, 'years').startOf('years');
	            break;
	    }
	    var end = adjustTime.format(DEFAULT_VALUE_DATE_FORMAT);
	    return end;
	};
	var getBoardChartRequests = function (params) {
	    var widgetMap = params.widgetMap, viewMap = params.viewMap, dataChartMap = params.dataChartMap;
	    var chartWidgetIds = Object.values(widgetMap)
	        .filter(function (w) { return w.config.type === 'chart'; })
	        .map(function (w) { return w.id; });
	    var chartRequest = chartWidgetIds
	        .map(function (widgetId) {
	        return getChartWidgetRequestParams({
	            widgetId: widgetId,
	            widgetMap: widgetMap,
	            viewMap: viewMap,
	            option: undefined,
	            widgetInfo: undefined,
	            dataChartMap: dataChartMap,
	        });
	    })
	        .filter(function (res) {
	        if (res) {
	            return true;
	        }
	        return false;
	    });
	    return chartRequest;
	};
	var getChartWidgetRequestParams = function (obj) {
	    var widgetId = obj.widgetId, widgetMap = obj.widgetMap, viewMap = obj.viewMap, widgetInfo = obj.widgetInfo, dataChartMap = obj.dataChartMap, option = obj.option, boardLinkFilters = obj.boardLinkFilters;
	    if (!widgetId)
	        return null;
	    var curWidget = widgetMap[widgetId];
	    if (!curWidget)
	        return null;
	    if (curWidget.config.type !== 'chart')
	        return null;
	    if (!curWidget.datachartId)
	        return null;
	    var dataChart = dataChartMap[curWidget.datachartId];
	    if (!dataChart) {
	        // errorHandle(`can\`t find Chart ${curWidget.datachartId}`);
	        return null;
	    }
	    var chartDataView = viewMap[dataChart === null || dataChart === void 0 ? void 0 : dataChart.viewId];
	    if (!chartDataView) {
	        // errorHandle(`can\`t find View ${dataChart?.viewId}`);
	        return null;
	    }
	    var builder = getChartDataRequestBuilder(dataChart);
	    var requestParams = builder
	        .addExtraSorters((option === null || option === void 0 ? void 0 : option.sorters) || [])
	        .build();
	    var viewConfig = transformToViewConfig(chartDataView === null || chartDataView === void 0 ? void 0 : chartDataView.config);
	    requestParams = __assign(__assign({}, requestParams), viewConfig);
	    var _a = getTneWidgetFiltersAndParams({
	        chartWidget: curWidget,
	        widgetMap: widgetMap,
	        params: requestParams.params,
	    }), filterParams = _a.filterParams, variableParams = _a.variableParams;
	    // 全局过滤 filter
	    // TODO
	    requestParams.filters = requestParams.filters.concat(filterParams);
	    // 联动 过滤
	    if (boardLinkFilters) {
	        var linkFilters_1 = [];
	        var links = boardLinkFilters.filter(function (link) { return link.linkerWidgetId === curWidget.id; });
	        links.forEach(function (link) {
	            var triggerValue = link.triggerValue, triggerWidgetId = link.triggerWidgetId;
	            var triggerWidget = widgetMap[triggerWidgetId];
	            var filter = {
	                aggOperator: null,
	                column: getLinkedColumn(link.linkerWidgetId, triggerWidget),
	                sqlOperator: FilterSqlOperator.In,
	                values: [
	                    { value: triggerValue, valueType: ChartDataViewFieldType.STRING },
	                ],
	            };
	            linkFilters_1.push(filter);
	        });
	        requestParams.filters = requestParams.filters.concat(linkFilters_1);
	    }
	    // filter 去重
	    requestParams.filters = getDistinctFiltersByColumn(requestParams.filters);
	    // 变量
	    if (variableParams) {
	        requestParams.params = variableParams;
	    }
	    if (widgetInfo) {
	        var pageInfo = widgetInfo.pageInfo;
	        if (requestParams.pageInfo) {
	            requestParams.pageInfo.pageNo = pageInfo.pageNo;
	        }
	    }
	    if (option) {
	        var pageInfo = option.pageInfo;
	        if (requestParams.pageInfo && (pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.pageNo)) {
	            requestParams.pageInfo.pageNo = pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.pageNo;
	        }
	    }
	    return requestParams;
	};
	//  filter 去重
	var getDistinctFiltersByColumn = function (filter) {
	    if (!filter) {
	        return [];
	    }
	    var filterMap = {};
	    filter.forEach(function (item) {
	        filterMap[item.column] = item;
	    });
	    return Object.values(filterMap);
	};

	var getDashBoardByResBoard = function (data) {
	    var id = data.id, name = data.name, orgId = data.orgId, parentId = data.parentId, status = data.status, thumbnail = data.thumbnail, index = data.index, config = data.config, permissions = data.permissions, queryVariables = data.queryVariables;
	    return {
	        id: id,
	        queryVariables: queryVariables,
	        name: name,
	        orgId: orgId,
	        parentId: parentId,
	        status: status,
	        thumbnail: thumbnail,
	        index: index,
	        config: getBoardConfigByResBoard(config),
	        permissions: permissions,
	    };
	};
	var getBoardConfigByResBoard = function (config) {
	    // let nextConfig={} as DashboardConfig;
	    var borderTypes = Object.values(BoardTypeMap);
	    try {
	        var nextConfig = JSON.parse(config);
	        if (typeof nextConfig === 'string') {
	            nextConfig = JSON.parse(nextConfig);
	        }
	        if (!borderTypes.includes(nextConfig === null || nextConfig === void 0 ? void 0 : nextConfig.type)) {
	            return getInitBoardConfig('auto');
	        }
	        return nextConfig;
	    }
	    catch (error) {
	        ////console.log('解析 config 出错');
	        var nextConfig = getInitBoardConfig('auto');
	        return nextConfig;
	    }
	};
	var getInitBoardConfig = function (boardType) {
	    var dashboardConfig = {
	        background: BackgroundDefault,
	        widgetDefaultSettings: {
	            background: AutoBoardWidgetBackgroundDefault,
	            boxShadow: false,
	        },
	        maxWidgetIndex: 0,
	        // free
	        type: boardType,
	        width: 1920,
	        height: 1080,
	        gridStep: [10, 10],
	        scaleMode: 'scaleWidth',
	        // auto
	        margin: [16, 16],
	        containerPadding: [16, 16],
	        rowHeight: 32,
	        cols: LAYOUT_COLS,
	        initialQuery: true,
	        hasQueryControl: false,
	        hasResetControl: false,
	    };
	    return dashboardConfig;
	};
	// dataCharts
	var getDataChartsByServer = function (serverDataCharts) {
	    var dataCharts = serverDataCharts.map(function (item) {
	        return __assign(__assign({}, item), { config: JSON.parse(item.config) });
	    });
	    return dataCharts;
	};
	var getChartDataView = function (views, dataCharts) {
	    var viewViews = [];
	    views.forEach(function (view) {
	        var dataChart = dataCharts.find(function (dc) { return dc.viewId === view.id; });
	        var viewView = __assign(__assign({}, view), { meta: transformMeta(view.model), model: '', computedFields: (dataChart === null || dataChart === void 0 ? void 0 : dataChart.config.computedFields) || [] });
	        viewViews.push(viewView);
	    });
	    return viewViews;
	};

	/**

	 * Datart
	   *
	 * Copyright 2021
	   *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	   *
	 * http://www.apache.org/licenses/LICENSE-2.0
	    *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	   */
	// import 'core-js/modules/es.map';
	/**

	 * @param ''
	 * @description 'server task 定时任务 调用'
	   */
	var getQueryData = function (dataStr) {
	    var data = JSON.parse(dataStr);
	    //polyfill
	    if (!Object.values)
	        Object.values = function (obj) {
	            if (obj !== Object(obj))
	                throw new TypeError('Object.values called on a non-object');
	            var val = [], key;
	            for (key in obj) {
	                if (Object.prototype.hasOwnProperty.call(obj, key)) {
	                    //@ts-ignore
	                    val.push(obj[key]);
	                }
	            }
	            return val;
	        };
	    if (!Array.prototype.find) {
	        // eslint-disable-next-line no-extend-native
	        Object.defineProperty(Array.prototype, 'find', {
	            value: function (predicate) {
	                // 1. Let O be ? ToObject(this value).
	                if (this == null) {
	                    throw new TypeError('"this" is null or not defined');
	                }
	                var o = Object(this);
	                // 2. Let len be ? ToLength(? Get(O, "length")).
	                var len = o.length >>> 0;
	                // 3. If IsCallable(predicate) is false, throw a TypeError exception.
	                if (typeof predicate !== 'function') {
	                    throw new TypeError('predicate must be a function');
	                }
	                // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
	                var thisArg = arguments[1];
	                // 5. Let k be 0.
	                var k = 0;
	                // 6. Repeat, while k < len
	                while (k < len) {
	                    // a. Let Pk be ! ToString(k).
	                    // b. Let kValue be ? Get(O, Pk).
	                    // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
	                    // d. If testResult is true, return kValue.
	                    var kValue = o[k];
	                    if (predicate.call(thisArg, kValue, k, o)) {
	                        return kValue;
	                    }
	                    // e. Increase k by 1.
	                    k++;
	                }
	                // 7. Return undefined.
	                return undefined;
	            },
	        });
	    }
	    //polyfill end
	    // const renderMode: VizRenderMode = 'schedule';
	    var dashboard = getDashBoardByResBoard(data);
	    var datacharts = data.datacharts, serverViews = data.views, serverWidgets = data.widgets;
	    var dataCharts = getDataChartsByServer(datacharts);
	    var _a = getWidgetMapByServer(serverWidgets, dataCharts), widgetMap = _a.widgetMap, wrappedDataCharts = _a.wrappedDataCharts;
	    var allDataCharts = dataCharts.concat(wrappedDataCharts);
	    var viewViews = getChartDataView(serverViews, allDataCharts);
	    var viewMap = viewViews.reduce(function (obj, view) {
	        obj[view.id] = view;
	        return obj;
	    }, {});
	    var dataChartMap = allDataCharts.reduce(function (obj, dataChart) {
	        obj[dataChart.id] = dataChart;
	        return obj;
	    }, {});
	    var downloadParams = getBoardChartRequests({
	        widgetMap: widgetMap,
	        viewMap: viewMap,
	        dataChartMap: dataChartMap,
	    });
	    var fileName = dashboard.name;
	    return { downloadParams: downloadParams, fileName: fileName };
	};

	return getQueryData;

}));
