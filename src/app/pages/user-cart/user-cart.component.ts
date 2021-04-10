import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'user-cart',
  templateUrl: './user-cart.component.html',
  styleUrls: ['./user-cart.component.scss']
})
export class UserCartComponent implements OnInit {

  constructor(private userService:UserService,private route:ActivatedRoute) { }
  loggedInUser$
  cartItems
  ngOnInit(): void {
    this.loggedInUser$=this.userService.loggedInUser$
    this.cartItems=this.loggedInUser$.source.value.items
    console.log(this.cartItems);
    
  }

}
