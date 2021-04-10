import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { FilterBy } from '../models/filter-by';
import { Item } from '../models/item';
import { storageService } from './async-storage.service';


const ENTITY = 'item'

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor() {

    this.itemsDB=this._shuffleArr(this.itemsDB)
    const items = JSON.parse(localStorage.getItem(ENTITY) || 'null')
    if (!items || !items.length) {
      localStorage.setItem(ENTITY, JSON.stringify(this.itemsDB))
    }

  }

  private initialFilter = {
    term: '',
    category: '',
    minPrice: null,
    maxPrice: null
  }

  private _items$: BehaviorSubject<Item[]> = new BehaviorSubject(null)
  public items$: Observable<Item[]> = this._items$.asObservable()

  private _filterBy$: BehaviorSubject<FilterBy> = new BehaviorSubject(this.initialFilter)
  public filterBy$: Observable<FilterBy> = this._filterBy$.asObservable()

  private itemInterval = null

  public async query() {
    console.log('itemsDB:', this.itemsDB);

    const filterBy = this._filterBy$.getValue()
    var items = (await storageService.query(ENTITY)) as Item[]
    // items = this._shuffleArr(items)
    console.log('items:', items);

    const filteredItems = this._filterItems(items, filterBy).map(item => ({ ...item, inStock: Math.random() > 0.5 }))
    this._items$.next(filteredItems)
    // if (!this.itemInterval) this.itemInterval = setInterval(this.query.bind(this), 5000)
  }

  public getById(itemId: string): Observable<Item> {
    return from(storageService.get(ENTITY, itemId) as Promise<Item>)
  }

  public setFilter(filterBy) {
    this._filterBy$.next(filterBy)
    this.query()
  }

  public async remove(itemId: string) {
    try {
      await storageService.remove(ENTITY, itemId)
      const items = this._items$.getValue()
      if (!items) throw Error('No items in data')
      const itemIdx = items.findIndex(item => item.id === itemId)
      if (itemIdx === -1) throw Error('Item not found!')
      items.splice(itemIdx, 1)
      this._items$.next(items)
    } catch (err) {
      console.log('Could not remove item', itemId, err);
    }
  }


  public save(item) {
    const method = item.id ? 'put' : 'post'
    const prmSavedItem = storageService[method](ENTITY, item)
    return from(prmSavedItem) as Observable<Item>
  }

  public getEmptyItem(): Item {
    return {
      id: '',
      name: '',
      description: '',
      img: '',
      price: null,
      category: '',
      inStock: false,
      reviews:[],
      isBought:false
    }
  }
  
public async addReview(itemId,review){
  const items = (await storageService.query(ENTITY)) as Item[]
  var item=items.find(currItem=>currItem.id===itemId)
  if (!item.reviews) {
    item.reviews = []
    item.reviews.push(review)
} else item.reviews.push(review)
  var savedItem=await storageService.put(ENTITY,item)
  return savedItem
}

