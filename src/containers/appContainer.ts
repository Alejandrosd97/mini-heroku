import { getAppById, removeApp, updateAppEnv } from '../services/registry/app-registry.service';
import {
  stopDockerContainer,
  removeDockerContainer,
  getDockerContainerLogs,
  getDockerContainerStatus,
  startDockerContainer,
  inspectDockerContainer,
  buildDockerImage
} from '../services/docker.service';
import { cleanAppFiles, getProjectPaths } from '../services/file/project-paths.service';

/**
 * Lógica de negocio para eliminar una app:
 * - Parar contenedor
 * - Eliminar contenedor
 * - Eliminar archivos (zip + carpeta)
 * - Eliminar del registro
 */
export async function removeAppContainer(id: string): Promise<void> {
  const app = getAppById(id);
  if (!app) throw new Error(`App with id ${id} not found.`);

  await stopDockerContainer(app.id);
  await removeDockerContainer(app.id);
  cleanAppFiles(app.id);
  removeApp(app.id);
}

/**
 * Lógica de negocio para obtener el estado de una app
 */
export async function getAppStatus(id: string): Promise<string> {
  const app = getAppById(id);
  if (!app) throw new Error(`App with id ${id} not found.`);

  return await getDockerContainerStatus(app.id);
}

/**
 * Lógica de negocio para obtener logs de una app
 */
export async function getAppLogs(id: string, lines?: number): Promise<string> {
  const app = getAppById(id);
  if (!app) throw new Error(`App with id ${id} not found.`);

  return await getDockerContainerLogs(app.id, lines);
}

/**
 * Lógica de negocio para reiniciar una app
 */
export async function restartAppContainer(id: string): Promise<void> {
  const app = getAppById(id);
  if (!app) throw new Error(`App with id ${id} not found.`);

  await stopDockerContainer(app.id);
  await startDockerContainer(app.id);
}


/**
 * Parar una app sin eliminarla
 */
export async function stopAppContainer(id: string): Promise<void> {
  const app = getAppById(id);
  if (!app) throw new Error(`App with id ${id} not found.`);

  await stopDockerContainer(app.id);
}

/**
 * Arrancar una app parada
 */
export async function startAppContainer(id: string): Promise<void> {
  const app = getAppById(id);
  if (!app) throw new Error(`App with id ${id} not found.`);

  await startDockerContainer(app.id);
}


export async function inspectAppContainer(id: string): Promise<any> {
  const app = getAppById(id);
  if (!app) throw new Error(`App with id ${id} not found.`);

  const inspectData = await inspectDockerContainer(app.id);
  return inspectData[0]; // docker inspect devuelve un array con un solo objeto
}


export function getAppEnv(id: string): Record<string, string> {
  const app = getAppById(id);
  if (!app) throw new Error(`App with id ${id} not found.`);
  return app.env || {};
}

export function updateAppEnvVars(id: string, newEnv: Record<string, string>): void {
  const app = getAppById(id);
  if (!app) throw new Error(`App with id ${id} not found.`);
  updateAppEnv(id, newEnv);
}


export async function rebuildAppContainer(id: string): Promise<void> {
  const app = getAppById(id);
  if (!app) throw new Error(`App with id ${id} not found.`);

  const projectFolderName = app.id.replace('auto-', '');
  const { extractToPath } = getProjectPaths(projectFolderName);

  await buildDockerImage(app.id, extractToPath, true); // true = no-cache
}

