import React from "react"
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
import { createNote } from "../features/actions"
import { shallowEqual } from "react-redux"

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
          onClick={() => dispatch(createNote())}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  )
}

type NoteListItemProps = {
  notePath: string
  onContextMenu?: (note: Note) => any
}
const NoteListItem = ({ onContextMenu, notePath }: NoteListItemProps) => {
  const note = useAppSelector((state) =>
    notesSelector.selectById(state, notePath)
  )
  const currentNotePath = useAppSelector((state) => state.note.selected)
  const dispatch = useAppDispatch()
  return (
    <ListItem
      className="NoteListItem"
      onClick={() => dispatch(selectNote(note.path))}
      onContextMenu={() => onContextMenu && onContextMenu(note)}
      selected={note.path === currentNotePath}
    >
      <ListItemText primary={note.name} />
    </ListItem>
  )
}
