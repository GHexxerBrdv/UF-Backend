import { GetObjectCommand } from "@aws-sdk/client-s3";
import { createFile, getFileById, incrementDownloadCount } from "../models/file.js";
import { getS3Client, getBucketName } from "../utils/upload.js";

export const uploadImage = async (req, res) => {
  const filePath = req.file.key || req.file.location || req.file.path;
  const fileObj = {
    path: filePath,
    name: req.file.originalname
  };
  try {
    const file = await createFile(fileObj);
    const host = req.get('host');
    res.status(200).json({ path: `${req.protocol}://${host}/file/${file.id}` });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

const extractS3Key = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      const url = new URL(path);
      return decodeURIComponent(url.pathname.substring(1));
    } catch {
      return path;
    }
  }
  return path;
};

export const downloadImage = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const file = await getFileById(fileId);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    await incrementDownloadCount(fileId);

    const s3Client = getS3Client();
    const bucketName = getBucketName();

    if (s3Client && bucketName && file.path) {
      const s3Key = extractS3Key(file.path);
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
      });

      const s3Response = await s3Client.send(command);

      res.setHeader('Content-Type', s3Response.ContentType || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.name)}"`);

      if (s3Response.ContentLength) {
        res.setHeader('Content-Length', s3Response.ContentLength);
      }

      return s3Response.Body.pipe(res);
    }

    res.download(file.path, file.name);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};