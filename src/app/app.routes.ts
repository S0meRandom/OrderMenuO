import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { MainPage } from "./pages/main-page/main-page"
import {FinishedPage} from './pages/finished-page/finished-page';
import {SuspendPage} from './pages/suspend-page/suspend-page';
import {CitoPage} from './pages/cito-page/cito-page';

export const routes: Routes = [
  {path: 'login', component: Login},
  {path: 'mainPage', component: MainPage},
  {path: 'finishedPage', component: FinishedPage},
  {path: 'citoPage', component: CitoPage},
  {path: 'suspendedPage', component: SuspendPage},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: '**', redirectTo: 'login' }
];
