var expect = require('expect.js');
var teFlow = require('./../../lib/te-flow.js');
/*
Specified Return
 */

var returnMe = 'Beer me!';

var zero = function () {
  return 0;
};
var one = function () {
  returnMe += ' Please!';
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
  returnMe += ' Pretty Please!';
  return true;
};
var five = function () {
  return false;
};
var six = function () {
  return true;
};


describe('Values', function () {
  it('Should return the specifed return when there is and object with the key of return', function () {
    var res = teFlow(zero, one, two('two'), three, four, five, six, {
      return: function (cool) {
        return {
          beer: returnMe,
          cool: cool
        };
      }
    });
    expect(res).to.eql({
      beer: "Beer me! Please! Pretty Please!",
      cool: true
    });
  });
});


