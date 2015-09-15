var isArray    = require('lodash.isarray');
var isFunction = require('lodash.isfunction');
var isObject   = require('lodash.isobject');
var memoize    = require('lodash.memoize');
var defaults   = require('lodash.defaults');
/*
teFlow
 */
var TeFlow = {
  init: function () {
    // debugger;
    var self = this;
    //init precheck for options
    //set args
    this.args = [...arguments];
    if (!this.count) {
      this.count = 1;
      this.args = this.checkOpts(this.args);
    }
    this.first = this.args.length ? this.args.shift() : null;
    this.rest = this.args;
    this.argsToApply = {};
    this.firstIsFn = self._h.isFn(self.first);
    this.firstIsUdf = self._h.isUdf(self.first);
    //check for args to apply
    var _argsToApply = this.rest[this.rest.length - 1];
    if (!self._h.isUdf(_argsToApply) && _argsToApply._fnArgs) {
      this.argsToApply._fnArgs = this.rest.pop()._fnArgs;
    }
    return this.process();
  },
  /*
  Checks for special options
   */
  checkOpts: function (args) {
    // debugger;
    var self = this;
    var car = args[0];
    var carIsObj = this._h.isFn(car) ? false : this._h.isObj(car);
    //will contain any stream opts to be applied
    this.streamOpts = [];
    //availible options and corresponding actions
    this.optList = {
      _flatten: this._h.flatten,
      _start: null,
      _res: null,
      _end: null
    };
    //checks for opts, and pushes
    if (carIsObj) {
      car = car._option ? car._option : car;
      //hardcoded opts
      //this ref to be applied to funks
      //set this for ref chain
      this._this = car._this ? car._this : null;
      //Initail args
      this.argsToApply._fnArgs = car._args ? car._args : {};
      this.argsToApply._fnArgs = car._initArgs ? car._initArgs : {};
      //memorize - true by default
      this._memoize = car._memoize === false ? false : true;
      //cylce through opt list
      Object.keys(self.optList).forEach(function (key) {
        //if key push the be applied when the time comes
        if (car[key]) {
          //push to array ref
          self.streamOpts.push(key);
          //assign if need be
          if (self.optList[key] === null) {
            self.optList[key] = car[key];
          }
        }
      });
      //ect....
      //shift off to return
      args.shift();
    }
    return args;
  },
  //TODO ORDER!!!!!!
  /*
  Applys any opts to val if set
   */
  applyOpts: function (value, options) {
    // debugger
    var self = this;
      var setOptions = function (value, options) {
        var _defaults = {
          stream: true,
          _start: false,
          _end: false,
          _res: false
        };
        return optCycle.apply(self, [value, self._h.defaults(options, _defaults)]);
      };

    //cycles through opts and invokes
    var optCycle = function (val, opts) {
      //filter out stage apply opts
      opts = opts.filter(function (opt) {
        if (opt !== '_start' && opt !== '_res' && opt !== '_end') {
          return opt;
        }else if (opt === '_start' && options._start) {
          return opt;
        }else if (opt === '_res' && options._res) {
          return opt;
        }else if (opt === '_end' && options._end) {
          return opt;
        }
      });
      //Go through option list to see what needs
      //to be applied
      return opts.reduce(function (prv, cur) {
        // debugger;
        return applyOpt(prv, self.optList[cur]);
      }, val);
    };

    //handels apply option to value
    var applyOpt = function (argArr, optFn) {
      //function
      if (self._h.isFn(optFn)) {
        return mapApply(argArr, optFn);
      }else if (self._h.isObj(optFn)) {
        // debugger
        //object
        return mapApply(argArr, Object.keys(optFn).map(function(o) {
          return optFn[o];
        }));
      }else if (self._h.isArr(optFn)) {
        //array
        return mapApply(argArr, optFn);
      }
    };

    //cylces through opts to apply
    //applys fns to said arg through some recursion
    function applyFn(arg, [firstFn, ...restFn]) {
      // debugger
      if (arg === undefined) {
        return;
      }else if (!self._h.isArr(arg)) {
        arg = [arg];
      }
      return firstFn === undefined
      ? arg
      : applyFn(firstFn.apply(self._this, arg), restFn);
    }


    function mapApply(arr, fns) {
      // debugger;
      //memoize to avodie repeat
      var _memApplyFn = self._h.memoize(function (a) {
        return applyFn(a, fns);
      });
      var _applyFn = self._memoize ? _memApplyFn : applyFn;
      return arr.filter(function (a) {
        var res = _applyFn(a, fns);
        // console.log(res)
        // debugger
        if (!self._h.isUdf(res) && res[0]) {
          return res[0];
        }
      });
    }


    //stream opt
    return this.streamOpts.length
           ? setOptions(value, this.streamOpts)
           : value;
  },
  /*
  Processes and shit
   */
  process: function () {
    // debugger
    var self = this;
    var applyArgs = function (val) {
      if (val === undefined) {
        return;
      }
      //apply res opts
      val = self.applyOpts(val, {_res: true});
      if (!self.argsToApply._fnArgs) {
        //create, and asssign
        self.argsToApply._fnArgs = [val];
      }else {
        self.argsToApply._fnArgs.push(val);
      }
      //apply end stream opts
      self.argsToApply._fnArgs = self.applyOpts(self.argsToApply._fnArgs, {
        _end: true
      });
    };
    //first is func
    // debugger
    if (this.firstIsFn) {
      // debugger
      var res = Object.keys(this.argsToApply).length
                ? this.first.apply(this._this, self.applyOpts(this.argsToApply._fnArgs, {
                  //apply start strams opts
                  _start: true
                }))
                : this.first.call(this._this);
      applyArgs(res);
      //return
      if (Object.keys(this.argsToApply).length) {
        this.rest.push(this.argsToApply);
      }
      return this.init.apply(self, this.rest);
    }else if (self._h.isObj(this.first) && this.first.return) {
      // debugger
      var rtn = this.first.return;
      //return object, if func all and return
      return this._h.isFn(rtn)
             ? rtn.apply(self._this, this.argsToApply._fnArgs || [])
             : rtn;
    }else if (self._h.isObj(this.first) && this.first._fnArgs) {
      //first is return fn obj
      return this.first._fnArgs;
    }else if (!this.firstIsFn && !this.firstIsUdf && this.first !== null) {
      //if first non-func assume args to be applied
      applyArgs(this.first);
      if (Object.keys(this.argsToApply).length) {
        this.rest.push(this.argsToApply);
      }
      return this.init.apply(self, this.rest);
    }else if (self._h.isUdf(this.first) && this.rest.length) {
      //first is undefined but still args to be called
      if (Object.keys(this.argsToApply).length) {
        //push args to arg chain
        this.rest.push(this.argsToApply);
      }
      return this.init.apply(self, this.rest);
    }else if (!this.rest.length) {
      //end call, no args to left to call
      //return args or undefined
      return Object.keys(this.argsToApply).length
             ? this.argsToApply._fnArgs
             : undefined;
    }
    //still beta
    console.warn('teFlow ERROR: Your not supposed to get here, if you do drop me a line.');
    return undefined;
  },
  getThis: function () {
    return this;
  },
  _h: {
    flatten: function (val) {
      var flatten = function (array, result) {
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
    defaults: function () {
      var args = [...arguments];
      var orgObj = args.shift();
      return defaults(orgObj, args);
    },
    memoize: function (fn) {
      return memoize(fn);
    },
    isFn: function (val) {
      return isFunction(val);
    },
    isObj: function (val) {
      return isObject(val);
    },
    isArr: function (val) {
      return isArray(val);
    },
    isUdf: function (val) {
      return val === undefined;
    }
  }
};
/*
Export
 */
module.exports = function teFlow() {
  // debugger
  var _fFlow = Object.create(TeFlow);
  var self = _fFlow.getThis();
  var args = [...arguments];
  return args.length
  ? _fFlow.init.apply(self, args)
  : undefined;
};