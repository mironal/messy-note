import { IpcRenderer } from "electron"

declare global {
  interface Window {
    // for contextBridge in preload.ts
    notes: {
      createNote: () => Promise<void>
      reload: () => Promise<void>
      onChangeNotes: (listener: (filenames: Note[]) => void) => () => void
    }
  }
}

type Note = {
  name: string
  path: string
}
