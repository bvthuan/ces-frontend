import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class RouteService {

  constructor(private http: HttpClient) { }

  getRoute(options: {}) {
    return this.http.post<any>(`${config.apiUrl}/api/routes`, options)
      .pipe(map(routes => {
        const totalPrice = _.sumBy(routes, function(route: any) { return route.price; });
        const totalTime = _.sumBy(routes, function(route: any) { return route.time; });
        // => 20
        
        return {
          routes: routes,
          totalPrice,
          totalTime,
        };
      }));
  }

  getCities() {
    return this.http.get<any>(`${config.apiUrl}/api/cities`)
      .pipe(map(cities => {
        return cities;
      }));
  }

  getPackageTypes() {
    return this.http.get<any>(`${config.apiUrl}/api/goodtypes`)
      .pipe(map(goodtypes => {
        return goodtypes;
      }));
  }
  
}