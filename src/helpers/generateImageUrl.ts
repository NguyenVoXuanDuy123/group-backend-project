import EnvVars from "@src/constant/EnvVars";

export const generateImageUrl = (fileName: string) => {
  return `http://localhost:` + EnvVars.Port + `/images/${fileName}`;
};
