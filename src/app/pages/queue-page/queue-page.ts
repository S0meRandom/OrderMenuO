import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {OrderService} from '../../services/order';
import {Order} from '../main-page/main-page';
import {environment} from '../../../environments/environment';

@Component({
  imports: [
    FormsModule,
  ],
  selector: 'app-queue-page',
  styleUrl: './queue-page.css',
  templateUrl: './queue-page.html',
})
export class QueuePage implements OnInit{
  constructor(private router: Router,private cdr: ChangeDetectorRef){}
  private orderService = inject(OrderService);

  selectOrderModalOpen = false;
  orders: Order[] = [];
  queue: Order[] = [];
  availableOrders: Order[] = [];

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.orderService.loadNormalOrders(),
      this.orderService.loadQueuedOrders()
    ]);
    this.updateFilteredLists();
  }

  async refreshOrders(): Promise<void> {
    await Promise.all([
      this.orderService.loadNormalOrders(true),
      this.orderService.loadQueuedOrders(true)
    ]);
    this.updateFilteredLists();
  }
  get getOrdersFromOrderService(): Order[] {
    return this.orderService.orders();
  }
  get getQueuedOrdersFromOrderService() : Order[]{
    return this.orderService.queuedOrders();
  }
  filterOrdersNotInQueue(orders: any[], queue: any[]): any[] {
    const queueIds = new Set(queue.map(item => item.id));
    return orders.filter(order => !queueIds.has(order.id));
  }

  private updateFilteredLists(): void {
    this.orders = this.getOrdersFromOrderService;
    this.queue = this.getQueuedOrdersFromOrderService;
    this.availableOrders = this.filterOrdersNotInQueue(this.orders,this.queue)
    this.cdr.detectChanges();
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


  openSelectOrderModal(): void {
    this.selectOrderModalOpen = true;
  }
  closeSelectOrderModal(): void {
    this.selectOrderModalOpen = false;
  }
  async addToQueue(order:Order){
    const queuedOrder = {
      id : order.id,
      clientName : order.clientName,
      orderName : order.orderName,
      status : order.status,
      quantity : order.quantity,
      price : order.price,
      country : order.country,
      dateStart : order.date,
      isCito : order.isCito,
    }

    try{
      const response = await fetch(environment.apiUrl + '/queue',{
        method: 'POST',
        credentials: "include",
        body: JSON.stringify(queuedOrder),
        headers: { 'Content-Type': 'application/json' },
      });
      if(response.ok){
        await this.refreshOrders();
      }
    }catch(error){

    }

  }
  async deleteFromQueue(order:Order)
  {
    const body = {
      id : order.id
    }
    try {
      const response = await fetch(environment.apiUrl + '/queue', {
        method: 'DELETE',
        credentials: "include",
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        await this.refreshOrders();
      }
    } catch (error) {

    }
  }

}
