import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'item-preview',
  templateUrl: './item-preview.component.html',
  styleUrls: ['./item-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemPreviewComponent implements OnInit {

  @Input() item: Item
  @Output() onBuyItem = new EventEmitter<Item>()

  constructor() { }

  ngOnInit(): void {
  }

}
