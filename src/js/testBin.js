var teFlow = require('../../lib/te-flow');

var one = function () {
  var args = [].slice.call(arguments);
  return args;
};
    var res = teFlow.call(
      {
        args: function () {
              return {
                one: 1,
                two: true,
                three: 'three'
              };
            }
      },
      one
    );


debugger

