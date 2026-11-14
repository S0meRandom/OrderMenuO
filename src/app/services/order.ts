import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orders = signal<any[]>([]);
  finishedOrders = signal<any[]>([]);

  private isNormalLoaded = false;
  private isFinishedLoaded = false;

  async loadNormalOrders(forceRefresh = false): Promise<void> {
    if (this.isNormalLoaded && !forceRefresh) {
      return;
    }

    try {
      const response = await fetch(environment.apiUrl + '/orders', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        this.orders.set(data);
        this.isNormalLoaded = true;
      }
    } catch (error) {
      console.error('Błąd pobierania zamówień:', error);
    }
  }

  async loadFinishedOrders(forceRefresh = false): Promise<void> {
    if (this.isFinishedLoaded && !forceRefresh) {
      return;
    }

    try {
      const response = await fetch(environment.apiUrl + '/finishOrders', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        this.finishedOrders.set(data);
        this.isFinishedLoaded = true;
      }
    } catch (error) {
      console.error('Błąd pobierania zakończonych zamówień:', error);
    }
  }
}
