var expect = require('expect.js');
var teFlow = require('../../../lib/te-flow.js');


var addOne = function () {
  var args = [].slice.call(arguments);
  //add one
  args = args.map(function (val) {
    return val + 1;
  });
  //techincally will reset the stream to but
  //it is reseting it to the input val.
  return args;
};

var one = function () {
  return {
    one: 1,
    two: 2
  };
};

//reset stream
var twoReset = function () {
  var args = [].slice.call(arguments);
  console.log(args);
  return 2;
};

var three = function (twoVal) {
  return {
    two: twoVal,
    three: 3
  };
};



describe('Obj Reset', function () {
  it('Stream should be reset if a non object is returned', function () {
    var res = teFlow(
        one,
        addOne,
        twoReset,
        three,
        addOne
    );
    expect(res)
    .to.eql([3, 4]);
  });
});