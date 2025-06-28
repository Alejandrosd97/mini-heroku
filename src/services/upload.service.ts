import { extractZipFromFile } from './file/zip.service';
import { generateDockerfileAndDockerignore } from './docker.service';
import { buildDockerImage } from './docker.service';
import { runAppWithTraefik } from './traefik.service';
import { registerApp } from './registry/app-registry.service';
import { AppRegistryEntry } from '../types/types';

export async function handleUpload(file: Express.Multer.File): Promise<{ url: string; id: string }> {
  // 1️⃣ Nombre de la app
  const projectName = file.originalname.replace('.zip', '');
  const imageName = `auto-${projectName}`;

  // 2️⃣ Descomprimir ZIP
  const projectPath = await extractZipFromFile(file);

  // 3️⃣ Generar Dockerfile + .dockerignore
  generateDockerfileAndDockerignore(projectPath);

  // 4️⃣ Build imagen docker
  await buildDockerImage(imageName, projectPath);

  // 5️⃣ Run contenedor con Traefik
  await runAppWithTraefik(imageName, projectName, projectName); // de momento sin env

  // 6️⃣ Registrar app
  const newApp: AppRegistryEntry = {
    id: imageName,
    subdomain: projectName,
    url: `http://${projectName}.localhost`, 
    env: {} // inicial vacío
  };

  registerApp(newApp);

  return {
    url: newApp.url,
    id: newApp.id
  };
}
