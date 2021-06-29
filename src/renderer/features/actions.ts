import { createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../store"

export const createNote = createAsyncThunk("note/createNote", async () => {
  const path = await window.notes.createNote()
  return path
})

export const saveNoteText = createAsyncThunk<
  void,
  { notePath: string; noteText: string }
>("note/saveNoteText", async ({ notePath, noteText }) => {
  await window.notes.saveNote(notePath, noteText)
})

export const readNoteText = createAsyncThunk<string | null, string | null>(
  "note/readNoteText",
  async (notePath) => {
    return await window.notes.readNote(notePath)
  }
)

export const saveCurrentEditingNote = createAsyncThunk(
  "note/saveCurrentEditingNote",
  async (args, { getState, dispatch }) => {
    const {
      editor: { editingText },
      note: { selected },
    } = getState() as RootState

    await dispatch(saveNoteText({ notePath: selected, noteText: editingText }))
  },
  {
    condition: (arg, { getState }) => {
      const {
        editor: { editingState },
        note: { selected },
      } = getState() as RootState

      return selected && editingState === "modified"
    },
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
