import path from "path";

// Path to the directory where the uploaded files will be saved
export const UPLOAD_DIR = path.resolve("src/uploads");

//
export const FRONTEND_SERVE_DIR = path.resolve("client/dist");

// Path to the directory where the images.json (mock images data) will be saved
export const MOCK_IMAGE_DIR = path.resolve("src/zmock-data/images.json");

// Path to the directory where the avatars.json (mock avatars data) will be saved
export const MOCK_AVATAR_DIR = path.resolve("src/zmock-data/avatars.json");
