import React from "react"
import "react-dom"
import { Note } from "./types"

export type SidebarProps = {
  notes: Note[]
  selectingNote: Note | undefined
  onClickAddNote: () => void
  onSelectNote: (note: Note) => void
  onContextMenu?: (note: Note) => any
}

export const Sidebar = ({
  notes,
  selectingNote,
  onClickAddNote,
  onSelectNote,
  onContextMenu,
}: SidebarProps): JSX.Element => {
  return (
    <div className="Sidebar">
      <button onClick={onClickAddNote}>Add note</button>
      <ul>
        {notes.map((note) => (
          <NoteListItem
            isSelected={note.path == selectingNote?.path}
            note={note}
            key={note.path}
            onClick={onSelectNote}
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
