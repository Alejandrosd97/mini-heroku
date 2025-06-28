import { Request, Response } from 'express';
import { loadRegistry } from '../services/registry/app-registry.service';
import { getAppStatus, getAppLogs, removeAppContainer, startAppContainer, stopAppContainer, inspectAppContainer, getAppEnv, updateAppEnvVars } from '../containers/appContainer';
import { restartAppContainer } from '../containers/appContainer';


export function listAppsHandler(req: Request, res: Response) {
  console.log('ha entredo a listAppsHandler');
  const apps = loadRegistry();
  res.json(apps);
}

export async function getAppStatusHandler(req: Request, res: Response) {
  try {
    const status = await getAppStatus(req.params.id);
    res.json({ id: req.params.id, status });
  } catch (err: any) {
    console.error(`[STATUS ERROR]`, err);
    res.status(404).json({ error: err.message });
  }
}


export async function deleteAppHandler(req: Request, res: Response) {
  try {
    await removeAppContainer(req.params.id);
    res.json({ message: `App ${req.params.id} removed.` });
  } catch (err: any) {
    console.error(`[DELETE ERROR]`, err);
    res.status(404).json({ error: err.message });
  }
}


export async function restartAppHandler(req: Request, res: Response) {
  try {
    await restartAppContainer(req.params.id);
    res.json({ message: `App ${req.params.id} restarted.` });
  } catch (err: any) {
    console.error(`[RESTART ERROR]`, err);
    res.status(404).json({ error: err.message });
  }
}


export async function stopAppHandler(req: Request, res: Response) {
  try {
    await stopAppContainer(req.params.id);
    res.json({ message: `App ${req.params.id} stopped.` });
  } catch (err: any) {
    console.error(`[STOP ERROR]`, err);
    res.status(404).json({ error: err.message });
  }
}

export async function startAppHandler(req: Request, res: Response) {
  try {
    await startAppContainer(req.params.id);
    res.json({ message: `App ${req.params.id} started.` });
  } catch (err: any) {
    console.error(`[START ERROR]`, err);
    res.status(404).json({ error: err.message });
  }
}




