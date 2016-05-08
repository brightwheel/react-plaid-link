'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var ReactScriptLoaderMixin = require('react-script-loader').ReactScriptLoaderMixin;

var PlaidLink = React.createClass({
  displayName: 'PlaidLink',

  mixins: [ReactScriptLoaderMixin],
  getDefaultProps: function getDefaultProps() {
    return {
      institution: null,
      longtail: false,
      selectAccount: false,
      buttonText: 'Open Link',
      buttonStyles: {
        padding: '6px 4px',
        outline: 'none',
        background: '#FFFFFF',
        border: '2px solid #F1F1F1',
        borderRadius: '4px'
      }
    };
  },
  propTypes: {
    // Displayed once a user has successfully linked their account
    clientName: React.PropTypes.string.isRequired,

    // The Plaid API environment on which to create user accounts.
    // For development and testing, use tartan. For production, use production
    env: React.PropTypes.oneOf(['tartan', 'production']).isRequired,

    // Open link to a specific institution, for a more custom solution
    institution: React.PropTypes.string,

    // Set to true to launch Link with longtail institution support enabled.
    // Longtail institutions are only available with the Connect product.
    longtail: React.PropTypes.bool,

    // The public_key associated with your account; available from
    // the Plaid dashboard (https://dashboard.plaid.com)
    publicKey: React.PropTypes.string.isRequired,

    // The Plaid product you wish to use, either auth or connect.
    product: React.PropTypes.oneOf(['auth', 'connect']).isRequired,

    // Specify an existing user's public token to launch Link in update mode.
    // This will cause Link to open directly to the authentication step for
    // that user's institution.
    token: React.PropTypes.string,

    // Set to true to launch Link with the 'Select Account' pane enabled.
    // Allows users to select an individual account once they've authenticated
    selectAccount: React.PropTypes.bool,

    // Specify a webhook to associate with a user.
    webhook: React.PropTypes.string,

    // A function that is called when a user has successfully onboarded their
    // account. The function should expect two arguments, the public_key and a
    // metadata object
    onSuccess: React.PropTypes.func.isRequired,

    // A function that is called when a user has specifically exited Link flow
    onExit: React.PropTypes.func,

    // A function that is called when the Link module has finished loading.
    // Calls to plaidLinkHandler.open() prior to the onLoad callback will be
    // delayed until the module is fully loaded.
    onLoad: React.PropTypes.func,

    // Text to display in the button
    buttonText: React.PropTypes.string,

    // Button Styles as an Object
    styles: React.PropTypes.object,

    // Button Class names as a String
    className: React.PropTypes.string
  },
  getInitialState: function getInitialState() {
    return {
      disabledButton: true,
      linkLoaded: false
    };
  },
  getScriptURL: function getScriptURL() {
    return 'https://cdn.plaid.com/link/stable/link-initialize.js';
  },
  onScriptError: function onScriptError() {
    console.error('There was an issue loading the link-initialize.js script');
  },
  onScriptLoaded: function onScriptLoaded() {
    window.linkHandler = Plaid.create({
      clientName: this.props.clientName,
      env: this.props.env,
      key: this.props.publicKey,
      longtail: this.props.longtail,
      onExit: this.props.onExit,
      onLoad: this.handleLinkOnLoad,
      onSuccess: this.props.onSuccess,
      product: this.props.product,
      selectAccount: this.props.selectAccount,
      token: this.props.token,
      webhook: this.props.webhook
    });

    this.setState({ disabledButton: false });
  },
  handleLinkOnLoad: function handleLinkOnLoad() {
    this.props.onLoad && this.props.onLoad();
    this.setState({ linkLoaded: true });
  },
  handleOnClick: function handleOnClick() {
    var institution = this.props.institution || null;
    if (window.linkHandler) {
      window.linkHandler.open(institution);
    }
  },
  render: function render() {
    return React.createElement(
      'button',
      _extends({ onClick: this.handleOnClick,
        disabled: this.state.disabledButton
      }, this.props),
      React.createElement(
        'span',
        null,
        this.props.buttonText
      )
    );
  }
});

module.exports = PlaidLink;

