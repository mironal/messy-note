import { configureStore } from "@reduxjs/toolkit"
import noteReducer from "./features/noteSlice"
import editorSlice from "./features/editorSlice"

export const store = configureStore({
  reducer: {
    note: noteReducer,
    editor: editorSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
