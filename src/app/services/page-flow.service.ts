import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PageFlowService {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  next(command: any[], extras?: NavigationExtras) {
    this.router.navigate(command, { relativeTo: this.route, ...extras });
  }

  back() {
    this.location.back();
  }

  home() {
    window.location.href = '';
  }
}
