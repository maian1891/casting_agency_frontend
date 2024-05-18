import { PageFlowService } from './../services/page-flow.service';
import { inject } from '@angular/core';
import { AuthService } from '../user/auth.service';

export const MoviesAuthGuard = () => {
  const authService = inject(AuthService);
  const pageFlowService = inject(PageFlowService);

  if (authService.isExecutiveProducer()) {
    return true;
  } else {
    pageFlowService.next(['/404']); // Redirect if not authorized
    return false; // Prevent access to admin child routes
  }
};
