import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './user/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'casting_agency_frontend';

  constructor(public auth: AuthService, private router: Router) {
    this.initializeApp();
  }

  initializeApp() {
    // Perform required auth actions
    this.auth.load_jwts();
    this.auth.check_token_fragment();

    // if (this.auth.isAuthenticated()) this.router.navigate(['/actors']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/logins']);
  }
}
