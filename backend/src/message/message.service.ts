import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MessageService {
    constructor(
        private prisma: PrismaService
    ) { }

    async getChatsForUser(username: string) {
        const latestMessages = await this.prisma.message.groupBy({
            by: ['senderUsername', 'receiverUsername'],
            _max: {
                createdAt: true
            },
            where: {
                OR: [
                    {
                        senderUsername: username
                    },
                    {
                        receiverUsername: username
                    }
                ]
            }
        });

        const chats = [];
        for (const message of latestMessages) {
            const { senderUsername, receiverUsername, _max: { createdAt } } = message;
            const latestMessage = await this.prisma.message.findFirst({
                where: {
                    senderUsername,
                    receiverUsername,
                    createdAt
                }
            });

            const otherParticipant = senderUsername === username ? receiverUsername : senderUsername;

            chats.push({
                otherParticipant,
                latestMessage
            });
        }

        return chats;
    }


    async getMessagesBetweenUsers(senderUsername: string, receiverUsername: string) {
        return await this.prisma.message.findMany({
            where: {
                AND: [
                    {
                        senderUsername
                    },
                    {
                        receiverUsername
                    }
                ]
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
    }

    async createMessage(senderUsername: string, receiverUsername: string, text: string) {
        return await this.prisma.message.create({
            data: {
                senderUsername,
                receiverUsername,
                text
            }
        });
    }
}
