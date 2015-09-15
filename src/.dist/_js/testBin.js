// var teFlow = require('../../../lib/te-flow-browser');

// console.log(teFlow)

// var zero = function () {
//   return 0;
// };
// var one = function () {
//   return 'one';
// };


// var work = teFlow(one);

// console.log(work)

// debugger;
// 
// 
// 

var applyFn = function (val, [first, ...rest]) {
  debugger
  return first === undefined
  ? val
  : applyFn(first(val), rest);
};


var add = function (n) {
  return n + Math.floor(Math.random() * 1000) + 1;
};

var sub = function (n) {
  return n + Math.floor(Math.random() * 1000) + 1;
};


var mapper = function (args, fns, prepend) {
  return args.map(function (val) {
    debugger
    return applyFn(val, fns);
  });
};

var hmm = mapper([1, 2], [add, sub], []);


debugger