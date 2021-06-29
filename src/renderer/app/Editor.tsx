import React, { useCallback, useEffect, useState } from "react"
import "react-dom"
import { useDebounce } from "react-use"
import { Box, makeStyles } from "@material-ui/core"

import { notesSelector } from "../features/noteSlice"
import { useAppDispatch, useAppSelector } from "../hooks"
import { readNoteText, saveNoteText } from "../features/actions"
import { editNoteText } from "../features/editorSlice"

type TitleEditingFormProps = {
  onClickSave: (title: string) => void
  onClickCancel: () => void
  title: string
}
const TitleEditingForm: React.VFC<TitleEditingFormProps> = ({
  title,
  onClickSave,
  onClickCancel,
}: TitleEditingFormProps) => {
  const [newTitle, setTitle] = useState(title)
  return (
    <div>
      <input
        type="text"
        name="title"
        id="title"
        value={newTitle}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <button onClick={() => onClickSave(newTitle)}>Save</button>
      <button onClick={() => onClickCancel()}>Cancel</button>
    </div>
  )
}

const useStyles = makeStyles({
  textare: {
    width: "100%",
    height: "100%",
  },
})

export const Editor = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const notePath: string | null = useAppSelector((state) => state.note.selected)
  const noteName: string | null = useAppSelector(
    (state) => notesSelector.selectById(state, notePath)?.name
  )

  const noteText: string | null = useAppSelector(
    (state) => state.editor.editingText
  )
  const savingState = useAppSelector((state) => state.editor.editingState)

  const [editingTitle, setEditingTitle] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, cancelSaveNote] = useDebounce(
    () => {
      if (noteText !== null && savingState === "modified") {
        dispatch(saveNoteText({ notePath, noteText }))
      }
    },
    3000 /* ms */,
    [noteText, savingState]
  )

  useEffect(() => {
    if (!notePath) {
      return
    }
    dispatch(readNoteText(notePath))
    return () => {
      cancelSaveNote()
    }
  }, [notePath])

  const onChangeText = useCallback(
    (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (noteText !== null) {
        dispatch(editNoteText(ev.target.value))
      }
    },
    [dispatch, noteText]
  )

  const onClickTitle = useCallback(() => {
    setEditingTitle(!editingTitle)
  }, [dispatch, editingTitle])

  const SaveState = (() => {
    switch (savingState) {
      case "loading":
        return "ロード中"
      case "idle":
        return "変更なし"
      case "modified":
        return "保存待機中"
      case "saving":
        return "保存中"
      case "saved":
        return "保存しました"
    }
  })()

  const Title = (() => {
    if (editingTitle) {
      return (
        <TitleEditingForm
          title={noteName}
          onClickSave={(name) => {
            // dispatch(renameNote(name)).then(() => setEditingTitle(false))
          }}
          onClickCancel={() => setEditingTitle(false)}
        />
      )
    } else {
      const name = noteName ?? "Undefined note"
      return (
        <h2 onClick={onClickTitle}>
          {name} : {SaveState}
        </h2>
      )
    }
  })()

  return (
    <Box height="1" width="1" className="EditorContainer">
      {Title}
      {noteText !== null && (
        <textarea
          className={classes.textare}
          value={noteText}
          onChange={onChangeText}
        />
      )}
    </Box>
  )
}
