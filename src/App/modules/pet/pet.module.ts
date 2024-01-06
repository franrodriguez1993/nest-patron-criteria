import { Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import { SharedModule } from 'src/App/shared/shared.module';
import { Pet, PetSchema } from './pet.schema';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Pet.name,
        schema: PetSchema,
      },
    ]),
  ],
  controllers: [PetController],
  providers: [PetService],
})
export class PetModule {}
