function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint react/forbid-prop-types: "off" */
import React from 'react';
import PropTypes from 'prop-types';
import Debug from 'debug';

import DEFAULT_COLORS from '../constants/DEFAULT_CHART_COLORS';
import googleChartLoader from './GoogleChartLoader';

var debug = new Debug('react-google-charts:Chart');

var uniqueID = 0;

var generateUniqueID = function generateUniqueID() {
  uniqueID += 1;
  return 'reactgooglegraph-' + uniqueID;
};

var Chart = function (_React$Component) {
  _inherits(Chart, _React$Component);

  function Chart(props) {
    _classCallCheck(this, Chart);

    debug('constructor', props);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = { graphID: props.graph_id || generateUniqueID() };
    _this.chart = null;
    _this.wrapper = null;
    _this.hidden_columns = {};
    _this.dataTable = [];

    _this.debounce = _this.debounce.bind(_this);
    _this.onResize = _this.onResize.bind(_this);
    _this.drawChart = _this.drawChart.bind(_this);
    _this.togglePoints = _this.togglePoints.bind(_this);
    _this.buildDataTableFromProps = _this.buildDataTableFromProps.bind(_this);
    _this.listenToChartEvents = _this.listenToChartEvents.bind(_this);
    _this.addChartActions = _this.addChartActions.bind(_this);
    _this.updateDataTable = _this.updateDataTable.bind(_this);
    _this.onSelectToggle = _this.onSelectToggle.bind(_this);
    _this.addSourceColumnTo = _this.addSourceColumnTo.bind(_this);
    _this.restoreColorTo = _this.restoreColorTo.bind(_this);
    _this.hideColumn = _this.hideColumn.bind(_this);
    return _this;
  }

  Chart.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    debug('componentDidMount');
    if (typeof window === 'undefined') {
      return;
    }
    if (this.props.loadCharts) {
      googleChartLoader.init(this.props.chartPackages, this.props.chartVersion).then(function () {
        _this2.drawChart();
      });
      this.onResize = this.debounce(this.onResize, 200);
      window.addEventListener('resize', this.onResize);
    } else {
      this.drawChart();
    }
  };

  Chart.prototype.componentDidUpdate = function componentDidUpdate() {
    var _this3 = this;

    debug('componentDidUpdate');
    if (!this.props.loadCharts) {
      this.drawChart();
    } else if (googleChartLoader.isLoading) {
      googleChartLoader.initPromise.then(function () {
        _this3.drawChart();
      });
    } else if (googleChartLoader.isLoaded) {
      this.drawChart();
    }
  };

  Chart.prototype.componentWillUnmount = function componentWillUnmount() {
    try {
      if (window) {
        if (window.google && window.google.visualization) {
          window.google.visualization.events.removeAllListeners(this.wrapper);
        }
        window.removeEventListener('resize', this.onResize);
      }
    } catch (err) {
      return;
    }
  };

  Chart.prototype.onResize = function onResize() {
    debug('Chart::onResize');
    this.drawChart();
  };

  Chart.prototype.onSelectToggle = function onSelectToggle() {
    debug('onSelectToggle');
    var selection = this.chart.getSelection();
    if (selection.length > 0) {
      if (selection[0].row == null) {
        var column = selection[0].column;
        this.togglePoints(column);
      }
    }
  };

  Chart.prototype.getColumnColor = function getColumnColor(columnIndex) {
    if (this.props.options.colors) {
      if (this.props.options.colors[columnIndex]) {
        return this.props.options.colors[columnIndex];
      }
    } else if (columnIndex in DEFAULT_COLORS) {
      return DEFAULT_COLORS[columnIndex];
    }
    return DEFAULT_COLORS[0];
  };

  Chart.prototype.buildDataTableFromProps = function buildDataTableFromProps() {
    debug('buildDataTableFromProps', this.props);

    if (this.props.diffdata) {
      var diffdata = this.props.diffdata;
      var oldData = window.google.visualization.arrayToDataTable(diffdata.old);
      var newData = window.google.visualization.arrayToDataTable(diffdata.new);
      // must take computeDiff from prototypes since not available with charts early in process
      var computeDiff = window.google.visualization[this.props.chartType].prototype.computeDiff;
      var chartDiff = computeDiff(oldData, newData);
      return chartDiff;
    }

    if (this.props.data === null && this.props.rows.length === 0 && !this.props.allowEmptyRows) {
      throw new Error("Can't build DataTable from rows and columns: rows array in props is empty");
    } else if (this.props.data === null && this.props.columns.length === 0) {
      throw new Error("Can't build DataTable from rows and columns: columns array in props is empty");
    }
    if (this.props.data !== null) {
      try {
        this.wrapper.setDataTable(this.props.data);
        var _dataTable = this.wrapper.getDataTable();
        return _dataTable;
      } catch (err) {
        // console.error('Failed to set DataTable from data props ! ', err);
        throw new Error('Failed to set DataTable from data props ! ', err);
      }
    }

    var dataTable = new window.google.visualization.DataTable();
    this.props.columns.forEach(function (column) {
      dataTable.addColumn(column);
    });
    dataTable.addRows(this.props.rows);
    if (this.props.numberFormat) {
      var formatter = new window.google.visualization.NumberFormat(this.props.numberFormat.options);
      formatter.format(dataTable, this.props.numberFormat.column);
    }

    if (this.props.dateFormat) {
      var dateFormat = new window.google.visualization.DateFormat(this.props.dateFormat.options);
      this.props.dateFormat.columns.forEach(function (columnIdx) {
        dateFormat.format(dataTable, columnIdx);
      });
    }

    return dataTable;
  };

  Chart.prototype.updateDataTable = function updateDataTable() {
    debug('updateDataTable');
    window.google.visualization.errors.removeAll(document.getElementById(this.wrapper.getContainerId()));
    this.dataTable.removeRows(0, this.dataTable.getNumberOfRows());
    this.dataTable.removeColumns(0, this.dataTable.getNumberOfColumns());
    this.dataTable = this.buildDataTableFromProps();
    return this.dataTable;
  };

  Chart.prototype.drawChart = function drawChart() {
    var _this4 = this;

    debug('drawChart', this);
    if (!this.wrapper) {
      var chartConfig = {
        chartType: this.props.chartType,
        options: this.props.options,
        containerId: this.state.graphID
      };
      this.wrapper = new window.google.visualization.ChartWrapper(chartConfig);
      this.dataTable = this.buildDataTableFromProps();
      this.wrapper.setDataTable(this.dataTable);

      window.google.visualization.events.addOneTimeListener(this.wrapper, 'ready', function () {
        _this4.chart = _this4.wrapper.getChart();
        _this4.listenToChartEvents();
        _this4.addChartActions();
      });
    } else {
      this.updateDataTable();
      this.wrapper.setDataTable(this.dataTable);
      // this.wrapper.setChartType(this.props.chartType)
      this.wrapper.setOptions(this.props.options);
      if (this.wrapper.getChartType() !== this.props.chartType) {
        window.google.visualization.events.removeAllListeners(this.wrapper);
        this.wrapper.setChartType(this.props.chartType);
        var self = this;
        window.google.visualization.events.addOneTimeListener(this.wrapper, 'ready', function () {
          self.chart = self.wrapper.getChart();
          self.listenToChartEvents.call(self);
        });
      }
    }
    this.wrapper.draw();
  };

  Chart.prototype.addChartActions = function addChartActions() {
    var _this5 = this;

    debug('addChartActions', this.props.chartActions);
    if (this.props.chartActions === null) {
      return;
    }
    this.props.chartActions.forEach(function (chartAction) {
      _this5.chart.setAction({
        id: chartAction.id,
        text: chartAction.text,
        action: chartAction.action.bind(_this5, _this5.chart)
      });
    });
  };

  Chart.prototype.listenToChartEvents = function listenToChartEvents() {
    var _this6 = this;

    debug('listenToChartEvents', this.props.legend_toggle, this.props.chartEvents);
    if (this.props.legend_toggle) {
      window.google.visualization.events.addListener(this.wrapper, 'select', this.onSelectToggle);
    }
    this.props.chartEvents.forEach(function (chartEvent) {
      if (chartEvent.eventName === 'ready') {
        chartEvent.callback(_this6);
      } else {
        (function (event) {
          window.google.visualization.events.addListener(_this6.chart, event.eventName, function (e) {
            event.callback(_this6, e);
          });
        })(chartEvent);
      }
    });
  };

  Chart.prototype.buildColumnFromSourceData = function buildColumnFromSourceData(columnIndex) {
    debug('buildColumnFromSourceData', columnIndex);
    return {
      label: this.dataTable.getColumnLabel(columnIndex),
      type: this.dataTable.getColumnType(columnIndex),
      sourceColumn: columnIndex
    };
  };

  Chart.prototype.buildEmptyColumnFromSourceData = function buildEmptyColumnFromSourceData(columnIndex) {
    debug('buildEmptyColumnFromSourceData', columnIndex);
    return {
      label: this.dataTable.getColumnLabel(columnIndex),
      type: this.dataTable.getColumnType(columnIndex),
      calc: function calc() {
        return null;
      }
    };
  };

  Chart.prototype.addEmptyColumnTo = function addEmptyColumnTo(columns, columnIndex) {
    debug('addEmptyColumnTo', columns, columnIndex);
    var emptyColumn = this.buildEmptyColumnFromSourceData(columnIndex);
    columns.push(emptyColumn);
  };

  Chart.prototype.hideColumn = function hideColumn(colors, columnIndex) {
    debug('hideColumn', colors, columnIndex);
    if (!this.isHidden(columnIndex)) {
      this.hidden_columns[columnIndex] = { color: this.getColumnColor(columnIndex - 1) };
    }
    colors.push('#CCCCCC');
  };

  Chart.prototype.addSourceColumnTo = function addSourceColumnTo(columns, columnIndex) {
    debug('addSourceColumnTo', columns, columnIndex);
    var sourceColumn = this.buildColumnFromSourceData(columnIndex);
    columns.push(sourceColumn);
  };

  Chart.prototype.isHidden = function isHidden(columnIndex) {
    return this.hidden_columns[columnIndex] !== undefined;
  };

  Chart.prototype.restoreColorTo = function restoreColorTo(colors, columnIndex) {
    debug('restoreColorTo', colors, columnIndex);
    debug('hidden_columns', this.hidden_columns);
    var previousColor = void 0;
    if (this.isHidden(columnIndex)) {
      previousColor = this.hidden_columns[columnIndex].color;
      delete this.hidden_columns[columnIndex];
    } else {
      previousColor = this.getColumnColor(columnIndex - 1);
    }
    if (columnIndex !== 0) {
      colors.push(previousColor);
    }
  };
  // eslint-disable-next-line class-methods-use-this


  Chart.prototype.debounce = function debounce(func, wait) {
    var timeout = void 0;
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var context = this;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        return func.apply(context, args);
      }, wait);
    };
  };

  Chart.prototype.togglePoints = function togglePoints(column) {
    debug('togglePoints', column);
    var view = new window.google.visualization.DataView(this.wrapper.getDataTable());
    var columnCount = view.getNumberOfColumns();
    var colors = []; // eslint-disable-line prefer-const
    var columns = []; // eslint-disable-line prefer-const
    for (var i = 0; i < columnCount; i += 1) {
      // If user clicked on legend
      if (i === 0) {
        this.addSourceColumnTo(columns, i);
      } else if (i === column) {
        if (this.isHidden(i)) {
          this.addSourceColumnTo(columns, i);
          this.restoreColorTo(colors, i);
        } else {
          this.addEmptyColumnTo(columns, i);
          this.hideColumn(colors, i);
        }
      } else if (this.isHidden(i)) {
        this.addEmptyColumnTo(columns, i);
        this.hideColumn(colors, i);
      } else {
        this.addSourceColumnTo(columns, i);
        this.restoreColorTo(colors, i);
      }
    }
    view.setColumns(columns);
    this.props.options.colors = colors;
    this.chart.draw(view, this.props.options);
  };

  Chart.prototype.render = function render() {
    debug('render', this.props, this.state);
    var divStyle = {
      height: this.props.height || this.props.options.height,
      width: this.props.width || this.props.options.width
    };
    return React.createElement(
      'div',
      { id: this.state.graphID, style: divStyle },
      this.props.loader ? this.props.loader : 'Rendering Chart...'
    );
  };

  return Chart;
}(React.Component);

