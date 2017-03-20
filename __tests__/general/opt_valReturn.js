var expect = require('expect.js');
var teFlow = require('./../../lib/te-flow.js');
/*
Test One
 */
var zero = function () {
  return 0;
};
var one = function () {
  return 'one';
};
var two = function (val) {
  return val;
};
var three = function () {
  return {
    three: 3
  };
};
var four = function () {
  return true;
};
var five = function () {
  return false;
};
var six = function () {
  return ['cool', true];
};

describe('Values', function () {
  it('Should return values of all exucuted funks', function () {
    var res = teFlow({_flow: true}, zero, one, two('two'), three, four, five, six);
    expect(res)
    .to.eql([0, 'one', 'two', {three: 3}, true, false, ['cool', true]]);
  });
});

