import {exec} from 'child_process';

// Helper para usar exec como Promise
export function execPromise(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(`[exec ERROR] ${stderr}`);
        return reject(stderr);
      }
      resolve(stdout);
    });
  });
}