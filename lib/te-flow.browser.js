(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["teFlow"] = factory();
	else
		root["teFlow"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

	var isArray = __webpack_require__(1);
	var isFunction = __webpack_require__(2);
	var isObject = __webpack_require__(3);
	var _memoize = __webpack_require__(4);
	var _defaults2 = __webpack_require__(5);
	var defclass = __webpack_require__(16);
	/*
	teFlow
	 */
	var TeFlow = defclass({
	  constructor: function constructor(initArgOpt) {
	    var self = this;
	    self._self = self;
	    self.userOptions = {};
	    //no opts return
	    if (!initArgOpt) {
	      return;
	    }
	    //set opts
	    var allOpts = ['initArgs', 'args', 'this', 'stream', 'objReturn', 'objKeep', 'flow', 'flatten', 'start', 'res', 'end'];
	    allOpts.forEach(function (val) {
	      if (!self._L.isUdf(initArgOpt[val])) {
	        self.userOptions[val] = initArgOpt[val];
	      }
	    });
	    //check memoize sep
	    if (!self._L.isUdf(initArgOpt.memoize)) {
	      self._memoize = initArgOpt.memoize;
	    }
	  },
	  invoke: function invoke() {
	    var self = this;
	    //set args
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; ++i) {
	      args[i] = arguments[i];
	    }

	    self.args = args;
	    self.argsToApply = { _fnArgs: [] };

	    //init precheck for options
	    if (!self.count) {
	      self.count = 1;
	      var optConfig = self.checkOpts(self.args);
	      self.args = optConfig.args;
	      self.argsToApply = optConfig.argsToApply;
	    }
	    //set fns
	    self.first = self.args.length ? self.args.shift() : null;
	    self.rest = self.args;
	    self.firstIsFn = self._L.isFn(self.first);
	    self.firstIsUdf = self._L.isUdf(self.first);

	    //check for args to apply
	    var _argsToApply = self.rest[self.rest.length - 1];
	    if (!self._L.isUdf(_argsToApply) && _argsToApply._fnArgs) {
	      self.argsToApply._fnArgs = self.rest.pop()._fnArgs;
	    }

	    return self.process();
	  },
	  /*
	  Checks for special options
	   */
	  checkOpts: function checkOpts(args) {
	    var self = this;
	    var userOptions = Object.keys(self.userOptions);
	    var car = args[0];
	    var carIsObj = self._L.isFn(car) ? false : self._L.isObj(car);
	    var fnOpts = ['_stream', '_objReturn', '_objKeep', '_flow', '_args', '_flatten', '_start', '_res', '_end', '_option', '_this'];

	    //check to make sure if an object is as first arg it has an opt
	    var hasOpt = false;
	    if (carIsObj) {
	      car = car._option ? car._option : car;
	      var keys = Object.keys(car);
	      for (var i = 0; i < keys.length && !hasOpt; i++) {
	        if (fnOpts.indexOf(keys[i]) !== -1) {
	          hasOpt = true;
	        }
	      }
	    }
	    //will contain any stream opts to be applied
	    self.streamOpt = [];
	    //default helper
	    var setOptD = function setOptD(constOpt, fnOpt, def) {
	      //check for cunstructor options first
	      if (!self._L.isUdf(self.userOptions[constOpt])) {
	        return self.userOptions[constOpt];
	      }
	      return self._L.isUdf(car[fnOpt]) ? def : car[fnOpt];
	    };
	    //availible options and corresponding actions
	    self.optList = {
	      _kill: setOptD('kill', '_kill', false),
	      _return: setOptD('return', '_return', false),
	      _stream: setOptD('stream', '_stream', true),
	      _objReturn: setOptD('objReturn', '_objReturn', true),
	      _objKeep: setOptD('objKeep', '_objKeep', false),
	      _flow: setOptD('flow', '_flow', false),
	      _flatten: setOptD('flatten', '_flatten', false)
	    };
	    //stream options
	    self.optStreamList = {
	      _start: setOptD('start', '_start', null),
	      _res: setOptD('res', '_res', null),
	      _end: setOptD('end', '_end', null)
	    };
	    //checks for opts, and pushes
	    if (carIsObj && hasOpt || userOptions.length) {
	      //hardcoded opts
	      //this ref to be applied to funks
	      //set this for ref chain
	      if (self.userOptions['this']) {
	        //constOpt
	        self._this = self.userOptions['this'];
	      } else {
	        //fnOpt
	        self._this = car._this ? car._this : null;
	      }
	      //Initail args
	      //helper to invoke args if methods
	      var invokeArgs = function invokeArgs(initArgs) {
	        //args in method
	        if (self._L.isFn(initArgs)) {
	          return initArgs();
	        }
	        //assume args is obj
	        return Object.keys(initArgs).reduce(function (prv, cur) {
	          var curArg = initArgs[cur];
	          prv[cur] = !self._L.isFn(curArg) ? initArgs[cur] : curArg();
	          return prv;
	        }, {});
	      };
	      //gate for init args
	      if (self.userOptions.initArgs || self.userOptions.args) {
	        //constOpt
	        var _args = self.userOptions.args || self.userOptions.initArgs;
	        self.applyArgs(invokeArgs(_args), true);
	      } else if (car._args) {
	        self.applyArgs(invokeArgs(car._args), true);
	      } else if (car._initArgs) {
	        //fnOpt
	        self.applyArgs(invokeArgs(car._initArgs), true);
	      }
	      //memorize - true by default
	      if (!self._memoize) {
	        self._memoize = car._memoize === false ? false : true;
	      }
	      //cylce through opt list
	      Object.keys(self.optStreamList).forEach(function (key) {
	        //if key push the be applied when the time comes
	        if (car[key]) {
	          //push to array ref
	          self.streamOpt.push(key);
	          //assign if need be
	          if (self.optStreamList[key] === null) {
	            self.optStreamList[key] = car[key];
	          }
	        }
	      });
	      //shift off to return
	      if (!userOptions.length) {
	        args.shift();
	      }
	    }
	    //not the cleanest way to handle this but
	    //oh well
	    return {
	      args: args,
	      argsToApply: self.argsToApply
	    };
	  },
	  /*
	  Applys any opts to val if set
	   */
	  applyOpts: function applyOpts(valueArr, funcOpt) {
	    var self = this;
	    /**
	     * cycle through opts to apply
	     * applys fns to said arg through some recursion
	     * @param  {arg} arg      -indv arg
	     * @param  {fn}  firstFn  -current fn
	     * @param  {arr} restFn   -rest of funks to be invoked
	     * @return {arr}          -arg val with appled fns
	     */
	    var applyFn = function applyFn(_x2, _x3) {
	      var _again = true;

	      _function: while (_again) {
	        var arg = _x2,
	            _ref = _x3;
	        _again = false;

	        var _ref2 = _toArray(_ref);

	        var firstFn = _ref2[0];

	        var restFn = _ref2.slice(1);

	        if (arg === undefined) {
	          return;
	        } else if (!self._L.isArr(arg)) {
	          arg = [arg];
	        }
	        if (firstFn === undefined) {
	          return arg;
	        } else {
	          _x2 = firstFn.apply(self._this, arg);
	          _x3 = restFn;
	          _again = true;
	          _ref2 = firstFn = restFn = undefined;
	          continue _function;
	        }
	      }
	    };
	    /**
	     * Cycles through the vals and fns to apply
	     * and then invokes thoese
	     * @param  {arr} argArr - arg stream
	     * @param  {fn} fns     - funks to be appled
	     * @return {arr}        ->stream
	     */
	    var mapApply = function mapApply(argArr, fns) {
	      //memoize to avodie repeat
	      var _memApplyFn = self._L.memoize(function (a) {
	        return applyFn(a, fns);
	      });
	      var _applyFn = self._memoize ? _memApplyFn : applyFn;
	      return argArr.map(function (a) {
	        var res = _applyFn(a, fns);
	        if (!self._L.isUdf(res) && res[0]) {
	          return res[0];
	        }
	      });
	    };
	    //handels apply option to value
	    /**
	     * Handles and appies options to args stream vals
	     * @param  {argArr} argArr        -arg stream
	     * @param  {fn || obj} optToApply -are the fn opts to be applied
	     * @return {arr}                  ->stream
	     */
	    var applyOpt = function applyOpt(argArr, optToApply) {
	      //function
	      if (self._L.isFn(optToApply)) {
	        return mapApply(argArr, optToApply);
	      } else if (self._L.isObj(optToApply)) {
	        //object
	        return mapApply(argArr, Object.keys(optToApply).map(function (opt) {
	          return optToApply[opt];
	        }));
	      } else if (self._L.isArr(optToApply)) {
	        //array
	        return mapApply(argArr, optToApply);
	      }
	    };
	    /**
	     * Cycles through opts and invokes opts that
	     * pass through the gates
	     * @param  {arr} val       -stream value
	     * @param  {obj} fnOpt     -funk options
	     * @param  {obj} streamOpt -stream option from this.streamOpt
	     * @return {arr}           ->stream
	     */
	    var optCycle = function optCycle(argArr, fnOpt, streamOpt) {
	      //filter out stage apply opts
	      streamOpt = streamOpt.filter(function (opt) {
	        if (opt !== '_start' && opt !== '_res' && opt !== '_end') {
	          return opt;
	        } else if (opt === '_start' && fnOpt._start) {
	          return opt;
	        } else if (opt === '_res' && fnOpt._res) {
	          return opt;
	        } else if (opt === '_end' && fnOpt._end) {
	          return opt;
	        }
	      });
	      //Go through option list to see what needs
	      //to be applied
	      return streamOpt.reduce(function (prv, cur) {
	        return applyOpt(prv, self.optStreamList[cur]);
	      }, argArr);
	    };
	    /**
	     * Sets the default gate options
	     * @param {obj} val  -the current stream value
	     * @param {obj} opts -options
	     * @return {arr}     ->stream
	     */
	    var setOptions = function setOptions(valArr, fnOpt, streamOpt) {
	      var _defaults = {
	        _start: false,
	        _end: false,
	        _res: false
	      };
	      return optCycle.apply(self, [valArr, self._L.defaults(fnOpt, _defaults), streamOpt]);
	    };

	    //stream opt
	    return this.streamOpt.length ? setOptions(valueArr, funcOpt, this.streamOpt) : valueArr;
	  },
	  /**
	   * Applies any fn args if specifed by user
	   * @param  {dependant on res}  value
	   * @param  {Boolean} initRun if inital run no to trip shit up
	   */
	  applyArgs: function applyArgs(value) {
	    var initRun = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	    var self = this;
	    var keepOveride = false;
	    if (value === undefined) {
	      return;
	    }
	    var pushApply = function pushApply(val) {
	      if (self.optList._flow) {
	        //Flow push
	        self.argsToApply._fnArgs.push(val);
	      } else if (self.optList._objReturn && self._L.isObj(val)) {
	        (function () {
	          var keepKey = self.optList._objKeep;
	          //keep override check
	          keepKey = keepOveride ? !keepKey : keepKey;
	          //Object assign
	          self.argsToApply._fnArgs = Object.keys(val).map(function (key) {
	            var objKey = undefined;
	            if (keepKey) {
	              objKey = {};
	              objKey[key] = val[key];
	            }
	            return keepKey ? objKey : val[key];
	          });
	        })();
	      } else {
	        //Reassign Stream
	        val = self._L.isArr(val) ? val : [val];
	        self.argsToApply._fnArgs = val;
	      }
	    };
	    //apply res option
	    //pushes val for next invoke
	    if (!initRun) {
	      (function () {
	        //check to see if the user has specified a new this val
	        //of overrided keep obj
	        var checkAux = function checkAux(val) {
	          if (!self._L.isUdf(val)) {
	            //this
	            if (val._this) {
	              self._this = val._this;
	              delete val._this;
	            }
	            //keep
	            if (!self._L.isUdf(val._objKeep)) {
	              keepOveride = true;
	              delete val._objKeep;
	            }
	            //kill
	            if (val._kill === true) {
	              self.optList._kill = true;
	              delete val._kill;
	            }
	            //early return
	            if (val._return === true) {
	              self.optList._return = true;
	              delete val._return;
	            }
	          }
	          return val;
	        };
	        //res push
	        pushApply((function () {
	          //need to send val as an array to have opts applied
	          if (!self._L.isArr(value)) {
	            value = [checkAux(value)];
	            var res = self.applyOpts(value, { _res: true });
	            return res[0];
	          }
	          return self.applyOpts(checkAux(value), { _res: true });
	        })());
	        //apply end stream opts
	        //check flatten stream - might be a better way to handle this but fuck it.
	        self.argsToApply._fnArgs = !self.optList._flatten ? self.argsToApply._fnArgs : self._L.flatten(self.argsToApply._fnArgs);
	        self.argsToApply._fnArgs = self.applyOpts(self.argsToApply._fnArgs, {
	          _end: true
	        });
	      })();
	    } else {
	      //inial run, forget about factoring options
	      pushApply(value);
	    }
	  },
	  /*
	  Processes and shit
	   */
	  process: function process() {
	    var self = this;
	    //if killed undefined
	    if (self.optList._kill) {
	      return undefined;
	    } else if (self.optList._return) {
	      var last = self.rest[self.rest.length - 1];
	      //check for return obj as last arg
	      if (self._L.isObj(last) && Object.keys(last)[0] === 'return') {
	        return last['return'].apply(self._this, self.argsToApply._fnArgs || []);
	      }
	      //early return
	      return self.argsToApply._fnArgs || [];
	    }
	    //first is func
	    if (self.firstIsFn) {
	      var res = Object.keys(self.argsToApply).length ? self.first.apply(self._this, self.applyOpts(self.argsToApply._fnArgs, {
	        //apply start strams opts
	        _start: true
	      })) : self.first.call(self._this);
	      self.applyArgs(res);
	      //return
	      if (Object.keys(self.argsToApply).length) {
	        self.rest.push(self.argsToApply);
	      }
	      return self.invoke.apply(self, self.rest);
	    } else if (self._L.isObj(self.first) && self.first['return']) {
	      var rtn = self.first['return'];
	      //return object, if func all and return
	      return self._L.isFn(rtn) ? rtn.apply(self._this, self.argsToApply._fnArgs || []) : rtn;
	    } else if (self._L.isObj(self.first) && self.first._fnArgs) {
	      //first is return fn obj
	      return self.first._fnArgs.length ? self.first._fnArgs : undefined;
	    } else if (!self.firstIsFn && !self.firstIsUdf && self.first !== null) {
	      //if first non-func assume args to be applied
	      self.applyArgs(self.first);
	      if (Object.keys(self.argsToApply).length) {
	        self.rest.push(self.argsToApply);
	      }
	      return self.invoke.apply(self, self.rest);
	    } else if (self._L.isUdf(self.first) && self.rest.length) {
	      //first is undefined but still args to be called
	      if (Object.keys(self.argsToApply).length) {
	        //push args to arg chain
	        self.rest.push(self.argsToApply);
	      }
	      return self.invoke.apply(self, self.rest);
	    } else if (!self.rest.length) {
	      //end call, no args to left to call
	      //return args or undefined
	      return Object.keys(self.argsToApply).length ? self.argsToApply._fnArgs : undefined;
	    }
	    return undefined;
	  },
	  _L: {
	    flatten: function flatten(val) {
	      var flatten = function flatten(array, result) {
	        for (var i = 0; i < array.length; i++) {
	          var value = array[i];
	          if (Array.isArray(value)) {
	            flatten(value, result);
	          } else {
	            result.push(value);
	          }
	        }
	        return result;
	      };
	      return flatten(val, []);
	    },
	    defaults: function defaults() {
	      var args = new Array(arguments.length);
	      for (var i = 0; i < args.length; ++i) {
	        args[i] = arguments[i];
	      }
	      var orgObj = args.shift();
	      return _defaults2(orgObj, args);
	    },
	    memoize: function memoize(fn) {
	      return _memoize(fn);
	    },
	    isFn: function isFn(val) {
	      return isFunction(val);
	    },
	    isObj: function isObj(val) {
	      return isObject(val);
	    },
	    isArr: function isArr(val) {
	      return isArray(val);
	    },
	    isUdf: function isUdf(val) {
	      return val === undefined;
	    }
	  }
	});

	/*
	Export
	 */
	module.exports = function () {
	  var args = new Array(arguments.length);
	  for (var i = 0; i < args.length; ++i) {
	    args[i] = arguments[i];
	  }
	  if (!args.length) {
	    return undefined;
	  }
	  var teFlow = new TeFlow(this);
	  return teFlow.invoke.apply(teFlow._self, args);
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/** `Object#toString` result references. */
	var arrayTag = '[object Array]',
	    funcTag = '[object Function]';

	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeIsArray = getNative(Array, 'isArray');

	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(function() { return arguments; }());
	 * // => false
	 */
	var isArray = nativeIsArray || function(value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	};

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 equivalents which return 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
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
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}

	module.exports = isArray;


/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.6 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/** `Object#toString` result references. */
	var funcTag = '[object Function]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 equivalents which return 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
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
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	module.exports = isFunction;


/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
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
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	module.exports = isObject;


/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Creates a cache object to store key/value pairs.
	 *
	 * @private
	 * @static
	 * @name Cache
	 * @memberOf _.memoize
	 */
	function MapCache() {
	  this.__data__ = {};
	}

	/**
	 * Removes `key` and its value from the cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf _.memoize.Cache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed successfully, else `false`.
	 */
	function mapDelete(key) {
	  return this.has(key) && delete this.__data__[key];
	}

	/**
	 * Gets the cached value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf _.memoize.Cache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the cached value.
	 */
	function mapGet(key) {
	  return key == '__proto__' ? undefined : this.__data__[key];
	}

	/**
	 * Checks if a cached value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf _.memoize.Cache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapHas(key) {
	  return key != '__proto__' && hasOwnProperty.call(this.__data__, key);
	}

	/**
	 * Sets `value` to `key` of the cache.
	 *
	 * @private
	 * @name set
	 * @memberOf _.memoize.Cache
	 * @param {string} key The key of the value to cache.
	 * @param {*} value The value to cache.
	 * @returns {Object} Returns the cache object.
	 */
	function mapSet(key, value) {
	  if (key != '__proto__') {
	    this.__data__[key] = value;
	  }
	  return this;
	}

	/**
	 * Creates a function that memoizes the result of `func`. If `resolver` is
	 * provided it determines the cache key for storing the result based on the
	 * arguments provided to the memoized function. By default, the first argument
	 * provided to the memoized function is coerced to a string and used as the
	 * cache key. The `func` is invoked with the `this` binding of the memoized
	 * function.
	 *
	 * **Note:** The cache is exposed as the `cache` property on the memoized
	 * function. Its creation may be customized by replacing the `_.memoize.Cache`
	 * constructor with one whose instances implement the [`Map`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-properties-of-the-map-prototype-object)
	 * method interface of `get`, `has`, and `set`.
	 *
	 * @static
	 * @memberOf _
	 * @category Function
	 * @param {Function} func The function to have its output memoized.
	 * @param {Function} [resolver] The function to resolve the cache key.
	 * @returns {Function} Returns the new memoizing function.
	 * @example
	 *
	 * var upperCase = _.memoize(function(string) {
	 *   return string.toUpperCase();
	 * });
	 *
	 * upperCase('fred');
	 * // => 'FRED'
	 *
	 * // modifying the result cache
	 * upperCase.cache.set('fred', 'BARNEY');
	 * upperCase('fred');
	 * // => 'BARNEY'
	 *
	 * // replacing `_.memoize.Cache`
	 * var object = { 'user': 'fred' };
	 * var other = { 'user': 'barney' };
	 * var identity = _.memoize(_.identity);
	 *
	 * identity(object);
	 * // => { 'user': 'fred' }
	 * identity(other);
	 * // => { 'user': 'fred' }
	 *
	 * _.memoize.Cache = WeakMap;
	 * var identity = _.memoize(_.identity);
	 *
	 * identity(object);
	 * // => { 'user': 'fred' }
	 * identity(other);
	 * // => { 'user': 'barney' }
	 */
	function memoize(func, resolver) {
	  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
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
	    memoized.cache = cache.set(key, result);
	    return result;
	  };
	  memoized.cache = new memoize.Cache;
	  return memoized;
	}

	// Add functions to the `Map` cache.
	MapCache.prototype['delete'] = mapDelete;
	MapCache.prototype.get = mapGet;
	MapCache.prototype.has = mapHas;
	MapCache.prototype.set = mapSet;

	// Assign cache to `_.memoize`.
	memoize.Cache = MapCache;

	module.exports = memoize;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.1.2 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var assign = __webpack_require__(6),
	    restParam = __webpack_require__(15);

	/**
	 * Used by `_.defaults` to customize its `_.assign` use.
	 *
	 * @private
	 * @param {*} objectValue The destination object property value.
	 * @param {*} sourceValue The source object property value.
	 * @returns {*} Returns the value to assign to the destination object.
	 */
	function assignDefaults(objectValue, sourceValue) {
	  return objectValue === undefined ? sourceValue : objectValue;
	}

	/**
	 * Creates a `_.defaults` or `_.defaultsDeep` function.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @param {Function} customizer The function to customize assigned values.
	 * @returns {Function} Returns the new defaults function.
	 */
	function createDefaults(assigner, customizer) {
	  return restParam(function(args) {
	    var object = args[0];
	    if (object == null) {
	      return object;
	    }
	    args.push(customizer);
	    return assigner.apply(undefined, args);
	  });
	}

	/**
	 * Assigns own enumerable properties of source object(s) to the destination
	 * object for all destination properties that resolve to `undefined`. Once a
	 * property is set, additional values of the same property are ignored.
	 *
	 * **Note:** This method mutates `object`.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
	 * // => { 'user': 'barney', 'age': 36 }
	 */
	var defaults = createDefaults(assign, assignDefaults);

	module.exports = defaults;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var baseAssign = __webpack_require__(7),
	    createAssigner = __webpack_require__(12),
	    keys = __webpack_require__(9);

	/**
	 * A specialized version of `_.assign` for customizing assigned values without
	 * support for argument juggling, multiple sources, and `this` binding `customizer`
	 * functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {Function} customizer The function to customize assigned values.
	 * @returns {Object} Returns `object`.
	 */
	function assignWith(object, source, customizer) {
	  var index = -1,
	      props = keys(source),
	      length = props.length;

	  while (++index < length) {
	    var key = props[index],
	        value = object[key],
	        result = customizer(value, source[key], key, object, source);

	    if ((result === result ? (result !== value) : (value === value)) ||
	        (value === undefined && !(key in object))) {
	      object[key] = result;
	    }
	  }
	  return object;
	}

	/**
	 * Assigns own enumerable properties of source object(s) to the destination
	 * object. Subsequent sources overwrite property assignments of previous sources.
	 * If `customizer` is provided it is invoked to produce the assigned values.
	 * The `customizer` is bound to `thisArg` and invoked with five arguments:
	 * (objectValue, sourceValue, key, object, source).
	 *
	 * **Note:** This method mutates `object` and is based on
	 * [`Object.assign`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign).
	 *
	 * @static
	 * @memberOf _
	 * @alias extend
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @param {Function} [customizer] The function to customize assigned values.
	 * @param {*} [thisArg] The `this` binding of `customizer`.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
	 * // => { 'user': 'fred', 'age': 40 }
	 *
	 * // using a customizer callback
	 * var defaults = _.partialRight(_.assign, function(value, other) {
	 *   return _.isUndefined(value) ? other : value;
	 * });
	 *
	 * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
	 * // => { 'user': 'barney', 'age': 36 }
	 */
	var assign = createAssigner(function(object, source, customizer) {
	  return customizer
	    ? assignWith(object, source, customizer)
	    : baseAssign(object, source);
	});

	module.exports = assign;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var baseCopy = __webpack_require__(8),
	    keys = __webpack_require__(9);

	/**
	 * The base implementation of `_.assign` without support for argument juggling,
	 * multiple sources, and `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
	function baseAssign(object, source) {
	  return source == null
	    ? object
	    : baseCopy(source, keys(source), object);
	}

	module.exports = baseAssign;


/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property names to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @returns {Object} Returns `object`.
	 */
	function baseCopy(source, props, object) {
	  object || (object = {});

	  var index = -1,
	      length = props.length;

	  while (++index < length) {
	    var key = props[index];
	    object[key] = source[key];
	  }
	  return object;
	}

	module.exports = baseCopy;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.1.2 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var getNative = __webpack_require__(10),
	    isArguments = __webpack_require__(11),
	    isArray = __webpack_require__(1);

	/** Used to detect unsigned integer values. */
	var reIsUint = /^\d+$/;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeKeys = getNative(Object, 'keys');

	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}

	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * that affects Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');

	/**
	 * Checks if `value` is array-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value));
	}

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	/**
	 * A fallback implementation of `Object.keys` which creates an array of the
	 * own enumerable property names of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function shimKeys(object) {
	  var props = keysIn(object),
	      propsLength = props.length,
	      length = propsLength && object.length;

	  var allowIndexes = !!length && isLength(length) &&
	    (isArray(object) || isArguments(object));

	  var index = -1,
	      result = [];

	  while (++index < propsLength) {
	    var key = props[index];
	    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
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
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
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
	var keys = !nativeKeys ? shimKeys : function(object) {
	  var Ctor = object == null ? undefined : object.constructor;
	  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
	      (typeof object != 'function' && isArrayLike(object))) {
	    return shimKeys(object);
	  }
	  return isObject(object) ? nativeKeys(object) : [];
	};

	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
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
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  if (object == null) {
	    return [];
	  }
	  if (!isObject(object)) {
	    object = Object(object);
	  }
	  var length = object.length;
	  length = (length && isLength(length) &&
	    (isArray(object) || isArguments(object)) && length) || 0;

	  var Ctor = object.constructor,
	      index = -1,
	      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
	      result = Array(length),
	      skipIndexes = length > 0;

	  while (++index < length) {
	    result[index] = (index + '');
	  }
	  for (var key in object) {
	    if (!(skipIndexes && isIndex(key, length)) &&
	        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = keys;


/***/ },
/* 10 */
/***/ function(module, exports) {

	/**
	 * lodash 3.9.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/** `Object#toString` result references. */
	var funcTag = '[object Function]';

	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 equivalents which return 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
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
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}

	module.exports = getNative;


