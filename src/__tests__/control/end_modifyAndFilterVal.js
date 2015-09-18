var expect = require('expect.js');
var teFlow = require('../../../lib/te-flow.js');

var one = function () {
  return 1;
};
var two = function () {
  return 2;
};
var three = function () {
  return 'three';
};
var four = function () {
  return 4;
};

describe('Control - _end', function () {
  it('Should return array and everytime a val passes through it adds one', function () {
    var res = teFlow(
        {
          _flow: true,
          _end: {
            //only return numbers
            isNum: function (arg) {
              if (typeof arg === 'number') {
                return arg;
              }
            },
            //add one to num
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
    expect(res).to.eql([5, 5, undefined, 5]);
  });
});