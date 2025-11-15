import { Component, OnInit } from '@angular/core';
import { Match, MatchData, PlayerData } from '../models/models';
import { MatchService } from './../services/match.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { HealthComponent } from './health/health.component';
import { MatButtonModule } from '@angular/material/button';
import { PlayerhandComponent } from './playerhand/playerhand.component';
import { EnemyhandComponent } from './enemyhand/enemyhand.component';
import { BattlefieldComponent } from './battlefield/battlefield.component';
import { HubService } from "../services/hub.service";
import { ChatComponent } from './chat/chat.component';
import {AppComponent} from "../app.component";


@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css'],
  standalone: true,
  imports: [BattlefieldComponent, EnemyhandComponent, PlayerhandComponent, MatButtonModule, HealthComponent, ChatComponent]
})
export class MatchComponent implements OnInit {

  constructor(private route: ActivatedRoute, public router: Router, public matchService: MatchService, public hubService: HubService, private AppComponent: AppComponent) { }

  spectate: boolean = false
  match: Match = null!
  async ngOnInit() {
    let matchId: number = parseInt(this.route.snapshot.params["id"]);
    
     const spectate = this.route.snapshot.queryParams['spectate'];
    console.log(spectate, !!spectate)
     this.spectate = !!spectate
    let onlineUserId: string = sessionStorage.getItem("userId")!


    await this.hubService.getConnection();

    if(!spectate)
    {
      await this.hubService.joinMatch();
    }
    else
    {
      await this.hubService.spectateMatch(matchId)
    }
      
  }

  async endTurn() {
    const matchId = parseInt(this.route.snapshot.params["id"]);

    const connection = await this.hubService.getConnection();

    await connection.invoke("EndTurn", matchId);
  }

  async surrender() {
    const matchId = parseInt(this.route.snapshot.params["id"]);

    const connection = await this.hubService.getConnection();

    await connection.invoke("Surrender", matchId);
  }

  endMatch() {
    this.matchService.clearMatch();
    this.router.navigate(['/'])
    this.AppComponent.getELO()
  }

  isVictory() {
    if (this.matchService.matchData?.winningPlayerId)
      return this.matchService.matchData!.winningPlayerId === this.matchService.playerData!.playerId
    return false;
  }

  isMatchCompleted() {
    return this.matchService.matchData?.match.isMatchCompleted;
  }

  home() {
    this.router.navigate(['/'])
  }

  
}
