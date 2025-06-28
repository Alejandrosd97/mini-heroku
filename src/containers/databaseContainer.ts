import { runDockerContainer, stopDockerContainer, removeDockerContainer } from '../services/docker.service';
import { saveDatabase, getDatabases, getDatabaseById, removeDatabase } from '../services/registry/databse-registry.service';
import { DatabaseRegistryEntry } from '../types/types';


export async function createDatabaseContainer(): Promise<DatabaseRegistryEntry> {
  const dbId = `pg-db-${Date.now()}`;
  const image = 'postgres:15';

  const user = 'myuser';
  const password = 'mypass';
  const dbname = 'mydb';
  const port = 5433 + Math.floor(Math.random() * 100); // avoid conflicts

  const args = [
    `-e POSTGRES_USER=${user}`,
    `-e POSTGRES_PASSWORD=${password}`,
    `-e POSTGRES_DB=${dbname}`,
    `-p ${port}:5432`,
    `--name ${dbId}`
  ];

  await runDockerContainer(dbId, image, args);

  const dbData = {
    id: dbId,
    host: 'localhost',
    port,
    user,
    password,
    dbname
  };

  saveDatabase(dbData);

  return dbData;
}

export function listDatabases(): any[] {
  return getDatabases();
}

export async function removeDatabaseContainer(id: string): Promise<void> {
  const db = getDatabaseById(id);
  if (!db) throw new Error(`Database ${id} not found.`);

  await stopDockerContainer(db.id);
  await removeDockerContainer(db.id);
  removeDatabase(db.id);
}
