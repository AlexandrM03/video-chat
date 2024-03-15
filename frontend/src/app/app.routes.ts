import { Routes } from '@angular/router';
import { RegisterComponent } from './public/layout/register/register.component';
import { LoginComponent } from './public/layout/login/login.component';
import { UsersComponent } from './protected/layout/users/users.component';
import { CallComponent } from './protected/layout/call/call.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'users', component: UsersComponent, canActivate: [authGuard] },
    { path: 'call/:username', component: CallComponent, canActivate: [authGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
