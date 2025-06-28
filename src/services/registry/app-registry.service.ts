import fs from 'fs';
import path from 'path';
import { AppRegistryEntry } from '../../types/types';

export const APP_REGISTRY_PATH = path.resolve('registry', 'apps.json');


export function loadRegistry(): AppRegistryEntry[] {
  if (!fs.existsSync(APP_REGISTRY_PATH)) {
    return [];
  }

  const data = fs.readFileSync(APP_REGISTRY_PATH, 'utf-8');
  try {
    return JSON.parse(data) as AppRegistryEntry[];
  } catch {
    return [];
  }
}

// Save the registry to the file system
// This function will overwrite the existing registry file with the new data
export function saveRegistry(registry: AppRegistryEntry[]): void {
  fs.writeFileSync(APP_REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf-8');
}

// Register a new app in the registry
export function registerApp(newApp: AppRegistryEntry): void {
  const apps = loadRegistry();
  
  const existingIndex = apps.findIndex(app => app.id === newApp.id);
  
  if (existingIndex !== -1) {
    apps[existingIndex] = newApp;
  } else {
    apps.push(newApp);
  }
  
  saveRegistry(apps);
}

export function removeApp(id: string): void {
  let registry = loadRegistry();
  registry = registry.filter(app => app.id !== id);
  saveRegistry(registry);
}

export function getAppById(id: string): AppRegistryEntry | undefined {
  const registry = loadRegistry();
  return registry.find(app => app.id === id);
}

export function updateAppEnv(id: string, newEnv: Record<string, string>): void {
  const apps = loadRegistry();
  const appIndex = apps.findIndex(app => app.id === id);
  if (appIndex === -1) throw new Error(`App with id ${id} not found.`);
  
  apps[appIndex].env = newEnv;

  fs.writeFileSync(APP_REGISTRY_PATH, JSON.stringify(apps, null, 2));
}