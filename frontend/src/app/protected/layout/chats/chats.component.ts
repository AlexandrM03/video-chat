import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../services/message.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ChatDto } from '../../../dto/chat.dto';
import { WebsocketService } from '../../../services/websocket.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-chats',
    standalone: true,
    imports: [CommonModule, MatSnackBarModule, RouterModule],
    templateUrl: './chats.component.html',
    styleUrl: './chats.component.css'
})
export class ChatsComponent implements OnInit {
    chats: ChatDto[] = [];
    // TODO: replace with ngrx store
    username: string = localStorage.getItem('username')!;

    constructor(
        private messageService: MessageService,
        private snackBar: MatSnackBar,
        private webSocketService: WebsocketService
    ) { }

    ngOnInit() {
        this.messageService.getChats().subscribe({
            next: (chats) => {
                this.chats = chats;
            },
            error: (error) => {
                this.snackBar.open('An error occurred while fetching chats', 'Close', {
                    duration: 2000
                });
                console.error(error);
            }
        });

        this.webSocketService.onMessage().subscribe({
            next: (message) => {
                this.snackBar.open(`New message from ${message.senderUsername}`, 'Close', {
                    duration: 2000
                });
                const chat = this.chats.find(chat => chat.otherParticipant === message.senderUsername
                    || chat.otherParticipant === message.receiverUsername);
                if (chat) {
                    chat.latestMessage = message;
                } else {
                    this.chats.push({
                        otherParticipant: message.senderUsername,
                        latestMessage: message
                    });
                }
            }
        })
    }
}
