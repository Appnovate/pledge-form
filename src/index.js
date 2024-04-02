import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter } from "react-router-dom"
import "./i18n"
import { Provider } from "react-redux"
import AuthProvider from "components/AuthProvider/AuthProvider"

import store from "./store"

const app = (
  <Provider store={store}>
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </AuthProvider>
   </Provider>
)

ReactDOM.render(app, document.getElementById("root"))
serviceWorker.unregister()
