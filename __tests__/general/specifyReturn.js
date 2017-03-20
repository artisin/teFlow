var expect = require('expect.js');
var teFlow = require('./../../lib/te-flow.js');

//To Be returned
var global = [];

var one = function () {
  return {
    one: 1
  };
};

var two = function (oneVal) {
  global.push(oneVal + 1);
  return {
    oneVal: oneVal,
    twoVal: 2
  };
};

var three = function (oneVal, twoVal) {
  global.push(twoVal + 2);
  return {
    oneVal: oneVal,
    twoVal: twoVal,
    threeVal: false
  };
};

var four = function (oneVal, twoVal, threeVal) {
  global.push(threeVal);
  //no return will return global
  return;
};


describe('Values', function () {
  it('Should return undefined since no funk return a value', function () {
    var res = teFlow(
        one,
        two,
        three,
        four,
        {
          //gloabl - what will be returned
          return: global
        }
    );
    expect(res).to.eql([2, 4, false]);
  });
});