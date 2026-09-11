import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {environment} from '../../../environments/environment.development';

export interface Order {
  id: string,
  clientName : string,
  orderName : string,
  status : string,
  quantity : number,
  price : number,
  date: string,
  country: string,
  isCito: boolean
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
  private cdr = inject(ChangeDetectorRef);
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
  citoOrders : Order[] = [];
  normalOrders: Order[] = [];
  editOrderModalOpen = false;
  editOrderClientName = '';
  editOrderOrderName = '';
  editOrderQuantity = 0;
  editOrderPrice = 0;
  editOrderCountry = '';
  editOrderCito = false;
  editOrderId = '';


  async ngOnInit() {
    await this.fetchOrders();
  }

  async fetchOrders() {
    try {
      const response = await fetch(environment.apiUrl, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        this.orders = await response.json();
        this.citoOrders = this.getCitoOrders();
        this.normalOrders = this.getNormalOrders();
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error);
    }
  }
  getCitoOrders(): Order[] {
    return this.orders.filter(order => order.isCito === true);
  }
  getNormalOrders(): Order[] {
    return this.orders.filter(order => order.isCito === false);

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
        this.resetNewOrderForm();
        this.fetchOrders();
      }
    }catch(error){

    }
  }
  async deleteOrder(){
    try{
      const response = await fetch(environment.apiUrl,{
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(this.editOrderId)
      });
      if(response.ok){
        this.closeEditOrderModal();
        await this.fetchOrders();
      }
    }catch(error){
    }

  }
  resetNewOrderForm() {
    this.newOrderClientName = '';
    this.newOrderOrderName = '';
    this.newOrderCountry = '';
    this.newOrderCito = false;
    this.newOrderPrice = 0;
    this.newOrderQuantity = 0;
  }
  resetEditOrderForm(){
    this.editOrderClientName = '';
    this.editOrderOrderName = '';
    this.editOrderQuantity = 0;
    this.editOrderPrice = 0;
    this.editOrderCountry = '';
    this.editOrderCito = false;
    this.editOrderId = '';
  }
  async editOrder(order:Order){
    this.editOrderModalOpen = true;
    this.editOrderId = order.id;
    this.editOrderClientName = order.clientName;
    this.editOrderOrderName = order.orderName;
    this.editOrderQuantity = order.quantity;
    this.editOrderPrice = order.price;
    this.editOrderCountry = order.country;
    this.editOrderCito = order.isCito;
  }
  closeEditOrderModal(){
    this.editOrderModalOpen = false;
    this.resetEditOrderForm();
  }
  async submitEditOrder(){
    const editedOrder = {
      id: this.editOrderId,
      clientName: this.editOrderClientName,
      orderName: this.editOrderOrderName,
      quantity: this.editOrderQuantity,
      price: this.editOrderPrice,
      country: this.editOrderCountry,
      isOrderCito: this.editOrderCito
    };

    try {
      const response = await fetch(environment.apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editedOrder)
      });

      if (response.ok) {
        this.editOrderModalOpen = false;
        await this.fetchOrders();
      } else {
        console.error('Błąd z serwera:', await response.text());
      }
    } catch (error) {
      console.error('Błąd sieci podczas edycji zamówienia:', error);
    }
  }



}
