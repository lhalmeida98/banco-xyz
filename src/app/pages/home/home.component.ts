import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotificationComponent } from '../../shared/ui/notification/notification.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, NotificationComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {

  constructor(){
  }

}
