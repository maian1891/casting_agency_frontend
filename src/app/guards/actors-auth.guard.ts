import { AuthService } from '../user/auth.service';
import { PageFlowService } from './../services/page-flow.service';
import { inject } from '@angular/core';

export const ActorsAuthGuard = () => {
  const authService = inject(AuthService);
  const pageFlowService = inject(PageFlowService);

  if (authService.isCastingDirector() || authService.isExecutiveProducer()) {
    return true;
  } else {
    pageFlowService.next(['/404']); // Redirect if not authorized
    return false; // Prevent access to admin child routes
  }
};
