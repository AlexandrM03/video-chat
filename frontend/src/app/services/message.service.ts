import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatDto } from '../dto/chat.dto';
import { MessageDto } from '../dto/message.dto';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    constructor(private http: HttpClient) { }

    getChats(): Observable<ChatDto[]> {
        return this.http.get<ChatDto[]>('/message/chats');
    }

    getMessagesFromChat(otherParticipant: string): Observable<MessageDto[]> {
        return this.http.get<MessageDto[]>(`/message/chat/${otherParticipant}`);
    }
}
