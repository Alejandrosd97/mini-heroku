import fs from 'fs';
import path from 'path';
import { execPromise } from './exec.service';


// GENERAR DOCKERFILE Y .DOCKERIGNORE SI NO EXISTEN
export function generateDockerfileAndDockerignore(projectPath: string): void {
  const dockerfilePath = path.join(projectPath, 'Dockerfile');
  const dockerignorePath = path.join(projectPath, '.dockerignore');
  const packageJsonPath = path.join(projectPath, 'package.json');

  // Si no hay Dockerfile pero sí package.json → generar
  if (!fs.existsSync(dockerfilePath) && fs.existsSync(packageJsonPath)) {
    const generatedDockerfile = `
        FROM node:18
        WORKDIR /app
        COPY package.json ./
        RUN npm install
        COPY . .
        EXPOSE 3000
        CMD ["npm", "start"]
    `.trim();

    fs.writeFileSync(dockerfilePath, generatedDockerfile);
    console.log(`[Dockerfile] generado en ${dockerfilePath}`);
  }

  // Generar .dockerignore si no existe
  if (!fs.existsSync(dockerignorePath)) {
    const generatedDockerignore = `
        node_modules
        npm-debug.log
        .git
        .gitignore
        .env
        Dockerfile
        .dockerignore
        *.zip
        uploaded-repos
    `.trim();

    fs.writeFileSync(dockerignorePath, generatedDockerignore);
    console.log(`[.dockerignore] generado en ${dockerignorePath}`);
  }
}

// BUILD DE LA IMAGEN DOCKER
export async function buildDockerImage(imageName: string, contextPath: string, noCache = false): Promise<void> {
  const args = [`-t ${imageName}`];
  if (noCache) {
    args.push('--no-cache');
  }
  args.push(contextPath);

  const cmd = `docker build ${args.join(' ')}`;
  console.log(`[DOCKER BUILD] ${cmd}`);
  await execPromise(cmd);
}


// LANZAR CONTENEDOR DOCKER
export async function runDockerContainer(containerName: string, imageName: string, extraArgs: string[] = []): Promise<void> {
  const cmd = [
    'docker run -d',
    `--name ${containerName}`,
    ...extraArgs,
    imageName
  ].join(' ');

  console.log(`[DOCKER RUN] ${cmd}`);
  await execPromise(cmd);
}

// 🚀 Genérico: parar un contenedor
export async function stopDockerContainer(containerName: string): Promise<void> {
  const cmd = `docker stop ${containerName}`;
  console.log(`[DOCKER STOP] ${cmd}`);
  await execPromise(cmd);
}

// 🚀 Genérico: eliminar un contenedor
export async function removeDockerContainer(containerName: string): Promise<void> {
  const cmd = `docker rm ${containerName}`;
  console.log(`[DOCKER RM] ${cmd}`);
  await execPromise(cmd);
}

// DEVULEVE LOS LOGS DE UN CONTENEDOR
export async function getDockerContainerLogs(containerName: string, lines?: number): Promise<string> {
  const linesArg = lines ? `--tail ${lines}` : '';
  const cmd = `docker logs ${linesArg} ${containerName}`;
  console.log(`[DOCKER LOGS] ${cmd}`);
  return await execPromise(cmd);
}

// DEVUELVE EL STATUS DE UN CONTENEDOR
export async function getDockerContainerStatus(containerName: string): Promise<string> {
  const cmd = `docker ps -a --filter "name=${containerName}" --format "{{.State}}"`;
  console.log(`[DOCKER STATUS] ${cmd}`);
  
  const output = await execPromise(cmd);

  if (!output) {
    return 'not found';
  }

  return output.trim(); // 'running' | 'exited' | ...
}

// INICIA UN CONTENEDOR DETENIDO
export async function startDockerContainer(containerName: string): Promise<void> {
  const cmd = `docker start ${containerName}`;
  console.log(`[DOCKER START] ${cmd}`);
  await execPromise(cmd);
}

// INSPECCIONA UN CONTENEDOR Y DEVUELVE SU INFORMACIÓN
export async function inspectDockerContainer(containerName: string): Promise<any> {
  const cmd = `docker inspect ${containerName}`;
  console.log(`[DOCKER INSPECT] ${cmd}`);
  const output = await execPromise(cmd);
  return JSON.parse(output); // devuelve un array con la info
}






