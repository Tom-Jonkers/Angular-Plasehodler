import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { MatchService } from "./match.service";
import { ChatDTO, MatchData } from "../models/models";
import { Router, RouterLink } from '@angular/router';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HubService {
  private hubConnection?: HubConnection;

  constructor(public matchService: MatchService, private router: Router) { }

  async getConnection() {
    if (this.hubConnection) return this.hubConnection;

    this.hubConnection = new HubConnectionBuilder().withUrl(`${environment.apiUrl}matchHub`, { accessTokenFactory: () => sessionStorage.getItem("token")! }).build();

    this.hubConnection.on("JoiningMatchData", async (data: MatchData) => this.matchService.applyEvent({
      eventType: "JoiningMatchData",
      matchData: data
    }))

    // this.hubConnection.on("StartMatch", async (data: any) => this.matchService.applyEvent(data))

    // this.hubConnection.on("PlayerEndTurn", async (data: any) => this.matchService.applyEvent(data))

    // this.hubConnection.on("Surrender", async (data: any) => this.matchService.applyEvent(data))

    // this.hubConnection.on("PlayCard", async (data: any) => this.matchService.applyEvent(data))

    this.hubConnection.on("Event", async (data: any) => this.matchService.applyEvent(data))
    this.hubConnection.on("SendMessage", async (Message: ChatDTO) => this.matchService.applyEvent(Message))


    await this.hubConnection!.start()
      .then(() =>
        console.log('Connexion active')
      )
      .catch(err =>
        console.log('Erreur de connexion', err)
      );

    return this.hubConnection;
  }

  async joinMatch() {
    const connection = await this.getConnection();

    await connection.invoke("JoinMatch");
  }

  async stopJoiningMatch() {
    const connection = await this.getConnection();

    await connection.invoke("StopJoiningMatch");
  }

  async spectateMatch(matchId: number) {
    const connection = await this.getConnection()


    await connection.invoke("SpectateMatch", matchId)
  }

  async sendMessage(matchId: number, message: string, isSpectator: boolean) {
    const connection = await this.getConnection()

    console.log(message)
    await connection.invoke("SendMessage", matchId, message, isSpectator)

  }
}
