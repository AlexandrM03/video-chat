import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
    imports: [AuthModule, WebsocketModule],
    controllers: [],
    providers: [PrismaService],
})
export class AppModule { }
