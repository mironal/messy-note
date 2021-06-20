import React, { useCallback } from "react"
import "react-dom"
import { shallowEqual } from "react-redux"
import { Note } from "../../types"
import { onChangeCurrentNote, createNote } from "../features/noteSlice"
import { useAppDispatch, useAppSelector } from "../hooks"

export type SidebarProps = {
  onContextMenu?: (note: Note) => any
}

export const Sidebar = ({ onContextMenu }: SidebarProps): JSX.Element => {
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
    <div className="Sidebar">
      <button onClick={() => dispatch(createNote())}>Add note</button>
      <ul>
        {notes.map((note) => (
          <MemoNoteListItem
            isSelected={note.path == currentNotePath}
            note={note}
            key={note.path}
            onClick={() => onClickItem(note)}
            onContextMenu={onContextMenu}
          />
        ))}
      </ul>
    </div>
  )
}

type NoteListItemProps = {
  isSelected: boolean
  note: Note
  onClick: (note: Note) => any
  onContextMenu?: (note: Note) => any
}
const NoteListItem = ({ note, onClick, onContextMenu }: NoteListItemProps) => {
  return (
    <li
      className="NoteListItem"
      onClick={() => onClick(note)}
      onContextMenu={() => onContextMenu && onContextMenu(note)}
    >
      <p>{note.name}</p>
    </li>
  )
}

const MemoNoteListItem = React.memo(NoteListItem)
