import React, { useEffect, useState } from "react"
import { hot } from "react-hot-loader"
import { Editor } from "./Editor"
import { Sidebar } from "./Sidebar"
import { Note } from "../../types"
import SplitPane from "react-split-pane"
import { useLocalStorage } from "react-use"

const App = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectingNote, setSelectingNote] = useState<Note | null>(null)

  useEffect(() => {
    const off = window.notes.onChangeNotes(setNotes)
    window.notes.reload()
    return off
  }, [])

  useEffect(() => {
    // 選択している note がなくなった場合は selectingNote も null にする
    if (selectingNote && !notes.some((n) => n.path == selectingNote.path)) {
      setSelectingNote(null)
    }
  }, [notes])

  const [sidebarWidth, setSidebarWidth] = useLocalStorage("sidebar-width", 200)

  return (
    <div className="Container">
      <SplitPane
        split="vertical"
        minSize={100}
        size={sidebarWidth}
        onChange={setSidebarWidth}
      >
        <Sidebar
          notes={notes}
          selectingNote={selectingNote}
          onClickAddNote={window.notes.createNote}
          onSelectNote={setSelectingNote}
          onContextMenu={window.menu.showSidebarItemMenu}
        />
        <Editor note={selectingNote} />
      </SplitPane>
    </div>
  )
}

export default hot(module)(App)
