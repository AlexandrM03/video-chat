import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { WebsocketGateway } from './websocket.gateway';
import { MessageService } from 'src/message/message.service';
import { PrismaService } from 'src/prisma.service';

@Module({
    providers: [WebsocketGateway, WebsocketService, MessageService, PrismaService],
})
export class WebsocketModule { }
