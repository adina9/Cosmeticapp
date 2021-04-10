export interface Item {
    id: string,
    name: string,
    description: string,
    img: string,
    price: number,
    category: string,
    inStock: boolean,
    reviews:Array<any>,
    isBought:boolean
}
