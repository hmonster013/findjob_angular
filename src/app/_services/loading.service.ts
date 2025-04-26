import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  loading$ = this._loading.asObservable();

  private requestCount = 0;

  constructor() { }

  show(): void {
    this.requestCount++;
    this._loading.next(true);
  }

  hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this._loading.next(false);
    }
  }
}
