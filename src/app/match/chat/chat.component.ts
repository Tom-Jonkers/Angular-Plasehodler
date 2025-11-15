import { Component, Input } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { ChatDTO, Match, Player } from 'src/app/models/models';
import { HubService } from 'src/app/services/hub.service';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  constructor(private hubService: HubService, public route: ActivatedRoute) { }

  userId: string = null!
  spectate: boolean = false
  matchID: number = null!
  messages: ChatDTO[] = []
  async ngOnInit() {
    this.matchID = parseInt(this.route.snapshot.params["id"])
    this.userId = sessionStorage.getItem("userId")!
    let connection = await this.hubService.getConnection()
    connection.on("message", (dto: ChatDTO) => { this.messages.push(dto) })
  }

  sendMessage(message: string) {
    console.log(this.matchID, message)
    this.hubService.sendMessage(this.matchID, message, this.spectate)
  }
}
