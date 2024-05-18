import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './user/auth.service';
import { PageFlowService } from './services/page-flow.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    public auth: AuthService,
    private pageFlowService: PageFlowService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    // Perform required auth actions
    this.auth.load_jwts();
    this.auth.check_token_fragment();

    if (this.auth.isAuthenticated()) this.pageFlowService.next(['/actors']);
  }

  logout() {
    this.auth.logout();
    this.pageFlowService.next(['/logins']);
  }
}
