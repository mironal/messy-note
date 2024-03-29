import React from "react"
import "react-dom"
import { Note } from "../../types"
import { createNote, onSelectNote } from "../features/noteSlice"
import { useAppDispatch, useAppSelector } from "../hooks"

export type SidebarProps = {
  onContextMenu?: (note: Note) => any
}

export const Sidebar = ({ onContextMenu }: SidebarProps): JSX.Element => {
  const dispatch = useAppDispatch()

  const currentNoteId = useAppSelector((state) => state.note.currentNote?.id)
  const notes = useAppSelector((state) => state.note.notes)
  return (
    <div className="Sidebar">
      <button onClick={() => dispatch(createNote())}>Add note</button>
      <ul>
        {notes.map((note) => (
          <NoteListItem
            isSelected={note.id.includes(currentNoteId)}
            note={note}
            key={note.path}
            onClick={() => dispatch(onSelectNote(note.id))}
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
