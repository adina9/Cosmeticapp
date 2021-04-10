import { Item } from "./item";

export interface User {
    id: string,
    name: string,
    items: Item[]
}
