import { contextBridge, ipcRenderer } from "electron"
import { Note } from "./types"

contextBridge.exposeInMainWorld("notes", {
  createNote: (): Promise<void> => ipcRenderer.invoke("create-note"),
  reload: (): Promise<void> => ipcRenderer.invoke("reload-note"),
  onChangeNotes: (listener: (filenames: Note[]) => void): (() => void) => {
    ipcRenderer.on("change-notes", (ev, args) => listener(args))

    return () => {
      ipcRenderer.removeListener("change-notes", listener)
    }
  },
})
