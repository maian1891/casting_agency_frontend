import { AsyncPipe, NgFor } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import {
  Observable,
  ReplaySubject,
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs';
import { Movie } from './../movie';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [NgFor, RouterLink, AsyncPipe, RouterModule],
  templateUrl: './movie-search.component.html',
  styleUrl: './movie-search.component.scss',
})
export class MovieSearchComponent implements OnDestroy {
  movies$!: Observable<Movie[]>;
  private movieSearchTerms = new Subject<string>();
  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(private movieService: MovieService) {}

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  // Push a search term into the observable stream.
  search(keySearch: string): void {
    this.movieSearchTerms.next(keySearch);
  }

  ngOnInit(): void {
    this.movies$ = this.movieSearchTerms.pipe(
      takeUntil(this.destroy),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((keySearch: string) =>
        this.movieService.searchMovies(keySearch)
      )
    );
  }
}
