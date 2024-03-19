import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../../services/websocket.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CallModalComponent } from '../../components/call-modal/call-modal.component';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [CommonModule, MatTableModule, MatIconModule, RouterModule],
    templateUrl: './users.component.html',
    styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
    dataSource: MatTableDataSource<string>;

    constructor(private websocketService: WebsocketService, public dialog: MatDialog, private router: Router) {
        this.dataSource = new MatTableDataSource();
    }

    ngOnInit(): void {
        this.websocketService.onCallInitiated().subscribe(data => {
            const dialogRef = this.dialog.open(CallModalComponent, {
                width: '250px',
                data: { caller: data }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result.accepted) {
                    this.acceptCall(data);
                } else {
                    this.rejectCall(data);
                }
            });
        });

        this.websocketService.onCallAccepted().subscribe(data => {
            console.log('Call accepted by', data);
            this.router.navigate(['/call', data]);
        });

        this.websocketService.onCallRejected().subscribe(data => {
            console.log('Call rejected by', data);
        });

        this.websocketService.getOnlineUsers().subscribe(users => {
            this.dataSource.data = users;
        });

        this.websocketService.onConnect().subscribe(user => {
            this.dataSource.data = [...this.dataSource.data, user];
        });

        this.websocketService.onDisconnect().subscribe(user => {
            this.dataSource.data = this.dataSource.data.filter(u => u !== user);
        });
    }

    initiateCall(receiver: string) {
        const caller = localStorage.getItem('username')!;
        this.websocketService.initiateCall({ caller, receiver });
    }

    acceptCall(caller: string) {
        console.log('Accepting call from', caller);
        const receiver = localStorage.getItem('username')!;
        this.websocketService.acceptCall({ caller, receiver });
        this.router.navigate(['/call', caller]);
    }

    rejectCall(caller: string) {
        console.log('Rejecting call from', caller);
        const receiver = localStorage.getItem('username')!;
        this.websocketService.rejectCall({ caller, receiver });
    }
}
