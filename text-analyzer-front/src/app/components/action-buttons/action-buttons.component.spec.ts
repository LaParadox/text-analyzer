import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ActionButtonsComponent } from './action-buttons.component';

describe('ActionButtonsComponent', () => {
  let component: ActionButtonsComponent;
  let fixture: ComponentFixture<ActionButtonsComponent>;
  let buttonElement: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionButtonsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default label', () => {
    expect(buttonElement.textContent?.trim()).toBe('Primary Action');
  });

  it('should display custom label', () => {
    fixture.componentRef.setInput('primaryLabel', 'Analyze Text');
    fixture.detectChanges();

    expect(buttonElement.textContent?.trim()).toBe('Analyze Text');
  });

  it('should be enabled by default', () => {
    expect(buttonElement.disabled).toBe(false);
    expect(component.primaryDisabled()).toBe(false);
  });

  it('should disable button when primaryDisabled is true', () => {
    fixture.componentRef.setInput('primaryDisabled', true);
    fixture.detectChanges();

    expect(buttonElement.disabled).toBe(true);
  });

  it('should emit primaryAction when button is clicked', () => {
    spyOn(component.primaryAction, 'emit');

    buttonElement.click();

    expect(component.primaryAction.emit).toHaveBeenCalled();
  });

  it('should not emit primaryAction when button is disabled and clicked', () => {
    spyOn(component.primaryAction, 'emit');
    fixture.componentRef.setInput('primaryDisabled', true);
    fixture.detectChanges();

    buttonElement.click();

    expect(component.primaryAction.emit).not.toHaveBeenCalled();
  });

  it('should have correct CSS classes applied', () => {
    const formActionsElement = fixture.debugElement.query(By.css('.form-actions'));

    expect(formActionsElement).toBeTruthy();
    expect(buttonElement.classList.contains('analyze-btn')).toBe(true);
  });
});
