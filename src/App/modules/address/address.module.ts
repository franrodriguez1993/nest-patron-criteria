import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { SharedModule } from 'src/App/shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, AddressSchema } from './address.schema';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Address.name,
        schema: AddressSchema,
      },
    ]),
  ],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
