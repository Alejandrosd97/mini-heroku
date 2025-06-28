import { describe, it, expect } from 'vitest';
import { loadRegistry, registerApp } from '../../services/registry/app-registry.service';
import { beforeEach } from 'node:test';
import fs from 'fs';
import { APP_REGISTRY_PATH } from '../../services/registry/app-registry.service';


describe('registry service', () => {
    beforeEach(() => {
    // Si no existe, crea el archivo vacío
    if (!fs.existsSync('registry')) {
      fs.mkdirSync('registry', { recursive: true });
    }
    fs.writeFileSync(APP_REGISTRY_PATH, '[]', 'utf-8');
  });
  it('should register and load app', () => {
    const app = {
      id: 'test-app',
      subdomain: 'test',
      url: 'http://test.localhost',
      env: {}
    };

    registerApp(app);
    const apps = loadRegistry();

    expect(apps).toContainEqual(app);
  });
});
