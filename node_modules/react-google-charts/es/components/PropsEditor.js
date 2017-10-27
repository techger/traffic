function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';

var StateEditor = function (_React$Component) {
  _inherits(StateEditor, _React$Component);

  function StateEditor(props) {
    _classCallCheck(this, StateEditor);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = {
      inputValue: _this.props.inputValue
    };
    _this.handleChange = _this.handleChange.bind(_this);
    _this.onSubmit = _this.onSubmit.bind(_this);
    return _this;
  }

  StateEditor.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.setState({ inputValue: nextProps.inputValue });
  };

  StateEditor.prototype.onSubmit = function onSubmit() {
    this.props.onSubmit(this.state.inputValue, this.props.chartIndex);
  };

  StateEditor.prototype.handleChange = function handleChange(event) {
    this.setState({ inputValue: event.target.value });
  };

  StateEditor.prototype.render = function render() {
    return React.createElement(
      'div',
      { className: 'PropsEditor' },
      React.createElement(
        'h2',
        null,
        ' Props '
      ),
      React.createElement('textarea', { style: { width: '500px', height: '200px' }, value: this.state.inputValue, onChange: this.handleChange }),
      React.createElement(
        'div',
        null,
        React.createElement(
          'button',
          { onClick: this.onSubmit },
          'Update'
        )
      )
    );
  };

  return StateEditor;
}(React.Component);

export { StateEditor as default };


process.env.NODE_ENV !== "production" ? StateEditor.propTypes = {
  inputValue: React.PropTypes.string,
  chartIndex: React.PropTypes.number,
  onSubmit: React.PropTypes.func
} : void 0;