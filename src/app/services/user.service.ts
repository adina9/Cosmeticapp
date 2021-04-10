import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Item } from '../models/item';
import { User } from '../models/user';
import { storageService } from './async-storage.service';
// import { User } from '../models/user';
// import { storageService } from './async-storage.service';

const ENTITYU='user'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _user = { id: 'u101', name: 'Popo', items: [] }
  private _loggedInUser$:BehaviorSubject<User> = new BehaviorSubject(this._user)
  // private _loggedInUser$ = new BehaviorSubject(this._user)
  public loggedInUser$ = this._loggedInUser$.asObservable()

  constructor() { 
    const users=JSON.parse(localStorage.getItem(ENTITYU))
    if(!users||!users.length){
      localStorage.setItem(ENTITYU,JSON.stringify(this._user))
    }
  }

 buyItem(item: Item) {
    const user = this._loggedInUser$.getValue()
    user.items.push(item)
    this._loggedInUser$.next(user)
    // this.save(user)
    // var savedUser=await storageService.put(ENTITYU,user)
    this.tempPutFunc(user)


  }

private tempPutFunc(user){
  var userToUpdate=JSON.parse(localStorage.getItem(ENTITYU))
  userToUpdate={...user}
  localStorage.setItem(ENTITYU,JSON.stringify (userToUpdate))
}

  public save(user) {
    const method = user.id ? 'put' : 'post'
    const prmSavedItem = storageService[method](ENTITYU, user)
    return from(prmSavedItem) as Observable<User>
  }
  login() {
    this._loggedInUser$.next(this._user)
  }
  logout() {
    this._loggedInUser$.next(null)
  }
  // public getById(userId: string): Observable<User> {
  //   return from(storageService.get(ENTITYU, userId) as Promise<User>)
  // }

}
