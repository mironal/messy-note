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

    idleEdit: (state) => {
      // saved だったら idle に戻す
      // 保存後に setTimeout(() => dispatch(idleEdit()), 1000) みたいに呼び出すことを想定
      if (state.editingState === "saved") {
        state.editingState = "idle"
      }
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

export const { editNoteText, idleEdit } = editorSlice.actions

export default editorSlice.reducer
