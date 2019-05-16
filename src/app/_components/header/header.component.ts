import { Component } from "@angular/core";
import { User } from "../../_models";
import { AuthenticationService } from '../../_services/authentication.service';
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public user: User;

  constructor(private authService: AuthenticationService) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      this.user = currentUser;
    }

    this.authService.action.subscribe((user: any) => {
      this.user = user;
    });
  }

  logout () {
    this.authService.logout();
    this.authService.action.emit(null);
  }
}