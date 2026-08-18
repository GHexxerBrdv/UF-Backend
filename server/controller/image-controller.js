import { createFile, getFileById, incrementDownloadCount } from "../models/file.js";

export const uploadImage = async (req, res) => {
  const filePath = req.file.location || req.file.path || req.file.key;
  const fileObj = {
    path: filePath,
    name: req.file.originalname
  };
  try {
    const file = await createFile(fileObj);
    res.status(200).json({ path: `http://localhost:8000/file/${file.id}` });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

export const downloadImage = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const file = await getFileById(fileId);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    await incrementDownloadCount(fileId);

    if (file.path.startsWith('http://') || file.path.startsWith('https://')) {
      return res.redirect(file.path);
    }

    res.download(file.path, file.name);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};