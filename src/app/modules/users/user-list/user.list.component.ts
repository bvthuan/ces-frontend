import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '../../../_models';
import { UserService } from '../../../_services';

// import { User } from '../_models';
// import { UserService } from '../_services';

@Component({templateUrl: 'user.list.component.html'})
export class UserListComponent implements OnInit {
    users: User[] = [];

    constructor(private userService: UserService) {}

    ngOnInit() {
        this.userService.getAll().pipe(first()).subscribe(users => { 
            this.users = users; 
        });
    }
}