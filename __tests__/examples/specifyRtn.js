var expect = require('expect.js');
var teFlow = require('./../../lib/te-flow.js');

var global = [];
var string = null;
var staticStr = 'Static';

var one = function () {
  return 'Did you';
};

var two = function (oneVal) {
  global.push(oneVal + ' say,');
  string = oneVal + ' say, ';
  return 'you';
};

var three = function (twoVal) {
  global.push(twoVal + ' needed to');
  string += twoVal + ' needed to';
  return {
    key1: 'specify',
    key2: 'your',
    key3: 'return?',
    space: ' '
  };
};

var four = function (k1, k2, k3, sp) {
  global.push(k1 + sp + k2 + sp + k3);
  string += sp + k1 + sp + k2 + sp + k3;
  //will be passed to return fn
  return true;
};


describe('Example', function () {
  it('Should return expected example val - specifyRtn', function () {
    var res = teFlow(
        one,
        two,
        three,
        four,
        //While this formate will return global properly
        //it will will return string: null
        //
        // {
        //   return: {
        //     global: global,
        //     string: string
        //   }
        // }

        //To advoide issues I would recomend you use the
        //return method, this also allows you to access
        //any returned args from your last fn
        {
          return: function (cool) {
            //cool === true
            return {
              static: staticStr,
              global: global,
              string: string,
              cool: cool
            };
          }
        }
    );
    expect(res).to.eql({
      static: "Static",
      global: ["Did you say,", "you needed to", "specify your return?"],
      string: "Did you say, you needed to specify your return?",
      cool: true
    });
  });
});