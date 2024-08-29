/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { faker } from "@faker-js/faker";
import { MOCK_AVATAR_DIR, MOCK_IMAGE_DIR, UPLOAD_DIR } from "@src/constant/dir";
import { generateImageUrl } from "@src/helpers/generateImageUrl";
import axios from "axios";
import fs from "fs";
import path from "path";
import { promisify } from "util";

export const randomDate = (startDate: Date) => {
  const endDate = new Date("2024-08-21");
  if (startDate > endDate) startDate = new Date("2024-07-21");
  const randomDate = faker.date.between({ from: startDate, to: endDate });
  return randomDate;
};

export const maxDate = (date1: Date, date2: Date | null | undefined): Date => {
  if (!date2) return date1;
  return new Date(Math.max(date1.getTime(), date2.getTime()));
};

//sanitizing the username to avoid any special characters, ensure that friendly for the URL
export const sanitizeUsername = (username: string): string => {
  return username.replace(/[^a-zA-Z0-9]/g, "");
};

const writeFile = promisify(fs.writeFile);

export const downloadAndSaveImage = async (
  imageUrl: string,
  fileName: string
): Promise<string | null> => {
  try {
    const savePath = UPLOAD_DIR;
    // Fetch the image
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    if (response.status !== 200) {
      return null;
    }
    // Determine the file extension
    const contentType = response.headers["content-type"];
    const extension = contentType?.split("/")[1] || "jpg"; // Default to jpg if type is unknown
    // Create a complete path to save the image

    fileName = `${fileName}.${extension}`;
    const fullPath = path.join(savePath, fileName);

    // Save the image to the specified path
    await writeFile(fullPath, response.data);
    return generateImageUrl(fileName);
  } catch (error) {
    console.error("Error downloading or saving image:", error);
    return null;
  }
};

export const downloadAndSaveImagesAsJson = async (numberOfImages: number) => {
  console.log("start downloading images");
  const images = [];
  const imageUrl = "https://random.imagecdn.app/1920/1080";
  for (let i = 0; i < numberOfImages; i++) {
    const imagePath = await downloadAndSaveImage(imageUrl, `image-${i}`);
    if (imagePath) {
      images.push(imagePath);
    }
  }

  await writeFile(
    MOCK_IMAGE_DIR,
    JSON.stringify({
      images: images,
    })
  );
  console.log("images downloaded and saved as json complete");
};

export const downloadAndSaveAvatarsAsJson = async (numberOfAvatars: number) => {
  console.log("start downloading avatars");
  const avatars = [];
  const avatarUrl = "https://avatar.iran.liara.run/public/";
  console.log("start downloading avatars");
  for (let i = 0; i < numberOfAvatars; i++) {
    const avatarPath = await downloadAndSaveImage(
      avatarUrl + ((i % 100) + 1),
      `avatar-${i}`
    );
    if (avatarPath) {
      avatars.push(avatarPath);
    }
  }
  await writeFile(
    MOCK_AVATAR_DIR,
    JSON.stringify({
      avatars: avatars,
    })
  );
  console.log("avatars downloaded and saved as json complete");
};
