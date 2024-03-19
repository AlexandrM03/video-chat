import { Routes } from '@angular/router';
import { RegisterComponent } from './public/layout/register/register.component';
import { LoginComponent } from './public/layout/login/login.component';
import { UsersComponent } from './protected/layout/users/users.component';
import { CallComponent } from './protected/layout/call/call.component';
import { authGuard } from './guards/auth.guard';
import { ChatsComponent } from './protected/layout/chats/chats.component';
import { ChatComponent } from './protected/layout/chat/chat.component';
import { LayoutComponent } from './protected/layout/layout.component';

export const routes: Routes = [
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'users', component: UsersComponent },
            { path: 'call/:username', component: CallComponent },
            { path: 'chats', component: ChatsComponent },
            { path: 'chat/:username', component: ChatComponent },
        ]
    },
];
