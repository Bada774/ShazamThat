import fs from "fs";
import path from "path";

export function createDirectory(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
        return true;
    }
    return false;
}

export function removeEmptyDirs(rootDir) {
    if (!fs.existsSync(rootDir)) return;

    for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;

        const dirPath = path.join(rootDir, entry.name);
        removeEmptyDirs(dirPath);

        if (fs.readdirSync(dirPath).length === 0) {
            fs.rmdirSync(dirPath);
        }
    }
}
