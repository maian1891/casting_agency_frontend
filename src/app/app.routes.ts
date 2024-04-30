import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { ActorsComponent } from './actors/actors.component';
import { MoviesComponent } from './movies/movies.component';
import { ActorDetailComponent } from './actors/actor-detail/actor-detail.component';
import { MovieDetailComponent } from './movies/movie-detail/movie-detail.component';
import { AuthGuard } from './guards/auth.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: UserComponent },
  {
    path: 'actors',
    component: ActorsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'detail/:id',
        component: ActorDetailComponent,
      },
    ],
  },
  {
    path: 'movies',
    component: MoviesComponent,
    canActivate: [AuthGuard],
    children: [{ path: 'detail/:id', component: MovieDetailComponent }],
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  {
    path: '**',
    redirectTo: 'login',
  },
];
