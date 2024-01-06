import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { User } from '../user/user.schema';
export type PetDocument = Pet & Document;

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
})
export class Pet {
  @Prop({
    default: () => new Types.ObjectId(),
    type: Types.ObjectId,
  })
  _id: Types.ObjectId;
  @Prop({ required: true })
  name: string;
  @Prop({ default: 0 })
  age: number;
  @Prop({ default: '' })
  pic: string;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  user: User;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
