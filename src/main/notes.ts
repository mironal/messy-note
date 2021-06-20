import fs from "fs"
import events from "events"
import path from "path"
import bunyan from "bunyan"
import { Note } from "../types"
import chokidar from "chokidar"

const log = bunyan.createLogger({ name: "NoteManager" })

export declare interface NoteManager {
  on(event: "change-notes", listener: (notes: Note[]) => void): this
}

export class NoteManager extends events.EventEmitter {
  static readonly NOTES_JSON_NAME = "notes.json"
  static readonly NOTES_DIRECTORY_NAME = "notes"
  static readonly NOTE_EXTENSION = "mnote"

  private notesJsonPath: string
  private notesDirPath: string
  private notes: Note[] = []
  private watcher: chokidar.FSWatcher

  /**
   *
   * @param rootDirectory Directory path where notes are stored.
   */
  constructor(public readonly rootDirectory: string) {
    super()
    this.notesJsonPath = path.join(rootDirectory, NoteManager.NOTES_JSON_NAME)
    this.notesDirPath = path.join(
      rootDirectory,
      NoteManager.NOTES_DIRECTORY_NAME
    )
  }

  start() {
    this.initializeIfNeeded().then(() => this.startWatchNotes())
  }

  async reload() {
    this.emitNotes("reload")
  }

  async createNewNote() {
    let index = 0

    const name = "Untitled"
    let newNotePath =
      path.join(this.notesDirPath, name) + "." + NoteManager.NOTE_EXTENSION

    while (fs.existsSync(newNotePath)) {
      index += 1
      newNotePath =
        path.join(this.notesDirPath, `${name}_${index}`) +
        "." +
        NoteManager.NOTE_EXTENSION
    }

    await fs.promises.writeFile(newNotePath, "", {
      encoding: "utf-8",
    })

    log.info(newNotePath, "created")
    return newNotePath
  }

  async readNoteText(note: Note): Promise<string> {
    return fs.promises.readFile(note.path, "utf-8")
  }

  async saveNote(note: Note, noteText: string): Promise<void> {
    return fs.promises.writeFile(note.path, noteText, "utf-8")
  }

  async deleteNote({ path }: Note): Promise<void> {
    return fs.promises.unlink(path)
  }

  async renameNote(note: Note, name: string): Promise<Note> {
    const filename = (() => {
      if (name.endsWith(NoteManager.NOTE_EXTENSION)) {
        return name
      }
      return `${name}.${NoteManager.NOTE_EXTENSION}`
    })()
    const newPath = path.join(note.path, "..", filename)

    await fs.promises.rename(note.path, newPath)
    return {
      ...note,
      name,
      path: newPath,
    }
  }

  private async emitNotes(event: string) {
    const watchedFiles = this.watcher.getWatched()
    const notes = watchedFiles[this.notesDirPath]
    this.notes = notes.map((n) => {
      return {
        path: path.join(this.notesDirPath, n),
        name: path.basename(n, `.${NoteManager.NOTE_EXTENSION}`),
      }
    })

    log.info(this.notes, `change-notes[${event}]`)
    this.emit("change-notes", this.notes)
  }

  private async initializeIfNeeded() {
    // create "notes.json"

    await fs.promises
      .writeFile(this.notesJsonPath, "{}", {
        encoding: "utf-8",
        flag: "wx",
      })
      .then(() => log.info(`${this.notesJsonPath} created.`))
      .catch((error) => {
        if (error.code === "EEXIST") {
          log.info(`${this.notesJsonPath} already exists.`)
          // ignore
          return
        }
        throw error
      })

    // create "notes" direcotry
    await fs.promises.mkdir(this.notesDirPath, { recursive: true })

    // create first note
    const files = await fs.promises.readdir(this.notesDirPath)
    if (files.length === 0) {
      this.createNewNote()
    }

    log.info(`${this.notesDirPath} created.`)
  }

  private startWatchNotes() {
    if (this.watcher != null) {
      log.warn(`Watching ${this.notesDirPath} has already started.`)
      return
    }
    this.watcher = chokidar.watch(
      this.notesDirPath + "/*." + NoteManager.NOTE_EXTENSION,
      {
        ignored: /(^|[/\\])\../, // ignore dotfiles
        ignoreInitial: true,
      }
    )
    this.watcher
      .on("ready", () => this.emitNotes("ready"))
      .on("change", () => this.emitNotes("change"))
      .on("add", () => this.emitNotes("add"))
      .on("unlink", () => this.emitNotes("unlink"))
      .on("error", log.error)
  }
}
