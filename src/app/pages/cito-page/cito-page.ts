import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {SortPipe} from '../../sort-pipe';
import {OrderService} from '../../services/order';
import {environment} from '../../../environments/environment';
import { Order} from '../main-page/main-page';

@Component({
  imports: [
    FormsModule,
    SortPipe
  ],
  selector: 'app-cito-page',
  styleUrl: './cito-page.css',
  templateUrl: './cito-page.html',
})
export class CitoPage implements OnInit{
  private cdr = inject(ChangeDetectorRef);
  private orderService = inject(OrderService);
  constructor(private router: Router){}

  newOrderModalOpen = false;
  finishOrderModalOpen = false;

  newOrderClientName = '';
  newOrderOrderName = '';
  newOrderQuantity = 0;
  newOrderPrice = 0;
  newOrderCountry = '';
  newOrderCito = false;
  newOrderPlannedDate = "";

  orders : Order[] = [];
  citoOrders : Order[] = [];

  editOrderModalOpen = false;
  editOrderClientName = '';
  editOrderOrderName = '';
  editOrderQuantity = 0;
  editOrderPrice = 0;
  editOrderCountry = '';
  editOrderCito = false;
  editOrderId = '';
  editOrderStatus = '';
  editOrderDate = "";
  editOrderPlannedDate = "";
  isEditOrderSuspended = false;
  finishOrderPostalCode = '';

  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';


  async ngOnInit() {
    await Promise.all([
      this.orderService.loadNormalOrders(),
    ]);

    this.updateFilteredLists();
  }
  get getOrdersFromOrderService(): Order[] {
    return this.orderService.orders();
  }
  async refreshOrders(): Promise<void> {
    await Promise.all([
      this.orderService.loadNormalOrders(true),
      this.orderService.loadFinishedOrders(true),
    ]);
    this.updateFilteredLists();
  }

  private updateFilteredLists(): void {
    this.orders = this.getOrdersFromOrderService;
    this.citoOrders = this.getCitoOrders();
    this.cdr.detectChanges();
  }

  getCitoOrders(): Order[] {
    return this.orders.filter(order => order.isCito === true && order.status === 'Aktywny');
  }

  openMainPage(){
    this.router.navigate(['/mainPage']);
  }
  openCitoOrdersPage(){
    this.router.navigate(['/citoPage']);
  }
  openFinishedOrdersPage(){
    this.router.navigate(['/finishedPage']);
  }
  openSuspendedOrdersPage(){
    this.router.navigate(['/suspendedPage']);
  }
  openQueuePage(){
    this.router.navigate(['queuePage']);
  }

  async createNewOrder() {
    const newOrder = {
      clientName : this.newOrderClientName,
      orderName : this.newOrderOrderName,
      orderQuantity : this.newOrderQuantity,
      orderPrice : this.newOrderPrice,
      orderCountry : this.newOrderCountry,
      isOrderCito : this.newOrderCito,
      orderPlannedDate : this.newOrderPlannedDate
    };
    try{
      const response = await fetch(environment.apiUrl + '/newOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newOrder)
      });
      if(response.ok){
        this.resetNewOrderForm();
        this.newOrderModalOpen = false;
        this.refreshOrders();
      }
    }catch(error){

    }
  }
  async deleteOrder(){
    const body = {
      id : this.editOrderId
    };
    try{
      const response = await fetch(environment.apiUrl,{
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      });
      if(response.ok){
        this.closeEditOrderModal();
        await this.refreshOrders();
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
        this.closeEditOrderModal();
        this.finishOrderModalOpen = false;
        await this.refreshOrders();
        this.finishOrderPostalCode = '';
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
    this.newOrderPlannedDate = "";
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
    this.isEditOrderSuspended = false;
    this.editOrderPlannedDate = "";
  }
  checkEditOrderStatus(orderStatus:string){
    if(orderStatus === "Zawieszony"){
      this.isEditOrderSuspended = true;
    }else{
      this.isEditOrderSuspended = false;
    }

  }
  async editOrder(order:Order){
    this.editOrderModalOpen = true;
    this.checkEditOrderStatus(order.status);
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
      status: this.editOrderStatus,
      date: this.editOrderDate,
      plannedDate : this.editOrderPlannedDate
    };

    try {
      const response = await fetch(environment.apiUrl + '/editOrder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editedOrder)
      });

      if (response.ok) {
        this.closeEditOrderModal();
        await this.refreshOrders();
      } else {
        console.error('Błąd z serwera:', await response.text());
      }
    } catch (error) {
      console.error('Błąd sieci podczas edycji zamówienia:', error);
    }
  }
  async suspendOrder(){
    const suspendedOrder = {
      id: this.editOrderId,
      clientName: this.editOrderClientName,
      orderName: this.editOrderOrderName,
      quantity: this.editOrderQuantity,
      price: this.editOrderPrice,
      country: this.editOrderCountry,
      isOrderCito: false,
      status: this.editOrderStatus,
      date: this.editOrderDate
    };
    try{
      const response = await fetch(environment.apiUrl + '/suspendOrder',{
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(suspendedOrder)
      });
      if(response.ok){
        this.closeEditOrderModal();
        await this.refreshOrders();
      }else{
        console.error('Błąd z serwera:', await response.text());
      }

    }catch(error){
      console.error('Błąd sieci podczas edycji zamówienia:', error);
    }
  }
  toggleSort(column: string) {
    if (this.sortKey === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = column;
      this.sortDirection = 'asc';
    }
  }

  getSortIcon(column: string): string {
    if (this.sortKey !== column) return '↕';
    return this.sortDirection === 'asc' ? '▲' : '▼';
  }



}
