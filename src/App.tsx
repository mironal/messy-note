import * as React from "react"
import { hot } from "react-hot-loader"
import { Editor } from "./Editor"
import { Sidebar } from "./Sidebar"

const App = () => {
  return (
    <div>
      <Sidebar />
      <Editor />
    </div>
  )
}

export default hot(module)(App)
