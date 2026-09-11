import 'dotenv/config';
import mysql from 'mysql2/promise';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

async function main(){
  if(!process.env.DATABASE_URL)throw new Error('กรุณากำหนด DATABASE_URL');
  const ca=process.env.TIDB_CA_BASE64?Buffer.from(process.env.TIDB_CA_BASE64,'base64').toString('utf8'):undefined;
  const connection=await mysql.createConnection({uri:process.env.DATABASE_URL,ssl:{minVersion:'TLSv1.2',rejectUnauthorized:true,...(ca?{ca}:{})},multipleStatements:true});
  for(const file of ['001_initial.sql','002_seed.sql']){const sql=await readFile(resolve(process.cwd(),'database',file),'utf8');await connection.query(sql);console.log(`Applied ${file}`);}
  await connection.end();
}
main().catch((error)=>{console.error(error);process.exit(1);});
