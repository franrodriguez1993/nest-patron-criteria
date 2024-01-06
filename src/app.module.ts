import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import helmet from 'helmet';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './App/shared/shared.module';
import { UserModule } from './App/modules/user/user.module';
import { MongoConfigModule } from './database/MongoConfig.module';
import { PetModule } from './App/modules/pet/pet.module';
import { AddressModule } from './App/modules/address/address.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SharedModule,
    UserModule,
    MongoConfigModule,
    PetModule,
    AddressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(helmet()).forRoutes('*');
  }
}
