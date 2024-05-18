import { PageFlowService } from './../services/page-flow.service';
import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [NgIf],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  loginURL!: string;
  constructor(
    public auth: AuthService,
    private pageFlowService: PageFlowService
  ) {
    this.loginURL = auth.build_login_link('/callback');
  }

  // logIn() {
  //   this.auth.token =
  //     'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ikk1RGR0eEVBUnNOaHRQdGtPbjExQiJ9.eyJ6cm9sZXMiOlsiQ2FzdGluZyBBc3Npc3RhbnQiXSwiaXNzIjoiaHR0cHM6Ly9kZXYtdm5pYmsxa292M2xuaHR0ei5hdS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NjYzMTEyMTY0ZjkyZmFkNjIwOGMyYjkxIiwiYXVkIjoiY2FzdGluZy1hZ2VuY3kiLCJpYXQiOjE3MTUzOTUzMDcsImV4cCI6MTcxNTQwMjUwNywic2NvcGUiOiIiLCJhenAiOiIxYThVSGI0Q1k1YjB4R2lUWWFwR1RycU96VkVndEhoMiIsInBlcm1pc3Npb25zIjpbImdldDphY3Rvci1kZXRhaWwiLCJnZXQ6YWN0b3ItZGV0YWlsLzxpZD4iLCJnZXQ6YWN0b3ItZGV0YWlsLzppZCIsImdldDphY3Rvci1kZXRhaWwve2lkfSIsImdldDphY3RvcnMiLCJnZXQ6bW92aWUtZGV0YWlsIiwiZ2V0Om1vdmllcyJdfQ.S21DjWiPulEbM1wdYB-MtASf5lfzxESoqnMR8501XzSY_xoPBW8lmt-stZbO8bp5DFyWMKNRVZuJ6Fb_yr0gKszsUlnnySnH0VRRXa_bSFaTbJyRGM9ErPt-0gAs2jjuDC8EKYTW_1tSDoIKTydVO29NVNb5SgNBtoofd6Jig7yTlfovaKbjF0He7iOazErlvDvzPUNnd556mDCawOtpzQazEbD5nyXOiHY91wFpQUTNiMN_z7eQlQqVC0EL9naM8qtNXEa2M7ZBqqFOeU4im4uNh09XDpBC1tsMP-a9Zlt7ArOS10qFRItoZl6x_7jHGNvdindxiymsCDnGlNn3BQ';
  //   this.auth.set_token(this.auth.token);
  //   this.auth.load_jwts();
  //   this.pageFlowService.next(['/actors']);
  // }
}
