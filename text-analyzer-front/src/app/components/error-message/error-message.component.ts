import {Component, input} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-error-message',
  imports: [
    NgIf
  ],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.css'
})
export class ErrorMessageComponent {

  message = input<string | null>('');
}
