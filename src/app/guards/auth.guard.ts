import { inject } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { PageFlowService } from '../services/page-flow.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const pageFlowService = inject(PageFlowService);

  if (authService.isAuthenticated()) {
    return true; // Allow access if the user is authenticated
  } else {
    pageFlowService.next(['/login']); // Redirect to login if not authenticated
    return false; // Prevent access to the route
  }
};
