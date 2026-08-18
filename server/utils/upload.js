import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';


let uploadMiddleware;

export const initS3Config = ({ region, accessKeyId, secretAccessKey, bucketName }) => {
  const s3 = new S3Client({
    region: region,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });

  uploadMiddleware = multer({
    storage: multerS3({
      s3: s3,
      bucket: bucketName,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        cb(null, `uploads/${Date.now()}-${file.originalname}`);
      },
    }),
  });
};

const upload = {
  single: (fieldName) => (req, res, next) => {
    if (!uploadMiddleware) {
      return res.status(500).json({ error: 'S3 upload middleware is not initialized yet' });
    }
    return uploadMiddleware.single(fieldName)(req, res, next);
  },
  array: (fieldName, maxCount) => (req, res, next) => {
    if (!uploadMiddleware) {
      return res.status(500).json({ error: 'S3 upload middleware is not initialized yet' });
    }
    return uploadMiddleware.array(fieldName, maxCount)(req, res, next);
  }
};

export default upload;