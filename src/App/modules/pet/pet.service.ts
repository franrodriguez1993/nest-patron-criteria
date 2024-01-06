import { Injectable, OnModuleInit } from '@nestjs/common';
import { PetDto } from './pet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pet, PetDocument } from './pet.schema';
import { Model } from 'mongoose';
import { Auth0Service } from 'src/App/shared/auth0.service';
import { UserService } from '../user/user.service';
import { ModuleRef } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class PetService implements OnModuleInit {
  private userService: UserService;
  constructor(
    @InjectModel(Pet.name) private petModel: Model<PetDocument>,
    private readonly auth0Service: Auth0Service,
    private readonly moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.userService = this.moduleRef.get(UserService, { strict: false });
  }

  /**
  POST
  **/

  async create(req: Request, petDto: PetDto) {
    const auth0Id = this.auth0Service.getAuth0Id(req);
    const user = await this.userService.findUserByCriteria({ auth0Id });

    const newPet = await this.petModel.create({ ...petDto, user: user._id });
    await this.userService.addPet(auth0Id, newPet._id.toString());
    return newPet;
  }

  findAll() {
    return `This action returns all pet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pet`;
  }

  remove(id: number) {
    return `This action removes a #${id} pet`;
  }
}
