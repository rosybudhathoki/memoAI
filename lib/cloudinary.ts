import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function persistImage(openAiUrl: string) {
  const result = await cloudinary.uploader.upload(openAiUrl, {
    folder: "notebook-thumbnails",
  });

  return result.secure_url;
}
