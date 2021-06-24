import React, { useEffect, useState } from "react"
import "react-dom"
import { useDebounce } from "react-use"
import { Box, makeStyles } from "@material-ui/core"

import {} from "../features/noteSlice"
import { useAppDispatch, useAppSelector } from "../hooks"

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
  return <div>Editor</div>
}
//  const classes = useStyles()
//  const dispatch = useAppDispatch()
//  const note = useAppSelector(
//    (state) => state.note.currentNote,
//    (l, r) => l?.path === r?.path
//  )
//  const noteText = useAppSelector((state) => state.note.currentNoteText)
//  const savingState = useAppSelector((state) => state.note.savingState)
//
//  const [editingTitle, setEditingTitle] = useState(false)
//
//  // eslint-disable-next-line @typescript-eslint/no-unused-vars
//  const [_, cancelSaveNote] = useDebounce(
//    () => {
//      if (noteText !== null) {
//        dispatch(saveNoteText({ note, noteText }))
//      }
//    },
//    3000 /* ms */,
//    [noteText]
//  )
//
//  useEffect(() => {
//    dispatch(readNoteText(note))
//  }, [note])
//
//  const onChangeText = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
//    if (noteText !== null) {
//      dispatch(onEditNoteText(ev.target.value))
//    }
//  }
//
//  const onClickTitle = () => {
//    setEditingTitle(!editingTitle)
//  }
//
//  const SaveState = (() => {
//    switch (savingState) {
//      case "idle":
//        return "変更なし"
//      case "no-change":
//        return "保存しました"
//      case "modified":
//        return "保存待機中"
//      case "saving":
//        return "保存中"
//    }
//  })()
//
//  const Title = (() => {
//    if (editingTitle) {
//      return (
//        <TitleEditingForm
//          title={note?.name}
//          onClickSave={(name) =>
//            dispatch(renameNote(name)).then(() => setEditingTitle(false))
//          }
//          onClickCancel={() => setEditingTitle(false)}
//        />
//      )
//    } else {
//      const name = note?.name ?? "Undefined note"
//      return (
//        <h2 onClick={onClickTitle}>
//          {name} : {SaveState}
//        </h2>
//      )
//    }
//  })()
//
//  return (
//    <Box height="1" width="1" className="EditorContainer">
//      {Title}
//      {noteText !== null && (
//        <textarea
//          className={classes.textare}
//          value={noteText}
//          onChange={onChangeText}
//        />
//      )}
//    </Box>
//  )
//*/
//}
