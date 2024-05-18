import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { ActorsComponent } from './actors/actors.component';
import { MoviesComponent } from './movies/movies.component';
import { ActorDetailComponent } from './actors/actor-detail/actor-detail.component';
import { MovieDetailComponent } from './movies/movie-detail/movie-detail.component';
import { authGuard } from './guards/auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BaseLayoutComponent } from './base-layout/base-layout.component';
import { ActorCreateComponent } from './actors/actor-create/actor-create.component';
import { MoviesAuthGuard } from './guards/movies-auth.guard';
import { ActorsAuthGuard } from './guards/actors-auth.guard';
import { MovieCreateComponent } from './movies/movie-create/movie-create.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: UserComponent },
  {
    path: 'actors',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: BaseLayoutComponent,
        canActivateChild: [authGuard],
        children: [
          { path: '', component: ActorsComponent, pathMatch: 'full' },
          {
            path: 'detail/:id',
            component: ActorDetailComponent,
          },
          {
            path: 'create',
            component: ActorCreateComponent,
            canActivate: [ActorsAuthGuard],
          },
        ],
      },
    ],
  },
  {
    path: 'movies',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: BaseLayoutComponent,
        children: [
          {
            path: '',
            component: MoviesComponent,
            pathMatch: 'full',
          },
          { path: 'detail/:id', component: MovieDetailComponent },
          {
            path: 'create',
            component: MovieCreateComponent,
            canActivate: [MoviesAuthGuard],
          },
        ],
      },
    ],
  },
  { path: '404', component: PageNotFoundComponent },
  {
    path: '**',
    redirectTo: '404',
  },
];
