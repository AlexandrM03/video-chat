import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-call-modal',
    standalone: true,
    imports: [MatButtonModule, MatIconModule],
    templateUrl: './call-modal.component.html',
    styleUrl: './call-modal.component.css'
})
export class CallModalComponent {
    constructor(
        public dialogRef: MatDialogRef<CallModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { caller: string }
    ) { }

    acceptCall(): void {
        this.dialogRef.close({ accepted: true });
    }

    rejectCall(): void {
        this.dialogRef.close({ accepted: false });
    }
}
