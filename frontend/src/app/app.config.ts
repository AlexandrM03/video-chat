import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { apiInterceptorProvider } from './interceptors/api.interceptor';
import { tokenInterceptorProvider } from './interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimationsAsync(),
        importProvidersFrom(HttpClientModule),
        apiInterceptorProvider,
        tokenInterceptorProvider
    ]
};
