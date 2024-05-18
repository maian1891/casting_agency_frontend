import { ReplaySubject, takeUntil, tap } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UpperCasePipe, NgIf, Location, CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../movie.service';
import { AuthService } from '../../user/auth.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [NgIf, UpperCasePipe, ReactiveFormsModule, CommonModule],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.scss',
})
export class MovieDetailComponent implements OnDestroy {
  formMovie!: FormGroup;
  submitted = false;
  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private location: Location,
    public auth: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  ngOnInit(): void {
    this.getMovie();
  }

  get f() {
    return this.formMovie.controls;
  }

  getMovie(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.movieService
      .getMovie(id)
      .pipe(
        tap((movie) => {
          this.formMovie = this.formBuilder.group({
            id: [movie.id],
            title: [movie.title, Validators.required],
            releaseDate: [
              this.formatDate(movie.releaseDate),
              [
                Validators.required,
                Validators.pattern(
                  /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
                ),
              ],
            ],
          });
        }),
        takeUntil(this.destroy)
      )
      .subscribe();
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.submitted = true;
    if (this.formMovie.invalid) {
      return;
    }

    this.movieService
      .updateMovie(this.formMovie.value)
      .pipe(
        tap(() => this.goBack()),
        takeUntil(this.destroy)
      )
      .subscribe();
  }

  private formatDate(date: Date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
}
