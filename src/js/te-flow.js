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
    var self = this;
    // debugger;

    //set args
    this.args        = [...arguments];
    this.argsToApply = {_fnArgs: []};

    //init precheck for options
    if (!this.count) {
      this.count       = 1;
      var optConfig    = this.checkOpts(this.args);
      this.args        = optConfig.args;
      this.argsToApply = optConfig.argsToApply;
    }
    // debugger
    this.first      = this.args.length ? this.args.shift() : null;
    this.rest       = this.args;
    this.firstIsFn  = self._h.isFn(self.first);
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
    this.streamOpt = [];
    //default helper
    var setOptD = function (opt, def) {
      return self._h.isUdf(car[opt]) ? def : car[opt];
    };
    //availible options and corresponding actions
    this.optList = {
      _stream: setOptD('_stream', true),
      _objReturn: setOptD('_objReturn', true),
      _objKeep: setOptD('_objKeep', false),
      _flow: setOptD('_flow', false),
      _flatten: setOptD('_flatten', false)
    };
    //stream options
    this.optStreamList = {
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
      //helper to invoke args if methods
      var invokeArgs = function (initArgs) {
        //args in method
        if (self._h.isFn(initArgs)) {
          return initArgs();
        }
        //assume args is obj
        return Object.keys(initArgs).reduce(function (prv, cur) {
          var curArg = initArgs[cur];
          prv[cur] = !self._h.isFn(curArg)
                     ? initArgs[cur]
                     : curArg();
          return prv;
        }, {});
      };
      if (car._args) {
        self.applyArgs(invokeArgs(car._args), true);
      } else if (car._initArgs) {
        self.applyArgs(invokeArgs(car._initArgs), true);
      }
      //memorize - true by default
      this._memoize = car._memoize === false ? false : true;
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
      //ect....
      //shift off to return
      args.shift();
    }
    return {
      args: args,
      //not the cleanest way to handle this but
      //oh well
      argsToApply: self.argsToApply
    };
  },
  /*
  Applys any opts to val if set
   */
  applyOpts: function (valueArr, funcOpt) {
    var self = this;
    /**
     * cycle through opts to apply
     * applys fns to said arg through some recursion
     * @param  {arg} arg      -indv arg
     * @param  {fn}  firstFn  -current fn
     * @param  {arr} restFn   -rest of funks to be invoked
     * @return {arr}          -arg val with appled fns
     */
    var applyFn = function (arg, [firstFn, ...restFn]) {
      if (arg === undefined) {
        return;
      }else if (!self._h.isArr(arg)) {
        arg = [arg];
      }
      return firstFn === undefined
             ? arg
             : applyFn(firstFn.apply(self._this, arg), restFn);
    };
    /**
     * Cycles through the vals and fns to apply
     * and then invokes thoese
     * @param  {arr} argArr - arg stream
     * @param  {fn} fns     - funks to be appled
     * @return {arr}        ->stream
     */
    var mapApply = function (argArr, fns) {
      // debugger;
      //memoize to avodie repeat
      var _memApplyFn = self._h.memoize(function (a) {
        return applyFn(a, fns);
      });
      var _applyFn = self._memoize ? _memApplyFn : applyFn;
      return argArr.map(function (a) {
        var res = _applyFn(a, fns);
        if (!self._h.isUdf(res) && res[0]) {
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
    var applyOpt = function (argArr, optToApply) {
      // debugger
      //function
      if (self._h.isFn(optToApply)) {
        return mapApply(argArr, optToApply);
      }else if (self._h.isObj(optToApply)) {
        //object
        return mapApply(argArr, Object.keys(optToApply).map(function(opt) {
          return optToApply[opt];
        }));
      }else if (self._h.isArr(optToApply)) {
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
    var optCycle = function (argArr, fnOpt, streamOpt) {
      //filter out stage apply opts
      streamOpt = streamOpt.filter(function (opt) {
        if (opt !== '_start' && opt !== '_res' && opt !== '_end') {
          return opt;
        }else if (opt === '_start' && fnOpt._start) {
          return opt;
        }else if (opt === '_res' && fnOpt._res) {
          return opt;
        }else if (opt === '_end' && fnOpt._end) {
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
    var setOptions = function (valArr, fnOpt, streamOpt) {
      var _defaults = {
        _start: false,
        _end: false,
        _res: false
      };
      return optCycle.apply(self, [
        valArr,
        self._h.defaults(fnOpt, _defaults),
        streamOpt
      ]);
    };

    //stream opt
    return this.streamOpt.length
           ? setOptions(valueArr, funcOpt, this.streamOpt)
           : valueArr;
  },
  applyArgs: function (value, initRun = false) {
    var self = this;
    var keepOveride = false;
    if (value === undefined) {
      return;
    }
    var pushApply = function (val) {
      if (self.optList._flow) {
        //Flow push
        self.argsToApply._fnArgs.push(val);
      }else if (self.optList._objReturn && self._h.isObj(val)) {
        var keepKey = self.optList._objKeep;
        //keep override check
        keepKey = keepOveride ? !keepKey : keepKey;
        //Object assign
        self.argsToApply._fnArgs = Object.keys(val).map(function (key) {
          var objKey;
          if (keepKey) {
            objKey = {};
            objKey[key] = val[key];
          }
          return keepKey ? objKey : val[key];
        });
      }else {
        //Reassign Stream
        val = self._h.isArr(val) ? val : [val];
        self.argsToApply._fnArgs = val;
      }
    };
    //apply res option
    // debugger
    //pushes val for next invoke
    if (!initRun) {
      //check to see if the user has specified a new this val
      //of overrided keep obj
      var checkAux = function (val) {
        if (!self._h.isUdf(val)) {
          //this
          if (val._this) {
            self._this = val._this;
            //remove key
            delete val._this;
          }
          //keep
          if (!self._h.isUdf(val._objKeep)) {
            keepOveride = true;
            //remove key
            delete val._objKeep;
          }
        }
        return val;
      };
      //res push
      pushApply((function () {
        //need to send val as an array to have opts applied
        if (!self._h.isArr(value)) {
          value = [checkAux(value)];
          var res = self.applyOpts(value, {_res: true});
          return res[0];
        }
        return self.applyOpts(checkAux(value), {_res: true});
      })());
      //apply end stream opts
      //check flatten stream - might be a better way to handle this but fuck it.
      self.argsToApply._fnArgs = !self.optList._flatten
                                 ? self.argsToApply._fnArgs
                                 : self._h.flatten(self.argsToApply._fnArgs);
      self.argsToApply._fnArgs = self.applyOpts(self.argsToApply._fnArgs, {
        _end: true
      });
    }else {
      //inial run, forget about factoring options
      pushApply(value);
    }
  },
  /*
  Processes and shit
   */
  process: function () {
    var self = this;
    //first is func
    if (this.firstIsFn) {
      var res = Object.keys(this.argsToApply).length
                ? this.first.apply(this._this, self.applyOpts(this.argsToApply._fnArgs, {
                  //apply start strams opts
                  _start: true
                }))
                : this.first.call(this._this);
      self.applyArgs(res);
      //return
      if (Object.keys(this.argsToApply).length) {
        this.rest.push(this.argsToApply);
      }
      return this.init.apply(self, this.rest);
    }else if (self._h.isObj(this.first) && this.first.return) {
      var rtn = this.first.return;
      //return object, if func all and return
      return this._h.isFn(rtn)
             ? rtn.apply(self._this, this.argsToApply._fnArgs || [])
             : rtn;
    }else if (self._h.isObj(this.first) && this.first._fnArgs) {
      //first is return fn obj
      return this.first._fnArgs.length
             ? this.first._fnArgs
             : undefined;
    }else if (!this.firstIsFn && !this.firstIsUdf && this.first !== null) {
      //if first non-func assume args to be applied
      self.applyArgs(this.first);
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
  /*
  Helpers
   */
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