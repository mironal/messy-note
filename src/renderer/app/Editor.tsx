import React, { useCallback, useEffect, useState } from "react"
import "react-dom"
import { useDebounce } from "react-use"
import {
  Box,
  Button,
  Chip,
  ChipProps,
  Fade,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core"

import { notesSelector } from "../features/noteSlice"
import { useAppDispatch, useAppSelector } from "../hooks"
import { readNoteText, renameNote, saveNoteText } from "../features/actions"
import { editNoteText, EditorState, idleEdit } from "../features/editorSlice"
import { Done } from "@material-ui/icons"

const useTitleStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}))

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
  const classes = useTitleStyles()
  const [newTitle, setTitle] = useState(title)
  const [disableSave, setDisableSave] = useState(true)
  useEffect(() => {
    setDisableSave(newTitle.length === 0 || newTitle === title)
  }, [newTitle])
  return (
    <>
      <TextField
        fullWidth={true}
        size="small"
        type="text"
        name="title"
        id="title"
        label="新しいタイトル"
        value={newTitle}
        onChange={(ev) => setTitle(ev.target.value)}
        InputProps={{ disableUnderline: true }}
      />
      <Button
        size="small"
        className={classes.margin}
        variant="outlined"
        color="primary"
        onClick={() => onClickSave(newTitle)}
        disabled={disableSave}
      >
        Save
      </Button>
      <Button
        size="small"
        className={classes.margin}
        variant="outlined"
        onClick={() => onClickCancel()}
      >
        Cancel
      </Button>
    </>
  )
}

const EditingStateChip = ({
  editingState,
}: {
  editingState: EditorState["editingState"]
}) => {
  const props: ChipProps = {}
  props.size = "small"
  props.variant = "outlined"
  switch (editingState) {
    case "loading":
    case "idle":
      return null
    case "modified":
      props.label = "保存待機中"
      break
    case "saving":
      props.label = "保存中"
      break
    case "saved":
      props.label = "保存しました"
      props.color = "primary"
      props.icon = <Done />
      break
  }
  return (
    <Fade in={true}>
      <Chip {...props} />
    </Fade>
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
  const editingState = useAppSelector((state) => state.editor.editingState)

  const [editingTitle, setEditingTitle] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, cancelSaveNote] = useDebounce(
    () => {
      if (noteText !== null && editingState === "modified") {
        dispatch(saveNoteText({ notePath, noteText }))
      }
    },
    3000 /* ms */,
    [noteText, editingState]
  )

  useEffect(() => {
    if (editingState === "saved") {
      const handle = setTimeout(() => dispatch(idleEdit()), 1000)
      return () => clearTimeout(handle)
    }
  }, [editingState])

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

  const onBlurEditor = () => {
    cancelSaveNote()
    if (noteText !== null && editingState === "modified") {
      dispatch(saveNoteText({ notePath, noteText }))
    }
  }

  const onClickTitle = useCallback(() => {
    setEditingTitle(!editingTitle)
  }, [dispatch, editingTitle])

  const Title = (() => {
    if (editingTitle) {
      return (
        <TitleEditingForm
          title={noteName}
          onClickSave={(name) => {
            dispatch(renameNote(name)).then(() => setEditingTitle(false))
          }}
          onClickCancel={() => setEditingTitle(false)}
        />
      )
    } else {
      const name = noteName ?? "Undefined note"
      return (
        <Box display="flex" flexGrow="1" alignItems="center">
          <Box flexGrow="1">
            <Typography variant="h5" onClick={onClickTitle}>
              {name}
            </Typography>
          </Box>
          <Box mr="1em">
            <EditingStateChip editingState={editingState} />
          </Box>
        </Box>
      )
    }
  })()

  return (
    <Box height="1" width="1" className="EditorContainer">
      <Box height="3em" display="flex" alignItems="flexEnd">
        {Title}
      </Box>
      {noteText !== null && (
        <textarea
          className={classes.textare}
          value={noteText}
          onChange={onChangeText}
          onBlur={onBlurEditor}
        />
      )}
    </Box>
  )
}
