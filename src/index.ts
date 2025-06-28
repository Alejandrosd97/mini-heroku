import express from 'express';
import {uploadRouter} from './routes/upload.routes';
import { appsRouter } from './routes/apps.routes';

export const app = express();
const port = 3000;

app.use('/upload', uploadRouter)
app.use('/', appsRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
