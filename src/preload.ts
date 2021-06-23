import { contextBridge, ipcRenderer } from "electron"
import { Note } from "./types"

contextBridge.exposeInMainWorld("notes", {
  createNote: (): Promise<string> => ipcRenderer.invoke("create-note"),
  reload: (): Promise<void> => ipcRenderer.invoke("reload-note"),
  onChangeNotes: (listener: (filenames: Note[]) => void): (() => void) => {
    ipcRenderer.on("change-notes", (ev, args) => listener(args))

    return () => {
      ipcRenderer.removeListener("change-notes", listener)
    }
  },
  saveNote: (notePath: string, noteText: string): Promise<void> =>
    ipcRenderer.invoke("save-note", notePath, noteText),
  readNote: (notePath: string): Promise<string> =>
    ipcRenderer.invoke("read-note", notePath),

  renameNote: (notePath: string, newName: string): Promise<Note> =>
    ipcRenderer.invoke("rename-note", notePath, newName),
})

contextBridge.exposeInMainWorld("menu", {
  showSidebarItemMenu: (note: Note) =>
    ipcRenderer.send("show-sidebar-item-menu", note),
})
