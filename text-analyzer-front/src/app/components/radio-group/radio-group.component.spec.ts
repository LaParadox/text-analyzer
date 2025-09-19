import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { RadioGroupComponent } from './radio-group.component';

describe('RadioGroupComponent', () => {
  let component: RadioGroupComponent;
  let fixture: ComponentFixture<RadioGroupComponent>;

  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioGroupComponent, FormsModule, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(RadioGroupComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('options', mockOptions);
    fixture.componentRef.setInput('name', 'test-radio');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.selectedValue()).toBe(null);
    expect(component._disabled()).toBe(false);
    expect(component.label()).toBe('');
    expect(component.name()).toBe('test-radio');
  });

  it('should render radio options correctly', () => {
    const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
    const radioLabels = fixture.debugElement.queryAll(By.css('.radio-option'));

    expect(radioInputs.length).toBe(3);
    expect(radioLabels.length).toBe(3);
    expect(radioLabels[0].nativeElement.textContent.trim()).toContain('Option 1');
    expect(radioLabels[1].nativeElement.textContent.trim()).toContain('Option 2');
    expect(radioLabels[2].nativeElement.textContent.trim()).toContain('Option 3');
  });

  it('should update selectedValue when radio option is clicked', () => {
    const secondRadio = fixture.debugElement.queryAll(By.css('input[type="radio"]'))[1].nativeElement;

    secondRadio.click();
    fixture.detectChanges();

    expect(component.selectedValue()).toBe('option2');
    expect(secondRadio.checked).toBe(true);
  });

  it('should call onChange and onTouched callbacks when selection changes', () => {
    spyOn(component, 'onChange');
    spyOn(component, 'onTouched');

    const firstRadio = fixture.debugElement.queryAll(By.css('input[type="radio"]'))[0].nativeElement;
    firstRadio.click();

    expect(component.onChange).toHaveBeenCalledWith('option1');
    expect(component.onTouched).toHaveBeenCalled();
  });

  it('should disable all radio buttons when setDisabledState is true', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
    radioInputs.forEach(radio => {
      expect(radio.nativeElement.disabled).toBe(true);
    });
    expect(component._disabled()).toBe(true);
  });

  it('should implement writeValue correctly', () => {
    component.writeValue('option2');
    fixture.detectChanges();

    expect(component.selectedValue()).toBe('option2');

    const secondRadio = fixture.debugElement.queryAll(By.css('input[type="radio"]'))[1].nativeElement;
    expect(secondRadio.checked).toBe(true);
  });

  it('should handle null writeValue gracefully', () => {
    component.writeValue('option1');
    fixture.detectChanges();
    expect(component.selectedValue()).toBe('option1');

    component.writeValue(null);
    fixture.detectChanges();
    expect(component.selectedValue()).toBe(null);
  });

  it('should work with reactive forms', () => {
    const formControl = new FormControl('option1');

    component.registerOnChange((value: any) => formControl.setValue(value));
    component.writeValue(formControl.value);
    fixture.detectChanges();

    expect(component.selectedValue()).toBe('option1');

    const thirdRadio = fixture.debugElement.queryAll(By.css('input[type="radio"]'))[2].nativeElement;
    thirdRadio.click();

    expect(formControl.value).toBe('option3');
  });

  it('should accept custom label and name inputs', () => {
    fixture.componentRef.setInput('label', 'Choose Option');
    fixture.componentRef.setInput('name', 'custom-name');
    fixture.detectChanges();

    expect(component.label()).toBe('Choose Option');
    expect(component.name()).toBe('custom-name');

    const labelElement = fixture.debugElement.query(By.css('.form-group > label'));
    const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));

    expect(labelElement.nativeElement.textContent.trim()).toBe('Choose Option');
    radioInputs.forEach(radio => {
      expect(radio.nativeElement.name).toBe('custom-name');
    });
  });
});
