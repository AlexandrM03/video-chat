import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AuthComponent } from '../../components/auth/auth.component';
import { AuthDto } from '../../../dto/auth.dto';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { TokenDto } from '../../../dto/token.dto';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [AuthComponent, MatSnackBarModule, RouterModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    constructor(
        private authService: AuthService,
        private snackbar: MatSnackBar,
        private router: Router
    ) { }

    register(credentials: AuthDto) {
        this.authService.register(credentials).subscribe({
            next: (dto: TokenDto) => {
                localStorage.setItem('access_token', dto.access_token);
                localStorage.setItem('refresh_token', dto.refresh_token);
                localStorage.setItem('username', dto.username);
                this.router.navigate(['/users']);
            },
            error: err => {
                this.snackbar.open(err.error.message, 'Close', {
                    duration: 3000
                });
            }
        })
    }
}
