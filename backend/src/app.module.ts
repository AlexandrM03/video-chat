import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { WebsocketModule } from './websocket/websocket.module';
import { MessageModule } from './message/message.module';

@Module({
    imports: [AuthModule, WebsocketModule, MessageModule],
    controllers: [],
    providers: [PrismaService],
})
export class AppModule { }