public async deleteReview(itemId, reviewId) {
  const items = (await storageService.query(ENTITY)) as Item[]
  var item = items.find(currItem => currItem.id === itemId)
  let idx = item.reviews.findIndex(
      (currReview) => currReview.id === reviewId
  );
  item.reviews.splice(idx, 1)
  var savedItem= await storageService.put(ENTITY,item)
  return savedItem
}

  private _filterItems(items: Item[], filterBy: FilterBy) {
    return items.filter(item => {
      const termRegex = new RegExp(filterBy.term, 'ig')
      const categoryRegex = new RegExp(filterBy.category, 'ig')
      const minPrice = filterBy.minPrice || 0
      const maxPrice = filterBy.maxPrice || Number.MAX_SAFE_INTEGER
      const isStringMatched = termRegex.test(item.name) && categoryRegex.test(item.category)
      return isStringMatched && item.price > minPrice && item.price < maxPrice
    })
  }

  private _shuffleArr(items) {
    var copyArray = JSON.parse(JSON.stringify(items))
    for (var i = copyArray.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = copyArray[i];
      copyArray[i] = copyArray[j];
      copyArray[j] = temp;
    }
    return copyArray;
  }

  public _makeId(length = 5) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

 public async updateItem(itemId){
  var item=(await storageService.get(ENTITY,itemId))as Item
  console.log('item%%',item);
  
let itemToUpdate={
  ...item,
  isBought:true
}
var boughtItem=await storageService.put(ENTITY,itemToUpdate)
console.log('boughtItem',boughtItem);

return boughtItem

}

  private itemsDB = [
    {
      id: this._makeId(),
      name: 'Lash Effect Mascara',
      description: 'the conic shape fiber brush delivers dramatic volume and sculpted length WITHOUT clumps or globs.',
      img: 'https://images-na.ssl-images-amazon.com/images/I/61nvmVTF12L._AC_UL200_SR200,200_.jpg',
      price: 20.99,
      category: 'eyes',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'High Washable Mascara Makeup',
      description: 'This Maybelline volumizing and lengthening mascara formula is infused with bamboo Extract and fibers for long, full lashes that never get weighed down',
      img: 'https://images-na.ssl-images-amazon.com/images/I/71e5-Rxbp7L._AC_UL200_SR200,200_.jpg',
      price: 31.50,
      category: 'eyes',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'High Washable Mascara Makeup',
      description: 'exclusive flex tower mascara brush bends to volumize and extend every single lash from root to tip',
      img: 'https://images-na.ssl-images-amazon.com/images/I/71KrjFsWfSL._AC_UL200_SR200,200_.jpg',
      price: 17.50,
      category: 'eyes',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Voluminous Original Mascara',
      description: 'The Volume Maximizing Brush thickens lashes evenly & smoothly. Suitable for sensitive eyes & contact lens wearers',
      img: 'https://images-na.ssl-images-amazon.com/images/I/61C9XH0Az-L._AC_UL200_SR200,200_.jpg',
      price: 25,
      category: 'eyes',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Lash Sensational Washable Mascara',
      description: 'Exclusive fanning mascara brush with ten layers of bristles reveals layers of lashes for a sensational full-fan effect',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51tvj%2BDeJML._AC_UL200_SR200,200_.jpg',
      price: 19.90,
      category: 'eyes',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Lash Enhancing Serum',
      description: 'The Volume Maximizing Brush thickens lashes evenly & smoothly',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51ItwgU0zdL._AC_UL200_SR200,200_.jpg',
      price: 34,
      category: 'eyes',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Instant Lift Brow Pencil',
      description: 'The dual-sided design applies cream-consistency color with the fine-tip liner on one side and tames and Combs brows with the other to create defined-looking eyebrows with a flawless arch.',
      img: 'https://images-na.ssl-images-amazon.com/images/I/61aS1Dh3qVL._AC_UL200_SR200,200_.jpg',
      price: 3,
      category: 'eyes',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'ColorStay Skinny Liquid Eyeliner',
      description: 'Waterproof, Smudgeproof, Longwearing Eye Makeup with Ultra-Fine Tip, Black Out',
      img: 'https://images-na.ssl-images-amazon.com/images/I/616rt-tl-lL._AC_UL200_SR200,200_.jpg',
      price: 20,
      category: 'eyes',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Perfect Blend Eyeliner Pencil',
      description: 'An all-in-one, long-lasting, eye pencil that enhances the eye contour and inner eye',
      img: 'https://images-na.ssl-images-amazon.com/images/I/61zzTzcPjYL._AC_UL200_SR200,200_.jpg',
      price: 17,
      category: 'eyes',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Brow definer',
      description: '',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51vWiu8pmVL._AC_UL200_SR200,200_.jpg',
      price: 22,
      category: 'eyes',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Riche Lipcolour, Blushing Berry',
      description: ' Keep lips soft, smooth, and ultra-hydrated with Colour Riche Lipstick. Choose from a spectrum of show-stopping shades, for lasting, creamy color that delivers intense hydration.',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51S7s3CvpSL._AC_UL200_SR200,200_.jpg',
      price: 6,
      category: 'lips',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Glass Shine Lipstick',
      description: 'The creamy, smooth stick melts onto lips thanks to the unique blend of low-melting-point waxes in the formula',
      img: 'https://images-na.ssl-images-amazon.com/images/I/81lENM6thLL._AC_UL200_SR200,200_.jpg',
      price: 12.90,

      category: 'lips',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'MAKEUP Butter Gloss',
      description: 'Buttery soft & silky smooth, our decadent Butter Gloss is available in a wide variety of sumptuous shades',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51laB6ewuFL._AC_UL200_SR200,200_.jpg',
      price: 14.50,
      category: 'lips',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Revlon ColorStay Overtime Lipcolor',
      description: 'Pigment stays vibrant without smudging, bleeding, or feathering throughout the day',
      img: 'https://images-na.ssl-images-amazon.com/images/I/61jO05MI9rL._AC_UL200_SR200,200_.jpg',
      price: 10,
      category: 'lips',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Matte Lip Crayon',
      description: 'Matte Lip Crayon that delivers the smoothness of a gloss and moisture of a balm',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51eARlKqMfL._AC_UL200_SR200,200_.jpg',
      price: 9.90,
      category: 'lips',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Liquid Catsuit Lipstick',
      description: 'This bold liquid lipstick that glides on glossy & sets as with a matte lipstick finish',
      img: 'https://images-na.ssl-images-amazon.com/images/I/61iGsWMHH6L._AC_UL200_SR200,200_.jpg',
      price: 12,
      category: 'lips',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Continuous Color Lipstick',
      description: 'Covergirl Continuous Color Lipstick, 770 Bronzed Glow',
      img: 'https://images-na.ssl-images-amazon.com/images/I/61PYZHh--mL._AC_UL200_SR200,200_.jpg',
      price: 16,
      category: 'lips',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Plumping Lip Cream',
      description: 'Buxom Full-On Plumping Lip Cream',
      img: 'https://images-na.ssl-images-amazon.com/images/I/513I12nf0fL._AC_UL200_SR200,200_.jpg',
      price: 21.90,
      category: 'lips',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Hydrating Lip Gloss',
      description: 'This hydrating formula keeps lips soft, smooth, colorful and glossy for 8 shining hours',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51hTD6uObxL._AC_UL200_SR200,200_.jpg',
      price: 14.99,
      category: 'lips',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Matte Lip Stain',
      description: 'Introducing Rouge Signature Matte Lip stain',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51aYOUcHVHL._AC_UL200_SR200,200_.jpg',
      price: 15.50,
      category: 'lips',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Tinted Hydrating Gel Cream ',
      description: 'The package weight of the product is 2.3 ounces',
      img: 'https://images-na.ssl-images-amazon.com/images/I/814ITtauJiL._AC_UL200_SR200,200_.jpg',
      price: 35,
      category: 'face',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'True Match Powder',
      description: ' provides a natural finish, with undetectable coverage that feels like a second skin',
      img: 'https://images-na.ssl-images-amazon.com/images/I/61TW2hzuGFL._AC_UL200_SR200,200_.jpg',
      price: 19.90,
      category: 'face',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'imply Ageless Instant Wrinkle-Defying Foundation',
      description: 'This anti-aging foundation diminishes the look of fine lines and wrinkles for a more youthful glow',
      img: 'https://images-na.ssl-images-amazon.com/images/I/61lPxAAx1iL._AC_UL200_SR200,200_.jpg',
      price: 27.90,
      category: 'face',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Paris Makeup Infallible',
      description: 'Lightweight and creamy, foundation goes on smooth with a demi-matte finish that lasts up to 24 hours',
      img: 'https://images-na.ssl-images-amazon.com/images/I/71vYYDDvAUL._AC_UL200_SR200,200_.jpg',
      price: 11.50,
      category: 'face',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Murumuru Butter, Bronzer',
      description: 'Give your face the radiant goddess glow of the tropics Pick your color and watch your look gently transform as the refined pearls and soft-focus pigments smooth and brighten your skin tone with a subtle shimmer finish',
      img: 'https://images-na.ssl-images-amazon.com/images/I/81rrNVnrfGL._AC_UL200_SR200,200_.jpg',
      price: 12,
      category: 'face',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Perfect Cover BB Cream',
      description: 'Smoothly conceals imperfections, balances skin tone, and visibly smooths complexion for a youthfully perfected look',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51GL-iELcfL._AC_UL200_SR200,200_.jpg',
      price: 18.90,
      category: 'face',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Foundation BB Cream',
      description: 'Lightweight, Blends Naturally, Flawless Finish',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51zwG0o8s0L._AC_UL200_SR200,200_.jpg',
      price: 19.90,
      category: 'face',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Creme Contour Palette',
      description: 'Black Radiance True Complexion Contour Palette highlights, shapes, & sculpts facial features for naturally enhanced definition',
      img: 'https://images-na.ssl-images-amazon.com/images/I/71ECqXIg4EL._AC_UL200_SR200,200_.jpg',
      price: 15.50,
      category: 'face',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Concealer Color Correcting Palette',
      description: 'Color Correcting Concealer Palette: This palette features 6 color correcting concealers expertly chosen to work together to conceal problem areas',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51NTnvNZHJL._AC_UL200_SR200,200_.jpg',
      price: 8.99,
      category: 'face',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Perfects Skin, Sets Makeup',
      description: 'Paris Hydra Perfecte Perfecting Loose Face Powder, Minimizes Pores & Perfects Skin, Sets Makeup, Long-lasting and Lightweight, with Moisturizers to Nourish',
      img: 'https://images-na.ssl-images-amazon.com/images/I/71xrVY8iY4L._AC_UL200_SR200,200_.jpg',
      price: 22.50,
      category: 'face',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Formula Powder Palette',
      description: 'Physicians Formula powder palette color corrective powders, beige, 0.3-ounces',
      img: 'https://images-na.ssl-images-amazon.com/images/I/816BkWGrk2L._AC_UL200_SR200,200_.jpg',
      price: 17,
      category: 'face',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'High Washable Mascara Makeup',
      description: 'This Maybelline volumizing and lengthening mascara formula is infused with bamboo Extract and fibers for long, full lashes that never get weighed down',
      img: 'https://images-na.ssl-images-amazon.com/images/I/71e5-Rxbp7L._AC_UL200_SR200,200_.jpg',
      price: 31.50,
      category: 'eyes',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'High Washable Mascara Makeup',
      description: 'exclusive flex tower mascara brush bends to volumize and extend every single lash from root to tip',
      img: 'https://images-na.ssl-images-amazon.com/images/I/71KrjFsWfSL._AC_UL200_SR200,200_.jpg',
      price: 17.50,
      category: 'eyes',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Voluminous Original Mascara',
      description: 'The Volume Maximizing Brush thickens lashes evenly & smoothly. Suitable for sensitive eyes & contact lens wearers',
      img: 'https://images-na.ssl-images-amazon.com/images/I/61C9XH0Az-L._AC_UL200_SR200,200_.jpg',
      price: 25,
      category: 'eyes',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Lash Sensational Washable Mascara',
      description: 'Exclusive fanning mascara brush with ten layers of bristles reveals layers of lashes for a sensational full-fan effect',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51tvj%2BDeJML._AC_UL200_SR200,200_.jpg',
      price: 19.90,
      category: 'eyes',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Lash Enhancing Serum',
      description: 'The Volume Maximizing Brush thickens lashes evenly & smoothly',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51ItwgU0zdL._AC_UL200_SR200,200_.jpg',
      price: 34,
      category: 'eyes',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Instant Lift Brow Pencil',
      description: 'The dual-sided design applies cream-consistency color with the fine-tip liner on one side and tames and Combs brows with the other to create defined-looking eyebrows with a flawless arch.',
      img: 'https://images-na.ssl-images-amazon.com/images/I/61aS1Dh3qVL._AC_UL200_SR200,200_.jpg',
      price: 3,
      category: 'eyes',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'ColorStay Skinny Liquid Eyeliner',
      description: 'Waterproof, Smudgeproof, Longwearing Eye Makeup with Ultra-Fine Tip, Black Out',
      img: 'https://images-na.ssl-images-amazon.com/images/I/616rt-tl-lL._AC_UL200_SR200,200_.jpg',
      price: 20,
      category: 'eyes',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Perfect Blend Eyeliner Pencil',
      description: 'An all-in-one, long-lasting, eye pencil that enhances the eye contour and inner eye',
      img: 'https://images-na.ssl-images-amazon.com/images/I/61zzTzcPjYL._AC_UL200_SR200,200_.jpg',
      price: 17,
      category: 'eyes',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Brow definer',
      description: '',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51vWiu8pmVL._AC_UL200_SR200,200_.jpg',
      price: 22,
      category: 'eyes',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Riche Lipcolour, Blushing Berry',
      description: ' Keep lips soft, smooth, and ultra-hydrated with Colour Riche Lipstick. Choose from a spectrum of show-stopping shades, for lasting, creamy color that delivers intense hydration.',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51S7s3CvpSL._AC_UL200_SR200,200_.jpg',
      price: 6,
      category: 'lips',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Glass Shine Lipstick',
      description: 'The creamy, smooth stick melts onto lips thanks to the unique blend of low-melting-point waxes in the formula',
      img: 'https://images-na.ssl-images-amazon.com/images/I/81lENM6thLL._AC_UL200_SR200,200_.jpg',
      price: 12.90,

      category: 'lips',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'MAKEUP Butter Gloss',
      description: 'Buttery soft & silky smooth, our decadent Butter Gloss is available in a wide variety of sumptuous shades',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51laB6ewuFL._AC_UL200_SR200,200_.jpg',
      price: 14.50,
      category: 'lips',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Revlon ColorStay Overtime Lipcolor',
      description: 'Pigment stays vibrant without smudging, bleeding, or feathering throughout the day',
      img: 'https://images-na.ssl-images-amazon.com/images/I/61jO05MI9rL._AC_UL200_SR200,200_.jpg',
      price: 10,
      category: 'lips',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Matte Lip Crayon',
      description: 'Matte Lip Crayon that delivers the smoothness of a gloss and moisture of a balm',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51eARlKqMfL._AC_UL200_SR200,200_.jpg',
      price: 9.90,
      category: 'lips',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Liquid Catsuit Lipstick',
      description: 'This bold liquid lipstick that glides on glossy & sets as with a matte lipstick finish',
      img: 'https://images-na.ssl-images-amazon.com/images/I/61iGsWMHH6L._AC_UL200_SR200,200_.jpg',
      price: 12,
      category: 'lips',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Continuous Color Lipstick',
      description: 'Covergirl Continuous Color Lipstick, 770 Bronzed Glow',
      img: 'https://images-na.ssl-images-amazon.com/images/I/61PYZHh--mL._AC_UL200_SR200,200_.jpg',
      price: 16,
      category: 'lips',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Plumping Lip Cream',
      description: 'Buxom Full-On Plumping Lip Cream',
      img: 'https://images-na.ssl-images-amazon.com/images/I/513I12nf0fL._AC_UL200_SR200,200_.jpg',
      price: 21.90,
      category: 'lips',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Hydrating Lip Gloss',
      description: 'This hydrating formula keeps lips soft, smooth, colorful and glossy for 8 shining hours',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51hTD6uObxL._AC_UL200_SR200,200_.jpg',
      price: 14.99,
      category: 'lips',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Matte Lip Stain',
      description: 'Introducing Rouge Signature Matte Lip stain',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51aYOUcHVHL._AC_UL200_SR200,200_.jpg',
      price: 15.50,
      category: 'lips',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Tinted Hydrating Gel Cream ',
      description: 'The package weight of the product is 2.3 ounces',
      img: 'https://images-na.ssl-images-amazon.com/images/I/814ITtauJiL._AC_UL200_SR200,200_.jpg',
      price: 35,
      category: 'face',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'True Match Powder',
      description: ' provides a natural finish, with undetectable coverage that feels like a second skin',
      img: 'https://images-na.ssl-images-amazon.com/images/I/61TW2hzuGFL._AC_UL200_SR200,200_.jpg',
      price: 19.90,
      category: 'face',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'imply Ageless Instant Wrinkle-Defying Foundation',
      description: 'This anti-aging foundation diminishes the look of fine lines and wrinkles for a more youthful glow',
      img: 'https://images-na.ssl-images-amazon.com/images/I/61lPxAAx1iL._AC_UL200_SR200,200_.jpg',
      price: 27.90,
      category: 'face',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Paris Makeup Infallible',
      description: 'Lightweight and creamy, foundation goes on smooth with a demi-matte finish that lasts up to 24 hours',
      img: 'https://images-na.ssl-images-amazon.com/images/I/71vYYDDvAUL._AC_UL200_SR200,200_.jpg',
      price: 11.50,
      category: 'face',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Murumuru Butter, Bronzer',
      description: 'Give your face the radiant goddess glow of the tropics Pick your color and watch your look gently transform as the refined pearls and soft-focus pigments smooth and brighten your skin tone with a subtle shimmer finish',
      img: 'https://images-na.ssl-images-amazon.com/images/I/81rrNVnrfGL._AC_UL200_SR200,200_.jpg',
      price: 12,
      category: 'face',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Perfect Cover BB Cream',
      description: 'Smoothly conceals imperfections, balances skin tone, and visibly smooths complexion for a youthfully perfected look',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51GL-iELcfL._AC_UL200_SR200,200_.jpg',
      price: 18.90,
      category: 'face',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Foundation BB Cream',
      description: 'Lightweight, Blends Naturally, Flawless Finish',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51zwG0o8s0L._AC_UL200_SR200,200_.jpg',
      price: 19.90,
      category: 'face',
      inStock: true, 
      isBought:false
    },
    {
      id: this._makeId(),
      name: 'Creme Contour Palette',
      description: 'Black Radiance True Complexion Contour Palette highlights, shapes, & sculpts facial features for naturally enhanced definition',
      img: 'https://images-na.ssl-images-amazon.com/images/I/71ECqXIg4EL._AC_UL200_SR200,200_.jpg',
      price: 15.50,
      category: 'face',
      inStock: true, 
      isBought:false
    },
    {
      id: this._makeId(),
      name: 'Concealer Color Correcting Palette',
      description: 'Color Correcting Concealer Palette: This palette features 6 color correcting concealers expertly chosen to work together to conceal problem areas',
      img: 'https://images-na.ssl-images-amazon.com/images/I/51NTnvNZHJL._AC_UL200_SR200,200_.jpg',
      price: 8.99,
      category: 'face',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Perfects Skin, Sets Makeup',
      description: 'Paris Hydra Perfecte Perfecting Loose Face Powder, Minimizes Pores & Perfects Skin, Sets Makeup, Long-lasting and Lightweight, with Moisturizers to Nourish',
      img: 'https://images-na.ssl-images-amazon.com/images/I/71xrVY8iY4L._AC_UL200_SR200,200_.jpg',
      price: 22.50,
      category: 'face',
      inStock: true, isBought:false
    },
    {
      id: this._makeId(),
      name: 'Formula Powder Palette',
      description: 'Physicians Formula powder palette color corrective powders, beige, 0.3-ounces',
      img: 'https://images-na.ssl-images-amazon.com/images/I/816BkWGrk2L._AC_UL200_SR200,200_.jpg',
      price: 17,
      category: 'face',
      inStock: false
    }
  ]
}
