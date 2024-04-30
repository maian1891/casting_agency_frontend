import { NgFor } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { Movie } from './movie';
import { MovieService } from './movie.service';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [NgFor, RouterLink, RouterModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss',
})
export class MoviesComponent implements OnDestroy {
  movies: Movie[] = [];
  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(private movieService: MovieService) {}
  ngOnDestroy(): void {
    this.destroy.next(null);
  }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.movieService
      .getMovies()
      .pipe(takeUntil(this.destroy))
      .subscribe((movies) => (this.movies = movies));
  }

  add(title: string): void {
    title = title.trim();
    if (!title) {
      return;
    }
    this.movieService
      .addMovie({ title } as Movie)
      .pipe(takeUntil(this.destroy))
      .subscribe((movie) => {
        this.movies.push(movie);
      });
  }

  delete(movie: Movie): void {
    this.movies = this.movies.filter((m) => m !== movie);
    this.movieService
      .deleteMovie(movie.id)
      .pipe(takeUntil(this.destroy))
      .subscribe();
  }
}
