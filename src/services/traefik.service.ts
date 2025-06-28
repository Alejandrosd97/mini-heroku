import { runDockerContainer } from './docker.service';
import { execPromise } from './exec.service';

// 🚀 Lanzar una app con Traefik (subdominio)
export async function runAppWithTraefik(appName: string, imageName: string, subdomain: string): Promise<void> {
  const containerName = `auto-${appName}`;
  
  const labels = [
    `-l traefik.enable=true`,
    `-l traefik.http.routers.${containerName}.rule=Host("${subdomain}.localhost")`,
    `-l traefik.http.services.${containerName}.loadbalancer.server.port=3000`
  ];

  const args = [
    '--network traefik',
    ...labels
  ];

  await runDockerContainer(containerName, imageName, args);
}

// 🚀 Lanzar Traefik (con docker compose)
export async function runTraefik(): Promise<void> {
  const cmd = `docker compose up -d traefik`;
  console.log(`[DOCKER COMPOSE] ${cmd}`);
  await execPromise(cmd);
}
