import {Component, input, output} from '@angular/core';

@Component({
  selector: 'app-action-buttons',
  imports: [],
  templateUrl: './action-buttons.component.html',
  styleUrl: './action-buttons.component.css'
})
export class ActionButtonsComponent {

  primaryLabel = input<string>('Primary Action');
  primaryDisabled = input<boolean>(false);

  primaryAction = output<void>();

  onPrimaryAction() {
    this.primaryAction.emit();
  }
}
