import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ResponseUserDto } from '../user/dto/response-user.dto';
import { AuthPayload, AuthResponse } from './interface/auth.interface';
import { ResponseLoginDto } from './dto/response-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private readonly _jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    return this._userService.create(createUserDto);
  }

  async validateUser(
    login: string,
    password: string,
  ): Promise<AuthResponse | null> {
    const user = await this._userService.findByLogin(login);

    if (user && (await bcrypt.compare(password, user.password))) {
      return { userId: user.id, login: user.login };
    }
    return null;
  }

  async login(user: AuthPayload): Promise<ResponseLoginDto> {
    const payload: AuthPayload = { userId: user.userId, login: user.login };
    return {
      accessToken: this._jwtService.sign(payload),
      refreshToken: this._jwtService.sign(payload, {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      }),
    };
  }

  async refreshToken(refreshToken: string): Promise<ResponseLoginDto> {
    try {
      const payload = this._jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
      const newPayload: AuthPayload = {
        userId: payload.userId,
        login: payload.login,
      };

      return {
        accessToken: this._jwtService.sign(newPayload),
        refreshToken: this._jwtService.sign(newPayload, {
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        }),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
