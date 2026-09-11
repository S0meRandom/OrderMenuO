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
export interface finishedOrder {
  id: string,
  clientName : string,
  orderName : string,
  status : string,
  quantity : number,
  price : number,
  dateStart: string,
  dateEnd : string,
  country: string,
  isCito: boolean,
  postalCode : string
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
  newOrderModalOpen = false;
  finishOrderModalOpen = false;
  citoOrdersPage = false;
  mainOrdersPage = true;
  finishedOrdersPage = false;
  newOrderClientName = '';
  newOrderOrderName = '';
  newOrderQuantity = 0;
  newOrderPrice = 0;
  newOrderCountry = '';
  newOrderCito = false;
  orders : Order[] = [];
  citoOrders : Order[] = [];
  normalOrders: Order[] = [];
  finishedOrders: finishedOrder[] = [];
  editOrderModalOpen = false;
  editOrderClientName = '';
  editOrderOrderName = '';
  editOrderQuantity = 0;
  editOrderPrice = 0;
  editOrderCountry = '';
  editOrderCito = false;
  editOrderId = '';
  editOrderStatus = '';
  editOrderDate = '';
  finishOrderPostalCode = '';

  async ngOnInit() {
    await this.fetchOrders();
    await this.fetchFinishedOrders();
  }

  async fetchOrders() {
    try {
      const response = await fetch(environment.apiUrl +'/orders', {
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
  async fetchFinishedOrders(){
    try {
      const response = await fetch(environment.apiUrl + '/finishOrders', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        this.finishedOrders = await response.json();
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error);
    }

  }
  getCitoOrders(): Order[] {
    return this.orders.filter(order => order.isCito === true && order.status === 'Aktywny');
  }
  getNormalOrders(): Order[] {
    return this.orders.filter(order => order.isCito === false && order.status === 'Aktywny');
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
        this.newOrderModalOpen = false;
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
  async finishOrder(){
    const finishedOrder = {
      id: this.editOrderId,
      clientName: this.editOrderClientName,
      orderName: this.editOrderOrderName,
      quantity: this.editOrderQuantity,
      price: this.editOrderPrice,
      country: this.editOrderCountry,
      isOrderCito: this.editOrderCito,
      date : this.editOrderDate,
      postalCode : this.finishOrderPostalCode,
      status: 'Zakończone'
    };
    try{
      const response = await fetch(environment.apiUrl + '/finishOrder',{
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        credentials: 'include',
        body: JSON.stringify(finishedOrder)
      });
      if(response.ok){
        this.fetchOrders();
        this.fetchFinishedOrders();
        this.finishOrderPostalCode = '';
        this.closeEditOrderModal();
        this.finishOrderModalOpen = false;
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
    this.editOrderStatus = '';
    this.editOrderDate = '';
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
    this.editOrderStatus = order.status;
    this.editOrderDate = order.date;
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
      isOrderCito: this.editOrderCito,
      status: this.editOrderStatus
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
