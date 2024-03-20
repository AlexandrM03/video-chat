import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WebsocketService } from '../../../services/websocket.service';
import { MessageService } from '../../../services/message.service';
import { MessageDto } from '../../../dto/message.dto';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageStyleDirective } from '../../../directives/attribute/message-style.directive';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, MatSnackBarModule, FormsModule, MessageStyleDirective],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewChecked {
    messages: MessageDto[] = [];
    partner: string;
    username: string;

    text: string = '';

    @ViewChild('messageContainer') messageContainer!: ElementRef;

    constructor(
        private webSocketService: WebsocketService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
    ) {
        this.partner = this.route.snapshot.paramMap.get('username')!;
        this.username = localStorage.getItem('username')!;
    }

    ngOnInit() {
        this.messageService.getMessagesFromChat(this.partner).subscribe({
            next: (messages) => {
                console.log(messages);
                this.messages = messages;
            },
            error: (error) => {
                console.error(error);
            }
        });

        this.webSocketService.onMessage().subscribe({
            next: (message) => {
                if (message.senderUsername === this.partner || message.receiverUsername === this.partner) {
                    this.messages.push(message);
                } else {
                    this.snackBar.open(`New message from ${message.senderUsername}`, 'Close', {
                        duration: 2000
                    });
                }
            }
        });
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

    sendMessage() {
        const message: MessageDto = {
            text: this.text,
            receiverUsername: this.partner,
            senderUsername: this.username
        };
        this.webSocketService.sendMessage(message);

        this.messages.push(message);
        this.text = '';
    }
}
