var expect = require('expect.js');
var teFlow = require('te-flow');

var one = function () {
  var args = [].slice.call(arguments);
  return args;
};


describe('Args - method - call', function () {
  it('The inital args sent to the first fn should be the args set by _args', function () {
    var res = teFlow.call({
      args: function () {
        return {
          one: 1,
          two: true,
          three: 'three'
        };
      }},
      one
    );
    expect(res).to.eql([1, true, 'three']);
  });
});