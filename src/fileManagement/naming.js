const ILLEGAL_CHARS = /[\\/:*?"<>|]/g;

export function sanitize(str) {
    return str.replace(ILLEGAL_CHARS, "").trim();
}

export function buildFileName(tags, extension) {
    return `${sanitize(tags.subtitle)} - ${sanitize(tags.title)}${extension}`;
}
