import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeaderComponent implements OnInit {

  constructor(private route:ActivatedRoute ,private userService: UserService,private router:Router) { }

  loggedInUser$
sub:Subscription
  ngOnInit(): void {
this.sub=this.route.data.subscribe(data=>{
  return data
  
  // this.loggedInUser$=data.loggedInUser$
})
console.log(this.sub);

    this.loggedInUser$ = this.userService.loggedInUser$
  }
  onLogin() {
    this.userService.login()
  }
  onLogout() {
    this.userService.logout()
  }
  // onOpenCart(){
  //   this.router.navigateByUrl('/user')
  // }

}
