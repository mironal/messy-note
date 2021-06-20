import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Note } from "../../types"
import { RootState } from "../store"

type NoteSavingState = "saving" | "no-change" | "modified" | "idle"

type NoteState = {
  savingState: NoteSavingState
  currentNoteText: string | null
  currentNote: Note | null
  notes: Note[]
}

const initialState: NoteState = {
  savingState: "idle",
  currentNoteText: null,
  currentNote: null,
  notes: [],
}

export const createNote = createAsyncThunk("note/createNote", async () => {
  const path = await window.notes.createNote()
  return path
})

export const saveNoteText = createAsyncThunk<
  void,
  { note: Note; noteText: string }
>("note/saveNoteText", async ({ note, noteText }) => {
  await window.notes.saveNote(note, noteText)
})

export const readNoteText = createAsyncThunk<string | null, Note | null>(
  "note/readNoteText",
  async (note) => {
    if (note) {
      return await window.notes.readNote(note)
    }
    return null
  }
)

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
)

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    onEditNoteText: (state, action: PayloadAction<string>) => {
      if (state.currentNote && state.savingState !== "saving") {
        state.savingState = "modified"
        state.currentNoteText = action.payload
      }
    },
    onChangeNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload

      if (!state.currentNote && action.payload.length > 0) {
        state.currentNote = action.payload[0]
      } else if (action.payload.length == 0) {
        state.currentNote = null
        state.currentNoteText = null
        state.savingState = "idle"
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createNote.fulfilled, (state, action) => {
      const note = state.notes.find((n) => n.path == action.payload)
      state.currentNote = note
    })
    builder.addCase(saveNoteText.pending, (state, action) => {
      state.savingState = "saving"
    })
    builder.addCase(saveNoteText.fulfilled, (state, action) => {
      state.savingState = "no-change"
    })
    builder.addCase(onChangeCurrentNote.fulfilled, (state, action) => {
      state.currentNote = state.notes.find((n) => n.path == action.payload)
      state.currentNoteText = null
      state.savingState = "idle"
    })
    builder.addCase(readNoteText.fulfilled, (state, action) => {
      state.currentNoteText = action.payload
    })
  },
})

export const { onChangeNotes, onEditNoteText } = noteSlice.actions

export default noteSlice.reducer
