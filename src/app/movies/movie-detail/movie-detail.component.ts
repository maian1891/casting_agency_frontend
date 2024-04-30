import { ReplaySubject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe, NgIf, Location } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Movie } from '../movie';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [NgIf, UpperCasePipe, FormsModule],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.scss',
})
export class MovieDetailComponent implements OnDestroy {
  movie!: Movie;
  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private location: Location
  ) {}

  ngOnDestroy(): void {
    this.destroy.next(null);
  }

  ngOnInit(): void {
    this.getMovie();
  }

  getMovie(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.movieService
      .getMovie(id)
      .pipe(takeUntil(this.destroy))
      .subscribe((movie) => (this.movie = movie));
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.movie) {
      this.movieService
        .updateMovie(this.movie)
        .pipe(takeUntil(this.destroy))
        .subscribe(() => this.goBack());
    }
  }
}
