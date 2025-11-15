import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { MatchService } from './match.service';
import { ApiService } from './api.service';
import {environment} from "../../environments/environment";

const TOKEN_SESSIONSTORAGE_KEY = "token";
const USERNAME_SESSIONSTORAGE_KEY = "username";
const USER_ID_SESSIONSTORAGE_KEY = "userId";
const MONEY_SESSIONSTORAGE_KEY = "playermoney";
const ELO_SESSIONSTORAGE_KEY = "elo";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiBaseUrl = `${environment.apiUrl}api/Account/`;
  private token = ""
  money: number = 0
  ELO: number = 0

  constructor(private http: HttpClient, private matchService: MatchService, private apiService: ApiService) { }

  async register(username: string, email: string, password: string, passwordConfirm: string) {
    let registerData = {
      username,
      email,
      password,
      passwordConfirm,
    };
    console.log('Register Data:', registerData);
    try {
      await lastValueFrom(this.http.post<any>(this.apiBaseUrl + 'Register', registerData));

      let loginData = { username, password };
      console.log('Login Data:', loginData);
      let result = await lastValueFrom(this.http.post<any>(this.apiBaseUrl + 'Login', loginData));

      console.log('Login Result:', result);

      this.money = result.playerMoney;

      sessionStorage.setItem(TOKEN_SESSIONSTORAGE_KEY, result.token);
      sessionStorage.setItem(USERNAME_SESSIONSTORAGE_KEY, result.username);
      sessionStorage.setItem(USER_ID_SESSIONSTORAGE_KEY, result.userId.toString());
      sessionStorage.setItem(MONEY_SESSIONSTORAGE_KEY, result.playerMoney.toString());
    } catch (error) {
      throw new Error("Échec de l'enregistrement");
    }
    this.matchService.initializePlayer();

    sessionStorage.setItem(ELO_SESSIONSTORAGE_KEY, await this.apiService.getELO());
  }

  async login(username: string, password: string) {
    let loginData = { username, password };
    try {
      let result = await lastValueFrom(this.http.post<any>(this.apiBaseUrl + 'Login', loginData));
      this.money = result.playerMoney;

      sessionStorage.setItem(TOKEN_SESSIONSTORAGE_KEY, result.token);
      sessionStorage.setItem(USERNAME_SESSIONSTORAGE_KEY, result.username);
      sessionStorage.setItem(USER_ID_SESSIONSTORAGE_KEY, result.userId.toString());
      sessionStorage.setItem(MONEY_SESSIONSTORAGE_KEY, result.playerMoney.toString());
    } catch (error) {
      throw new Error("Échec de la connexion");
    }
    this.matchService.initializePlayer();

    sessionStorage.setItem(ELO_SESSIONSTORAGE_KEY, this.apiService.getELO.toString());
  }

  async logout() {
    sessionStorage.removeItem(TOKEN_SESSIONSTORAGE_KEY);
    sessionStorage.removeItem(USERNAME_SESSIONSTORAGE_KEY);
    sessionStorage.removeItem(USER_ID_SESSIONSTORAGE_KEY);
    sessionStorage.removeItem(MONEY_SESSIONSTORAGE_KEY);
    alert("Déconnexion réussie !");
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem(TOKEN_SESSIONSTORAGE_KEY) !== null;
  }

  getUsername(): string | null {
    return sessionStorage.getItem(USERNAME_SESSIONSTORAGE_KEY);
  }

  getUserId(): string | null {
    return sessionStorage.getItem(USER_ID_SESSIONSTORAGE_KEY);
  }

  async getPrivateData(): Promise<string[]> {
    const token = sessionStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      console.log(this.apiBaseUrl + 'PrivateData', { headers })
      const privateData = await lastValueFrom(

        this.http.get<string[]>(this.apiBaseUrl + 'PrivateData', { headers })

      );
      console.log(privateData)
      return privateData
    }
    return []
  }
}
