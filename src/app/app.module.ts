import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItemAppComponent } from './pages/item-app/item-app.component';
import { AboutComponent } from './pages/about/about.component';
import { AppHeaderComponent } from './cmps/app-header/app-header.component';
import { AppFilterComponent } from './cmps/app-filter/app-filter.component';
import { ItemPreviewComponent } from './cmps/item-preview/item-preview.component';
import { ItemDetailsComponent } from './pages/item-details/item-details.component';
import { ItemEditComponent } from './pages/item-edit/item-edit.component';
import { ReviewsComponent } from './cmps/reviews/reviews.component';
import { UserCartComponent } from './pages/user-cart/user-cart.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemAppComponent,
    AboutComponent,
    AppHeaderComponent,
    AppFilterComponent,
    ItemPreviewComponent,
    ItemDetailsComponent,
    ItemEditComponent,
    ReviewsComponent,
    UserCartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
