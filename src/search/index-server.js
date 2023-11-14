// import React from 'react';
// import pic from '../images/pic.jpeg';
// import largeNumber from 'large-number-zhizhao';
// import '../../common/index.js';
// import './search.less';

const React = require('react');
const pic = require('../images/pic.jpeg');
const largeNumber = require('large-number-zhizhao');
require('../../common/index.js');
require('./search.less');

class Search extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      Text: null,
    };
  }
  loadComponent() {
    import('./text.js').then((Text) => {
      this.setState({ Text: Text.default });
    });
  }
  render() {
    const { Text } = this.state;
    const addResult = largeNumber('999', '1');
    return (
      <div className="search-text">
        {Text ? <Text /> : null}
        Search Text watch
        <img src={pic} onClick={this.loadComponent.bind(this)}></img>
        <div>{addResult}</div>
      </div>
    );
  }
}

module.exports = <Search />;
