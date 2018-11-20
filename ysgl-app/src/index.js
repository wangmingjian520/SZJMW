import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Router from './router';
import { Provider } from 'react-redux'
import configureStore from './redux/store';
import registerServiceWorker from './registerServiceWorker';
import history from './history';
// Redux Store对象，管理所有的Redux状态
const store = configureStore();
ReactDOM.render(
    <Provider store={store}>
        <Router history={history}/>
    </Provider>,
    document.getElementById('root')
);
// ReactDOM.render(<Router />, document.getElementById('root'));
registerServiceWorker();