/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Native method references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}

	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * that affects Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');

	/**
	 * Checks if `value` is array-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value));
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	/**
	 * Checks if `value` is classified as an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  return isObjectLike(value) && isArrayLike(value) &&
	    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
	}

	module.exports = isArguments;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var bindCallback = __webpack_require__(13),
	    isIterateeCall = __webpack_require__(14),
	    restParam = __webpack_require__(15);

	/**
	 * Creates a function that assigns properties of source object(s) to a given
	 * destination object.
	 *
	 * **Note:** This function is used to create `_.assign`, `_.defaults`, and `_.merge`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return restParam(function(object, sources) {
	    var index = -1,
	        length = object == null ? 0 : sources.length,
	        customizer = length > 2 ? sources[length - 2] : undefined,
	        guard = length > 2 ? sources[2] : undefined,
	        thisArg = length > 1 ? sources[length - 1] : undefined;

	    if (typeof customizer == 'function') {
	      customizer = bindCallback(customizer, thisArg, 5);
	      length -= 2;
	    } else {
	      customizer = typeof thisArg == 'function' ? thisArg : undefined;
	      length -= (customizer ? 1 : 0);
	    }
	    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? undefined : customizer;
	      length = 1;
	    }
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, customizer);
	      }
	    }
	    return object;
	  });
	}

	module.exports = createAssigner;


/***/ },
/* 13 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/**
	 * A specialized version of `baseCallback` which only supports `this` binding
	 * and specifying the number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {Function} func The function to bind.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function bindCallback(func, thisArg, argCount) {
	  if (typeof func != 'function') {
	    return identity;
	  }
	  if (thisArg === undefined) {
	    return func;
	  }
	  switch (argCount) {
	    case 1: return function(value) {
	      return func.call(thisArg, value);
	    };
	    case 3: return function(value, index, collection) {
	      return func.call(thisArg, value, index, collection);
	    };
	    case 4: return function(accumulator, value, index, collection) {
	      return func.call(thisArg, accumulator, value, index, collection);
	    };
	    case 5: return function(value, other, key, object, source) {
	      return func.call(thisArg, value, other, key, object, source);
	    };
	  }
	  return function() {
	    return func.apply(thisArg, arguments);
	  };
	}

	/**
	 * This method returns the first argument provided to it.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 *
	 * _.identity(object) === object;
	 * // => true
	 */
	function identity(value) {
	  return value;
	}

	module.exports = bindCallback;


