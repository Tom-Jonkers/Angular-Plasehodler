import { ApiService } from 'src/app/services/api.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Match, MatchData, MatchDTO } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { HubService } from 'src/app/services/hub.service';
import { MatchService } from 'src/app/services/match.service';

@Component({
  selector: 'app-spectate',
  standalone: true,
  imports: [],
  templateUrl: './spectate.component.html',
  styleUrl: './spectate.component.css'
})
export class SpectateComponent {
  constructor(public router: Router, public match: MatchService, public hub: HubService, public apiService: ApiService) { }

  matches: MatchDTO[] = []
  onlineUserId: string = sessionStorage.getItem("userId")!


  async ngOnInit() {
    await this.hub.getConnection();
    this.matches = await this.apiService.getMatches()

  }

  async joinMatch() {
    await this.hub.joinMatch();
  }

  async spectateMatch(matchId: number) {
    await this.router.navigate(['/match', matchId], { queryParams: { spectate: true } });
  }

}
