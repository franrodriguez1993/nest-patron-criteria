import { Controller, Post, Body, Req } from '@nestjs/common';
import { AddressService } from './address.service';
import { Request } from 'express';
import { AddressDto } from './address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(@Req() req: Request, @Body() createAddressDto: AddressDto) {
    return this.addressService.create(req, createAddressDto);
  }
}
