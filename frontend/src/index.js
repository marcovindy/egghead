import React from 'react';
import ReactDOM from 'react-dom/client';


import { Provider } from "react-redux";
import store from "./store";


import './assets/styles/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);

serviceWorker.unregister();
