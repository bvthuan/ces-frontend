import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { LocalUser } from './local.user';
import {
  cities,
  users,
  routes,
} from './fake-data';
import * as _ from 'lodash';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  constructor(private localUser: LocalUser) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // wrap in delayed observable to simulate server api call
    return of(null).pipe(mergeMap(() => {

      // authentication
      if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
        const { username, password } = request.body;

        if (username && password && _.some(users, { username, password })){
          // if login details are valid return 200 OK with a fake jwt token
          const body = _.find(users, { username, password });
          
          return of(new HttpResponse({ status: 200, body }));
        } else {
          // else return 400 bad request
          return throwError({ error: { message: 'Username or password is incorrect' } });
        }
      }

      // get users
      if (request.url.endsWith('/users') && request.method === 'GET') {
        // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
        if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          return of(new HttpResponse({ status: 200, body: users }));
        } else {
            // return 401 not authorised if token is null or invalid
          return throwError({ error: { message: 'Unauthorised' } });
        }
      }

      // get routes
      if (request.url.endsWith('/routes') && request.method === 'GET') {

        const currentUser = this.localUser.get();
        if (currentUser) {
          request = request.clone({
            setHeaders: { 
              Authorization: `Bearer ${currentUser.token}`
            }
          });
        }

        // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
        if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {

          const res = {
            totalTime: 6,
            totalPrice: 74,
            deliverDate: '16/5/2019',
            routes: routes,
          }
          return of(new HttpResponse({ status: 200, body: res }));
        } else {
          // return 401 not authorised if token is null or invalid
          return throwError({ error: { message: 'Unauthorised' } });
        }
      }

      // get cities
      if (request.url.endsWith('/cities') && request.method === 'GET') {

        if (request) {
          return of(new HttpResponse({ status: 200, body: cities }));
        } else {
          // return 401 not authorised if token is null or invalid
          return throwError({ error: { message: 'Unauthorised' } });
        }
      }


      // pass through any requests not handled above
      return next.handle(request);
    }))

    // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
    .pipe(materialize())
    .pipe(delay(500))
    .pipe(dematerialize());
  }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};