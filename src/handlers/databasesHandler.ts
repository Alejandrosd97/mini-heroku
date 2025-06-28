import { Request, Response } from 'express';
import { createDatabaseContainer, listDatabases, removeDatabaseContainer } from '../containers/databaseContainer';

export async function createDatabaseHandler(req: Request, res: Response) {
  try {
    const dbData = await createDatabaseContainer();
    res.status(200).json(dbData);
  } catch (err: any) {
    console.error(`[CREATE DB ERROR]`, err);
    res.status(500).json({ error: 'Failed to create database' });
  }
}

export function listDatabasesHandler(req: Request, res: Response) {
  const dbs = listDatabases();
  res.json(dbs);
}

export async function deleteDatabaseHandler(req: Request, res: Response) {
  try {
    await removeDatabaseContainer(req.params.id);
    res.json({ message: `Database ${req.params.id} removed.` });
  } catch (err: any) {
    console.error(`[DELETE DB ERROR]`, err);
    res.status(404).json({ error: err.message });
  }
}
