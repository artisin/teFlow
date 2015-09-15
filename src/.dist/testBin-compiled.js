/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	// var teFlow = require('../../../lib/te-flow-browser');

	// console.log(teFlow)

	// var zero = function () {
	//   return 0;
	// };
	// var one = function () {
	//   return 'one';
	// };

	// var work = teFlow(one);

	// console.log(work)

	// debugger;
	//
	//
	//

	"use strict";

	function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

	var applyFn = function applyFn(_x, _x2) {
	  var _again = true;

	  _function: while (_again) {
	    var val = _x,
	        _ref = _x2;
	    _ref2 = first = rest = undefined;
	    _again = false;

	    var _ref2 = _toArray(_ref);

	    var first = _ref2[0];

	    var rest = _ref2.slice(1);

	    debugger;
	    if (first === undefined) {
	      return val;
	    } else {
	      _x = first(val);
	      _x2 = rest;
	      _again = true;
	      continue _function;
	    }
	  }
	};

	var add = function add(n) {
	  return n + Math.floor(Math.random() * 1000) + 1;
	};

	var sub = function sub(n) {
	  return n + Math.floor(Math.random() * 1000) + 1;
	};

	var mapper = function mapper(args, fns, prepend) {
	  return args.map(function (val) {
	    debugger;
	    return applyFn(val, fns);
	  });
	};

	var hmm = mapper([1, 2], [add, sub], []);

	debugger;

/***/ }
/******/ ]);