import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TextAreaInputComponent } from './text-area-input.component';

describe('TextAreaInputComponent', () => {
  let component: TextAreaInputComponent;
  let fixture: ComponentFixture<TextAreaInputComponent>;
  let textareaElement: HTMLTextAreaElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextAreaInputComponent, FormsModule, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TextAreaInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    textareaElement = fixture.debugElement.query(By.css('textarea')).nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.value()).toBe('');
    expect(component._disabled()).toBe(false);
    expect(component.rows()).toBe(4);
  });

  it('should update value when text is entered', () => {
    const testText = 'Hello, World!';

    textareaElement.value = testText;
    textareaElement.dispatchEvent(new Event('input'));

    expect(component.value()).toBe(testText);
  });

  it('should call onChange and onTouched callbacks on input', () => {
    spyOn(component, 'onChange');
    spyOn(component, 'onTouched');

    textareaElement.value = 'Test input';
    textareaElement.dispatchEvent(new Event('input'));

    expect(component.onChange).toHaveBeenCalledWith('Test input');
    expect(component.onTouched).toHaveBeenCalled();
  });

  it('should disable textarea when setDisabledState is true', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    expect(textareaElement.disabled).toBe(true);
    expect(component._disabled()).toBe(true);
  });

  it('should implement writeValue correctly', () => {
    component.writeValue('Test value');
    fixture.detectChanges();

    expect(component.value()).toBe('Test value');
    expect(textareaElement.value).toBe('Test value');
  });

  it('should handle null/undefined writeValue gracefully', () => {
    component.writeValue(null as any);
    expect(component.value()).toBe('');

    component.writeValue(undefined as any);
    expect(component.value()).toBe('');
  });

  it('should work with reactive forms', () => {
    const formControl = new FormControl('Initial');

    component.registerOnChange((value: string) => formControl.setValue(value));
    component.writeValue(formControl.value as any);

    expect(component.value()).toBe('Initial');

    textareaElement.value = 'Updated';
    textareaElement.dispatchEvent(new Event('input'));

    expect(formControl.value).toBe('Updated');
  });

  it('should accept custom input properties', () => {
    fixture.componentRef.setInput('label', 'Description');
    fixture.componentRef.setInput('placeholder', 'Enter text...');
    fixture.componentRef.setInput('rows', 8);
    fixture.detectChanges();

    expect(component.label()).toBe('Description');
    expect(component.placeholder()).toBe('Enter text...');
    expect(component.rows()).toBe(8);
    expect(textareaElement.rows).toBe(8);
    expect(textareaElement.placeholder).toBe('Enter text...');
  });
});
