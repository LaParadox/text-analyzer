import {Component, computed, forwardRef, input, signal} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-toggle-switch',
  imports: [],
  templateUrl: './toggle-switch.component.html',
  styleUrl: './toggle-switch.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleSwitchComponent),
      multi: true
    }
  ]
})
export class ToggleSwitchComponent implements ControlValueAccessor {

  onLabel = input<string>('On');
  offLabel = input<string>('Off');

  _disabled = signal(false);
  value = signal(false);
  onChange = (value: boolean) => {};
  onTouched = () => {};

  getLabel = computed(() => this.value() ? this.onLabel() : this.offLabel())

  onToggle(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value.set(target.checked);
    this.onChange(this.value());
    this.onTouched();
  }

  writeValue(value: boolean) {
    this.value.set(value);
  }

  registerOnChange(fn: (value: boolean) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this._disabled.set(isDisabled);
  }
}
