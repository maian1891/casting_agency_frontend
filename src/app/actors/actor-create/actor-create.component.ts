import { PageFlowService } from './../../services/page-flow.service';
import { Component, OnDestroy } from '@angular/core';
import { ActorService } from '../actor.service';
import { takeUntil, ReplaySubject, tap } from 'rxjs';
import {
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { AgeValidator } from '../custom-validators/age.validator';
import { GenderValidator } from '../custom-validators/gender.validator';

@Component({
  selector: 'app-actor-create',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, CommonModule],
  templateUrl: './actor-create.component.html',
  styleUrl: './actor-create.component.scss',
})
export class ActorCreateComponent implements OnDestroy {
  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  formActor!: FormGroup;
  submitted = false;

  constructor(
    private actorService: ActorService,
    private pageFlowService: PageFlowService,
    private formBuilder: FormBuilder
  ) {
    this.formActor = this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      age: [0, [AgeValidator]],
      gender: ['', GenderValidator],
    });
  }

  get f() {
    return this.formActor.controls;
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
    if (this.formActor.invalid) {
      return;
    }

    this.actorService
      .addActor(this.formActor.value)
      .pipe(
        tap(() => {
          this.pageFlowService.back();
        }),
        takeUntil(this.destroy)
      )
      .subscribe();
  }
}
