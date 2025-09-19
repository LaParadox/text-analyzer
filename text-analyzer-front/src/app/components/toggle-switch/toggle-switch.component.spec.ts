import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ToggleSwitchComponent } from './toggle-switch.component';

describe('ToggleSwitchComponent', () => {
  let component: ToggleSwitchComponent;
  let fixture: ComponentFixture<ToggleSwitchComponent>;
  let checkboxElement: HTMLInputElement;
  let labelElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleSwitchComponent, FormsModule, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    checkboxElement = fixture.debugElement.query(By.css('input[type="checkbox"]')).nativeElement;
    labelElement = fixture.debugElement.query(By.css('.mode-label')).nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.value()).toBe(false);
    expect(component._disabled()).toBe(false);
    expect(component.onLabel()).toBe('On');
    expect(component.offLabel()).toBe('Off');
    expect(checkboxElement.checked).toBe(false);
    expect(labelElement.textContent?.trim()).toBe('Off');
  });

  it('should toggle value and label when clicked', () => {
    checkboxElement.click();
    fixture.detectChanges();

    expect(component.value()).toBe(true);
    expect(checkboxElement.checked).toBe(true);
    expect(labelElement.textContent?.trim()).toBe('On');
  });

  it('should call onChange and onTouched callbacks when toggled', () => {
    spyOn(component, 'onChange');
    spyOn(component, 'onTouched');

    checkboxElement.click();

    expect(component.onChange).toHaveBeenCalledWith(true);
    expect(component.onTouched).toHaveBeenCalled();
  });

  it('should disable checkbox when setDisabledState is true', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    expect(checkboxElement.disabled).toBe(true);
    expect(component._disabled()).toBe(true);
  });

  it('should implement writeValue correctly', () => {
    component.writeValue(true);
    fixture.detectChanges();

    expect(component.value()).toBe(true);
    expect(checkboxElement.checked).toBe(true);
    expect(labelElement.textContent?.trim()).toBe('On');
  });

  it('should handle null/undefined writeValue gracefully', () => {
    expect(() => component.writeValue(null as any)).not.toThrow();
    expect(() => component.writeValue(undefined as any)).not.toThrow();
  });

  it('should work with reactive forms', () => {
    const formControl = new FormControl(false);

    component.registerOnChange((value: boolean) => formControl.setValue(value));
    component.writeValue(formControl.value as any);

    expect(component.value()).toBe(false);

    checkboxElement.click();

    expect(formControl.value).toBe(true);
  });

  it('should accept custom labels', () => {
    fixture.componentRef.setInput('onLabel', 'Enabled');
    fixture.componentRef.setInput('offLabel', 'Disabled');
    fixture.detectChanges();

    expect(labelElement.textContent?.trim()).toBe('Disabled');

    component.value.set(true);
    fixture.detectChanges();

    expect(labelElement.textContent?.trim()).toBe('Enabled');
  });
});
