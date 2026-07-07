import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ProfileImage } from './entities/profile-image.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(ProfileImage)
    private readonly profileImageRepository: Repository<ProfileImage>,
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
    // console.log('Env Mode : ', this.configService.get('ENV_MODE'));
    // console.log('DB_TYPE : ', this.configService.get('DB_TYPE'));
    // console.log('DB_HOST : ', this.configService.get('DB_HOST'));
    // console.log('DB_PORT : ', this.configService.get('DB_PORT'));
    // console.log('DB_USERNAME : ', this.configService.get('DB_USERNAME'));
    // console.log('DB_PASSWORD : ', this.configService.get('DB_PASSWORD'));
    // console.log('DB_NAME : ', this.configService.get('DB_NAME'));
    // console.log('NODE_ENV : ', this.configService.get('NODE_ENV'));
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      return { status: 404, message: 'User Not found' };
    }
    return { status: 200, message: 'User found', data: user };
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

  async uploadProfileImage(id: number, image: Express.Multer.File) {
    const user = await this.findOne(id);
    if (user.status === 404) {
      return { message: `No user with id ${id} exists!!` };
    }

    const existingProfileImage = await this.profileImageRepository.findOne({
      where: {
        user: {
          id,
        },
      },
    });

    if (existingProfileImage) {
      existingProfileImage.data = image.buffer;
      existingProfileImage.encoding = image.encoding;
      existingProfileImage.filename = image.originalname;
      existingProfileImage.mimetype = image.mimetype;
      existingProfileImage.size = image.size;

      await this.profileImageRepository.save(existingProfileImage);

      return { message: 'Profile picture updated successfully' };
    }
    const newProfileImage = new ProfileImage();
    newProfileImage.data = image.buffer;
    newProfileImage.encoding = image.encoding;
    newProfileImage.filename = image.originalname;
    newProfileImage.mimetype = image.mimetype;
    newProfileImage.size = image.size;
    if (user.data !== undefined) {
      newProfileImage.user = user.data;
    }
    const newUserProfile = this.profileImageRepository.create(newProfileImage);

    await this.profileImageRepository.save(newUserProfile);
    return { message: 'Profile picture uploaded successfully' };
  }
}
