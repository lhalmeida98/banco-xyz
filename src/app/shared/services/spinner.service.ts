import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  public spinnerVisible$: WritableSignal<boolean> = signal(false);


  constructor() {
  }

  show() {
    this.spinnerVisible$.set(true);
  }

  hide() {
    this.spinnerVisible$.set(false);
  }

}
