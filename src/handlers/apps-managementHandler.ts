import { Request, Response } from 'express';
import { getAppEnv, getAppLogs, inspectAppContainer, updateAppEnvVars } from '../containers/appContainer';
import { getAppById } from '../services/registry/app-registry.service';

export async function getAppLogsHandler(req: Request, res: Response) {
  const { id } = req.params;
  const { tail } = req.query;

  const app = getAppById(id);
  if (!app) {
    return res.status(404).json({ message: 'App not found' });
  }

  const tailLines = tail ? parseInt(tail as string, 10) : undefined;

  try {
    const logs = await getAppLogs(app.id, tailLines);
    res.type('text/plain').send(logs);
  } catch (error: any) {
    console.error('[LOGS ERROR]', error);
    res.status(500).json({ message: 'Failed to fetch logs', error: error.message });
  }
}

export async function inspectAppHandler(req: Request, res: Response) {
  try {
    const inspectData = await inspectAppContainer(req.params.id);
    res.json(inspectData);
  } catch (err: any) {
    console.error(`[INSPECT ERROR]`, err);
    res.status(404).json({ error: err.message });
  }
}


export function getAppEnvHandler(req: Request, res: Response) {
  try {
    const env = getAppEnv(req.params.id);
    res.json(env);
  } catch (err: any) {
    console.error(`[GET ENV ERROR]`, err);
    res.status(404).json({ error: err.message });
  }
}

export function updateAppEnvHandler(req: Request, res: Response) {
  try {
    const newEnv = req.body as Record<string, string>;
    updateAppEnvVars(req.params.id, newEnv);
    res.json({ message: `Env updated for app ${req.params.id}.` });
  } catch (err: any) {
    console.error(`[UPDATE ENV ERROR]`, err);
    res.status(404).json({ error: err.message });
  }
}