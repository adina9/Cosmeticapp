import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/models/item';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.scss']
})
export class ItemEditComponent implements OnInit {

  constructor(private route: ActivatedRoute, private itemService: ItemService, private router: Router) { }
  item
  sub: Subscription
  ngOnInit(): void {
    this.sub = this.route.data.subscribe(data => {
      this.item = data.item || this.itemService.getEmptyItem()
    })
  }

  async onSaveItem(itemToSave: Item) {
    const item = await this.itemService.save({ ...this.item, ...itemToSave }).toPromise()
    this.router.navigate(['item', item.id])
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

}
