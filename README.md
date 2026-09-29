# ShazamThat

A personal-use Node.js utility that recognizes downloaded audio files via Shazam, rewrites their metadata, and sorts them into folders.

## Features

- Discovers audio files in a folder (including audio tracks inside video files)
- Recognizes tracks via [node-shazam](https://www.npmjs.com/package/node-shazam)
- Writes ID3 tags (artist, title, album, year, genre, cover art)
- Sorts files into folders — by artist, by artist and album, or by genre (configurable)
- Files that fail recognition are set aside instead of being lost
- Re-sorts an already-processed library without re-querying Shazam - tags are read back from the files themselves

## Requirements

- Node.js 20.12+

The `ffprobe` binary is installed automatically via `@ffprobe-installer/ffprobe` - no need to install `ffmpeg`/`ffprobe` on the system separately.

## Installation

```bash
git clone <repo-url>
cd ShazamThat
npm install
```

## Usage

1. Put your audio/video files into `files/uncategorized/`.
2. Run recognition and sorting:
    ```bash
    npm start
    ```
3. Results land in `files/sorted/`; files that couldn't be recognized go to `files/unrecognized/`.

If you want to change the sorting scheme (e.g. from "by artist" to "by genre"), update `SORT_BY` in `config.js` and re-sort the already-processed library without re-recognizing anything:

```bash
npm run reorganize
```

## Configuration

All settings live in `config.js`:

| Setting                   | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| `PATHS`                   | Paths to the source, sorted, and unrecognized folders                           |
| `SCAN_CONCURRENCY`        | How many files to scan in parallel                                              |
| `RECOGNITION_CONCURRENCY` | How many parallel requests to send to Shazam                                    |
| `SHAZAM_LOCALE`           | Locale used for Shazam requests (e.g. `"en-US"`)                                |
| `SORT_BY`                 | Sorting scheme: `"artist"`, `"artist+album"`, or `"genre"`                      |
| `SAVE_COVER_IMAGES`       | Whether to also save the cover art as a separate `cover.jpg` next to the tracks |

## Project structure

```
config.js                      # all project settings
index.js                       # runs recognition and sorting
reorganize.js                  # re-sorts the library without re-running recognition
src/
├── files/
│   ├── scaner.js               # finds audio/video files in a folder
│   ├── naming.js                # builds a file name from tags
│   ├── orginizer.js             # moves a file into its final folder
│   └── fsUtils.js               # shared fs helpers (create dirs, clean up empty ones)
├── recognition/
│   └── shazamService.js         # recognizes a track via Shazam
├── network/
│   └── downloader.js            # downloads cover art
├── metadata/
│   └── id3Writer.js             # writes and reads ID3 tags
└── pipeline/
    ├── processLibrary.js        # main pipeline: scan → recognize → tag → sort
    └── reorganizeLibrary.js      # re-sorts already-processed files
```
