import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-confirm',
  standalone: true,
  imports: [],
  templateUrl: './modal-confirm.component.html',
  styleUrl: './modal-confirm.component.scss'
})
export class ModalConfirmComponent {
  @Input() show = false;
  @Input() title = '';
  @Input() message = '';
  @Input() confirmText = 'Confirmar';
  @Output() confirm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
    this.show = false;
  }

  onClose(): void {
    this.close.emit();
    this.show = false;
  }

}
