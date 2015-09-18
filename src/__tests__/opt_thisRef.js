var expect = require('expect.js');
var teFlow = require('../../lib/te-flow.js');

var beThis = (function () {
  var count = 0;
  var cool = function (obj) {
    this.name = obj.name;
    this.age = obj.age;
    this.clInfo = function (info) {
      console.log(this[info]);
    };
    this.getInfo = function (info) {
      return this[info];
    };
    this.changeInfo = function (info, newInfo) {
      this[info] = newInfo;
    };
    this.returnInfo = function () {
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


var thisOne = function () {
  this.incNum();
  console.log('My Name: ' + this.clInfo('name'));
};

var thisTwo = function () {
  this.changeInfo('age', 23);
  var mom = new beThis({
    name: 'Queen-Bee',
    age: 'Spring Chicken'
  });
  mom.incNum();
  return {
    mom: mom
  };
};


var thisThree = function (mom) {
  var dad = new beThis({
    name: 'King',
    age: 'Wisdom Has No Age'
  });
  dad.incNum();
  return {
    mom: mom,
    dad: dad
  };
};

var report = function () {
  var args = [].slice.call(arguments);
  args.push(this);
  console.log('=== REPORTER ===');
  var count = 'Total Count Of People: ' + this.rtnNum();
  console.log(count);
  var res = {};
  args.forEach(function (indv, index) {
    var name = indv.getInfo('name');
    console.log('Player: ' + index);
    console.log('Name: ' + name);
    console.log('Name: ' + indv.getInfo('age'));
    res[name] = indv;
  });
  return res;
};


var res = teFlow(
  {
    _this: new beThis({
      name: 'Te',
      age: 'Too Old'
    })
  },
  thisOne,
  thisTwo,
  thisThree,
  {
    return: report
  }
);



describe('Flatten Option', function () {
  it('Should return three object and report some info.', function () {
    var res = teFlow(
      {
        _this: new beThis({
          name: 'Te',
          age: 'Too Old'
        })
      },
      thisOne,
      thisTwo,
      thisThree,
      {
        return: report
      }
    );
    expect(Object.keys(res)).to.eql(["Queen-Bee", "King", "Te"]);
  });
});