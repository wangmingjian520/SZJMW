import React, { Component } from 'react';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <LocaleProvider locale={zh_CN}>
          {this.props.children}
        </LocaleProvider>
      </div>
    );
  }
}

export default App;
