import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { ApiService } from './services/api.service';
import { AppComponent } from './app.component';

export const authentificationGuard: CanActivateFn = (route, state) => {
  // On inject le service pour regarder si l'utilisateur est connecté
  if (!inject(AuthService).isLoggedIn())
    // S'il n'est pas connecté on le redirige vers la page de login
    return createUrlTreeFromSnapshot(route, ["/login"]);
  // S'il est connecté, tout est beau on continue!
  else return true;
};
