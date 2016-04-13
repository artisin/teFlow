# teFlow _functional-ish* pipeline for control and flow_

[![Build Status](https://travis-ci.org/artisin/teFlow.svg?branch=master)](https://travis-ci.org/artisin/teFlow)
[![Dependencies Status](https://david-dm.org/artisin/teFlow.svg)](https://david-dm.org/artisin/teFlow)

## Note!!!
As I dive deeper into the world of functional programming I can no longer recommend you use this package and in the future I plan to re-haul this whole idea, nevertheless, it does work and its a interesting concept.

*It's not by any means functional by your typical definition. At the time I created this I did not know what actual functional programming was. Nevertheless, this is what I thought it implied. 

## Intro

A function wrapper which creates a pipeline to help you organize your code in a cleaner functional manner. In a nutshell teFlow creates an argument pipeline/stream through `apply` so you can be functional with your thoughts and code.

```js
//The native way
let res1 = one();
let res2 = two.apply(null, res1);
let res3 = three.apply(null, res2);

//The teFlow way
let res = teFlow(
  one,
  two,
  three
);
```


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
Download the `te-flow.js` or `te-flow.browsers.js` file depending on your use in the `/lib` folder and drop it into your project. The difference between the two files is the `.browser` injects all the dependencies into one file while the default uses `require` to include the dependencies. 
###### _Compressed Files_
I recommend you use webpack to manage your Js assets but I understand this is sometimes not an option so in the lib folder I have also included compressed and non-webpacked files.

### Development
```
gulp
```

### Test
```
gulp test
```

## Api

### Init Options
+ `args` || `initArgs`
    * Value: `Object`, `Method`, `Object Methods` 
    * Sets the initial arguments which will be passed to the first function that is invoked.
+ `this`
    * Value: `Object`
    * Default: `null`
    * Sets the value of `this` that will be applied to your functions otherwise your functions will be applied with null ex:`fn.apply(null, [args])`
+ `objReturn` 
    * Value: `Boolean` 
    * Default: `true`
    * Allows you to return an `object` whose values are mapped and passed onto the next function as arguments instead of having to return an array or the `arguments` object making your code much more readable.
+ `objKeep`
    * Value: `Boolean` 
    * Default: `false`
    * This is a particularly dangerous option, but useful in some use cases. What is does is process the first `object` returned and maps out those key/values pairs as separate individual `object` arguments. This can be quite useful with `reduce` and the like with certain data structures. But do note order in objects are not guaranteed in JavaScript  
+ `flow`
    * Value:`Boolean` 
    * Default:`false`
    * An interesting option, basically every return from each invoked function is pushed into the argument pipeline. 
+ `flatten`
    * Value: `Boolean`
    * Default: `false`
    * Flattens any sub-arrays in the stream.

### Return Options
Note: These options need to be passed as the initial object argument in the return.

+ `_return`
    * Value: `Boolean`
    * It will immediately return the values at hand and not call the next functions in line.
+ `_kill`
    * Value: `Boolean`
    * It will immediately return `undefined` and not call the next functions in line.
+ `_objReturn`
    * Value: `Boolean`
    * Temporarily alter the default setting for said function.
_ `_objKeep`
    * Value: `Boolean`
    * Temporarily alter the default setting for said function.

### Control Options
Note: Still it bit unsure how I want to handle these options yet. 

+ `start`
    * Value: `Object Methods`
    * Arguments before applied to function.
+ `end`
    * Value: `Object Methods`
    * Arguments after applied to function.
+ `res`
    * Value: `Object Methods`
    * The value that is returned from all functions.
+ `memoize`
    * Value: `Boolean`
    * Default: `true`
    * Uses lodash memoize to reduce overhead.

## Examples
Note: These examples are using `ECMAScript 2015` syntax.

#### Basic Concept
The basic concept is that each function will be invoked and then the return will be passed onto the next function as the argument.
```js
const one = function () {
  return 1;
};

//oneVal the value returned from fn one
//oneVal === 1
const two = function (oneVal) {
  return oneVal + 1;
};

//oneVal the value returned from fn two
//twoVal === 2
const three = function (twoVal) {
  return twoVal + 1;
};

let res = teFlow(
  one,
  two,
  three
);
//res === 3
```

#### Setting The Options
Options are set via a `call` object argument or as a `object` being the first argument. If your using `object` method the option keys must be prefixed with `_`. 
```js
//call
let res = teFlow.call({
  this: self,
  flow: true,
  args: {
    argOne: 1,
    cool: 'dog'
  }},
  fnOne,
  fnTwo,
  fnThree
);

//obj
let res = teFlow({
  _this: self,
  _flow: true,
  _args: {
    argOne: 1,
    cool: 'sorta'
  }},
  fnOne,
  fnTwo,
  fnThree
);
```

_Ps. for the rest of these examples I will be using the `call` methodology._

#### Passing Initial Arguments - `args`
The `args` option allows you to set the initial arguments which in turn are applied to the first function.
```js
//All methods will produce the same arguments
const fnOne = function (one, two, three) {
  //one === 1
  //two === true
  //three === 'three'
};

//Object
teFlow.call({
  args: {
    one: 1,
    two: true,
    three: 'three'
  }},
  fnOne
);

//Method
teFlow.call({
  args: function () {
    return {
      one: 1,
      two: true,
      three: 'three'
    };
  }},
  fnOne
);

//Object with methods
teFlow.call({
  args: {
    one: function () {
      return 1;
    },
    two: function () {
      return true;
    },
    three: function () {
      return 'three';
    }
  }},
  fnOne
);

```


#### Object Return - `objReturn`
By default the `objReturn` option is set to __true__ to help you better organize and visualize what your are passing onto the next function. That being said, if you were to return a non object it will reset the argument stream to that value. 
```js
const one = function () {
  return 1;
};

//oneVal === 1
const two = function (oneVal) {
  let twoVal = oneVal++;
  return {
    oneVal,
    twoVal
  };
};

//oneVal === 1
//twoVal === 2
const three = function (oneVal, twoVal) {
  let threeVal = twoVal++;
  return {
    oneVal,
    twoVal,
    threeVal
  };
};

//oneVal === 1
//twoVal === 2
//threeVal === 3
const addOne = function (oneVal, twoVal, threeVal) {
  oneVal++;
  twoVal++;
  threeVal++;
  return {
    oneVal,
    twoVal,
    threeVal
  };
};

let res = teFlow(
  one,
  two,
  three,
  addOne
);
//res === [2, 3, 4]
```

#### Specified Return Object Method
For convenience, readability, and a bit of extra control if you have a `Object Method` with the key of `return` as your last value it will be the final function that is invoked and whatever is return will be the results.
```js
//oneVal === 1
const one = function (oneVal) {
  return {
    oneVal
  };
};

//oneVal === 1
const two = function (oneVal) {
  let twoVal = 2;
  return {
    oneVal,
    twoVal
  };
};

//oneVal === 1
//twoVal === 2
const three = function (oneVal, twoVal) {
  let threeVal = 3;
  return {
    oneVal,
    twoVal,
    threeVal
  };
};


let res = teFlow.call({
  args: {
    oneVal: 1
  }},
  one,
  two,
  three, {
    //oneVal === 1
    //twoVal === 2
    //threeVal === 3
    return: function (oneVal, twoVal, threeVal) {
      // res will equale whatever is returned here
      return 'Beer Me!'
    }
  }
);
//res === 'Beer Me!'
```

#### Object Keep - `objKeep`
By default the `objKeep` option is set to __false__,  nevertheless, as I said previously this is a particularly dangerous option, but useful in some use cases. What is does is process the first `object` returned and maps out those key/values pairs as separate individual `object` arguments. This can be quite useful with `reduce` and the like when dealing with certain data structures. 

__Note:__ The order in objects are not guaranteed in JavaScript.
```js
//Merge helper
const _ = require('lodash');

const one = function () {
  return {
    keyOne: 1
  };
};

//oneVal === {keyOne: 1}
const two = function (oneVal) {
  return _.merge(oneVal, {keyTwo: 2});
};

//oneVal === {keyOne: 1}
//twoVal === {keyTwo: 2}
const three = function (oneVal, twoVal) {
  return _.merge(oneVal, twoVal, {keyThree: 3});
};

let res = teFlow.call({objKeep: true},
  one,
  two,
  three
);
//res === [{keyOne: 1}, {keyTwo: 2}, {keyThree: 3}]
```

While `objKeep` is great and all there will be times when you will not want it to be returned as such. Good news, you can override the set default on a individual function basis through your return and passing `_objKeep` as the first argument. This action is only temporary and after the return it will revert back to the set default.
```js
//using the same code as above just overriding the _objKeep
const three = function (oneVal, twoVal) {
  //oneVal === {keyOne: 1}
  //twoVal === {keyTwo: 2}
  return {
    _objKeep: false,
    //make note of the key value pair
    one: _.merge(oneVal, twoVal, {keyThree: 3})
  };
};
//You might have expected a result like below but since
//the obj is assinged to the `one` obj we are only passing
//along one argument here
//res === [{keyOne: 1, keyTwo: 2, keyThree: 3}]

//Alternativly if you want to pass only the values just dont
//assing the objs to a key
const three = function (oneVal, twoVal) {
  //oneVal === {keyOne: 1}
  //twoVal === {keyTwo: 2}
  return {
    _objKeep: false,
    _.merge(oneVal, twoVal, {keyThree: 3})
  };
};

//res === [1, 2, 3,]
```


#### Specified Return Object Method Example Two
Long story short, I accidentally made another example for the specified return but rather than omitting it I will leave it here because it demonstrates a somewhat different use case. There might be times when you would like to specify your return to a certain global variable or something of the sort. Don't you fret my friend you can do so via passing an `object` as the last argument that has the key of `return` and then the corresponding value will be what is returned. The `return` can be a specified `object` or `method`.
```js
//To Be returned
let globalArray = [];
let staticStr = 'Static';
let string = null;

//oneVal === 'Did you'
const two = function (oneVal) {
  globalArray.push(oneVal + ' say,');
  string = oneVal + ' say, ';
  return 'you';
};

//oneVal === 'you'
const three = function (twoVal) {
  globalArray.push(twoVal + ' needed to');
  string += twoVal + ' needed to';
  return {
    key1: 'specify',
    key2: 'your',
    key3: 'return?',
    space: ' '
  };
};

//k1 === 'specify'
//k2 === 'your'
//k3 === 'return?'
//sp === ' '
const four = function (k1, k2, k3, sp) {
  globalArray.push(k1 + sp + k2 + sp + k3);
  string += sp + k1 + sp + k2 + sp + k3;
  return true;
};

let res = teFlow(
  one,
  two,
  three,
  four, {
    return: function (cool) {
      //cool === true
      return {
        static: staticStr,
        globalArray: globalArray,
        string: string,
        cool: cool
      };
    }
  }
);
// res = {
//  static: 'Static',
//  globalArray: ["Did you say,", "you needed to", "specify your return?"],
//  string: "Did you say, you needed to specify your return?",
//  cool: true
// }

```


#### This - `this`
By default each function is invoked via `fn.apply(null, [args])` so of course you have the ability to set `this`. In addition, you can reassign `this` in you return object via the `_this` key and the corresponding value will be reassigned to `this`. 

```js
//A Little Module Pattern
const beThis = (function () {
  let count = 0;
  let cool = function (obj) {
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

const addMe = function () {
  return this.getName();
};

//name === '</artisin>'
//bump shared count
const changeMe = function (name) {
  this.incNum();
  //change name
  this.changeName('Te');
  return {
    oldName: name,
    newName: this.getName()
  };
};

//oldName === '</artisin>'
//newName === 'Te'
const addYou = function (oldName, newName) {
  //Add you
  var you = new beThis({
    name: 'You'
  });
  //bind me to current this ref for latter use
  var me = function() {
    return this;
  };
  me = me.call(this);
  return {
    //reassign this
    _this: you,
    me: me
  };
};

let res = teFlow.call({
  //set the `this` ref for `addMe`
  this: new beThis({
    name: '</artisin>'
  })},
  addMe,
  changeMe,
  addYou, {
    return: function (me) {
      //me ref to me this
      return {
        count: this.rtnNum(),
        myName: me.getName(),
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

#### Flow - `flow`
With this option set to true every return will be added to a single return array. Additionally, you can pass `flatten: true` which will flatten any sub-arrays that are returned. 
```js
const one = function () {
  return 1;
};
const two = function () {
  return 2;
};
const three = function () {
  //no return
};
const four = function () {
  return 4;
};

let res = teFlow.call({flow: true},
  one,
  two,
  three,
  four
);
// res === [1, 2, 4];
```

#### Return - `_return`
Returns values at said point and does not call the next functions in line. __Note:__ If you have a return method in teFlow it will return the values to that return method.
```js
//oneVal === 1
const one = function (oneVal) {
  return {
    oneVal: oneVal
  };
};

//oneVal === 1
const two = function (oneVal) {
  let twoVal = 2;
  //return said vaules at this point
  return {
    _return: true,
    oneVal: oneVal,
    twoVal: twoVal
  };
};

const three = function (oneVal, twoVal) {
  let threeVal = 3;
  return {
    oneVal: oneVal,
    twoVal: twoVal,
    threeVal: threeVal
  };
};

const res = teFlow.call({
  args: {
    oneVal: 1
  }},
  one,
  two,
  three
);
// res === [1, 2];
```

#### Kill - `_kill`
Stops everything and returns `undefined`
```js
//oneVal === 1
const one = function (oneVal) {
  return {
    oneVal: oneVal
  };
};

//oneVal === 1
const two = function (oneVal) {
  let twoVal = 2;
  //return said vaules at this point
  return {
    _kill: true,
    oneVal: oneVal,
    twoVal: twoVal
  };
};

const three = function (oneVal, twoVal) {
  let threeVal = 3;
  return {
    oneVal: oneVal,
    twoVal: twoVal,
    threeVal: threeVal
  };
};

const res = teFlow.call({
  args: {
    oneVal: 1
  }},
  one,
  two,
  three
);
// res === undefined;
```



#### Control Methods
_Docs Coming Soon, need to do some cogitating_
Note: I did write some early test for these methods if you would like a better picture.

These methods will be invoked every start, end, or as the result of the current function. The functions will be applied in order as listed. For example if your end arguments look something like this `[1, 2, 3]` and you had two function it would do the following: `fn1(arg[0])`, `fn2(arg[0])`, `fn1(arg[1])`, `fn2(arg[1])`, ...
