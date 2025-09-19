import {Component, forwardRef, input, signal} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-radio-group',
  imports: [
    NgForOf
  ],
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true
    }
  ]
})
export class RadioGroupComponent implements ControlValueAccessor {

  label = input<string>('');
  name = input<string>('');
  options = input<{ value: any; label: string }[]>([]);

  _disabled = signal(false);
  selectedValue = signal<any>(null);
  onChange = (value: any) => {};
  onTouched = () => {};

  onSelectionChange(value: any) {
    this.selectedValue.set(value);
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.selectedValue.set(value);
  }

  registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this._disabled.set(isDisabled);
  }
}
