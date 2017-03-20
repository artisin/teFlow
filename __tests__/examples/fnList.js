var expect = require('expect.js');
var teFlow = require('./../../lib/te-flow.js');

var one = function () {
  return 1;
};

var two = function (oneVal) {
  //oneVal the value returned from fn one
  //oneVal === 1
  return oneVal + 1;
};

var three = function (twoVal) {
  //oneVal the value returned from fn two
  //twoVal === 2
  return twoVal + 1;
};



describe('Example', function () {
  it('Should return expected example val - fnList', function () {
    var res = teFlow(
      one,
      two,
      //res === return or three fn.
      three
    );
    expect(res).to.eql([3]);
  });
});