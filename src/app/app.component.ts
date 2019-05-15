import { Component } from '@angular/core';
import { AuthenticationService } from './_services/authentication.service';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent { 
  isLogin = false;

  constructor(private auth: AuthenticationService) {
    this.isLogin = auth.isLogin();
  }
}