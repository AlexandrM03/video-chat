import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthDto } from '../dto/auth.dto';
import { TokenDto } from '../dto/token.dto';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) { }

    register(authDto: AuthDto): Observable<TokenDto> {
        return this.http.post<TokenDto>('/auth/register', authDto);
    }

    login(authDto: AuthDto): Observable<TokenDto> {
        return this.http.post<TokenDto>('/auth/login', authDto);
    }

    refresh(refreshToken: string): Observable<TokenDto> {
        return this.http.post<TokenDto>('/auth/refresh', refreshToken);
    }
}
