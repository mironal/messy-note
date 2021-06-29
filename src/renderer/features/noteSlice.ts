import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit"
import { Note } from "../../types"
import { RootState } from "../store"
import { renameNote } from "./actions"

const noteAdapter = createEntityAdapter<Note>({
  selectId: (note) => note.path,
})

export const noteSlice = createSlice({
  name: "note",
  initialState: noteAdapter.getInitialState({
    loading: true,
    selected: null as Note["path"] | null,
  }),
  reducers: {
    onChangeNotes: (state, action: PayloadAction<Note[]>) => {
      noteAdapter.setAll(state, action.payload)
      state.loading = false
      if (!state.selected && action.payload.length > 0) {
        state.selected = action.payload[0].path
      }
    },
    selectNote: (state, action: PayloadAction<string>) => {
      state.selected = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(renameNote.fulfilled, (state, action) => {
      // 選択中のノートが rename されたら再選択
      if (state.selected === action.payload.oldPath) {
        state.selected = action.payload.newPath
      }
    })
  },
})

export const { onChangeNotes, selectNote } = noteSlice.actions

export default noteSlice.reducer

export const notesSelector = noteAdapter.getSelectors<RootState>(
  (state) => state.note
)
