var expect = require('expect.js');
var teFlow = require('./../../lib/te-flow.js');
/*
Test Two
 */

var zeroNR = function () {
  console.log('zero');
};

var oneNR = function () {
  console.log('one');
  return;
};

var twoNR = function () {
  console.log('two');
};

var threeNR = function () {
  console.log('three');
  return;
};

var fourNR = function () {
  console.log('four');
};


describe('Values', function () {
  it('Should return undefined since no funk return a value', function () {
    var res = teFlow(zeroNR, oneNR, twoNR, threeNR, fourNR);
    expect(res)
    .to.eql(undefined);
  });
});