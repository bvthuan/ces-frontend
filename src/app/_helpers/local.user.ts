import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// @Injectable()
export class LocalUser {
    get(): any {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            return currentUser;
        }

        return null;
    }
}