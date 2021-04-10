import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolverService {

  constructor(private userService:UserService,private router:Router) { }
  resolve(route:ActivatedRouteSnapshot):Observable<User>{
    const {id}=route.params
    if(!id){
      this.router.navigateByUrl('/')
      return null
    }
    // return this.userService.getById(id)
  }
}
