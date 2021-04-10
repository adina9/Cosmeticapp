import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FilterBy } from 'src/app/models/filter-by';

@Component({
  selector: 'app-filter',
  templateUrl: './app-filter.component.html',
  styleUrls: ['./app-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppFilterComponent implements OnInit {

  @Input() filterBy$: Observable<FilterBy>
  @Output() onSetFilter = new EventEmitter<FilterBy>()

  constructor() { }
  filterBy: FilterBy
  sub: Subscription

  ngOnInit(): void {
    this.sub = this.filterBy$.subscribe(filterBy => {
      this.filterBy = filterBy
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

}
