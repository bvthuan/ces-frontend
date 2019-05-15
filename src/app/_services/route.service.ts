import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RouteService {

  constructor(private http: HttpClient) { }

  getRoute(options: {}) {
    return this.http.get<any>(`${config.apiUrl}/api/routes`, {})
      .pipe(map(routes => {
        return routes;
      }));
  }

  getCities() {
    return this.http.get<any>(`${config.apiUrl}/api/cities`)
      .pipe(map(cities => {
        return cities;
      }));
  }
  
}