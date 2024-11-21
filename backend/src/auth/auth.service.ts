import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user-dto';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import { DatabaseService, DRIZZLE } from 'src/database';
import { RANDOM_DESCRIPTIONS } from '../common/constants';
import { User } from 'src/user/models';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(DRIZZLE) private readonly db: DatabaseService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    createUserDto['password'] = await bcrypt.hash(
      createUserDto['password'],
      10,
    );
    const randomDescription =
      RANDOM_DESCRIPTIONS[
        Math.floor(Math.random() * RANDOM_DESCRIPTIONS.length)
      ];
    const createdUser = await this.db
      .insert(User)
      .values({
        username: createUserDto.username,
        password: createUserDto.password,
        avatar: createUserDto.avatar,
        description: randomDescription,
      })
      .returning();

    return createdUser[0];
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.db.query.User.findFirst({
      where: eq(User.username, loginUserDto.username),
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (await bcrypt.compare(loginUserDto.password, user.password)) {
      return {
        token: this.jwtService.sign({
          id: user.id,
          username: user.username,
        }),
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  authenticateUser(authorization: string | undefined): {
    id: number;
    username: string;
  } {
    try {
      if (!authorization) {
        throw new UnauthorizedException('Missing Token');
      }
      const token = authorization.split(' ')[1];
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
