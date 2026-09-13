import type { UploadApiResponse } from "cloudinary";
import type { Request, Response } from "express";
import { cloudinary } from "../Config/cloudinaryConfig.js";
import { getErrorMessage } from "../Utils/error.js";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB

/** Buffer, remote URL, or data URI — never a local server file path */
export type MediaFileInput = string | Buffer;
export interface UploadMediaOptions {
  folder?: string;
  public_id?: string;
}

interface UploadMediaBody {
  file?: string;
  folder?: string;
  public_id?: string;
}

const isDataUri = (file: string): boolean => file.startsWith("data:");
const isRemoteUrl = (file: string): boolean =>
  file.startsWith("http://") || file.startsWith("https://");

const assertCloudinaryInput = (file: MediaFileInput): void => {
  if (Buffer.isBuffer(file)) return;
  if (isDataUri(file) || isRemoteUrl(file)) return;
  throw new Error(
    "Media must be a base64 data URI, remote URL, or file buffer — files are not stored on the server"
  );
};

const getBufferSize = (file: MediaFileInput): number | null => {
  if (Buffer.isBuffer(file)) return file.length;
  if (isDataUri(file)) {
    const base64 = file.split(",")[1] ?? "";
    return Buffer.byteLength(base64, "base64");
  }
  return null;
};

const assertWithinLimit = (
  size: number | null,
  maxBytes: number,
  label: string
): void => {
  if (size !== null && size > maxBytes) {
    throw new Error(
      `${label} exceeds the ${Math.round(maxBytes / (1024 * 1024))} MB limit`
    );
  }
};

const uploadBuffer = (
  buffer: Buffer,
  options: Record<string, unknown>
): Promise<UploadApiResponse> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) {
        reject(error ?? new Error("Cloudinary upload failed"));
        return;
      }
      resolve(result);
    });
    stream.end(buffer);
  });

const uploadImage = async (
  file: MediaFileInput,
  options: UploadMediaOptions = {}
): Promise<UploadApiResponse> => {
  assertCloudinaryInput(file);
  assertWithinLimit(getBufferSize(file), MAX_IMAGE_BYTES, "Image");
  
  const uploadOptions = {
    resource_type: "image" as const,
    folder: options.folder ?? "images",
    public_id: options.public_id,
    overwrite: true,
  };

  if (Buffer.isBuffer(file)) return uploadBuffer(file, uploadOptions);
  return cloudinary.uploader.upload(file, uploadOptions);
};

const uploadVideo = async (
  file: MediaFileInput,
  options: UploadMediaOptions = {}
): Promise<UploadApiResponse> => {
  assertCloudinaryInput(file);
  assertWithinLimit(getBufferSize(file), MAX_VIDEO_BYTES, "Video");

  const uploadOptions = {
    resource_type: "video" as const,
    folder: options.folder ?? "videos",
    public_id: options.public_id,
    overwrite: true,
    chunk_size: 6_000_000,
  };

  if (Buffer.isBuffer(file)) return uploadBuffer(file, uploadOptions);
  return cloudinary.uploader.upload_large(
    file,
    uploadOptions
  ) as Promise<UploadApiResponse>;
};

const resolveFileInput = (req: Request): MediaFileInput | null => {
  const fileFromMulter = (
    req as Request & { file?: { buffer?: Buffer } }
  ).file;
  if (fileFromMulter?.buffer) return fileFromMulter.buffer;

  const body = req.body as UploadMediaBody;
  return body.file ?? null;
};

const uploadImageController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const file = resolveFileInput(req);
    if (!file) {
      res.status(400).json({ message: "Image file is required" });
      return;
    }

    const { folder, public_id } = req.body as UploadMediaBody;
    const result = await uploadImage(file, { folder, public_id });
    res.status(201).json({
      status: 201,
      message: "Image uploaded successfully",
      data: {
        public_id: result.public_id,
        url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
      },
    });
  } catch (err: unknown) {
    res.status(500).json({ message: getErrorMessage(err) });
  }
};

const uploadVideoController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const file = resolveFileInput(req);
    if (!file) {
      res.status(400).json({ message: "Video file is required" });
      return;
    }

    const { folder, public_id } = req.body as UploadMediaBody;
    const result = await uploadVideo(file, { folder, public_id });

    res.status(201).json({
      status: 201,
      message: "Video uploaded successfully",
      data: {
        public_id: result.public_id,
        url: result.secure_url,
        format: result.format,
        duration: result.duration,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
      },
    });
  } catch (err: unknown) {
    res.status(500).json({ message: getErrorMessage(err) });
  }
};

export {
  uploadImage,
  uploadVideo,
  uploadImageController,
  uploadVideoController,
};
