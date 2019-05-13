import { Component, OnInit, ViewChild } from "@angular/core";
import { User } from "../../_models";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html"
})
export class HeaderComponent {
  public user: User;
  constructor() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(currentUser);
    if (currentUser && currentUser.token) {
        this.user = currentUser;
    }
  }
}


// export class HomeComponent implements OnInit {
//   users: User[] = [];

//   constructor(private userService: UserService) {}

//   ngOnInit() {
//       this.userService.getAll().pipe(first()).subscribe(users => { 
//           this.users = users; 
//       });
//   }
// }