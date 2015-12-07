var expect = require('expect.js');
var teFlow = require('../../lib/te-flow.js');

const one = function (oneVal) {
  return {
    oneVal
  };
};

const two = function (oneVal) {
  let twoVal = 2;
  return {
    _return: true,
    oneVal,
    twoVal
  };
};

const three = function (oneVal, twoVal) {
  let threeVal = 3;
  return {
    oneVal,
    twoVal,
    threeVal
  };
};

describe('Early Return', function () {
  it('If presented with `_return: true` in the return obj return at that point and do not proceed with any other fns', function () {
    var res = teFlow(
        one,
        two,
        three, {
          return: function () {
            console.log('will not get here');
          }
        }
    );
    expect(res).to.eql([1, 2]);
  });
});
