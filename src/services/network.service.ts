import net from 'net';

export async function findAvailablePort(start = 5433, end = 6000): Promise<number> {
  return new Promise((resolve, reject) => {
    const tryPort = (port: number) => {
      const server = net.createServer();

      server.once('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          if (port < end) {
            tryPort(port + 1);
          } else {
            reject(new Error('No available ports'));
          }
        } else {
          reject(err);
        }
      });

      server.once('listening', () => {
        server.close(() => resolve(port));
      });

      server.listen(port, '0.0.0.0');
    };

    tryPort(start);
  });
}
