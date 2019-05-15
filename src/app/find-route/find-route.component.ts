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
  routes: Array<any>;

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

    const params = {
      start: this.f.start.value.code,
      destination: this.f.destination.value.code,
      transportType: this.f.transportType.value.code,
    }

    this.routeService.getRoute(params).pipe(first()).subscribe(routes => {
      this.routes = routes; 
    });

  }

  search(event: any) {
    this.filteredCities = _.filter(this.cities, function(city) {
      return _.toLower(city.name).includes(_.toLower(event.query)) || _.toLower(city.code).includes(_.toLower(event.query));
    });
  }
}
