var expect = require('expect.js');
var teFlow = require('te-flow');

var merge = function() {
  var obj = {},
      i = 0,
      il = arguments.length,
      key;
  for (; i < il; i++) {
    for (key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key)) {
          obj[key] = arguments[i][key];
      }
    }
  }
  return obj;
};

var one = function () {
  return {
    keyOne: 1
  };
};

var two = function (oneVal) {
  //oneVal {keyOne: 1}
  return merge(oneVal, {keyTwo: 2});
};

var three = function (oneVal, twoVal) {
  //oneVal {keyOne: 1}
  //twoVal {keyTwo: 2}
  return {
    _objKeep: false,
    one: merge(oneVal, twoVal, {keyThree: 3})
  };
};


describe('objKeep - overrided', function () {
  it('Should overrided keep option and return one arg not three', function () {
    var res = teFlow(
        {
          _objKeep: true
        },
        one,
        two,
        three
    );
    expect(res).to.eql([{keyOne: 1, keyTwo: 2, keyThree: 3}]);
  });
});