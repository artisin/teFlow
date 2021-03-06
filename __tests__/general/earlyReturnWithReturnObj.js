var expect = require('expect.js');
var teFlow = require('te-flow');

var one = function (oneVal) {
  return {
    oneVal: oneVal
  };
};

var two = function (oneVal) {
  var twoVal = 2;
  return {
    _return: true,
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
  it('If presented with `_return: true` return vals at that stage and do not call the next fn in line but if there is a return object then return the values to said object', function () {
    var res = teFlow.call({
      args: {
        oneVal: 1
      }},
      one,
      two,
      three, {
        return: function (oneVal) {
          return oneVal;
        }
      }
    );
    expect(res).to.eql(1);
  });
});
