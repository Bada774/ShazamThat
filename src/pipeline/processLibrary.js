import path from "path";
import fs from "fs";
import pLimit from "p-limit";

import { readDirectory } from "../fileManagement/scaner.js";
import { createDirectory } from "../fileManagement/fsUtils.js";
import { recognizeSong } from "../recognition/shazamService.js";
import { downloadFile } from "../network/downloader.js";
import { writeTags } from "../metadata/id3Writer.js";
import { organizeFile } from "../fileManagement/orginizer.js";
import { PATHS, RECOGNITION_CONCURRENCY } from "../../config.js";

export async function processLibrary() {
    createDirectory(PATHS.source);

    const files = await readDirectory(PATHS.source);
    const limit = pLimit(RECOGNITION_CONCURRENCY);

    await Promise.all(files.map((file) => limit(() => processOneFile(file))));
}

async function processOneFile(file) {
    const recognized = await recognizeSong(file);
    if (!recognized.tags) {
        moveToUnrecognized(recognized);
        return;
    }

    try {
        const coverBuffer = recognized.tags.images?.coverart
            ? await downloadFile(recognized.tags.images.coverart)
            : null;

        writeTags(recognized, recognized.tags, coverBuffer);
        organizeFile(recognized, coverBuffer);
    } catch (error) {
        console.error(`Failed to process ${recognized.path}`, error);
        moveToUnrecognized(recognized);
    }
}

function moveToUnrecognized(recognized) {
    createDirectory(PATHS.unrecognized);
    fs.renameSync(
        recognized.path,
        path.join(PATHS.unrecognized, recognized.name),
    );
}
