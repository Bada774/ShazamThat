import { Shazam } from "node-shazam";

import { SHAZAM_LOCALE } from "../../config.js";

const shazam = new Shazam();

export async function recognizeSong(file) {
    try {
        const result = await shazam.recognise(file.path, SHAZAM_LOCALE);
        return { ...file, tags: normalizeTrack(result?.track) };
    } catch (error) {
        console.error(`Error recognizing: ${file.path}`, error);
        return { ...file, tags: null };
    }
}

function normalizeTrack(track) {
    if (!track) return null;

    const { album, year } = extractSongMetadata(track);

    return {
        title: track.title,
        subtitle: track.subtitle,
        images: track.images,
        genres: track.genres,
        album,
        year,
    };
}

function extractSongMetadata(track) {
    const songSection = track.sections?.find(
        (section) => section.type === "SONG",
    );
    const metadata = songSection?.metadata ?? [];

    const album = metadata[0]?.text;
    const year = metadata.find((entry) => /^\d{4}$/.test(entry.text))?.text;

    return { album, year };
}
