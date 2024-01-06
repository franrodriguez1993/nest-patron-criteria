import { Injectable } from '@nestjs/common';
import { AddressDto } from './address.dto';
import { UserService } from '../user/user.service';
import { Model } from 'mongoose';
import { Address, AddressDocument } from './address.schema';
import { Auth0Service } from 'src/App/shared/auth0.service';
import { ModuleRef } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';

@Injectable()
export class AddressService {
  private userService: UserService;
  constructor(
    @InjectModel(Address.name) private addressModel: Model<AddressDocument>,
    private readonly auth0Service: Auth0Service,
    private readonly moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.userService = this.moduleRef.get(UserService, { strict: false });
  }
  async create(req: Request, createAddressDto: AddressDto) {
    const auth0Id = this.auth0Service.getAuth0Id(req);
    const user = await this.userService.findUserByCriteria({ auth0Id });

    const address = await this.addressModel.create({
      ...createAddressDto,
      user: user._id,
    });

    await this.userService.addAddress(auth0Id, address._id.toString());
    return address;
  }
}
