import NodeID3 from "node-id3";

export function writeTags(file, tags, coverBuffer) {
    const id3Tags = {
        title: tags.title,
        artist: tags.subtitle,
        album: tags.album,
        year: tags.year,
    };

    if (tags.genres?.primary) {
        id3Tags.genre = tags.genres.primary;
    }

    if (coverBuffer) {
        id3Tags.image = {
            mime: "image/jpeg",
            type: { id: 3, name: "front cover" },
            description: "Cover",
            imageBuffer: coverBuffer,
        };
    }

    return NodeID3.write(id3Tags, file.path);
}

export function readTags(filePath) {
    const id3 = NodeID3.read(filePath);
    if (!id3?.title || !id3?.artist) return null;

    return {
        tags: {
            title: id3.title,
            subtitle: id3.artist,
            album: id3.album,
            year: id3.year,
            genres: id3.genre ? { primary: id3.genre } : undefined,
        },
        coverBuffer: id3.image?.imageBuffer ?? null,
    };
}
