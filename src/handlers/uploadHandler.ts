import { Request, Response } from 'express';
import { handleUpload } from '../services/upload.service';
import { getAppById } from '../services/registry/app-registry.service';

export async function uploadHandler(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageName = `auto-${req.file.originalname.replace('.zip', '')}`;

    // Validar que no exista ya una app con ese nombre
    if (getAppById(imageName)) {
      return res.status(409).json({ message: 'App already exists' });
    }


    const result = await handleUpload(req.file);

    res.status(200).json({
      message: 'App desplegada correctamente',
      ...result
    });
  } catch (error) {
    console.error('[UPLOAD ERROR]', error);
    res.status(500).json({ message: 'Error al procesar subida' });
  }
}
