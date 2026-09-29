import { readDirectory } from "../fileManagement/scaner.js";
import { createDirectory, removeEmptyDirs } from "../fileManagement/fsUtils.js";
import { readTags } from "../metadata/id3Writer.js";
import { organizeFile } from "../fileManagement/orginizer.js";
import { PATHS } from "../../config.js";

export async function reorganizeLibrary() {
    createDirectory(PATHS.sorted);

    const files = await readDirectory(PATHS.sorted);

    for (const file of files) {
        const result = readTags(file.path);
        if (!result) {
            console.warn(`Skipped (no tags): ${file.path}`);
            continue;
        }

        try {
            organizeFile({ ...file, tags: result.tags }, result.coverBuffer);
        } catch (error) {
            console.error(`Failed to reorganize ${file.path}:`, error);
        }
    }

    removeEmptyDirs(PATHS.sorted);
}
