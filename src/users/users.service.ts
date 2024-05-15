import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';
import { SignUpRequest } from 'src/auth/dto';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(signUpRequest: SignUpRequest): Promise<User> {
    try {
      const { password, ...userData } = signUpRequest;

      const newUser = new this.userModel({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await newUser.save();
      const { password: _, ...user } = newUser.toJSON();

      return user;
    } catch (error) {
      throw new BadRequestException('El email ya está en uso');
    }
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findOneByEmail(email: string) {
    try {
      return await this.userModel.findOne({ email });
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar el usuario');
    }
  }

  async findUserById(id: string) {
    const user = await this.userModel.findById(id);
    const { password, ...userData } = user.toJSON();

    return userData;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async addOrder(userId: string, orderId: string) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      user.ordersIds.push(orderId);
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException('Error al agregar la orden al usuario');
    }
  }
}
