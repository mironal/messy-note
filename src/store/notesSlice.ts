import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { Note } from "../types"

type State = {
  notes: Note[]
}

const initialState: State = {
  notes: [],
}

const createNoteAsync = createAsyncThunk(
  "notes/createNote",
  async (args, thunkApi) => {
    await window.notes.createNote()
    return ""
  }
)

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    saveNote(state, action) {},
    deleteNote(state, action) {},
    editTitle(state, action) {},
  },
  extraReducers: { [createNoteAsync.fulfilled]: (state, actioon) => {} },
})

export const { saveNote, deleteNote, editTitle } = notesSlice.actions
