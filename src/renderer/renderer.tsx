import "./index.css"
import React from "react"
import ReactDOM from "react-dom"
import App from "./app/App"
import { store } from "./store"
import { Provider } from "react-redux"
import CssBaseline from "@material-ui/core/CssBaseline"
import { ThemeProvider } from "@material-ui/core"
import theme from "./themes"

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
)
