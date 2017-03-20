var expect = require('expect.js');
var teFlow = require('te-flow');

var one = function () {
  return 1;
};

var two = function (oneVal) {
  //oneVal === 1
  return {
    oneVal: oneVal,
    twoval: oneVal + 1
  };
};

var three = function (oneVal, twoVal) {
  //oneVal === 1
  //twoVal === 2
  return {
    oneVal: oneVal,
    twoval: twoVal,
    three: twoVal + 1
  };
};

var addOne = function (oneVal, twoval, threeVal) {
  //oneVal === 1
  //twoVal === 2
  //threeVal === 3
  oneVal++;
  twoval++;
  threeVal++;
  return {
    oneVal: oneVal,
    twoval: twoval,
    threeVal: threeVal
  };
};



describe('Example', function () {
  it('Should return expected example val - objReturn', function () {
    var res = teFlow(
      one,
      two,
      three,
      addOne
    );
    expect(res).to.eql([2, 3, 4]);
  });
});