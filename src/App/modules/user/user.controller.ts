import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { AuthorizationGuard } from 'src/App/shared/guards/authorization.guard';

@Controller('user')
@UseGuards(AuthorizationGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  register(@Req() req: Request) {
    return this.userService.registerUser(req);
  }

  @Post('/login')
  login(@Req() req: Request) {
    return this.userService.loginUser(req);
  }

  @Get('/hardcoded')
  findOneHardcoded() {
    return this.userService.findUserByCriteria(
      {
        _id: '659324696178c67191ebbeda',
        // address: '6596b01ddbd6b8e227a6d575',
      },
      ['pets', 'address'],
    );
  }
  @Get('/:id')
  findOneById(@Param('id') id: string) {
    return this.userService.findUserByCriteria(
      {
        _id: id,
        // address: '6596b01ddbd6b8e227a6d575',
      },
      ['address'],
    );
  }

  @Get('/query/search')
  findOneWithQueryParams(
    @Query('firstName') firstName: string,
    @Query('lastName') lastName: string,
    @Query('address') address: string,
  ) {
    let criteria = {};

    if (firstName) criteria = { ...criteria, firstName };
    if (lastName) criteria = { ...criteria, lastName };
    if (address) criteria = { ...criteria, address };

    return this.userService.findUserByCriteria(criteria, ['pets', 'address']);
  }
}
