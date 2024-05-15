import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserRequest } from './dto/update-user.request';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './schemas/user.schema';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@ApiTags('users')
@Auth(ValidRoles.USER)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Get all users', type: [User] })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':email')
  findOneByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserRequest: UpdateUserRequest) {
    return this.usersService.update(+id, updateUserRequest);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
