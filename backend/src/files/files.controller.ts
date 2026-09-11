import { BadRequestException, Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { GoogleAuth } from 'google-auth-library';
import type { AuthenticatedRequest } from '../common/types';
import { StoreService } from '../store/store.service';

@Controller('files')
export class FilesController{
  constructor(private readonly store:StoreService){}
  @Get()async list(@Query('entityType')entityType?:string,@Query('entityId')entityId?:string){return{items:await this.store.listEvidence(entityType,entityId)};}
  @Post('upload-session')async session(@Body()body:any){
    if(!body.fileName||!body.mimeType||!body.entityType||!body.entityId)throw new BadRequestException('ข้อมูลไฟล์ไม่ครบถ้วน');
    if(Number(body.sizeBytes)>50*1024*1024)throw new BadRequestException('ไฟล์ต้องมีขนาดไม่เกิน 50 MB');
    if(process.env.DEMO_MODE==='true')return{uploadUrl:'demo://upload',expiresInSeconds:3600};
    const raw=process.env.GOOGLE_SERVICE_ACCOUNT_JSON;if(!raw)throw new BadRequestException('ยังไม่ได้ตั้งค่า Google Service Account');
    const settings=await this.store.getSettings();const folderId=settings.driveFolderId||process.env.GOOGLE_DRIVE_FOLDER_ID;if(!folderId)throw new BadRequestException('ยังไม่ได้ตั้งค่าโฟลเดอร์ Google Drive');
    const auth=new GoogleAuth({credentials:JSON.parse(raw),scopes:['https://www.googleapis.com/auth/drive']});const client=await auth.getClient();const token=await client.getAccessToken();
    const response=await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true&fields=id,name,webViewLink',{method:'POST',headers:{Authorization:`Bearer ${token.token}`,'Content-Type':'application/json; charset=UTF-8','X-Upload-Content-Type':body.mimeType,'X-Upload-Content-Length':String(body.sizeBytes)},body:JSON.stringify({name:body.fileName,parents:[folderId],description:`${body.entityType}:${body.entityId}`})});
    if(!response.ok)throw new BadRequestException(`Google Drive ไม่อนุญาตให้สร้าง upload session (${response.status})`);return{uploadUrl:response.headers.get('location'),expiresInSeconds:3600};
  }
  @Post('confirm')async confirm(@Body()body:any,@Req()req:AuthenticatedRequest){if(!body.driveFileId&&!String(body.uploadUrl||'').startsWith('demo://'))throw new BadRequestException('ไม่พบรหัสไฟล์จาก Google Drive');return{item:await this.store.addEvidence({...body,driveFileId:body.driveFileId||`demo-${Date.now()}`},req.user)};}
}
