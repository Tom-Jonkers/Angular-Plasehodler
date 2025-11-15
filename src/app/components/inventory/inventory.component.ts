import { ApiService } from './../../services/api.service';
import { Card } from './../../models/models';
import { Component } from '@angular/core';
import { CardSortComponent } from '../card-sort/card-sort.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CardSortComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {
  constructor(public api: ApiService) {

  }

  cardList: Card[] = []

  async ngOnInit(): Promise<void> {
    this.cardList = await this.api.getPlayersCards()
    this.cardList.sort(function (a, b) {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })
  }


}
