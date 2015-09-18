# teFlow _function-control-and-flow_
[![Build Status](https://travis-ci.org/artisin/gulpFast.svg?branch=master)](https://travis-ci.org/artisin/te-Flow)

A function wrapper to help you orginize your code in cleaner functional manner. I typically use a promise library to structor my code base like [ASQ](https://github.com/getify/asynquence) but when I'm unable to do so I wanted to still maintain a clean functional manner. In a nut-shell teFlow creates an argument stream to through `apply` to pass. 

# Install

```
npm install te.flow --save-dev
```

# Use
```
var teFlow = require('te-flow');
```
### _Alternative_ 
Download the file `teflow.js` in the `lib` folder and drop it into your projcet.

# Test
```
gulp test
```

# Api
## About
In a nut-shell te-flow is a helper function wrapper that creates an argument steam though `apply` becuase ain't nobody want to 

```js
//The typical way
var res1 = one();
var res2 = two.apply(null, res1);
var res3 = three.apply(null, res2);

//The te-flow way
var res = teFlow(
    one,
    two,
    three
);
```

## Options - [`obj`]
+ `_args` or `_initArgs` - [Type:`obj` Default: `null`]
    * Sets the inital arguments which will be passed to the first fn call.
+ `_this` - [Type: `obj` Default: `null`]
    * Sets the value of `this` that will be applied to your fns otherwise the fn will be applied with null ex:`fn.apply(null, [args])`
+ `_objApply` - [Type:`boolean` Default: `true`]
    * Allows you to just return an `object` whose values will then be mapped and passed onto the next function instead of having to return the `arguments` obj to pass said arguments. 
+ `_flow` [Type:`boolean` Default: `false`]
    * An intresting option. Bascially, with this option turned on every fn return is pushed into your argument stream or queue or whatever you want to call it. 
+ Control
    * `_start`
    * `_end`
    * `_res`
    * `_flatten`

### Setting The Options
Options are passed as an `object` as the first argument to `teFlow`.
```js
var res = teFlow({
  {
    //options
    _this: self
    _args: {
        argOne: 1,
        cool: 'sota'
    }
  }
});
```


## Examples

#### Fn. List
The basic concept here is each function will be called and then the return of the called function is passed onto the next function.
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


#### Obj Return [`_objApply` opt]
By default the `_objApply` option is turned on to help you better orginize and or visulize what your are passing onto the next function. That being said, if you where to return a non object it reset the argument stream to that value.
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

