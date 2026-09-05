import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { MainPage } from "./pages/main-page/main-page"

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: Login},
  { path: '**', redirectTo: 'login' }
];
