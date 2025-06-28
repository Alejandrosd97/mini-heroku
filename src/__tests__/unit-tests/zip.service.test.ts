import fs from 'fs';
import path from 'path';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { extractZipFromFile } from '../../services/file/zip.service';

const TEST_UPLOAD_FOLDER = path.resolve('uploaded-repos');
const TEST_ZIP_FILE = path.resolve('test-assets', 'example.zip');

describe('zip.service', () => {
  beforeEach(() => {
    if (!fs.existsSync(TEST_UPLOAD_FOLDER)) {
      fs.mkdirSync(TEST_UPLOAD_FOLDER, { recursive: true });
    }
  });

  afterEach(() => {
    // Limpiar carpeta después del test
    const extractedPath = path.resolve(TEST_UPLOAD_FOLDER, 'example');
    if (fs.existsSync(extractedPath)) {
      fs.rmSync(extractedPath, { recursive: true, force: true });
    }
  });

  it('should extract zip file', async() => {
    // Simulamos un Multer.File
    const fakeFile = {
      originalname: 'example.zip',
      filename: 'example.zip',
      path: TEST_ZIP_FILE
    } as Express.Multer.File;

    const outputPath = await extractZipFromFile(fakeFile);

    expect(fs.existsSync(outputPath)).toBe(true);
    expect(fs.readdirSync(outputPath).length).toBeGreaterThan(0);
  });
});
