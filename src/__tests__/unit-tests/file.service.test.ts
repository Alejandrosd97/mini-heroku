import fs from 'fs';
import path from 'path';
import { describe, it, beforeEach, afterEach, expect } from 'vitest';

import { getProjectPaths, cleanAppFiles } from '../../services/file/project-paths.service';

const TEST_PROJECT_NAME = 'test-project';
const TEST_UPLOAD_PATH = path.resolve('uploaded-repos');

describe('file.service', () => {
  const { extractToPath, zipPath } = getProjectPaths(TEST_PROJECT_NAME);

  beforeEach(() => {
    // Simular carpeta descomprimida
    fs.mkdirSync(extractToPath, { recursive: true });
    fs.writeFileSync(path.join(extractToPath, 'index.js'), '// archivo falso');

    // Simular ZIP
    fs.mkdirSync(TEST_UPLOAD_PATH, { recursive: true });
    fs.writeFileSync(zipPath, 'ZIP simulado');
  });

  afterEach(() => {
    if (fs.existsSync(extractToPath)) {
      fs.rmSync(extractToPath, { recursive: true, force: true });
    }

    if (fs.existsSync(zipPath)) {
      fs.rmSync(zipPath);
    }
  });

  it('getProjectPaths should return correct paths', () => {
    const paths = getProjectPaths(TEST_PROJECT_NAME);
    expect(paths.extractToPath).toContain(TEST_PROJECT_NAME);
    expect(paths.zipPath).toContain(`${TEST_PROJECT_NAME}.zip`);
  });

  it('removeProjectFiles should remove zip and folder', () => {
    expect(fs.existsSync(extractToPath)).toBe(true);
    expect(fs.existsSync(zipPath)).toBe(true);

    cleanAppFiles(TEST_PROJECT_NAME);

    expect(fs.existsSync(extractToPath)).toBe(false);
    expect(fs.existsSync(zipPath)).toBe(false);
  });
});
