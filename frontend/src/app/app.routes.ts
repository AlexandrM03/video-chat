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
    // { path: 'users', component: UsersComponent, canActivate: [authGuard] },
    // { path: 'call/:username', component: CallComponent, canActivate: [authGuard] },
    // { path: 'chats', component: ChatsComponent, canActivate: [authGuard] },
    // { path: 'chat/:username', component: ChatComponent, canActivate: [authGuard] },
    {
        path: '',
        canActivate: [authGuard],
        component: LayoutComponent,
        children: [
            { path: 'users', component: UsersComponent },
            { path: 'call/:username', component: CallComponent },
            { path: 'chats', component: ChatsComponent },
            { path: 'chat/:username', component: ChatComponent },
        ]
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
];
