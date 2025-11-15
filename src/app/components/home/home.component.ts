import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { HubService } from "../../services/hub.service";
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [MatButtonModule, RouterOutlet, CommonModule]
})
export class HomeComponent implements OnInit {

  constructor(public router: Router, public match: MatchService, public hub: HubService, public authService: AuthService) { }
  matchmaking: Boolean = false


  async ngOnInit() {
    await this.hub.getConnection();
  }

  async joinMatch() {
    await this.hub.joinMatch();

    this.matchmaking = true

    let elapsedTime = 0;
    const waitTime = 5000;
    const interval = 100;

    while (elapsedTime < waitTime) {
      await new Promise(resolve => setTimeout(resolve, interval));
      elapsedTime += interval;

      if (!this.matchmaking) {
        return;
      }
    } // Annule le matchmaking si this.matching = false
  }

  cancel() {
    this.matchmaking = false;
    this.hub.stopJoiningMatch();
  }

  isLogged() {
    return this.authService.isLoggedIn();
  }

}


