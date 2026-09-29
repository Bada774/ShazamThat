import fs from "fs";
import path from "path";
import pLimit from "p-limit";

import { fileTypeFromFile } from "file-type";
import ffmpeg from "fluent-ffmpeg";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";

import { SCAN_CONCURRENCY } from "../../config.js";

ffmpeg.setFfprobePath(ffprobeInstaller.path);

export async function readDirectory(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        throw new Error(`Directory ${directoryPath} does not exist.`);
    }

    const fileEntries = fs
        .readdirSync(directoryPath, {
            recursive: true,
            withFileTypes: true,
        })
        .filter((entry) => entry.isFile());

    const limit = pLimit(SCAN_CONCURRENCY);

    const results = await Promise.all(
        fileEntries.map((entry) =>
            limit(() => processFile(entry, directoryPath)),
        ),
    );

    return results.filter((result) => result !== null);
}

async function processFile(entry, directoryPath) {
    const baseDir = entry.parentPath ?? entry.path ?? directoryPath;
    const filePath = path.join(baseDir, entry.name);

    try {
        const type = await fileTypeFromFile(filePath);
        if (!type) return null;

        const isAudio = type.mime.startsWith("audio");
        const isVideoWithAudio =
            type.mime.startsWith("video") && (await hasAudioStream(filePath));

        if (isAudio || isVideoWithAudio) {
            return {
                name: entry.name,
                path: filePath,
                type: type.mime,
            };
        }

        return null;
    } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
        return null;
    }
}

async function hasAudioStream(filePath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                return resolve(false);
            }
            const hasAudio = metadata.streams?.some(
                (stream) => stream.codec_type === "audio",
            );
            resolve(Boolean(hasAudio));
        });
    });
}
