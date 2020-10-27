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
  saveNote: (note: Note, noteText: string): Promise<void> =>
    ipcRenderer.invoke("save-note", note, noteText),
  readNote: (note: Note): Promise<string> =>
    ipcRenderer.invoke("read-note", note),
})

contextBridge.exposeInMainWorld("menu", {
  showSidebarItemMenu: (note: Note) =>
    ipcRenderer.send("show-sidebar-item-menu", note),
})