/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.9 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/** Used to detect unsigned integer values. */
	var reIsUint = /^\d+$/;

	/**
	 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}

	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * that affects Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');

	/**
	 * Checks if `value` is array-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value));
	}

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}

	/**
	 * Checks if the provided arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	      ? (isArrayLike(object) && isIndex(index, object.length))
	      : (type == 'string' && index in object)) {
	    var other = object[index];
	    return value === value ? (value === other) : (other !== other);
	  }
	  return false;
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
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
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	module.exports = isIterateeCall;


/***/ },
/* 15 */
/***/ function(module, exports) {

	/**
	 * lodash 3.6.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;

	/**
	 * Creates a function that invokes `func` with the `this` binding of the
	 * created function and arguments from `start` and beyond provided as an array.
	 *
	 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
	 *
	 * @static
	 * @memberOf _
	 * @category Function
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var say = _.restParam(function(what, names) {
	 *   return what + ' ' + _.initial(names).join(', ') +
	 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
	 * });
	 *
	 * say('hello', 'fred', 'barney', 'pebbles');
	 * // => 'hello fred, barney, & pebbles'
	 */
	function restParam(func, start) {
	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        rest = Array(length);

	    while (++index < length) {
	      rest[index] = args[start + index];
	    }
	    switch (start) {
	      case 0: return func.call(this, rest);
	      case 1: return func.call(this, args[0], rest);
	      case 2: return func.call(this, args[0], args[1], rest);
	    }
	    var otherArgs = Array(start + 1);
	    index = -1;
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = rest;
	    return func.apply(this, otherArgs);
	  };
	}

	module.exports = restParam;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
	  if(true)
	    module.exports = factory();
	  else if(typeof define === 'function' && define.amd)
	    define([], factory);
	  else if(typeof exports === 'object')
	    exports["defclass"] = factory();
	  else
	    root["defclass"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/  // The module cache
	/******/  var installedModules = {};

	/******/  // The require function
	/******/  function __webpack_require__(moduleId) {

	/******/    // Check if module is in cache
	/******/    if(installedModules[moduleId])
	/******/      return installedModules[moduleId].exports;

	/******/    // Create a new module (and put it into the cache)
	/******/    var module = installedModules[moduleId] = {
	/******/      exports: {},
	/******/      id: moduleId,
	/******/      loaded: false
	/******/    };

	/******/    // Execute the module function
	/******/    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

	/******/    // Flag the module as loaded
	/******/    module.loaded = true;

	/******/    // Return the exports of the module
	/******/    return module.exports;
	/******/  }


	/******/  // expose the modules object (__webpack_modules__)
	/******/  __webpack_require__.m = modules;

	/******/  // expose the module cache
	/******/  __webpack_require__.c = installedModules;

	/******/  // __webpack_public_path__
	/******/  __webpack_require__.p = "";

	/******/  // Load entry module and return exports
	/******/  return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports) {

	  "use strict";

	  var defclass = function defclass(prototype) {
	    var constructor = prototype.constructor;
	    constructor.prototype = prototype;
	    return constructor;
	  };

	  defclass.extend = function (constructor, keys) {
	    var prototype = Object.create(constructor.prototype);
	    for (var key in keys) prototype[key] = keys[key];
	    return defclass(prototype);
	  };

	  /*
	  Export
	   */
	  module.exports = defclass;

	/***/ }
	/******/ ])
	});
	;

/***/ }
/******/ ])
});
;