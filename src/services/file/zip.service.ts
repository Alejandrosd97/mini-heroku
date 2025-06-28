import path from 'path';
import AdmZip from 'adm-zip';
import { getProjectPaths } from './project-paths.service';

// Extrae ZIP recibido por upload (req.file)
export async function extractZipFromFile(file: Express.Multer.File): Promise<string> {

  const baseName = path.parse(file.originalname).name;
  const { extractToPath } = getProjectPaths(baseName);

  const zip = new AdmZip(file.path);
  zip.extractAllTo(extractToPath, true);

  console.log(`[ZIP] Descomprimido desde file: ${extractToPath}`);
  return extractToPath;
}

// Extrae ZIP desde ruta en disco
export async function extractZipFromPath(zipPathInput: string): Promise<string> {
  const baseName = path.parse(zipPathInput).name;
  const { extractToPath } = getProjectPaths(baseName);

  const zip = new AdmZip(zipPathInput);
  zip.extractAllTo(extractToPath, true);

  console.log(`[ZIP] Descomprimido desde path: ${extractToPath}`);
  return extractToPath;
}
