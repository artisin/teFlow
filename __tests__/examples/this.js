var expect = require('expect.js');
var teFlow = require('./../../lib/te-flow.js');

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
}());

var addMe = function () {
  return this.getName();
};

var changeMe = function (name) {
  //name === '</artisin>'
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
  //oldName === '</artisin>'
  //newName === 'Te'
  //Add new beThis
  var you = new beThis({
    name: 'You'
  });
  //bind me to current this ref for latter use
  var me = function() {
    return this;
  };
  me = me.call(this);
  return {
    //reassign this
    _this: you,
    me: me
  };
};


describe('Example', function () {
  it('Should return expected example val - this', function () {
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
            //me === ref to me
            return {
              count: this.rtnNum(),
              myName: me.getName(),
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