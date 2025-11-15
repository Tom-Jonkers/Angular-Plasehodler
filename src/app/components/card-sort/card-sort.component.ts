import { ApiService } from './../../services/api.service';
import { Card } from './../../models/models';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';

interface Field {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-card-sort',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, CardComponent],
  templateUrl: './card-sort.component.html',
  styleUrl: './card-sort.component.css'
})
export class CardSortComponent {

  constructor(public router: Router) {

  }

  @Input() cardList: Card[] = []
  fieldSelect = ""
  orderSelect = "ascending"

  async ngOnInit(): Promise<void> {
    this.updateSort()
    console.log(this.cardList)
  }

  fields: Field[] = [
    { value: 'attack', viewValue: 'Attaque' },
    { value: 'health', viewValue: 'Points de vie' },
    { value: 'cost', viewValue: 'Coût en Mana' },
  ];

  order: Field[] = [
    { value: 'ascending', viewValue: 'Croissant' },
    { value: 'descending', viewValue: 'Décroissant' }
  ]

  updateSort() {
    this.cardList.sort(function (a, b) {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })
    if (this.fieldSelect == 'attack') {
      this.cardList.sort((a, b) => a.attack - b.attack)
      console.log("attack sort")
    }
    else if (this.fieldSelect == 'health') {
      this.cardList.sort((a, b) => a.health - b.health)
      console.log("health sort")
    }
    else if (this.fieldSelect == 'cost') {
      this.cardList.sort((a, b) => a.cost - b.cost)
      console.log("cost sort")
    }

    if (this.fieldSelect != '') {
      if (this.orderSelect == 'descending') {
        this.cardList.reverse()
        console.log("descending, flipped!")
      }
    }
  }

}
