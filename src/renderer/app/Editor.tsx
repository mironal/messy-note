import React, { useEffect, useState } from "react"
import "react-dom"
import { Note } from "../../types"
import { useDebounce } from "react-use"

export type EditorProps = {
  note: Note | null
}

export const Editor = ({ note }: EditorProps) => {
  const [noteText, setNoteText] = useState<string | null>(null)
  const [activateSave, setActivateSave] = useState(false)

  const [isReady, cancelSaveNote] = useDebounce(
    () => {
      if (noteText !== null && activateSave) {
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
      cancelSaveNote()
      setNoteText(null)
      setActivateSave(false)
    }
  }, [note])

  const onChangeText = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (noteText !== null) {
      setNoteText(ev.target.value)
      setActivateSave(true)
    }
  }

  const SaveState = (() => {
    const ready = isReady()
    if (ready === true) {
      return "Saved"
    } else if (ready === false) {
      return "Pending save..."
    } else {
      return ""
    }
  })()

  return (
    <div className="Editor">
      <h2>
        {note ? note.name : "undefined"}: {SaveState}
      </h2>
      {noteText !== null && (
        <textarea value={noteText} onChange={onChangeText} />
      )}
    </div>
  )
}
