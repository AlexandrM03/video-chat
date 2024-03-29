import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const apiReq = req.clone({ url: `http://code-pilot.ru:5000/api${req.url}` });
        return next.handle(apiReq);
    }
}

export const apiInterceptorProvider = [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }
];