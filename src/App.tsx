import React, { useEffect, useState } from "react"
import { hot } from "react-hot-loader"
import { Editor } from "./Editor"
import { Sidebar } from "./Sidebar"
import { Note } from "./types"
import SplitPane from "react-split-pane"

const App = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectingNote, setSelectingNote] = useState<Note | null>(null)

  useEffect(() => {
    const off = window.notes.onChangeNotes((notes) => setNotes(notes))
    window.notes.reload()
    return off
  }, [])

  return (
    <div className="Container">
      <SplitPane split="vertical" minSize={100} defaultSize={"20%"}>
        <Sidebar
          notes={notes}
          selectingNote={selectingNote}
          onClickAddNote={window.notes.createNote}
          onSelectNote={setSelectingNote}
        />
        <Editor note={selectingNote} />
      </SplitPane>
    </div>
  )
}

export default hot(module)(App)
