# Messy note

Put together messy notes in one place.

You don't have to decide where to save or name the file until you need it.

All notes are stored somewhere in the app.

## Arch

### Notes structure

Notes are stored in `app.getPath("userData")/notes` by default.

- notes.json // The notes metadata file.
- notes/
  - note1
  - ntoe2
  - ...

#### notes.json

```json
{
  "notes": [
    {
      "path": "path/to/note",
      "name": "optional note name"
    }
  ]
}
```

## Inter process

## Main Process

## Renderer Process
