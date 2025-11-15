import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Card, Paquet } from 'src/app/models/models';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogOpenPackComponent } from '../dialog-open-pack/dialog-open-pack.component';
import { MatchService } from 'src/app/services/match.service';


@Component({
  selector: 'app-packs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './packs.component.html',
  styleUrl: './packs.component.css'
})
export class PacksComponent {

  constructor(public api: ApiService, public dialog: MatDialog, public matchService: MatchService) {

  }

  money: number = parseInt(sessionStorage.getItem("playermoney")!)

  cartesRecuperes: Card[] = []

  paquetList: Paquet[] = []

  async ngOnInit() {
    this.paquetList = await this.api.getAllPaquets();

    console.log(this.money);
  }

  async openPack(paquet: Paquet) {
    if (this.money < paquet.cost) {
      alert("Vous n'avez pas assez d'argent !")
      return;
    }
    this.money -= paquet.cost;
    sessionStorage.setItem("playermoney", this.money.toString());
    this.matchService.initializePlayer();

    let cards = await this.api.OpenPack(paquet);
    this.cartesRecuperes = cards;

    this.dialog.open(DialogOpenPackComponent, {
      width: 'auto',
      maxWidth: 'none',
      height: 'auto',
      maxHeight: '90vh',
      data: { cards: this.cartesRecuperes }
    });
  }

}
