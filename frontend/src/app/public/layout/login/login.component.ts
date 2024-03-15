import { Component } from '@angular/core';
import { AuthComponent } from '../../components/auth/auth.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthDto } from '../../../dto/auth.dto';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { TokenDto } from '../../../dto/token.dto';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [AuthComponent, MatSnackBarModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    constructor(
        private authService: AuthService,
        private snackbar: MatSnackBar,
        private router: Router
    ) { }

    login(credentials: AuthDto) {
        this.authService.login(credentials).subscribe({
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
