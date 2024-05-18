import { NgIf, UpperCasePipe, Location, CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActorService } from '../actor.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReplaySubject, takeUntil, tap } from 'rxjs';
import { AuthService } from '../../user/auth.service';
import { AgeValidator } from '../custom-validators/age.validator';
import { GenderValidator } from '../custom-validators/gender.validator';

@Component({
  selector: 'app-actor-detail',
  standalone: true,
  imports: [NgIf, UpperCasePipe, ReactiveFormsModule, CommonModule],
  templateUrl: './actor-detail.component.html',
  styleUrl: './actor-detail.component.scss',
})
export class ActorDetailComponent implements OnInit, OnDestroy {
  submitted = false;
  formActor!: FormGroup;
  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private actorService: ActorService,
    public auth: AuthService,
    private formBuilder: FormBuilder
  ) {}

  get f() {
    return this.formActor.controls;
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  ngOnInit(): void {
    this.getActor();
  }

  getActor(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.actorService
      .getActor(id)
      .pipe(
        tap(
          (actor) =>
            (this.formActor = this.formBuilder.group({
              id: [actor.id],
              name: [actor.name, Validators.required],
              age: [actor.age, AgeValidator],
              gender: [actor.gender, GenderValidator],
            }))
        ),
        takeUntil(this.destroy)
      )
      .subscribe();
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.submitted = true;
    if (this.formActor.invalid) {
      return;
    }

    this.actorService
      .updateActor(this.formActor.value)
      .pipe(
        tap(() => this.goBack()),
        takeUntil(this.destroy)
      )
      .subscribe();
  }
}
