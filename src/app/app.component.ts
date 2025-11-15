import { Component } from '@angular/core';
import { MatchService } from './services/match.service';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@microsoft/signalr';
import { lastValueFrom } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from './services/api.service';
import { Player } from './models/models';
import { PlayerhandComponent } from './match/playerhand/playerhand.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatChipsModule,
    RouterOutlet,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
})
export class AppComponent {
  title = 'PLA$EHODLER';
  privateDataResult: string[] = [];
  result = ""
  elo = -1
  constructor(public router: Router, public matchService: MatchService, public authService: AuthService, public apiService: ApiService) {
    this.getELO()
  }

  isLogged() {
    return this.authService.isLoggedIn();
  }



  getUsername() {
    return sessionStorage.getItem('username')
  }

  getMoney() {
    return sessionStorage.getItem('playermoney')
  }

  async getELO() {
    this.elo = await this.apiService.getELO()
  }

  async logout() {
    this.authService.logout()
  }


  // CARTES (ANGULAR)
  routeStore() {
    this.router.navigate(['/store'])
  }

  routeInventory() {
    this.router.navigate(['/inventory'])
  }

  routeStats() {
    this.router.navigate(['/stats'])
  }

  routeHome() {
    this.router.navigate(['/'])
  }


  routePacks() {
    this.router.navigate(['/packs'])
  }


  routeDeck() {
    this.router.navigate(['/deck'])
  }
  

  routeSpectate() {
    this.router.navigate(['/spectate'])
  }

  // AUTHENTIFICATION
  goToLogin() {
    this.router.navigate(['/login']);
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }
  async privateData() {
    let privateDataResult = await this.authService.getPrivateData()
    this.result = privateDataResult.toString()
    this.getELO()
  }
}
