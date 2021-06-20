import React, { useEffect } from "react"
import "react-dom"
import { useDebounce } from "react-use"
import {
  onEditNoteText,
  readNoteText,
  saveNoteText,
} from "../features/noteSlice"
import { useAppDispatch, useAppSelector } from "../hooks"

export const Editor = () => {
  const dispatch = useAppDispatch()
  const note = useAppSelector(
    (state) => state.note.currentNote,
    (l, r) => l?.path === r?.path
  )
  const noteText = useAppSelector((state) => state.note.currentNoteText)
  const savingState = useAppSelector((state) => state.note.savingState)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, cancelSaveNote] = useDebounce(
    () => {
      if (noteText !== null) {
        dispatch(saveNoteText({ note, noteText }))
      }
    },
    3000 /* ms */,
    [noteText]
  )

  useEffect(() => {
    dispatch(readNoteText(note))
  }, [note])

  const onChangeText = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (noteText !== null) {
      dispatch(onEditNoteText(ev.target.value))
    }
  }

  const SaveState = (() => {
    switch (savingState) {
      case "idle":
        return "変更なし"
      case "no-change":
        return "保存済"
      case "modified":
        return "保存待機中"
      case "saving":
        return "保存中"
    }
    return savingState
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
