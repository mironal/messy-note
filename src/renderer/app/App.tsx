import React from "react"
import { hot } from "react-hot-loader"
import { Editor } from "./Editor"
import { Sidebar } from "./Sidebar"
import SplitPane from "react-split-pane"
import { useEffectOnce, useLocalStorage } from "react-use"
import { useAppDispatch } from "../hooks"
import { onChangeNotes } from "../features/noteSlice"

const App = () => {
  const dispatch = useAppDispatch()

  useEffectOnce(() => {
    const off = window.notes.onChangeNotes((notes) =>
      dispatch(onChangeNotes(notes))
    )

    // onChangeNotes を subscribe してから最初のイベントを発行する
    window.notes.reload()
    return off
  })

  const [sidebarWidth, setSidebarWidth] = useLocalStorage("sidebar-width", 200)

  return (
    <div className="Container">
      <SplitPane
        split="vertical"
        minSize={100}
        size={sidebarWidth}
        onChange={setSidebarWidth}
      >
        <Sidebar onContextMenu={window.menu.showSidebarItemMenu} />
        <Editor />
      </SplitPane>
    </div>
  )
}

export default hot(module)(App)
