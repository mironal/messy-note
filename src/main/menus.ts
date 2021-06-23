import { Menu, MenuItem, BrowserWindow, dialog, app } from "electron"
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
            detail:
              process.platform === "darwin"
                ? `Are you sure you want to delete '${note.name}'?`
                : null, // for mac
            buttons: ["Delete", "Cancel"],
            defaultId: 0,
          })

          if (response === 0) {
            noteManager.deleteNote(note.path)
          }
        },
      })
    )
    const window = BrowserWindow.fromId(ev.frameId)
    menu.popup({ window })
  }
}

const isMac = process.platform === "darwin"

export const menuTemplate: any = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideothers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: "File",
    submenu: [isMac ? { role: "close" } : { role: "quit" }],
  },
  // { role: 'editMenu' }
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      ...(isMac
        ? [
            { role: "pasteAndMatchStyle" },
            { role: "delete" },
            { role: "selectAll" },
            { type: "separator" },
            {
              label: "Speech",
              submenu: [{ role: "startspeaking" }, { role: "stopspeaking" }],
            },
          ]
        : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
    ],
  },
  // { role: 'viewMenu' }
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forcereload" },
      { role: "toggledevtools" },
      { type: "separator" },
      { role: "resetzoom" },
      { role: "zoomin" },
      { role: "zoomout" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  // { role: 'windowMenu' }
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" },
          ]
        : [{ role: "close" }]),
    ],
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron")
          await shell.openExternal("https://electronjs.org")
        },
      },
    ],
  },
]
