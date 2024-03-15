import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private configService: ConfigService
    ) { }

    async register(dto: AuthDto) {
        const oldUser = await this.prisma.user.findUnique({
            where: { username: dto.username }
        });

        if (oldUser) {
            throw new BadRequestException('User already exists');
        }

        const user = await this.prisma.user.create({
            data: {
                username: dto.username,
                password: dto.password
            }
        });

        const tokens = await this.issueTokens(user.username);

        return {
            username: user.username,
            ...tokens
        };
    }

    async login(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: { username: dto.username }
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.issueTokens(user.username);

        return {
            username: user.username,
            ...tokens
        };
    }

    private async issueTokens(username: string) {
        const payload = { username };

        const access_token = this.jwt.sign(payload, {
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME')
        });

        const refresh_token = this.jwt.sign(payload, {
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME')
        });

        return { access_token, refresh_token };
    }

    async getNewTokens(refreshToken: string) {
        const result = await this.jwt.verifyAsync(refreshToken);

        if (!result) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const user = await this.prisma.user.findUnique({
            where: {
                username: result.username
            }
        })

        const tokens = await this.issueTokens(user.username);

        return {
            username: user.username,
            ...tokens
        }
    }
}
