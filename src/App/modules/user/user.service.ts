import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { Auth0Service } from 'src/App/shared/auth0.service';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { userCriteria } from './user.criteria';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly auth0Service: Auth0Service,
  ) {}

  /**
  POST
  **/
  async registerUser(req: Request) {
    const userInfo = await this.auth0Service.getUserInfo(req);

    //check if exists:
    const checkUser = await this.findUserByMail(userInfo.data.email);
    if (checkUser) throw new BadRequestException('User already exists');

    return await this.userModel.create({
      email: userInfo.data.email,
      firstName: userInfo.data.given_name,
      lastName: userInfo.data.family_name,
      auth0Id: this.auth0Service.getAuth0Id(req),
      profilePic: userInfo.data.picture,
    });
  }

  async loginUser(req: Request) {
    const auth0Id = this.auth0Service.getAuth0Id(req);
    const user = await this.userModel.findOne({ auth0Id }).lean().exec();
    if (!user) throw new BadRequestException('Invalid credential');
    delete user.auth0Id;
    return user;
  }

  /**
  GET
  **/
  async findUserByMail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async findUserByCriteria(
    criteria: userCriteria,
    populate: PopulateOptions | (PopulateOptions | string)[] = null,
  ) {
    if (Object.keys(criteria).length === 0)
      throw new InternalServerErrorException('Invalid criteria');
    return await this.userModel
      .findOne(criteria)
      .populate(populate)
      .lean()
      .exec();
  }

  // async findUserByCriteria(criteria: userCriteria, populate: boolean = true) {
  //   if (Object.keys(criteria).length === 0)
  //     throw new InternalServerErrorException('Invalid criteria');

  //   return await this.userModel
  //     .findOne(criteria)
  //     .populate(populate ? ['pets', 'address'] : '')
  //     .lean()
  //     .exec();
  // }

  /**
  UPDATE 
  **/
  async addPet(auth0Id: string, petId: string) {
    return await this.userModel.updateOne(
      { auth0Id: auth0Id },
      { $addToSet: { pets: petId } },
    );
  }

  async addAddress(auth0Id: string, addressId: string) {
    return await this.userModel.updateOne(
      { auth0Id: auth0Id },
      { address: addressId },
    );
  }
}
