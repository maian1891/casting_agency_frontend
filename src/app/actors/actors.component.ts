import { Component, OnDestroy } from '@angular/core';
import { Actor } from './actor';
import { ActorService } from './actor.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ReplaySubject, takeUntil, tap } from 'rxjs';
import { AuthService } from '../user/auth.service';
import { ActorSearchComponent } from './actor-search/actor-search.component';

@Component({
  selector: 'app-actors',
  standalone: true,
  imports: [NgFor, RouterLink, RouterModule, NgIf, ActorSearchComponent],
  templateUrl: './actors.component.html',
  styleUrl: './actors.component.scss',
})
export class ActorsComponent implements OnDestroy {
  actors: Actor[] = [];
  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(private actorService: ActorService, public auth: AuthService) {}

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  ngOnInit(): void {
    this.getActors();
  }

  getActors(): void {
    this.actorService
      .getActors()
      .pipe(
        takeUntil(this.destroy),
        tap((actors) => (this.actors = actors))
      )
      .subscribe();
  }

  delete(actor: Actor): void {
    this.actors = this.actors.filter((h) => h !== actor);
    this.actorService
      .deleteActor(actor.id)
      .pipe(takeUntil(this.destroy))
      .subscribe();
  }
}
