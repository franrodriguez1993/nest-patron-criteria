import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Pet } from '../pet/pet.schema';
import { Address } from '../address/address.schema';
export type UserDocument = User & Document;

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
})
export class User {
  @Prop({ default: '' })
  firstName: string;
  @Prop({ default: '' })
  lastName: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ unique: true })
  auth0Id: string;
  @Prop({ default: '' })
  profilePic: string;
  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Pet' }], default: [] })
  pets: Pet[];
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Address' })
  address: Address;
}

export const UserSchema = SchemaFactory.createForClass(User);
