import { Component, inject } from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {environment} from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
@Component({
  imports: [
    FormsModule
  ],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  password = '';
  log = '';
  private http = inject(HttpClient);

  constructor(private router: Router){}

  goHome(){
    this.router.navigate(['/mainPage']);
  }

  login(){
    this.http.post(environment.apiUrl, { log: this.log, password: this.password }, {
      withCredentials: true
    }).subscribe({
      next: () => this.goHome(),
      error: () => console.error('Błąd logowania:')
    });
  }
}
