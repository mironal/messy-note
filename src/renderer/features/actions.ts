import { createAsyncThunk } from "@reduxjs/toolkit"
import { Note } from "../../types"

export const createNote = createAsyncThunk("note/createNote", async () => {
  const path = await window.notes.createNote()
  return path
})

export const saveNoteText = createAsyncThunk<
  void,
  { note: Note; noteText: string }
>("note/saveNoteText", async ({ note, noteText }) => {
  await window.notes.saveNote(note.path, noteText)
})

export const readNoteText = createAsyncThunk<string | null, Note | null>(
  "note/readNoteText",
  async (note) => {
    return await window.notes.readNote(note.path)
  }
)

/*
export const onChangeCurrentNote = createAsyncThunk<string, string>(
  "note/changeCurrentNote",
  async (path, { getState, dispatch }) => {
    const {
      note: { currentNote: note, currentNoteText: noteText, savingState },
    } = getState() as RootState

    if (savingState === "modified" && note && noteText) {
      await dispatch(saveNoteText({ note, noteText }))
    }

    return path
  },
  {
    condition: (path, { getState }) => {
      const {
        note: { currentNote },
      } = getState() as RootState
      return currentNote.path !== path
    },
  }
)*/

/*
export const renameNote = createAsyncThunk(
  "note/renameNote",
  async (name: string, { getState }) => {
    const {
      note: { currentNote: note },
    } = getState() as RootState

    return await window.notes.renameNote(note.path, name)
  }
)
*/
