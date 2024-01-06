import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Auth0Service } from './auth0.service';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [Auth0Service],
  exports: [Auth0Service],
})
export class SharedModule {}
