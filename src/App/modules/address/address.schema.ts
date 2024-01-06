import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { User } from '../user/user.schema';
export type AddressDocument = Address & Document;

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
})
export class Address {
  @Prop({
    default: () => new Types.ObjectId(),
    type: Types.ObjectId,
  })
  _id: Types.ObjectId;
  @Prop({ required: true })
  street: string;
  @Prop({ default: 0 })
  number: number;
  @Prop({ required: true })
  city: string;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  user: User;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
