import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MatchComponent } from './match/match.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { StoreComponent } from './components/store/store.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authentificationGuard } from './authentification.guard';
import { PacksComponent } from './components/packs/packs.component';
import { DeckComponent } from './components/deck/deck.component';
import { SpectateComponent } from './components/spectate/spectate.component';
import { StatsComponent } from './components/stats/stats.component';


const routes: Routes = [
  { path: 'match/:id', component: MatchComponent, canActivate: [authentificationGuard] },
  {
    path: '', component: HomeComponent, children: [
      { path: '', component: WelcomeComponent },
    ], canActivate: [authentificationGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'store', component: StoreComponent },
  { path: 'inventory', component: InventoryComponent, canActivate: [authentificationGuard] },
  { path: 'packs', component: PacksComponent, canActivate: [authentificationGuard] },
  { path: 'deck', component: DeckComponent, canActivate: [authentificationGuard] },
  { path: 'spectate', component: SpectateComponent, canActivate: [authentificationGuard]},
  { path: 'stats', component: StatsComponent, canActivate: [authentificationGuard] },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
