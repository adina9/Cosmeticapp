import { Component, Input, OnInit, Output } from '@angular/core';
import { ItemService } from 'src/app/services/item.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
@Input() item
@Input() isReviewsClicked
constructor(private userService:UserService,
  private itemService:ItemService) { }
loggedInUser$
isFormOpen=false
fullRate=5
review={
  from:'',
  rate:null,
  txt:''
}
isStarClicked=false
// stars={
//   starOneClicked:false,
//   starTwoClicked:false,
//   starThreeClicked:false,
//   starFourClicked:false,
//   starFiveClicked:false,
// }
  ngOnInit(): void {
    this.loggedInUser$=this.userService.loggedInUser$
  }
  async onAddReview(formValue){
    console.log(formValue);
    this.isFormOpen=false
    
    const finalReview={
      // ...formValue,
      ...this.review,
      id:this.itemService._makeId(),
      createdAt:new Date(Date.now()).toDateString()
    }
    let cleanReview={
      from:'',
      rate:null,
      txt:''
    }
    formValue=cleanReview
    this.review=cleanReview
    if(!this.item.reviews){
    this.item.reviews = [];
    this.item.reviews.push({ ...finalReview });
  } else this.item.reviews.push({ ...finalReview });
    await this.itemService.addReview(this.item.id,finalReview)
  }
  async onDeleteReview(reviewId) {
    console.log('reviewId:',reviewId);
    
    let idx = this.item.reviews.findIndex(
      (currReview) => currReview.id === reviewId
    );
    this.item.reviews.splice(idx, 1);
    await this.itemService.deleteReview(this.item.id, reviewId);
  }
  addStar(value){
    console.log('star value:',value);
    this.review.rate=value
    console.log('rate',this.review.rate);
    
    this.isStarClicked=true
  }
  removeStar(value){
    this.review.rate=null
    this.isStarClicked=false
  }
}
