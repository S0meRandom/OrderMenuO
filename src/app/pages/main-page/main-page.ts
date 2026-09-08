import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {environment} from '../../../environments/environment.development';

export interface Order {
  id: string,
  name : string,
  order : string,
  status : string,
  quantity : number,
  price : number,
  date: string,
  country: string,
  cito: boolean
}

@Component({
  imports: [
    FormsModule
  ],
  selector: 'app-main-page',
  styleUrl: './main-page.css',
  templateUrl: './main-page.html',
})
export class MainPage implements OnInit{
  modalOpen = false;
  citoOrdersPage = false;
  mainOrdersPage = true;
  newOrderClientName = '';
  newOrderOrderName = '';
  newOrderQuantity = 0;
  newOrderPrice = 0;
  newOrderCountry = '';
  newOrderCito = false;
  orders : Order[] = [];
  citoOrders = this.getCitoOrders();

  ngOnInit() {
    this.fetchOrders();
  }
  async fetchOrders() {
    try {
      const response = await fetch(environment.apiUrl, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        this.orders = await response.json();
      }
    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error);
    }
  }
  getCitoOrders(): Order[] {
    return this.orders.filter(order => order.cito === true);
  }

  async createNewOrder() {
    const newOrder = {
      clientName : this.newOrderClientName,
      orderName : this.newOrderOrderName,
      orderQuantity : this.newOrderQuantity,
      orderPrice : this.newOrderPrice,
      orderCountry : this.newOrderCountry,
      isOrderCito : this.newOrderCito
    };
    try{
      const response = await fetch(environment.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newOrder)
      });
      if(response.ok){
        this.resetForm();
        this.fetchOrders();
      }
    }catch(error){

    }
  }
  resetForm() {
    this.newOrderClientName = '';
    this.newOrderOrderName = '';
    this.newOrderCountry = '';
    this.newOrderCito = false;
    this.newOrderPrice = 0;
    this.newOrderQuantity = 0;

  }



}
