import React, { useEffect, useState } from "react"
import "react-dom"
import { Note } from "./types"
import { useDebounce, useLifecycles } from "react-use"

export type EditorProps = {
  note: Note | null
}

export const Editor = ({ note }: EditorProps) => {
  const [noteText, setNoteText] = useState<string | null>(null)

  const [] = useDebounce(
    () => {
      if (noteText !== null) {
        window.notes.saveNote(note, noteText)
        console.log("save note")
      }
    },
    5000 /* ms */,
    [noteText]
  )

  useEffect(() => {
    if (note) {
      window.notes.readNote(note).then(setNoteText)
    }
    return () => {
      setNoteText(null)
    }
  }, [note])

  const onChangeText = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (noteText !== null) {
      setNoteText(ev.target.value)
    }
  }
  return (
    <div className="Editor">
      <h2>{note ? note.name : "undefined"}</h2>
      {noteText !== null && (
        <textarea value={noteText} onChange={onChangeText} />
      )}
    </div>
  )
}
