import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { readNoteText, saveNoteText } from "./actions"

export type EditingState = "idle" | "loading" | "saving" | "saved" | "modified"

export type EditorState = {
  editingText: string | null
  editingState: EditingState
}

const initialState: EditorState = {
  editingText: null,
  editingState: "idle",
}

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    editNoteText: (state, action: PayloadAction<string>) => {
      state.editingText = action.payload
      state.editingState = "modified"
    },
  },
  extraReducers: (builder) => {
    builder.addCase(readNoteText.pending, (state) => {
      state.editingText = null
      state.editingState = "loading"
    })
    builder.addCase(readNoteText.fulfilled, (state, action) => {
      state.editingText = action.payload
      state.editingState = "idle"
    })
    builder.addCase(saveNoteText.pending, (state) => {
      state.editingState = "saving"
    })
    builder.addCase(saveNoteText.fulfilled, (state) => {
      state.editingState = "saved"
    })
  },
})

export const { editNoteText } = editorSlice.actions

export default editorSlice.reducer
