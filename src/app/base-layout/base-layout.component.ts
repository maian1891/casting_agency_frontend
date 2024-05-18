import { Component } from '@angular/core';
import { TemplateComponent } from '../template/template.component';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../user/auth.service';
import { PageFlowService } from '../services/page-flow.service';

@Component({
  selector: 'app-base-layout',
  standalone: true,
  imports: [TemplateComponent, RouterOutlet, NgIf, RouterModule],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.scss',
})
export class BaseLayoutComponent {
  title = 'casting_agency_frontend';

  constructor(
    private pageFlowService: PageFlowService,
    public auth: AuthService
  ) {}

  logout() {
    this.auth.logout();
    this.pageFlowService.next(['/login']);
  }
}
