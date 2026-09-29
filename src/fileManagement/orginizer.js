import fs from "fs";
import path from "path";

import { sanitize, buildFileName } from "./naming.js";
import { createDirectory } from "./fsUtils.js";
import { PATHS, SAVE_COVER_IMAGES, SORT_BY } from "../../config.js";

const SORT_STRATEGIES = {
    artist: (tags) => [sanitize(tags.subtitle)],
    "artist+album": (tags) => [
        sanitize(tags.subtitle),
        sanitize(tags.album ?? "Unknown Album"),
    ],
    genre: (tags) => [sanitize(tags.genres?.primary ?? "Unknown Genre")],
};

export function organizeFile(file, coverBuffer) {
    const ext = path.extname(file.path);
    const buildPathParts = SORT_STRATEGIES[SORT_BY] ?? SORT_STRATEGIES.artist;
    const targetDir = path.join(PATHS.sorted, ...buildPathParts(file.tags));

    createDirectory(targetDir);

    const newPath = path.join(targetDir, buildFileName(file.tags, ext));
    fs.renameSync(file.path, newPath);

    if (SAVE_COVER_IMAGES) {
        if (coverBuffer) {
            const coverPath = path.join(targetDir, "cover.jpg");
            if (!fs.existsSync(coverPath)) {
                fs.writeFileSync(coverPath, coverBuffer);
            }
        }
    }

    return { ...file, path: newPath };
}
