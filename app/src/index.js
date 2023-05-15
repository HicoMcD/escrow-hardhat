// import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import * as React from "react";
import { Auth } from '@polybase/auth'
import { Polybase } from "@polybase/client";
import { PolybaseProvider, AuthProvider } from "@polybase/react";

// Polybase
const polybase = new Polybase({
  defaultNamespace: "pk/0xeacdb8bef7017928330ea0d5950080bca7b0a6227d33dab282191214f6098a2cc1a0c62d4d3cc6200e07b69039ed696c5633af8d87fab94575beb054acdd20db/Escrow" //process.env.ESCROW_REACT_NAMESPACE //, 
});

const auth = new Auth()

const root = ReactDOM.createRoot(document.getElementById('root'));

if (!window.ethereum) {
  root.render(
    <React.StrictMode>
      You need to install a browser wallet to build the escrow dapp
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <PolybaseProvider polybase={polybase}>
      <AuthProvider auth={auth} polybase={polybase}>
            <App />
      </AuthProvider>
      </PolybaseProvider>
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
