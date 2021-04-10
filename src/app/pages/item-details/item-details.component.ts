import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/models/item';
import { ItemService } from 'src/app/services/item.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private userService:UserService, private router: Router, private itemService: ItemService) { }
  item: Item
  sub: Subscription
  isReviewsClicked=false
  loggedInUser$
  isItemBought=false
  isRemoveClicked=false
  isItemRemoved=false
  isModalShown=false
  ngOnInit(): void {
    this.sub = this.route.data.subscribe(data => {
      this.item = data.item
    })
    this.loggedInUser$=this.userService.loggedInUser$
  }
  onBack() {
    this.router.navigateByUrl('/')
  }
onRemoveItem() {
  this.isModalShown=true
    setTimeout(async ()=>{
      await this.itemService.remove(this.item.id)
      this.onBack()
this.isItemRemoved=true
    },1500)
  }
  cancel(){
    this.isRemoveClicked=false
    this.isModalShown=false
  }
  ngOnDestroy() {
    this.sub.unsubscribe()
  }
  async onBuyItem() {
    this.userService.buyItem(this.item)
    await this.itemService.updateItem(this.item.id)
    console.log('this.item',this.item);
    
    // this.item={...updatedItem}
  }
}
