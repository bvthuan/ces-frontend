import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';
import { EventEmitter } from 'events';

@Injectable({ providedIn: 'root' })
export class UserService {
  onMainEvent: EventEmitter = new EventEmitter();
  
  constructor(private http: HttpClient) { }

  getAll() {
      return this.http.get<User[]>(`${config.apiUrl}/api/users/search`);
  }
}