export { Chart as default };


process.env.NODE_ENV !== "production" ? Chart.propTypes = {
  graph_id: PropTypes.string,
  chartType: PropTypes.string,
  rows: PropTypes.arrayOf(PropTypes.array),
  columns: PropTypes.arrayOf(PropTypes.object),
  data: PropTypes.arrayOf(PropTypes.array),
  options: PropTypes.any,
  width: PropTypes.string,
  height: PropTypes.string,
  chartEvents: PropTypes.arrayOf(PropTypes.shape({
    // https://github.com/yannickcr/eslint-plugin-react/issues/819
    eventName: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    callback: PropTypes.func })),
  chartActions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    text: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    action: PropTypes.func })),
  loadCharts: PropTypes.bool,
  loader: PropTypes.node,
  legend_toggle: PropTypes.bool,
  allowEmptyRows: PropTypes.bool,
  chartPackages: PropTypes.arrayOf(PropTypes.string),
  chartVersion: PropTypes.string,
  numberFormat: PropTypes.shape({
    column: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
    options: PropTypes.shape({
      decimalSymbol: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
      fractionDigits: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
      groupingSymbol: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
      negativeColor: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
      negativeParens: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
      pattern: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
      prefix: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
      suffix: PropTypes.string })
  }),
  dateFormat: PropTypes.shape({
    // eslint-disable-next-line react/no-unused-prop-types
    columns: PropTypes.arrayOf(PropTypes.number),
    options: PropTypes.shape({
      formatType: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
      pattern: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
      timeZone: PropTypes.number })
  }),
  diffdata: PropTypes.shape({
    on: PropTypes.array, // eslint-disable-line react/no-unused-prop-types
    off: PropTypes.array })
} : void 0;

Chart.defaultProps = {
  chartType: 'LineChart',
  rows: [],
  columns: [],
  options: {
    chart: {
      title: 'Chart Title',
      subtitle: 'Subtitle'
    },
    hAxis: { title: 'X Label' },
    vAxis: { title: 'Y Label' },
    width: '400px',
    height: '300px'
  },
  width: '400px',
  height: '300px',
  chartEvents: [],
  chartActions: null,
  data: null,
  legend_toggle: false,
  allowEmptyRows: false,
  loadCharts: true,
  loader: React.createElement(
    'div',
    null,
    'Rendering Chart'
  ),
  chartPackages: ['corechart'],
  chartVersion: 'current',
  numberFormat: null,
  dateFormat: null,
  diffdata: null
};