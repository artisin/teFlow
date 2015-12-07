var expect = require('expect.js');
var teFlow = require('../../lib/te-flow.js');

var one = function (oneVal) {
  return {
    oneVal: oneVal
  };
};

var two = function (oneVal) {
  var twoVal = 2;
  return {
    _kill: true,
    oneVal: oneVal,
    twoVal: twoVal
  };
};

var three = function (oneVal, twoVal) {
  var threeVal = 3;
  return {
    oneVal: oneVal,
    twoVal: twoVal,
    threeVal: threeVal
  };
};


describe('Values', function () {
  it('If presented with `_kill: true` stop everything and return undefined', function () {
    var res = teFlow.call({
      args: {
        oneVal: 1
      }},
      one,
      two,
      three
    );
    expect(res).to.eql(undefined);
  });
});