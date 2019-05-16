import { RouteService } from '../_services/route.service';
import { first } from 'rxjs/operators';
import {
  Component,
  OnInit,
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import * as _ from 'lodash';
import { goodTypes } from '../_helpers/fake-data';

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
  packageTypes: Array<any>;
  route: any = routeState;

  filteredCities: any[];

  constructor(
    private routeService: RouteService,
    private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.findRouteForm = this.formBuilder.group({
      start: ['', Validators.required],
      destination: ['', Validators.required],
      weight: ['', [Validators.required, this.validateNumber.bind(this)]],
      width: ['', [Validators.required, this.validateNumber.bind(this)]],
      height: ['', [Validators.required, this.validateNumber.bind(this)]],
      length: ['', [Validators.required, this.validateNumber.bind(this)]],
      packageType: ['', Validators.required],
      transportType: ['1', Validators.required],
    });

    this.routeService.getCities().pipe(first()).subscribe(cities=> {
      this.cities = cities;
    }, (err) => {
      this.cities = [];
    });

    this.routeService.getPackageTypes().pipe(first()).subscribe(packageTypes=> {
      this.packageTypes = packageTypes;
    }, (err) => {
      this.packageTypes = goodTypes;
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.findRouteForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    // stop here if form is invalid
    if (this.findRouteForm.invalid) {
      return;
    }

    this.route = routeState;

    const params = {
      start: this.f.start.value.code || this.f.start.value,
      destination: this.f.destination.value.code || this.f.destination.value,
      transportType: this.f.transportType.value,
      packageType: this.f.packageType.value,
      packageSizes: {
        weight: this.f.weight.value,
        width: this.f.width.value,
        height: this.f.height.value,
        length: this.f.length.value,
      }
    }

    if(params.start === params.destination) {
      return this.error = 'Start and Destination must be differrent name';
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

  getCityName(key: string) {
    const city = _.find(this.cities, function(city) { return city.code === key; });
    return _.get(city, 'name', '');
  }

  validateNumber(control: FormControl): { [s: string]: boolean } {

    //revised to reflect null as an acceptable value 
    if (control.value === null) return null;
  
    // check to see if the control value is no a number
    if (isNaN(control.value)) {
      return { 'NaN': true };
    }
  
    return null; 
  }
}
