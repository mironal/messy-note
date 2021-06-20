import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Note } from "../../types"

type NoteState = {
  currentNote: Note | null
  notes: Note[]
}

const initialState: NoteState = {
  currentNote: null,
  notes: [],
}

export const createNote = createAsyncThunk("note/create", async () => {
  const id = await window.notes.createNote()
  return id
})

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    onSelectNote: (state, action: PayloadAction<string>) => {
      state.currentNote = state.notes.find((n) => n.id == action.payload)
    },
    onChangeNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload

      if (!state.currentNote && action.payload.length > 0) {
        state.currentNote = action.payload[0]
      } else if (action.payload.length == 0) {
        state.currentNote = null
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createNote.fulfilled, (state, action) => {
      const note = state.notes.find((n) => n.id == action.payload)
      state.currentNote = note
    })
  },
})

export const { onSelectNote, onChangeNotes } = noteSlice.actions

export default noteSlice.reducer
