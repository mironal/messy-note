import React, { useCallback } from "react"
import "react-dom"
import { Note } from "../../types"
import { notesSelector, selectNote } from "../features/noteSlice"
import { useAppDispatch, useAppSelector } from "../hooks"
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Fab,
  makeStyles,
} from "@material-ui/core"
import { Add as AddIcon } from "@material-ui/icons"
import { createNote, saveCurrentEditingNote } from "../features/actions"
import { shallowEqual } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"

const useStyles = makeStyles((theme) => ({
  addButton: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}))

export type SidebarProps = {
  onContextMenu?: (note: Note) => void
}

export const Sidebar = ({ onContextMenu }: SidebarProps): JSX.Element => {
  const classes = useStyles()
  const dispatch = useAppDispatch()

  const notePaths = useAppSelector(
    notesSelector.selectIds,
    shallowEqual
  ) as string[]
  return (
    <Box className="Sidebar">
      <List dense={true}>
        {notePaths.map((notePath) => (
          <NoteListItem
            notePath={notePath}
            key={notePath}
            onContextMenu={onContextMenu}
          />
        ))}
      </List>
      <Box>
        <Fab
          className={classes.addButton}
          size="small"
          aria-label="add"
          onClick={() =>
            dispatch(createNote())
              .then(unwrapResult)
              .then((path) => dispatch(selectNote(path)))
          }
        >
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  )
}

type NoteListItemProps = {
  notePath: string
  onContextMenu?: (note: Note) => void
}
const NoteListItem = ({ onContextMenu, notePath }: NoteListItemProps) => {
  const note = useAppSelector((state) =>
    notesSelector.selectById(state, notePath)
  )
  const currentNotePath = useAppSelector((state) => state.note.selected)
  const dispatch = useAppDispatch()

  // 現在保存中のを保存してから選択する
  const onClickNote = (notePath: string) => () =>
    dispatch(saveCurrentEditingNote()).then(() =>
      dispatch(selectNote(notePath))
    )

  return (
    <ListItem
      className="NoteListItem"
      onClick={onClickNote(note.path)}
      onContextMenu={useCallback(() => {
        dispatch(selectNote(note.path))
        onContextMenu && onContextMenu(note)
      }, [dispatch])}
      selected={note.path === currentNotePath}
    >
      <ListItemText primary={note.name} />
    </ListItem>
  )
}
