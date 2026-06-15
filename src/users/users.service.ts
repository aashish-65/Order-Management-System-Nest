import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (user) {
      return { message: 'User with email already exists' };
    }

    let newUser = this.userRepository.create(createUserDto);

    newUser = await this.userRepository.save(newUser);

    return { message: 'User created successfully.', data: newUser };
  }

  async findAll() {
    const users = await this.userRepository.find();
    return { message: 'All users fetched', data: users };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      return { message: 'User Not found' };
    }
    return { message: 'User found', data: user };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email) {
      const isUser = await this.userRepository.findOneBy({
        email: updateUserDto.email,
      });

      if (isUser) {
        return { message: 'User with this email already exists' };
      }
    }

    await this.userRepository.update(id, updateUserDto);
    return { message: 'Update Successfull' };
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
    return { message: 'User Deleted' };
  }
}
