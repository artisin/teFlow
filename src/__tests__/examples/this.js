var expect = require('expect.js');
var teFlow = require('../../../lib/te-flow.js');

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
  this.changeName('artisin');
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



describe('Example', function () {
  it('Should return expected example val', function () {
    var res = teFlow(
      {
        //set init this
        _this: new beThis({
          name: 'Te'
        })
      },
      addMe,
      changeMe,
      addYou,
      {
        return: function (me) {
          return {
            count: this.rtnNum(),
            myName: me.name,
            //reassigned this from prv fn
            yourName: this.getName()
          };
        }
      }
    );
    expect(res).to.eql({
      count: 1,
      myName: 'Te',
      yourName: 'You'
    });
  });
});