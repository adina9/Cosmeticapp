import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterBy } from 'src/app/models/filter-by';
import { Item } from 'src/app/models/item';
import { ItemService } from 'src/app/services/item.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-item-app',
  templateUrl: './item-app.component.html',
  styleUrls: ['./item-app.component.scss']
})
export class ItemAppComponent implements OnInit {

  constructor(private itemService: ItemService, private userService: UserService) { }

  filterBy$: Observable<FilterBy>
  items$: Observable<Item[]>

  ngOnInit(): void {
    this.items$ = this.itemService.items$
    console.log('items$:', this.items$);

    this.filterBy$ = this.itemService.filterBy$
    this.itemService.query()
  }

  onSetFilter(filterBy: FilterBy) {
    this.itemService.setFilter(filterBy)
  }

  onBuyItem(item: Item) {
    this.userService.buyItem(item)
  }
}
