// GoogleChartLoader Singleton

// Based on http://blog.arkency.com/2014/09/react-dot-js-and-google-charts/

import Debug from 'debug';

var debug = new Debug('react-google-charts:GoogleChartLoader');
var script = typeof window !== 'undefined' ? require('loadjs') : function (link, _ref) {
  var callback = _ref.success;
  return callback();
};

var googleChartLoader = {
  isLoaded: false,
  isLoading: false,
  initPromise: {},
  init: function init(packages, version) {
    var _this = this;

    debug('init', packages, version);
    if (this.isLoading || this.isLoaded) {
      return this.initPromise;
    }
    this.isLoading = true;
    this.initPromise = new Promise(function (resolve) {
      script('https://www.gstatic.com/charts/loader.js', { success: function success() {
          window.google.charts.load(version || 'current', { packages: packages || ['corechart'] });
          window.google.charts.setOnLoadCallback(function () {
            debug('Chart Loaded');
            _this.isLoaded = true;
            _this.isLoading = false;
            resolve();
          });
        } });
    });
    return this.initPromise;
  }
};

export default googleChartLoader;