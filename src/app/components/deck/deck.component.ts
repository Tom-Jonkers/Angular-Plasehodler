import { Component } from '@angular/core';
import {Card, Deck, OwnedCard} from 'src/app/models/models';
import { ApiService } from 'src/app/services/api.service';
import { CardComponent } from "../card/card.component";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-deck',
  standalone: true,
  imports: [CardComponent, MatButtonModule, MatIconModule, MatMenuModule, CommonModule],
  templateUrl: './deck.component.html',
  styleUrl: './deck.component.css'
})
export class DeckComponent {
  decks: Deck[] = [];
  availableCards: OwnedCard[] = [];
  selectedDeckId: number | null = null;

  constructor(public api: ApiService) {

  }

  async ngOnInit() {
    this.decks = await this.api.getPlayerDecks();
    this.sortDecks();
  }

  async createNewDeck() {
    const deckName = prompt('Nom du nouveau deck:');
    if (deckName) {
        await this.api.createDeck(deckName);
        // Rafraîchir la liste des decks après création
        this.decks = await this.api.getPlayerDecks();
        this.sortDecks();
    }
  }

  async setCurrentDeck(deckId: number) {
    try {
      await this.api.setCurrentDeck(deckId);
      // Rafraîchir la liste des decks après mise à jour
      this.decks = await this.api.getPlayerDecks();
      this.sortDecks();
    } catch (error) {
      console.error('Erreur lors de la définition du deck courant', error);
    }
  }

  // Méthode pour trier les decks avec le deck courant en premier
  sortDecks() {
    this.decks.sort((a, b) => {
      if (a.isCurrent) return -1;
      if (b.isCurrent) return 1;
      return 0;
    });
  }

  // Méthode pour ouvrir le menu d'ajout de cartes
  async openAddCardMenu(deckId: number) {
    this.selectedDeckId = deckId;

    // Récupérer toutes les cartes du joueur
    const playerCards = await this.api.getPlayersOwnedCards();

    // Récupérer les cartes déjà dans le deck sélectionné
    const deckOwnedCards = this.decks.find(d => d.id === deckId)?.ownedCards || [];

    // Filtrer pour ne garder que les cartes qui ne sont pas déjà dans le deck
    this.availableCards = playerCards.filter(oc =>
      !deckOwnedCards.some(deckOwnedCard => deckOwnedCard.id === oc.id)
    );
  }

  async addCardToDeck(cardId: number) {
    if (this.selectedDeckId) {
      try {
        await this.api.addCardToDeck(this.selectedDeckId, cardId);

        // Rafraîchir la liste des decks après ajout de la carte
        this.decks = await this.api.getPlayerDecks();
        this.sortDecks();
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la carte au deck', error);
      }
    }
  }

  async removeCardFromDeck(deckId: number, ownedCardId: number) {
    try {
      await this.api.removeCardFromDeck(deckId, ownedCardId);

      // Rafraîchir la liste des decks après suppression de la carte
      this.decks = await this.api.getPlayerDecks();
      this.sortDecks();
    } catch (error) {
      console.error('Erreur lors de la suppression de la carte du deck', error);
    }
  }

  async deleteDeck(deckId: number) {
    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce deck ?');
    if (confirmation) {
      try {
        await this.api.deleteDeck(deckId);
        // Rafraîchir la liste des decks après suppression
        this.decks = await this.api.getPlayerDecks();
        this.sortDecks();
      } catch (error) {
        console.error('Erreur lors de la suppression du deck', error);
      }
    }
  }
}
