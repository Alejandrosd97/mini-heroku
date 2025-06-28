import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../../index';
import path from 'path';
import * as dockerService from '../../services/docker.service';
import * as registryService from '../../services/registry/app-registry.service';


vi.mock('../services/docker.service');
vi.mock('../services/registry/app-registry.service');

describe('POST /upload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should upload and register app', async () => {
    const testZipPath = path.resolve('test-assets', 'example.zip');

    // Mock funciones críticas
    vi.spyOn(dockerService, 'buildDockerImage').mockResolvedValue();
    vi.spyOn(dockerService, 'runDockerContainer').mockResolvedValue();
    vi.spyOn(registryService, 'registerApp').mockImplementation(() => {});

    const res = await request(app)
      .post('/upload')
      .attach('repo', testZipPath);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('url');
    expect(res.body).toHaveProperty('id');
    expect(dockerService.buildDockerImage).toHaveBeenCalled();
    expect(dockerService.runDockerContainer).toHaveBeenCalled();
    expect(registryService.registerApp).toHaveBeenCalled();
  });
});
