var expect = require('expect.js');
var teFlow = require('./../../lib/te-flow.js');

var zeroMap = function () {
  return 0;
};

var oneMap = function () {
  var args = [].slice.call(arguments);
  var args = args.map(function (val) {
    return val + 1;
  });
  args.push(1);
  return args;
};

var twoMap = function () {
  var args = [].slice.call(arguments);
  var args = args.map(function (val) {
    return val + 2;
  });
  args.push(2);
  return args;
};

var threeMap = function () {
  var args = [].slice.call(arguments);
  var args = args.map(function (val) {
    return val + 3;
  });
  args.push(3);
  return args;
};


var res = teFlow(
  {
    _flatten: true
  },
  zeroMap,
  oneMap,
  twoMap,
  threeMap
);


describe('Flatten Option', function () {
  it('Should return a flatten array', function () {
    var res = teFlow(
      {
        _flow: true,
        _flatten: true
      },
      zeroMap,
      oneMap,
      twoMap,
      threeMap
    );
    expect(res)
    .to.eql([0, 1, 1, 2, 3, 3, 2, 3, 4, 4, 5, 6, 6, 5, 3]);
  });
});