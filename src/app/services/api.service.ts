import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Card, Paquet, Deck, OwnedCard, Match, Player, MatchDTO } from '../models/models';
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  serverUrl = environment.apiUrl;
  //serverUrl = "http://localhost:5276/";


  constructor(public http: HttpClient) { }

  async getAllCards(): Promise<Card[]> {
    let result = await lastValueFrom(this.http.get<Card[]>(this.serverUrl + 'api/card/GetAllCards'));
    console.log(result)
    return result;
  }

  async getPlayersCards(): Promise<Card[]> {
    let result = await lastValueFrom(this.http.get<Card[]>(this.serverUrl + 'api/card/GetPlayersCards', {
    }));
    console.log(result)
    return result;
  }

  async getAllPaquets(): Promise<Paquet[]> {
    let result = await lastValueFrom(this.http.get<Paquet[]>(this.serverUrl + 'api/paquet/GetAllPaquets'));
    return result;
  }

  async OpenPack(paquet: Paquet): Promise<Card[]> {
    let result = await lastValueFrom(this.http.post<Card[]>(this.serverUrl + 'api/paquet/OpenPack', paquet, {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      }
    }));
    return result;
  }

  async getPlayersOwnedCards(): Promise<OwnedCard[]> {
    let result = await lastValueFrom(this.http.get<OwnedCard[]>(this.serverUrl + 'api/card/GetPlayersOwnedCards', {
    }));

    return result;
  }

  async getPlayerDecks(): Promise<Deck[]> {
    let result = await lastValueFrom(this.http.get<Deck[]>(this.serverUrl + 'api/deck/GetPlayerDecks', {

    }));

    return result;
  }

  async createDeck(deckName: string): Promise<any> {
    return await lastValueFrom(this.http.post(this.serverUrl + 'api/deck/CreateDeck',
      { name: deckName },
    ));
  }

  async setCurrentDeck(deckId: number): Promise<any> {
    return await lastValueFrom(this.http.put(this.serverUrl + 'api/deck/SetCurrentDeck/' + deckId,
      {}
    ));
  }

  async addCardToDeck(deckId: number, ownedCardId: number): Promise<any> {
    return await lastValueFrom(this.http.post(this.serverUrl + 'api/deck/AddCardToDeck', {
      deckId: deckId,
      ownedCardId: ownedCardId
    }));
  }

  async removeCardFromDeck(deckId: number, ownedCardId: number): Promise<any> {
    return await lastValueFrom(this.http.post(this.serverUrl + 'api/deck/RemoveCardFromDeck', {
      deckId: deckId,
      ownedCardId: ownedCardId
    }));
  }

  async deleteDeck(deckId: number): Promise<any> {
    return await lastValueFrom(this.http.delete(this.serverUrl + 'api/deck/DeleteDeck/' + deckId));
  }

  async getMatches(): Promise<MatchDTO[]> {
    let result = await lastValueFrom(this.http.get<MatchDTO[]>(this.serverUrl + 'api/match/GetALlMatches'))
    console.log(result)
    return result
  }

  async getCurrentPlayer(): Promise<any> {
    let result = await lastValueFrom(this.http.get<Player[]>(this.serverUrl + 'api/account/GetCurrentPlayer', {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem("token")
      }
    }));
    return result;
  }

  async getELO(): Promise<any> {
    return await lastValueFrom(this.http.get<number>(this.serverUrl + 'api/Account/GetPlayerELO'))
  }
}

