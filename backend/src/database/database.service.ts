import { Injectable, OnModuleDestroy } from '@nestjs/common';
import mysql, { Pool } from 'mysql2/promise';

function camel(key: string) { return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase()); }
function mapRow(row: Record<string, unknown>) { return Object.fromEntries(Object.entries(row).map(([k,v]) => [camel(k), v])); }

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private pool?: Pool;
  enabled() { return Boolean(process.env.DATABASE_URL) && process.env.DEMO_MODE !== 'true'; }
  private getPool() {
    if (!this.enabled()) throw new Error('DATABASE_URL is required when DEMO_MODE is false');
    if (!this.pool) {
      const ca = process.env.TIDB_CA_BASE64 ? Buffer.from(process.env.TIDB_CA_BASE64, 'base64').toString('utf8') : undefined;
      this.pool = mysql.createPool({ uri:process.env.DATABASE_URL!, connectionLimit:5, enableKeepAlive:true, ssl:{ minVersion:'TLSv1.2', rejectUnauthorized:true, ...(ca?{ca}:{}) }, dateStrings:true });
    }
    return this.pool;
  }
  async query<T=Record<string,unknown>>(sql: string, params: any[] = []): Promise<T[]> {
    const [rows] = await this.getPool().query(sql, params);
    return (Array.isArray(rows) ? rows : []) .map((row) => mapRow(row as Record<string,unknown>) as T);
  }
  async execute(sql: string, params: any[] = []) { const [result] = await this.getPool().execute(sql, params); return result; }
  async onModuleDestroy() { await this.pool?.end(); }
}
