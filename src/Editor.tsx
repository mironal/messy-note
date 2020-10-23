import React from "react"
import "react-dom"
import { Note } from "./types"

export type EditorProps = {
  note: Note
}

export const Editor = ({ note }: EditorProps) => {
  return <div className="Editor">Editor: {note ? note.name : "undefined"}</div>
}
