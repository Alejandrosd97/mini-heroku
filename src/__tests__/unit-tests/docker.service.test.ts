import { describe, it, expect, vi } from 'vitest';
import { execPromise } from '../../services/exec.service';
import { findAvailablePort } from '../../services/network.service';
import { buildDockerImage, runDockerContainer } from '../../services/docker.service';
import * as execService from '../../services/exec.service';


describe('docker.service', () => {
  it('should run execPromise', async () => {
    const result = await execPromise('echo HelloTest');
    expect(result.trim()).toBe('HelloTest');
  });

  it('should find an available port', async () => {
    const port = await findAvailablePort();
    console.log('Found port:', port);
    expect(typeof port).toBe('number');
    expect(port).toBeGreaterThan(1024);
  });

  describe('buildDockerImage', () => {
  it('should build docker image with default options', async () => {
    const mock = vi.spyOn(execService, 'execPromise').mockResolvedValue('ok');

    await buildDockerImage('my-image', '/path/to/project');

    expect(mock).toHaveBeenCalledWith('docker build -t my-image /path/to/project');
    mock.mockRestore();
  });

  it('should build docker image with --no-cache', async () => {
    const mock = vi.spyOn(execService, 'execPromise').mockResolvedValue('ok');

    await buildDockerImage('my-image', '/path/to/project', true);

    expect(mock).toHaveBeenCalledWith('docker build -t my-image --no-cache /path/to/project');
    mock.mockRestore();
  });
});

  describe('runDockerContainer', () => {
  it('should run container with given name and image', async () => {
    const mock = vi.spyOn(execService, 'execPromise').mockResolvedValue('ok');

    await runDockerContainer('my-container', 'my-image');

    expect(mock).toHaveBeenCalledWith(
      'docker run -d --name my-container my-image'
    );
    mock.mockRestore();
  });

  it('should run container with extra docker args', async () => {
    const mock = vi.spyOn(execService, 'execPromise').mockResolvedValue('ok');

    await runDockerContainer('my-container', 'my-image', ['-p 3000:3000', '--env VAR=value']);

    expect(mock).toHaveBeenCalledWith(
      'docker run -d --name my-container -p 3000:3000 --env VAR=value my-image'
    );
    mock.mockRestore();
  });
});
});
