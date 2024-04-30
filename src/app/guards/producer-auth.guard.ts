import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../user/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ExecutiveProducerAuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivateChild(): boolean {
    if (this.authService.isExecutiveProducer()) {
      return true;
    } else {
      this.router.navigate(['/unauthorized']); // Redirect if not authorized
      return false; // Prevent access to admin child routes
    }
  }
}
