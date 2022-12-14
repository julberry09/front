import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

// scroll bar
import 'simplebar/src/simplebar.css';

// third-party
import { Provider as ReduxProvider } from 'react-redux';

// apex-chart
import 'assets/third-party/apex-chart.css';

// project import
import App from './App';
import { store } from 'store';
import reportWebVitals from './reportWebVitals';

import AuthGuard from 'pages/AuthGuard'
// 추가
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
const persistor = persistStore(store);

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //


ReactDOM.render(
    <StrictMode>
        <ReduxProvider store={store}>
          <PersistGate persistor={persistor}>
              <BrowserRouter>
                {/* <AuthGuard> */}
                  <App />
                {/* </AuthGuard> */}
              </BrowserRouter>
          </PersistGate>
        </ReduxProvider>
    </StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
