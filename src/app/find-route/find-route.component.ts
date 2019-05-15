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

@Component({
  templateUrl: 'find-route.component.html',
  styleUrls: ['./find-route.component.css'],
})

export class FindRouteComponent implements OnInit {
  findRouteForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  results: Array<any>;

  constructor(
    private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.findRouteForm = this.formBuilder.group({
      start: ['', Validators.required],
      destination: ['', Validators.required],
      transportType: ['cheapest', Validators.required],
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

  }

  search(event: any) {
    this.results = [
      'a',
      'b'
    ]
  }
}
