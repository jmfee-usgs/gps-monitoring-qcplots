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
      _factory,
      _navigationView;


  _this = View(options);

  _initialize = function (options) {
    var el;

    options = Util.extend({}, _DEFAULTS, options);

    el = _this.el;
    el.innerHTML = '<nav class="navigation"></nav>' +
        '<section class="plots"></section>';

    _factory = QCFactory({
      url: options.url
    });

    _navigationView = QCNavigationView({
      el: el.querySelector('.navigation'),
      model: _this.model
    });

    _this.model.set({
      end: new Date('2015-10-31T00:00:00Z'),
      start: new Date('2015-10-01T00:00:00Z')
    });
  };

  _this.render = function () {
    _factory.getData({
      callback: function (data) {
        _this.el.querySelector('.plots').innerHTML = '<pre>' +
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
