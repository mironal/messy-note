import { Menu, MenuItem, BrowserWindow, dialog } from "electron"
import { Note } from "../types"
import { NoteManager } from "./notes"

export function showSidebarItemMenu(noteManager: NoteManager) {
  return (ev: Electron.IpcMainEvent, note: Note) => {
    const menu = new Menu()
    menu.append(
      new MenuItem({
        label: "Delete",
        click: async () => {
          const { response } = await dialog.showMessageBox({
            type: "warning",
            title: `Are you sure you want to delete '${note.name}'?`,
            message: "You can't restore this note.",
            buttons: ["Delete", "Cancel"],
            defaultId: 0,
          })

          if (response === 0) {
            noteManager.deleteNote(note)
          }
        },
      })
    )
    const window = BrowserWindow.fromId(ev.frameId)
    menu.popup({ window })
  }
}
