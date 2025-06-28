import path from 'path';
import fs from 'fs';


// Devuelve rutas del proyecto (carpeta + ZIP)
export function getProjectPaths(baseName: string): { extractToPath: string; zipPath: string; uploadPath: string } {
  const uploadPath = path.resolve('uploaded-repos');
  const extractToPath = path.join(uploadPath, baseName);
  const zipPath = path.join(uploadPath, `${baseName}.zip`);

  return { extractToPath, zipPath, uploadPath };
}

export function cleanAppFiles(imageName: string): void {
  const projectFolderName = imageName.replace('auto-', '');
  const { extractToPath, zipPath } = getProjectPaths(projectFolderName);

  if (fs.existsSync(extractToPath)) {
    fs.rmSync(extractToPath, { recursive: true, force: true });
    console.log(`[CLEAN] Carpeta eliminada: ${extractToPath}`);
  }

  if (fs.existsSync(zipPath)) {
    fs.rmSync(zipPath);
    console.log(`[CLEAN] ZIP eliminado: ${zipPath}`);
  }
}