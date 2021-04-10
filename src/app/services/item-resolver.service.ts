import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Item } from '../models/item';
import { ItemService } from './item.service';

@Injectable({
  providedIn: 'root'
})
export class ItemResolverService {

  constructor(private itemService: ItemService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Item> {
    const { id } = route.params
    if (!id) {
      this.router.navigateByUrl('/')
      return null
    }
    return this.itemService.getById(id)
  }
}
