var expect = require('expect.js');
var teFlow = require('../../lib/te-flow.js');
/*
Specified Return
 */

var returnMe = 'beer me!';

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
  it('Should return the specifed return when there is and object with the key of return', function () {
    var res = teFlow(zero, one, two('two'), three, four, five, six, {
      return: returnMe
    });
    expect(res)
    .to.eql('beer me!');
  });
});


