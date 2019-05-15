import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { LocalUser } from './local.user';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  constructor(private localUser: LocalUser) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const testUser = {
      id: 1,
      username: 'thongdinh',
      password: '123',
      firstName: 'Thong',
      lastName: 'Dinh',
    };

    const cities = [
      {
        "code": "DKO",
        "name": "DE KANARISKE OER"
      },
      {
        "code": "TUN",
        "name": "TUNIS"
      },
      {
        "code": "SUA",
        "name": "SUAKIN"
      },
      {
        "code": "TAN",
        "name": "TANGER"
      },
      {
        "code": "CAI",
        "name": "CAIRO"
      },
      {
        "code": "KAG",
        "name": "KAP GUARDAFUI"
      },
      {
        "code": "AMA",
        "name": "AMATAVE"
      },
      {
        "code": "MOC",
        "name": "MOCAMBIQUE"
      },
      {
        "code": "KAM",
        "name": "KAP ST.MARIE"
      },
      {
        "code": "KAP",
        "name": "KAPSTADEN"
      },
      {
        "code": "HVA",
        "name": "HVALBUGTEN"
      },
      {
        "code": "HEL",
        "name": "ST. HELENA"
      },
      {
        "code": "SLA",
        "name": "SLAVEKYSTEN"
      },
      {
        "code": "GUL",
        "name": "GULDKYSTEN"
      },
      {
        "code": "SIL",
        "name": "SIERRA LEONE"
      },
      {
        "code": "DAK",
        "name": "DAKAR"
      },
      {
        "code": "MAR",
        "name": "MARRAKESH"
      },
      {
        "code": "SAH",
        "name": "SAHARA"
      },
      {
        "code": "TIM",
        "name": "TIMBUKTU"
      },
      {
        "code": "DAR",
        "name": "DARFUR"
      },
      {
        "code": "CON",
        "name": "CONGO"
      },
      {
        "code": "OMD",
        "name": "OMDURMAN"
      },
      {
        "code": "TRI",
        "name": "TRIPOLI"
      },
      {
        "code": "LUA",
        "name": "LUANDA"
      },
      {
        "code": "KAB",
        "name": "KABALO"
      },
      {
        "code": "VIF",
        "name": "VICTORIAFALDENE"
      },
      {
        "code": "BAG",
        "name": "BAHREL GHAZAL"
      },
      {
        "code": "ADA",
        "name": "ADDIS ABEBA"
      },
      {
        "code": "VIS",
        "name": "VICTORIASOEN"
      },
      {
        "code": "ZAN",
        "name": "ZANZIBAR"
      },
      {
        "code": "DRA",
        "name": "DRAGEBJERGET"
      }
    ];

    // wrap in delayed observable to simulate server api call
    return of(null).pipe(mergeMap(() => {

      // authentication
      if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
        if (request.body.username === testUser.username && request.body.password === testUser.password) {
          // if login details are valid return 200 OK with a fake jwt token
          let body = {
            id: testUser.id,
            username: testUser.username,
            firstName: testUser.firstName,
            lastName: testUser.lastName,
            token: 'fake-jwt-token'
          };
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
          return of(new HttpResponse({ status: 200, body: [testUser] }));
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

        console.log('request.headers', request.headers);
        // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
        if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          return of(new HttpResponse({ status: 200, body: [testUser] }));
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