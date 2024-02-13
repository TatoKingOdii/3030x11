import {ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, Routes} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {authGuard} from "../libs/auth-guard/auth.guard";
import {LoginComponent} from "./login/login.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {resolve} from "@angular/compiler-cli";
import {idLoadedResolver} from "../libs/resolvers/id-loaded/id-loaded.resolver";
import {inject} from "@angular/core";

export const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
  {path: 'dashboard/:id', component: DashboardComponent, canActivate: [authGuard], resolve: [idLoadedResolver]},
  {path: 'login', component: LoginComponent},
  {path: '', component: LoginComponent},
  {path: '**', component: PageNotFoundComponent}
];
