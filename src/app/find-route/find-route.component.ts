import { RouteService } from '../_services/route.service';
import { first } from 'rxjs/operators';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  Router,
  ActivatedRoute,
} from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import * as _ from 'lodash';

export const routeState: any = {
  routes: [],
};

@Component({
  templateUrl: 'find-route.component.html',
  styleUrls: ['./find-route.component.scss'],
})

export class FindRouteComponent implements OnInit {
  findRouteForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  cities: Array<any>;
  route: any = routeState;

  filteredCities: any[];

  constructor(
    private routeService: RouteService,
    private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.findRouteForm = this.formBuilder.group({
      start: ['', Validators.required],
      destination: ['', Validators.required],
      transportType: ['cheapest', Validators.required],
    });

    this.routeService.getCities().pipe(first()).subscribe(cities=> {
      this.cities = cities; 
    }, (err) => {
      this.cities = [];
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.findRouteForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.findRouteForm.invalid) {
      return;
    }

    this.route = routeState;

    const params = {
      start: this.f.start.value.code || this.f.start.value,
      destination: this.f.destination.value.code || this.f.destination.value,
      transportType: this.f.transportType.value,
    }

    this.loading = true;

    this.routeService.getRoute(params).pipe(first()).subscribe(res => {
      this.route = res;
      this.loading = false;
    }, (err) => {
      this.loading = false;
      this.route = routeState;
    });

  }

  search(event: any) {
    this.filteredCities = _.filter(this.cities, function(city) {
      return _.toLower(city.name).includes(_.toLower(event.query)) || _.toLower(city.code).includes(_.toLower(event.query));
    });
  }
}
