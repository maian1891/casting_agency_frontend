import { NgIf, UpperCasePipe, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actor } from '../actor';
import { ActivatedRoute } from '@angular/router';
import { ActorService } from '../actor.service';
import { FormsModule } from '@angular/forms';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-actor-detail',
  standalone: true,
  imports: [NgIf, UpperCasePipe, FormsModule],
  templateUrl: './actor-detail.component.html',
  styleUrl: './actor-detail.component.scss',
})
export class ActorDetailComponent implements OnInit, OnDestroy {
  actor!: Actor;
  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private actorService: ActorService
  ) {}

  ngOnDestroy(): void {
    this.destroy.next(null);
  }

  ngOnInit(): void {
    this.getActor();
  }

  getActor(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.actorService
      .getActor(id)
      .pipe(takeUntil(this.destroy))
      .subscribe((actor) => (this.actor = actor));
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.actor) {
      this.actorService
        .updateActor(this.actor)
        .pipe(takeUntil(this.destroy))
        .subscribe(() => this.goBack());
    }
  }
}
