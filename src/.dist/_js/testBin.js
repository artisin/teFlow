const teFlow = require('../../../lib/te-flow.js');

var one = function (oneVal) {
  debugger
  return {
    oneVal
  };
};

var two = function (oneVal) {
  let twoVal = 2;
  return {
    oneVal,
    twoVal
  };
};

var three = function (oneVal, twoVal) {
  let threeVal = 3;
  debugger
  return {
    oneVal,
    twoVal,
    threeVal
  };
};


let earlyReturn = teFlow.call({
  objReturn: false,
  args: {
    oneVal: 1
  }},
  one,
  two,
  three
);

debugger