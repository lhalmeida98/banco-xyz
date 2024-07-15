import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  templateUrl: './spinner.component.html',
  imports: [],
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {

  spinnerVisible$ = this.spinnerService.spinnerVisible$;

  constructor(private spinnerService: SpinnerService) {
  }

}
