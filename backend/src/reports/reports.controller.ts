import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { StoreService } from '../store/store.service';
import { Roles } from '../auth/roles';

function csvCell(value:unknown){let text=value==null?'':typeof value==='object'?JSON.stringify(value):String(value);if(/^[=+\-@]/.test(text))text=`'${text}`;return `"${text.replace(/"/g,'""')}"`;}
@Controller('reports')
export class ReportsController{
  constructor(private readonly store:StoreService){}
  @Get('summary')summary(){return this.store.reportSummary();}
  @Roles('DIRECTOR','COMMITTEE','DAI_EM','AUDITOR','SECURITY')
  @Get('export/:type')async export(@Param('type')type:string,@Res()res:Response){const rows=await this.store.reportData(type);const headers=Array.from(new Set(rows.flatMap((row:any)=>Object.keys(row))));const csv='\uFEFF'+[headers.map(csvCell).join(','),...rows.map((row:any)=>headers.map(h=>csvCell(row[h])).join(','))].join('\r\n');res.setHeader('Content-Type','text/csv; charset=utf-8');res.setHeader('Content-Disposition',`attachment; filename="psuwit-${type}-${new Date().toISOString().slice(0,10)}.csv"`);res.send(csv);}
}
