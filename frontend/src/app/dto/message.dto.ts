export interface MessageDto {
    id?: number;
    text: string;
    senderUsername: string;
    receiverUsername: string;
    createdAt?: string;
}