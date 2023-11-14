import React from 'react';
import ReactDom from 'react-dom';
import pic from '../images/pic.jpeg';
import { a } from './tree-shaking';
import largeNumber from 'large-number-zhizhao';
import '../../common';
import './search.less';

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

ReactDom.render(<Search />, document.getElementById('root'));
