import { PageFlowService } from '../../services/page-flow.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MovieService } from '../movie.service';
import { ReplaySubject, takeUntil, tap } from 'rxjs';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-movie-create',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './movie-create.component.html',
  styleUrl: './movie-create.component.scss',
})
export class MovieCreateComponent implements OnDestroy, OnInit {
  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  formMovie!: FormGroup;
  submitted = false;

  constructor(
    private movieService: MovieService,
    private pageFlowService: PageFlowService,
    private formBuilder: FormBuilder
  ) {}

  get f() {
    return this.formMovie.controls;
  }

  ngOnInit(): void {
    this.formMovie = this.formBuilder.group({
      id: [0],
      title: ['', Validators.required],
      releaseDate: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
          ),
        ],
      ],
    });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  goBack() {
    this.pageFlowService.back();
  }

  add(): void {
    this.submitted = true;
    if (this.formMovie.invalid) {
      return;
    }

    this.movieService
      .addMovie(this.formMovie.value)
      .pipe(
        tap(() => {
          this.pageFlowService.back();
        }),
        takeUntil(this.destroy)
      )
      .subscribe();
  }
}
