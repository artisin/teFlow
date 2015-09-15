var teFlow = require('../../lib/teflow-node');

console.log('Ran')

var zero = function () {
  return 0;
};

var addRandom = function () {
  // debugger
  return Math.floor(Math.random() * 1000) + 1;
};

var arr = function () {
  return 2;
}

// var res = teFlow(
//   {
//     _this: new beThis({
//       name: 'Te',
//       age: 'Too Old'
//     })
//   },
//   thisOne,
//   thisTwo,
//   thisThree,
//   {
//     return: report
//   }
// );

// console.log(res);
// console.log(JSON.stringify(res))

var res = teFlow(
  {
    _memoize: false,
    _start: {
      isNumber: function (arg) {
        // debugger
        if (typeof arg === 'number') {
          return arg;
        }
      },
      isEven: function (arg) {
        // debugger
        if (arg % 2 === 0) {
          return arg
        };
      }
    }
  },

  arr
);

debugger