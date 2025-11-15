import { Component, Input, OnInit } from '@angular/core';
import { PlayableCard } from 'src/app/models/models';
import { CardComponent } from '../../components/card/card.component';
import { ActivatedRoute } from '@angular/router';
import { HubService } from 'src/app/services/hub.service';


@Component({
  selector: 'app-playerhand',
  templateUrl: './playerhand.component.html',
  styleUrls: ['./playerhand.component.css'],
  standalone: true,
  imports: [CardComponent]
})
export class PlayerhandComponent implements OnInit {

  @Input() cards: PlayableCard[] = [];
  @Input() back = false
  constructor(private route: ActivatedRoute, public hubService: HubService) { }

  ngOnInit() {
  }
  
  async click(playableCardId: any) {
    // TODO: Utiliser seulement une fois que l'on peut jouer des cartes (TP2)
    const matchId = parseInt(this.route.snapshot.params["id"]);

    const connection = await this.hubService.getConnection();

    await connection.invoke("PlayCard", matchId, playableCardId);
  }
}
