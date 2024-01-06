import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetDto } from './pet.dto';
import { Request } from 'express';
import { AuthorizationGuard } from 'src/App/shared/guards/authorization.guard';

@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @UseGuards(AuthorizationGuard)
  @Post()
  create(@Req() req: Request, @Body() createPetDto: PetDto) {
    return this.petService.create(req, createPetDto);
  }

  // @Get()
  // findAll() {
  //   return this.petService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.petService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto) {
  //   return this.petService.update(+id, updatePetDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.petService.remove(+id);
  // }
}
