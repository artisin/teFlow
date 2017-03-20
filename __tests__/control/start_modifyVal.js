var expect = require('expect.js');
var teFlow = require('te-flow');

var one = function () {
  return {
    one: 1
  };
};
var two = function (oneVal) {
  return {
    oneVal: oneVal,
    twoVal: 2
  };
};
var three = function (oneVal, twoVal) {
  return {
    oneVal: oneVal,
    twoVal: twoVal,
    threeVal: 3
  };
};
var four = function (oneVal, twoVal, threeVal) {
  return {
    oneVal: oneVal,
    twoVal: twoVal,
    threeVal: threeVal
  };
};

describe('Control - _start', function () {
  it('Should return array and everytime a val passes through it adds one', function () {
    var res = teFlow(
        {
          _start: {
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
    expect(res).to.eql([4, 4, 4]);
  });
});