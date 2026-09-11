import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import type { AuthenticatedRequest } from '../common/types';
import { StoreService } from '../store/store.service';
import { Roles } from '../auth/roles';

@Controller()
export class GovernanceController {
  constructor(private readonly store:StoreService){}
  @Get('health') health(){return{status:'ok',service:'PSUWIT Digital Governance',time:new Date().toISOString()};}
  @Get('dashboard') dashboard(){return this.store.dashboard();}
  @Get('requests') async requests(){return{items:await this.store.listRequests()};}
  @Get('requests/:id') async request(@Param('id')id:string){return{item:await this.store.getRequest(id)};}
  @Post('requests') async createRequest(@Body()body:any,@Req()req:AuthenticatedRequest){return{item:await this.store.createRequest(body,req.user)};}
  @Post('requests/:id/timeline') async timeline(@Param('id')id:string,@Body()body:any,@Req()req:AuthenticatedRequest){return{item:await this.store.addTimeline(id,body,req.user)};}
  @Roles('DIRECTOR','COMMITTEE','DAI_EM','DEPARTMENT_HEAD','DATA_OWNER','SYSTEM_OWNER','SECURITY')
  @Post('requests/:id/decision') async decision(@Param('id')id:string,@Body()body:any,@Req()req:AuthenticatedRequest){return{item:await this.store.decideRequest(id,body,req.user)};}
  @Get('registers') async registers(@Query('category')category?:string){return{items:await this.store.listRegisters(category)};}
  @Roles('DIRECTOR','COMMITTEE','DAI_EM','DATA_OWNER','SYSTEM_OWNER','SECURITY')
  @Post('registers') async createRegister(@Body()body:any,@Req()req:AuthenticatedRequest){return{item:await this.store.createRegister(body,req.user)};}
  @Roles('DIRECTOR','COMMITTEE','DAI_EM','DATA_OWNER','SYSTEM_OWNER','SECURITY')
  @Patch('registers/:id') async updateRegister(@Param('id')id:string,@Body()body:any,@Req()req:AuthenticatedRequest){return{item:await this.store.updateRegister(id,body,req.user)};}
  @Get('risks') async risks(){return{items:await this.store.listRisks()};}
  @Roles('DIRECTOR','COMMITTEE','DAI_EM','DEPARTMENT_HEAD','DATA_OWNER','SYSTEM_OWNER','SECURITY')
  @Post('risks') async createRisk(@Body()body:any,@Req()req:AuthenticatedRequest){return{item:await this.store.createRisk(body,req.user)};}
  @Roles('DIRECTOR','COMMITTEE','DAI_EM','DEPARTMENT_HEAD','DATA_OWNER','SYSTEM_OWNER','SECURITY')
  @Patch('risks/:id') async updateRisk(@Param('id')id:string,@Body()body:any,@Req()req:AuthenticatedRequest){return{item:await this.store.updateRisk(id,body,req.user)};}
  @Get('incidents') async incidents(){return{items:await this.store.listIncidents()};}
  @Post('incidents') async createIncident(@Body()body:any,@Req()req:AuthenticatedRequest){return{item:await this.store.createIncident(body,req.user)};}
  @Roles('DIRECTOR','COMMITTEE','DAI_EM','SECURITY','SYSTEM_OWNER')
  @Patch('incidents/:id') async updateIncident(@Param('id')id:string,@Body()body:any,@Req()req:AuthenticatedRequest){return{item:await this.store.updateIncident(id,body,req.user)};}
}
