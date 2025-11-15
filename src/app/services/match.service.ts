import { ApiService } from 'src/app/services/api.service';
import { Card, MatchData, PlayableCard, Player } from 'src/app/models/models';
import { PlayerData } from '../models/models';
import { Injectable } from '@angular/core';
import { Match } from '../models/models';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  match: Match | null = null;
  matchData: MatchData | null = null;
  currentPlayerId: number = -1;

  player: Player | undefined
  playerData: PlayerData | undefined;
  adversaryData: PlayerData | undefined;

  opponentSurrendered: boolean = false;
  isCurrentPlayerTurn: boolean = false;

  moneyByWinner: number | null = null;
  moneyByLoser: number | null = null;

  ELObyWinner: number | null = null;
  ELObyLoser: number | null = null;

  constructor(public router: Router, public apiService: ApiService) {
    this.initializePlayer();
  }

  async initializePlayer() {
    let playerReq: Player = await this.apiService.getCurrentPlayer() as Player;
    const username = sessionStorage.getItem("username");
    const userId = sessionStorage.getItem("userId");
    const money = sessionStorage.getItem("playermoney");

    console.log(money + "$");

    if (username && userId && money) {
      this.player = {
        id: 1,
        name: username,
        userId: userId,
        money: parseInt(money, 10),
        nbVictoires: playerReq.nbVictoires,
        nbDefaites: playerReq.nbDefaites,
      };
    } else {
      console.warn("Les informations du joueur ne sont pas disponibles dans le sessionStorage.");
      this.player = {
        id: 1,
        name: '',
        userId: '',
        money: 0,
        nbVictoires: 0,
        nbDefaites: 0,
      };
    }
  }

  clearMatch() {
    this.match = null;
    this.matchData = null;
    this.playerData = undefined;
    this.adversaryData = undefined;
    this.opponentSurrendered = false;
    this.isCurrentPlayerTurn = false;
  }

  playMatch(matchData: MatchData, currentPlayerId: number) {
    this.matchData = matchData;
    this.match = matchData.match;
    this.currentPlayerId = currentPlayerId;

    if (this.match.playerDataA.playerId == this.currentPlayerId) {
      this.playerData = this.match.playerDataA!;
      this.playerData.playerName = matchData.playerA.name;
      this.adversaryData = this.match.playerDataB!;
      this.adversaryData.playerName = matchData.playerB.name;
      this.isCurrentPlayerTurn = this.match.isPlayerATurn;
    }
    else {
      this.playerData = this.match.playerDataB!;
      this.playerData.playerName = matchData.playerB.name;
      this.adversaryData = this.match.playerDataA!;
      this.adversaryData.playerName = matchData.playerA.name;
      this.isCurrentPlayerTurn = !this.match.isPlayerATurn;
    }
    this.playerData.maxhealth = 20;
    this.adversaryData.maxhealth = 20;

    // Trier les cartes par leur index pour qu'elle s'affichent correctement
    this.playerData.battleField.sort((a, b) => a.index - b.index)
    this.adversaryData.battleField.sort((a, b) => a.index - b.index)

    // Un peu nul comme code mais bon, desperate times call for desperate measures
    // (Sert a afficher la vie correctement sur les cartes)
    for (var card of this.playerData.battleField) {
      card.card.health = card.health
      card.card.attack = card.attack
    }

    for (var card of this.adversaryData.battleField) {
      card.card.health = card.health
      card.card.attack = card.attack
    }
  }


  // La méthode qui passe à travers l'arbre d'évènements reçu par le serveur
  // Utiliser pour mettre les données à jour et jouer les animations
  async applyEvent(event: any) {

    console.log("ApplyingEvent: " + event.eventType, event);

    //event.eventType = "EndMatch";

    switch (event.eventType) {
      case "JoiningMatchData": {
        this.matchData = event.matchData;

        await this.router.navigate(['/match/' + this.matchData?.match.id]);

        const playerId = sessionStorage.getItem("userId") === this.matchData?.playerA.userId ? this.matchData?.playerA.id : this.matchData?.playerB.id;

        this.playMatch(this.matchData!, playerId!);

        break;
      }

      case "StartMatch": {
        break;
      }

      case "GainMana": {
        // TODO
        let playerData = this.getPlayerData(event.playerId)
        if (playerData) {
          playerData.mana = event.mana
        }
        break;
      }

      case "PlayerEndTurn": {
        if (this.match) {
          this.match.isPlayerATurn = !this.match.isPlayerATurn;
          this.isCurrentPlayerTurn = event.playerId != this.currentPlayerId;
        }

        break;
      }
      case "DrawCard": {
        let playerData = this.getPlayerData(event.playerId);
        if (playerData) {
          this.moveCard(playerData.cardsPile, playerData.hand, event.playableCardId);
          await new Promise(resolve => setTimeout(resolve, 250));
        }

        break;
      }

      case "PlayCard": {
        let playerData = this.getPlayerData(event.playerId);
        if (playerData) {
          this.moveCard(playerData.hand, playerData.battleField, event.playableCardId);
          playerData.mana = event.playerMana
          await new Promise(resolve => setTimeout(resolve, 250));
        }
        break;
      }

      case "EndMatch": {
        if (!this.match!.isMatchCompleted) {
          this.matchData!.winningPlayerId = event.winningPlayerId;
          this.match!.isMatchCompleted = true;
          console.log(this.player?.name)
          if (event.winningPlayerId == this.currentPlayerId) {
            if (this.player) {
              this.player.money += event.moneyReceivedByWinner;
              console.log(event.moneyReceivedByWinner.toString() + "$");
              this.moneyByWinner = event.moneyReceivedByWinner;
              this.ELObyWinner = event.elOreceivedByWinner
              console.log(this.ELObyWinner + " 👍👍👍")
              sessionStorage.setItem("playermoney", this.player.money.toString());
            }
          } else {
            if (this.player) {
              this.player.money += event.moneyReceivedByLoser;
              console.log(event.moneyReceivedByLoser.toString() + "$");
              this.moneyByLoser = event.moneyReceivedByLoser;
              this.ELObyLoser = event.elOreceivedbyLoser
              console.log(this.ELObyLoser + " 👎👎👎")
              sessionStorage.setItem("playermoney", this.player.money.toString());
            }
          }
        }
        break;
      }

      // case "EndMatch": {
      //   if (!this.match!.isMatchCompleted) {
      //     this.matchData!.winningPlayerId = event.winningPlayerId;
      //     this.match!.isMatchCompleted = true;
      //     break;
      //   }
      // }

      case "Combat": {
        break;
      }

      case "CardActivation": {
        let playerData = this.getPlayerData(event.playerId);
        if (playerData) {
          let playableCard = playerData.battleField.find(c => c.id == event.playableCardId);
          if (playableCard) {
            console.log(playableCard.id + " SPIN 🌀")

            await new Promise(resolve => setTimeout(resolve, 250));
          }
        }
        break;
      }

      case "Heal": {
        break;
      }

      case "Chaos": {
        let playerData = this.getPlayerData(event.playerId);
        if (playerData) {
          let playableCard = playerData.battleField.find(c => c.id == event.playableCardId);
          if (playableCard) {
            playableCard.health = event.newHealth;
            playableCard.card.health = event.newHealth;
            playableCard.attack = event.newAttack;
            playableCard.card.attack = event.newAttack;
          }
        }

        break;
      }

      case "CardHeal": {
        let playerData = this.getPlayerData(event.playerId);
        if (playerData) {
          let playableCard = playerData.battleField.find(c => c.id == event.playableCardId);
          if (playableCard) {
            playableCard.health = event.health
            playableCard.card.health = event.health
            await new Promise(resolve => setTimeout(resolve, 250));
          }
        }
        break;
      }

      case "Attack": {
        break;
      }

      case "PlayerDamage": {
        let playerData = this.getPlayerData(event.playerId);
        if (playerData) {
          playerData.health = event.playerHealth
          await new Promise(resolve => setTimeout(resolve, 250));
        }
        break;
      }

      case "PlayerDeath": {
        break;
      }

      case "Thorns": {
        break;
      }

      case "FirstStrike": {
        break;
      }

      case "Nuke": {
        break;
      }

      case "CardDamage": {
        let playerData = this.getPlayerData(event.playerId);
        if (playerData) {
          let playableCard = playerData.battleField.find(c => c.id == event.playableCardId);
          if (playableCard) {
            playableCard.health = event.cardHealth;
            playableCard.card.health = event.cardHealth
            await new Promise(resolve => setTimeout(resolve, 250));
          }
        }
        console.log(playerData?.battleField)
        break;
      }

      case "CardDeath": {
        let playerData = this.getPlayerData(event.playerId);
        if (playerData) {
          this.moveCard(playerData.battleField, playerData.graveyard, event.playableCardId);
          await new Promise(resolve => setTimeout(resolve, 250));
        }
        break;
      }

      case "PlayerStartTurn": {
        break;
      }

      case "Surrender": {
        break;
      }

      case "SpectatorMessage": {
        
        }
      

    }
    if (event.events) {
      for (let e of event.events) {
        await this.applyEvent(e);
      }
      console.log("-------------- FIN DE CETTE BATCH --------------")

    }
  }

  // Obtenir le PlayerData d'un match à partir de l'Id du Player
  getPlayerData(playerId: any): PlayerData | null {
    if (this.match) {
      if (playerId == this.match.playerDataA.playerId)
        return this.match.playerDataA;
      else if (playerId == this.match.playerDataB.playerId)
        return this.match.playerDataB;
    }
    return null;
  }

  // Déplace une carte d'un array à l'autre
  moveCard(src: PlayableCard[], dst: PlayableCard[], playableCardId: any) {
    let playableCard = src.find(c => c.id == playableCardId);

    if (playableCard != undefined) {
      let index = src.findIndex(c => c.id == playableCardId);
      // Retire l'élément de l'array
      src.splice(index, 1);
      dst.push(playableCard);
    }
  }



}
