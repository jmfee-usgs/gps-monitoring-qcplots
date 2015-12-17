'use strict';

var Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {};


/**
 * QC Plots application.
 *
 * @param options {Object}
 * @param options.channels {Object<String: Object>}
 *        {
 *          color: {String},
 *          title: {String},
 *          units: {String}
 *        }
 *        channel metadata
 * @param options.plots {Array<Object>}
 *        {
 *          title: {String}
 *          channels: {Array<String>}
 *        }
 *        plot title, and array of channel names to include.
 * @param options.url {String}
 *        plot data url.
 */
var QCApplication = function (options) {
  var _this,
      _initialize,
      // variables
      _factory,
      _navigationView,
      _plotViews,
      // methods
      _onDataChange;


  _this = View(options);

  _initialize = function (options) {
    var el,
        plots;

    options = Util.extend({}, _DEFAULTS, options);

    el = _this.el;
    el.innerHTML = '<nav class="navigation"></nav>' +
        '<section class="plots"></section>';
    plots = el.querySelector('.plots');
    _plotViews = [];

    _factory = QCFactory({
      url: options.url
    });

    _navigationView = QCNavigationView({
      el: el.querySelector('.navigation'),
      model: _this.model
    });

    // create component plots
    options.plots.forEach(function (plot) {
      var view;
      view = QCPlotView(Util.extend({
        data: _this.model
      }, plot));
      plots.appendChild(view.el);
      _plotViews.push(view);
    });

    _this.model.set({
      channels: options.channels
    });
  };

  /**
   * Data change listener.
   *
   * Updates model data property.
   *
   * @param data {Object|False}
   *        false when an error occurs.
   *        otherwise, key/value pairs of data arrays.
   */
  _onDataChange = function (data) {
    _this.model.set({
      data: data
    });
  };

  /**
   * Model change listener.
   *
   * @param changed {Object}
   *        object with key/value pairs that changed.
   *        when null, assume all have changed.
   */
  _this.render = function (changed) {
    if (!changed ||
        changed.hasOwnProperty('start') ||
        changed.hasOwnProperty('end')) {
      // only fetch data if start or end has changed.
      _factory.getData({
        callback: _onDataChange,
        end: _this.model.get('end'),
        start: _this.model.get('start')
      });
    }
  };


  _initialize(options);
  options = null;
  return _this;
};
