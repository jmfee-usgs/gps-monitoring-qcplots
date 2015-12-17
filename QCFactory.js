'use strict';

var Events = require('util/Events'),
    Util = require('util/Util'),
    Xhr = require('util/Xhr');


var _DEFAULTS = {};


/**
 * QC Data Factory.
 */
var QCFactory = function (options) {
  var _this,
      _initialize,
      // variables
      _data,
      _error,
      // methods
      _filterData,
      _onError,
      _onSuccess;


  _this = Events();

  _initialize = function (options) {
    var url;

    options = Util.extend({}, _DEFAULTS, options);
    url = options.url;

    // set status variables to null
    _data = null;
    _error = null;

    Xhr.ajax({
      url: url,
      error: _onError,
      success: _onSuccess
    });
  };

  /**
   * Filter data arrays based on start/end time.
   *
   * @param data {Object<String: Array>}
   *        data to filter.
   * @param start {Date}
   *        first requested time.
   * @param end {Date}
   *        last requested time.
   * @return {Object<String: Array>}
   *         original data if start and end are undefined.
   *         otherwise, filtered data.
   */
  _filterData = function (data, start, end) {
    var dates,
        filtered,
        endIndex,
        key,
        startIndex,
        value;

    if (!start && !end) {
      return data;
    }

    if (end) {
      end = end.getTime();
    }
    if (start) {
      start = start.getTime();
    }

    // find start/end index
    dates = _data.date;
    startIndex = dates.length;
    endIndex = null;
    // dates are in decreasing order
    dates.some(function (d, index) {
      d = d.getTime();
      if (end) {
        if (endIndex === null && d <= end) {
          // first matching end time
          endIndex = index;
        }
      }
      if (start) {
        if (d >= start) {
          // still within start time
          startIndex = index;
        } else {
          // before start time, so done
          return true;
        }
      }
    });

    filtered = {};
    for (key in data) {
      value = data[key];
      if (Array.isArray(value)) {
        filtered[key] = value.slice(endIndex || 0, startIndex + 1);
      }
    }
    return filtered;
  };


  _onError = function (status) {
    _error = status;
    _this.trigger('ready');
  };

  _onSuccess = function (data) {
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    _data = data;
    _data.date = _data.date.map(function (d) {
      return new Date(d);
    });

    _this.trigger('ready');
  };


  /**
   * Free references.
   */
  _this.destroy = Util.compose(function () {
    _data = null;
    _error = null;
    _initialize = null;
    _onError = null;
    _onSuccess = null;
    _this = null;
  }, _this.destroy);


  /**
   * Get specific QC data.
   *
   * @param options {Object}
   * @param options.callback {Function({Object})}
   *        callback when data is ready.
   * @param options.end {Date}
   *        last requested time.
   * @param options.start {Date}
   *        first requested time.
   */
  _this.getData = function (options) {
    var data,
        dates,
        end,
        endIndex,
        onReady,
        start,
        startIndex;

    if (!options || !options.callback) {
      throw new Error('callback is a required parameter');
    }

    if (_data === null && _error === null) {
      // not ready, set up callback
      onReady = function () {
        // clean up onReady callback
        _this.off('ready', onReady);
        onReady = null;
        // call method again now that data is ready
        _this.getData(options);
      };
      _this.on('ready', onReady);
      return;
    } else if (_error !== null) {
      // there was an error loading data
      options.callback(false, _error);
      return;
    }

    data = _filterData(_data, options.start, options.end);
    options.callback(data);
  };


  _initialize(options);
  options = null;
  return _this;
};
