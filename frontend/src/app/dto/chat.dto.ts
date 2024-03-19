import { MessageDto } from './message.dto';

export interface ChatDto {
    otherParticipant: string;
    latestMessage: MessageDto;
}