export const PATHS = {
    source: "files/uncategorized",
    sorted: "files/sorted",
    unrecognized: "files/unrecognized",
};

// Concurrency for I/O (ffprobe, reading)
export const SCAN_CONCURRENCY = 8;

// Concurrency for Shazam request
export const RECOGNITION_CONCURRENCY = 2;

export const SHAZAM_LOCALE = "en-US";

// "artist" | "artist+album" | "genre"
export const SORT_BY = "artist";

export const SAVE_COVER_IMAGES = false;
