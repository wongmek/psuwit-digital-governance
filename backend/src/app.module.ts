import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseService } from './database/database.service';
import { StoreService } from './store/store.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthGuard } from './auth/auth.guard';
import { CsrfGuard } from './auth/csrf.guard';
import { RolesGuard } from './auth/roles.guard';
import { GovernanceController } from './governance/governance.controller';
import { AdminController } from './admin/admin.controller';
import { ReportsController } from './reports/reports.controller';
import { FilesController } from './files/files.controller';

@Module({
  imports:[ConfigModule.forRoot({isGlobal:true})],
  controllers:[AuthController,GovernanceController,AdminController,ReportsController,FilesController],
  providers:[DatabaseService,StoreService,AuthService,{provide:APP_GUARD,useClass:AuthGuard},{provide:APP_GUARD,useClass:CsrfGuard},{provide:APP_GUARD,useClass:RolesGuard}],
})
export class AppModule{}
