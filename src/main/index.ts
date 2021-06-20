import { app, BrowserWindow, ipcMain, Menu } from "electron"
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from "electron-devtools-installer"
import { NoteManager } from "./notes"
import bunyan from "bunyan"
import { menuTemplate, showSidebarItemMenu } from "./menus"

const log = bunyan.createLogger({ name: "main" })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const MAIN_WINDOW_WEBPACK_ENTRY: any
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: unknown

const noteManager = new NoteManager(app.getPath("userData"))

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit()
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY as string,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  noteManager.on("change-notes", (notes) => {
    log.info(notes, "send change-notes event to main window")
    mainWindow.webContents.send("change-notes", notes)
  })
}

ipcMain.handle("create-note", () => {
  log.info("handle create-notes")
  return noteManager.createNewNote()
})

ipcMain.handle("reload-note", () => {
  log.info("handle reload-notes")
  noteManager.reload()
})

ipcMain.handle("read-note", (ev, note) => {
  return noteManager.readNoteText(note)
})

ipcMain.handle("save-note", (ev, note, noteText) => {
  return noteManager.saveNote(note, noteText)
})

ipcMain.on("show-sidebar-item-menu", showSidebarItemMenu(noteManager))

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow)

app.on("ready", () => {
  noteManager.start()
})

app.whenReady().then(() => {
  installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS])
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err))
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)
