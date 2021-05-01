import React from 'react';
import {
    HashRouter as Router,
    Switch,
    Link,
    Route
} from 'react-router-dom';
import { createBrowserHistory } from "history";

import Home from './pages/Home/main_Home';
import preview from './pages/ShowResult/main_ShowResult';

const customHistory = createBrowserHistory();

export default (
    <Router history={customHistory}>
        <Switch>
        <Route exact path="/" component={Home} />
            <Route exact path="/result" component={preview} />

        </Switch>
    </Router>
);