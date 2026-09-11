import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/bootstrap';

const server = express();
let ready: Promise<void> | undefined;
async function initialize() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), { logger: ['error','warn','log'] });
  configureApp(app);
  await app.init();
}
export default async function handler(req: express.Request, res: express.Response) {
  ready ||= initialize();
  await ready;
  return server(req, res);
}
