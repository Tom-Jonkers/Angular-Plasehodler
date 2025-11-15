import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import {withInterceptorsFromDi, provideHttpClient, withInterceptors} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import {authInterceptor} from "./app/services/auth.interceptor";


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule),
        provideAnimations(),
        provideHttpClient(withInterceptors([authInterceptor]))
    ]
})
  .catch(err => console.error(err));
