import { Router } from 'express';
import {
  listAppsHandler,
  getAppStatusHandler,
  deleteAppHandler,
  restartAppHandler,
  stopAppHandler,
  startAppHandler,
} from '../handlers/appsHandler';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getAppEnvHandler, getAppLogsHandler, inspectAppHandler, updateAppEnvHandler } from '../handlers/apps-managementHandler';



const router = Router();

// router.use(authMiddleware);
// Uncomment the line above to enable authentication middleware for all routes
router.get('/apps', listAppsHandler);
router.get('/apps/:id/status', getAppStatusHandler);
router.get('/apps/:id/logs', getAppLogsHandler);
router.get('/apps/:id/inspect', inspectAppHandler);
router.get('/apps/:id/env', getAppEnvHandler);
router.post('/apps/:id/env', updateAppEnvHandler);
router.post('/apps/:id/restart', restartAppHandler);
router.delete('/apps/:id', deleteAppHandler);
router.post('/apps/:id/stop', stopAppHandler);
router.post('/apps/:id/start', startAppHandler);

export { router as appsRouter };
