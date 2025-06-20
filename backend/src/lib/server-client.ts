import { env } from './env';
import { parsePublicEnv } from '@design-app/client/src/lib/parse-public-env';
import express, { type Express } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { logger } from './logger';

const checkFileExists = async (filePath: string) => {
  return await fs
    .access(filePath, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
};

const findClientDistDir = async (dir: string): Promise<string | null> => {
  const maybeClientDistDir = path.resolve(dir, 'client/dist');
  if (await checkFileExists(maybeClientDistDir)) {
    return maybeClientDistDir;
  }
  if (dir === '/') {
    return null;
  }
  return await findClientDistDir(path.dirname(dir));
};

export const applyServeClient = async (expressApp: Express) => {
  const clientDistDir = await findClientDistDir(__dirname);
  if (!clientDistDir) {
    if (env.HOST_ENV === 'production') {
      throw new Error('Client dist dir not found');
    } else {
      logger.error('client-serve', 'Client dist dir not found');
      return;
    }
  }

  const htmlSource = await fs.readFile(path.resolve(clientDistDir, 'index.html'), 'utf8');
  // eslint-disable-next-line node/no-process-env
  const publicEnv = parsePublicEnv(process.env);
  const htmlSourceWithEnv = htmlSource.replace('{ replaceMeWithPublicEnv: true }', JSON.stringify(publicEnv, null, 2));

  expressApp.use(express.static(clientDistDir, { index: false }));
  expressApp.get('/*', (req, res) => {
    res.send(htmlSourceWithEnv);
  });
};
