import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

export function configureApp(app: INestApplication) {
  const allowed = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map((v) => v.trim()).filter(Boolean);
  app.setGlobalPrefix('api');
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cookieParser());
  app.enableCors({ origin(origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) { if (!origin || allowed.includes(origin)) return callback(null, true); callback(new Error('Origin not allowed'), false); }, credentials: true, methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','X-CSRF-Token'] });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
}
