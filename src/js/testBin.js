var teFlow = require('../../lib/te-flow');




// debugger



// var one = function  () {
//   return 1;
// };

// var two = function (oneVal) {
//   debugger
//   //oneVal is the value that was returned
//   //from the one function
//   oneVal++;
//   return arguments;
// };

// var three = function (oneVal, twoval) {
//   //oneVal === 2
//   //twoVal === 2
//   oneVal = oneVal + 3;
//   twoval = twoval - 3;
//   return arguments;
// };

// var four = function () {
//   //args === [5, -1]
//   var args = [].slice.call(arguments);
//   //only return positive vals
//   return args.reduce(function (val) {
//     if (val > 0) {
//       return val;
//     }
//   });
// };

// var res = teFlow(
//   one,
//   two,
//   three,
//   four
// );

// // res === [5]

// debugger


// var initArgs = function () {
//   debugger
//   return {
//     hmm: arguments[0]
//   }
// }

// var one = function () {
//   debugger
// };

// var two = function () {
  
// }


// var res = teFlow(
//   {
//     _args: {
//       first: 'one',
//       second: 2
//     }
//   },
//   initArgs,
//   one
// )
// 
// 

// var addNewObjArg = function (args, newObj) {
//   return Object.keys(args).reduce(function (prv, cur) {
//     var curObj = args[cur],
//         curKey = Object.keys(curObj)[0];
//     prv[curKey] = curObj[curKey];
//     return prv;
//   }, newObj);
// };

// var one = function () {
//   return {
//     keyOne: 1
//   };
// };
// var two = function (oneVal) {
//   //oneVal {keyOne: 1}
//   return addNewObjArg(arguments, {keyTwo: 2});
// };
// var three = function (oneVal, twoVal) {
//   //oneVal {keyOne: 1}
//   //twoVal {keyTwo: 2}
//   return addNewObjArg(arguments, {keyThree: 3});
// };


// var merge = function() {
//     var obj = {},
//         i = 0,
//         il = arguments.length,
//         key;
//     for (; i < il; i++) {
//         for (key in arguments[i]) {
//             if (arguments[i].hasOwnProperty(key)) {
//                 obj[key] = arguments[i][key];
//             }
//         }
//     }
//     return obj;
// };



// var one = function () {
//   return {
//     keyOne: 1
//   };
// };
// var two = function (oneVal) {
//   //oneVal {keyOne: 1}
//   return merge(arguments, {keyTwo: 2});
// };
// var three = function (oneVal, twoVal) {
//   //oneVal {keyOne: 1}
//   //twoVal {keyTwo: 2}
//   return merge(arguments, {keyThree: 3});
// };


// var res = teFlow(
//     {
//       _objKeep: true
//     },
//     one,
//     two,
//     three
// );

// res === [1, 2, 4];


// var addNewObjArg = function (args, newObj) {
//   // args.push(newObj);
//   return Object.keys(newObj).reduce(function (prv, curKey) {
//     debugger
//     prv[curKey] = newObj[curKey];
//     return prv;
//   }, args);
// };

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


debugger