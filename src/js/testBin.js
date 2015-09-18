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


var one = function () {
  return 1;
};
var two = function () {
  return 2;
};
var three = function () {
  return 'three';
};
var four = function () {
  return 4;
};

var res = teFlow(
    {
      _flow: true,
      _res: {
        //only return numbers
        isNum: function (arg) {
          if (typeof arg === 'number') {
            return arg;
          }
        },
        //add one to num
        addOne: function (arg) {
          return arg + 1;
        }
      }
    },
    one,
    two,
    three,
    four
);

// res === [1, 2, 4];


debugger