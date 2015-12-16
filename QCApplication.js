'use strict';

var Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {};


/**
 * Class info and constructor parameters.
 */
var QCApplication = function (options) {
  var _this,
      _initialize,
      // variables
      _factory;


  _this = View(options);

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _factory = QCFactory({
      url: options.url
    });
    _this.model.set({
      end: new Date('2015-10-31T00:00:00Z'),
      start: new Date('2015-10-01T00:00:00Z')
    });
  };

  _this.render = function () {
    _factory.getData({
      callback: function (data) {
        _this.el.innerHTML = '<pre>' +
            JSON.stringify(data, null, 2) +
            '</pre>';
      },
      end: _this.model.get('end'),
      start: _this.model.get('start')
    });
  };


  _initialize(options);
  options = null;
  return _this;
};
