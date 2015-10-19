'use strict';
const isArray    = require('lodash.isarray');
const isFunction = require('lodash.isfunction');
const isObject   = require('lodash.isobject');
const memoize    = require('lodash.memoize');
const defaults   = require('lodash.defaults');
const augment    = require('augment');
const defclass   = augment.defclass;
/*
teFlow
 */
var TeFlow = defclass({
  constructor: function (thisArg) {
    const self = this;
    self._self = self;
    self.userOptions = {};
    //no opts return
    if (!thisArg) { return; }
    //set opts
    var allOpts = ['initArgs', 'args', 'this', 'stream', 'objReturn',
                   'objKeep', 'flow', 'flatten', 'start', 'res', 'end'];
    allOpts.forEach(function (val) {
      if (thisArg[val]) {
        self.userOptions[val] = thisArg[val];
      }
    });
    //check memoize sep
    if (thisArg.memoize) {
      self._memoize = thisArg.memoize;
    }
  },
  init: function () {
    const self = this;
    //set args
    self.args        = [...arguments];
    self.argsToApply = {_fnArgs: []};

    //init precheck for options
    if (!self.count) {
      self.count       = 1;
      var optConfig    = self.checkOpts(self.args);
      self.args        = optConfig.args;
      self.argsToApply = optConfig.argsToApply;
    }
    //set fns
    self.first      = self.args.length ? self.args.shift() : null;
    self.rest       = self.args;
    self.firstIsFn  = self._L.isFn(self.first);
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
  checkOpts: function (args) {
    const self = this;
    var userOptions = Object.keys(self.userOptions);
    var car = args[0];
    var carIsObj = self._L.isFn(car) ? false : self._L.isObj(car);
    var constOpts = ['initArgs', 'args', 'this', 'stream', 'objReturn',
                   'objKeep', 'flow', 'flatten', 'start', 'res', 'end'];
    var fnOpts = ['_stream', '_objReturn', '_objKeep', '_flow', '_args',
                  '_flatten', '_start', '_res', '_end', '_option', '_this'];

    //check to make sure if an object is as first arg it has an opt
    var hasOpt =  false;
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
    var setOptD = function (constOpt, fnOpt, def) {
      //check for cunstructor options first
      if (self.userOptions[constOpts]) {
        return self.userOptions[constOpts];
      }
      return self._L.isUdf(car[fnOpt]) ? def : car[fnOpt];
    };
    //availible options and corresponding actions
    self.optList = {
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
        self._this =  self.userOptions['this'];
      }else {
        //fnOpt
        self._this = car._this ? car._this : null;
      }
      //Initail args
      //helper to invoke args if methods
      var invokeArgs = function (initArgs) {
        //args in method
        if (self._L.isFn(initArgs)) {
          return initArgs();
        }
        //assume args is obj
        return Object.keys(initArgs).reduce(function (prv, cur) {
          var curArg = initArgs[cur];
          prv[cur] = !self._L.isFn(curArg)
                     ? initArgs[cur]
                     : curArg();
          return prv;
        }, {});
      };
      //gate for init args
      if (self.userOptions.initArgs || self.userOptions.args) {
        //constOpt
        var _args = self.userOptions.args || self.userOptions.initArgs;
        self.applyArgs(invokeArgs(_args), true);
      }else if (car._args) {
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
  applyOpts: function (valueArr, funcOpt) {
    const self = this;
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
      }else if (!self._L.isArr(arg)) {
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
    var applyOpt = function (argArr, optToApply) {
      //function
      if (self._L.isFn(optToApply)) {
        return mapApply(argArr, optToApply);
      }else if (self._L.isObj(optToApply)) {
        //object
        return mapApply(argArr, Object.keys(optToApply).map(function(opt) {
          return optToApply[opt];
        }));
      }else if (self._L.isArr(optToApply)) {
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
        self._L.defaults(fnOpt, _defaults),
        streamOpt
      ]);
    };

    //stream opt
    return this.streamOpt.length
           ? setOptions(valueArr, funcOpt, this.streamOpt)
           : valueArr;
  },
  /**
   * Applies any fn args if specifed by user
   * @param  {dependant on res}  value
   * @param  {Boolean} initRun if inital run no to trip shit up
   */
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
      }else if (self.optList._objReturn && self._L.isObj(val)) {
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
        val = self._L.isArr(val) ? val : [val];
        self.argsToApply._fnArgs = val;
      }
    };
    //apply res option
    //pushes val for next invoke
    if (!initRun) {
      //check to see if the user has specified a new this val
      //of overrided keep obj
      var checkAux = function (val) {
        if (!self._L.isUdf(val)) {
          //this
          if (val._this) {
            self._this = val._this;
            //remove key
            delete val._this;
          }
          //keep
          if (!self._L.isUdf(val._objKeep)) {
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
        if (!self._L.isArr(value)) {
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
                                 : self._L.flatten(self.argsToApply._fnArgs);
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
    const self = this;
    //first is func
    if (self.firstIsFn) {
      var res = Object.keys(self.argsToApply).length
                ? self.first.apply(self._this, self.applyOpts(self.argsToApply._fnArgs, {
                  //apply start strams opts
                  _start: true
                }))
                : self.first.call(self._this);
      self.applyArgs(res);
      //return
      if (Object.keys(self.argsToApply).length) {
        self.rest.push(self.argsToApply);
      }
      return self.init.apply(self, self.rest);
    }else if (self._L.isObj(self.first) && self.first.return) {
      var rtn = self.first.return;
      //return object, if func all and return
      return self._L.isFn(rtn)
             ? rtn.apply(self._this, self.argsToApply._fnArgs || [])
             : rtn;
    }else if (self._L.isObj(self.first) && self.first._fnArgs) {
      //first is return fn obj
      return self.first._fnArgs.length
             ? self.first._fnArgs
             : undefined;
    }else if (!self.firstIsFn && !self.firstIsUdf && self.first !== null) {
      //if first non-func assume args to be applied
      self.applyArgs(self.first);
      if (Object.keys(self.argsToApply).length) {
        self.rest.push(self.argsToApply);
      }
      return self.init.apply(self, self.rest);
    }else if (self._L.isUdf(self.first) && self.rest.length) {
      //first is undefined but still args to be called
      if (Object.keys(self.argsToApply).length) {
        //push args to arg chain
        self.rest.push(self.argsToApply);
      }
      return self.init.apply(self, self.rest);
    }else if (!self.rest.length) {
      //end call, no args to left to call
      //return args or undefined
      return Object.keys(self.argsToApply).length
             ? self.argsToApply._fnArgs
             : undefined;
    }
    //still beta
    console.error('teFlow ERROR: Your not supposed to get here, if you do drop me a line.');
    return undefined;
  },
  _L: {
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
});

/*
Export
 */
module.exports = function () {
  var args = [...arguments];
  if (!args.length) {
    return undefined;
  }
  var teFlow = new TeFlow(this);
  return teFlow.init.apply(teFlow._self, args);
};
