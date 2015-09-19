# teFlow _function-control-and-flow_
[![Build Status](https://travis-ci.org/artisin/gulpFast.svg?branch=master)](https://travis-ci.org/artisin/teFlow)
[![Dependencies Status](https://david-dm.org/artisin/teFlow.svg)](https://david-dm.org/artisin/teFlow)

A function wrapper to help you organize your code in cleaner functional manner without promises! I love me some promises libraries like [ASQ](https://github.com/getify/asynquence) to structor my code base in a orginized fasion. Nevertheless, I was foreced to veture out into a promiseless world so I needed a promiseful tool to lend a helping hand and teFlow was born. In a nutshell teFlow is a function wrapper that creates an argument steam though `apply`.

```js
//The native way
var res1 = one();
var res2 = two.apply(null, res1);
var res3 = three.apply(null, res2);

//The teFlow way
var res = teFlow(
    one,
    two,
    three
);
```


## Note
I created this package for a current project I'm currently working on. With that said, I would hold your horses until I run this guy through the battlefield because the Api might change a bit before I release a 1.x. ~1-2 months tops. 


## Usage
### Install

```
npm install te-flow --save-dev
```

### Use
```
var teFlow = require('te-flow');
```
###### _Alternative_ 
Download the `te-flow.js` or `te-flow.browsers.js` file depending on your use in the `lib` folder and drop it into your projcet. The diffrence between the two files is the `.browser` injects all the dependencies into one file while the default uses `require` to include the dependencies. 
###### _Compressed Files_
I recommend you use webpack to manage your Js assets but I understand this is sometimes not an option so in the lib folder I have also included compressed and non-webpacked files as well. 

### Development
```
gulp
```

### Test
```
gulp test
```

## Api

### Options || Type: `obj`
+ `_args` or `_initArgs` || Type:`obj`, `method`, `obj w/methods` 
  * Sets the initial arguments which will be passed to the first fn call.
+ `_this` || Type: `obj`
  * Sets the value of `this` that will be applied to your fns otherwise the fn will be applied with null ex:`fn.apply(null, [args])`
+ `_objReturn` || Type:`boolean` Default: `true`
  * Allows you to return an `object` whose values will then be mapped as arguments and passed onto the next function instead of having to return an array or the `arguments` object making your code much more readable.
  * `_objKeep` || Type:`boolean` Default: `false`
    - Rather than mapping only the oject values this will perserve each object key and value by mapping out said objects as the arguments to retain the object keys which can be quite useful with reduce, merge, and the like.
+ `_flow` || Type:`boolean` Default:`false`
  * An interesting option. Basically, with this option turned on every fn return is pushed into your argument stream or queue or whatever you want to call it.
  * `_flatten` || Type:`boolean` Default:`false`
      - Flattens any sub arrays in stream.
+ Control
  * These conrol helpers will be inkoved every start, end, or result of the current function. The functions will be applied in order mapping out the input arguments. For example if your end arguments look something like this `[1, 2, 3]` and you had two function it do the following: `fn1(arg[0])`, `fn2(arg[0])`, `fn1(arg[1])`, `fn2(arg[1])`, ect.
  + `_start` || Type:`object` (method fns)
    * Arguments before applied to function.
  + `_end` || Type:`object` (method fns)
    * Arguments after applied to function.
  + `_res` || Type:`object` (method fns)
    * The value that is returned from function.
  + `_memoize` || Type:`boolean` Default: `true`
    * Uses lodash memoize to reduce overhead.

#### Setting The Options
Options are passed as an `object` as the first argument.
```js
var res = teFlow({
  {
    //options
    _this: self,
    _flow: true,
    _args: {
        argOne: 1,
        cool: 'sota'
    }
  }
});
```


## Examples

##### Passing Inital Arguments - `_args` Option
The arg option allows you to set the inital arguments which in turn are applied to the first function.
```js
//All methods will produce the same arguments
var fn1 = function (one, two, three) {
  //one === 1
  //two === true
  //three === 'three'
};

//Object
teFlow(
  {
    _args: {
      one: 1,
      two: true,
      three: 'three'
    }
  },
  fn1
);

//Method
teFlow(
  {
    _args: function () {
      return {
        one: 1,
        two: true,
        three: 'three'
      }
    }
  },
  f1
);

//Object with methods
teFlow(
  {
    _args: {
      one: function () {
        return 1;
      },
      two: function () {
        return true;
      },
      three: function () {
        return 'three';
      }
    }
  },
  fn1
);

```

##### Fn. List
The basic concept is each function will be called and then the return of the called will pass those arguments onto the next function via `apply`.
```js
var one = function () {
  return 1;
};

var two = function (oneVal) {
  //oneVal the value returned from fn one
  //oneVal === 1
  return oneVal + 1;
};

var three = function (twoVal) {
  //oneVal the value returned from fn two
  //twoVal === 2
  return twoVal + 1;
};

var res = teFlow(
    one,
    two,
    //res === return or three fn.
    three
);
//res === 3
```


##### Obj Return - `_objReturn` option
By default the `_objReturn` option is turned __on__ to help you better organize and or visualize what your are passing onto the next function. That being said, if you were to return a non object it will reset the argument stream to that value. 
```js
var one = function () {
  return 1;
};

var two = function (oneVal) {
  //oneVal === 1
  return {
    oneVal: oneVal,
    twoval: oneVal + 1
  };
};

var three = function (oneVal, twoVal) {
  //oneVal === 1
  //twoVal === 2
  return {
    oneVal: oneVal,
    twoval: twoVal,
    three: twoVal + 1
  };
};

var addOne = function (oneVal, twoval, threeVal) {
  //oneVal === 1
  //twoVal === 2
  //threeVal === 3
  oneVal++;
  twoval++;
  threeVal++;
  return {
    oneVal: oneVal,
    twoval: twoval,
    threeVal: threeVal
  };
};

var res = teFlow(
    one,
    two,
    three,
    addOne
);
//res === [2, 3, 4]
```

##### Obj Keep - `_objKeep` option
By default the `_objKeep` option is turned __off__. Nevertheless, as I said previously this option will map out the arguments as object to retaining both the key and value rather than mapping out just the values which can come handy with reduce, merge, and the like.
```js
//Merge helper
var merge = function() {
  var obj = {},
      i = 0,
      il = arguments.length,
      key;
  for (; i < il; i++) {
    for (key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key)) {
          obj[key] = arguments[i][key];
      }
    }
  }
  return obj;
};

var one = function () {
  return {
    keyOne: 1
  };
};

var two = function (oneVal) {
  //oneVal {keyOne: 1}
  return merge(oneVal, {keyTwo: 2});
};

var three = function (oneVal, twoVal) {
  //oneVal {keyOne: 1}
  //twoVal {keyTwo: 2}
  return merge(oneVal, twoVal, {keyThree: 3});
};

var res = teFlow(
    {
      _objKeep: true
    },
    one,
    two,
    three
);
//res === [{keyOne: 1}, {keyTwo: 2}, {keyThree: 3}]
```

While `_objKeep` is great and all there will be times when you don't want it to be returned as such. Good news, you can override the set default on a individual function basis through your return. This action is only temporary and after the return it will revert back to the set default.
```js
//using the same code as above just overriding the _objKeep
var three = function (oneVal, twoVal) {
  //oneVal {keyOne: 1}
  //twoVal {keyTwo: 2}
  return {
    _objKeep: false,
    one: merge(oneVal, twoVal, {keyThree: 3})
  };
};

//res === [{keyOne: 1, keyTwo: 2, keyThree: 3}]
```


##### Specified Return
There might be times when you would like to specify your return to a certain global variable or something of the sort. Don't you fret my friend you can do so via the passing an `object` as the last argument that has the key of `return` and then the corresponding value will be what is returned. The `return` can be a specified object or method.
```js
//To Be returned
var global = [];
var staticStr = 'Static';
var string = null;

var one = function () {
  return 'Did you';
};

var two = function (oneVal) {
  global.push(oneVal + ' say,');
  string = oneVal + ' say, ';
  return 'you';
};

var three = function (twoVal) {
  global.push(twoVal + ' needed to');
  string += twoVal + ' needed to';
  return {
    key1: 'specify',
    key2: 'your',
    key3: 'return?',
    space: ' '
  };
};

var four = function (k1, k2, k3, sp) {
  global.push(k1 + sp + k2 + sp + k3);
  string += sp + k1 + sp + k2 + sp + k3;
  //If passed an arg to the return method
  return true;
};

var res = teFlow(
    one,
    two,
    three,
    four,
    //While this formate will return global properly
    //it will will return string: null
    //
    // {
    //   return: {
    //     global: global,
    //     string: string
    //   }
    // }

    //To avoid issues I would recommend you use the
    //return method, this also allows you to access
    //any returned args from your last fn
    {
      return: function (cool) {
        //cool === true
        return {
          static: staticStr
          global: global,
          string: string,
          cool: cool
        };
      }
    }
);

// res = {
//   global: ["Did you say,", "you needed to", "specify your return?"],
//   string: "Did you say, you needed to specify your return?",
//   cool: true
// }

```


##### This
By default each fn is invoked via `fn.apply(null, [args])` so of course you have the ability to set `this`. In addition, you can reassign `this` in you return object via the `_this` key the corresponding value will reassigned to `this`, the `_this` key pair will then be removed from the return object. 

```js
//A Little Module Pattern
var beThis = (function () {
  var count = 0;
  var cool = function (obj) {
    this.name = obj.name;
    this.getName = function () {
      return this.name;
    };
    this.changeName = function (newName) {
      this.name = newName;
    };
    this.returnThis = function () {
      return this;
    };
    this.incNum = function () {
      count++;
    };
    this.rtnNum = function() {
      return count;
    };
  };
  return cool;
})();

var addMe = function () {
  return this.getName();
};

var changeMe = function (name) {
  //bump shared count
  this.incNum();
  //change name
  this.changeName('Te');
  return {
    oldName: name,
    newName: this.getName()
  };
};

var addYou = function (oldName, newName) {
  //Add
  var you = new beThis({
    name: 'You'
  });
  return {
    //reassign this
    _this: you,
    me: {
      oldName: oldName,
      name: newName
    },
  };
};

var res = teFlow(
    {
      //set init this
      _this: new beThis({
        name: '</artisin>'
      })
    },
    addMe,
    changeMe,
    addYou,
    {
      return: function (me) {
        debugger
        return {
          count: this.rtnNum(),
          myName: me.name,
          //reassigned this from prv fn
          yourName: this.getName()
        };
      }
    }
);

// res = {
//   count: 1,
//   myName: 'Te',
//   yourName: 'You'
// }
```

##### Flow
With this option set to true every return will be added to single return array. Additionally, you can pass `_flatten: true` which will flatten any sub-arrays that are returned. 
```js
var one = function () {
  return 1;
};
var two = function () {
  return 2;
};
var three = function () {
  //no return
};
var four = function () {
  return 4;
};

var res = teFlow(
    {
      _flow: true
    },
    one,
    two,
    three,
    four
);
// res === [1, 2, 4];
```



##### Control
_Docs coming soon._