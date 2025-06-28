import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { handleUpload } from '../services/upload.service';
import { uploadHandler } from '../handlers/uploadHandler';

const router = Router();

const uploadPath = path.resolve('uploaded-repos');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// POST /upload
// Repo es el nombre del campo en el formulario
router.post('/', upload.single('repo'), uploadHandler)
export { router as uploadRouter };
