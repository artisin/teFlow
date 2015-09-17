var teFlow = require('../../lib/teflow-node');




debugger



var one = function  () {
  return 1;
};

var two = function (oneVal) {
  debugger
  //oneVal is the value that was returned
  //from the one function
  oneVal++;
  return arguments;
};

var three = function (oneVal, twoval) {
  //oneVal === 2
  //twoVal === 2
  oneVal = oneVal + 3;
  twoval = twoval - 3;
  return arguments;
};

var four = function () {
  //args === [5, -1]
  var args = [].slice.call(arguments);
  //only return positive vals
  return args.reduce(function (val) {
    if (val > 0) {
      return val;
    }
  });
};

var res = teFlow(
  one,
  two,
  three,
  four
);

// res === [5]

debugger