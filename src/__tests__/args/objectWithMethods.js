var expect = require('expect.js');
var teFlow = require('../../../lib/te-flow.js');

var one = function () {
  var args = [].slice.call(arguments);
  return args;
};


describe('Args - objectWithMethods', function () {
  it('The inital args sent to the first fn should be the args set by _args', function () {
    var res = teFlow(
        {
          _args: {
            one: function () {
              return 1;
            },
            two: function () {
              return true;
            },
            three: function () {
              return 'three';
            }
          }
        },
        one
    );
    expect(res).to.eql([1, true, 'three']);
  });
});