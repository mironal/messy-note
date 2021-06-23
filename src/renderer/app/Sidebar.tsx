import React, { useCallback } from "react"
import "react-dom"
import { shallowEqual } from "react-redux"
import { Note } from "../../types"
import { onChangeCurrentNote, createNote } from "../features/noteSlice"
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

const useStyles = makeStyles((theme) => ({
  addButton: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}))

export type SidebarProps = {
  onContextMenu?: (note: Note) => any
}

export const Sidebar = ({ onContextMenu }: SidebarProps): JSX.Element => {
  const classes = useStyles()
  const dispatch = useAppDispatch()

  const currentNotePath = useAppSelector(
    (state) => state.note.currentNote?.path,
    shallowEqual
  )
  const notes = useAppSelector((state) => state.note.notes, shallowEqual)

  const onClickItem = useCallback(
    (note: Note) => dispatch(onChangeCurrentNote(note.path)),
    [dispatch]
  )

  return (
    <Box className="Sidebar">
      <List dense={true}>
        {notes.map((note) => (
          <NoteListItem
            selected={note.path == currentNotePath}
            note={note}
            key={note.path}
            onClick={() => onClickItem(note)}
            onContextMenu={onContextMenu}
          />
        ))}
      </List>
      <Box>
        <Fab
          className={classes.addButton}
          size="small"
          aria-label="add"
          onClick={() => dispatch(createNote())}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  )
}

type NoteListItemProps = {
  selected: boolean
  note: Note
  onClick: (note: Note) => any
  onContextMenu?: (note: Note) => any
}
const NoteListItem = ({
  note,
  onClick,
  onContextMenu,
  selected,
}: NoteListItemProps) => {
  return (
    <ListItem
      className="NoteListItem"
      onClick={() => onClick(note)}
      onContextMenu={() => onContextMenu && onContextMenu(note)}
      selected={selected}
    >
      <ListItemText primary={note.name} />
    </ListItem>
  )
}
