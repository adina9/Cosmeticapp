import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { ItemAppComponent } from './pages/item-app/item-app.component';
import { ItemDetailsComponent } from './pages/item-details/item-details.component';
import { ItemEditComponent } from './pages/item-edit/item-edit.component';
import { UserCartComponent } from './pages/user-cart/user-cart.component';
import { ItemResolverService } from './services/item-resolver.service';

const routes: Routes = [
  {
    path: 'item/edit/:id',
    component: ItemEditComponent,
    resolve: { item: ItemResolverService },
    runGuardsAndResolvers: 'paramsChange'
  },
  {
    path: 'item/edit',
    component: ItemEditComponent
  },
  {
    path: 'item/:id',
    component: ItemDetailsComponent,
    resolve: { item: ItemResolverService },
    runGuardsAndResolvers: 'paramsChange'
  },
  {
    path: 'cart/item/:id',
    component: ItemDetailsComponent,
    resolve: { item: ItemResolverService },
    runGuardsAndResolvers: 'paramsChange'
  },
  {
    path:'cart',
    component:UserCartComponent,
    runGuardsAndResolvers: 'paramsChange'
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path:'',
    component: ItemAppComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
