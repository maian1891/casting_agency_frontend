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
import { Actor } from './../actor';
import { ActorService } from '../actor.service';

@Component({
  selector: 'app-actor-search',
  standalone: true,
  imports: [AsyncPipe, NgFor, RouterLink, RouterModule],
  templateUrl: './actor-search.component.html',
  styleUrl: './actor-search.component.scss',
})
export class ActorSearchComponent implements OnDestroy {
  actors$!: Observable<Actor[]>;
  private actorSearchTerms = new Subject<string>();
  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(private actorService: ActorService) {}
  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.actorSearchTerms.next(term);
  }

  ngOnInit(): void {
    this.actors$ = this.actorSearchTerms.pipe(
      takeUntil(this.destroy),
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
      // ignore new term if same as previous term
      distinctUntilChanged(),
      // switch to new search observable each time the term changes
      switchMap((keySearch: string) =>
        this.actorService.searchActors(keySearch)
      )
    );
  }
}
