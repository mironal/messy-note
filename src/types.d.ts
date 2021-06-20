import { IpcRenderer } from "electron"
declare global {
  interface Window {
    // for contextBridge in preload.ts
    notes: {
      createNote: () => Promise<string>
      reload: () => Promise<void>
      onChangeNotes: (listener: (filenames: Note[]) => void) => () => void
      saveNote: (note: Note, noteText: string) => Promise<void>
      readNote: (note: Note) => Promise<string>
    }

    menu: {
      showSidebarItemMenu: (note: Note) => void
    }
  }
}

type Note = {
  name: string
  path: string
}
