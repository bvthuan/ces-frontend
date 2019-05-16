import { FakeBackendInterceptor } from './_helpers/fake-backend';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { LocalUser } from './_helpers/local.user';
import { LoginComponent } from './login';
import { FindRouteComponent } from './find-route';
import { AutoCompleteModule } from 'primeng/primeng';

import { HeaderComponent } from './_components/header/header.component';

import '../assets/styles';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    HttpClientModule,
    BrowserAnimationsModule,
    routing,
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    FindRouteComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    LocalUser,
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }