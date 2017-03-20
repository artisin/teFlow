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
    twoval: [2, 2]
  };
};

var three = function (oneVal, twoVal) {
  return {
    oneVal: oneVal,
    twoVal: twoVal,
    threeVal: false
  };
};

var four = function (oneVal, twoVal, threeVal) {
  return {
    oneVal: oneVal,
    twoVal: twoVal,
    threeVal: threeVal,
    fourVal: {
      name: 'te'
    }
  };
};



describe('Obj Reset', function () {
  it('Stream should be reset if a non object is returned', function () {
    var res = teFlow(
        one,
        two,
        three,
        four
    );
    expect(res).to.eql([1, [2, 2], false, {name: 'te'}]);
  });
});