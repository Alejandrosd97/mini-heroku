import fs from 'fs';
import path from 'path';

const DB_REGISTRY_PATH = path.resolve('registry', 'databases.json');

export function getDatabases(): any[] {
  if (!fs.existsSync(DB_REGISTRY_PATH)) {
    return [];
  }
  const raw = fs.readFileSync(DB_REGISTRY_PATH, 'utf-8');
  return JSON.parse(raw);
}

export function saveDatabase(db: any): void {
  const dbs = getDatabases();
  dbs.push(db);
  fs.writeFileSync(DB_REGISTRY_PATH, JSON.stringify(dbs, null, 2));
}

export function getDatabaseById(id: string): any | undefined {
  return getDatabases().find((db) => db.id === id);
}

export function removeDatabase(id: string): void {
  const dbs = getDatabases();
  const newDbs = dbs.filter((db) => db.id !== id);
  fs.writeFileSync(DB_REGISTRY_PATH, JSON.stringify(newDbs, null, 2));
}
