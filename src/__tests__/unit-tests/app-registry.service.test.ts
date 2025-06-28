import fs from 'fs';
import path from 'path';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';

import {
  saveRegistry,
  loadRegistry,
  getAppById,
  removeApp
} from '../../services/registry/app-registry.service';

import { AppRegistryEntry } from '../../types/types';

const TEST_REGISTRY_PATH = path.join('registry', 'apps.test.json');

// 🧠 Mockeamos la ruta para usar un archivo temporal en lugar del real
vi.mock('../../../services/registry/app-registry.service', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../../services/registry/app-registry.service')>();
  return {
    ...mod,
    REGISTRY_PATH: TEST_REGISTRY_PATH
  };
});

// 🧪 App de ejemplo adaptada a tu tipo actual
const sampleApp: AppRegistryEntry = {
  id: 'test-123',
  subdomain: 'my-test-app',
  url: 'https://my-test-app.localhost',
  env: {
    DATABASE_URL: 'postgres://user:pass@localhost/db'
  }
};

describe('app-registry.service', () => {
  beforeEach(() => {
    fs.writeFileSync(TEST_REGISTRY_PATH, JSON.stringify([], null, 2));
  });

  afterEach(() => {
    if (fs.existsSync(TEST_REGISTRY_PATH)) {
      fs.rmSync(TEST_REGISTRY_PATH);
    }
  });

  it('should save and load registry', () => {
    saveRegistry([sampleApp]);
    const registry = loadRegistry();
    expect(registry).toHaveLength(1);
    expect(registry[0].subdomain).toBe(sampleApp.subdomain);
    expect(registry[0].env).toHaveProperty('DATABASE_URL');
  });

  it('should get app by id', () => {
    saveRegistry([sampleApp]);
    const app = getAppById('test-123');
    expect(app).toBeDefined();
    expect(app?.url).toBe(sampleApp.url);
  });

  it('should remove app by id', () => {
    saveRegistry([sampleApp]);
    removeApp('test-123');
    const registry = loadRegistry();
    expect(registry).toHaveLength(0);
  });
});
