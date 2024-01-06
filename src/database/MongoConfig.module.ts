import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    }),
  ],
  controllers: [],
  providers: [],
})
export class MongoConfigModule {}
