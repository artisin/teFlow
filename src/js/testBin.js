var teFlow = require('../../lib/te-flow');




// debugger



// var one = function  () {
//   return 1;
// };

// var two = function (oneVal) {
//   debugger
//   //oneVal is the value that was returned
//   //from the one function
//   oneVal++;
//   return arguments;
// };

// var three = function (oneVal, twoval) {
//   //oneVal === 2
//   //twoVal === 2
//   oneVal = oneVal + 3;
//   twoval = twoval - 3;
//   return arguments;
// };

// var four = function () {
//   //args === [5, -1]
//   var args = [].slice.call(arguments);
//   //only return positive vals
//   return args.reduce(function (val) {
//     if (val > 0) {
//       return val;
//     }
//   });
// };

// var res = teFlow(
//   one,
//   two,
//   three,
//   four
// );

// // res === [5]

// debugger


// var initArgs = function () {
//   debugger
//   return {
//     hmm: arguments[0]
//   }
// }

// var one = function () {
//   debugger
// };

// var two = function () {
  
// }


// var res = teFlow(
//   {
//     _args: {
//       first: 'one',
//       second: 2
//     }
//   },
//   initArgs,
//   one
// )
// 
// 


// var one = function () {
//   return arguments;
// };


// var res = teFlow(
//     {
//       _args: function () {
//         return {
//           one: 1,
//           two: 2,
//           three: 'three'
//         }
//       }
//     },
//     one
// );

// res === [1, 2, 4];



//A Little Module Pattern
var beThis = (function () {
  var count = 0;
  var cool = function (obj) {
    this.name = obj.name;
    this.getName = function () {
      return this.name;
    };
    this.changeName = function (newName) {
      this.name = newName;
    };
    this.returnThis = function () {
      return this;
    };
    this.incNum = function () {
      count++;
    };
    this.rtnNum = function() {
      return count;
    };
  };
  return cool;
})();

var addMe = function () {
  return this.getName();
};

var changeMe = function (name) {
  //bump shared count
  this.incNum();
  //change name
  this.changeName('Te');
  return {
    oldName: name,
    newName: this.getName()
  };
};

var addYou = function (oldName, newName) {
  //Add
  var you = new beThis({
    name: 'You'
  });
  return {
    //reassign this
    _this: you,
    me: {
      oldName: oldName,
      name: newName
    },
  };
};


var res = teFlow(
    {
      //set init this
      _this: new beThis({
        name: '</artisin>'
      })
    },
    addMe,
    changeMe,
    addYou,
    {
      return: function (me) {
        debugger
        return {
          count: this.rtnNum(),
          myName: me.name,
          //reassigned this from prv fn
          yourName: this.getName()
        };
      }
    }
);

debugger