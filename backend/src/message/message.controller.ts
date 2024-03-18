import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('chats')
    async getChatsForUser(@CurrentUser('username') username: string) {
        return await this.messageService.getChatsForUser(username);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('chat/:receiverUsername')
    async getMessagesBetweenUsers(
        @CurrentUser('username') senderUsername: string,
        @Param('receiverUsername') receiverUsername: string
    ) {
        return await this.messageService.getMessagesBetweenUsers(senderUsername, receiverUsername);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':receiverUsername')
    async createMessage(
        @CurrentUser('username') senderUsername: string,
        @Param('receiverUsername') receiverUsername: string,
        @Body('text') text: string
    ) {
        return await this.messageService.createMessage(senderUsername, receiverUsername, text);
    }
}
