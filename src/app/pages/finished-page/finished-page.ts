import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {SortPipe} from '../../sort-pipe';
import {finishedOrder, Order} from '../main-page/main-page';
import {environment} from '../../../environments/environment';
import {OrderService} from '../../services/order';
@Component({
  imports: [
    FormsModule,
    SortPipe
  ],
  selector: 'app-finished-page',
  styleUrl: './finished-page.css',
  templateUrl: './finished-page.html',
})
export class FinishedPage implements  OnInit{
  constructor(private router: Router, private cdr: ChangeDetectorRef){}
  private orderService = inject(OrderService);

  newOrderModalOpen = false;
  newOrderClientName = '';
  newOrderOrderName = '';
  newOrderQuantity = 0;
  newOrderPrice = 0;
  newOrderCountry = '';
  newOrderCito = false;
  newOrderPlannedDate = "";
  finishedOrders: finishedOrder[] = [];
  finishOrderPostalCode = '';
  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';


  async ngOnInit() {
    await Promise.all([
      this.orderService.loadFinishedOrders(),
    ]);

    this.updateFilteredLists();
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

  get getFinishedOrdersFromOrderService() : finishedOrder[]{
    return this.orderService.finishedOrders();
  }
  async refreshOrders(): Promise<void> {
    await Promise.all([
      this.orderService.loadNormalOrders(true),
      this.orderService.loadFinishedOrders(true),
    ]);
    this.updateFilteredLists();
  }
  private updateFilteredLists(): void {
    this.finishedOrders = this.getFinishedOrdersFromOrderService;
    this.cdr.detectChanges();
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


  resetNewOrderForm() {
    this.newOrderClientName = '';
    this.newOrderOrderName = '';
    this.newOrderCountry = '';
    this.newOrderCito = false;
    this.newOrderPrice = 0;
    this.newOrderQuantity = 0;
    this.newOrderPlannedDate = "";
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
