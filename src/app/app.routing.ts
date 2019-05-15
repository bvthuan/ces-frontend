import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { AuthGuard } from './_guards';
import { FindRouteComponent } from './find-route';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [ AuthGuard ],
  },
  {
    path: 'login', 
    component: LoginComponent,
  },
  {
    path: 'find-route', 
    component: FindRouteComponent,
  },
  // otherwise redirect to home
  {
    path: '**',
    redirectTo: '',
  },
];

export const routing = RouterModule.forRoot(appRoutes);