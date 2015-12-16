'use strict';

var Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {};

// one year in milliseconds
var _ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;


/**
 * Navigation view sets time range of QC data to be displayed.
 */
var QCNavigationView = function (options) {
  var _this,
      _initialize,
      // variables
      _allData,
      _pastYear,
      // methods
      _onAllDataClick,
      _onPastYearClick;


  _this = View(options);

  _initialize = function (options) {
    var el;

    options = Util.extend({}, _DEFAULTS, options);

    el = _this.el;
    el.innerHTML = '<button class="pastYear">Past Year</button>' +
        '<button class="allData">All Data</button>';
    _allData = el.querySelector('.allData');
    _pastYear = el.querySelector('.pastYear');

    _allData.addEventListener('click', _onAllDataClick);
    _pastYear.addEventListener('click', _onPastYearClick);
  };


  /**
   * Clear start/end times.
   */
  _onAllDataClick = function () {
    _this.model.set({
      end: null,
      start: null
    });
  };

  /**
   * Set start time to one year ago.
   */
  _onPastYearClick = function () {
    _this.model.set({
      end: null,
      start: new Date(new Date().getTime() - _ONE_YEAR_MS)
    });
  };


  /**
   * Free references.
   */
  _this.destroy = Util.compose(function () {
    _allData.removeEventListener('click', _onAllDataClick);
    _pastYear.removeEventListener('click', _onPastYearClick);

    _allData = null;
    _initialize = null;
    _onAllDataClick = null;
    _onPastYearClick = null;
    _pastYear = null;
    _this = null;
  }, _this.destroy);


  _initialize(options);
  options = null;
  return _this;
};
