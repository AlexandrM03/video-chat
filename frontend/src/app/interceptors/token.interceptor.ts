import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('access_token');

        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 && localStorage.getItem('refresh_token')) {
                    return this.authService.refresh(localStorage.getItem('refresh_token')!).pipe(
                        switchMap((token) => {
                            localStorage.setItem('access_token', token.access_token);
                            localStorage.setItem('refresh_token', token.refresh_token);

                            request = request.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${token.access_token}`
                                }
                            });

                            return next.handle(request);
                        })
                    );
                }

                return throwError(error);
            })
        );
    }
}

export const tokenInterceptorProvider = [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
];
