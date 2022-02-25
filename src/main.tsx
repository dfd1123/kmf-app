import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'; 
import { persistStore } from 'redux-persist';
import store from "@/store";
import App from "@/App";

let persistor = persistStore(store);

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
        </PersistGate>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
