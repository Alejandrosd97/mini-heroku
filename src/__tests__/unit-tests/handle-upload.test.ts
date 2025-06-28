import { describe, it, expect, vi } from 'vitest';
import { handleUpload } from '../../services/upload.service';
import * as zipService from '../../services/file/zip.service';
import * as dockerService from '../../services/docker.service';
import * as registry from '../../services/registry/app-registry.service';

describe('upload.service', () => {
  it('should process upload and return deployment info', async () => {
    const mockFile = {
      originalname: 'test-app.zip',
      filename: 'test-app.zip',
      path: '/fake/path/test-app.zip'
    } as Express.Multer.File;

    // Mocks
    vi.spyOn(zipService, 'extractZipFromFile').mockResolvedValue('/fake/project');
    vi.spyOn(dockerService, 'generateDockerfileAndDockerignore').mockImplementation(() => {});
    vi.spyOn(dockerService, 'buildDockerImage').mockResolvedValue();
    vi.spyOn(dockerService, 'runDockerContainer').mockResolvedValue();
    vi.spyOn(registry, 'registerApp').mockImplementation(() => {});

    const result = await handleUpload(mockFile);

    expect(result).toHaveProperty('url');
    expect(result).toHaveProperty('id');
  });
});
