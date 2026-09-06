import { Component } from '@angular/core';

export interface Order {
  id : number,
  name : String,
  order : String,
  status : String,
  quantity : number,
  price : number,
  data: String,
  country: String
}

@Component({
  imports: [],
  selector: 'app-main-page',
  styleUrl: './main-page.css',
  templateUrl: './main-page.html',
})
export class MainPage {
  modalOpen = false;
  citoOrdersPage = false;
  mainOrdersPage = true;

  citoOrders : Order[] = [
    {id: 2, name: 'Iwona Staszewska', order: 'Chmuroskos', status: "Aktywne",quantity: 2, price: 150, data: '2026-09-01', country: 'Polska' }
  ];

  orders: Order[] = [
    {id: 1, name: 'Jan Kowalski', order: 'Szczerbatek', status: "Aktywne",quantity: 2, price: 150, data: '2026-09-01', country: 'Polska' },
  ];


}
