import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { WebsocketService } from '../../services/websocket.service';
import { NotificationDirective } from '../../directives/structural/notification.directive';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [MatSidenavModule, MatListModule, RouterModule, CommonModule, NotificationDirective],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
    notificationMessage: string;
    showNotification: boolean = false;

    constructor(private webSocketService: WebsocketService) { }

    ngOnInit() {
        this.webSocketService.onMessage().subscribe({
            next: message => {
                this.notificationMessage = message.text;
                this.showNotification = true;
            }
        })
    }
}
