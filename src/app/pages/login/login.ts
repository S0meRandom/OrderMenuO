import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {environment} from '../../../environments/environment.development';

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

  constructor(private router: Router){}

  goHome(){
    this.router.navigate(['/mainPage']);
  }

  async login(){
    const response = await fetch(environment.apiUrl,{
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({
        log : this.log,
        password : this.password
      })
    });

    if (response.ok){
      this.goHome();
    }else{
      console.error("Błąd logowania")
    }
  }
}
