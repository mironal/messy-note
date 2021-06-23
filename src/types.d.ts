import { IpcRenderer } from "electron"
declare global {
  interface Window {
    // for contextBridge in preload.ts
    notes: {
      createNote: () => Promise<string>
      reload: () => Promise<void>
      onChangeNotes: (listener: (filenames: Note[]) => void) => () => void
      saveNote: (notePath: string, noteText: string) => Promise<void>
      readNote: (notePath: string) => Promise<string>
      renameNote: (notePath: string, newName: string) => Promise<Note>
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
