import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { Movie } from './movie';
import { MovieService } from './movie.service';
import { ReplaySubject, takeUntil, tap } from 'rxjs';
import { AuthService } from '../user/auth.service';
import { MovieSearchComponent } from './movie-search/movie-search.component';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, RouterModule, MovieSearchComponent],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss',
})
export class MoviesComponent implements OnDestroy {
  movies: Movie[] = [];
  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(private movieService: MovieService, public auth: AuthService) {}
  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.movieService
      .getMovies()
      .pipe(
        takeUntil(this.destroy),
        tap((movies) => (this.movies = movies))
      )
      .subscribe();
  }

  delete(movie: Movie): void {
    this.movies = this.movies.filter((m) => m !== movie);
    this.movieService
      .deleteMovie(movie.id)
      .pipe(takeUntil(this.destroy))
      .subscribe();
  }
}
