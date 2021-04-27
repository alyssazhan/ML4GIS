
import React from "react"
import "./site.css"
import ReactDOM from 'react-dom';
import route from "./route";
import * as serviceWorker from './pages/Home/SubmitHIT/serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';


ReactDOM.render(
    <div>{route}
    </div>,
    document.getElementById('root')
);
serviceWorker.unregister();


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

