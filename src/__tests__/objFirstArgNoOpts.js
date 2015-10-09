var expect = require('expect.js');
var teFlow = require('../../lib/te-flow.js');

describe('Saftey', function () {
  it('If an object is passed as an first arg but with no options it should carry on as noraml', function () {
    var res = teFlow({one: 1, two: 2, three: 3});
    expect(res)
    .to.eql([1, 2, 3]);
  });
});