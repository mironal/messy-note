import fs, { FSWatcher } from "fs"
import events from "events"
import path from "path"
import bunyan from "bunyan"
import { v4 as uuidv4 } from "uuid"
import { Note } from "../types"

const log = bunyan.createLogger({ name: "NoteManager" })

export declare interface NoteManager {
  on(event: "change-notes", listener: (notes: Note[]) => void): this
}

export class NoteManager extends events.EventEmitter {
  static readonly NOTES_JSON_NAME = "notes.json"
  static readonly NOTES_DIRECTORY_NAME = "notes"
  static readonly NOTE_EXTENSION = "messynote"

  private notesJsonPath: string
  private notesDirPath: string
  private watcher: FSWatcher | null = null
  private notes: Note[] = []

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
    this.emitNotes()
  }

  async createNewNote() {
    const uuid = uuidv4()
    const newNotePath = path.join(this.notesDirPath, uuid)

    await fs.promises.writeFile(path.join(this.notesDirPath, uuid), "", {
      encoding: "utf-8",
    })

    log.info(newNotePath, "created")
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

  private async emitNotes() {
    const entries = await fs.promises.readdir(this.notesDirPath, {
      withFileTypes: true,
    })

    this.notes = entries
      .filter((ent) => ent.isFile())
      .map((f) => ({
        path: path.join(this.notesDirPath, f.name),
        name: f.name,
      }))

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
    this.watcher = fs.watch(
      this.notesDirPath,
      (event: string, filename: string) => {
        log.warn(`Change: event => ${event}, filename => ${filename}`)
        this.emitNotes()
      }
    )
    this.emitNotes()
  }
}
