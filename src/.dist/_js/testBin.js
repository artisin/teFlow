const teFlow = require('../../../lib/te-flow.js');

const one = function (oneVal) {
  return {
    oneVal
  };
};

const two = function (oneVal) {
  let twoVal = 2;
  return {
    _return: true,
    oneVal,
    twoVal
  };
};

const three = function (oneVal, twoVal) {
  let threeVal = 3;
  return {
    oneVal,
    twoVal,
    threeVal
  };
};

let earlyReturn = teFlow.call({
  args: {
    oneVal: 1
  }},
  one,
  two,
  three, {
    return: function () {
      console.log('Will not get here');
    }
  }
);

debugger